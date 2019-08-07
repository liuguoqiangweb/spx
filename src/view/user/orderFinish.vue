<template>
    <div class="fail">
        <img src="../../assets/img/orderFinsh.png" alt="" srcset="">
        <p>订单已完成</p>
        </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.fail{
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
