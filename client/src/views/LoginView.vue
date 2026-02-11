<template>
  <div class="login-page">
    <div class="login-container fade-in-up">

      <!-- ====== HERO ====== -->
      <div class="hero-section">
        <img src="/DriveCopy_Crop.png" alt="Drive Copy" class="hero-logo" width="96" height="96"/>
        <h1 class="hero-title">Drive Copy</h1>
        <p class="hero-subtitle">
          Sao chép thư mục Google Drive được chia sẻ về Drive cá nhân của bạn — nhanh chóng, an toàn và miễn phí.
        </p>
        <a href="/auth/google" class="google-login-btn" id="google-login-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Đăng nhập với Google</span>
        </a>
      </div>

      <!-- ====== MỤC ĐÍCH ỨNG DỤNG ====== -->
      <div class="info-section card">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Mục đích của ứng dụng
        </h2>
        <p>
          <strong>Drive Copy</strong> giúp bạn sao chép (copy) toàn bộ nội dung của một thư mục Google Drive 
          được chia sẻ về Google Drive cá nhân của bạn. Đây là giải pháp khi bạn cần tạo bản sao riêng 
          cho các tài liệu học tập, tài liệu công việc, hoặc bất kỳ thư mục nào được chia sẻ với bạn trên Google Drive.
        </p>
        <p>
          Ứng dụng sao chép đệ quy (recursive copy) toàn bộ cấu trúc thư mục con và files, giữ nguyên cấu trúc gốc. 
          Quá trình copy diễn ra hoàn toàn trên hạ tầng Google Drive thông qua <strong>Google Drive API v3</strong> — 
          không có dữ liệu nào bị tải xuống hoặc đi qua server của chúng tôi.
        </p>
      </div>

      <!-- ====== TÍNH NĂNG CHÍNH ====== -->
      <div class="info-section card">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Tính năng chính
        </h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon copy-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </div>
            <div>
              <strong>Sao chép đệ quy</strong>
              <p>Copy toàn bộ thư mục con, files, giữ nguyên cấu trúc cây thư mục gốc.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon progress-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
              <strong>Theo dõi tiến trình real-time</strong>
              <p>Hiển thị tiến trình sao chép theo thời gian thực qua Server-Sent Events (SSE).</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon folder-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <strong>Chọn thư mục đích</strong>
              <p>Tạo thư mục mới hoặc chọn thư mục có sẵn trong Drive cá nhân làm nơi lưu.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon filter-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </div>
            <div>
              <strong>Lọc files không cần thiết</strong>
              <p>Bỏ qua files/folders theo từ khóa (ví dụ: .mp4, .srt, bài_cũ).</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== CÁCH HOẠT ĐỘNG ====== -->
      <div class="info-section card">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Cách hoạt động
        </h2>
        <div class="steps-list">
          <div class="step-item" v-for="(step, i) in steps" :key="i">
            <div class="step-num">{{ i + 1 }}</div>
            <div>
              <strong>{{ step.title }}</strong>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== QUYỀN TRUY CẬP GOOGLE API ====== -->
      <div class="info-section card">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Quyền truy cập Google API
        </h2>
        <p>Khi đăng nhập, ứng dụng yêu cầu các quyền sau từ tài khoản Google của bạn:</p>
        <div class="scope-list">
          <div class="scope-item">
            <code>https://www.googleapis.com/auth/drive</code>
            <p>
              Quyền truy cập Google Drive — cần thiết để đọc danh sách files/folders từ thư mục 
              được chia sẻ bởi người khác (<code>files.list</code>), sao chép files (<code>files.copy</code>), 
              và tạo thư mục mới (<code>files.create</code>) trong Drive cá nhân của bạn.
            </p>
          </div>
          <div class="scope-item">
            <code>https://www.googleapis.com/auth/userinfo.email</code>
            <p>Đọc địa chỉ email — để hiển thị tên tài khoản trên giao diện.</p>
          </div>
          <div class="scope-item">
            <code>https://www.googleapis.com/auth/userinfo.profile</code>
            <p>Đọc thông tin hồ sơ (tên, ảnh đại diện) — để cá nhân hóa giao diện người dùng.</p>
          </div>
        </div>
        <p class="scope-note">
          Bạn có thể thu hồi quyền truy cập bất kỳ lúc nào tại 
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">Google Account Permissions</a>.
        </p>
      </div>

      <!-- ====== BẢO MẬT & QUYỀN RIÊNG TƯ ====== -->
      <div class="info-section card security-card">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Bảo mật & Quyền riêng tư
        </h2>
        <div class="security-grid">
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span><strong>Không tải file về server</strong> — Nội dung files không bao giờ đi qua server. Mọi thao tác copy thực hiện trực tiếp trên Google Drive API.</span>
          </div>
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span><strong>Không lưu trữ dữ liệu</strong> — Chúng tôi không lưu files, thông tin cá nhân, hoặc dữ liệu Google Drive vào database.</span>
          </div>
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span><strong>Token tạm thời</strong> — Access token chỉ lưu trong session (bộ nhớ tạm), tự động xóa khi đăng xuất hoặc hết hạn.</span>
          </div>
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span><strong>Giao tiếp mã hóa HTTPS</strong> — Mọi kết nối đều qua HTTPS, cookie httpOnly, SameSite policy.</span>
          </div>
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span><strong>Tuân thủ Google API Services User Data Policy</strong> — bao gồm Limited Use requirements.</span>
          </div>
        </div>
        <div class="policy-links">
          Đọc thêm: 
          <router-link to="/privacy">Chính sách Quyền riêng tư</router-link> · 
          <router-link to="/terms">Điều khoản Dịch vụ</router-link>
        </div>
      </div>

      <!-- ====== CTA BOTTOM ====== -->
      <div class="cta-bottom">
        <a href="/auth/google" class="google-login-btn" id="google-login-btn-bottom">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Bắt đầu sử dụng — Đăng nhập với Google</span>
        </a>
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
      steps: [
        {
          title: 'Đăng nhập với Google',
          desc: 'Xác thực tài khoản Google của bạn thông qua OAuth 2.0. Ứng dụng sẽ yêu cầu quyền truy cập Google Drive để thực hiện sao chép.',
        },
        {
          title: 'Dán link thư mục được chia sẻ',
          desc: 'Paste đường link Google Drive của thư mục được chia sẻ với bạn. Hệ thống sẽ kiểm tra quyền truy cập và hiển thị thông tin thư mục.',
        },
        {
          title: 'Chọn nơi lưu bản sao',
          desc: 'Chọn tạo thư mục mới tự động hoặc chọn một thư mục có sẵn trong Drive cá nhân làm đích. Bạn cũng có thể lọc bỏ files không cần thiết.',
        },
        {
          title: 'Bắt đầu copy & theo dõi',
          desc: 'Hệ thống sao chép đệ quy toàn bộ files và thư mục con. Bạn theo dõi tiến trình real-time với thanh tiến trình, số liệu thống kê và log chi tiết.',
        },
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
  padding: 16px 16px 40px;
}

