import Vue from 'vue'

export default new Vue({
  data() {
    return {
      cards: {},
      tags: {}
    }
  },
  methods: {
    updateCardData({ id, data }) {
      Vue.set(this.cards, id, data)
    },
    updateTagData({ id, data }) {
      Vue.set(this.tags, id, data)
    },
    clean() {
      this.cards = {}
      this.tags = {}
    }
  }
})
