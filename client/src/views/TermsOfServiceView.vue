<template>
  <div class="redirect-page">
    <p>Đang chuyển hướng đến Điều khoản Dịch vụ...</p>
  </div>
</template>

<script>
export default {
  name: 'TermsOfServiceView',
  mounted() {
    window.location.href = '/terms'
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
