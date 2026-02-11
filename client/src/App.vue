<template>
  <div class="app-layout" :data-theme="theme">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <a class="logo" href="/">
          <img src="/DriveCopy-2.png" alt="Drive Copy" class="logo-img"/>
        </a>
      </div>

      <div class="header-right">
        <button class="btn btn-icon btn-ghost theme-toggle" @click="toggleTheme" :data-tooltip="theme === 'light' ? 'Dark Mode' : 'Light Mode'">
          <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>

        <div v-if="user" class="user-info">
          <img v-if="user.picture" :src="user.picture" :alt="user.name" class="user-avatar" referrerpolicy="no-referrer" />
          <div class="user-details">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-email">{{ user.email }}</span>
          </div>
          <button class="btn btn-ghost btn-sm" @click="handleLogout" id="logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span class="logout-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <router-view :user="user" @login="checkAuth" @logout="handleLogout" />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-name">Drive Copy</span>
          <span class="footer-sep">—</span>
          <span class="footer-desc">Sao chép Google Drive an toàn</span>
        </div>
        <div class="footer-links">
          <router-link to="/privacy">Quyền riêng tư</router-link>
          <span class="footer-dot">·</span>
          <router-link to="/terms">Điều khoản</router-link>
          <span class="footer-dot">·</span>
          <a href="mailto:support@drivecopy.app">Liên hệ</a>
        </div>
        <div class="footer-copy">
          © {{ currentYear }} Drive Copy. Không liên kết với Google Inc.
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getMe, logout } from './api'

export default {
  name: 'App',
  data() {
    return {
      user: null,
      theme: 'light',
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
  async created() {
    // Load saved theme
    const savedTheme = localStorage.getItem('drive-copy-theme') || 'light'
    this.theme = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)

    // Check auth on load
    await this.checkAuth()

    // Handle auth callback
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'success') {
      await this.checkAuth()
      this.$router.replace('/dashboard')
    }
    if (params.get('error')) {
      console.error('Auth error:', params.get('error'))
      this.$router.replace('/')
    }
  },
  methods: {
    async checkAuth() {
      try {
        const res = await getMe()
        if (res.data.authenticated) {
          this.user = res.data.user
          if (this.$route.path === '/') {
            this.$router.push('/dashboard')
          }
        }
      } catch {
        this.user = null
      }
    },
    async handleLogout() {
      try {
        await logout()
      } catch {}
      this.user = null
      this.$router.push('/')
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', this.theme)
      localStorage.setItem('drive-copy-theme', this.theme)
    },
  },
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  transition: all var(--transition);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #7c4dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  border-radius: 50%;
  width: 38px;
  height: 38px;
  color: var(--text-secondary);
}
.theme-toggle:hover {
  color: var(--accent);
  background: var(--accent-light);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-light);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.user-email {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* ===== Main ===== */
.app-main {
  flex: 1;
  padding: 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* ===== Footer ===== */
.app-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
  padding: 20px 24px;
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.footer-name {
  font-weight: 700;
  color: var(--text-secondary);
}

.footer-sep {
  color: var(--border-color);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
}

.footer-links a {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color var(--transition);
}
.footer-links a:hover {
  color: var(--accent);
}

.footer-dot {
  color: var(--border-color);
  font-size: 0.625rem;
}

.footer-copy {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  width: 100%;
  text-align: center;
  margin-top: 4px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
    height: 52px;
  }
  .user-details {
    display: none;
  }
  .logout-text {
    display: none;
  }
  .app-main {
    padding: 10px;
  }
  .footer-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
  }
  .footer-brand {
    font-size: 0.75rem;
  }
  .footer-copy {
    margin-top: 2px;
  }
}
</style>
