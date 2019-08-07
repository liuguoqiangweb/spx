<template>
  <div>
    <van-nav-bar title="申请退换" left-text="返回" left-arrow @click-left="()=>{this.$router.go(-1)}"/>
    <van-cell-group>
      <div>
        <van-card
          :desc="phoneInfo.desc"
          :title="phoneInfo.title"
          :price="phoneInfo.price"
          :thumb="phoneInfo.thumb"
        ></van-card>
      </div>
      <van-field v-model="form.type" clearable label="服务类型" disabled="true">
        <van-button slot="button" size="small" type="primary" @click="selectType" :disabled="switchDisabled">切换</van-button>
      </van-field>
      <van-cell title="保单号" :value="value"></van-cell>
      <van-field
        label="新机IMEI"
        placeholder="请输入"
        v-model="newImei"
        v-if="radio == 1"
        v-validate="'required'"
        name="newImei"
        :error-message="errors.first('newImei')"
        required
      >
      <template slot="right-icon">
          <van-icon name="scan" @click="openSao"></van-icon>
        </template>
      </van-field>
      <van-cell v-if="radio==1?true:false">
        <template slot="default">
          <p class="uploadImg">上传图片</p>
          <div class="upload">
            <van-uploader :after-read="changeOnRead" accept="image/*">
              <div class="imei">
                <img ref="changeImgUrl">
              </div>
              <p class="text">换机证明照</p>
            </van-uploader>
            <van-uploader :after-read="newOnRead" accept="image/*">
              <div class="imei">
                <img ref="newImgUrl">
              </div>
              <p class="text">新机IMEI号</p>
            </van-uploader>
          </div>
        </template>
      </van-cell>
      <van-cell v-else>
        <template slot="default">
          <p class="uploadImg">上传图片</p>
          <div class="upload">
            <van-uploader :after-read="changeTwoOnRead" accept="image/*">
              <div class="imei">
                <img ref="changeTwoImgUrl">
              </div>
              <p class="text">换机证明照</p>
            </van-uploader>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="footerBtn">
      <van-button type="primary" size="large" round @click="submitOrder">提交</van-button>
    </div>
    <van-dialog v-model="show" title="服务类型" confirmButtonColor="#07c160">
      <div>
        <van-radio-group v-model="radio" checked-color="#07c160">
          <van-cell-group>
            <van-cell title="换机" clickable @click="radio = '1',form.type='换机'">
              <van-radio checked-color="#07c160" name="1"/>
            </van-cell>
            <van-cell
              title="退机"
              clickable
              @click="radio = '2',form.type='退机'"
              v-if="!this.$route.query.imei"
            >
              <van-radio checked-color="#07c160" name="2"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      switchDisabled:false,
      phoneInfo: "",
      form: {
        type: "换机"
      },
      show: false,
      radio: "1",
      newImei: "",
      value: "",
      ids: [],
      infoFlag:false,
      file: {
        prove: "",
        imei: ""
      },
      reqScan:""
    };
  },
  mounted() {
    this.loadingWeiXin();
    this.getOrder();
    this.switchDisabled = false;
    // 路由包含newId参数表示 是完善信息 否则就是填写换机单信息
    if (this.$route.query.newId) {
      this.getImei();
    }
  },
  methods: {
    // 获取手机图片，价格，标题等等
    getOrder() {
      let id = this.$route.query.id;
      this.$get(`spx/order/infoid/${id}`).then(res => {
        if (res.code == 1) {
          console.log(res.data, "data");
          this.phoneInfo = {
            title: res.data.modelName,
            price: res.data.spxOrderPay.money,
            thumb: res.data.modelInfo.modelPic,
            desc: res.data.imei
          };
          this.value = res.data.insuranceCard;
          console.log(this.list, "list");
        }
      });
    },
    // 获取换机单IMEI码信息
    getImei() {
      let newId = this.$route.query.newId;
      this.$get(`spx/change/info/${newId}`, {
        changeId: newId
      }).then(res => {
        console.log(res, "res");
        if (res.code == 1) {
          this.newImei = res.data.newImei;
          // 切换按钮禁用
          this.switchDisabled = true;
          console.log(this.$refs.changeImgUrl);
          // 如果后台没有返回图片地址，则在提交时要上传所有的图片
          if(res.data.attachmentInfos.length == 0){
              this.infoFlag = true;
          }else{
            this.$refs.changeImgUrl.src = res.data.attachmentInfos[0].attachmentUrl;
            this.$refs.newImgUrl.src = res.data.attachmentInfos[1].attachmentUrl;
          // 更新图片时，上传的id
            for (let i in res.data.attachmentInfos) {
              this.ids.push(res.data.attachmentInfos[i].id);
            }
          console.log(this.ids);
          }
          
        }
      });
    },
    // 加载微信sdk
    loadingWeiXin(){
      let url = encodeURIComponent(window.location.href);
      this.$post("/weixin/jsconfig", {
        url: url
      }).then(res => { 
        console.log(res, "res");
        // res 返回的签名等数据
        let data = res.data;
        console.log(data,'data');
        this.reqScan = {
          appId: data.appId, // 必填,公众号的唯一标识
          timestamp: data.timestamp, // 必填,生成签名的时间戳
          nonceStr: data.nonceStr, // 必填,生成签名的随机串
          signature: data.signature, // 必填,签名
        }
      });
    },
    // 微信扫一扫
    openSao(){
      this.$wechatInterface(this.reqScan,
      res=>{
        const getCode = res.resultStr.split(','); // 当needResult 为 1 时，扫码返回的结果
                  if(getCode.length == 1){
                      this.newImei = getCode[0];
                  }else{
                      this.newImei = getCode[1];
                  }
      },
      error=>{
        alert(error);
      },
      'scan')
    },
    // 选择维修方式
    selectType() {
      this.show = true;
    },
    // 换机证明-上传回调
    changeOnRead(file) {
      this.$refs.changeImgUrl.src = file.content;
      this.file.prove = file.file;
    },
    // 新机IMEI-上传回调
    newOnRead(file) {
      this.$refs.newImgUrl.src = file.content;
      this.file.imei = file.file;
    },
    // 换机证明Two-上传回调
    changeTwoOnRead(file) {
      this.$refs.changeTwoImgUrl.src = file.content;
      this.file.imei = file.file;
    },
    // 提交
    submitOrder() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // 完善资料
          if (this.$route.query.newId) {
            let params;
            // 第一种方式(直接选择手机)
            params = {
              id: this.$route.query.newId,
              orderInfoId: this.$route.query.id,
              userId: sessionStorage.getItem("userId"),
              newImei: this.newImei,
              selectType: true
            };

            this.$toast.loading({
              mask: true,
              message: "提交中......",
              duration:0
            });
            // 上传form表单 （直接选择手机方式）
            this.$post("spx/change/fail", params).then(res => {
              if (res.code == 1) {
                // 提交前判断是否上传了图片
                if (this.file.prove == "" && this.file.imei == "") {
                  this.$toast(res.msg);
                  this.$router.push({ path: "/policyInfo" });
                  return;
                }
                // 当后台没有返回值得时候需要重新上传所有图片
                if(this.infoFlag){
                  if (this.file.prove == "" || this.file.imei == "") {
                  this.$toast("请先上传图片");
                  return;
                }
                }
                // 没有修改过图片把对应得id去掉
                let idArray = [];
                if (this.file.prove != "") {
                  idArray.push(this.ids[0]);
                } 
                if (this.file.imei != "") {
                  idArray.push(this.ids[1]);
                }


                console.log(this.ids, "this.ids");
                console.log("res", res);
                // 上传完form表单数据后接着上传图片
                let fd = new FormData();
                fd.append("file", this.file.prove);
                fd.append("file", this.file.imei);
                fd.append("businessId", res.data);
                fd.append("attachmentType", 3);
                fd.append("attachmentNames", ["换机证明照", "新机IMEI号"]);
                fd.append("ids", idArray);
                let data = {
                  businessId: res.data,
                  attachmentType: 3,
                  attachmentNames: ["换机证明照", "新机IMEI号"],
                  ids:idArray
                };

                this.$uploadPost("base/attachment/updateUpload", fd, data).then(
                  res => {
                    if (res.code == 1) {
                      this.$toast.clear();
                      this.$router.push({ path: "/policyInfo" });
                    }
                  }
                );
              } else {
                this.$toast(res.msg);
              }
            });
          } else {
            let imei = this.$route.query.imei;
            let id = this.$route.query.id;
            let params;
            // 第二种方式(手动输入IMEI码)
            if (imei) {
              params = {
                orderInfoId: id,
                userId: sessionStorage.getItem("userId"),
                imei: imei,
                newImei: this.newImei,
                selectType: false
              };
            }
            // 第一种方式(直接选择手机)
            else {
              params = {
                orderInfoId: id,
                userId: sessionStorage.getItem("userId"),
                imei: imei,
                newImei: this.newImei,
                selectType: true
              };
            }
            // 申请换机
            if (this.radio == 1) {
              // 提交前判断是否上传了图片
              if (this.file.prove == "" || this.file.imei == "") {
                this.$toast("请先上传图片");
                return;
              }
              this.$toast.loading({
                mask: true,
                message: "提交中......",
                duration:0
              });
              // 上传form表单 （直接选择手机方式）
              this.$post("spx/change/apply", params).then(res => {
                if (res.code == 1) {
                  console.log("res", res);
                  // 上传完form表单数据后接着上传图片
                  let fd = new FormData();
                  fd.append("file", this.file.prove);
                  fd.append("file", this.file.imei);
                  fd.append("businessId", res.data);
                  fd.append("attachmentType", 3);
                  fd.append("attachmentNames", ["换机证明照", "新机IMEI号"]);
                  let data = {
                    businessId: res.data,
                    attachmentType: 3,
                    attachmentNames: ["换机证明照", "新机IMEI号"]
                  };
                  this.$uploadPost("base/attachment/upload", fd, data).then(
                    res => {
                      if (res.code == 1) {
                        this.$toast.clear();
                        this.$router.push({ path: "/policyInfo" });
                      }
                    }
                  ).catch(error=>{
                    alert(error);
                  });
                } else {
                  this.$toast(res.msg);
                }
              });
            }
            // 申请退机
            else {
              // 提交前判断是否上传了图片
              if (this.file.imei == "") {
                this.$toast("请先上传图片");
                return;
              }
              this.$toast.loading({
                mask: true,
                message: "提交中......",
                duration:0
              });
              //  获取换机单id接口
              this.$post("/spx/refund", {
                userId: sessionStorage.getItem("userId"),
                orderInfoId: this.$route.query.id
              }).then(res => {
                if (res.code == 1) {
                  // 上传图片接口
                  let fd = new FormData();
                  fd.append("file", this.file.imei);
                  fd.append("businessId", res.data);
                  fd.append("attachmentType", 4);
                  fd.append("attachmentNames", ["新机IMEI号"]);
                  let data = {
                    businessId: res.data,
                    attachmentType: 4,
                    attachmentNames: ["新机IMEI号"]
                  };
                  this.$uploadPost("base/attachment/upload", fd, data).then(
                    res => {
                      if (res.code == 1) {
                        this.$toast.clear();
                        this.$router.push({ path: "/policyInfo" });
                      } else {
                        this.$toast(res.msg);
                      }
                    }
                  );
                } else {
                  this.$toast(res.msg);
                }
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .imei {
    background: url("../../assets/img/upload.png") no-repeat center;
    width: 100px;
    height: 100px;
    // border: 1px solid #dedede;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
    }
    .iconC {
      font-size: 50px;
      color: #dedede;
    }
  }
  .text {
    font-size: 12px;
    color: #969799;
    text-align: center;
  }
}

</style>
