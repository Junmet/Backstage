import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      name: 'Login',
      path: '/Login',
      component: Login
    }
  ]
})

export default router
