import Vue from "vue";
import Router from "vue-router";
import { getOpenId } from "./servers/request";
import { get } from "./servers/request"
Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/index"
  },
  {
    name: "index",
    component: () => import("./view/user/index"),
    meta: {
      title: "首页"
    }
  },
  {
    name: "policyInfo",
    component: () => import("./view/user/policyInfo"),
    meta: {
      title: "保单信息"
    }
  },
  {
    name: "mine",
    component: () => import("./view/user/mine"),
    meta: {
      title: "我的"
    }
  },
  {
    name: "buy",
    component: () => import("./view/user/buy"),
    meta: {
      title: "手机碎屏保险"
    }
  },
  {
    name: "mailMobilePhone",
    component: () => import("./view/user/mailMobilePhone"),
    meta: {
      title: "邮寄手机地址"
    }
  },
  {
    name: "step",
    component: () => import("./view/user/step"),
    meta: {
      title: "维修进度"
    }
  },
  {
    name: "applicationMaintenance",
    component: () => import("./view/user/applicationMaintenance"),
    meta: {
      title: "申请维修"
    }
  },
  {
    name: "applicationRorRefund",
    component: () => import("./view/user/applicationRorRefund"),
    meta: {
      title: "申请退换"
    }
  },
  {
    name: "order",
    component: () => import("./view/user/order"),
    meta: {
      title: "订单确认"
    }
  },

  {
    name: "clause",
    component: () => import("./view/user/clause"),
    meta: {
      title: "手机碎屏险保险条款"
    }
  },
  {
    name: "type",
    component: () => import("./view/user/type"),
    meta: {
      title: "维修方式"
    }
  },
  {
    name: "error",
    component: () => import("./view/user/error"),
    meta: {
      title: "错误页"
    }
  },
   
  {
    name: "userRegister",
    component: () => import("./view/user/userRegister"),
    meta: {
      title: "登录页"
    }
  },
   
  {
    name: "paySuccess",
    component: () => import("./view/user/paySuccess"),
    meta: {
      title: "支付成功页"
    }
  },

  {
    name: "orderFinish",
    component: () => import("./view/user/orderFinish"),
    meta: {
      title: "订单已完成页"
    }
  },

  {
    name: "guideRegister",
    component: () => import("./view/shoppingGuide/guideRegister"),
    meta: {
      title: "导购注册页面"
    }
  },

  {
    name: "guideIndex",
    component: () => import("./view/shoppingGuide/guideIndex"),
    meta: {
      title: "生成二维码页面"
    }
  },

  {
    name: "guideDisable",
    component: () => import("./view/shoppingGuide/guideDisable"),
    meta: {
      title: "导购账号异常页"
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || "/" + (route.name || "");
});
// 去掉url里面的#
const router = new Router({ 
  mode: "history", 
  routes 
});


// 动态变化头部标题
router.beforeEach((to, from, next) => {
  // const title = to.meta && to.meta.title;
  // if (title) {
  //   document.title = title;
  // }

  
  // 解决ios调取扫一扫功能失败
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  // XXX: 修复iOS版微信HTML5 History兼容性问题
  if (isiOS && to.path !== location.pathname) {
    // 此处不可使用location.replace
    location.assign(to.fullPath)
  } else {
    // next()
  }

  // 通过openId来判断是否登录
  let openId = sessionStorage.getItem('openId');
  console.log(openId,'openId');
  if(!openId){
    getOpenId();
  }else{
    // 判断订单状态，如果已完成则跳转订单已完成页面
    if(to.path == "/order"){
      let id = to.query.id;
      get(`spx/order/infoid/${id}`).then(res=>{
        if(res.data.state !=2){
          next("orderFinish")
        }else{
          next();
        }
      })
      
    }else{
      next();
    }
  }
});

export { router };
