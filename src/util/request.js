
//-------------------发送请求--------------------

import axios from 'axios'

const baseUrl = ''
//---------------设置请求头----------------------------
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'



//请求拦截器
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
// 响应拦截器
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
//===============================左侧菜单===================================

export const LeftMenus = async () => {
    return await axios({
        url: '/menus',
        method:'get'
    })
}
//===============================用户列表===================================

//获取列表
export const usersList = async (data) => {
    return await axios({
        url: '/users',
        method: 'get',
        params:data
    })
}



//修改状态

export const setType = async (id,type) => {
    return await axios({
        url: `/users/${id}/state/${type}`,
        method: 'put',
      
    })
}



//添加用户

export const addUserList = async (data) => {
    return await axios({
        url:'/users',
        method: 'post',
      data:data
    })
}

//删除用户
export const DeleteUser = async (id) => {
    return await axios({
        url: `/users/${id}`,
        method: 'delete',
      
    })
}
//获取一条用户信息
export const getUserOne = async (id) => {
    return await axios({
        url: `/users/${id}`,
        method: 'get',
        
      
    })
}
//修改用户信息

export const setUser = async (id,email,mobile) => {
    return await axios({
        url: `/users/${id}`,
        method: 'put',
        data: {
            email,
            mobile
      }
    })
}


//============================权限管理=============================


//所有权限列表
export const rightsList = async (type) => {
    return await axios({
        url: `/rights/${type}`,
        method: 'get',
     
    })
}