# 🚀 Proxy Shop - Website Bán Proxy và Tài Khoản

Website bán proxy và tài khoản với **bảo mật cao**, tích hợp **VietQR**, giao diện tối hiện đại.

## 📋 Mục Lục
- [Tính Năng](#-tính-năng)
- [Bảo Mật](#-bảo-mật)
- [Tech Stack](#️-tech-stack)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Dự Án](#-chạy-dự-án)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)

## ✨ Tính Năng

### 1. Bán Hàng
- **Bán Proxy**: Quản lý và bán proxy với thông tin chi tiết (IP, Port, Provider, Type)
- **Bán Tài Khoản**: Quản lý và bán các loại tài khoản (Facebook, Google, etc.)
- Tìm kiếm và lọc sản phẩm
- Hiển thị trạng thái còn hàng/hết hàng
- Quản lý đơn hàng

### 2. Hệ Thống Thanh Toán
- **Tích hợp VietQR**: Nạp tiền tự động qua QR code
- Hiển thị số dư ví người dùng
- Lịch sử giao dịch chi tiết
- Xác nhận giao dịch tự động

### 3. Hệ Thống Người Dùng
- Đăng ký/Đăng nhập với JWT
- Quản lý thông tin cá nhân
- Xem lịch sử đơn hàng
- Xem lịch sử giao dịch
- Quản lý số dư ví

### 4. Hỗ Trợ Khách Hàng
- Link Zalo hỗ trợ trực tiếp
- Banner thông báo quan trọng
- Hệ thống liên hệ dễ dàng

## 🔐 Bảo Mật

Dự án này được xây dựng với **mức độ bảo mật CỰC KỲ CAO** để bảo vệ dữ liệu khỏi hackers:

### A. Bảo Mật Authentication
- ✅ JWT với access token (15 phút) và refresh token (7 ngày)
- ✅ Bcrypt password hashing (salt rounds = 12)
- ✅ Rate limiting cho login (max 5 lần/15 phút)
- ✅ Session management nghiêm ngặt

### B. Bảo Mật Database
- ✅ **Mã hóa AES-256-GCM** cho tất cả dữ liệu nhạy cảm:
  - Thông tin proxy (IP, username, password)
  - Thông tin tài khoản (username, password)
  - Thông tin đơn hàng
  - Dữ liệu cá nhân
- ✅ Prisma ORM để ngăn SQL injection
- ✅ Environment variables cho connection strings

### C. Bảo Mật API
- ✅ Input validation và sanitization
- ✅ Rate limiting cho tất cả endpoints
- ✅ CORS configuration chính xác
- ✅ Logging suspicious activities
- ✅ XSS và CSRF protection

### D. Bảo Mật Network
- ✅ HTTPS enforcement (production)
- ✅ Security headers (Helmet):
  - Content-Security-Policy (CSP)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security (HSTS)
  - X-XSS-Protection
- ✅ DDoS protection với rate limiting

### E. Bảo Mật Code
- ✅ Không hardcode secrets
- ✅ Environment variables cho config
- ✅ Comprehensive audit logging

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** với App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Dark theme styling
- **Zustand** - State management
- **Axios** - API calls
- **React Hook Form + Zod** - Form validation

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM với PostgreSQL
- **Redis** - Caching và session
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Crypto** - AES-256-GCM encryption

### Database
- **PostgreSQL** - Main database
- **Redis** - Caching, session, rate limiting

### Security
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Class Validator** - Input validation

## 📁 Cấu Trúc Dự Án

```
proxy-shop/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── users/        # User management
│   │   │   ├── proxies/      # Proxy products
│   │   │   ├── accounts/     # Account products
│   │   │   ├── orders/       # Order management
│   │   │   ├── transactions/ # Payment transactions
│   │   │   └── audit/        # Audit logging
│   │   ├── common/           # Shared resources
│   │   │   ├── guards/       # Auth guards
│   │   │   ├── middleware/   # Middleware
│   │   │   ├── decorators/   # Custom decorators
│   │   │   └── filters/      # Exception filters
│   │   ├── config/           # Configuration
│   │   ├── utils/            # Utility functions
│   │   │   ├── encryption.util.ts  # AES-256-GCM
│   │   │   ├── hash.util.ts        # Bcrypt
│   │   │   └── validation.util.ts  # Input validation
│   │   ├── database/         # Database services
│   │   │   ├── prisma.service.ts
│   │   │   └── redis.service.ts
│   │   └── main.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env.example          # Environment template
│   └── package.json
│
├── frontend/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── (auth)/       # Auth pages
│   │   │   ├── (dashboard)/  # Dashboard pages
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities
│   │   ├── stores/           # Zustand stores
│   │   └── types/            # TypeScript types
│   ├── public/               # Static files
│   └── package.json
│
├── docker-compose.yml         # Docker services
├── .gitignore
└── README.md
```

## 🚀 Cài Đặt

### Prerequisites
- Node.js 18+ và npm/yarn
- PostgreSQL 15+
- Redis 7+
- Docker và Docker Compose (optional)

### 1. Clone Repository
```bash
git clone https://github.com/tranhoanganh2002/proxy-shop.git
cd proxy-shop
```

### 2. Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Copy và cấu hình environment variables
cp .env.example .env
# Chỉnh sửa file .env với thông tin của bạn

# Tạo encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy key vào ENCRYPTION_KEY trong .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 3. Setup Frontend

```bash
cd ../frontend

# Cài đặt dependencies
npm install

# Tạo file .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ZALO_SUPPORT_LINK=https://zalo.me/your-zalo-id
EOF
```

### 4. Setup Database với Docker (Optional)

```bash
# Từ thư mục root
docker-compose up -d

# Kiểm tra services đang chạy
docker-compose ps
```

## ⚙️ Cấu Hình

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://proxyshop:proxyshop_password@localhost:5432/proxyshop
REDIS_URL=redis://localhost:6379

# Security - QUAN TRỌNG: Tạo keys mới!
ENCRYPTION_KEY=your-32-byte-hex-key-here  # 64 hex characters
JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# VietQR
VIETQR_API_KEY=your-api-key
VIETQR_CLIENT_ID=your-client-id
VIETQR_ACCOUNT_NUMBER=your-account-number
VIETQR_ACCOUNT_NAME=YOUR_NAME
VIETQR_BANK_CODE=your-bank-code

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Zalo Support
ZALO_SUPPORT_LINK=https://zalo.me/your-zalo-id

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

### Tạo Encryption Key

```bash
# Trong terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy output vào `ENCRYPTION_KEY` trong file `.env`

## 🏃 Chạy Dự Án

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Server chạy tại: http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App chạy tại: http://localhost:3000
```

**Terminal 3 - Database (nếu dùng Docker):**
```bash
docker-compose up
```

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       # Đăng ký
POST   /api/auth/login          # Đăng nhập
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/logout         # Đăng xuất
```

### Users
```
GET    /api/users/profile       # Lấy thông tin user
PUT    /api/users/profile       # Cập nhật thông tin
GET    /api/users/balance       # Lấy số dư ví
```

### Proxies
```
GET    /api/proxies             # Danh sách proxy
GET    /api/proxies/:id         # Chi tiết proxy
POST   /api/proxies             # Tạo proxy (admin)
PUT    /api/proxies/:id         # Cập nhật proxy (admin)
DELETE /api/proxies/:id         # Xóa proxy (admin)
```

### Accounts
```
GET    /api/accounts            # Danh sách tài khoản
GET    /api/accounts/:id        # Chi tiết tài khoản
POST   /api/accounts            # Tạo tài khoản (admin)
PUT    /api/accounts/:id        # Cập nhật (admin)
DELETE /api/accounts/:id        # Xóa (admin)
```

### Orders
```
POST   /api/orders              # Tạo đơn hàng
GET    /api/orders              # Lịch sử đơn hàng
GET    /api/orders/:id          # Chi tiết đơn hàng
```

### Transactions
```
POST   /api/transactions/deposit           # Tạo yêu cầu nạp tiền
GET    /api/transactions/verify/:id        # Verify thanh toán
GET    /api/transactions                   # Lịch sử giao dịch
```

### Admin
```
GET    /api/admin/dashboard     # Thống kê
GET    /api/admin/users         # Quản lý users
PUT    /api/admin/users/:id     # Cập nhật user
GET    /api/admin/audit-logs    # Logs hoạt động
```

## 🔒 Security Best Practices

### 1. Không Commit Secrets
- ❌ Không commit file `.env` vào git
- ✅ Sử dụng `.env.example` cho template
- ✅ Tạo keys riêng cho mỗi môi trường

### 2. Update Dependencies
```bash
# Kiểm tra vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 3. Rate Limiting
- Login: 5 lần / 15 phút
- API: 100 requests / phút
- Custom rate limits cho endpoints nhạy cảm

### 4. Logging
- Log tất cả hoạt động quan trọng
- Không log passwords, tokens
- Monitor suspicious activities

## 🚀 Deployment

### Backend Deployment (VPS/Cloud)

1. **Chuẩn bị server:**
```bash
# Cài đặt Node.js, PostgreSQL, Redis
# Setup Nginx reverse proxy
# Setup SSL với Let's Encrypt
```

2. **Deploy code:**
```bash
git clone repository
cd backend
npm install
npm run build
npm run prisma:generate
npm run prisma:migrate
pm2 start dist/main.js --name proxy-shop-backend
```

3. **Setup Nginx:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
cd frontend
vercel --prod
```

**Environment Variables trên Vercel:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ZALO_SUPPORT_LINK=https://zalo.me/your-id
```

### Database Backup

```bash
# PostgreSQL backup
pg_dump -U proxyshop proxyshop > backup_$(date +%Y%m%d).sql

# Restore
psql -U proxyshop proxyshop < backup_20240112.sql
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 License

MIT License - Chi tiết xem file LICENSE

## 👥 Contact

- Zalo Support: [Link trong .env]
- Email: admin@example.com

## 🙏 Acknowledgments

- Next.js Team
- NestJS Team
- Prisma Team
- VietQR

---

**⚠️ LƯU Ý QUAN TRỌNG:**
1. Đổi tất cả secrets trong file `.env` trước khi deploy
2. Backup database thường xuyên
3. Monitor logs và security alerts
4. Update dependencies định kỳ
5. Test kỹ trước khi deploy lên production
