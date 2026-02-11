<template>
  <div class="legal-page">
    <div class="legal-container fade-in-up">
      <h1>Chính sách Quyền riêng tư (Privacy Policy)</h1>
      <p class="last-updated">Cập nhật lần cuối: 10 tháng 2, 2026</p>

      <section>
        <h2>1. Giới thiệu</h2>
        <p>
          Chào mừng bạn đến với <strong>Drive Copy</strong> ("Ứng dụng", "Dịch vụ", "chúng tôi").
          Ứng dụng này cho phép bạn sao chép thư mục Google Drive được chia sẻ về Drive cá nhân của bạn
          một cách nhanh chóng và an toàn.
        </p>
        <p>
          Chính sách Quyền riêng tư này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ
          thông tin cá nhân của bạn khi bạn sử dụng Dịch vụ. Bằng việc sử dụng Dịch vụ, bạn đồng ý
          với các điều khoản trong Chính sách này.
        </p>
      </section>

      <section>
        <h2>2. Thông tin chúng tôi thu thập</h2>
        <h3>2.1. Thông tin tài khoản Google</h3>
        <p>Khi bạn đăng nhập bằng Google OAuth 2.0, chúng tôi truy cập các thông tin sau:</p>
        <ul>
          <li><strong>Tên hiển thị</strong> — để cá nhân hóa giao diện người dùng.</li>
          <li><strong>Địa chỉ email</strong> — để xác định tài khoản và hiển thị trên giao diện.</li>
          <li><strong>Ảnh đại diện</strong> — để hiển thị avatar trên thanh header.</li>
        </ul>
        <p>
          Chúng tôi <strong>không</strong> thu thập mật khẩu Google của bạn. Xác thực được thực hiện
          hoàn toàn thông qua giao thức OAuth 2.0 của Google.
        </p>

        <h3>2.2. Dữ liệu Google Drive</h3>
        <p>Ứng dụng yêu cầu quyền truy cập Google Drive với scope:</p>
        <ul>
          <li><code>https://www.googleapis.com/auth/drive</code> — Quyền truy cập đầy đủ vào Google Drive.</li>
        </ul>
        <p>Scope này cần thiết để:</p>
        <ul>
          <li>Đọc danh sách files/folders trong thư mục được chia sẻ (<code>files.list</code>).</li>
          <li>Sao chép files từ thư mục được chia sẻ về Drive cá nhân (<code>files.copy</code>).</li>
          <li>Tạo thư mục mới trong Drive cá nhân (<code>files.create</code>).</li>
          <li>Liệt kê thư mục cá nhân để người dùng chọn nơi lưu.</li>
        </ul>
        <p class="important-note">
          ⚠️ <strong>Quan trọng:</strong> Ứng dụng KHÔNG tải xuống, lưu trữ, hoặc truyền bất kỳ nội dung
          file nào qua server. Mọi thao tác sao chép đều thực hiện trực tiếp giữa các tài khoản Google Drive
          thông qua Google Drive API.
        </p>

        <h3>2.3. Dữ liệu kỹ thuật</h3>
        <p>Chúng tôi có thể tự động thu thập:</p>
        <ul>
          <li>Thông tin về trình duyệt và thiết bị (User-Agent) cho mục đích debug.</li>
          <li>Dữ liệu session tạm thời để duy trì phiên đăng nhập.</li>
        </ul>
      </section>

      <section>
        <h2>3. Cách chúng tôi sử dụng thông tin</h2>
        <p>Thông tin của bạn được sử dụng <strong>duy nhất</strong> cho các mục đích sau:</p>
        <ul>
          <li>Xác thực và duy trì phiên đăng nhập của bạn.</li>
          <li>Thực hiện các thao tác sao chép files/folders theo yêu cầu của bạn.</li>
          <li>Hiển thị thông tin tài khoản (tên, email, ảnh đại diện) trên giao diện.</li>
          <li>Cung cấp thông tin tiến trình sao chép real-time.</li>
        </ul>
        <p>
          Chúng tôi <strong>không</strong> sử dụng thông tin của bạn cho quảng cáo, analytics bên thứ ba,
          hoặc bất kỳ mục đích thương mại nào khác.
        </p>
      </section>

      <section>
        <h2>4. Lưu trữ và bảo mật dữ liệu</h2>
        <h3>4.1. Access Token</h3>
        <ul>
          <li>Token xác thực Google <strong>chỉ được lưu trong session</strong> (bộ nhớ tạm trên server).</li>
          <li>Token <strong>không</strong> được lưu vào database, file, hoặc bất kỳ bộ nhớ vĩnh viễn nào.</li>
          <li>Token tự động bị xóa khi bạn đăng xuất hoặc khi session hết hạn (tối đa 2 giờ).</li>
        </ul>

        <h3>4.2. Dữ liệu người dùng</h3>
        <ul>
          <li>Thông tin cá nhân (tên, email, ảnh) <strong>chỉ tồn tại trong session</strong>.</li>
          <li>Chúng tôi <strong>không lưu trữ vĩnh viễn</strong> bất kỳ dữ liệu cá nhân nào.</li>
          <li>Không có database chứa thông tin người dùng.</li>
        </ul>

        <h3>4.3. Nội dung files</h3>
        <ul>
          <li>Nội dung files của bạn <strong>không bao giờ</strong> đi qua server.</li>
          <li>Sao chép diễn ra trực tiếp trên hạ tầng Google Drive thông qua API.</li>
          <li>Server chỉ gửi lệnh sao chép (<code>files.copy</code>) đến Google API,
            không tiếp xúc với nội dung file.</li>
        </ul>
      </section>

      <section>
        <h2>5. Chia sẻ dữ liệu với bên thứ ba</h2>
        <p>
          Chúng tôi <strong>không chia sẻ, bán, hoặc cho thuê</strong> thông tin cá nhân của bạn với bất kỳ
          bên thứ ba nào. Dữ liệu của bạn chỉ được truyền giữa trình duyệt của bạn và Google API.
        </p>
        <p>Dịch vụ của bên thứ ba duy nhất được sử dụng:</p>
        <ul>
          <li><strong>Google OAuth 2.0</strong> — để xác thực tài khoản (tuân thủ
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">
              Google API Services User Data Policy</a>).</li>
          <li><strong>Google Drive API v3</strong> — để thực hiện các thao tác trên Google Drive.</li>
        </ul>
      </section>

      <section>
        <h2>6. Tuân thủ Google API Services User Data Policy</h2>
        <p>
          Việc sử dụng và chuyển giao thông tin nhận được từ Google API đến bất kỳ ứng dụng nào khác
          sẽ tuân thủ
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">
            Google API Services User Data Policy</a>, bao gồm các yêu cầu về Limited Use (Sử dụng hạn chế).
        </p>
        <p>Cụ thể, ứng dụng của chúng tôi:</p>
        <ul>
          <li>Chỉ sử dụng dữ liệu Google Drive để cung cấp chức năng sao chép cho người dùng.</li>
          <li>Không sử dụng dữ liệu cho quảng cáo.</li>
          <li>Không chuyển dữ liệu cho bên thứ ba (trừ khi cần để cung cấp dịch vụ hoặc theo yêu cầu pháp luật).</li>
          <li>Không sử dụng dữ liệu để huấn luyện AI/ML.</li>
          <li>Con người chỉ đọc dữ liệu khi có sự cho phép rõ ràng của người dùng, cho mục đích bảo mật,
            hoặc để tuân thủ pháp luật.</li>
        </ul>
      </section>

      <section>
        <h2>7. Quyền của người dùng</h2>
        <p>Bạn có quyền:</p>
        <ul>
          <li><strong>Đăng xuất bất kỳ lúc nào</strong> — xóa hoàn toàn session và token trên server.</li>
          <li><strong>Thu hồi quyền truy cập</strong> — vào
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">
              Cài đặt bảo mật Google</a> để thu hồi quyền của ứng dụng.</li>
          <li><strong>Xóa dữ liệu</strong> — do không lưu trữ vĩnh viễn, không có dữ liệu cần xóa.
            Đăng xuất sẽ xóa mọi thông tin liên quan.</li>
        </ul>
      </section>

      <section>
        <h2>8. Bảo mật</h2>
        <p>Chúng tôi áp dụng các biện pháp bảo mật:</p>
        <ul>
          <li>Giao tiếp qua HTTPS được mã hóa.</li>
          <li>Token được lưu trong session httpOnly, không thể truy cập từ JavaScript phía client.</li>
          <li>Cookie sử dụng SameSite policy để ngăn chặn CSRF attacks.</li>
          <li>CORS được cấu hình chặt chẽ, chỉ cho phép origin đã đăng ký.</li>
          <li>Không lưu trữ dữ liệu nhạy cảm vĩnh viễn.</li>
        </ul>
      </section>

      <section>
        <h2>9. Cookies</h2>
        <p>
          Ứng dụng sử dụng cookie session (httpOnly) duy nhất để duy trì phiên đăng nhập.
          Cookie này:
        </p>
        <ul>
          <li>Tự động hết hạn sau 2 giờ hoặc khi đăng xuất.</li>
          <li>Không dùng cho tracking hoặc quảng cáo.</li>
          <li>Là cookie thiết yếu (essential) — cần thiết cho chức năng cơ bản của ứng dụng.</li>
        </ul>
      </section>

      <section>
        <h2>10. Trẻ em</h2>
        <p>
          Dịch vụ không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập
          thông tin cá nhân từ trẻ em dưới 13 tuổi.
        </p>
      </section>

      <section>
        <h2>11. Thay đổi Chính sách</h2>
        <p>
          Chúng tôi có thể cập nhật Chính sách Quyền riêng tư này theo thời gian.
          Mọi thay đổi sẽ được đăng trên trang này với ngày cập nhật mới.
          Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận
          Chính sách đã cập nhật.
        </p>
      </section>

      <section>
        <h2>12. Liên hệ</h2>
        <p>
          Nếu bạn có câu hỏi về Chính sách Quyền riêng tư này, vui lòng liên hệ qua email:
          <a href="mailto:support@drivecopy.app">support@drivecopy.app</a>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicyView',
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

.important-note {
  background: var(--warning-light);
  border-left: 3px solid var(--warning);
  padding: 12px 16px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin: 12px 0;
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
