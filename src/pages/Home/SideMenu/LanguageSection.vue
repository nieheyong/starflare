<style lang="scss" scoped>
.language-list {
  margin-left: 10px;
}
</style>

<template>
  <div>
    <MenuItem
      @click.native="listExpand=!listExpand"
      :isActive="activeMenu==='language'"
      text="Language"
      icon="code"
    >
      <span class="menu-expand-icon" :class="{expand:listExpand}">
        <SvgIcon icon="arrow-drop-down" />
      </span>
    </MenuItem>

    <div v-if="listExpand" class="language-list">
      <LanguageSectionItem
        v-for="lan in $store.getters['repo/languages']"
        :data="lan"
        :active="activeLanguage===lan.name"
        @click.native="showLanguage(lan)"
        :key="lan.name"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuItem from './MenuItem'
import LanguageSectionItem from './LanguageSectionItem'

export default {
  components: {
    MenuItem,
    LanguageSectionItem
  },
  data() {
    return {
      listExpand: false
    }
  },
  computed: {
    ...mapState({
      activeLanguage: state => state.repo.filter.language,
      activeMenu: state => state.repo.filter.type
    })
  },
  methods: {
    showLanguage(lan) {
      this.$store.commit('repo/filterRepos', {
        type: 'language',
        language: lan.name
      })
    }
  }
}
</script>

