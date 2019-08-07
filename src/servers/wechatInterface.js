//微信支付方法（点击按键调用）
var wx = require('weixin-js-sdk');
/*
微信支付方法
获取微信加签信息
@param{data}:获取的微信加签
@param{cb}:成功回调
@param{errorCb}:失败回调
@param{share}:判断是否是调用分享的微信接口
*/
let wechatInterface = (data,cb,errorCb,key) => {
  let appId = data.appId;
  let timestamp = data.timestamp;
  let nonceStr = data.nonceStr;
  let signature = data.signature;
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名，见附录1
    jsApiList: ["updateAppMessageShareData","scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  switch (key) {
    case 'pay':
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": data.appId, //公众号名称，由商户传入     
          "timeStamp": data.timestamp, //时间戳，自1970年以来的秒数     
          "nonceStr": data.nonceStr, //随机串     
          "package": data.package,
          "signType": data.signType, //微信签名方式：     
          "paySign": data.paySign //微信签名 
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            cb(res);
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            //支付过程中用户取消
            errorCb(res);
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            //支付失败
            errorCb(res);
          }
        });
      break;
    case 'share':
        wx.ready(function(){
          wx.updateAppMessageShareData({
            title: '知心宝', // 分享标题
            desc: '知心宝碎屏险订单-代支付', // 分享描述
            link:  window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://zjkj-spx.oss-cn-hangzhou.aliyuncs.com/common/mr.png', // 分享图标
            success: function (res) {
              // 分享成功
              console.log("分享成功");
            },
            fail:function(res){
              errorCb(res);
            }
        });
        });
      
      wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        /*alert("config信息验证失败");*/
      });
      break;
    case 'scan':
        wx.ready(function() {
          // config信息验证成功后会执行ready方法,所有接口调用都必须在config接口获得结果之后
          // config 是一个客户端的异步操作,所以如果需要在页面加载时调用相关接口,则须把相关接口放在ready函数中调用来确保正确执行.对于用户触发是才调用的接口,则可以直接调用,不需要放在ready函数中
          wx.checkJsApi({
            // 判断当前客户端版本是否支持指定JS接口
            jsApiList: ["scanQRCode"],
            success: function(res) {
              // 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
              if (res.checkResult.scanQRCode === true) {
                wx.scanQRCode({
                  // 微信扫一扫接口
                  desc: "scanQRCode desc",
                  needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                  scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                  success: function(res) {
                    cb(res);
                  }
                });
              } else {
                alert("抱歉，当前客户端版本不支持扫一扫");
              }
            },
            fail: function(res) {
              // 检测getNetworkType该功能失败时处理
              alert("fail" + res);
            }
          });
        });
        break;  
    default:
      break;
  }}
export default wechatInterface;