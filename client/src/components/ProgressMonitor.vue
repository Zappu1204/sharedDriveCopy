<template>
  <div class="progress-monitor card">
    <div class="monitor-header">
      <div class="monitor-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <h3>Tiến trình Copy</h3>
      </div>
      <span :class="['badge', statusBadgeClass]">{{ statusLabel }}</span>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar-wrapper" v-if="status.totalFiles > 0">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
          :class="{ completed: status.status === 'completed', error: status.status === 'error' }"
        ></div>
      </div>
      <div class="progress-stats">
        <span>{{ status.copiedFiles + status.skippedFiles + status.errorFiles }} / {{ status.totalFiles }}</span>
        <span>{{ progressPercent }}%</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value stat-copied">{{ status.copiedFiles }}</div>
        <div class="stat-label">Đã copy</div>
      </div>
      <div class="stat-item">
        <div class="stat-value stat-skipped">{{ status.skippedFiles }}</div>
        <div class="stat-label">Bỏ qua</div>
      </div>
      <div class="stat-item">
        <div class="stat-value stat-errors">{{ status.errorFiles }}</div>
        <div class="stat-label">Lỗi</div>
      </div>
      <div class="stat-item">
        <div class="stat-value stat-size">{{ formattedSize }}</div>
        <div class="stat-label">Dung lượng</div>
      </div>
    </div>

    <!-- Elapsed Time -->
    <div class="elapsed" v-if="status.elapsed">
      ⏱ {{ formattedElapsed }}
    </div>

    <!-- Log Console -->
    <div class="log-console" ref="logConsole">
      <div
        v-for="(log, i) in logs"
        :key="i"
        :class="['log-entry', `log-${log.level}`]"
      >
        <span class="log-time">{{ formatTime(log.time) }}</span>
        <span class="log-msg">{{ log.message }}</span>
      </div>
      <div v-if="logs.length === 0" class="log-empty">
        Đang chờ kết nối...
      </div>
    </div>

    <!-- Open in Drive button -->
    <a
      v-if="status.status === 'completed' && status.destFolderId"
      :href="`https://drive.google.com/drive/folders/${status.destFolderId}`"
      target="_blank"
      class="btn btn-primary btn-lg open-drive-btn"
      id="open-drive-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      Mở trong Google Drive
    </a>
  </div>
</template>

<script>
import { connectCopyProgress } from '../api'

