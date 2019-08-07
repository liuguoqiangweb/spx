<template>
  <div>
    <van-nav-bar title="申请维修" left-text="返回" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <van-cell-group title="直接选择维修的手机">
      <van-field v-model="form.type" label="手机型号" disabled="true"></van-field>
      <van-field label="姓名" v-model="form.name" placeholder="请输入"></van-field>
      <van-field
        label="身份证"
        v-model="form.idCard"
        placeholder="请输入"
        required
        v-validate="'required|idCard'"
        name="idCard"
        :error-message="errors.first('idCard')"
      ></van-field>
      <van-field
        label="手机号"
        v-model="form.telephone"
        placeholder="请输入"
        required
        v-validate="'required|mobile'"
        name="telephone"
        :error-message="errors.first('telephone')"
      ></van-field>
      <van-field label="其他联系方式" v-model="form.otherTelephone" placeholder="请输入"></van-field>
      <van-field
        disabled
        label="收件地址"
        v-model="form.receivingAddress"
        placeholder="请选择"
        required
        v-validate="'required'"
        name="receivingAddress"
        :error-message="errors.first('receivingAddress')"
      >
      <template slot="right-icon">
          <van-icon name="ellipsis" @click="show = true"></van-icon>
        </template>
      </van-field>
      <van-popup position="bottom" v-model="show">
        <van-area :area-list="areaList" @confirm="getCofirmData" @cancel="show = false"></van-area>
      </van-popup>
      <van-field label="详细地址" v-model="form.detailedAddress" placeholder="请输入"
      required
        v-validate="'required'"
        name="detailedAddress"
        :error-message="errors.first('detailedAddress')"
      ></van-field>

      <van-cell v-if="radio==1?true:false">
        <template slot="default">
          <p class="uploadImg">上传图片</p>
          <div class="upload">
            <van-uploader :after-read="idCardOnRead" accept="image/*">
              <div class="imei">
                <img ref="idCardUrl">
              </div>
              <p class="text">身份证正面</p>
            </van-uploader>
            <van-uploader :after-read="idCardOnReadTwo" accept="image/*">
              <div class="imei">
                <img ref="idCardUrlTwo">
              </div>
              <p class="text">身份证反面</p>
            </van-uploader>
          </div>
          <div class="upload">
            <van-uploader :after-read="phoneOnRead" accept="image/*">
              <div class="imei">
                <img ref="phoneUrl">
              </div>
              <p class="text">碎屏手机正面</p>
            </van-uploader>
            <van-uploader :after-read="phoneOnReadTwo" accept="image/*">
              <div class="imei">
                <img ref="phoneUrlTwo">
              </div>
              <p class="text">碎屏手机反面</p>
            </van-uploader>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="footerBtn">
      <van-button type="primary" size="large" round @click="submitOrder">提交</van-button>
    </div>
  </div>
</template>