.login-container {
  max-width: 680px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ====== Hero ====== */
.hero-section {
  text-align: center;
  padding: 24px 0 8px;
}

.hero-logo {
  margin-bottom: 12px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4285f4, #7c4dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.65;
  max-width: 500px;
  margin: 0 auto 20px;
}

/* ====== Google Login Button ====== */
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

/* ====== Info Sections ====== */
.info-section {
  padding: 24px;
}
.info-section h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-primary);
}
.info-section p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 8px;
}
.info-section p:last-child {
  margin-bottom: 0;
}

/* ====== Features Grid ====== */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.feature-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  transition: border-color var(--transition);
}
.feature-item:hover {
  border-color: var(--accent-light);
}

.feature-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: #fff;
}
.copy-icon { background: linear-gradient(135deg, #4285f4, #5b9cf6); }
.progress-icon { background: linear-gradient(135deg, #34a853, #5dd27a); }
.folder-icon { background: linear-gradient(135deg, #f9ab00, #ffc233); }
.filter-icon { background: linear-gradient(135deg, #ea4335, #f56b5e); }

.feature-item strong {
  font-size: 0.875rem;
  color: var(--text-primary);
  display: block;
  margin-bottom: 3px;
}
.feature-item p {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  margin: 0;
}

/* ====== Steps ====== */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.step-num {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
}

.step-item strong {
  font-size: 0.875rem;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}
.step-item p {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  line-height: 1.55;
  margin: 0;
}

/* ====== Scopes ====== */
.scope-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 8px 0;
}

.scope-item {
  padding: 12px 14px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
}

.scope-item code {
  display: inline-block;
  font-size: 0.75rem;
  background: var(--bg-tertiary);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--accent);
  margin-bottom: 6px;
  word-break: break-all;
}

.scope-item p {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  line-height: 1.55;
  margin: 0;
}

.scope-note {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}
.scope-note a {
  color: var(--accent);
  text-decoration: underline;
}

/* ====== Security ====== */
.security-card {
  background: var(--bg-card);
}

.security-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.security-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.security-item svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.policy-links {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}
.policy-links a {
  color: var(--accent);
  text-decoration: underline;
}
.policy-links a:hover {
  color: var(--accent-hover);
}

/* ====== CTA Bottom ====== */
.cta-bottom {
  text-align: center;
  padding: 8px 0;
}

/* ====== Mobile ====== */
@media (max-width: 768px) {
  .login-page {
    padding: 8px 12px 28px;
  }
  .login-container {
    gap: 14px;
  }
  .hero-section {
    padding: 12px 0 4px;
  }
  .hero-logo {
    width: 72px;
    height: 72px;
  }
  .hero-title {
    font-size: 1.6rem;
  }
  .hero-subtitle {
    font-size: 0.875rem;
  }
  .google-login-btn {
    padding: 12px 24px;
    font-size: 0.9375rem;
  }
  .info-section {
    padding: 16px;
  }
  .info-section h2 {
    font-size: 1rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .feature-item {
    padding: 12px;
  }
  .step-num {
    width: 26px;
    height: 26px;
    font-size: 0.75rem;
  }
}
</style>
