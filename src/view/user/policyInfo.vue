<template>
  <div class="policyInfo">
    <van-cell-group title="保单信息">
      <van-cell :title="'机型：'+item.modelName" value="订单异常" v-for="item in orderList" :key="item.id">
        <template
          v-if="item.state == 1 && item.use == 0 && item.change == 0 && item.validState > 0"
        >
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <p>有效期：{{item.startTime}} 至 {{item.endTime}}</p>
          </template>
          <template slot="default">
            <van-tag type="success">保护中</van-tag>
          </template>
        </template>

        <template v-if="item.state == 1 && item.validState == 0">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
          </template>
          <template slot="default">
            <van-tag>已过期</van-tag>
          </template>
        </template>

        <template
          v-if="item.state == 1 && item.change == 1 && item.changeOrder == null"
        >
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <p>有效期：{{item.startTime}} 至 {{item.endTime}}</p>
          </template>
          <template slot="default">
            <van-tag type="primary">换机中</van-tag>
          </template>
        </template>

        <template
          v-if="item.state == 1 && item.change == 1 && item.changeOrder != null && item.changeOrder.changeState == 3"
        >
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <p>有效期：{{item.startTime}} 至 {{item.endTime}}</p>
            <p class="remark">原因：{{item.changeOrder.failRemark}}</p>
            <van-button
              plain
              class="van-button-spx-fast van-button-spx-all"
              size="small"
              type="danger"
              @click="change(item.id,item.changeOrder.id)"
            >完善信息</van-button>
          </template>
          <template slot="default">
            <van-tag type="danger">换机未通过</van-tag>
          </template>
        </template>

        <template
          v-if="item.repairOrder != null && item.state == 1 && item.use == 1 && item.repairOrder.orderState == 1"
        >
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <van-button
              plain
              class="van-button-spx-fast van-button-spx-all"
              size="small"
              type="info"
              @click="step(item.repairOrder.id)"
            >查看进度</van-button>

            <van-button
              v-if="item.repairOrder.repairState == 2"
              plain
              class="van-button-spx-tow van-button-spx-all"
              size="small"
              type="danger"
              @click="send(item.repairOrder.id)"
            >待寄出</van-button>

            <van-button
              v-if="item.repairOrder.repairState == 9"
              plain
              class="van-button-spx-tow van-button-spx-all"
              size="small"
              type="danger"
              @click="seven(item.repairOrder.id)"
            >确认收货</van-button>
          </template>
          <template slot="default">
            <van-tag type="primary">维修中</van-tag>
          </template>
        </template>

        <template
          v-if="item.repairOrder != null && item.state == 1 && item.use == 1 && item.repairOrder.orderState == 2"
        >
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <van-button
              plain
              class="van-button-spx-fast van-button-spx-all"
              size="small"
              type="info"
              @click="step(item.repairOrder.id)"
            >查看进度</van-button>
          </template>
          <template slot="default">
            <van-tag>已使用</van-tag>
          </template>
        </template>

        <template
          v-if="item.repairOrder != null && item.state == 1 && item.use == 1 && item.repairOrder.orderState == 3"
        >
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <p class="remark">原因：{{item.repairOrder.failRemark}}</p>
            <van-button
              plain
              class="van-button-spx-fast van-button-spx-all"
              size="small"
              type="info"
              @click="step(item.repairOrder.id)"
            >查看进度</van-button>
            <van-button
              plain
              class="van-button-spx-tow van-button-spx-all"
              size="small"
              type="danger"
              @click="repairFail(item.id,item.repairOrder.id)"
            >完善信息</van-button>
          </template>
          <template slot="default">
            <van-tag type="danger">维修未通过</van-tag>
          </template>
        </template>

        <template v-if="item.state == 2">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <p>订单有效期：1小时</p>
            <van-button
              plain
              class="van-button-spx-fast van-button-spx-all"
              size="small"
              type="info"
              @click="pay(item.id,item.spxOrderPay.meTradeType)"
            >去支付</van-button>
            <van-button
              plain
              class="van-button-spx-tow van-button-spx-all"
              size="small"
              type="danger"
              @click="payCancel(item.id)"
            >取消订单</van-button>
          </template>
          <template slot="default">
            <van-tag type="danger">未支付</van-tag>
          </template>
        </template>

        <template v-if="item.state == 3">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
          </template>
          <template slot="default">
            <van-tag>已取消</van-tag>
          </template>
        </template>

        <template v-if="item.state == 4">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
          </template>
          <template slot="default">
            <van-tag type="primary">退款中</van-tag>
          </template>
        </template>
        <template v-if="item.state == 5">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
          </template>
          <template slot="default">
            <van-tag>已退款</van-tag>
          </template>
        </template>
        <template v-if="item.state == 6">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
          </template>
          <template slot="default">
            <van-tag type="danger">退款失败</van-tag>
          </template>
        </template>

        <template v-if="item.state == 7">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
          </template>
          <template slot="default">
            <van-tag type="primary">退款审核中</van-tag>
          </template>
        </template>

        <template v-if="item.state == 8">
          <template slot="label">
            <p>IMEI：{{item.imei}}</p>
            <p>保单号：{{item.insuranceCard}}</p>
            <p class="remark">原因：{{item.refundOrder.failRemark}}</p>
            <van-button
              plain
              class="van-button-spx-fast van-button-spx-all"
              size="small"
              type="danger"
              @click="refundCancel(item.id,item.refundOrder.id)"
            >取消退款</van-button>
          </template>
          <template slot="default">
            <van-tag type="danger">退款审核失败</van-tag>
          </template>
        </template>
      </van-cell>

      <van-dialog v-model="sevenShow" title="确认收货" show-cancel-button @confirm="sevenPost()">
        <van-radio-group v-model="sevenRadio" style="margin-top: 10px;">
          <van-cell-group>
            <van-cell title="非常满意" clickable @click="sevenRadio = '非常满意'">
              <van-radio name="非常满意"/>
            </van-cell>
            <van-cell title="满意" clickable @click="sevenRadio = '满意'">
              <van-radio name="满意"/>
            </van-cell>
            <van-cell title="一般" clickable @click="sevenRadio = '一般'">
              <van-radio name="一般"/>
            </van-cell>
            <van-cell title="不满意" clickable @click="sevenRadio = '不满意'">
              <van-radio name="不满意"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-dialog>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderList: [],
      sevenShow: false,
      sevenRadio: "非常满意",
      sevenRepairId: null
    };
  },
  mounted() {
    this.getPolicyInfo();
    //1、挂载完成后，判断浏览器是否支持popstate
    if (window.history && window.history.pushState) {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', this.goBack, false);
  }
  },
  //页面销毁时，取消监听。否则其他vue路由页面也会被监听
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false);
  },
  methods: {
    goBack(){
    //replace替换原路由，作用是避免回退死循环
    this.$router.replace({path: '/'});
    },
    getPolicyInfo() {
      //  获取保单信息
      this.$get(`spx/order/listAll/${sessionStorage.getItem('userId')}`).then(response => {
        var responseData = response.data;
        if (responseData != null && responseData.length > 0) {
          this.orderList = responseData;
          for (let index = 0; index < this.orderList.length; index++) {
            const element = this.orderList[index];
            if (
              element.repairOrders != null &&
              element.repairOrders.length > 0
            ) {
              this.orderList[index].repairOrder = element.repairOrders[0];
            } else {
              this.orderList[index].repairOrder = {};
            }
            if (
              element.refundOrders != null &&
              element.refundOrders.length > 0
            ) {
              this.orderList[index].refundOrder = element.refundOrders[0];
            } else {
              this.orderList[index].refundOrder = {};
            }
            
            if (
              element.changeOrders != null &&
              element.changeOrders.length > 0
            ) {
              element.changeOrders.forEach(item => {
                if(item.changeState == 3){
                  this.orderList[index].changeOrder = item;
                }
              });
            }
            if (element.spxOrderPay == null) {
              this.orderList[index].spxOrderPay = {};
            }
          }
        }

        console.log(this.orderList);
      });
    },
    step(repairId) {
      console.log("查看进度");
      this.$router.push({ path: "/step", query: { repairId: repairId } });
    },
    // 取消退款
    refundCancel(orderInfoId, refundOrderId) {
      console.log("取消退款");
      this.$post("/spx/refund/cancel", {
        orderInfoId: orderInfoId,
        userId: sessionStorage.getItem("userId"),
        refundId: refundOrderId
      }).then(res => {
        if(res.code == 1){
          this.$toast(res.msg);
          this.getPolicyInfo();
        }
      });
    },
    // 换机完善资料
    change(orderInfoId, refundOrderId) {
      console.log("换机完善资料");
      this.$router.push({
        path: "/applicationRorRefund",
        query: {
          newId: refundOrderId,
          id: orderInfoId
        }
      });
    },
    // 待寄出
    send(repairId) {
      console.log("待寄出");
      this.$router.push({
        path: "/mailMobilePhone",
        query: {
          repairId: repairId
        }
      });
    },
    seven(repairId) {
      console.log("确认收货");
      this.sevenShow = true;
      this.sevenRepairId = repairId;
    },
    sevenPost() {
      console.log(this.sevenRepairId);
      console.log("确认收货post");
      if (this.sevenRepairId == null) {
        return;
      }
      this.$post("spx/repairOrder/seven", {
        userId: sessionStorage.getItem('userId'),
        remark: this.sevenRadio,
        repairId: this.sevenRepairId,
        state: true
      }).then(response => {
        console.log(response);
        this.getPolicyInfo();
      });
    },
    repairFail(orderInfoId, repairId) {
      console.log("维修审核失败");
      //applicationMaintenance
      this.$router.push({
        path: "/applicationMaintenance",
        query: { repairId: repairId }
      });
    },
    payCancel(orderInfoId) {
      console.log("取消订单");
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "您是否取消订单"
        })
        .then(() => {
          this.$post("spx/order/close", {
            orderInfoId: orderInfoId,
            userId: sessionStorage.getItem('userId')
          }).then(response => {
            console.log(response);
            this.getPolicyInfo();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    pay(orderInfoId, meTradeType) {
      console.log("去支付");
      if(meTradeType == 2){
        sessionStorage.setItem("share",true);
      }else{
        sessionStorage.removeItem("share");
      }
      this.$router.push({ path: "/order", query: { id: orderInfoId,payType:meTradeType } });
    }
  }
};
</script>

<style scoped lang="less">
.policyInfo{
  margin-bottom: 60px;
}
.remark{
  color: red;
}
.van-button--small {
  margin-right: 10px;
}
.van-cell__label {
  width: 200%;
}
.van-button-spx-fast {
  float: right;
  margin-right: 0px;
}
.van-button-spx-tow {
  float: right;
  margin-right: 10px;
}
.van-button-spx-all {
  margin-top: 5px;
  height: 26px;
  line-height: 24px;
  z-index: 1;
}
</style>
