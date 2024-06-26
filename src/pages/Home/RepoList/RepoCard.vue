<style lang="scss" >
.c-repo-card {
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  background: var(--RepoCard_Background);
  &::before {
    position: absolute;
    content: ' ';
    top: 0;
    left: 0;
    bottom: 0;
    width: 2px;
    border-radius: 0 6px 6px 0;
    background: var(--RepoCard_Indictor_Background);
  }
  &:hover {
    background: var(--RepoCard_Background__Hover);
    &::before {
      background: var(--RepoCard_Indictor_Background__Hover);
    }
    .c-repo-card__tag-toggle-btn {
      display: initial;
    }
  }
  &.is-active {
    background: var(--RepoCard_Background__Active);
    &::before {
      background: var(--RepoCard_Indictor_Background__Active);
    }
    .c-repo-card__tag-toggle-btn {
      display: initial;
    }
  }
}

.c-repo-card__header {
  padding: 0 15px;
  padding-top: 10px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
}

.c-repo-card__title {
  a {
    color: var(--RepoCard_Title_Color);
  }
  a:hover {
    color: var(--SideMenu_Title_Color__Hover);
    text-decoration: underline;
  }
}

.c-repo-card__tag-toggle-btn {
  position: absolute;
  right: 0;
  top: 5px;
  display: none;
  padding: 0 10px;
  font-size: 16px;
  user-select: none;
  color: var(--RepoCard_TagTogger_Color);
  &:hover {
    color: var(--RepoCard_TagTogger_Color__Hover);
  }
}

.c-repo-card__body {
  padding: 0 15px;
  margin-top: 5px;
  color: var(--RepoCard_Body_Color);
  word-break: break-all;
}

.c-repo-card__footer {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  padding: 0 15px;
  padding-bottom: 10px;
  color: var(--RepoCard_Foot_Color);
}

.c-repo-card__footer-item {
  display: flex;
  align-items: center;
}
.c-repo-card__footer-icon {
  margin-right: 3px;
}

.o-color-dot {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 12px;
}
</style>

<template>
  <div class="c-repo-card" :class="{'is-active':isActive}" @click="$emit('click')">
    <div class="c-repo-card__header">
      <div class="c-repo-card__title" @click.stop>
        <a target="_blank" :href="repo.owner.html_url">
          <TextHighlight :queries="[highlightStr]">{{repo.owner.login}}</TextHighlight>
        </a> /
        <a target="_blank" :href="repo.html_url">
          <TextHighlight :queries="[highlightStr]">{{repo.name}}</TextHighlight>
        </a>
      </div>
      <span
        @click.stop="toggleTagEdit"
        slot="reference"
        class="c-repo-card__tag-toggle-btn"
        :title="editTag?'close':'Edit tags'"
      >
        <SvgIcon icon="all-tag" />
      </span>
    </div>
    <div class="c-repo-card__body">
      <TextHighlight :queries="[highlightStr]">{{repo.description}}</TextHighlight>
    </div>
    <RepoCardTags :repoId="repo.id" :editMode.sync="editTag" />
    <div class="c-repo-card__footer">
      <div v-if="repo.language" class="c-repo-card__footer-item">
        <span
          class="o-color-dot c-repo-card__footer-icon"
          :style="{background:getLanguageColor(repo.language)}"
        />
        {{repo.language||'Unknow'}}
      </div>
      <div class="o-flex-expend"></div>
      <div class="c-repo-card__footer-item">
        <SvgIcon icon="star" class="c-repo-card__footer-icon" />
        {{repo.stargazers_count}}
      </div>
      <div style="width:10px;"></div>
      <div class="c-repo-card__footer-item">
        <SvgIcon icon="folk" class="c-repo-card__footer-icon" />
        {{repo.forks_count}}
      </div>
    </div>
  </div>
</template>

<script>
import TextHighlight from 'vue-text-highlight'
import 'vue-popperjs/dist/vue-popper.css'
import { getLanguageColor } from '../../../common/utils'
import RepoCardTags from './RepoCardTags'
import virtualListStore from './virtualListStore'

export default {
  components: {
    TextHighlight,
    RepoCardTags
  },
  props: {
    repo: {},
    isActive: {},
    highlightStr: ''
  },
  computed: {
    editTag: {
      get() {
        return virtualListStore.cards[this.repo.id] || false
      },
      set(value) {
        virtualListStore.updateCardData({
          id: this.repo.id,
          data: value
        })
      }
    }
  },
  methods: {
    getLanguageColor,
    async toggleTagEdit() {
      this.editTag = !this.editTag
      this.updateCardSize()
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

