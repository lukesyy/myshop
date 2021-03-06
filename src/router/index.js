import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

  const login =()=> import('../components/login.vue')  
  const home=()=> import('../components/home.vue')  
  const users=()=> import('../components/users/users.vue')  
  const rights=()=> import('../components/power/rights.vue')  
  const roles=()=> import('../components/power/roles.vue')  
  const cate=()=> import('../components/goods/cate.vue')  
  const params=()=> import('../components/goods/params.vue')  
  const goods=()=> import('../components/goods/goods.vue')  
  const add=()=> import('../components/goods/add.vue')  

 const router = new Router({
  routes: [
    {
      path: '/',
      
      redirect: 'login'
    },
    {
      path: '/login',
      component:login
    }, {
      path: '/index',
      component: () => import('../components/index.vue'),
      children: [
        {
          path: 'home',
          component:home
        },
        {
          path: 'users',
          component:users
        },
        {
          path: 'rights',
          component:rights
        },
        {
          path: 'roles',
          component:roles
        },
        {
          path: 'categories',
          component:cate
        }, {
          path: "params",
          component:params
        }, {
          path: "goods",
          component:goods
        }, {
          path: "add",
          component:add
        },
        {
          path: '',
          redirect:'home'
        }
      ]
    }

  ]
 })

router.beforeEach((to, from, next) => {
  
  let token =  sessionStorage.getItem('token')
   if (to.path=='/'||to.path=='/login') {
     if (token) {
       alert('已经登录过')
       next('/index')
     } else {
     return  next()
     }
   } else {
     if (token) {
      return next()
     } else {
       alert('请先登录')
       next('/')
     }
   }
 })

export default router