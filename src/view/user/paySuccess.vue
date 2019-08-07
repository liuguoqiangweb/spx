<template>
    <div class="success">
        <img src="../../assets/img/paySuccess.png" alt="" srcset="">
        <p>支付成功</p>
        <p v-if="show">{{times}}秒钟之后即将跳到保单信息页</p>    
    </div>
</template>

<script>
export default {
    data(){
        return{
            show:true,
            times:3,
        }
    },
    mounted(){
        let payType = this.$route.query.payType;
        if(payType == 1){
            let number = 3;
            let timer = setInterval(() => {
            if (number > 0 && number <= 3) {
              number--;
              this.times = number;
            } else {
              this.$router.push("/policyInfo")
              clearInterval(timer);
              timer = null;
            }
          }, 1000);
        }else{
            this.show = false;
        }
    }
}
</script>

<style lang="less">
.success{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #666;
    font-family: "MicrosoftYaHeiLight [Regular]";
    img{
        width:100px;
        height:100px;
        margin-bottom: 20px;
    }
}
</style>
