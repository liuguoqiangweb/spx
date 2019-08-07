<template>
    <div>
        <div class="mine">
            <div class="mine_all">
                <div class="mine_img"><img src="https://zjkj-spx.oss-cn-hangzhou.aliyuncs.com/common/mr.png" alt=""></div>
                <div class="mine_title">知心宝</div>
            </div>
        </div>
         <van-cell-group>
        <van-cell title="申请退换" is-link to="type" icon="newspaper-o" />
        </van-cell-group>
        <van-cell-group>
        <van-cell title="如何购买" is-link to="index" icon="question-o"/>
        <van-cell title="如何维修" is-link to="index" icon="closed-eye"/>
        <van-cell title="常见问题" is-link to="index" icon="chat-o"/>
        <van-cell title="服务条款" is-link to="index" icon="browsing-history-o"/>
        <van-cell title="联系客服" value="82067618"  icon="phone-circle-o"/>
        </van-cell-group>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
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
    methods:{
        goBack(){
    //replace替换原路由，作用是避免回退死循环
    this.$router.replace({path: '/'});
    },
        onClickLeft(){
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="less" scoped>
.mine{
    width: 100%;
    height: 100px;
    background-color: #35d4be;
    display: flex;
    justify-content: center;
    align-items: center;
    .mine_all{
        width: 90%;
        height: 80px;
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        .mine_img{
            img{
                width: 100%;
                height: 100%;
            }
            width: 50px;
            height: 50px;
            // background-color: #666;
            margin: 0 30px;
        }
        .mine_title{
            font-size: 20px;
            font-family: '微软雅黑';
        }
    }
}
.van-cell-group{
  margin: 20px;  
}
</style>
