import axios from "axios";
import qs from "qs";
axios.defaults.timeout = 20000;

// axios.defaults.baseURL = "http://192.168.103.92/afterSalesApi";
console.log("host",window.location.host);
let host = window.location.host;
if(host == "192.168.103.98:8088"){
  axios.defaults.baseURL = "http://192.168.103.92/afterSalesApi/3"
}else if(host == "test-spx-hn.zhijieshop.com"){
  axios.defaults.baseURL = "https://test-spx-api.zhijieshop.com/2"
}else if(host == "test-spx-sd.zhijieshop.com"){
  axios.defaults.baseURL = "https://test-spx-api.zhijieshop.com/3"
}else if(host == "192.168.103.92"){
  axios.defaults.baseURL = "http://192.168.103.92/afterSalesApi/2"
}else if(host == "pre-spx-sd.zhijieshop.com"){
  axios.defaults.baseURL = "https://pre-spx-api.zhijieshop.com/3"
}
// axios.defaults.baseURL = "/spxAPI";
axios.defaults.headers = {"Content-Type": "application/x-www-form-urlencoded"};
import { toast } from "vant";
import { querySign } from './checkSign';
//http request 拦截器 
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    // if(token){
    //   config.params = {'token':token}
    // }
    console.log(config,'url');
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    // if(response.data.errCode ==2){
    //   router.push({
    //     path:"/login",
    //     querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
    //   })
    // }
    
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 封装get方法
 * @param url 接口地址
 * @param data 接口参数
 * @returns {Promise}
 */

export function get(url, params = {}) {
  toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true, // 禁用背景点击
    loadingType: "spinner",
    message:"加载中..."
  });
  let time = new Date().getTime();
  params.sign = querySign(params,time,false);
  params._t = time;
  params.appid = 10000;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params:params
      })
      .then(response => {
        window.console.log("response", response);
        toast.clear();
        resolve(response.data);
      })
      .catch(err => {
        window.console.log("err", err);
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url 接口地址
 * @param data 接口参数
 * @returns {Promise}
 */

export function post(url, data = {}) {
  let time = new Date().getTime();
  data.sign = querySign(data,time,false);
  data._t = time;
  data.appid = 10000;
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data)).then(
      response => {
        window.console.log("response", response);
        resolve(response.data);
      },
      err => {
        window.console.log("err", err);
        reject(err);
      }
    );
  });
}

/**
 * 封装上传post请求
 * @param url 上传地址
 * @param fd 上传参数
 * @param data  需要加密的参数
 * @returns {Promise}
 */

export function uploadPost(url, fd, data = {}) {
  return new Promise((resolve, reject) => {
    let config = {headers:{"Content-Type": "multipart/form-data"}};
    let time = new Date().getTime();
    fd.append("sign",querySign(data,time,false));
    fd.append("_t",time);
    fd.append("appid",10000);
    axios.post(url, fd,config).then(
      response => {
        window.console.log("response", response);
        resolve(response.data);
      },
      err => {
        window.console.log("err", err);
        reject(err);
      }
    );
  });
}

// 获取openId
export function getOpenId() {
    // 向后台发一个域名之后的地址包括不包括/,并且进行编码
    let ourUrl = window.location.pathname.substr(1) + window.location.search;
    ourUrl = encodeURIComponent(ourUrl);
    let windowUrl = window.location.href;
    console.log('ourUrl',ourUrl)
    if(windowUrl.indexOf("openid") > -1){
      let openId = getUrlParam('openid');
      console.log('openId',openId);
      sessionStorage.setItem('openId',openId);
      let userId = getUrlParam('userId');
      sessionStorage.setItem('userId',userId);
      window.location.reload();
    }
    else{
      get("/weixin", {
      ourUrl: ourUrl
    }).then(res => {
        if(res.code){
          // 跳转到微信授权页
          window.location.href = res.data
        }else{
          alert(res.msg);
        }
    });
    }
  }

/**
 * 根据参数名 获取 URL 路径中的参数
 * @param {String} name 要读取的参数名称
 */
export function getUrlParam (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
