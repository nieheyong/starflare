<style lang="scss" scoped>
.repo-card-tags {
  user-select: none;
  padding: 0 15px;
  margin-top: 6px;
  &.edit {
    cursor: initial;
    .c-tag-item {
      cursor: pointer;
      &:hover {
        color: var(--RepoCard_Tag_Color__Hover);
        background: var(--RepoCard_Tag_Background__Hover);
        border-color: var(--RepoCard_Tag_BorderColor__Hover);
      }
    }
  }
  .tag-list-enter,
  .tag-list-leave-to {
    opacity: 0;
    transform: translateY(5px);
  }
  .tag-list-leave-active {
    position: absolute;
  }
  .c-tag-item {
    display: inline-block;
    transition: transform 0.3s;
    margin: 3px 2px;
    border: solid 1px transparent;
    border-radius: 3px;
    padding: 2px 5px;
    line-height: 1;
    font-size: 12px;
    color: var(--RepoCard_Tag_Color);
    background: var(--RepoCard_Tag_Background);
    border-color: var(--RepoCard_Tag_BorderColor);
    &.selected {
      color: var(--RepoCard_Tag_Color__Active) !important;
      background: var(--RepoCard_Tag_Background__Active) !important;
      border-color: var(--RepoCard_Tag_BorderColor__Active) !important;
    }
  }
  .c-repo-tags-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 14px;
    .action-button {
      padding: 0 10px;
      border: solid 1px transparent;
      border-radius: 4px;
      cursor: pointer;
      &.cancle {
        color: var(--RepoCard_Tag_CancleButton_Color);
        background: var(--RepoCard_Tag_CancleButton_Background);
        border-color: var(--RepoCard_Tag_CancleButton_BorderColor);
        &:hover {
          color: var(--RepoCard_Tag_CancleButton_Color__Hover);
          background: var(--RepoCard_Tag_CancleButton_Background__Hover);
          border-color: var(--RepoCard_Tag_CancleButton_BorderColor__Hover);
        }
      }
      &.confirm {
        color: var(--RepoCard_Tag_ConfirmButton_Color);
        background: var(--RepoCard_Tag_ConfirmButton_Background);
        border-color: var(--RepoCard_Tag_ConfirmButton_BorderColor);
        &:hover {
          color: var(--RepoCard_Tag_ConfirmButton_Color__Hover);
          background: var(--RepoCard_Tag_ConfirmButton_Background__Hover);
          border-color: var(--RepoCard_Tag_ConfirmButton_BorderColor__Hover);
        }
      }
      .c-svg-icon {
        margin-left: -4px;
        margin-right: 4px;
      }
    }
  }
}
</style>

<template>
  <div @click="onContainerClick" class="repo-card-tags" :class="{edit:editMode}">
    <transition-group name="tag-list" tag="div">
      <div
        v-for="tag in activeRepoTags"
        :key="tag.name"
        :class="{selected:tag.selected}"
        @click.stop="toggleRepoTag(tag)"
        class="c-tag-item"
      >{{tag.name}}</div>
    </transition-group>
    <div class="c-repo-tags-footer" v-if="editMode">
      <template v-if="needConfirm">
        <span class="action-button cancle" @click.stop="closeEdit">
          <SvgIcon icon="close" />Cancle
        </span>
        <span class="action-button confirm" @click.stop="confirmEdit">
          <SvgIcon icon="check" />Confirm
        </span>
      </template>
      <span v-else class="action-button confirm" @click.stop="closeEdit">
        <SvgIcon icon="check" />Close
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import virtualListStore from './virtualListStore'

export default {
  props: {
    repoId: {
      required: true
    },
    editMode: {
      default: false
    }
  },
  computed: {
    ...mapState({
      needConfirm: state => state.repo.filter.type === 'untaged',
      allTags: state => state.tag.tags
    }),
    repoTags() {
      let repoTags = this.allTags.map(tag => ({
        name: tag.name,
        selected: tag.repos.includes(this.repoId)
      }))
      if (!this.editMode) {
        repoTags = repoTags.filter(tag => tag.selected)
      }
      return repoTags
    },
    activeRepoTags() {
      return this.needConfirm ? this.localRepoTags : this.repoTags
    },
    localRepoTags: {
      get() {
        return virtualListStore.tags[this.repoId] || []
      },
      set(value) {
        virtualListStore.updateTagData({
          id: this.repoId,
          data: value
        })
      }
    }
  },
  watch: {
    async repoTags() {
      this.updateLocalRepoTags()
      this.updateCardSize()
    }
  },
  beforeMount() {
    this.updateLocalRepoTags()
  },
  methods: {
    onContainerClick($event) {
      if (this.editMode) $event.stopPropagation()
    },
    updateLocalRepoTags() {
      if (this.needConfirm) {
        let localRepoTags = JSON.parse(JSON.stringify(this.repoTags))
        localRepoTags = localRepoTags.map(tag => {
          const exist = this.localRepoTags.find(t => t.name === tag.name)
          if (exist) tag.selected = exist.selected
          return tag
        })
        this.localRepoTags = localRepoTags
      }
    },
    toggleRepoTag(tag) {
      if (!this.editMode) return
      if (this.needConfirm) {
        tag.selected = !tag.selected
        this.localRepoTags = [...this.localRepoTags]
      } else {
        tag = this.allTags.find(t => t.name === tag.name)
        if (tag.repos.includes(this.repoId)) {
          tag.repos = tag.repos.filter(id => id != this.repoId)
        } else {
          tag.repos.push(this.repoId)
        }
        this.$store.dispatch('tag/updateAndSaveTags', [...this.allTags])
      }
    },
    closeEdit() {
      this.$emit('update:editMode', false)
      this.updateCardSize()
    },
    confirmEdit() {
      this.localRepoTags.forEach(tag => {
        const exist = this.allTags.find(t => t.name === tag.name)
        if (exist) {
          const included = exist.repos.includes(this.repoId)
          if (tag.selected && !included) {
            exist.repos.push(this.repoId)
          }
          if (!tag.selected && included) {
            exist.repos = exist.repos.filter(id => id !== this.repoId)
          }
        }
      })
      this.$store.dispatch('tag/updateAndSaveTags', [...this.allTags])
      this.closeEdit()
    },
    async updateCardSize() {
      let parent = this.$parent
      while (parent.$options.name !== 'DynamicScrollerItem') {
        if (!parent.$parent) return
        parent = parent.$parent
      }
      parent.updateSize()
    }
  }
}
</script>

