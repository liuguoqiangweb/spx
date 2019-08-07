<template>
  <div>
    <van-nav-bar title="购买碎屏险" left-text="返回" left-arrow @click-left="()=>{this.$router.go(-1)}"/>
    <van-cell-group title="提交信息">
      <van-field
        v-model="form.phoneType"
        disabled
        required
        label="手机型号"
        placeholder="请选择手机型号"
        v-validate="'required'"
        name="phoneType"
        :error-message="errors.first('phoneType')"
      >
        <van-button slot="button" size="small" type="primary" @click="openPopup">选择</van-button>
      </van-field>
      <van-field
        v-model.trim="form.imei"
        required
        clearable
        label="IMEI"
        placeholder="请输入IMEI"
        v-validate="'required'"
        name="imei"
        :error-message="errors.first('imei')"
      >
        <template slot="right-icon">
          <van-icon name="scan" @click="openSao(1)"></van-icon>
        </template>
      </van-field>
      <van-field v-model="form.invitationCode" 
      label="邀请码" 
      placeholder="请输入邀请码"
      clearable
      required
      v-validate="'required'"
      name="invitationCode" 
      :error-message="errors.first('invitationCode')"
      >
        <template slot="right-icon">
          <van-icon name="scan" @click="openSao(2)"></van-icon>
        </template>
      </van-field>
      <van-field
        v-model="form.username"
        label="姓名"
        placeholder="请输入姓名"
        required
        v-validate="'required'"
        name="username"
        :error-message="errors.first('username')"
      />
      <van-field
        v-model="form.idCard"
        label="身份证"
        placeholder="请输入身份证"
        required
        v-validate="'required|idCard'"
        name="idCard"
        :error-message="errors.first('idCard')"
      />
      <van-field
        v-model="form.phone"
        label="手机号"
        placeholder="请输入手机号"
        required
        v-validate="'required|mobile'"
        name="phone"
        :error-message="errors.first('phone')"
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          :disabled="btnDisabled"
          @click="sendCodeMethods"
        >{{sendCode}}</van-button>
      </van-field>
      <van-field
        v-model="form.yanZhengMa"
        center
        clearable
        required
        label="短信验证码"
        placeholder="请输入短信验证码"
      />
    </van-cell-group>
    <van-radio-group v-model="radioValue">
      <van-cell-group title="支付信息">
        <van-cell title="微信支付" clickable @click="radioValue = '1'">
          <van-radio checked-color="#07c160" name="1"/>
        </van-cell>
        <van-cell title="代支付" clickable @click="radioValue = '2'">
          <van-radio checked-color="#07c160" name="2"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div class="xieYi">
      <van-icon
        tag="div"
        name="certificate"
        :class="[isActiveIcon?newColorClass:oldColorClass]"
        @click="confirmXieYi"
      />
      <div class="confirm">
        我确认投保手机设备屏幕完好，我确认并同意
        <span @click="clause">《碎屏保条款》</span>
      </div>
    </div>
    <div class="footerBtn">
      <van-button
        type="primary"
        size="large"
        round
        @click="submitOrder"
        :disabled="submitDisabled"
      >提交订单</van-button>
    </div>
    <!-- 手机信息列表 -->
    <van-dialog v-model="show" title="选择手机型号" confirmButtonColor="#07c160" @confirm="selectPhone">
      <van-search v-model="searchVal" placeholder="请输入你要查询的手机型号" show-action>
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div class="heightSize">
        <van-card
          @click="radio = item.modelName,form.id = item.id"
          v-for="(item,index) in list"
          :key="item.title"
          :price="item.modelWhim"
          :title="item.modelName"
          :thumb="item.modelPic"
        >
          <template slot="num">
            <van-radio-group v-model="radio">
              <van-cell clickable style="background:#fafafa">
                <van-radio checked-color="#07c160" :name="item.modelName"/>
              </van-cell>
            </van-radio-group>
          </template>
        </van-card>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitDisabled: true,
      radio: "",
      // 手机型号
      list: [],
      sendCode: "发送验证码",
      newList: [],
      userId: 2,
      backgroundColorClass: "addBackgroundColor",
      newColorClass: "newColor",
      oldColorClass: "oldColor",
      form: {
        id: "",
        yanZhengMa: "",
        imei: "",
        username: "",
        idCard: "",
        invitationCode: "",
        phone: "",
        phoneType: ""
      },
      show: false,
      btnDisabled: false,
      checked: false,
      searchVal: "",
      isActive: -1,
      isActiveIcon: false,
      radioValue: '1',
      colorClass: "inherit",
      reqScan:""
    };
  },
  computed: {},
  mounted(){
      this.loadingWeiXin();
      this.getFormData();
  },
  methods: {
    // 加载微信sdk
    loadingWeiXin(){
      let url = window.location.href;
      console.log(url);
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
    // 判断缓存是否有值
    getFormData(){
      let formData = sessionStorage.getItem('formData');
      let newFormData = JSON.parse(formData);
      if(newFormData){
        for(var key in newFormData){
          this.form[key] = newFormData[key]
        }
        this.isActiveIcon = true;
        this.submitDisabled = false;
        console.log(this.form,'999');
      }
    },
    //   打开手机型号弹框
    openPopup() {
      if(this.list.length == 0){
        this.$get("base/modelInfo/list", {}).then(res => {
        console.log("res", res);
        if (res.code == 1) {
          this.list = res.data;
          this.newList = res.data;
        }
      });
      }
      
      this.show = true;
      this.newList = this.list;
    },
    // 选择手机型号
    selectPhone() {
      this.form.phoneType = this.radio;
      console.log(this.radio, "radio");
    },
    // 打开扫一扫
    openSao(number) {
      this.$wechatInterface(this.reqScan,
      res=>{
        const getCode = res.resultStr.split(','); // 当needResult 为 1 时，扫码返回的结果
                  if(getCode.length == 1){
                    if(number == 1){
                      this.form.imei = getCode[0];
                    }else{
                      this.form.invitationCode = getCode[0];
                    }
                  }else{
                    if(number == 1){
                      this.form.imei = getCode[1];
                    }else{
                      this.form.invitationCode = getCode[1];
                    }
                  }
      },
      error=>{
        alert(error);
      },
      'scan')
    },
    // 发送验证码
    sendCodeMethods() {
      this.$validator.validate("phone").then(result => {
        if (result) {
          const number = 60;
          this.btnDisabled = true;
          this.sendCode = number + "s";
          let code = number;
          let timer = setInterval(() => {
            if (code > 0 && code <= number) {
              code--;
              this.sendCode = code + "s";
            } else {
              this.btnDisabled = false;
              this.sendCode = "重获取验证码";
              clearInterval(timer);
              timer = null;
            }
          }, 1000);
          this.$get("base/sms/send", {
            phone: this.form.phone,
            type: 1,
            userId: sessionStorage.getItem('userId')
          }).then(res => {
            this.$toast(res.msg);
          });
        }
      });
    },
    // 选择手机添加样式
    addClassMethods(index) {
      this.isActive = index;
    },
    // 搜索手机型号
    onSearch() {
      if(this.searchVal){
        let searchVal = this.searchVal.replace(
        this.searchVal[0],
        this.searchVal[0].toUpperCase()
      );
      console.log(this.newList);
      let result = this.newList.filter(
        value => value.modelName.indexOf(searchVal) !== -1
      );
      this.list = result;
      }else{
        this.$toast("请输入你要查询的手机型号");
        this.list = this.newList;
      }
      
    },
    // 提交订单
    submitOrder() {
      // 验证
      this.$validator.validateAll().then(result => {
        if (result) {
          if(this.radioValue == 2){
            sessionStorage.setItem("share",true);
          }else{
            sessionStorage.removeItem("share");
          }
          this.$toast.loading({
            mask:true,
            message:"提交中......",
            duration:0
          })
          //提交
          this.$post("spx/order", {
            userId: sessionStorage.getItem('userId'),
            guideTel: this.form.invitationCode,
            imei: this.form.imei,
            name: this.form.username,
            idCardNumber: this.form.idCard,
            phoneNumber: this.form.phone,
            modelId: this.form.id,
            phoneCode: this.form.yanZhengMa,
            meTradeType: this.radioValue
          })
            .then(res => {
              console.log(res, "res");
              if (res.code == 1) {
                this.$toast.clear();
                let data = JSON.parse(res.data.myOrderInfo);
                this.$router.push({
                  path: "/order",
                  query: { id: data.id, payType: this.radioValue }
                });
              } else {
                this.$toast(res.msg);
              }
            })
            .catch(error => {});
        }
      });
    },

    // 同意协议
    confirmXieYi() {
      this.isActiveIcon = !this.isActiveIcon;
      this.submitDisabled = !this.isActiveIcon;
    },
    // 打开条款
    clause(){
      
      let form = JSON.stringify(this.form);
      sessionStorage.setItem("formData",form);
      this.$router.push({path:'clause'})
    }
  }
};
</script>

<style lang="less" scoped>
.van-card__content {
  justify-content: center;
}
.heightSize {
  height: 350px;
  overflow: scroll;
}
.addBackgroundColor {
  background-color: #35d4be;
}
.sumbitInfo {
  font-size: 18px;
  font-family: "微软雅黑";
  font-weight: bold;
  padding: 10px;
}
.xieYi {
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .confirm {
    margin-left: 8px;
    font-family: "MicrosoftYaHeiLight [Regular]";
    font-size: 14px;
    text-align: center;
    width: 60%;
    text-align: left;
    span {
      color: #35d4be;
    }
  }

  // margin: 20px auto;
}
.newColor {
  font-size: 20px;
  color: #35d4be;
}
.oldColor {
  font-size: 20px;
  color: inherit;
}
.van-dialog {
  top: 300px;
  transition: none;
}
</style>