# API Documentation - Proxy Shop

Base URL: `http://localhost:3001/api` (development)  
Production URL: `https://api.yourdomain.com/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clr123456",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "balance": 0,
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clr123456",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "balance": 50000,
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 👤 User Endpoints

All user endpoints require authentication.

### Get Profile
**GET** `/users/profile`

Get current user profile.

**Response:** `200 OK`
```json
{
  "id": "clr123456",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "balance": 50000,
  "role": "USER",
  "isActive": true,
  "createdAt": "2024-01-12T10:00:00.000Z"
}
```

---

### Update Profile
**PUT** `/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321"
}
```

**Response:** `200 OK`
```json
{
  "id": "clr123456",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321",
  "balance": 50000,
  "role": "USER"
}
```

---

### Change Password
**PUT** `/users/change-password`

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Đổi mật khẩu thành công"
}
```

---

### Get Balance
**GET** `/users/balance`

Get current wallet balance.

**Response:** `200 OK`
```json
{
  "balance": 50000
}
```

---

## 📡 Proxy Endpoints

### List Proxies
**GET** `/proxies`

Get list of available proxies with pagination.

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `status` (optional): Filter by status (AVAILABLE, SOLD, RESERVED, EXPIRED)

**Example:** `/proxies?page=1&limit=20&status=AVAILABLE`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "clr789012",
      "code": "PROXY001",
      "provider": "Viettel",
      "proxyDomain": "proxy.example.com",
      "type": "HTTP",
      "price": 50000,
      "status": "AVAILABLE",
      "expiresAt": "2024-12-31T23:59:59.000Z",
      "note": "Proxy chất lượng cao",
      "createdAt": "2024-01-10T10:00:00.000Z",
      "updatedAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### Get Proxy Details
**GET** `/proxies/:id`

Get details of a specific proxy.

**Response:** `200 OK`
```json
{
  "id": "clr789012",
  "code": "PROXY001",
  "provider": "Viettel",
  "proxyDomain": "proxy.example.com",
  "type": "HTTP",
  "price": 50000,
  "status": "AVAILABLE",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "note": "Proxy chất lượng cao",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

**Note:** Full proxy details (IP, username, password) are only visible after purchase.

---

### Create Proxy (Admin Only)
**POST** `/proxies`

Create a new proxy. Requires ADMIN or SUPER_ADMIN role.

**Request Body:**
```json
{
  "code": "PROXY002",
  "provider": "Viettel",
  "proxyIp": "123.45.67.89",
  "proxyPort": 8080,
  "proxyUser": "user123",
  "proxyPassword": "pass123",
  "proxyDomain": "proxy.example.com",
  "type": "HTTP",
  "price": 50000,
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "note": "Proxy VIP"
}
```

**Response:** `201 Created`
```json
{
  "id": "clr789013",
  "code": "PROXY002",
  "provider": "Viettel",
  "proxyDomain": "proxy.example.com",
  "type": "HTTP",
  "price": 50000,
  "status": "AVAILABLE",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "note": "Proxy VIP",
  "createdAt": "2024-01-12T10:00:00.000Z",
  "updatedAt": "2024-01-12T10:00:00.000Z"
}
```

**Note:** Sensitive data (proxyIp, proxyUser, proxyPassword) are encrypted in the database.

---

### Update Proxy (Admin Only)
**PUT** `/proxies/:id`

Update proxy information. Requires ADMIN or SUPER_ADMIN role.

**Request Body:**
```json
{
  "price": 60000,
  "note": "Proxy VIP Updated",
  "status": "RESERVED"
}
```

**Response:** `200 OK`
```json
{
  "id": "clr789012",
  "code": "PROXY001",
  "provider": "Viettel",
  "proxyDomain": "proxy.example.com",
  "type": "HTTP",
  "price": 60000,
  "status": "RESERVED",
  "note": "Proxy VIP Updated",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-12T11:00:00.000Z"
}
```

---

### Delete Proxy (Admin Only)
**DELETE** `/proxies/:id`

Delete a proxy. Requires ADMIN or SUPER_ADMIN role.

**Response:** `200 OK`
```json
{
  "message": "Xóa proxy thành công"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền thực hiện hành động này",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Proxy không tồn tại",
  "error": "Not Found"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later",
  "error": "Too Many Requests"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

- **Login endpoint**: 5 requests per 15 minutes per IP
- **General API**: 100 requests per minute per IP
- **Admin endpoints**: 50 requests per minute

---

## Security Notes

1. **HTTPS Only**: All production requests must use HTTPS
2. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days
3. **Password Requirements**: Minimum 8 characters
4. **Encryption**: All sensitive proxy and account data is encrypted with AES-256-GCM
5. **CORS**: Only whitelisted domains can access the API

---

## Postman Collection

Import this collection to Postman for easy testing:

```json
{
  "info": {
    "name": "Proxy Shop API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{accessToken}}",
        "type": "string"
      }
    ]
  }
}
```

---

## Support

For API support:
- Email: api-support@example.com
- Zalo: [Link from .env]
- Documentation: https://github.com/tranhoanganh2002/proxy-shop

---

**Last Updated:** 2024-01-12  
**API Version:** 1.0.0
