import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import repo from './repo'
import tag from './tag'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    common,
    repo,
    tag
  }
})

export default store

window.addEventListener(
  'resize',
  () => {
    store.commit('common/closeSideMenu')
  },
  false
)

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
prefersDark.addListener(mediaQuery => {
  const theme = mediaQuery.matches ? 'dark' : 'light'
  store.commit('common/setAppTheme', theme)
})
