<template>
  <div>
    <van-cell-group title="提交信息">
      <van-field
        v-model="form.region"
        disabled
        label="地区"
        v-validate="'required'"
        name="region"
        :error-message="errors.first('region')"
      >
      </van-field>
      <van-field
        v-model="form.store"
        disabled
        label="门店"
        v-validate="'required'"
        name="store"
        :error-message="errors.first('store')"
      >
      </van-field>
      <van-field
        disabled
        v-model="form.name"
        label="姓名"
        v-validate="'required'"
        name="name"
        :error-message="errors.first('name')"
      />
      <van-field
        disabled
        v-model="form.phone"
        label="手机号"
        v-validate="'required|mobile'"
        name="phone"
        :error-message="errors.first('phone')"
      >
      </van-field>
      <van-field
        disabled
        v-model="form.invitationCode"
        center
        clearable
        label="邀请码"
      />
    </van-cell-group>
    
    <div class="footerBtn">
    <div id="qrcode" class="qrcode"></div>
      <van-button
        type="primary"
        size="large"
        round
        @click="back"
      >重新生成二维码</van-button>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      form: {
        region: "",
        store: "",
        name: "",
        phone: "",
        invitationCode: "",
      },
      btnDisabled: false,
      sendCode: "发送验证码",
      show: false,
      list:[],
      searchVal:""
    };
  },
  mounted(){

      this.getData();
      
  },
  methods: {
    // 加载生成得二维码
    qrCode(value){
        let qrcode = new QRCode("qrcode",{
            width:100,
            height:100,
            text:value
        })
        console.log(this.form.verificationCode);
    },
    // 获取导购信息
    getData(){
      let userId = sessionStorage.getItem("userId");
      this.$get(`spx/guideInfo/info/${userId}`,{}).then(res=>{
        if(res.code == 1){
        console.log(res);
        let data = res.data;
        this.form = {
          region:data.regionName,
          store:data.storeName,
          name:data.guideName,
          phone:data.guideTel,
          invitationCode:data.guideInvitationId
        };
        this.qrCode(data.guideInvitationId);
        }else{
          this.$toast(res.msg);
        }
      })
    },
    // 重新生成二维码
    back(){
    this.$router.push('/guideRegister')
    }
  }
};
</script>

<style lang="less">
.qrcode{
    img{
    margin: 0 auto;
    margin-bottom: 20px;
}
}

</style>
