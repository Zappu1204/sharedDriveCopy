<template>
  <div class="dashboard" v-if="user">
    <div class="dashboard-grid">
      <!-- Left Column: Copy Form -->
      <div class="main-column">
        <CopyForm
          :user="user"
          :copyDone="copyDone"
          @copy-started="onCopyStarted"
          @reset="onReset"
        />
      </div>

      <!-- Right Column: Progress + Guide -->
      <div class="side-column">
        <ProgressMonitor
          v-if="currentJobId"
          :jobId="currentJobId"
          @done="onCopyDone"
        />

        <!-- UserGuide: collapsed by default, hidden on mobile when copying -->
        <UserGuide v-if="!isMobileAndCopying" />
      </div>
    </div>
  </div>
  <div v-else class="not-auth">
    <p>Vui lòng đăng nhập để sử dụng.</p>
    <router-link to="/" class="btn btn-primary">Đăng nhập</router-link>
  </div>
</template>

<script>
import CopyForm from '../components/CopyForm.vue'
import ProgressMonitor from '../components/ProgressMonitor.vue'
import UserGuide from '../components/UserGuide.vue'

export default {
  name: 'DashboardView',
  props: ['user'],
  components: { CopyForm, ProgressMonitor, UserGuide },
  data() {
    return {
      currentJobId: null,
      copyDone: false,
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    isMobileAndCopying() {
      return this.windowWidth <= 768 && this.currentJobId && !this.copyDone
    },
  },
  mounted() {
    this._onResize = () => { this.windowWidth = window.innerWidth }
    window.addEventListener('resize', this._onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this._onResize)
  },
  methods: {
    onCopyStarted(jobId) {
      this.currentJobId = jobId
      this.copyDone = false
    },
    onCopyDone() {
      this.copyDone = true
    },
    onReset() {
      this.currentJobId = null
      this.copyDone = false
    },
  },
}
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease-out;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  align-items: start;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.not-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  text-align: center;
  color: var(--text-secondary);
}

/* Tablet */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-grid {
    gap: 10px;
  }
  .main-column,
  .side-column {
    gap: 8px;
  }
}
</style>
