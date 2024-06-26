
<style lang="scss">
.c-home-page {
  display: flex;
  flex-direction: row;
}

.l-home-ct {
  flex: 1;
  display: flex;
  // border: solid 1px #333;
  // border-right: none;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  mask-image: -webkit-radial-gradient(white, black);
}

@media screen and (max-width: 900px) {
  .l-home-ct {
    border: none;
    border-radius: 0;
  }
}

.l-repolist-ct {
  width: 320px;
  position: relative;
  z-index: 1;
}

@media screen and (max-width: 1024px) {
  .l-repolist-ct {
    // width: 280px;
  }
}

.l-detail-ct {
  flex: 1;
  min-width: 0;
  position: relative;
}

@media screen and (max-width: 700px) {
  .l-repolist-ct {
    width: 100%;
  }

  .l-detail-ct {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

.c-app-placeholder {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  z-index: -1;
  width: 100%;
  height: 100%;
  img {
    width: 300px;
  }
}
</style>

<template>
  <div class="c-home-page">
    <SideMenu />
    <div class="l-home-ct">
      <div class="l-repolist-ct">
        <RepoList :activeRepo="activeRepo" @repoClick="repoSelect" />
      </div>
      <div class="l-detail-ct">
        <DetailView v-if="activeRepo" @close="closeDetail" :repo="activeRepo" />
        <div v-else class="c-app-placeholder">
          <img src="../../assets/hacker.svg" alt="walcome" />
        </div>
      </div>
    </div>
    <TagConflic v-if="tagConflic" />
    <Setting v-if="settingShow" />
  </div>
</template>

<script>
import { delay, getPageFromLinkStr } from '../../common/utils'
import * as githubApi from '../../common/api/githubApi'
import SideMenu from './SideMenu/SideMenu'
import RepoList from './RepoList/RepoList'
import DetailView from './DetailView/DetailView'
import TagConflic from '../components/TagConflic'
import Setting from '../components/Setting'

export default {
  components: {
    SideMenu,
    RepoList,
    DetailView,
    TagConflic,
    Setting
  },
  data() {
    return {
      activeRepo: null
    }
  },
  computed: {
    tagConflic() {
      return this.$store.getters['tag/tagConflic']
    },
    settingShow() {
      return this.$store.state.common.settingShow
    }
  },
  async beforeCreate() {
    this.$store.dispatch('tag/loadTags')
    this.$store.dispatch('repo/loadRepos')
  },
  methods: {
    repoSelect(repo) {
      this.activeRepo = repo
    },
    closeDetail() {
      this.activeRepo = null
    }
  }
}
</script>
