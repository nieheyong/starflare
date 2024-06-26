<style lang="scss" scoped>
.c-menu-tag {
  display: flex;
  align-items: center;
  margin: 5px 0;
  border: solid 1px transparent;
  border-radius: 6px;
  border-color: var(--SideMenu_Tag_BorderColor);
  background: var(--SideMenu_Tag_Background);
  cursor: pointer;
  padding: 5px 6px;
  color: var(--SideMenu_Tag_Color);
  user-select: none;
  &:hover {
    border-color: var(--SideMenu_Tag_BorderColor__Hover);
    background: var(--SideMenu_Tag_Background__Hover);
    color: var(--SideMenu_Tag_Color__Hover);
  }
  &.is-active {
    border-color: var(--SideMenu_Tag_BorderColor__Active);
    background: var(--SideMenu_Tag_Background__Active);
    color: var(--SideMenu_Tag_Color__Active);
  }
  &.is-edit {
    cursor: initial;
    border-color: var(--SideMenu_Tag_BorderColor__Active);
    background: var(--SideMenu_Tag_Background__Active);
  }
  &.ghost {
    opacity: 0.2;
  }
}

@mixin tagName {
  flex: 1;
  margin-left: 4px;
  padding: 0 4px;
  min-width: 0;
}

.c-menu-tag__name {
  @include tagName();
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

.c-menu-tag__input {
  @include tagName();
  border-radius: 3px;
  background: var(--SideMenu_TagInput_Background);
  color: var(--SideMenu_TagInput_Color);
}

.c-menu-tag__toolbar {
}

.c-menu-tag__toolbar-icon {
  cursor: pointer;
  color: var(--SideMenu_TagToolButton_Color);
  margin-left: 5px;
  &:hover {
    color: var(--SideMenu_TagToolButton_Color__Hover);
  }
}
.js-drag-handle,
.drag-handle-icon {
  cursor: move;
}
</style>

<template>
  <div class="c-menu-tag" :class="{'is-active':active&&!editMode,'is-edit':editMode}">
    <span v-if="editMode&!editing" class="js-drag-handle">
      <SvgIcon icon="menu2" class="c-menu-tag__toolbar-icon drag-handle-icon" />
    </span>
    <input
      v-if="editing"
      v-model="name"
      @keyup.enter="confirmEdit"
      ref="input"
      class="o-input c-menu-tag__input"
      type="text"
    />
    <span v-else @dblclick="onDbclickName" class="c-menu-tag__name">{{data.name}}</span>
    <span v-if="!editMode" class="c-menu-tag__number">{{data.repos.length}}</span>
    <span v-if="editMode" class="c-menu-tag__toolbar" title="edit tag">
      <template v-if="editing">
        <span title="Save">
          <SvgIcon @click.native="confirmEdit" icon="check" class="c-menu-tag__toolbar-icon" />
        </span>
        <span title="Cancle">
          <SvgIcon @click.native="cancleEdit" icon="close" class="c-menu-tag__toolbar-icon" />
        </span>
      </template>
      <template v-else>
        <span title="Edit tag">
          <SvgIcon @click.native="startEdit" icon="edit" class="c-menu-tag__toolbar-icon" />
        </span>
        <span title="Confirm delete" v-if="showConfirmDelete">
          <SvgIcon
            @click.native="confirmDelete"
            style="color:#d22"
            icon="warning"
            class="c-menu-tag__toolbar-icon"
          />
        </span>
        <span title="Delete tag" v-else>
          <SvgIcon @click.native="deleteTag" icon="trash" class="c-menu-tag__toolbar-icon" />
        </span>
      </template>
    </span>
  </div>
</template>

<script>
import { delay } from '../../../common/utils'
export default {
  props: {
    active: {},
    data: {},
    editMode: {},
    addMode: {}
  },
  data() {
    return {
      name: '',
      showConfirmDelete: false,
      editing: false
    }
  },
  watch: {
    data() {
      this.name = this.data.name
    },
    editMode() {
      if (!this.editMode) {
        this.editing = false
      }
    }
  },
  async created() {
    if (this.addMode) {
      this.editing = true
      await this.$nextTick()
      this.$refs['input'].focus()
    } else {
      this.name = this.data.name
    }
  },
  methods: {
    onDbclickName() {
      if (this.editMode) this.startEdit()
    },
    async deleteTag() {
      this.showConfirmDelete = true
      this._timeoutId = setTimeout(() => {
        this.showConfirmDelete = false
      }, 4000)
    },
    confirmDelete() {
      this.$store.dispatch('tag/removeTag', this.data)
    },
    async startEdit() {
      this.showConfirmDelete = false
      clearTimeout(this._timeoutId)
      this.editing = true
      this.name = this.data.name
      await this.$nextTick()
      this.$refs['input'].focus()
    },
    confirmEdit() {
      if (!this.name) return
      this.editing = false
      this.$emit('confirmEdit', this.name.slice(0, 15))
    },
    cancleEdit() {
      this.editing = false
      this.$emit('cancleEdit')
    }
  }
}
</script>
