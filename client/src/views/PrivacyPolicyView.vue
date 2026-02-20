<template>
  <div class="redirect-page">
    <p>Đang chuyển hướng đến Chính sách Quyền riêng tư...</p>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicyView',
  mounted() {
    window.location.href = '/privacy'
  },
}
</script>

<style scoped>
.redirect-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}
</style>
