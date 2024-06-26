<style lang="scss" scoped>
.c-tag-conflic {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(136, 180, 218, 0.3);
  .c-container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    // height: 80%;
    background: #141419;
    border-radius: 14px;
    transform: translate(-50%, -50%);
    padding: 10px 20px;
    user-select: none;
    color: #aaa;
    .title {
      margin: 5px;
      text-align: center;
      font-size: 1.3rem;
      color: #fff;
      font-weight: bolder;
    }
    .desc {
      // margin-top: 10px;
      font-size: 1.1rem;
    }
    .download-row {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 1em;
      padding-bottom: 0;
      .export-btn {
        cursor: pointer;
        display: flex;
        align-items: center;
        .icon {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        &:hover {
          color: #fff;
        }
      }
    }
    .option {
      margin: 1rem;
      user-select: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      .indicator {
        width: 16px;
        height: 16px;
        margin-right: 10px;
        border-radius: 1rem;
        border: solid 2px #555;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:hover {
        color: #fff;
        .indicator {
          border-color: var(--APP_BrandColor);
          // &::before {
          //   content: ' ';
          //   width: 8px;
          //   height: 8px;
          //   border-radius: 6px;
          //   background: var(--APP_BrandColor);
          // }
        }
      }
      &.active {
        color: #fff;
        .indicator {
          border-color: var(--APP_BrandColor);
          &::before {
            content: ' ';
            width: 8px;
            height: 8px;
            border-radius: 6px;
            background: var(--APP_BrandColor);
          }
        }
      }
    }
    .tool-bar {
      display: flex;
      margin-top: 20px;
      margin-bottom: 10px;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .btn {
        cursor: pointer;
        &:hover {
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<template>
  <div class="c-tag-conflic">
    <div class="c-container">
      <div class="title">Tag Conflic</div>
      <div
        class="desc"
      >Your local data conflic with cloud data,please choose one belows to slove problem.</div>
      <div class="download-row">
        <span @click="exportData('cloud')" class="export-btn">
          <SvgIcon icon="save-file" class="icon" />Export Cloud
        </span>
        <span @click="exportData('local')" class="export-btn">
          <SvgIcon icon="save-file" class="icon" />Export Local
        </span>
      </div>
      <div @click="selectOption('merge')" :class="{active:activeOption==='merge'}" class="option">
        <div class="indicator"></div>Merge local data with cloud data and sync
      </div>
      <div @click="selectOption('cloud')" :class="{active:activeOption==='cloud'}" class="option">
        <div class="indicator"></div>Delete local data and use cloud data
      </div>
      <div @click="selectOption('local')" :class="{active:activeOption==='local'}" class="option">
        <div class="indicator"></div>Delete cloud data and sync local data to cloud
      </div>
      <div class="tool-bar">
        <div class="btn" @click="close">{{loading?"...":"Cancle"}}</div>
        <div class="btn" @click="confirm">{{loading?"...":"Confirm"}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadString } from '../../common/utils'
import * as api from '../../common/api/api'

export default {
  data() {
    return {
      activeOption: '',
      loading: false
    }
  },
  computed: {
    cloudTag() {
      return this.$store.state.tag.cloudTag
    },
    localTags() {
      return this.$store.state.tag.tags
    },
    localTagHash() {
      return this.$store.getters['tag/localUserTagHash']
    }
  },
  methods: {
    exportData(type) {
      if (type === 'cloud') {
        downloadString(
          JSON.stringify(this.cloudTag.tags),
          'text/json',
          'starflare_export.json'
        )
      }
      if (type === 'local') {
        downloadString(
          JSON.stringify(this.localTags),
          'text/json',
          'starflare_export.json'
        )
      }
    },
    selectOption(name) {
      this.activeOption = name
    },
    close() {
      this.$store.commit('tag/cleanConflic')
    },
    async confirm() {
      if (this.loading) return
      this.loading = true
      switch (this.activeOption) {
        case 'cloud':
          this.$store.dispatch('tag/updateAndSaveTags', this.cloudTag.tags)
          return this.close()
        case 'local':
          break
        case 'merge':
          this.cloudTag.tags.forEach(({ name, repos }) => {
            const exist = this.localTags.find(item => item.name === name)
            if (exist) {
              exist.repos = [...new Set(exist.repos.concat(repos))]
            }
          })
          this.$store.dispatch('tag/updateAndSaveTags', [...this.localTags])
          break
      }
      const res = await api.updateTag({
        baseHash: this.cloudTag.hash,
        userTag: {
          hash: this.localTagHash,
          tags: this.localTags
        }
      })
      if (res.data.message === 'ok') {
        localStorage.localUserTagHashBase = this.localTagHash
        return this.close()
      } else {
        commit('setCloudTag', res.data)
      }
      this.loading = false
    }
  }
}
</script>
