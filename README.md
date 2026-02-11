# 📂 Drive Copy — Sao chép Google Drive được chia sẻ

Ứng dụng web cho phép copy toàn bộ thư mục Google Drive được chia sẻ về Drive cá nhân, nhanh chóng và an toàn.

## ✨ Tính năng chính

- 🔐 **OAuth Login**: Đăng nhập Google an toàn
- 📋 **Paste & Go**: Chỉ cần dán link thư mục được share
- 📂 **Folder Picker**: Chọn nơi lưu qua tree view Drive
- 🔄 **Đệ quy copy**: Copy toàn bộ cây thư mục (subfolder, files)
- 📊 **Real-time Progress**: Theo dõi tiến trình copy trực tiếp
- 🚫 **Exclude Filter**: Bỏ qua files theo cụm từ (.mp4, .srt, ...)
- 🌗 **Light/Dark Mode**: Giao diện tông trắng đẹp, hỗ trợ dark mode
- 🛡️ **Bảo mật**: Không tải file về server, chỉ dùng Google API

## 🛠️ Tech Stack

| Layer    | Technology                           |
|----------|--------------------------------------|
| Backend  | Node.js + Express                    |
| Frontend | Vue.js 3 + Vite                      |
| Auth     | Google OAuth2 (google-auth-library)  |
| API      | Google Drive API v3 (googleapis)     |

## 📦 Cài đặt

### 1. Clone & Install

```bash
cd drive-copy-app
npm install
cd client && npm install
cd ..
```

### 2. Tạo Google OAuth Credentials

1. Vào [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Tạo project mới hoặc chọn project có sẵn
3. Bật **Google Drive API** tại [API Library](https://console.cloud.google.com/apis/library/drive.googleapis.com)
4. Tạo **OAuth 2.0 Client ID** (Web Application):
   - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
5. Copy **Client ID** và **Client Secret**

### 3. Cấu hình .env

Sửa file `.env` trong thư mục gốc:

```env
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_random_secret_string
PORT=3000
CLIENT_URL=http://localhost:5173
```

### 4. Chạy ứng dụng

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client

# Hoặc chạy cả hai:
npm run dev
```

Mở browser: **http://localhost:5173**

## 📁 Cấu trúc Project

```
drive-copy-app/
├── server/
│   ├── index.js              # Express server entry
│   └── routes/
│       ├── auth.js            # OAuth2 endpoints
│       └── api.js             # Drive API endpoints + copy logic
├── client/
│   ├── index.html             # HTML entry
│   ├── vite.config.js         # Vite config with proxy
│   └── src/
│       ├── main.js            # Vue entry
│       ├── style.css          # Global design system
│       ├── App.vue            # Main app layout
│       ├── api/
│       │   └── index.js       # Axios API client
│       ├── router/
│       │   └── index.js       # Vue Router config
│       ├── views/
│       │   ├── LoginView.vue  # Login page
│       │   └── DashboardView.vue  # Main dashboard
│       └── components/
│           ├── CopyForm.vue       # Copy form (3 steps)
│           ├── FolderPicker.vue   # Drive folder tree view
│           ├── FolderNode.vue     # Folder tree node
│           ├── ProgressMonitor.vue # Real-time progress
│           └── UserGuide.vue      # Usage guide
├── .env                       # Environment variables
├── .env.example               # Template
└── package.json
```

## 🔌 API Endpoints

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/auth/google`                    | Redirect đến Google OAuth      |
| GET    | `/auth/google/callback`           | Xử lý OAuth callback           |
| GET    | `/auth/me`                        | Lấy thông tin user đã đăng nhập |
| POST   | `/auth/logout`                    | Đăng xuất                      |
| GET    | `/api/folders`                    | List folders (tree view)       |
| GET    | `/api/check-url?url=...`          | Validate & extract folder ID   |
| GET    | `/api/check-access/:folderId`     | Kiểm tra quyền truy cập       |
| POST   | `/api/copy`                       | Bắt đầu copy (trả jobId)      |
| GET    | `/api/copy-progress/:jobId`       | SSE stream tiến trình          |
| GET    | `/api/copy-status/:jobId`         | Polling fallback               |

## ⚠️ Lưu ý

- App sử dụng scope `https://www.googleapis.com/auth/drive` (full access) — cần thiết để truy cập shared folders
- Google Drive giới hạn copy/upload **750 GB/ngày**
- Không đóng tab khi đang copy
- Files bị owner giới hạn "chỉ xem" sẽ fail copy và được báo riêng

## 📄 License

MIT
