<template>
  <div class="indexAll">
    <div class="indexAll_top">
      <van-swipe :autoplay="3000" indicator-color="white" >
        <van-swipe-item v-for="(item, index) in images" :key="index">
          <a :href="item.toUrl">
            <img :src="item.imgUrl">
            </a>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="index_middle" @click="buy">
      <div class="middle_left">
        <van-icon name="balance-list-o"></van-icon>
      </div>
      <div class="middle_content">
        <div class="title">购买碎屏险</div>
        <div class="subTitle">快捷激活/保障一年</div>
      </div>
      <div class="middle_right">&gt;</div>
    </div>
    <div class="index_middle" @click="application">
      <div class="middle_left">
        <van-icon name="records"></van-icon>
      </div>
      <div class="middle_content">
        <div class="title">申请维修</div>
        <div class="subTitle">快捷激活/保障一年</div>
      </div>
      <div class="middle_right">&gt;</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: []
    };
  },
  mounted(){
    this.getBanner();
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
    // 轮播图
    getBanner(){
      this.$get("base/banner/home",{
        type:1
      }).then(res=>{
        console.log('res',res);
        if(res.code == 1){
          this.images = res.data;
        }
      })
    },
    // 购买碎屏险
    buy() {
      sessionStorage.removeItem("formData");
      this.$router.push({ path: "/buy" });
    },
    // 申请维修
    application() {
      this.$router.push({ path: "/type", query: { type: 1 } });
    }
  }
};
</script>

<style lang="less" scoped>
.indexAll {
  .van-swipe{
    width: 100%;
    height: 100%;
    img{
      width: 100%;
      height: 100%;
    }
  }
  // height: 100%;
  .indexAll_top {
    width: 100%;
    height: 200px;
  }
  .index_middle {
    width: 90%;
    margin: 10px auto;
    height: 100px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    .middle_left {
      width: 30%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      // background-color: #666;
    }
    .middle_content {
      cursor: pointer;
      width: 40%;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title {
        font-size: 18px;
        font-family: "MicrosoftYaHei Bold";
      }
      .subTitle {
        font-size: 12px;
        font-family: "MicrosoftYaHeiLight [Regular]";
        color: #d9d9d9;
      }
    }
    .middle_right {
      width: 30%;
      height: 50px;
      color: #d9d9d9;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
