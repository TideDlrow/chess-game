import axios from 'axios';
import requestInterceptors from "@/network/requestInterceptors";
//默认路径
const ConfigBaseURL = 'http://localhost:8818/';
// const ConfigBaseURL = 'http://192.168.137.1:8818/';

const service = axios.create({
  timeout: 7000,//请求超时时间
  baseURL: ConfigBaseURL,

});

// 设置 post、put 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.headers.put['Content-Type'] = 'application/json';

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    return requestInterceptors(config)
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    let {data} = response;
    //返回码处理
    // let {code} = data;
    // switch (code) {
    //     case 200:
    //         return data;
    //     case 401://
    // }
    return data
  },
  (error) => {
    console.error(error);
    // let info = {},
    //     {status, statusText, data} = error.response;
    //
    // if (!error.response) {
    //     info = {
    //         code: 5000,
    //         msg: 'Network Error'
    //     }
    // } else {
    //     // 此处整理错误信息格式
    //     info = {
    //         code: status,
    //         data: data,
    //         msg: statusText
    //     }
    // }
  }
);

/**
 * 创建统一封装过的 axios 实例
 * @return
  //  */
// export default function () {
//     return service
// }
export default service;
