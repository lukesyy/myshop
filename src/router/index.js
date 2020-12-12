import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

  const login =()=> import('../components/login.vue')  
  const home=()=> import('../components/home.vue')  

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
          path: '',
          redirect:'home'
        }
      ]
    }

  ]
 })

router.beforeEach((to, from, next) => {
  console.log(to);
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