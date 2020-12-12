
//-------------------发送请求--------------------

import axios from 'axios'

const baseUrl = ''
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

// 拦截器
axios.interceptors.response.use(res=>{
    console.log('---------本次请求地址:' + res.config.url + '----------')
    

   
        console.log(res)
  
   
    return res
})



//==============================登录=====================================
//管理员登录 

export const postlogin=async(data)=>{
   return await axios({
        url:baseUrl+'/login',
        method:'post',
        data:data
    })
}