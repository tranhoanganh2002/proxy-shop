import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDecimal,
  IsBoolean,
  Matches,
  IsInt,
  Min,
  Max,
} from 'class-validator';

/**
 * Sanitize input để tránh XSS attacks
 * @param input - Chuỗi input cần làm sạch
 * @returns Chuỗi đã được làm sạch
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 * @param email - Email cần validate
 * @returns true nếu email hợp lệ
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnam format)
 * @param phone - Số điện thoại cần validate
 * @returns true nếu số điện thoại hợp lệ
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate và làm sạch số tiền
 * @param amount - Số tiền cần validate
 * @returns Số tiền đã được validate và làm sạch
 */
export function validateAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0 && isFinite(amount);
}

/**
 * Escape SQL để tránh SQL injection (dùng khi cần raw query)
 * LÀM: Nên sử dụng ORM như Prisma thay vì raw SQL
 * @param value - Giá trị cần escape
 * @returns Giá trị đã được escape
 */
export function escapeSql(value: string): string {
  if (!value) return '';
  return value.replace(/'/g, "''");
}

/**
 * Validate URL
 * @param url - URL cần validate
 * @returns true nếu URL hợp lệ
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate IP address
 * @param ip - IP address cần validate
 * @returns true nếu IP hợp lệ
 */
export function isValidIp(ip: string): boolean {
  const ipv4Regex =
    /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex =
    /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every((part) => parseInt(part) <= 255);
  }
  
  return ipv6Regex.test(ip);
}

/**
 * Sanitize object recursively để tránh XSS
 * @param obj - Object cần làm sạch
 * @returns Object đã được làm sạch
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Rate limit key generator
 * @param identifier - Định danh (IP, user ID, etc.)
 * @param action - Hành động
 * @returns Key cho rate limiting
 */
export function generateRateLimitKey(
  identifier: string,
  action: string,
): string {
  return `rate-limit:${action}:${identifier}`;
}
