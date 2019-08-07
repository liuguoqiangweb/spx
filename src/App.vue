<template>
  <div id="app">
   <menuAll/>
  </div>
</template>

<script>
import menuAll from './view/user/menuAll'
export default {
  name: 'app',
  components:{
    menuAll
  }
}
</script>

<style>
html {
  height: 100%;
}
#app{
    height: 100%;
}
body{
  height: 100%;
  background-color: #f3f3f3;
}
.sumbitInfo {
  font-size: 18px;
  font-family: "微软雅黑";
  font-weight: bold;
  padding: 10px;
}
*{
  padding: 0;
  margin: 0;
}
.footerBtn {
  width: 80%;
  margin: 0 auto;
  height: 110px;
  margin-top: 20px;
}
.van-nav-bar__text{
  color: #07c160;
}
.van-nav-bar .van-icon{
  color: #07c160;
}
.van-picker__cancel, .van-picker__confirm{
  color: #07c160;
}
.van-field__control:disabled{
  color: #07c160;
}
.heightSize {
  height: 350px;
  overflow: scroll;
}
.uploadImg::before{
    content: '*';
    font-size: 14px;
    color: #f44;

}
</style>
