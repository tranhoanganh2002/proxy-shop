import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });
  }

  async onModuleInit() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.client.quit();
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  /**
   * Set giá trị với TTL
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Get giá trị theo key
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Check key tồn tại
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Increment counter (cho rate limiting)
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Set TTL cho key
   */
  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  /**
   * Get TTL của key
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}
