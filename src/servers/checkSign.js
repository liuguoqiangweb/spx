import md5 from 'js-md5';
/**
 * @param {*} params 请求参数
 * @param {*} params true代表get方法,false代表post方法
 */
export function querySign(params,time,flag) {
    let _t = time;
    if (typeof params === "object") {
        var arr = [];
        for (var i in params) {
            arr.push((i + "=" + params[i]));
        }
        arr.push("appid"+"="+10000);
        arr.push(("_t"+"="+_t));
        return getResult(arr.join(("&")),flag);
    }
  }

  /**
   * 
   * @param {*} str 排序后的字符串参数
   * @param {*} flag true代表get方法,false代表post方法
   */
  function getResult(str,flag){
    let no = '308fc914f3dff1d';
    let data = filterStr(str);
    // 把处理好的参数加密，然后返回
    let postResult = md5(data + no);
    let getResults =  str + '&sign=' + postResult;
    if(flag){
      return postResult;
    }else{
      return postResult;
    }
  }
  /**
   * 
   * @param {*} str 原字符串里面过滤参数为空的对象
   */
  function filterStr(str){
        let array = str.split("&");
        let newArray = [];
      array.forEach(i=>{
        let result =  i.split("=");
        if(result[1] !== ""){
           newArray.push(i);
        }
    })
    console.log('newArray',newArray);
    let newStr = newArray.join("&");
    return paramsStrSort(newStr);
  }
  
    /**
   * 
   * @param {*} paramsStr 把过滤后的参数排序
   */
  function paramsStrSort(paramsStr) {
    let sortStr = paramsStr.split("&").sort().join("&");
    return sortStr;
  }