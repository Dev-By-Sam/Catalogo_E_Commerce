import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../common/enums';
import { ConfigService } from '@nestjs/config';
import { customAlphabet } from 'nanoid';

// Unambiguous characters — no 0/O or I/l confusion for customers reading order IDs
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `KNT-${year}${month}${day}-${nanoid()}`;
  }

  generateWhatsAppUrl(order: any, whatsappNumber: string): string {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const separator = "-----------------------------------";

    const itemsList = order.items
      .map((item: any, index: number) => {
        return `[${index + 1}] ${item.productTitle}\n` +
          ` |- SKU: \`${item.variantSku}\`\n` +
          ` |- Detalles: ${item.size || 'N/A'} / ${item.color || 'N/A'}\n` +
          ` |- Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = *$${item.total.toFixed(2)}*`;
      })
      .join('\n\n');

    const message = `*NUEVA ORDEN // KINETIC TECH* 🛒\n` +
      `${separator}\n` +
      `*ID de Orden:* \`${order.orderNumber}\`\n` +
      `*Cliente:* ${order.customerName}\n` +
      `*Teléfono:* ${order.customerPhone}\n` +
      `*Dirección:* ${order.shippingAddress}, ${order.shippingCity}\n` +
      `${separator}\n` +
      `*ARTÍCULOS SOLICITADOS:* 📦\n\n` +
      `${itemsList}\n\n` +
      `${separator}\n` +
      `*Subtotal:* $${order.subtotal.toFixed(2)}\n` +
      `*Envío:* $${order.shippingCost.toFixed(2)}\n` +
      `*TOTAL A PAGAR:* *$${order.total.toFixed(2)} USD* 💰\n` +
      `${separator}\n` +
      `_Por favor confírmenme los datos de pago y despacho._ ✅`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  async create(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const itemDto of dto.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: itemDto.variantId },
          include: { product: true },
        });

        if (!variant || variant.product.isDeleted || !variant.product.isActive) {
          throw new BadRequestException(
            `Product variant '${itemDto.variantId}' is no longer available`,
          );
        }

        if (variant.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for '${variant.product.title}' (${variant.sku}). Available: ${variant.stock}, requested: ${itemDto.quantity}`,
          );
        }

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: itemDto.quantity } },
        });

        const itemTotal = variant.price * itemDto.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          productTitle: variant.product.title,
          variantSku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          quantity: itemDto.quantity,
          total: itemTotal,
        });
      }

      const baseShipping = parseFloat(
        this.configService.get<string>('BASE_SHIPPING_COST', '15.00'),
      );
      const freeShippingThreshold = parseFloat(
        this.configService.get<string>('FREE_SHIPPING_THRESHOLD', '150.00'),
      );
      const shippingCost = subtotal >= freeShippingThreshold ? 0 : baseShipping;
      const total = subtotal + shippingCost;

      const orderNumber = this.generateOrderNumber();

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          shippingAddress: dto.shippingAddress,
          shippingCity: dto.shippingCity,
          shippingCountry: dto.shippingCountry || 'Worldwide',
          paymentMethod: dto.paymentMethod,
          paymentStatus:
            dto.paymentMethod === PaymentMethod.STRIPE
              ? PaymentStatus.PAID
              : PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
          subtotal,
          shippingCost,
          total,
          notes: dto.notes,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      const whatsappSetting = await tx.storeSetting.findUnique({
        where: { key: 'STORE_WHATSAPP_NUMBER' },
      });
      const targetPhone =
        whatsappSetting?.value ||
        this.configService.get<string>('STORE_WHATSAPP_NUMBER', '1234567890');
      const whatsappUrl = this.generateWhatsAppUrl(order, targetPhone);

      return {
        ...order,
        whatsappUrl,
      };
    });
  }

  async findAll(status?: OrderStatus, page: number = 1, limit: number = 20) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;
    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order '${orderNumber}' not found`);
    }

    return order;
  }

  /**
   * Public tracking endpoint — returns limited fields only (no exact address)
   * Rate-limited separately in the controller.
   */
  async trackOrder(query: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: query.trim().toUpperCase() } },
          { customerPhone: { contains: query.trim() } },
          { customerEmail: { equals: query.trim().toLowerCase() } },
        ],
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!order) {
      throw new NotFoundException(
        'No se encontró ninguna orden activa con ese número, teléfono o correo.',
      );
    }

    // Return only public-safe fields — never expose exact address
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingCity: order.shippingCity,
      shippingCountry: order.shippingCountry,
      trackingCode: (order as any).trackingCode ?? null,
      trackingCourier: (order as any).trackingCourier ?? null,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        productTitle: item.productTitle,
        variantSku: item.variantSku,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If transitioning to CANCELLED, restore stock
    if (
      dto.status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      for (const item of order.items) {
        if (item.variantId) {
          await this.prisma.productVariant
            .update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            })
            .catch(() => { });
        }
      }
    }

    const updateData: any = {
      status: dto.status,
      paymentStatus:
        dto.status === OrderStatus.PAID || dto.status === OrderStatus.DELIVERED
          ? PaymentStatus.PAID
          : order.paymentStatus,
    };

    // Persist tracking info when admin sets SHIPPED status
    if (dto.status === OrderStatus.SHIPPED) {
      if ((dto as any).trackingCode) updateData.trackingCode = (dto as any).trackingCode;
      if ((dto as any).trackingCourier) updateData.trackingCourier = (dto as any).trackingCourier;
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });
  }
}
