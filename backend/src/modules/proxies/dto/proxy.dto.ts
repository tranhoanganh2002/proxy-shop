import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateProxyDto {
  @IsString({ message: 'Mã proxy phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mã proxy không được để trống' })
  code: string;

  @IsString({ message: 'Nhà mạng phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nhà mạng không được để trống' })
  provider: string;

  @IsString({ message: 'Proxy IP phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Proxy IP không được để trống' })
  proxyIp: string;

  @IsNumber({}, { message: 'Proxy Port phải là số' })
  @IsNotEmpty({ message: 'Proxy Port không được để trống' })
  proxyPort: number;

  @IsString({ message: 'Proxy User phải là chuỗi ký tự' })
  @IsOptional()
  proxyUser?: string;

  @IsString({ message: 'Proxy Password phải là chuỗi ký tự' })
  @IsOptional()
  proxyPassword?: string;

  @IsString({ message: 'Proxy Domain phải là chuỗi ký tự' })
  @IsOptional()
  proxyDomain?: string;

  @IsString({ message: 'Loại proxy phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Loại proxy không được để trống' })
  type: string; // HTTP, SOCKS5

  @IsNumber({}, { message: 'Giá phải là số' })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @IsDateString({}, { message: 'Ngày hết hạn không hợp lệ' })
  @IsOptional()
  expiresAt?: string;

  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  note?: string;
}

export class UpdateProxyDto {
  @IsString({ message: 'Nhà mạng phải là chuỗi ký tự' })
  @IsOptional()
  provider?: string;

  @IsString({ message: 'Proxy Domain phải là chuỗi ký tự' })
  @IsOptional()
  proxyDomain?: string;

  @IsNumber({}, { message: 'Giá phải là số' })
  @IsOptional()
  price?: number;

  @IsDateString({}, { message: 'Ngày hết hạn không hợp lệ' })
  @IsOptional()
  expiresAt?: string;

  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  note?: string;

  @IsString({ message: 'Trạng thái phải là chuỗi ký tự' })
  @IsOptional()
  status?: string;
}
