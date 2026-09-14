import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, OrderStatus } from '../../common/enums';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @Throttle({ long: { limit: 3, ttl: 86400000 } }) // max 3 checkouts per 24 hours per IP
  @ApiOperation({ summary: 'Create a new order and generate WhatsApp/Payment payload' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get('track')
  @Throttle({ medium: { limit: 10, ttl: 60000 } }) // max 10 tracking lookups per minute
  @ApiOperation({ summary: 'Public order tracking by order number, phone or email' })
  @ApiResponse({ status: 200, description: 'Order tracking info (limited fields — no address)' })
  trackOrder(@Query('query') query: string) {
    return this.ordersService.trackOrder(query);
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order details by order number for confirmation page' })
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for admin management with status filter' })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findAll(
      status,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update order status. When setting SHIPPED, include trackingCode and trackingCourier (MRW|ZOOM|DHL|FEDEX)',
  })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
