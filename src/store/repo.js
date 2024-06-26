import * as db from '../common/db'
import { delay, getPageFromLinkStr } from '../common/utils'
import * as githubApi from '../common/api/githubApi'
import virtualListStore from '../pages/Home/RepoList/virtualListStore'

export default {
  namespaced: true,
  state: {
    repos: [],
    isFetching: true,
    isSyncing: true,
    filter: {
      searchStr: '',
      type: 'all',
      tag: null,
      language: null
    },
    scrollToTop: Date.now()
  },
  getters: {
    untagedRepos(state, getters, rootState) {
      const tagedIds = rootState.tag.tags.reduce(
        (prev, tag) => prev.concat(tag.repos),
        []
      )
      const tagedIdSet = new Set(tagedIds)
      return state.repos.filter(repo => !tagedIdSet.has(repo.id))
    },
    filterByMenu(state, getters) {
      const { type, tag, language } = state.filter
      if (type === 'untaged') return getters.untagedRepos
      const allRepos = state.repos
      if (type === 'taged')
        return allRepos.filter(repo => tag.repos.includes(repo.id))
      if (type === 'language')
        return allRepos.filter(repo => repo.language === language)
      if (type === 'all') return allRepos
    },
    filterBySearch(state, getters) {
      const searchStr = state.filter.searchStr.toLowerCase()
      const repos = getters.filterByMenu
      if (searchStr) {
        const result = []
        const searchKey = key => {
          return repo => {
            let value = repo[key] || ''
            value = value.toLowerCase()
            const valid = value.includes(searchStr)
            if (valid) {
              result.push(repo)
              return false
            }
            return true
          }
        }
        repos.filter(searchKey('name')).filter(searchKey('description'))
        return result
      }
      return repos
    },
    reposShow(state, getters) {
      return getters.filterBySearch
    },
    languages(state) {
      let language = state.repos.reduce((prev, repo) => {
        const lan = repo.language
        if (lan) {
          if (!prev.has(lan)) prev.set(lan, 1)
          else prev.set(lan, prev.get(lan) + 1)
        }
        return prev
      }, new Map())

      language = [...language.entries()]
        .map(([name, count]) => ({
          name,
          count
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
      return language
    }
  },
  mutations: {
    setSearchStr(state, searchStr) {
      state.filter.searchStr = searchStr
      state.scrollToTop = Date.now()
    },
    closeRepoLoading(state) {
      state.isFetching = false
    },
    setSyncSatus(state, payload) {
      state.isSyncing = payload
    },
    updateRepos(state, repos) {
      state.repos = repos
    },
    filterRepos(state, data) {
      state.scrollToTop = Date.now()
      state.filter = Object.assign(
        {
          searchStr: '',
          type: 'all',
          tag: null,
          language: null
        },
        data
      )
      virtualListStore.clean()
    }
  },
  actions: {
    async loadRepos({ commit, dispatch }) {
      commit('setSyncSatus', true)
      const localRepos = await db.getRepos()
      commit('updateRepos', localRepos || [])
      const newStar = []
      const patch = repoRes => {
        repoRes.data.forEach(repo => {
          const index = localRepos.findIndex(item => repo.id === item.id)
          if (-1 < index) localRepos[index] = repo
          else newStar.push(repo)
        })
        const repos = newStar.concat(localRepos)
        commit('updateRepos', repos)
        db.updateRepos(repos)
      }

      const firstPageRes = await githubApi.getLoginUserStarred(100, 1)
      patch(firstPageRes)
      commit('closeRepoLoading')

      let pageCount = getPageFromLinkStr(firstPageRes.headers.link)
      const freshRepoRes = [firstPageRes]
      let page = 2
      while (page <= pageCount) {
        const limit = 2
        let remainPages = pageCount - page
        let count = remainPages >= limit ? limit : remainPages + 1
        const plist = []
        while (count--) {
          plist.push(githubApi.getLoginUserStarred(100, page++))
        }
        const resList = await Promise.all(plist)
        for (let res of resList) {
          await patch(res)
          freshRepoRes.push(res)
        }
      }
      const freshRepos = freshRepoRes.reduce(
        (prev, res) => prev.concat(res.data),
        []
      )
      db.updateRepos(freshRepos)
      commit('updateRepos', freshRepos)
      commit('setSyncSatus', false)
      dispatch('tag/washTags', null, { root: true })
    }
  }
}
