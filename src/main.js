import Vue from 'vue'
import App from './App.vue'
import '@/styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/route/router.js'
Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
