<template>
<div>
    <van-nav-bar title="碎屏保条款" left-text="返回" left-arrow @click-left="()=>{this.$router.go(-1)}"></van-nav-bar>
    <div class="clause">
    <p>1、手机私拆无法理赔。</p>
    <p>2、自行做好手机内资料备份，关闭屏幕锁密码，注销ID。</p>
    <p>3、除快递费外，保价费、包装费、增值费由您自行承担。</p>
    <p>4、除机身外，耳机、SIM卡、内存卡、包装盒无需邮寄。</p>
  </div>
</div>
  
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
    .clause{
        margin: 30px;
       p{
           font-size: 14px;
           color: #666;
           line-height: 30px;
       }
    }
</style>
