<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="()=>{this.$router.go(-1)}"/>
    <van-field v-model="form.type" clearable label="服务类型" disabled="true">
      <van-button slot="button" size="small" type="primary" @click="selectType">切换</van-button>
    </van-field>
    <van-radio-group v-model="radioValue" v-if="radio==1?true:false">
      <van-cell
        title="手机信息"
        clickable
        @click="radioValue = item.id"
        v-for="(item,index) in phoneList"
        :key="item.index"
      >
        <template slot="label">
          <p>{{item.modelName}}</p>
          <p>{{item.imei}}</p>
          <p>{{item.endTime}}</p>
        </template>
        <van-radio :name="item.id" checked-color="#07c160"/>
      </van-cell>
    </van-radio-group>
    <van-cell v-else>
      <van-field placeholder="请输入IMEI码" label="IMEI" v-model.trim="imei">
        <template slot="right-icon">
          <van-icon name="scan" @click="openSao"></van-icon>
        </template>
      </van-field>
    </van-cell>
    <van-dialog v-model="show" title="服务类型" confirmButtonColor="#07c160">
      <div>
        <van-radio-group v-model="radio" checked-color="#07c160">
          <van-cell-group>
            <van-cell title="直接选择手机型号" clickable @click="radio = '1',form.type='直接选择手机型号'">
              <van-radio checked-color="#07c160" name="1"/>
            </van-cell>
            <van-cell title="手动输入IMEI码" clickable @click="radio = '2',form.type='手动输入IMEI码'">
              <van-radio checked-color="#07c160" name="2"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-dialog>
    <div class="footerBtn" style="margin-top:10px">
      <van-button type="primary" size="large" round @click="next" :disabled="nextDisabled">下一步</van-button>
      <div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created(){
     this.loadingWeiXin();
  },
  mounted() {
    let path = this.$route.query.type;
    if (path) {
      this.title = "申请维修";
    } else {
      this.title = "申请退换";
    }
    this.getPhoneList();
  },
  data() {
    return {
      phoneList: [],
      imei: "",
      form: {
        type: "直接选择手机型号"
      },
      radio: "1",
      title: "",
      show: false,
      radioValue: "",
      reqScan:""
    };
  },
  computed:{
    nextDisabled:function(){
      if(this.form.type == "直接选择手机型号"){
        if(this.radioValue) return false;
        else return true;
      }else{
        if(this.imei) return false;
        else return true;
      }
    }
  },
  methods: {
    // 获取手机列表
    getPhoneList() {
      // 这里根据 是否带有路由参数判断手机列表信息 有参数表示申请维修，否则就是申请退换
      let path = this.$route.query.type;
      let url;
      if(path){
        url = `spx/order/listValid/${sessionStorage.getItem('userId')}`;
      }else{
        url = `spx/order/listMyValid/${sessionStorage.getItem('userId')}`
      }
      this.$get(url).then(res => {
        console.log("res", res);
        if (res.code == 1) {
          this.phoneList = res.data;
        } else {
          this.$toast(res.msg);
        }
      });
    },
    // 选择维修方式
    selectType() {
      // this.nextDisabled = true;
      this.show = true;
    },
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
    // 微信扫一扫
    openSao(){
      this.$wechatInterface(this.reqScan,
      res=>{
        const getCode = res.resultStr.split(','); // 当needResult 为 1 时，扫码返回的结果
                  if(getCode.length == 1){
                      this.imei = getCode[0];
                  }else{
                      this.imei = getCode[1];
                  }
      },
      error=>{
        alert(error);
      },
      'scan')
    },
    // 下一步
    next() {
      let path = this.$route.query.type;
      // 这里根据 是否带有路由参数判断跳转的页面 有参数表示申请维修，否则就是申请退换
      if (path) {
        let params;
        // 判断用户是用那种方式申请维修手机
        if (this.form.type == "直接选择手机型号") {
          params = {
            userId: sessionStorage.getItem('userId'),
            orderInfoId: this.radioValue
          };
        } else {
          params = {
            userId: sessionStorage.getItem('userId'),
            imei: this.imei
          };
        }
        this.$post("spx/repairOrder/valid", params).then(res => {
          if (res.code == 1) {
            console.log("res", res);
            this.$router.push({
              path: "/applicationMaintenance",
              query: {
                id: res.data.id,
                imei: this.imei
              }
            });
          } else {
            this.$toast(res.msg);
          }
        });
      }
      // 跳转申请退换机页面
      else {
        let params;
        // 判断用户是用那种方式申请维修手机
        if (this.form.type == "直接选择手机型号") {
          params = {
            userId: sessionStorage.getItem('userId'),
            orderInfoId: this.radioValue
          };
        } else {
          params = {
            userId: sessionStorage.getItem('userId'),
            imei: this.imei
          };
        }
        this.$post("spx/order/valid", params).then(res => {
          if (res.code == 1) {
            console.log(this.imei,'wode')
            console.log("res", res);
            this.$router.push({
              path: "/applicationRorRefund",
              query: {
                id: res.data.id,
                type: res.data.modelName,
                imei: this.imei,
              }
            });
          } else {
            this.$toast(res.msg);
          }
        });
      }
    }
  },

};
</script>

<style lang="less" scoped>
</style>
