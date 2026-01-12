import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash mật khẩu sử dụng bcrypt với salt rounds = 12
 * @param password - Mật khẩu cần hash
 * @returns Promise với mật khẩu đã được hash
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error('Password cannot be empty');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * So sánh mật khẩu với hash để xác thực
 * @param password - Mật khẩu cần kiểm tra
 * @param hashedPassword - Mật khẩu đã được hash
 * @returns Promise với kết quả true nếu khớp, false nếu không
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Kiểm tra độ mạnh của mật khẩu
 * @param password - Mật khẩu cần kiểm tra
 * @returns Object với thông tin về độ mạnh mật khẩu
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
