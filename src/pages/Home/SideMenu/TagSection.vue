<style lang="scss" scoped>
.tag-list {
  margin-left: 10px;
}
.add-tag {
  margin-top: 10px;
  cursor: pointer;
  text-align: center;
  color: var(--SideMenu_Tag_Color);
  user-select: none;
  &:hover {
    color: var(--SideMenu_Tag_Color__Hover);
  }
  svg {
    margin-right: 5px;
    fill: currentColor;
  }
}
.tag-manager-tools {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>

<template>
  <div>
    <MenuItem
      @click.native="listExpand=!listExpand"
      :isActive="activeMenu==='taged'"
      text="My Tags"
      icon="all-tag"
    >
      <span class="menu-expand-icon" :class="{expand:listExpand}">
        <SvgIcon icon="arrow-drop-down" />
      </span>
    </MenuItem>

    <template v-if="listExpand">
      <div class="tag-list">
        <Draggable
          v-model="tags"
          v-bind="dragOptions"
          handle=".js-drag-handle"
          @start="drag=true"
          @end="drag=false"
        >
          <TagSectionItem
            v-for="tag in tags"
            :key="tag.name"
            :data="tag"
            @click.native="showTag(tag)"
            @confirmEdit="renameTag($event,tag)"
            @delete="onDeleteTag(tag)"
            :active="activeTag&&activeTag.name===tag.name"
            :editMode="managerTag"
          />
        </Draggable>
        <TagSectionItem
          v-if="addingTag"
          @cancleEdit="addingTag=false"
          @confirmEdit="addTag"
          :editMode="true"
          :addMode="true"
        />
        <div class="tag-manager-tools">
          <template v-if="!addingTag&&!managerTag">
            <div @click="onClickAddTag" class="add-tag">
              <SvgIcon icon="pluse" />Add
            </div>
            <div v-if="tags.length" @click="onManagerTag" class="add-tag">
              <SvgIcon icon="edit" />Edit
            </div>
          </template>
          <div v-if="managerTag" @click="onStopManagerTag" class="add-tag">
            <SvgIcon icon="check-circle" />Finish
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Draggable from 'vuedraggable'
import MenuItem from './MenuItem'
import TagSectionItem from './TagSectionItem'

export default {
  components: {
    Draggable,
    MenuItem,
    TagSectionItem
  },
  data() {
    return {
      listExpand: false,
      addingTag: false,
      managerTag: false
    }
  },
  created() {
    this.dragOptions = {
      animation: 300,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost'
    }
  },
  computed: {
    tags: {
      get() {
        return this.$store.state.tag.tags
      },
      set(value) {
        this.$store.dispatch('tag/updateAndSaveTags', value)
      }
    },
    ...mapState({
      activeTag: state => state.repo.filter.tag,
      activeMenu: state => state.repo.filter.type
    })
  },
  methods: {
    showTag(tag) {
      if (this.managerTag) return
      this.$store.commit('repo/filterRepos', {
        type: 'taged',
        tag
      })
    },
    onClickAddTag() {
      this.addingTag = true
    },
    onManagerTag() {
      this.managerTag = true
    },
    onStopManagerTag() {
      this.managerTag = false
    },
    addTag(name) {
      this.addingTag = false
      const exist = this.tags.find(item => item.name === name)
      if (!exist && name) {
        this.tags = [...this.tags, { name, repos: [] }]
      }
    },
    renameTag(name, tag) {
      let exist = this.tags.find(item => item.name === name)
      if (exist) return
      this.tags = this.tags.map(item => {
        if (item.name === tag.name) item.name = name
        return item
      })
    }
  }
}
</script>

