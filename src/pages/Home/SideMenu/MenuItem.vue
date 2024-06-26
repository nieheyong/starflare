<style lang="scss" scoped>
.c-menu-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 10px 0;
  border: solid 1px transparent;
  border-radius: 6px;
  cursor: pointer;
  padding: 5px;
  color: var(--SideMenu_Menu_Color);
  border-color: var(--SideMenu_Menu_BorderColor);
  background: var(--SideMenu_Menu_Background);
  user-select: none;
  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    border-radius: 4px;
    color: var(--SideMenu_MenuIcon_Color);
    background: var(--SideMenu_MenuIcon_Background);
    width: 24px;
    height: 24px;
    .c-svg-icon {
      width: 16px;
      height: 16px;
    }
  }
  &:hover {
    color: var(--SideMenu_Menu_Color__Hover);
    border-color: var(--SideMenu_Menu_BorderColor__Hover);
    background: var(--SideMenu_Menu_Background__Hover);
    .menu-icon {
      color: var(--SideMenu_MenuIcon_Color__Hover);
      background: var(--SideMenu_MenuIcon_Background__Hover);
    }
  }
  &.active {
    color: var(--SideMenu_Menu_Color__Active);
    border-color: var(--SideMenu_Menu_BorderColor__Active);
    background: var(--SideMenu_Menu_Background__Active);
    .menu-icon {
      color: var(--SideMenu_MenuIcon_Color__Active);
      background: var(--SideMenu_MenuIcon_Background__Active);
    }
  }

  .menu-text {
    flex: 1;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>

<template>
  <div class="c-menu-item" :class="{active:isActive}">
    <div class="menu-icon">
      <SvgIcon :icon="icon" />
    </div>
    <span class="menu-text">{{text}}</span>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: {},
    icon: {},
    isActive: {}
  }
}
</script>

