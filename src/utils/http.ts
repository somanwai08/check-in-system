import axios from 'axios'
import type {AxiosRequestConfig,AxiosResponse} from 'axios'
import { store } from '../store/store-index';
import { message } from 'antd';
import { clearToken } from '../store/module/users';

const instance = axios.create({
   
    // baseURL:'http://localhost:3000',
    timeout:5000
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    if(config.headers){
      config.headers.authorization = store.getState().user.token
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response.data.errmsg === 'token error'){
      message.error('token error')
      store.dispatch(clearToken())
      setTimeout(()=>{
        window.location.replace('/check-in-system/login')
      },1000)
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

  interface Data{
    [index:string]:unknown
  }

  interface Http{
    get:(url:string,data?:Data,config?:AxiosRequestConfig)=>Promise<AxiosResponse<any,any>>,
    post:(url:string,data?:Data,config?:AxiosRequestConfig)=>Promise<AxiosResponse<any,any>>,
    put:(url:string,data?:Data,config?:AxiosRequestConfig)=>Promise<AxiosResponse<any,any>>,
    patch:(url:string,data?:Data,config?:AxiosRequestConfig)=>Promise<AxiosResponse<any,any>>,
    delete:(url:string,data?:Data,config?:AxiosRequestConfig)=>Promise<AxiosResponse<any,any>>,
  }

  const http:Http = {
    get(url,data,config){
        return instance.get(url,{params:data,...config})
    },
    post(url,data,config){
        return instance.post(url,data,config)
    },
    put(url,data,config){
        return instance.put(url,data,config)
    },
    patch(url,data,config){
        return instance.patch(url,data,config)
    },
    delete(url,data,config){
        return instance.delete(url,{
            data,
            ...config
        })
    }
  }

  export default http