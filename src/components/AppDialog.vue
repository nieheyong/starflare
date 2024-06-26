<style lang="scss" scoped>
.c-app-card {

}
</style>
<template>
  <div class="c-app-card">
    <div class="title">{{title}}</div>
    <div class="card-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {}
  }
}
</script>

