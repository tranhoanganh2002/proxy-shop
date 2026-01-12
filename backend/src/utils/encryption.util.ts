import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Mã hóa dữ liệu sử dụng AES-256-GCM
 * @param text - Văn bản cần mã hóa
 * @param encryptionKey - Khóa mã hóa 32 bytes (nếu không cung cấp sẽ lấy từ env)
 * @returns Chuỗi đã mã hóa với định dạng: iv:authTag:encrypted
 */
export function encrypt(text: string, encryptionKey?: string): string {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty');
  }

  const key = encryptionKey || process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }

  // Đảm bảo key có đúng độ dài 32 bytes
  const keyBuffer = Buffer.from(key.slice(0, 64), 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Giải mã dữ liệu đã được mã hóa bằng AES-256-GCM
 * @param encryptedText - Chuỗi đã mã hóa với định dạng: iv:authTag:encrypted
 * @param encryptionKey - Khóa mã hóa 32 bytes (nếu không cung cấp sẽ lấy từ env)
 * @returns Văn bản đã được giải mã
 */
export function decrypt(encryptedText: string, encryptionKey?: string): string {
  if (!encryptedText) {
    throw new Error('Encrypted text cannot be empty');
  }

  const key = encryptionKey || process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }

  // Đảm bảo key có đúng độ dài 32 bytes
  const keyBuffer = Buffer.from(key.slice(0, 64), 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Kiểm tra xem dữ liệu có bị mã hóa không
 * @param text - Văn bản cần kiểm tra
 * @returns true nếu văn bản đã được mã hóa
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  const parts = text.split(':');
  return parts.length === 3 && parts[0].length === 32 && parts[1].length === 32;
}

/**
 * Tạo khóa mã hóa ngẫu nhiên 32 bytes
 * @returns Khóa mã hóa dưới dạng hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
