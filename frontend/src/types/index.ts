export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  balance: number;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface Proxy {
  id: string;
  code: string;
  provider: string;
  proxyDomain?: string;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'EXPIRED';
  expiresAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
