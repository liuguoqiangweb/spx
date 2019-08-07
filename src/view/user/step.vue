<template>
  <div>
    <van-nav-bar title="进度查询" left-text="返回" left-arrow @click-left="()=>{this.$router.go(-1)}"/>
    <van-steps direction="vertical" :active="0" v-for="(item, index) in repairInfo.spxRepairFlows" :key="index"  >
      <van-step v-show="item.repairState == 9" >
          <p>您已确认收到手机</p>
          <p>{{item.createTime}}</p>
      </van-step>
      <van-step v-show="item.repairState == 8">
          <p>您的手机已维修完成，正在给您寄回</p>
          <p>快递公司：{{item.courierCompany}}</p>
          <p>快递单号：<span style="color: #38f;">{{item.courierOrder}}</span></p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 7">
          <p>您的手机正在进行维修</p>
          <p>备注: {{item.remark}}</p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 6">
          <p>您的手机没有进行维修，正在给您寄回</p>
          <p>备注: {{item.remark}}</p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 4">
          <p>已完成鉴定</p>
          <p v-show="item.threeState == 'a'">备注: 符合理赔，仅屏幕坏</p>
          <p v-show="item.threeState == 'b'">备注: 符合理赔，不止屏幕坏</p>
          <p v-show="item.threeState == 'c'">备注: 不符合理赔（有拆机等人为因素）</p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 3">
          <p>正在鉴定中</p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 2">
          <p>您的手机正在寄往{{item.outletsName}}服务中心途中</p>
          <p>快递公司：{{item.courierCompany}}</p>
          <p>快递单号：<span style="color: #38f;">{{item.courierOrder}}</span></p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 1 && item.state">
          <p>审核通过,请您把手机邮寄到售后服务中心</p>
          <p>{{item.createTime}}</p>
        </van-step>

        <van-step v-show="item.repairState == 1 && !item.state">
          <p>您提交了维修资料,未通过初审</p>
          <p>{{item.createTime}}</p>
          <p style="color: red;">原因：{{item.remark}}</p>
        </van-step>

        <van-step v-show="index == repairInfo.spxRepairFlows.length - 1">
          <p>您提交了维修资料，等待审核中（会在一个工作日内给您处理）</p>
          <p>{{item.createTime}}</p>
        </van-step>
    </van-steps>

    <van-steps direction="vertical" :active="0" v-show="repairInfo.spxRepairFlows == null || repairInfo.spxRepairFlows.length == 0">
      <van-step>
        <p>您提交了维修资料，等待审核中（会在一个工作日内给您处理）</p>
        <p>{{repairInfo.createTime}}</p>
      </van-step>
    </van-steps>
  </div>
</template>

<script>
export default {
  data(){
    return{
      repairInfo:{}
    }
  },
  mounted() {
    this.getRepairInfo();
  },
  methods:{
    //获取维修信息spx/repairOrder/infoDetails/{repairId}
    getRepairInfo(){
      let repairId = this.$route.query.repairId;
      this.$get(`spx/repairOrder/infoDetails/${repairId}`).then(response => {
        var responseData = response.data;
        this.repairInfo = responseData;
        console.log(this.repairInfo);
      });
    }
  }
};
</script>

<style>
</style>
