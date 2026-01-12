'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi } from '@/lib/api';
import type { User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-secondary">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-secondary border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-accent-red">Proxy Shop</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-text-secondary">Xin chào,</p>
              <p className="font-semibold">{user?.fullName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-background-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm mb-1">Số dư ví</p>
              <p className="text-2xl font-bold text-success">
                {user?.balance.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm mb-1">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm mb-1">Số điện thoại</p>
              <p className="text-lg">{user?.phone || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link
            href="/dashboard/proxies"
            className="bg-background-secondary p-6 rounded-lg hover:bg-opacity-80 transition-all"
          >
            <div className="text-accent-red text-3xl mb-2">🔌</div>
            <h3 className="font-semibold mb-1">Mua Proxy</h3>
            <p className="text-sm text-text-secondary">
              Xem và mua proxy chất lượng cao
            </p>
          </Link>

          <Link
            href="/dashboard/accounts"
            className="bg-background-secondary p-6 rounded-lg hover:bg-opacity-80 transition-all"
          >
            <div className="text-accent-red text-3xl mb-2">👤</div>
            <h3 className="font-semibold mb-1">Mua Tài Khoản</h3>
            <p className="text-sm text-text-secondary">
              Xem và mua tài khoản
            </p>
          </Link>

          <Link
            href="/dashboard/deposit"
            className="bg-background-secondary p-6 rounded-lg hover:bg-opacity-80 transition-all"
          >
            <div className="text-success text-3xl mb-2">💰</div>
            <h3 className="font-semibold mb-1">Nạp Tiền</h3>
            <p className="text-sm text-text-secondary">
              Nạp tiền qua VietQR
            </p>
          </Link>

          <Link
            href="/dashboard/orders"
            className="bg-background-secondary p-6 rounded-lg hover:bg-opacity-80 transition-all"
          >
            <div className="text-warning text-3xl mb-2">📦</div>
            <h3 className="font-semibold mb-1">Đơn Hàng</h3>
            <p className="text-sm text-text-secondary">
              Xem lịch sử mua hàng
            </p>
          </Link>
        </div>

        {/* Notice Banner */}
        <div className="bg-accent-red bg-opacity-10 border border-accent-red rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-accent-red text-xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-accent-red mb-1">
                Thông báo quan trọng
              </h3>
              <p className="text-sm text-text-secondary">
                Tuyển đại lý cấp website riêng bán hàng. Vui lòng liên hệ qua Zalo để biết thêm chi tiết.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_ZALO_SUPPORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-accent-red hover:underline"
              >
                Liên hệ Zalo →
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background-secondary p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🔐 Bảo mật cao</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✅ Mã hóa dữ liệu AES-256-GCM</li>
              <li>✅ JWT Authentication</li>
              <li>✅ Bcrypt password hashing</li>
              <li>✅ Rate limiting protection</li>
            </ul>
          </div>

          <div className="bg-background-secondary p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">⚡ Tính năng</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✅ Proxy chất lượng cao</li>
              <li>✅ Tài khoản đa dạng</li>
              <li>✅ Thanh toán VietQR</li>
              <li>✅ Hỗ trợ 24/7 qua Zalo</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-text-secondary text-sm">
          <p>© 2024 Proxy Shop. All rights reserved.</p>
          <p className="mt-2">
            Hỗ trợ:{' '}
            <a
              href={process.env.NEXT_PUBLIC_ZALO_SUPPORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-red hover:underline"
            >
              Zalo
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
