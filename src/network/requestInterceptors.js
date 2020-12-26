import router from "@/router";
import {getToken} from '@/util/content'

//axios的请求拦截器
export default function (config) {
  // let url = config.url;
  // let token = getToken();
  // //如果没有token且请求的不是登录页面 则跳到登录页面
  // if (!token && url.indexOf('login')===-1){
  //   router.replace("/login");
  //   return ;
  // }
  // //除login请求外都要带上token
  // if (url.indexOf('login')===-1){
  //   config.headers.token = token;
  // }
  // if (config.method === 'post' || config.method === 'put') {
  //   // post、put 提交时，将对象转换为string,
  //   config.data = JSON.stringify(config.data)
  // }
  // // console.log(config);
  return config
}
