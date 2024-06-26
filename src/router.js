import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'

import { AuthToken } from './common/utils'

import Login from './pages/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "app-main" */ './pages/Home/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (AuthToken.exist()) {
    if (to.path === '/login') {
      next({ path: '/home' })
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') next({ path: '/login' })
    else next()
  }
})

export default router
