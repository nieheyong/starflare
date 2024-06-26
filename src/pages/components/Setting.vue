<style lang="scss" scoped>
.c-setting {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.c-setting__ct {
  width: 400px;
  height: 200px;
  background: #333;
  border-radius: 6px;
}
</style>

<template>
  <div class="c-setting" @click="toggleSetting">
    <div class="c-setting__ct" @click.stop></div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleSetting() {
      this.$store.commit('common/toggleSetting')
    }
  }
}
</script>
