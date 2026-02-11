<template>
  <div class="user-guide card">
    <div class="guide-header" @click="expanded = !expanded">
      <div class="guide-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h3>Hướng dẫn sử dụng</h3>
      </div>
      <svg
        width="14" height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="chevron"
        :class="{ rotated: expanded }"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>

    <div v-if="expanded" class="guide-content fade-in">
      <div class="guide-section">
        <h4>📋 Yêu cầu</h4>
        <ul>
          <li>Thư mục cần copy phải được <strong>chia sẻ</strong> với bạn (tối thiểu <strong>Viewer</strong>).</li>
          <li>Đảm bảo đủ dung lượng Drive trống.</li>
        </ul>
      </div>

      <div class="guide-section">
        <h4>🔗 Cách lấy link</h4>
        <ol>
          <li>Mở Google Drive → tìm thư mục được chia sẻ.</li>
          <li>Chuột phải → <strong>Get link</strong> → Copy link.</li>
        </ol>
      </div>

      <div class="guide-section">
        <h4>⚠️ Lưu ý</h4>
        <ul>
          <li>Không đóng tab khi đang copy.</li>
          <li>Giới hạn <strong>750 GB/ngày</strong>.</li>
          <li>Files bị giới hạn "chỉ xem" sẽ báo lỗi riêng.</li>
        </ul>
      </div>

      <div class="guide-section guide-security">
        <h4>🔐 Bảo mật</h4>
        <ul>
          <li><strong>Không tải</strong> file về server.</li>
          <li>Token chỉ lưu trong session, tự hủy khi đăng xuất.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserGuide',
  data() {
    return {
      expanded: false,
    }
  },
}
</script>

<style scoped>
.user-guide {
  overflow: hidden;
  padding: 14px 18px;
}

.guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}
.guide-header:hover {
  opacity: 0.8;
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}
.guide-title h3 {
  font-size: 0.875rem;
  font-weight: 600;
}

.chevron {
  color: var(--text-tertiary);
  transition: transform var(--transition);
}
.chevron.rotated {
  transform: rotate(180deg);
}

.guide-content {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-section h4 {
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.guide-section ul,
.guide-section ol {
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.guide-section li {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.guide-section p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.guide-section code {
  background: var(--bg-tertiary);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.6875rem;
  color: var(--accent);
}

.guide-security {
  background: var(--accent-lighter);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--accent-light);
}

/* Mobile: more compact */
@media (max-width: 768px) {
  .user-guide {
    padding: 10px 14px;
  }
  .guide-title h3 {
    font-size: 0.8125rem;
  }
  .guide-section li,
  .guide-section p {
    font-size: 0.6875rem;
  }
}
</style>
