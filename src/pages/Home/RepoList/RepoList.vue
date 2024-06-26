<style lang="scss" scoped>
.c-repo-list {
  display: flex;
  flex-direction: column;
  background: var(--RepoList_Background);
  width: 100%;
  height: 100%;
}
.c-repo-list--header {
  display: flex;
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  align-items: center;
  transition: transform 0.3s;
  z-index: 9;
  background: var(--RepoList_Background);
  padding: 5px 10px;
  height: 42px;
  &.hide {
    transform: translateY(-100%);
  }
  .search-input {
    all: unset;
    flex: 1;
    line-height: 2;
    margin: auto;
    background: var(--RepoList_Search_Background);
    border-radius: 6px;
    padding: 2px 10px;
    color: var(--RepoList_Search_Color);
  }
}

.c-side-menu__toggle {
  display: none;
  font-size: 20px;
}

@media screen and (max-width: 900px) {
  .c-side-menu__toggle {
    display: initial;
    margin-right: 10px;
    cursor: pointer;
    font-weight: bolder;
  }
}

.c-repo-list--body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}
.empty-repo {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div class="c-repo-list">
    <div class="c-repo-list--header">
      <div class="c-side-menu__toggle">
        <SvgIcon @click.native="toggleSideMenu" icon="menu" />
      </div>
      <input class="search-input" type="text" v-model="searchStr" placeholder="search name or desc" />
    </div>
    <DynamicScroller
      v-if="reposShow.length"
      ref="virtualScroller"
      :items="reposShow"
      :min-item-size="60"
      class="c-repo-list--body"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <RepoCard
            @click="$emit('repoClick',item)"
            :repo="item"
            :highlightStr="searchStr"
            :isActive="activeRepo===item"
          />
          <!-- <div v-if="reposShow.length-1===index">no more</div> -->
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <div v-else class="c-repo-list--body">
      <template v-if="$store.state.repo.isFetching">
        <RepoCardSkeleton v-for="n in 20" :key="n" />
      </template>
      <!-- <div v-if="!reposShow.length&&!$store.state.repo.repoFetching" class="empty-repo">No Repos</div> -->
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import RepoCard from './RepoCard'
import RepoCardSkeleton from './RepoCardSkeleton'

import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

export default {
  components: {
    RepoCard,
    RepoCardSkeleton,
    DynamicScroller,
    DynamicScrollerItem
  },
  props: {
    activeRepo: {}
  },
  computed: {
    searchStr: {
      get() {
        return this.$store.state.repo.filter.searchStr
      },
      set(value) {
        this.$store.commit('repo/setSearchStr', value)
      }
    },
    reposShow() {
      return this.$store.getters['repo/reposShow']
    },
    needScrollToTop() {
      return this.$store.state.repo.scrollToTop
    }
  },
  watch: {
    needScrollToTop() {
      const ref = this.$refs.virtualScroller
      ref && ref.scrollToItem(0)
    }
  },
  methods: {
    toggleSideMenu() {
      this.$store.commit('common/toggleSideMenu')
    }
  }
}
</script>