export default {
  name: 'ProgressMonitor',
  props: {
    jobId: String,
  },
  emits: ['done'],
  data() {
    return {
      status: {
        status: 'connecting',
        totalFiles: 0,
        copiedFiles: 0,
        skippedFiles: 0,
        errorFiles: 0,
        totalSize: 0,
        elapsed: 0,
        destFolderId: null,
      },
      logs: [],
      eventSource: null,
      elapsedTimer: null,
    }
  },
  computed: {
    progressPercent() {
      if (this.status.totalFiles === 0) return 0
      const done = this.status.copiedFiles + this.status.skippedFiles + this.status.errorFiles
      return Math.round((done / this.status.totalFiles) * 100)
    },
    formattedSize() {
      const bytes = this.status.totalSize
      if (bytes === 0) return '0 B'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    },
    formattedElapsed() {
      const ms = this.status.elapsed || 0
      const s = Math.floor(ms / 1000)
      const m = Math.floor(s / 60)
      const h = Math.floor(m / 60)
      if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`
      if (m > 0) return `${m}m ${s % 60}s`
      return `${s}s`
    },
    statusLabel() {
      const map = {
        connecting: 'Đang kết nối...',
        running: 'Đang copy',
        completed: 'Hoàn thành',
        error: 'Có lỗi',
      }
      return map[this.status.status] || this.status.status
    },
    statusBadgeClass() {
      const map = {
        connecting: 'badge-info',
        running: 'badge-info',
        completed: 'badge-success',
        error: 'badge-error',
      }
      return map[this.status.status] || 'badge-info'
    },
  },
  watch: {
    jobId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.connect(newId)
        }
      },
    },
  },
  methods: {
    connect(jobId) {
      // Close existing connection
      if (this.eventSource) {
        this.eventSource.close()
      }

      this.logs = []
      this.status.status = 'connecting'

      // Start elapsed timer
      this.startElapsedTimer()

      this.eventSource = connectCopyProgress(
        jobId,
        (data) => {
          if (data.type === 'status') {
            this.status = { ...this.status, ...data }
            if (data.status === 'completed' || data.status === 'error') {
              this.stopElapsedTimer()
              this.$emit('done')
              if (this.eventSource) {
                this.eventSource.close()
              }
            }
          }
          if (data.type === 'log') {
            this.logs.push(data)
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        },
        (err) => {
          console.error('SSE error:', err)
          this.stopElapsedTimer()
        }
      )
    },
    startElapsedTimer() {
      this.stopElapsedTimer()
      const start = Date.now()
      this.elapsedTimer = setInterval(() => {
        if (this.status.status === 'running' || this.status.status === 'connecting') {
          this.status.elapsed = Date.now() - start
        }
      }, 1000)
    },
    stopElapsedTimer() {
      if (this.elapsedTimer) {
        clearInterval(this.elapsedTimer)
        this.elapsedTimer = null
      }
    },
    scrollToBottom() {
      const el = this.$refs.logConsole
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const d = new Date(timestamp)
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    },
  },
  beforeUnmount() {
    if (this.eventSource) this.eventSource.close()
    this.stopElapsedTimer()
  },
}
</script>

<style scoped>
.progress-monitor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeInUp 0.4s ease-out;
}

.monitor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.monitor-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--accent);
}
.monitor-title h3 {
  font-size: 1rem;
}

/* Progress Bar */
.progress-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4285f4, #5e97f6);
  border-radius: 4px;
  transition: width 0.4s ease-out;
  animation: progressBar 0.6s ease-out;
}
.progress-fill.completed {
  background: linear-gradient(90deg, #34a853, #57bb6e);
}
.progress-fill.error {
  background: linear-gradient(90deg, #ea4335, #f56b5e);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 10px 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}
.stat-copied { color: var(--success); }
.stat-skipped { color: var(--warning); }
.stat-errors { color: var(--error); }
.stat-size { color: var(--accent); font-size: 0.9rem; }

.stat-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.elapsed {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  text-align: center;
}

/* Log Console */
.log-console {
  max-height: 240px;
  overflow-y: auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 8px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.6875rem;
  line-height: 1.6;
}

.log-entry {
  display: flex;
  gap: 8px;
  padding: 2px 4px;
  border-radius: 3px;
}
.log-entry:hover {
  background: var(--bg-card-hover);
}

.log-time {
  color: var(--text-tertiary);
  flex-shrink: 0;
  font-size: 0.625rem;
}

.log-msg {
  word-break: break-all;
}

.log-success .log-msg { color: var(--success); }
.log-error .log-msg { color: var(--error); }
.log-warning .log-msg { color: var(--warning); }
.log-info .log-msg { color: var(--text-secondary); }

.log-empty {
  text-align: center;
  padding: 20px;
  color: var(--text-tertiary);
}

/* Open Drive Button */
.open-drive-btn {
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: linear-gradient(135deg, #34a853, #2d9649);
  box-shadow: 0 4px 16px rgba(52, 168, 83, 0.3);
}
.open-drive-btn:hover {
  box-shadow: 0 6px 24px rgba(52, 168, 83, 0.4);
  transform: translateY(-1px);
  color: #fff;
}

/* Mobile */
@media (max-width: 768px) {
  .progress-monitor {
    padding: 14px;
    gap: 10px;
  }
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }
  .stat-item {
    padding: 6px 2px;
  }
  .stat-value {
    font-size: 1rem;
  }
  .stat-label {
    font-size: 0.5625rem;
  }
  .log-console {
    max-height: 160px;
    padding: 6px;
    font-size: 0.625rem;
  }
  .elapsed {
    font-size: 0.75rem;
  }
}
</style>
