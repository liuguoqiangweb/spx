<template>
  <div>
    <van-nav-bar title="邮寄手机" left-text="返回" left-arrow @click-left="()=>{this.$router.go(-1)}"/>
    <van-cell-group title="提交信息">
      <van-field
        v-model="form.dot"
        label="维修网点"
        placeholder="请选择维修网点"
        disabled
        autoSize
        type="textarea"
      >
        <van-button slot="button" size="small" type="primary" @click="selectDot">选择</van-button>
      </van-field>
      <van-field v-model="form.receivingPerson" label="收件人" placeholder="请输入收件人"/>
      <van-field v-model="form.receivingAddress" label="收件地址" placeholder="请输入收件地址"/>
      <van-field v-model="form.zipCode" label="邮编" placeholder="请输入邮编"/>
      <van-field v-model="form.telePhone" label="电话" placeholder="请输入电话"/>
      <van-field
        v-model="form.courierCompany"
        label="快递公司"
        placeholder="请选择快递公司"
        required
        v-validate="'required'"
        name="courierCompany"
        :error-message="errors.first('courierCompany')"
      >
        <van-button slot="button" size="small" type="primary" @click="selectCompany">选择</van-button>
      </van-field>
      <van-field
        v-model="form.CourierNumber"
        label="快递单号"
        placeholder="请输入快递单号"
        required
        v-validate="'required'"
        name="CourierNumber"
        :error-message="errors.first('CourierNumber')"
      />
    </van-cell-group>
    <div class="footerBtn">
      <van-button type="primary" size="large" round @click="submitInfo">提交</van-button>
    </div>
    <van-dialog v-model="show" title="快递公司" confirmButtonColor="#07c160">
      <div class="heightSize">
        <van-radio-group v-model="radio" checked-color="#07c160">
          <van-cell-group v-for="(item,index) in courierCompanyList" :key="index">
            <van-cell :title="item" clickable @click="radio = index+1,form.courierCompany=item">
              <van-radio checked-color="#07c160" :name="index+1"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-dialog>
    <van-dialog v-model="showDot" title="维修网点" confirm-button-color="#07c160">
      <van-search v-model="searchVal" placeholder="请输入维修网点关键词" show-action>
        <div slot="action" @click="getInfo">搜索</div>
      </van-search>
      <div class="heightSize">
        <van-radio-group v-model="radioDot" checked-color="#07c160">
          <van-cell-group>
            <van-cell
              v-for="(item,index) in list"
              :key="index"
              :title="item.outletsAddress"
              clickable
              @click="selectItem(item)"
            >
              <van-radio checked-color="#07c160" :name="item.id"/>
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
      courierCompanyList: [
        "顺丰",
        "中通",
        "韵达",
        "德邦物流",
        "圆通速递",
        "邮政包裹挂号信",
        "汇通快运",
        "天天快递",
        "申通快递",
        "中邮物流",
        "ems快递"
      ],
      show: false,
      showDot: false,
      radio: 1,
      radioDot: "",
      searchVal: "",
      userId: 2,
      list: [],
      form: {
        dot: "",
        zipCode: "",
        telePhone: "",
        receivingAddress: "",
        receivingPerson: "",
        courierCompany: "",
        CourierNumber: ""
      }
    };
  },

  methods: {
    // 网点地址
    getInfo() {
      this.$get("base/outlets/repairAll", {
        outletsName: this.searchVal
      }).then(res => {
        if (res.code == 1) {
          this.list = res.data;
          console.log(this.list, "list");
        }
      });
    },
    // 选中网点
    selectItem(item) {
      this.radioDot = item.id;
      this.form.dot = item.outletsAddress;
      this.form.zipCode = item.outletsZipcode;
      this.form.telePhone = item.outletsTel;
      this.form.receivingAddress = item.outletsAddress;
      this.form.receivingPerson = item.outletsContacts;
    },
    // 选择维修网点
    selectDot() {
      this.getInfo();
      this.showDot = true;
    },
    // 选择快递公司
    selectCompany() {
      this.show = true;
    },
    // 提交
    submitInfo() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$toast.loading({
            mask: true,
            message: "提交中......",
            duration:0
          });
          this.$post("spx/repairOrder/one", {
            courierCompany: this.form.courierCompany,
            courierOrder: this.form.CourierNumber,
            repairId: this.$route.query.repairId,
            repairoutletsId: this.radioDot,
            userId: sessionStorage.getItem("userId")
          }).then(res => {
            if (res.code == 1) {
              this.$toast.clear();
              this.$router.push("/policyInfo");
            }
          });
        }
      });
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
