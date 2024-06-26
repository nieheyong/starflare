<style lang="scss" scoped>
.c-language-tag {
  display: flex;
  align-items: center;
  margin: 5px 0;
  border: solid 1px transparent;
  border-radius: 6px;
  padding: 5px 6px;
  padding-left: 13px;
  color: var(--SideMenu_LanguageItem_Color);
  border-color: var(--SideMenu_LanguageItem_BorderColor);
  background: var(--SideMenu_LanguageItem_Background);
  user-select: none;
  cursor: pointer;
  &:hover {
    color: var(--SideMenu_LanguageItem_Color__Hover);
    border-color: var(--SideMenu_LanguageItem_BorderColor__Hover);
    background: var(--SideMenu_LanguageItem_Background__Hover);
  }
  &.is-active {
    color: var(--SideMenu_LanguageItem_Color__Active);
    border-color: var(--SideMenu_LanguageItem_BorderColor__Active);
    background: var(--SideMenu_LanguageItem_Background__Active);
  }
  .lan-color-dot {
    display: inline-block;
    width: 0.8em;
    height: 0.8em;
    border-radius: 12px;
    background: var(--APP_BrandColor);
  }
  .lan-name {
    flex: 1;
    margin-left: 8px;
    min-width: 0;
    overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<template>
  <div class="c-language-tag" :class="{'is-active':active}">
    <span class="lan-color-dot" :style="{background:getLanguageColor(data.name)}"></span>
    <span class="lan-name">{{data.name}}</span>
    <span class="lan-count">{{data.count}}</span>
  </div>
</template>

<script>
import { getLanguageColor } from '../../../common/utils'

export default {
  props: {
    data: {},
    active: {}
  },
  methods: {
    getLanguageColor
  }
}
</script>

