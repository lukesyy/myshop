
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
export const postlogin=(data)=>{
   return  axios({
        url:baseUrl+'/login',
        method:'post',
        data:data
    })
}
//===============================左侧菜单===================================

export const LeftMenus =  () => {
    return  axios({
        url: '/menus',
        method:'get'
    })
}
//===============================用户列表===================================

//获取列表
export const usersList =  (data) => {
    return  axios({
        url: '/users',
        method: 'get',
        params:data
    })
}



//修改状态

export const setType =  (id,type) => {
    return  axios({
        url: `/users/${id}/state/${type}`,
        method: 'put',
      
    })
}



//添加用户

export const addUserList =  (data) => {
    return  axios({
        url:'/users',
        method: 'post',
      data:data
    })
}

//删除用户
export const DeleteUser =  (id) => {
    return  axios({
        url: `/users/${id}`,
        method: 'delete',
      
    })
}
//获取一条用户信息
export const getUserOne =  (id) => {
    return  axios({
        url: `/users/${id}`,
        method: 'get',
        
      
    })
}
//修改用户信息

export const setUser =  (id,email,mobile) => {
    return  axios({
        url: `/users/${id}`,
        method: 'put',
        data: {
            email,
            mobile
      }
    })
}
//分配新角色
export const setUserRole =  (id,rid) => {
    return  axios({
        url: `/users/${id}/role`,
        method: 'put',
        data: {
            rid:rid
      }
    })
}

//============================权限管理=============================


//所有权限列表
export const rightsList =  (type) => {
    return  axios({
        url: `/rights/${type}`,
        method: 'get',
     
    })
}

//==========================角色管理==================================

//获取角色列表
export const rolesList = () => {
    return axios({
        url: '/roles',
        method:'get'
    })
}
//删除角色
export const DeleteRoles =  (id) => {
    return  axios({
        url: `/roles/${id}`,
        method: 'delete',
      
    })
}




//获取一条用户信息
export const getRoleOne =  (id) => {
    return  axios({
        url: `/roles/${id}`,
        method: 'get',
        
      
    })
}

//删除权限
export const DeleteRights =  (roleId,rightId) => {
    return  axios({
        url: `/roles/${roleId}/rights/${rightId}`,
        method: 'delete',
        
    })
}
//添加角色

export const addRoleList =  (data) => {
    return  axios({
        url:'/roles',
        method: 'post',
      data:data
    })
}

//修改角色信息

export const setroles =  (roleId,roleDesc,roleName) => {
    return  axios({
        url: `/roles/${roleId}`,
        method: 'put',
        data: {
            roleDesc,
            roleName,
            
      }
    })
}
//分配权限

export const setRights =  (roleId,data) => {
    return  axios({
        url:`roles/${roleId}/rights`,
        method: 'post',
      data:{rids:data}
    })
}
//===========================商品================================
//商品分类列表

export const categoriesList = (data) => {
    return axios({
        url: '/categories',
        method: 'get',
        params:data
    })
}