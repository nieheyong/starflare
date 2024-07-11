<style lang="scss" scoped>
.c-login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.c-loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.c-login-page__inner {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.demo-img {
  width: 90vw;
  max-width: 1400px;
}

.c-login__text {
  text-align: center;
  font-size: 40px;
  margin-top: 20vh;
}

.c-login__text--sm {
  text-align: center;
  margin-top: 15px;
  font-size: 18px;
  font-weight: 200;
  // color: rgba(255, 255, 255, 0.4);
  opacity: 0.7;
}

.c-login__logo {
  height: 200px;
}

.c-login-button {
  margin-top: 50px;
  margin-bottom: 120px;
  box-shadow: 0 0px 6px rgba(103, 194, 58, 0.7);
  font-size: 18px;
  padding: 15px 30px !important;
  .button__icon {
    margin-right: 5px;
  }
}
</style>
<template>
  <div class="c-login-page">
    <div v-if="loading" class="c-loading o-loading" />
    <div class="c-login-page__inner" v-else>
      <div class="c-login__text">Welcome to Starflare</div>
      <div class="c-login__text--sm">
        Help you manage your github star simply and efficiently
      </div>
      <button
        @click="openOauth"
        class="c-login-button o-button--success is-round"
      >
        <SvgIcon icon="github-fill" class="button__icon" />Sign in with GitHub
      </button>

      <img
        v-if="appTheme === 'light'"
        src="../assets/img/light.png"
        class="demo-img"
        alt="github-logo"
      />
      <img
        v-else
        src="../assets/img/dark.png"
        class="demo-img"
        alt="github-logo"
      />
    </div>
  </div>
</template>

<script>
import queryString from 'query-string'
import * as api from '../common/api/api'
import * as githubApi from '../common/api/githubApi'
import { openWindowCenter, AuthToken, delay } from '../common/utils'
import { mapState } from 'vuex'
import { trackEvent } from '../common/utils'

export default {
  data() {
    return {
      url: '',
      loading: false
    }
  },
  async created() {
    const query = queryString.parse(location.search)
    if (window.opener) {
      window.opener.oauthGetCodeCb(query.code)
    }
  },
  computed: {
    ...mapState({
      appTheme: state => state.common.appTheme
    })
  },
  methods: {
    openOauth() {
      const params = {
        client_id: process.env.VUE_APP_CLIENT_ID,
        redirect_uri: location.origin + '#/login'
      }
      const base = 'https://github.com/login/oauth/authorize?'
      const url = base + queryString.stringify(params)
      const authWindow = openWindowCenter(url, 'authWindow', 600, 600)
      window.oauthGetCodeCb = code => {
        authWindow.close()
        delete window.oauthGetCodeCb
        if (!code) return console.error('github auth error')
        this.login(code)
      }
    },
    async login(code) {
      try {
        this.loading = true
        const res = await api.getToken(code)
        const { token, token_type, access_token } = res.data
        const ghToken = `${token_type} ${access_token}`
        AuthToken.setToken(token, ghToken)
        const user = await githubApi.getLoginUser()
        this.$store.commit('common/setUserInfo', user.data)
        this.$router.replace('/home')
        trackEvent('login', { method: 'github' })
        await delay(500)
      } catch (e) {
        console.log(e)
        AuthToken.clean()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
