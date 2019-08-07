<template>
  <div style="height:100%">
    <div  v-if="$route.name == 'index' || $route.name == 'mine' || $route.name == 'policyInfo'">
       <router-view/>
    <van-tabbar route v-model="active" active-color="#07c160" :safe-area-inset-bottom="true"	>
      <van-tabbar-item replace to="/index" icon="home-o" >首页</van-tabbar-item>
      <van-tabbar-item replace to="/policyInfo" icon="home-o" >保单信息</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="friends-o" >个人中心</van-tabbar-item>
    </van-tabbar>
    </div>
    <div v-else style="height:100%">
       <router-view/>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
          show:true,
          active:''
        }
    },
   watch:{
    //  监听路由，来高亮当前选中项
     '$route':function(){
       this.active = this.$route.name;
       switch(this.$route.name){
         case 'index':
           this.active = 0;
           break;
         case 'policyInfo':
           this.active = 1;
           break;
         case 'mine':
           this.active = 2;
           break;   
       }
     }
   }
};
</script>

<style>
</style>