<script>
import province_list from '../../assets/area'
export default {
  mounted(){
    
    let repairId = this.$route.query.repairId;
    if(repairId){
      //完善信息
      this.$get(`spx/repairOrder/info/${repairId}`).then(response => {
        var responseData = response.data;
        this.repairInfo = responseData;
        console.log(this.repairInfo);
        this.form = {
          type : responseData.modelName,
          name : responseData.name,
          idCard : responseData.idCardNumber,
          telephone : responseData.phoneNumber,
          otherTelephone : responseData.contact
        }
        var addressArr = responseData.address;
        var arrs = addressArr.split(' ');
        if (arrs.length > 3) {
          this.form.receivingAddress = arrs[0] + ' ' + arrs[1] + ' ' + arrs[2]+ ' ';
          this.form.detailedAddress = arrs[3]
        }else{
          this.form.receivingAddress = arrs[0] + ' ' + arrs[1]+ ' ';
          this.form.detailedAddress = arrs[2]
        }
        this.$refs.idCardUrl.src = responseData.attachmentInfos[0].attachmentUrl;
        this.$refs.idCardUrlTwo.src = responseData.attachmentInfos[1].attachmentUrl;
        this.$refs.phoneUrl.src = responseData.attachmentInfos[2].attachmentUrl;
        this.$refs.phoneUrlTwo.src = responseData.attachmentInfos[3].attachmentUrl;

        // 更新图片时，上传的id
          for (let i in responseData.attachmentInfos) {
            this.ids.push(responseData.attachmentInfos[i].id);
          }
          console.log(this.ids,'ids');
      });
    }else{
      //申请维修
      let result = this.$route.query.id;
      if(result){
        this.$get(`spx/order/infoid/${result}`,{}).then(res=>{
          if(res.code == 1){
            console.log("维修单信息",res.data);
            this.form.type = res.data.modelName;
            this.form.name = res.data.name;
            this.form.idCard = res.data.idCardNumber;
            this.form.telephone = res.data.phoneNumber;
          }
        })
        
      }
      
    }
  },
  data() {
    return {
      ids:[],
      areaList:province_list,
      radioVal: "",
      form: {
        type:"",
        name:"",
        idCard:"",
        telephone:"",
        otherTelephone:"",
        receivingAddress:"",
        detailedAddress:"",

      },
      file:{
        idCardPositive:"",
        idCardBack:"",
        screenPositive:"",
        screenBack:"",
      },
      show: false,
      radio:"1",
      repairInfo:""
    };
  },
  methods: {
    // 返回上个页面
    onClickLeft() {
      this.$router.go(-1);
    },
    // 选择维修方式
    selectType() {
      this.show = true;
    },
    // 身份证正面-上传回调
    idCardOnRead(file) {
        console.log('file',file);
        this.$refs.idCardUrl.src = file.content;
        this.file.idCardPositive = file.file;
    },

    // 身份证反面-上传回调
    idCardOnReadTwo(file){
        this.$refs.idCardUrlTwo.src = file.content;
        this.file.idCardBack = file.file;
    },
    // 碎屏险正面-上传回调
    phoneOnRead(file) {
        this.$refs.phoneUrl.src = file.content;
        this.file.screenPositive = file.file;
    },
    // 碎屏险反面-上传回调
    phoneOnReadTwo(file){
        this.$refs.phoneUrlTwo.src = file.content;
        this.file.screenBack = file.file;
    },
    // 选择地区后点击完成触发
    getCofirmData(val){
      let address = "";
      val.map(item=>{
        address +=item.name + " ";
      })
      this.form.receivingAddress = address;
      this.show = false;
    },
    // 提交
    submitOrder(){
      this.$validator.validateAll().then(result=>{
        if(result){
          let params;
          //完善信息
          if(this.repairInfo.id){
            params = {
              id:this.repairInfo.id,
              orderInfoId:this.repairInfo.orderInfoId,
              userId:sessionStorage.getItem('userId'),
              imei:this.repairInfo.imei,
              name:this.form.name,
              idCardNumber:this.form.idCard,
              phoneNumber:this.form.telephone,
              contact:this.form.otherTelephone || "",
              address:this.form.receivingAddress + this.form.detailedAddress,
              selectType:false,
              }
              console.log(params,'params');
              this.$toast.loading({
                mask:true,
                message:"提交中......",
                duration:0
              })
          
          // 上传form表单 （直接选择手机方式）
          this.$post("spx/repairOrder/apply",params).then(res=>{
            if(res.code == 1){
                // 提交前判断是否上传了图片
                if (this.file.idCardPositive == "" && this.file.idCardBack == "" && this.file.screenPositive == "" && this.file.screenBack == "") {
                  this.$toast(res.msg);
                  this.$router.push({ path: "/policyInfo" });
                  return;
          }
              // 没有修改过图片把对应得id去掉
                let idArray = [];
                if (this.file.idCardPositive != "") {
                  idArray.push(this.ids[0]);
                } 
                 if (this.file.idCardBack != "") {
                  idArray.push(this.ids[1]);
                } 
                 if(this.file.screenPositive != ""){
                  idArray.push(this.ids[2]);
                }
                 if(this.file.screenBack != ""){
                  idArray.push(this.ids[3]);
                }

              console.log('idArray',idArray);
              // 上传完form表单数据后接着上传图片
              let fd = new FormData();
              fd.append('file',this.file.idCardPositive);
              fd.append('file',this.file.idCardBack);
              fd.append('file',this.file.screenPositive);
              fd.append('file',this.file.screenBack);
              fd.append('businessId', res.data);
              fd.append('attachmentType', 1);
              fd.append('attachmentNames', ['身份证正面','身份证反面','碎屏手机正面','碎屏手机反面']);
              fd.append("ids", idArray);
              let data = {
                businessId:res.data,
                attachmentType:1,
                attachmentNames:['身份证正面','身份证反面','碎屏手机正面','碎屏手机反面'],
                ids:idArray
              }
              this.$uploadPost('base/attachment/updateUpload',fd,data).then(res=>{
                if(res.code == 1){
                  this.$toast.clear();
                  this.$router.push({path:"/policyInfo"});
                }
              })
            }else{
              this.$toast(res.msg);
            }
            
          })

          }else{
            let imei = this.$route.query.imei;
            let id = this.$route.query.id;
            // 第一种方式(直接选择手机)
            if(!imei){
              params = {
              orderInfoId:id,
              userId:sessionStorage.getItem('userId'),
              imei:imei,
              name:this.form.name,
              idCardNumber:this.form.idCard,
              phoneNumber:this.form.telephone,
              contact:this.form.otherTelephone || "",
              address:this.form.receivingAddress + this.form.detailedAddress,
              selectType:true,
              }
            }
            // 第二种方式(手动输入IMEI码)
            else{
              params = {
                userId:sessionStorage.getItem('userId'),
                orderInfoId:this.$route.query.id,
                name:this.form.name,
                idCardNumber:this.form.idCard,
                phoneNumber:this.form.telephone,
                contact:this.form.otherTelephone || "",
                address:this.form.receivingAddress + this.form.detailedAddress,
                selectType:false,
                imei:imei
              }
            }
          console.log(params,'params');
          // 校验图片是否全部上传
          for(let i in this.file){
          if(this.file[i] == ""){
            this.$toast("请先上传图片");
            return;
          }
        }
          if(this.file.idCardPositive == "" )
          this.$toast.loading({
            mask:true,
            message:"提交中......",
            duration:0
          })
          // 上传form表单 （直接选择手机方式）
          this.$post("spx/repairOrder/apply",params).then(res=>{
            if(res.code == 1){
              console.log('res',res);
              // 上传完form表单数据后接着上传图片
              let fd = new FormData();
              fd.append('file',this.file.idCardPositive);
              fd.append('file',this.file.idCardBack);
              fd.append('file',this.file.screenPositive);
              fd.append('file',this.file.screenBack);
              fd.append('businessId', res.data);
              fd.append('attachmentType', 1);
              fd.append('attachmentNames', ['身份证正面','身份证反面','碎屏手机正面','碎屏手机反面']);
              let data = {
                businessId:res.data,
                attachmentType:1,
                attachmentNames:['身份证正面','身份证反面','碎屏手机正面','碎屏手机反面']
              }
              this.$uploadPost('base/attachment/upload',fd,data).then(res=>{
                if(res.code == 1){
                  this.$toast.clear();
                  this.$router.push({path:"/policyInfo"});
                }
              })
            }else{
              this.$toast(res.msg);
            }
            
          })


          }

          
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.sumbitInfo {
  font-size: 18px;
  font-family: "微软雅黑";
  font-weight: bold;
  padding: 10px;
}
.upload {
  margin: 10px 0;
  // margin-bottom: 35px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .imei {
    background: url('../../assets/img/upload.png') no-repeat center ;
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
