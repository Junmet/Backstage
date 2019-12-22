import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import index from '@/views/index.vue'
import welcome from '@/views/welcome.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      name: 'Login',
      path: '/Login',
      component: Login
    },
    {
      naem: 'index',
      path: '/',
      component: index,
      // 重定向
      redirect: { name: 'welcome' },
      // 路由嵌套
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: welcome
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path.indexOf('/Login') === -1) {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router
