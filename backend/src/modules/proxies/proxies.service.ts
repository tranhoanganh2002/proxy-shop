import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProxyDto, UpdateProxyDto } from './dto/proxy.dto';
import { encrypt, decrypt } from '../../utils/encryption.util';

@Injectable()
export class ProxiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tạo proxy mới (admin only)
   */
  async create(createProxyDto: CreateProxyDto) {
    // Mã hóa thông tin nhạy cảm
    const encryptedData = {
      code: createProxyDto.code,
      provider: createProxyDto.provider,
      proxyIp: encrypt(createProxyDto.proxyIp),
      proxyPort: createProxyDto.proxyPort,
      proxyUser: createProxyDto.proxyUser ? encrypt(createProxyDto.proxyUser) : null,
      proxyPassword: createProxyDto.proxyPassword ? encrypt(createProxyDto.proxyPassword) : null,
      proxyDomain: createProxyDto.proxyDomain,
      type: createProxyDto.type,
      price: createProxyDto.price,
      expiresAt: createProxyDto.expiresAt ? new Date(createProxyDto.expiresAt) : null,
      note: createProxyDto.note,
    };

    const proxy = await this.prisma.proxy.create({
      data: encryptedData,
    });

    return this.formatProxyResponse(proxy, false);
  }

  /**
   * Lấy danh sách proxy
   */
  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [proxies, total] = await Promise.all([
      this.prisma.proxy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.proxy.count({ where }),
    ]);

    return {
      data: proxies.map((proxy) => this.formatProxyResponse(proxy, false)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết proxy (sau khi mua sẽ decrypt)
   */
  async findOne(id: string, userId?: string, shouldDecrypt: boolean = false) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy không tồn tại');
    }

    // Chỉ decrypt nếu user đã mua proxy này
    if (shouldDecrypt) {
      // TODO: Kiểm tra xem user đã mua proxy này chưa
      return this.formatProxyResponse(proxy, true);
    }

    return this.formatProxyResponse(proxy, false);
  }

  /**
   * Cập nhật proxy (admin only)
   */
  async update(id: string, updateProxyDto: UpdateProxyDto) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy không tồn tại');
    }

    const updatedProxy = await this.prisma.proxy.update({
      where: { id },
      data: {
        ...updateProxyDto,
        expiresAt: updateProxyDto.expiresAt ? new Date(updateProxyDto.expiresAt) : undefined,
      },
    });

    return this.formatProxyResponse(updatedProxy, false);
  }

  /**
   * Xóa proxy (admin only)
   */
  async remove(id: string) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy không tồn tại');
    }

    await this.prisma.proxy.delete({
      where: { id },
    });

    return { message: 'Xóa proxy thành công' };
  }

  /**
   * Format response proxy (ẩn hoặc hiện thông tin nhạy cảm)
   */
  private formatProxyResponse(proxy: any, shouldDecrypt: boolean) {
    if (shouldDecrypt) {
      return {
        ...proxy,
        proxyIp: decrypt(proxy.proxyIp),
        proxyUser: proxy.proxyUser ? decrypt(proxy.proxyUser) : null,
        proxyPassword: proxy.proxyPassword ? decrypt(proxy.proxyPassword) : null,
      };
    }

    // Không decrypt, chỉ trả về thông tin public
    return {
      id: proxy.id,
      code: proxy.code,
      provider: proxy.provider,
      proxyDomain: proxy.proxyDomain,
      type: proxy.type,
      price: proxy.price,
      status: proxy.status,
      expiresAt: proxy.expiresAt,
      note: proxy.note,
      createdAt: proxy.createdAt,
      updatedAt: proxy.updatedAt,
    };
  }
}
