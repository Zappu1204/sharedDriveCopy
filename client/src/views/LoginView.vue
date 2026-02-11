<template>
  <div class="login-page">
    <div class="login-container fade-in-up">
      <!-- Top Section: Hero + Login -->
      <div class="login-top">
        <div class="login-hero">
          <img src="/DriveCopy_Crop.png" alt="Drive Copy" class="logo-img hero-logo" width="100" height="100"/>
          <p class="hero-subtitle">
            Sao chép thư mục Google Drive được chia sẻ<br/>về Drive cá nhân — nhanh chóng và an toàn.
          </p>
        </div>

        <div class="login-card card">
          <a href="/auth/google" class="google-login-btn" id="google-login-btn">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Đăng nhập với Google</span>
          </a>

          <div class="login-badges">
            <div class="mini-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Không tải file về server</span>
            </div>
            <div class="mini-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Copy trực tiếp trên Drive</span>
            </div>
            <div class="mini-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Chỉ dùng Google API</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Steps - horizontal on desktop -->
      <div class="steps-row">
        <div class="step-chip" v-for="(step, i) in steps" :key="i">
          <div class="step-num">{{ i + 1 }}</div>
          <div>
            <div class="step-title">{{ step.title }}</div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>

      <!-- Collapsible Security info -->
      <div class="security-note card" @click="showSecurity = !showSecurity">
        <div class="security-toggle">
          <div class="security-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <strong>Về bảo mật</strong>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="2" :class="{ rotated: showSecurity }">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div v-if="showSecurity" class="security-body fade-in">
          <p>
            Ứng dụng <b>không lưu trữ</b> file hay dữ liệu của bạn. Mọi thao tác copy thực hiện trực tiếp
            qua Google Drive API (<code>files.copy</code>, <code>files.create</code>). Access token chỉ lưu
            trong phiên làm việc và tự xóa khi đăng xuất.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  props: ['user'],
  data() {
    return {
      showSecurity: false,
      steps: [
        { title: 'Đăng nhập', desc: 'Xác thực Google' },
        { title: 'Dán link', desc: 'Paste link thư mục' },
        { title: 'Chọn đích', desc: 'Chọn nơi lưu' },
        { title: 'Copy!', desc: 'Theo dõi tiến trình' },
      ],
    }
  },
  mounted() {
    if (this.user) {
      this.$router.replace('/dashboard')
    }
  },
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12px 16px 24px;
}

.login-container {
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* === Top: Hero + Card === */
.login-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.login-hero {
  text-align: center;
  padding: 16px 0 0;
}

.hero-logo {
  margin-bottom: 10px;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* === Login Card === */
.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  width: 100%;
}

.google-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: #fff;
  border: 2px solid #e2e5ed;
  border-radius: var(--radius-md);
  color: #3c4043;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: all var(--transition);
  text-decoration: none;
  box-shadow: var(--shadow-sm);
}
.google-login-btn:hover {
  border-color: #4285f4;
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  color: #1a73e8;
}
[data-theme="dark"] .google-login-btn {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--text-primary);
}
[data-theme="dark"] .google-login-btn:hover {
  border-color: var(--accent);
}

.login-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.mini-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: var(--success-light);
  border-radius: 100px;
}

/* === Steps Row === */
.steps-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.step-chip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.step-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}

.step-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.step-desc {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  margin-top: 1px;
}

/* === Security === */
.security-note {
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
}

.security-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.security-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font-size: 0.8125rem;
}

.security-toggle svg:last-child {
  transition: transform var(--transition);
}
.security-toggle svg.rotated {
  transform: rotate(180deg);
}

.security-body {
  margin-top: 10px;
}

.security-body p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.security-body code {
  font-size: 0.75rem;
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent);
}

/* === Mobile === */
@media (max-width: 768px) {
  .login-page {
    padding: 8px 12px 16px;
  }
  .login-container {
    gap: 12px;
  }
  .hero-logo {
    width: 72px;
    height: 72px;
  }
  .hero-subtitle {
    font-size: 0.8125rem;
  }
  .login-card {
    padding: 18px;
    gap: 12px;
  }
  .google-login-btn {
    padding: 12px 24px;
    font-size: 0.9375rem;
  }
  .steps-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .step-chip {
    padding: 10px;
    gap: 8px;
  }
  .step-num {
    width: 22px;
    height: 22px;
    font-size: 0.6875rem;
  }
  .step-title {
    font-size: 0.75rem;
  }
  .step-desc {
    font-size: 0.625rem;
  }
  .mini-badge {
    font-size: 0.6875rem;
    padding: 3px 8px;
  }
}
</style>
