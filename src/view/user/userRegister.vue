<template>
  <div class="login">
    <div class="login_all">
      <div class="logo">
        <img src="../../assets/img/login.png" alt>
      </div>
      <van-field
        v-model="form.phone"
        label="手机号"
        placeholder="请输入手机号"
        v-validate="'required|mobile'"
        name="phone"
        :error-message="errors.first('phone')"
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          :disabled="btnDisabled"
          @click="sendMessage"
        >{{sendCode}}</van-button>
      </van-field>
      <van-field
        v-model="form.phoneCode"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        v-validate="'required'"
        name="phoneCode"
        :error-message="errors.first('phoneCode')"
      />
      <van-button type="primary" class="loginBtn" @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
import { getUrlParam } from '../../servers/request'
export default {
  data() {
    return {
      sendCode: "获取验证码",
      btnDisabled: false,
      form: {
        phone: "",
        phoneCode: ""
      },
      smsId: "100",
      userId: 2,
      jumpPath:""
    };
  },
  mounted(){
    // 登录完成获取即将跳转的路由 需要去除/
   this.jumpPath = getUrlParam('state').substr(1);
  },
  methods: {
    sendMessage() {
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
            type: 4,
            userId: 0
          }).then(res => {
            console.log("res", res);
            this.smsId = res.data;
            this.$toast(res.msg);
          });
        }
      });
    },
    // 登录
    login() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let openid = sessionStorage.getItem("openId");
          this.$post("spx/consumerInfo/login", {
            phone: this.form.phone,
            phoneCode: this.form.phoneCode,
            openid: openid,
            smsId: this.smsId
          }).then(res => {
            console.log(res, "res");
            if (res.code == 1) {
              sessionStorage.setItem('userId',(res.data.id));
              this.$router.push({ path:this.jumpPath });
            }else if(res.code == 98){
              this.$toast("当前微信已绑定手机号，请先解绑");
            }else{
              this.$toast(res.msg);
            }
          });
        }
      });
    },
    
  }
};
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}
.login_all {
  padding: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.submit {
  width: 90%;
  height: 42px;
}
.loginBtn {
  margin-top: 20px;
  width: 90%;
  background-color: #31c67d;
  text-align: center;
  line-height: 42px;
  color: #fff;
  border-radius: 5px;
}
.logo {
  margin-bottom: 50px;
}
</style>
