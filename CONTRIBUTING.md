# Development Guidelines - Proxy Shop

This document provides coding standards, best practices, and guidelines for contributing to the Proxy Shop project.

## 📋 Table of Contents
- [Code Style](#code-style)
- [TypeScript Guidelines](#typescript-guidelines)
- [Security Best Practices](#security-best-practices)
- [API Development](#api-development)
- [Frontend Development](#frontend-development)
- [Testing](#testing)
- [Git Workflow](#git-workflow)

## 🎨 Code Style

### General Rules
- **Use TypeScript** for all new files
- **Follow existing patterns** in the codebase
- **Write descriptive variable names** - prefer `userBalance` over `bal`
- **Add comments** for complex logic in Vietnamese or English
- **Keep functions small** - ideally under 50 lines
- **Use async/await** over promises chains

### Formatting
We use Prettier for code formatting:

```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run lint --fix
```

### Naming Conventions

**Backend (NestJS):**
- Files: `user.service.ts`, `auth.controller.ts`, `create-user.dto.ts`
- Classes: `UserService`, `AuthController`, `CreateUserDto`
- Methods: `createUser()`, `findAllProxies()`, `updateProfile()`
- Constants: `SALT_ROUNDS`, `JWT_ACCESS_EXPIRY`

**Frontend (Next.js):**
- Files: `page.tsx`, `LoginForm.tsx`, `api.ts`
- Components: `LoginForm`, `ProxyCard`, `DashboardLayout`
- Functions: `handleSubmit()`, `fetchProxies()`, `formatPrice()`
- Hooks: `useAuth()`, `useProxies()`, `useBalance()`

## 📘 TypeScript Guidelines

### Always Define Types

**Bad:**
```typescript
function getUser(id) {
  return api.get('/users/' + id);
}
```

**Good:**
```typescript
async function getUser(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}
```

### Use Interfaces for Data Structures

```typescript
interface CreateProxyDto {
  code: string;
  provider: string;
  proxyIp: string;
  proxyPort: number;
  type: 'HTTP' | 'SOCKS5';
  price: number;
}
```

### Avoid `any` Type

**Bad:**
```typescript
function processData(data: any) { ... }
```

**Good:**
```typescript
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Process data
  }
}
```

## 🔒 Security Best Practices

### 1. Never Hardcode Secrets

**Bad:**
```typescript
const API_KEY = 'abc123xyz';
```

**Good:**
```typescript
const API_KEY = process.env.VIETQR_API_KEY;
```

### 2. Always Validate Input

```typescript
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 3. Sanitize User Input

```typescript
import { sanitizeInput } from '@/utils/validation.util';

const cleanInput = sanitizeInput(userInput);
```

### 4. Use Encryption for Sensitive Data

```typescript
import { encrypt, decrypt } from '@/utils/encryption.util';

// Encrypt before saving
const encryptedData = encrypt(sensitiveData);

// Decrypt when needed
const originalData = decrypt(encryptedData);
```

### 5. Implement Rate Limiting

```typescript
@UseGuards(ThrottlerGuard)
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // Login logic
}
```

## 🚀 API Development

### RESTful Endpoints

Follow REST conventions:
- `GET /api/proxies` - List all
- `GET /api/proxies/:id` - Get one
- `POST /api/proxies` - Create new
- `PUT /api/proxies/:id` - Update
- `DELETE /api/proxies/:id` - Delete

### Error Handling

```typescript
try {
  const user = await this.userService.findOne(id);
  return user;
} catch (error) {
  throw new NotFoundException('Người dùng không tồn tại');
}
```

### Response Format

**Success:**
```json
{
  "data": { ... },
  "message": "Success"
}
```

**Error:**
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy",
  "error": "Not Found"
}
```

### Pagination

```typescript
async findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    this.prisma.proxy.findMany({ skip, take: limit }),
    this.prisma.proxy.count(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

## 🎨 Frontend Development

### Component Structure

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Props {
  userId: string;
}

export default function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    // Load user logic
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### State Management

**Local State (useState):**
```typescript
const [count, setCount] = useState(0);
```

**Global State (Zustand - when needed):**
```typescript
import create from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### API Calls

```typescript
import { api } from '@/lib/api';

const fetchProxies = async () => {
  try {
    const response = await api.get('/proxies');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch proxies:', error);
    throw error;
  }
};
```

### Form Handling

```typescript
const [formData, setFormData] = useState({
  email: '',
  password: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Submit logic
};
```

## 🧪 Testing

### Unit Tests (Backend)

```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    // Setup
  });

  it('should create a user', async () => {
    const user = await service.create({
      email: 'test@example.com',
      password: 'Test123!',
      fullName: 'Test User',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### Running Tests

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 🔀 Git Workflow

### Branch Naming

- `feature/user-authentication`
- `fix/login-error`
- `refactor/api-client`
- `docs/api-documentation`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user registration endpoint
fix: resolve login token refresh issue
docs: update API documentation
refactor: simplify encryption utility
test: add unit tests for auth service
```

### Pull Request Process

1. Create a branch from `main`
2. Make your changes
3. Write/update tests
4. Run linter and tests
5. Create pull request
6. Wait for review
7. Merge after approval

## 📦 Adding Dependencies

### Backend

```bash
cd backend
npm install package-name
```

**Update `package.json` with version:**
```json
{
  "dependencies": {
    "package-name": "^1.0.0"
  }
}
```

### Frontend

```bash
cd frontend
npm install package-name
```

## 🐛 Debugging

### Backend Debugging

```typescript
// Add debug logs
console.log('[DEBUG] User data:', user);

// Use NestJS Logger
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(UserService.name);

this.logger.debug('Processing user registration');
this.logger.error('Failed to create user', error);
```

### Frontend Debugging

```typescript
// Use console methods
console.log('User:', user);
console.error('API Error:', error);
console.table(users);

// React DevTools
// Install React DevTools browser extension
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 💬 Getting Help

- Check existing documentation
- Search GitHub issues
- Ask in team chat
- Create a new issue with details

---

**Remember:** Write code that is easy to read, maintain, and secure. When in doubt, ask for a code review!

**Last Updated:** 2024-01-12  
**Version:** 1.0.0
