<template>
  <div class="folder-node">
    <div
      class="node-row"
      :class="{ selected: selectedId === folder.id, disabled: disabled }"
      @click="handleClick"
    >
      <button
        class="expand-btn"
        @click.stop="toggleExpand"
        :class="{ expanded: expanded, invisible: !hasChildren }"
        :disabled="disabled"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="folder-icon">
        <path v-if="expanded"
          d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
          fill="var(--accent)" opacity="0.8" stroke="var(--accent)" stroke-width="1"/>
        <path v-else
          d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
          fill="var(--warning)" opacity="0.8" stroke="var(--warning)" stroke-width="1"/>
      </svg>
      <span class="node-name">{{ folder.name }}</span>
    </div>

    <div v-if="expanded" class="node-children">
      <div v-if="loadingChildren" class="children-loading">
        <span class="spinner" style="width:12px;height:12px;border-width:1.5px"></span>
        <span>Đang tải...</span>
      </div>
      <div v-else-if="children.length === 0" class="children-empty">
        Trống
      </div>
      <FolderNode
        v-else
        v-for="child in children"
        :key="child.id"
        :folder="child"
        :selected-id="selectedId"
        :disabled="disabled"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script>
import { listFolders } from '../api'

export default {
  name: 'FolderNode',
  props: {
    folder: Object,
    selectedId: String,
    disabled: Boolean,
  },
  emits: ['select'],
  data() {
    return {
      expanded: false,
      children: [],
      loadingChildren: false,
      loaded: false,
      hasChildren: true, // assume true until proven otherwise
    }
  },
  methods: {
    handleClick() {
      if (this.disabled) return
      this.$emit('select', this.folder)
    },
    async toggleExpand() {
      if (this.disabled) return
      this.expanded = !this.expanded
      if (this.expanded && !this.loaded) {
        await this.loadChildren()
      }
    },
    async loadChildren() {
      this.loadingChildren = true
      try {
        const res = await listFolders(this.folder.id)
        this.children = res.data.folders || []
        this.hasChildren = this.children.length > 0
        this.loaded = true
      } catch (err) {
        console.error('Failed to load children:', err)
      } finally {
        this.loadingChildren = false
      }
    },
  },
}
</script>

<style scoped>
.folder-node {
  user-select: none;
}

.node-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition);
  font-size: 0.8125rem;
}
.node-row:hover:not(.disabled) {
  background: var(--bg-card-hover);
}
.node-row.selected {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
}
.node-row.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--text-tertiary);
  transition: transform var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.expand-btn.expanded {
  transform: rotate(90deg);
}
.expand-btn.invisible {
  visibility: hidden;
}

.folder-icon {
  flex-shrink: 0;
}

.node-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-children {
  padding-left: 22px;
  border-left: 1px solid var(--border-light);
  margin-left: 10px;
}

.children-loading,
.children-empty {
  padding: 6px 8px;
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
