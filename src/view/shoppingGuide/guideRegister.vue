<template>
  <div>
    <van-cell-group title="提交信息">
      <van-field
        v-model="form.regionNo"
        disabled
        required
        label="地区"
        placeholder="请选择地区"
        v-validate="'required'"
        name="regionNo"
        :error-message="errors.first('regionNo')"
      >
        <van-button slot="button" size="small" type="primary" @click="openPopup">选择</van-button>
      </van-field>

      <van-field
        v-model="form.storeNo"
        disabled
        required
        label="门店"
        placeholder="请选择门店"
        v-validate="'required'"
        name="storeNo"
        :error-message="errors.first('storeNo')"
      >
        <van-button slot="button" size="small" type="primary" @click="openPopupStore">选择</van-button>
      </van-field>

      <van-field
        v-model="form.name"
        label="姓名"
        placeholder="请输入姓名"
        required
        v-validate="'required'"
        name="name"
        :error-message="errors.first('name')"
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
        v-model="form.verificationCode"
        center
        clearable
        required
        label="短信验证码"
        placeholder="请输入短信验证码"
      />
    </van-cell-group>
    <div class="footerBtn">
      <van-button
        type="primary"
        size="large"
        round
        @click="submitCode"
      >生成二维码</van-button>
    </div>
    <!-- 地区列表 -->
    <van-dialog v-model="show" title="地区" confirmButtonColor="#07c160" @confirm="selectPhone">
      <!-- <van-search v-model="searchVal" placeholder="请输入你要查询的地区" show-action>
        <div slot="action" @click="onSearch">搜索</div>
      </van-search> -->
      <div class="heightSize">
        <van-radio-group v-model="radioDot" checked-color="#07c160">
          <van-cell-group>
            <van-cell v-for="(item,index) in list" :key="index" :title="item.areaInfoName + '-' + item.regionName " clickable @click="radioDot = item.regionNo,form.regionId= item.id,form.regionName = item.regionName" >
              <van-radio checked-color="#07c160" :name="item.regionNo"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-dialog>
    <!-- 门店列表 -->
    <van-dialog v-model="storeShow" title="地区" confirmButtonColor="#07c160" @confirm="form.storeNo = storeRadioDot">
      <van-search v-model="searchVal" placeholder="请输入你要查询的地区" show-action>
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div class="heightSize">
        <van-radio-group v-model="storeRadioDot" checked-color="#07c160">
          <van-cell-group>
            <van-cell v-for="(item,index) in storeList" :key="index" :title="item.regionName + '-' + item.storeName " clickable @click="storeRadioDot = item.storeNo,form.storeId = item.id,form.storeName = item.storeName" >
              <van-radio checked-color="#07c160" :name="item.storeNo"/>
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
      form: {
        regionId:"",
        regionNo: "",
        regionName:"",
        storeId:"",
        storeNo: "",
        storeName:"",
        name: "",
        phone: "",
        verificationCode: "",
        smsId:""
      },
      btnDisabled: false,
      sendCode: "发送验证码",
      show: false,
      storeShow:false,
      list:[],
      storeList:[],
      searchVal:"",
      radioDot:"",
      storeRadioDot:""
    };
  },
  methods: {
    // 打开地区
    openPopup() {
      this.$get("base/regionInfo/list",{}).then(res=>{
          console.log(res);
          if(res.code == 1){
              this.list = res.data;
          }
      })
      this.show = true;
    },
    // 打开门店
    openPopupStore() {
      this.$get("base/storeInfo/likeList",{
          regionNo:this.form.regionNo,
          storeName:this.searchVal
      }).then(res=>{
          console.log(res);
          if(res.code == 1){
              this.storeList = res.data;
          }
      })
      this.storeShow = true;
    },
    // 选择地区
    selectPhone() {
      this.form.regionNo = this.radioDot;
      this.form.storeNo = "";
      console.log(this.radio, "radio");
    },
    // 搜索地区
    onSearch() {
        this.openPopupStore();
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
            type: 2,
            userId: 0
          }).then(res => {
              if(res.code == 1){
                  console.log(res.data);
                  this.form.smsId = res.data;
              }
            this.$toast(res.msg);
          });
        }
      });
    },
    // 生成二维码
    submitCode(){
        this.$post("spx/guideInfo/add",{
            openid:sessionStorage.getItem("openId"),
            guideName:this.form.name,
            regionName:this.form.regionName,
            regionNo:this.form.regionNo,
            regionId:this.form.regionId,
            storeId:this.form.storeId,
            storeName:this.form.storeName,
            storeNo:this.form.storeNo,
            guideTel:this.form.phone,
            smsId:this.form.smsId,
            phoneCode:this.form.verificationCode
        }).then(res=>{
            if(res.code == 1){
                console.log(res);
                sessionStorage.setItem("userId",res.data);
                this.$router.push("/guideIndex");
            }else{
                this.$toast(res.msg);
            }
        })
    }
  }
};
</script>

<style scoped>
.van-dialog {
  top: 300px;
  transition: none;
}
</style>
