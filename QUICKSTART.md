# Quick Start Guide - Proxy Shop

This guide will help you get the Proxy Shop application running on your local machine in under 10 minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** 18 or higher ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** (comes with Node.js)
- ✅ **Docker** and **Docker Compose** ([Download](https://www.docker.com/get-started))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

Verify installations:
```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
docker --version
docker-compose --version
```

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/tranhoanganh2002/proxy-shop.git
cd proxy-shop
```

### Step 2: Start Database Services

```bash
# Start PostgreSQL and Redis with Docker Compose
docker-compose up -d

# Verify services are running
docker-compose ps
```

You should see:
```
NAME                    STATUS
proxy-shop-postgres     Up
proxy-shop-redis        Up
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Generate a secure encryption key
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and paste it into your .env file

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start backend server
npm run start:dev
```

Backend should now be running at: **http://localhost:3001**

### Step 4: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ZALO_SUPPORT_LINK=https://zalo.me/your-zalo-id
EOF

# Start frontend server
npm run dev
```

Frontend should now be running at: **http://localhost:3000**

### Step 5: Test the Application

1. Open your browser to **http://localhost:3000**
2. Click "Đăng ký ngay" to create an account
3. Fill in the registration form
4. You'll be automatically logged in and redirected!

## ✅ Verification Checklist

- [ ] Docker containers are running (`docker-compose ps`)
- [ ] Backend is running on port 3001
- [ ] Frontend is running on port 3000
- [ ] You can access http://localhost:3000
- [ ] You can register a new account
- [ ] You can login successfully

## 🎯 What's Next?

Now that you have the application running:

### For Users:
1. **Register an account** at http://localhost:3000/register
2. **Login** at http://localhost:3000/login
3. **Browse proxies** (coming soon in dashboard)
4. **Make purchases** (coming soon)

### For Developers:
1. **Explore the API** - Check `API.md` for all endpoints
2. **Read the code** - Both frontend and backend are well-documented
3. **Make changes** - Hot reload is enabled for both services
4. **Run tests** - `npm run test` in backend directory

## 🛠️ Development Workflow

### Backend Development

```bash
cd backend

# Run in development mode (auto-reload)
npm run start:dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# View database in Prisma Studio
npm run prisma:studio
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Database Management

```bash
# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database
npm run prisma:studio
```

## 🔧 Troubleshooting

### Backend won't start

**Problem:** Port 3001 already in use
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

**Problem:** Database connection error
```bash
# Restart Docker containers
docker-compose restart
```

### Frontend won't start

**Problem:** Port 3000 already in use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database migration errors

```bash
# Reset database (WARNING: Deletes all data)
cd backend
npx prisma migrate reset
npm run prisma:generate
```

### Docker issues

```bash
# Stop all containers
docker-compose down

# Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

## 📱 Testing the API

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User",
    "phone": "0123456789"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Get profile (replace TOKEN with your access token)
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API collection from `API.md`
2. Set the base URL to `http://localhost:3001/api`
3. Test endpoints

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.ts`:
```typescript
colors: {
  accent: {
    red: '#dc2626',  // Change this
  },
}
```

### Add New Features

1. **Backend**: Create new modules in `backend/src/modules/`
2. **Frontend**: Create new pages in `frontend/src/app/`
3. **Database**: Modify `backend/prisma/schema.prisma` and run migration

## 📚 Additional Resources

- **README.md** - Full project documentation
- **API.md** - Complete API reference
- **SECURITY.md** - Security best practices
- **DEPLOYMENT.md** - Production deployment guide

## 🐛 Common Issues

### "ENCRYPTION_KEY is not defined"

Make sure you've created the `.env` file in the backend directory and added a valid encryption key:
```bash
cd backend
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add this to ENCRYPTION_KEY in .env
```

### "Cannot find module '@prisma/client'"

Run Prisma generate:
```bash
cd backend
npm run prisma:generate
```

### "Module not found: Can't resolve '@/lib/api'"

Make sure you're in the frontend directory and have run `npm install`:
```bash
cd frontend
npm install
```

## 💬 Get Help

- **GitHub Issues**: https://github.com/tranhoanganh2002/proxy-shop/issues
- **Email**: admin@example.com
- **Zalo**: [Your Zalo Link]

## 🎉 Success!

If you've made it this far, you should have:
- ✅ Backend running on http://localhost:3001
- ✅ Frontend running on http://localhost:3000
- ✅ Database and Redis running in Docker
- ✅ Ability to register and login

Now you're ready to start developing! Happy coding! 🚀

---

**Last Updated:** 2024-01-12  
**Version:** 1.0.0
