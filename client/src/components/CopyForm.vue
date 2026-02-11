<template>
  <div class="copy-form">
    <!-- Step 1: Source URLs -->
    <div class="card form-section">
      <div class="section-header">
        <div class="section-icon step-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div>
          <h2>Bước 1: Link thư mục nguồn</h2>
          <p class="section-desc">Dán một hoặc nhiều link Google Drive, mỗi link một dòng hoặc cách nhau bằng dấu phẩy</p>
        </div>
      </div>

      <div class="input-group">
        <label for="source-url">Link thư mục Google Drive</label>
        <div class="input-with-action">
          <textarea
            id="source-url"
            class="input source-textarea"
            v-model="sourceUrlInput"
            placeholder="https://drive.google.com/drive/folders/abc123&#10;https://drive.google.com/drive/folders/def456"
            @input="onSourceInputChange"
            :disabled="copying"
            rows="2"
          ></textarea>
          <button
            class="btn btn-primary btn-sm"
            @click="checkAllSources"
            :disabled="!sourceUrlInput.trim() || checkingSource || copying"
            id="check-source-btn"
          >
            <span v-if="checkingSource" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>Kiểm tra</span>
          </button>
        </div>
      </div>

      <!-- Verified Sources List -->
      <div v-if="sources.length" class="sources-list fade-in">
        <div
          v-for="(src, i) in sources"
          :key="i"
          class="source-card"
          :class="{ 'source-ok': src.status === 'ok', 'source-err': src.status === 'error', 'source-checking': src.status === 'checking' }"
        >
          <div class="source-card-header">
            <div class="source-index">{{ i + 1 }}</div>
            <div class="source-card-body">
              <div class="source-name">
                <span v-if="src.status === 'checking'" class="spinner" style="width:12px;height:12px;border-width:2px"></span>
                <svg v-else-if="src.status === 'ok'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <strong v-if="src.info">{{ src.info.name }}</strong>
                <span v-else class="source-url-preview">{{ src.url.slice(0, 60) }}{{ src.url.length > 60 ? '...' : '' }}</span>
              </div>
              <div v-if="src.info" class="source-meta">
                {{ src.info.itemCount }} items
                <span v-if="src.info.owners && src.info.owners.length"> · {{ src.info.owners.map(o => o.displayName || o.emailAddress).join(', ') }}</span>
              </div>
              <div v-if="src.error" class="source-error-msg">{{ src.error }}</div>
            </div>
            <button
              v-if="!copying"
              class="btn-remove-source"
              @click="removeSource(i)"
              title="Xóa"
            >&times;</button>
          </div>
        </div>
      </div>

      <div v-if="sourceError" class="info-card info-error fade-in">
        <div class="info-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ sourceError }}</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Destination -->
    <div class="card form-section" v-if="validSources.length">
      <div class="section-header">
        <div class="section-icon step-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <h2>Bước 2: Chọn nơi lưu</h2>
          <p class="section-desc">Chọn thư mục đích trong Drive của bạn</p>
        </div>
      </div>

      <div class="dest-options">
        <label class="radio-card" :class="{ active: destMode === 'new' }">
          <input type="radio" v-model="destMode" value="new" :disabled="copying" />
          <div class="radio-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <div>
              <div class="radio-title">Tạo thư mục mới</div>
              <div class="radio-desc">
                <template v-if="validSources.length === 1">Tự động tạo "[Copy] {{ validSources[0].info.name }}" trong My Drive</template>
                <template v-else>Tạo {{ validSources.length }} thư mục "[Copy] ..." trong My Drive</template>
              </div>
            </div>
          </div>
        </label>
        <label class="radio-card" :class="{ active: destMode === 'pick' }">
          <input type="radio" v-model="destMode" value="pick" :disabled="copying" />
          <div class="radio-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <div>
              <div class="radio-title">Chọn thư mục có sẵn</div>
              <div class="radio-desc">Duyệt và chọn thư mục đích từ Drive của bạn</div>
            </div>
          </div>
        </label>
      </div>

      <!-- Folder Picker -->
      <div v-if="destMode === 'pick'" class="folder-picker-wrapper fade-in">
        <FolderPicker
          :disabled="copying"
          @select="onFolderSelected"
        />
        <div v-if="selectedFolder" class="selected-folder">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Đã chọn: <strong>{{ selectedFolder.name }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Step 3: Options -->
    <div class="card form-section" v-if="validSources.length">
      <div class="section-header">
        <div class="section-icon step-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div>
          <h2>Tùy chọn (không bắt buộc)</h2>
          <p class="section-desc">Bỏ qua files chứa nội dung không mong muốn</p>
        </div>
      </div>

      <div class="input-group">
        <label for="exclude-strings">Bỏ qua files/folders chứa cụm từ</label>
        <input
          id="exclude-strings"
          type="text"
          class="input"
          v-model="excludeInput"
          placeholder="Ví dụ: .mp4, .srt, homework (cách nhau bằng dấu phẩy)"
          :disabled="copying"
        />
        <span class="input-hint">Tách bằng dấu phẩy. Ví dụ: <code>.mp4, .srt</code> sẽ bỏ qua files có tên chứa ".mp4" hoặc ".srt"</span>
      </div>

      <div v-if="parsedExcludes.length" class="exclude-tags">
        <span class="tag" v-for="(tag, i) in parsedExcludes" :key="i">
          {{ tag }}
          <button class="tag-remove" @click="removeExclude(i)" :disabled="copying">&times;</button>
        </span>
      </div>
    </div>

    <!-- Start Copy Button -->
    <div v-if="validSources.length" class="copy-action fade-in">
      <div class="copy-summary card">
        <div class="summary-row">
          <span class="summary-label">Nguồn:</span>
          <span class="summary-value">
            <template v-if="validSources.length === 1">{{ validSources[0].info.name }}</template>
            <template v-else>{{ validSources.length }} thư mục</template>
          </span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Đích:</span>
          <span class="summary-value">
            <template v-if="destMode === 'new'">
              <template v-if="validSources.length === 1">[Copy] {{ validSources[0].info.name }} (My Drive)</template>
              <template v-else>{{ validSources.length }} thư mục "[Copy] ..." (My Drive)</template>
            </template>
            <template v-else>{{ selectedFolder ? selectedFolder.name : 'Chưa chọn' }}</template>
          </span>
        </div>
        <div class="summary-row" v-if="parsedExcludes.length">
          <span class="summary-label">Loại trừ:</span>
          <span class="summary-value">{{ parsedExcludes.join(', ') }}</span>
        </div>
      </div>

      <!-- Copy button: 3 states -->
      <button
        v-if="!copyDone"
        class="btn btn-primary btn-lg start-copy-btn"
        @click="startCopy"
        :disabled="copying || (destMode === 'pick' && !selectedFolder)"
        id="start-copy-btn"
      >
        <svg v-if="!copying" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span v-if="copying" class="spinner"></span>
        <span>{{ copying ? 'Đang copy...' : `Bắt đầu Copy${validSources.length > 1 ? ` (${validSources.length} thư mục)` : ''}` }}</span>
      </button>

      <!-- After copy done: show "Copy link khác" -->
      <button
        v-else
        class="btn btn-lg new-copy-btn"
        @click="resetForm"
        id="new-copy-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
        <span>Copy link khác</span>
      </button>
    </div>
  </div>
</template>

<script>
import { checkUrl, checkAccess, startCopy } from '../api'
import FolderPicker from './FolderPicker.vue'

export default {
  name: 'CopyForm',
  components: { FolderPicker },
  props: ['user', 'copyDone'],
  emits: ['copy-started', 'reset'],
  data() {
    return {
      sourceUrlInput: '',
      sources: [],       // [{ url, status: 'pending'|'checking'|'ok'|'error', info, error }]
      sourceError: null,
      checkingSource: false,
      destMode: 'new',
      selectedFolder: null,
      excludeInput: '',
      copying: false,
    }
  },
  computed: {
    parsedExcludes() {
      if (!this.excludeInput) return []
      return this.excludeInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    },
    validSources() {
      return this.sources.filter(s => s.status === 'ok' && s.info)
    },
  },
  methods: {
    parseUrls(text) {
      // Split by comma, newline, or space sequences
      return text
        .split(/[,\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && (s.startsWith('http') || s.match(/[-\w]{25,}/)))
    },
    onSourceInputChange() {
      this.sourceError = null
    },
    removeSource(index) {
      this.sources.splice(index, 1)
    },
    removeExclude(index) {
      const parts = this.excludeInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      parts.splice(index, 1)
      this.excludeInput = parts.join(', ')
    },
    async checkAllSources() {
      const urls = this.parseUrls(this.sourceUrlInput)
      if (!urls.length) {
        this.sourceError = 'Không tìm thấy link Google Drive hợp lệ'
        return
      }

      this.checkingSource = true
      this.sourceError = null
      this.sources = urls.map(url => ({ url, status: 'checking', info: null, error: null }))

      // Check each URL in parallel
      const promises = this.sources.map(async (src, i) => {
        try {
          const urlRes = await checkUrl(src.url)
          const folderId = urlRes.data.folderId
          const accessRes = await checkAccess(folderId)
          this.sources[i].info = accessRes.data
          this.sources[i].status = 'ok'
        } catch (err) {
          this.sources[i].error = err.response?.data?.error || err.message || 'Không thể kiểm tra'
          this.sources[i].status = 'error'
        }
      })

      await Promise.all(promises)
      this.checkingSource = false

      if (!this.validSources.length) {
        this.sourceError = 'Không có thư mục nào kiểm tra thành công'
      }
    },
    onFolderSelected(folder) {
      this.selectedFolder = folder
    },
    async startCopy() {
      if (this.copying) return
      this.copying = true

      try {
        const destId = this.destMode === 'pick' ? this.selectedFolder?.id : null
        const createNew = this.destMode === 'new'

        // Collect valid source URLs
        const sourceUrls = this.validSources.map(s => s.url)

        const res = await startCopy(
          sourceUrls,
          destId,
          this.parsedExcludes,
          createNew
        )

        this.$emit('copy-started', res.data.jobId)
      } catch (err) {
        const msg = err.response?.data?.error || err.message
        this.sourceError = `Copy thất bại: ${msg}`
        this.copying = false
      }
    },
    resetForm() {
      this.sourceUrlInput = ''
      this.sources = []
      this.sourceError = null
      this.checkingSource = false
      this.destMode = 'new'
      this.selectedFolder = null
      this.excludeInput = ''
      this.copying = false
      this.$emit('reset')
    },
  },
}
</script>

<style scoped>
.copy-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  animation: fadeInUp 0.4s ease-out;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.section-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: #fff;
}
.section-icon.step-1 { background: linear-gradient(135deg, #4285f4, #5e97f6); }
.section-icon.step-2 { background: linear-gradient(135deg, #34a853, #57bb6e); }
.section-icon.step-3 { background: linear-gradient(135deg, #f9ab00, #fbc02d); }

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.section-desc {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

/* Input with action */
.input-with-action {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.input-with-action .input {
  flex: 1;
}
.input-with-action .btn {
  flex-shrink: 0;
  min-width: 90px;
  margin-top: 2px;
}

/* Source textarea */
.source-textarea {
  resize: vertical;
  min-height: 44px;
  max-height: 160px;
  font-family: var(--font);
  line-height: 1.5;
}

/* Sources list */
.sources-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.source-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  transition: all var(--transition);
}
.source-card.source-ok {
  border-color: rgba(52, 168, 83, 0.3);
  background: var(--success-light);
}
.source-card.source-err {
  border-color: rgba(234, 67, 53, 0.3);
  background: var(--error-light);
}
.source-card.source-checking {
  border-color: rgba(66, 133, 244, 0.3);
  background: var(--accent-lighter);
}

.source-card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.source-index {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-tertiary);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.source-card-body {
  flex: 1;
  min-width: 0;
}

.source-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--text-primary);
}
.source-name strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-url-preview {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-meta {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.source-error-msg {
  font-size: 0.75rem;
  color: var(--error);
  margin-top: 2px;
}

.btn-remove-source {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--text-tertiary);
  padding: 0 4px;
  transition: color var(--transition);
}
.btn-remove-source:hover {
  color: var(--error);
}

/* Source Info (legacy single) */
.source-info {
  margin-top: 16px;
}

.info-card {
  padding: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid;
}
.info-success {
  background: var(--success-light);
  border-color: rgba(52, 168, 83, 0.2);
}
.info-error {
  background: var(--error-light);
  border-color: rgba(234, 67, 53, 0.2);
  color: var(--error);
  margin-top: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
}

.info-details {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
}
.info-detail .label {
  color: var(--text-tertiary);
  min-width: 120px;
  flex-shrink: 0;
}
.info-detail .value {
  color: var(--text-primary);
  font-weight: 500;
}

/* Destination Options */
.dest-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-card {
  cursor: pointer;
  display: block;
}
.radio-card input {
  display: none;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  color: var(--text-secondary);
}
.radio-card:hover .radio-content {
  border-color: var(--accent);
  background: var(--accent-lighter);
}
.radio-card.active .radio-content {
  border-color: var(--accent);
  background: var(--accent-light);
  color: var(--accent);
}

.radio-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}
.radio-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* Folder Picker */
.folder-picker-wrapper {
  margin-top: 12px;
}

.selected-folder {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 14px;
  background: var(--accent-light);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--accent);
}

/* Exclude Tags */
.exclude-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}
.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-tertiary);
  font-size: 1rem;
  line-height: 1;
  padding: 0 2px;
}
.tag-remove:hover {
  color: var(--error);
}

.input-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
.input-hint code {
  background: var(--bg-tertiary);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.6875rem;
}

/* Copy Action */
.copy-action {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.copy-summary {
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border: 1px dashed var(--border-color);
}

.summary-row {
  display: flex;
  gap: 8px;
  font-size: 0.8125rem;
  padding: 4px 0;
}
.summary-label {
  color: var(--text-tertiary);
  min-width: 70px;
  flex-shrink: 0;
}
.summary-value {
  color: var(--text-primary);
  font-weight: 500;
}

.start-copy-btn {
  width: 100%;
  padding: 16px;
  font-size: 1.05rem;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 20px rgba(66, 133, 244, 0.3);
}
.start-copy-btn:hover:not(:disabled) {
  box-shadow: 0 6px 28px rgba(66, 133, 244, 0.4);
}

.new-copy-btn {
  width: 100%;
  padding: 16px;
  font-size: 1.05rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #34a853, #2d9649);
  color: #fff;
  border: none;
  box-shadow: 0 4px 20px rgba(52, 168, 83, 0.3);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all var(--transition);
}
.new-copy-btn:hover {
  box-shadow: 0 6px 28px rgba(52, 168, 83, 0.4);
  transform: translateY(-1px);
}

/* === Mobile compact === */
@media (max-width: 768px) {
  .copy-form {
    gap: 10px;
  }
  .form-section {
    padding: 14px;
  }
  .section-header {
    gap: 10px;
    margin-bottom: 12px;
  }
  .section-icon {
    width: 32px;
    height: 32px;
  }
  .section-icon svg {
    width: 16px;
    height: 16px;
  }
  .section-header h2 {
    font-size: 0.95rem;
  }
  .section-desc {
    font-size: 0.75rem;
  }
  .input-hint {
    display: none;
  }
  .dest-options {
    gap: 6px;
  }
  .radio-content {
    padding: 10px 12px;
    gap: 10px;
  }
  .radio-title {
    font-size: 0.8125rem;
  }
  .radio-desc {
    font-size: 0.6875rem;
  }
  .copy-summary {
    padding: 10px 14px;
  }
  .summary-row {
    font-size: 0.75rem;
  }
  .start-copy-btn,
  .new-copy-btn {
    padding: 12px;
    font-size: 0.95rem;
  }
}
</style>
