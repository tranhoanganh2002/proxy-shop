export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-accent-red">
          🚀 Proxy Shop
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          Website bán Proxy và Tài khoản với bảo mật cao
        </p>
        <div className="space-y-4 text-left max-w-2xl mx-auto">
          <div className="bg-background-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">✅ Tính năng chính:</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Bán Proxy với mã hóa AES-256-GCM</li>
              <li>Bán Tài khoản bảo mật cao</li>
              <li>Tích hợp VietQR để nạp tiền</li>
              <li>Hệ thống đăng ký/đăng nhập JWT</li>
              <li>Giao diện tối hiện đại</li>
              <li>Hỗ trợ qua Zalo</li>
            </ul>
          </div>
          <div className="bg-background-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🔐 Bảo mật:</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Mã hóa dữ liệu nhạy cảm (AES-256-GCM)</li>
              <li>JWT Authentication với refresh token</li>
              <li>Bcrypt password hashing (12 rounds)</li>
              <li>Rate limiting và CORS protection</li>
              <li>Security headers (Helmet)</li>
              <li>Input validation và sanitization</li>
            </ul>
          </div>
          <div className="bg-background-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🛠️ Tech Stack:</h2>
            <div className="grid grid-cols-2 gap-4 text-text-secondary">
              <div>
                <strong className="text-text-primary">Frontend:</strong>
                <ul className="list-disc list-inside mt-2">
                  <li>Next.js 14</li>
                  <li>TypeScript</li>
                  <li>TailwindCSS</li>
                  <li>Zustand</li>
                </ul>
              </div>
              <div>
                <strong className="text-text-primary">Backend:</strong>
                <ul className="list-disc list-inside mt-2">
                  <li>NestJS</li>
                  <li>Prisma ORM</li>
                  <li>PostgreSQL</li>
                  <li>Redis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <a
            href="/login"
            className="bg-accent-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </main>
  )
}
