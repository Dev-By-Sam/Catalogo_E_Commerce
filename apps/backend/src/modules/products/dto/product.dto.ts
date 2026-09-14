import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class VariantDto {
  @ApiPropertyOptional({ example: 'var-123' })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'KNT-01-BLK-42' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiPropertyOptional({ example: '42' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ example: 'Obsidian Black' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: '#0D0D0D' })
  @IsString()
  @IsOptional()
  colorHex?: string;

  @ApiProperty({ example: 280.00 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 340.00 })
  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  stock: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  minStockAlert?: number;
}

export class MediaDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Front view' })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isCover?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Monolith Tactical Vest' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'monolith-tactical-vest' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Architectural modular vest crafted from ballistic nylon and titanium hardware.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: '{"material":"Ballistic Cordura 1000D","weight":"820g","hardware":"Anodized Aluminum"}' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ example: 'category-uuid-123' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  has3D?: boolean;

  @ApiPropertyOptional({ example: '/models/monolith_vest.glb' })
  @IsString()
  @IsOptional()
  model3dUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ type: [VariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

  @ApiPropertyOptional({ type: [MediaDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Monolith Tactical Vest V2' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'monolith-tactical-vest-v2' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '{"material":"Ballistic Cordura 1000D"}' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ example: 'category-uuid-123' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  has3D?: boolean;

  @ApiPropertyOptional({ example: '/models/monolith_vest.glb' })
  @IsString()
  @IsOptional()
  model3dUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [VariantDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants?: VariantDto[];

  @ApiPropertyOptional({ type: [MediaDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

export class QueryProductsDto {
  @ApiPropertyOptional({ example: 'tactical' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'apparel' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'L' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ example: 'Black' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  inStock?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  featured?: boolean;

  @ApiPropertyOptional({ enum: ['newest', 'price_asc', 'price_desc', 'featured'], example: 'newest' })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 12 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;
}
