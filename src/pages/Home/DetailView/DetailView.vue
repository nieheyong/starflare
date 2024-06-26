
<style lang="scss" >
.c-detail-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--RpoeDetail_Background);
  min-width: 0;
  position: relative;
  z-index: 9;
}

.c-detail-toolbar {
  padding: 10px 15px 0;
  display: flex;
  font-size: 18px;
}

.c-detail-toolbar__item {
  user-select: none;
  cursor: pointer;
  display: inline-block;
  margin-right: 20px;
  color: var(--RpoeDetail_IconButton_Color);
  &:hover {
    color: var(--RpoeDetail_IconButton_Color__Hover);
  }
}
.c-detail-toolbar__expand {
  flex: 1;
}
.c-detail-toolbar__close-btn {
  margin-right: 0;
  display: none;
}

@media screen and (max-width: 700px) {
  .c-detail-toolbar__close-btn {
    display: block;
  }
}

.c-detail--header {
  display: flex;
  align-items: center;
  margin: 0 15px;
  margin-bottom: 10px;
  background: var(--RpoeDetail_Background);
  .repo-title {
    margin-top: 5px;
    font-size: 1.1rem;
    font-weight: bolder;
  }
  > a {
    font-weight: bolder;
  }
}

.l-loading-ct {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<template>
  <div class="c-detail-page">
    <div class="c-detail-toolbar">
      <!-- <span class="c-detail-toolbar__item" title="Copy git url">
        <SvgIcon icon="copy" />
      </span>
      <span class="c-detail-toolbar__item" title="Unstar">
        <SvgIcon icon="star" />
      </span>
      <span class="c-detail-toolbar__item" title="Download zip">
        <SvgIcon icon="zip" />
      </span>-->
      <div class="c-detail-toolbar__expand"></div>
      <span @click="close" class="c-detail-toolbar__item c-detail-toolbar__close-btn" title="close">
        <SvgIcon icon="close" />
      </span>
    </div>
    <div class="c-detail--header">
      <div class="repo-title">
        <a target="_blank" :href="repo.owner.html_url">{{repo.owner.login}}</a> /
        <a target="_blank" :href="repo.html_url">{{repo.name}}</a>
      </div>
    </div>
    <div v-if="loading" class="o-loading l-loading-ct" />
    <Readme :markdown="markdown" :repo="repo" />
  </div>
</template>

<script>
import { delay } from '../../../common/utils'
import * as githubApi from '../../../common/api/githubApi'
import * as db from '../../../common/db'

import Readme from './Readme'

export default {
  components: {
    Readme
  },
  props: {
    repo: {}
  },
  data() {
    return {
      loading: false,
      markdown: null
    }
  },
  watch: {
    repo(value) {
      if (value) this.repoChange()
    }
  },
  created() {
    this.repoChange()
  },
  methods: {
    async repoChange() {
      if (!this.repo) return
      this.markdown = null
      try {
        const exist = await db.getReadme(this.repo.id)
        this.loading = true
        if (exist) {
          this.markdown = exist.content
          this.loading = false
        }
        const res = await githubApi.getReadme(
          this.repo.owner.login,
          this.repo.name
        )
        const { owner, name, id } = this.repo
        if (!res.config.url.includes(`${owner.login}/${name}`)) return
        db.setReadme({ id, content: res.data })
        this.loading = false
        this.markdown = res.data
      } catch (e) {
        this.loading = false
        throw e
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
