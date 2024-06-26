const getUserInfo = () => {
  let userInfo = {}
  try {
    userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {}
  } catch {}
  return userInfo
}

export default {
  namespaced: true,
  state: {
    sideMenuShow: false,
    settingShow: false,
    appTheme: localStorage.appTheme === 'light' ? 'light' : 'dark',
    userInfo: getUserInfo()
  },
  mutations: {
    closeSideMenu(state) {
      state.sideMenuShow = false
    },
    toggleSideMenu(state) {
      state.sideMenuShow = !state.sideMenuShow
    },
    toggleSetting(state) {
      state.settingShow = !state.settingShow
    },
    setAppTheme(state, theme) {
      var themeColorMeta = document.querySelector('meta[name=theme-color]')
      themeColorMeta.content = theme === 'dark' ? '#141419' : '#f3f3f3'
      document.documentElement.setAttribute('data-theme', theme)
      state.appTheme = localStorage.appTheme = theme
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      localStorage.userInfo = JSON.stringify(userInfo)
    }
  },
  actions: {
    toggleAppTheme({ commit, state }) {
      const theme = state.appTheme === 'light' ? 'dark' : 'light'
      commit('setAppTheme', theme)
    }
  }
}
