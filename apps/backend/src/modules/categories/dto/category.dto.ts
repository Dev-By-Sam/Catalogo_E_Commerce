import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Architectural Objects' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'architectural-objects' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Precision-engineered physical objects and functional art' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c' })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Architectural Objects' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'architectural-objects' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Precision-engineered physical objects and functional art' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c' })
  @IsString()
  @IsOptional()
  image?: string;
}
