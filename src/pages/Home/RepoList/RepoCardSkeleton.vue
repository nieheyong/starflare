<style lang="scss" scoped>
.c-repo-card-skeleton {
  background: var(--RepoCard_Background);
  padding: 10px 15px;
  height: 100px;
}

.c-repo-card-skeleton__footer {
  margin-top: 6px;
  display: flex;
  align-items: center;
  padding: 5px 0;
}
</style>

<template>
  <div class="c-repo-card-skeleton">
    <div class="o-skeleton-loader" style=" height: 12px;width: 100px;margin: 8px 0;"></div>
    <div class="o-skeleton-loader" style=" margin-top: 5px;height: 30px;width: 100%;"></div>
    <div class="c-repo-card-skeleton__footer">
      <!-- <div class="o-skeleton-loader c-repo-card-skeleton__avatar" /> -->
      <div class="o-skeleton-loader" style="height: 12px; width: 12px;border-radius:12px" />
      <div class="o-skeleton-loader" style="height: 12px; width: 50px;margin-left:6px" />
      <div style="flex:1"></div>
      <div class="o-skeleton-loader" style="height: 12px; width: 40px;" />
      <div class="o-skeleton-loader" style="height: 12px; width: 40px;margin-left:6px" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

