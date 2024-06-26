import Vue from 'vue'

import router from './router'
import store from './store/store'
import './registerServiceWorker'

import App from './App.vue'

import './common/appSetup'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.store = store
