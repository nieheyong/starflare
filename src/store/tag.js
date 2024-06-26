import * as db from '../common/db'
import * as api from '../common/api/api'
import md5 from 'md5'

const EMPTY_TAG_HASH = 'd751713988987e9331980363e24189ce'

const getTagsHash = userTags => {
  const res = userTags.reduce((prev, tag) => {
    return [...prev, [tag.name, tag.repos]]
  }, [])
  return md5(JSON.stringify(res))
}

export default {
  namespaced: true,
  state: {
    isSyncing: true,
    cloudTag: null,
    tags: []
  },
  getters: {
    tagConflic(state) {
      return !!state.cloudTag
    },
    localUserTagHash(state) {
      return getTagsHash(state.tags)
    }
  },
  mutations: {
    setSyncSatus(state, payload) {
      state.isSyncing = payload
    },
    updateTags(state, tags) {
      state.tags = tags
    },
    setCloudTag(state, tags) {
      state.cloudTag = tags
    },
    cleanConflic(state) {
      state.cloudTag = null
    }
  },
  actions: {
    updateAndSaveTags({ commit }, tags) {
      commit('updateTags', tags)
      db.updateUserTags(tags)
    },
    removeTag({ state, dispatch }, tag) {
      const tags = state.tags.filter(item => item.name !== tag.name)
      dispatch('updateAndSaveTags', tags)
    },
    async loadTags({ getters, commit, dispatch }) {
      const tags = await db.getUserTags()
      commit('updateTags', tags)
      return
      // commit('setSyncSatus', true)
      // const tags = await db.getUserTags()
      // commit('updateTags', tags)
      // const hashBase = localStorage.localUserTagHashBase || EMPTY_TAG_HASH
      // const tagChanged = hashBase !== getters.localUserTagHash
      // if (tagChanged) {
      //   const res = await api.updateTag({
      //     baseHash: hashBase,
      //     userTag: {
      //       hash: getters.localUserTagHash,
      //       tags
      //     }
      //   })
      //   if (res.data.message === 'ok') {
      //     localStorage.localUserTagHashBase = getters.localUserTagHash
      //   } else {
      //     commit('setCloudTag', res.data)
      //   }
      //   //saveTag
      // } else {
      //   const res = await api.getTag(hashBase)
      //   const cloudTags = res.data
      //   localStorage.localUserTagHashBase = cloudTags.hash
      //   if (cloudTags.hash !== hashBase) {
      //     dispatch('updateAndSaveTags', cloudTags.tags)
      //   }
      // }
      // commit('setSyncSatus', false)
    },
    async washTags({ state, commit, dispatch, rootState }) {
      const allRepoIds = new Set(rootState.repo.repos.map(repo => repo.id))
      const freshTags = state.tags.map(tag => {
        tag.repos = tag.repos.filter(id => allRepoIds.has(id))
        return tag
      })
      dispatch('updateAndSaveTags', freshTags)
    }
  }
}
