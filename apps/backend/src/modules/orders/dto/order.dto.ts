import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength, MaxLength, Matches, ValidateNested, IsEmpty, Equals } from 'class-validator';
import { PaymentMethod, OrderStatus } from '../../../common/enums';

export class OrderItemInputDto {
  @ApiProperty({ example: 'product-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'variant-uuid-456' })
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Alex Mercer' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'El nombre debe tener al menos 4 caracteres' })
  @MaxLength(70, { message: 'El nombre es demasiado largo' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre debe contener al menos un nombre y un apellido válido (solo letras)' })
  customerName: string;

  @ApiProperty({ example: 'alex.mercer@avantgarde.io' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  @Matches(/^(?!.*@(yopmail|10minutemail|mailinator|tempmail|guerrillamail)\.com).*$/, { message: 'No se permiten correos temporales' })
  customerEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.replace(/[\s\-]/g, ''))
  @Matches(/^(\+58)?(0?414|0?424|0?412|0?416|0?426)\d{7}$/, { message: 'Formato de teléfono venezolano inválido' })
  customerPhone: string;

  @IsOptional()
  @IsEmpty({ message: 'Spam detectado' })
  phone_2?: string;

  @ApiProperty({ example: '742 Evergreen Terrace, Suite 4B' })
  @IsString()
  @IsNotEmpty()
  @MinLength(15, { message: 'La dirección debe tener al menos 15 caracteres para ser válida' })
  @MaxLength(255, { message: 'La dirección es demasiado larga' })
  @Matches(/^(?!.*(http|https):\/\/).*$/, { message: 'La dirección no puede contener enlaces URL' })
  shippingAddress: string;

  @ApiProperty({ example: 'Berlin' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre de la ciudad es demasiado largo' })
  shippingCity: string;

  @ApiPropertyOptional({ example: 'Venezuela' })
  @IsString()
  @IsOptional()
  @Equals('Venezuela', { message: 'Actualmente solo despachamos dentro de Venezuela' })
  shippingCountry?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.WHATSAPP_EXPRESS })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'Deliver after 6pm' })
  @IsString()
  @IsOptional()
  @MaxLength(300, { message: 'Las instrucciones son demasiado largas' })
  @Matches(/^(?!.*(http|https):\/\/).*$/, { message: 'Las instrucciones no pueden contener enlaces URL' })
  notes?: string;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
