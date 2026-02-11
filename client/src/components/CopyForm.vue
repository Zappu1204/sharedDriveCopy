<template>
  <div class="copy-form">
    <!-- Step 1: Source URL -->
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
          <p class="section-desc">Dán link Google Drive thư mục được chia sẻ với bạn</p>
        </div>
      </div>

      <div class="input-group">
        <label for="source-url">Link thư mục Google Drive</label>
        <div class="input-with-action">
          <input
            id="source-url"
            type="text"
            class="input"
            v-model="sourceUrl"
            placeholder="https://drive.google.com/drive/folders/..."
            @input="resetSourceInfo"
            :disabled="copying"
          />
          <button
            class="btn btn-primary btn-sm"
            @click="checkSource"
            :disabled="!sourceUrl || checkingSource || copying"
            id="check-source-btn"
          >
            <span v-if="checkingSource" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>Kiểm tra</span>
          </button>
        </div>
      </div>

      <!-- Source Info -->
      <div v-if="sourceInfo" class="source-info fade-in">
        <div class="info-card info-success">
          <div class="info-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span><strong>Có quyền truy cập</strong></span>
          </div>
          <div class="info-details">
            <div class="info-detail">
              <span class="label">Tên thư mục:</span>
              <span class="value">{{ sourceInfo.name }}</span>
            </div>
            <div class="info-detail" v-if="sourceInfo.owners && sourceInfo.owners.length">
              <span class="label">Chủ sở hữu:</span>
              <span class="value">{{ sourceInfo.owners.map(o => o.displayName || o.emailAddress).join(', ') }}</span>
            </div>
            <div class="info-detail">
              <span class="label">Email của bạn:</span>
              <span class="value">{{ sourceInfo.userEmail }}</span>
            </div>
            <div class="info-detail">
              <span class="label">Số mục trong folder:</span>
              <span class="value">{{ sourceInfo.itemCount }} items</span>
            </div>
            <!-- <div class="info-detail" v-if="sourceInfo.capabilities">
              <span class="label">Quyền copy:</span>
              <span class="value">
                <span v-if="sourceInfo.capabilities.canCopy !== false" class="badge badge-success">Có thể copy</span>
                <span v-else class="badge badge-error">Không thể copy</span>
              </span>
            </div> -->
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
    <div class="card form-section" v-if="sourceInfo">
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
              <div class="radio-desc">Tự động tạo "[Copy] {{ sourceInfo.name }}" trong My Drive</div>
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
    <div class="card form-section" v-if="sourceInfo">
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
    <div v-if="sourceInfo" class="copy-action fade-in">
      <div class="copy-summary card">
        <div class="summary-row">
          <span class="summary-label">Nguồn:</span>
          <span class="summary-value">{{ sourceInfo.name }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Đích:</span>
          <span class="summary-value">
            {{ destMode === 'new' ? `[Copy] ${sourceInfo.name} (My Drive)` : (selectedFolder ? selectedFolder.name : 'Chưa chọn') }}
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
        <span>{{ copying ? 'Đang copy...' : 'Bắt đầu Copy' }}</span>
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
      sourceUrl: '',
      sourceInfo: null,
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
  },
  methods: {
    resetSourceInfo() {
      this.sourceInfo = null
      this.sourceError = null
    },
    removeExclude(index) {
      const parts = this.excludeInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      parts.splice(index, 1)
      this.excludeInput = parts.join(', ')
    },
    async checkSource() {
      this.checkingSource = true
      this.sourceError = null
      this.sourceInfo = null

      try {
        // Extract folder ID
        const urlRes = await checkUrl(this.sourceUrl)
        const folderId = urlRes.data.folderId

        // Check access
        const accessRes = await checkAccess(folderId)
        this.sourceInfo = accessRes.data
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Không thể kiểm tra thư mục'
        this.sourceError = msg
      } finally {
        this.checkingSource = false
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

        const res = await startCopy(
          this.sourceUrl,
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
      this.sourceUrl = ''
      this.sourceInfo = null
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
}
.input-with-action .input {
  flex: 1;
}
.input-with-action .btn {
  flex-shrink: 0;
  min-width: 90px;
}

/* Source Info */
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
