<style lang="scss">
.c-side-menu {
  height: 100%;
  .c-user-profile {
    text-align: center;
    color: var(--SideMenu_LoginName_Color);
    .user-avatar {
      display: block;
      margin: 30px auto 6px;
      border-radius: 6px;
      background: var(--SideMenu_Avatar_Background);
      width: 60px;
      height: 60px;
      overflow: hidden;
      & > img {
        width: 60px;
        height: 60px;
      }
    }
  }

  .c-side-menu__main {
    height: 100%;
    background: var(--SideMenu_Container_Background);
    display: flex;
    flex-direction: column;
    width: 220px;
  }

  .menu-list {
    flex: 1;
    min-height: 0;
    padding: 0 15px;
    overflow-y: auto;
    margin-top: 20px;
    font-weight: 500;
    padding-bottom: 50px;
    .sync-item {
      @keyframes rotate360 {
        0% {
          transform: rotate(0deg) scale(1);
        }
        50% {
          transform: rotate(180deg) scale(0.8);
        }
        100% {
          transform: rotate(360deg) scale(1);
        }
      }
      .c-svg-icon {
        animation: rotate360 1s linear infinite;
      }
    }
  }

  .menu-expand-icon {
    .c-svg-icon {
      transform: rotate(-90deg);
      transition: transform 0.3s;
    }
    &.expand {
      .c-svg-icon {
        transform: rotate(0deg);
      }
    }
  }
  .c-side-menu__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    // margin-bottom: 10px;
    .sync-container {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 30px;
      width: 190px;
      border: solid 1px transparent;
      border-color: var(--SideMenu_SyncButton_BorderColor);
      overflow: hidden;
      text-align: center;
      margin-top: 10px;
      .sync-item {
        cursor: pointer;
        color: var(--SideMenu_SyncButton_Color);
        background: var(--SideMenu_SyncButton_Background);
        user-select: none;
        flex: 1;
        padding: 6px 0;
        &:hover {
          color: var(--SideMenu_SyncButton_Color__Hover);
          background: var(--SideMenu_SyncButton_Background__Hover);
        }
      }
      .divider {
        width: 1px;
        height: 14px;
        background: var(--SideMenu_SyncButton_BorderColor);
      }
    }
    .footer-bt-ct {
      margin-top: 5px;
      width: 100%;
      padding: 8px 10px;
      font-size: 16px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .footer-bt {
        cursor: pointer;
        padding: 6px;
        line-height: 1;
        user-select: none;
        border-radius: 6px;
        color: var(--SideMenu_IconButton_Color);
        background: var(--SideMenu_IconButton_Background);
        &:hover {
          color: var(--SideMenu_IconButton_Color__Hover);
          background: var(--SideMenu_IconButton_Background__Hover);
        }
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .c-side-menu__main {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: 9;
  }

  .c-side-menu--is-open {
    .c-side-menu__mask {
      -webkit-transition: background 0.4s;
      z-index: 8;
      backdrop-filter: blur(4px);
      background: rgba(0, 0, 0, 0.33);
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      transition: background 0.4s;
    }
    .c-side-menu__main {
      transform: translateX(0);
    }
  }
}
</style>

<template>
  <div class="c-side-menu" :class="{ 'c-side-menu--is-open': sideMenuShow }">
    <div class="c-side-menu__mask" @click="toggleSideMenu"></div>
    <div class="c-side-menu__main">
      <div class="c-user-profile">
        <div class="user-avatar">
          <img
            v-if="user.avatar_url"
            :src="user.avatar_url"
            alt="user-avatar"
          />
        </div>
        {{ user.name }}
      </div>
      <div class="menu-list">
        <MenuItem
          @click.native="showRepos('all')"
          :isActive="activeMenu === 'all'"
          text="All Repos"
          icon="apps"
        >
          <span v-if="repoSync" class="sync-item">
            <SvgIcon icon="refresh-line" />
          </span>
          <span>&nbsp; {{ $store.state.repo.repos.length }}</span>
        </MenuItem>

        <MenuItem
          @click.native="showRepos('untaged')"
          :isActive="activeMenu === 'untaged'"
          text="Untagged"
          icon="untag"
        >
          <span>{{ $store.getters['repo/untagedRepos'].length }}</span>
        </MenuItem>
        <TagSection />
        <LanguageSection />
      </div>
      <div class="c-side-menu__footer">
        <!-- <div class="sync-repo-button"></div> -->
        <div class="sync-container">
          <span @click="importTags" class="sync-item">
            <SvgIcon icon="save-file"/>&nbsp; Import
          </span>
          <div class="divider"></div>

          <span @click="exportTag" class="sync-item">
            <SvgIcon icon="save-file" />&nbsp; Export
          </span>
        </div>

        <div class="footer-bt-ct">
          <span class="footer-bt" @click="logout" title="logout">
            <SvgIcon icon="logout-line" />
          </span>
          <span class="footer-bt" @click="toggleTheme" title="Toggle Theme">
            <SvgIcon v-if="appTheme === 'dark'" icon="sun-line" />
            <SvgIcon v-else icon="moon-line" />
          </span>
          <!-- <span class="footer-bt" @click="toggleSetting" title="Setting">
            <SvgIcon icon="setting-line" />
          </span> -->
          <!-- <SvgIcon icon="setting-line" />
          <SvgIcon icon="sync-star" />
          <SvgIcon icon="sync-tag" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import MenuItem from './MenuItem'
import TagSection from './TagSection'
import LanguageSection from './LanguageSection'
import { AuthToken } from '../../../common/utils'
import * as api from '../../../common/api/api'
import { downloadString } from '../../../common/utils'

export default {
  components: {
    MenuItem,
    TagSection,
    LanguageSection
  },
  data() {
    return {
      activeLanguage: null,
      languageListShow: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.common.userInfo,
      activeMenu: state => state.repo.filter.type,
      sideMenuShow: state => state.common.sideMenuShow,
      repoSync: state => state.repo.isSyncing,
      tagSync: state => state.tag.isSyncing,
      appTheme: state => state.common.appTheme,
      tags: state => state.tag.tags
    })
  },
  methods: {
    toggleSideMenu() {
      this.$store.commit('common/toggleSideMenu')
    },
    toggleSetting() {
      this.$store.commit('common/toggleSetting')
    },
    showRepos(type) {
      this.$store.commit('repo/filterRepos', {
        type
      })
    },
    async loadTag() {
      this.$store.dispatch('tag/loadTags')
      // const tags = this.tags
      // const hash = this.$store.getters['tag/localUserTagHash']
      // await api.updateTag({
      //   baseHash: localStorage.localUserTagHashBase,
      //   userTag: {
      //     hash,
      //     tags
      //   }
      // })
      // localStorage.localUserTagHashBase = hash
    },
    exportTag() {
      downloadString(
        JSON.stringify(this.tags),
        'text/json',
        'starflare_export.json'
      )
    },
    importTags() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = async e => {
          const tags = JSON.parse(e.target.result)
          if (!Array.isArray(tags)) return
          this.$store.dispatch('tag/updateAndSaveTags', tags)
        }
        reader.readAsText(file)
      }
      input.click()
    },
    loadRepo() {
      this.$store.dispatch('repo/loadRepos')
    },
    toggleTheme() {
      this.$store.dispatch('common/toggleAppTheme')
    },
    logout() {
      AuthToken.clean()
      location.reload()
    }
  }
}
</script>
