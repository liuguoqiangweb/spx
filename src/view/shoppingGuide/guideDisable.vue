<template>
    <div class="guideDisable">
        <img src="../../assets/img/userError.png" alt="" srcset="">
        <p>账号异常，请联系管理员</p>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.guideDisable{
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
