<template>
  <div class="folder-picker">
    <div class="picker-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
      <span>My Drive</span>
    </div>

    <div class="picker-tree" v-if="!loading">
      <div
        v-if="folders.length === 0"
        class="empty-state"
      >
        Không có thư mục nào
      </div>
      <FolderNode
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        :selected-id="selectedId"
        :disabled="disabled"
        @select="selectFolder"
      />
    </div>

    <div v-else class="picker-loading">
      <span class="spinner"></span>
      <span>Đang tải thư mục...</span>
    </div>
  </div>
</template>

<script>
import { listFolders } from '../api'
import FolderNode from './FolderNode.vue'

export default {
  name: 'FolderPicker',
  components: { FolderNode },
  props: {
    disabled: Boolean,
  },
  emits: ['select'],
  data() {
    return {
      folders: [],
      loading: true,
      selectedId: null,
    }
  },
  async mounted() {
    await this.loadFolders()
  },
  methods: {
    async loadFolders() {
      this.loading = true
      try {
        const res = await listFolders()
        this.folders = res.data.folders || []
      } catch (err) {
        console.error('Failed to load folders:', err)
      } finally {
        this.loading = false
      }
    },
    selectFolder(folder) {
      if (this.disabled) return
      this.selectedId = folder.id
      this.$emit('select', folder)
    },
  },
}
</script>

<style scoped>
.folder-picker {
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-sm);
  max-height: 280px;
  overflow-y: auto;
  background: var(--bg-input);
}

.picker-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--accent);
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-card);
  position: sticky;
  top: 0;
  z-index: 1;
}

.picker-tree {
  padding: 6px;
}

.picker-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.8125rem;
}
</style>
