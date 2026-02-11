<template>
  <div class="legal-page">
    <div class="legal-container fade-in-up">
      <h1>Điều khoản Dịch vụ (Terms of Service)</h1>
      <p class="last-updated">Cập nhật lần cuối: 10 tháng 2, 2026</p>

      <section>
        <h2>1. Chấp nhận Điều khoản</h2>
        <p>
          Bằng việc truy cập hoặc sử dụng <strong>Drive Copy</strong> ("Ứng dụng", "Dịch vụ"),
          bạn đồng ý tuân thủ và chịu ràng buộc bởi các Điều khoản Dịch vụ này.
          Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, bạn không được phép sử dụng Dịch vụ.
        </p>
      </section>

      <section>
        <h2>2. Mô tả Dịch vụ</h2>
        <p>Drive Copy cung cấp chức năng:</p>
        <ul>
          <li>Sao chép đệ quy (recursive copy) thư mục Google Drive được chia sẻ về Google Drive cá nhân của bạn.</li>
          <li>Hiển thị tiến trình sao chép real-time.</li>
          <li>Chọn thư mục đích và lọc files theo tên.</li>
        </ul>
        <p>
          Dịch vụ hoạt động hoàn toàn thông qua Google Drive API. Chúng tôi <strong>không</strong> tải,
          lưu trữ, hoặc xử lý nội dung files trên server.
        </p>
      </section>

      <section>
        <h2>3. Yêu cầu sử dụng</h2>
        <p>Để sử dụng Dịch vụ, bạn cần:</p>
        <ul>
          <li>Có tài khoản Google hợp lệ.</li>
          <li>Đăng nhập và cấp quyền truy cập Google Drive cho Ứng dụng thông qua OAuth 2.0.</li>
          <li>Có quyền truy cập (tối thiểu Viewer) đối với thư mục nguồn muốn sao chép.</li>
          <li>Có đủ dung lượng Google Drive để lưu bản sao.</li>
        </ul>
      </section>

      <section>
        <h2>4. Quyền truy cập Google Drive</h2>
        <p>
          Khi đăng nhập, Ứng dụng yêu cầu quyền truy cập đầy đủ Google Drive
          (<code>https://www.googleapis.com/auth/drive</code>). Scope này cần thiết vì:
        </p>
        <ul>
          <li>Cần đọc files/folders từ thư mục được chia sẻ bởi người khác.</li>
          <li>Cần tạo thư mục và sao chép files vào Drive cá nhân của bạn.</li>
          <li>Google Drive API yêu cầu scope đầy đủ để thao tác với files từ Shared Drives
            và thư mục của người dùng khác.</li>
        </ul>
        <p>
          Bạn có thể thu hồi quyền truy cập bất kỳ lúc nào tại
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">
            Google Account Permissions</a>.
        </p>
      </section>

      <section>
        <h2>5. Sử dụng hợp lý</h2>
        <p>Bạn đồng ý:</p>
        <ul>
          <li>Chỉ sao chép các thư mục mà bạn có quyền truy cập hợp pháp.</li>
          <li>Không sử dụng Dịch vụ để vi phạm bản quyền hoặc quyền sở hữu trí tuệ.</li>
          <li>Không sử dụng Dịch vụ cho mục đích bất hợp pháp.</li>
          <li>Không cố gắng khai thác, hack, hoặc phá hoại Dịch vụ.</li>
          <li>Tuân thủ <a href="https://www.google.com/drive/terms-of-service/" target="_blank" rel="noopener">
            Google Drive Terms of Service</a> và các giới hạn của Google Drive API.</li>
        </ul>
      </section>

      <section>
        <h2>6. Giới hạn của Dịch vụ</h2>
        <p>Bạn hiểu và chấp nhận rằng:</p>
        <ul>
          <li>Google Drive có giới hạn upload/copy <strong>750 GB/ngày</strong> cho mỗi tài khoản.</li>
          <li>Một số files có thể không sao chép được do chủ sở hữu giới hạn quyền (chỉ xem, không cho phép copy).</li>
          <li>Google Docs/Sheets/Slides và các files Google Workspace khác sẽ được sao chép dưới dạng tham chiếu,
            không phải bản copy nội dung.</li>
          <li>Hiệu suất sao chép phụ thuộc vào Google Drive API và kết nối mạng.</li>
          <li>Dịch vụ có thể tạm ngưng hoặc gián đoạn do bảo trì hoặc sự cố kỹ thuật.</li>
        </ul>
      </section>

      <section>
        <h2>7. Bản quyền và Sở hữu trí tuệ</h2>
        <p>
          Ứng dụng Drive Copy được phát triển và duy trì bởi nhóm phát triển.
          Mọi quyền sở hữu trí tuệ liên quan đến mã nguồn, giao diện, và thiết kế của Ứng dụng
          thuộc về nhóm phát triển.
        </p>
        <p>
          Nội dung files được sao chép thông qua Dịch vụ thuộc quyền sở hữu của chủ sở hữu gốc.
          Chúng tôi không tuyên bố quyền sở hữu đối với bất kỳ nội dung nào của người dùng.
        </p>
      </section>

      <section>
        <h2>8. Tuyên bố miễn trừ trách nhiệm (Disclaimer)</h2>
        <p>
          Dịch vụ được cung cấp trên cơ sở <strong>"nguyên trạng" (AS IS)</strong> và
          <strong>"có sẵn" (AS AVAILABLE)</strong>. Chúng tôi không đảm bảo:
        </p>
        <ul>
          <li>Dịch vụ sẽ luôn hoạt động liên tục, không lỗi.</li>
          <li>Mọi files sẽ đều được sao chép thành công.</li>
          <li>Dịch vụ sẽ đáp ứng mọi yêu cầu cụ thể của bạn.</li>
        </ul>
      </section>

      <section>
        <h2>9. Giới hạn Trách nhiệm</h2>
        <p>
          Trong phạm vi tối đa được pháp luật cho phép, chúng tôi không chịu trách nhiệm về:
        </p>
        <ul>
          <li>Mất mát dữ liệu do lỗi trong quá trình sao chép.</li>
          <li>Thiệt hại gián tiếp, đặc biệt, hoặc hậu quả phát sinh từ việc sử dụng Dịch vụ.</li>
          <li>Gián đoạn dịch vụ do lỗi Google Drive API hoặc sự cố mạng.</li>
          <li>Vi phạm bản quyền do người dùng sao chép nội dung không có quyền.</li>
        </ul>
      </section>

      <section>
        <h2>10. Quyền riêng tư</h2>
        <p>
          Việc sử dụng Dịch vụ cũng tuân theo
          <router-link to="/privacy">Chính sách Quyền riêng tư</router-link>
          của chúng tôi. Vui lòng đọc kỹ để hiểu cách chúng tôi thu thập và sử dụng thông tin.
        </p>
      </section>

      <section>
        <h2>11. Chấm dứt</h2>
        <p>
          Chúng tôi có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn vào Dịch vụ
          bất kỳ lúc nào, có hoặc không có lý do, mà không cần thông báo trước.
        </p>
        <p>
          Bạn có thể ngừng sử dụng Dịch vụ bất kỳ lúc nào bằng cách đăng xuất và thu hồi
          quyền truy cập tại
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">
            Google Account Permissions</a>.
        </p>
      </section>

      <section>
        <h2>12. Thay đổi Điều khoản</h2>
        <p>
          Chúng tôi có quyền sửa đổi các Điều khoản này bất kỳ lúc nào. Các thay đổi sẽ có
          hiệu lực ngay khi được đăng trên trang này. Việc tiếp tục sử dụng Dịch vụ sau khi
          thay đổi đồng nghĩa với việc bạn chấp nhận các Điều khoản đã cập nhật.
        </p>
      </section>

      <section>
        <h2>13. Luật áp dụng</h2>
        <p>
          Các Điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam.
          Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
        </p>
      </section>

      <section>
        <h2>14. Liên hệ</h2>
        <p>
          Nếu bạn có câu hỏi về các Điều khoản Dịch vụ này, vui lòng liên hệ qua email:
          <a href="mailto:support@drivecopy.app">support@drivecopy.app</a>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsOfServiceView',
}
</script>

<style scoped>
.legal-page {
  display: flex;
  justify-content: center;
  padding: 16px 16px 60px;
}

.legal-container {
  max-width: 760px;
  width: 100%;
}

.legal-container h1 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.last-updated {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-bottom: 28px;
}

section {
  margin-bottom: 28px;
}

section h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-primary);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-light);
}

section h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 14px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

section p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 8px;
}

section ul, section ol {
  padding-left: 22px;
  margin-bottom: 10px;
}

section li {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 4px;
}

section code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--accent);
}

section a {
  color: var(--accent);
  text-decoration: underline;
}
section a:hover {
  color: var(--accent-hover);
}

@media (max-width: 768px) {
  .legal-container h1 {
    font-size: 1.3rem;
  }
  section h2 {
    font-size: 1rem;
  }
}
</style>
