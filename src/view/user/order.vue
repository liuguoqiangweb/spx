<template>
  <div>
    <!-- <van-nav-bar title="订单确认" left-text="返回" left-arrow @click-left="onClickLeft"/> -->
    <van-cell-group>
      <van-cell title="订单号" :value="modelInfo.insuranceCard"/>
      <van-cell title="支付状态" value="未支付"/>
      <van-cell title="手机IMEI" :value="modelInfo.imei"/>
      <van-cell title="手机型号" :value="modelInfo.modelName"/>
      <van-cell title="保费" :value="modelInfo.price"/>
      <van-cell title="邀请码" value/>
      <van-cell title="订单日期" :value="modelInfo.createTime"/>
    </van-cell-group>
    <div div class="footerBtn">
      <van-button type="primary" size="large" round @click="pay">{{msg}}</van-button>
    </div>
    <van-dialog v-model="show" confirmButtonColor="#07c160" :showConfirmButton="false" :closeOnClickOverlay="true" className="dialogBg"> 
      <img src="../../assets/img/share.png" alt width="100%" height="100%" @click="show = false">
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      modelInfo: {
        id: "",
        insuranceCard: "",
        modelName: "",
        imei: "",
        price: "",
        createTime: ""
      },
      msg: "立即支付",
      reqShare: "",
      reqPay: "",
      money: "",
      payType:""
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    // 返回上个页面
    onClickLeft() {
      this.$router.go(-1);
    },
    // 订单基本信息
    getOrder() {
      let id = this.$route.query.id;
      this.$get(`spx/order/infoid/${id}`).then(res => {
        if (res.code == 1) {
          console.log(res.data, "订单id");
          this.payType = res.data.spxOrderPay.meTradeType;
          this.modelInfo = {
            insuranceCard: res.data.insuranceCard,
            modelName: res.data.modelName,
            imei: res.data.imei,
            price: res.data.modelInfo.modelPrice,
            createTime: res.data.createTime,
            id: res.data.id
          };
          // 判断是立即支付还是分享
          let share = sessionStorage.getItem("share");
          if (share) {
            this.msg = "分享";
            this.loadingWeiXinShare(share);
          } else {
            this.msg = "立即支付";
            this.loadingWeiXinPay();
          }
        }
      });
    },
    // 加载微信分享
    loadingWeiXinShare(share) {
      console.log("分享");
      let url = location.href;
      url = encodeURIComponent(url);
      this.$post("/weixin/jsconfig", {
        url: url
      }).then(res => {
        let result = res.data;
        console.log("result", result);
        this.reqShare = {
          appId: result.appId,
          timestamp: result.timestamp,
          nonceStr: result.nonceStr,
          signature: result.signature
        };
        this.$wechatInterface(this.reqShare, () => {
        }, () => {},'share');
      });
    },
    // 加载微信支付
    loadingWeiXinPay() {
      console.log("支付");
      let url = location.href;
      url = encodeURIComponent(url);
      let id = this.modelInfo.id;
      this.$post("/spx/order/jsapi", {
        orderInfoId: id,
        userId: sessionStorage.getItem("userId"),
        openid: sessionStorage.getItem("openId")
      }).then(res => {
        let result = res.data;
        if (result.myOrderInfo) {
          this.money = JSON.parse(result.myOrderInfo).spxOrderPay.money;
          console.log(this.money, "money");
        }
        this.reqPay = {
            appId: result.appId,
            timestamp: result.timeStamp,
            nonceStr: result.nonceStr,
            signature: result.signature,
            package: result.package,
            paySign: result.paySign,
            signType:result.signType
          };
         
        console.log("result", result);
      });
    },
    pay() {
      // 判断如果商品为零元的时候直接支付成功，否则走立即支付
        let payType = this.$route.query.payType;
        let share = sessionStorage.getItem("share");
      if (!share) {
        if (this.money == 0) {
          this.$router.push({path:"/paySuccess",query:{payType:this.payType}});
          
        } else {
          // 立即支付
          this.$wechatInterface(
            this.reqPay,
            // 支付成功回调
            (res) => {
              console.log("支付成功页");
              this.$router.push({path:"/paySuccess",query:{payType:this.payType}});
            },
            // 支付失败回调
            (error) => {
              this.$toast("支付失败");
            },
            'pay'
          );
        }
      }
      // 分享
      else {
        this.show = true;
      }
    }
  }
};
</script>

<style lang="less" scopd>
.footerBtn {
  width: 100%;
  height: 110px;
  margin-top: 20px;
}
.dialogBg{
  background-color:transparent;
}
</style>
