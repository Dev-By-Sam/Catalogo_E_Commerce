import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getExecutiveTelemetry() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total counts & revenue
    const allOrders = await this.prisma.order.findMany({
      select: {
        id: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    const monthOrders = allOrders.filter((o) => o.createdAt >= startOfMonth);

    const totalRevenue = allOrders
      .filter((o) => o.paymentStatus === 'PAID' || o.status !== 'CANCELLED')
      .reduce((acc, curr) => acc + curr.total, 0);

    const monthRevenue = monthOrders
      .filter((o) => o.paymentStatus === 'PAID' || o.status !== 'CANCELLED')
      .reduce((acc, curr) => acc + curr.total, 0);

    const totalOrdersCount = allOrders.length;
    const paidOrders = allOrders.filter((o) => o.paymentStatus === 'PAID' || o.status === 'PAID' || o.status === 'DELIVERED');
    const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // Conversion rate simulation / estimated metric
    const conversionRate = totalOrdersCount > 0 ? (paidOrders.length / totalOrdersCount) * 100 : 0;

    // Sales Curve (Last 7 Days)
    const last7Days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayOrders = allOrders.filter((o) => {
        const orderDateStr = o.createdAt.toISOString().split('T')[0];
        return orderDateStr === dateStr && o.status !== 'CANCELLED';
      });

      const dayRevenue = dayOrders.reduce((acc, curr) => acc + curr.total, 0);

      last7Days.push({
        date: dateStr,
        revenue: Math.round(dayRevenue * 100) / 100,
        orders: dayOrders.length,
      });
    }

    // Category distribution for ECharts Donut
    const categoriesWithCount = await this.prisma.category.findMany({
      include: {
        products: {
          where: { isDeleted: false },
          include: {
            orderItems: true,
          },
        },
      },
    });

    const categoryDistribution = categoriesWithCount.map((cat) => {
      const totalSold = cat.products.reduce(
        (acc, p) => acc + p.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        0,
      );
      return {
        name: cat.name,
        value: totalSold > 0 ? totalSold : cat.products.length,
        productCount: cat.products.length,
      };
    });

    // Low Stock Alert Radar
    const lowStockVariants = await this.prisma.productVariant.findMany({
      where: {
        stock: { lte: 5 },
        product: { isDeleted: false },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            media: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
      },
      orderBy: { stock: 'asc' },
      take: 10,
    });

    // Recent orders feed
    const recentOrders = await this.prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { take: 2 },
      },
    });

    return {
      kpis: {
        monthRevenue: Math.round(monthRevenue * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: totalOrdersCount,
        averageTicket: Math.round(averageTicket * 100) / 100,
        conversionRate: Math.round(conversionRate * 10) / 10,
        lowStockCount: lowStockVariants.length,
      },
      salesCurve: last7Days,
      categoryDistribution,
      lowStockRadar: lowStockVariants.map((v) => ({
        id: v.id,
        productId: v.productId,
        productTitle: v.product.title,
        productSlug: v.product.slug,
        image: v.product.media[0]?.url || '',
        sku: v.sku,
        size: v.size,
        color: v.color,
        stock: v.stock,
        minStockAlert: v.minStockAlert,
        status: v.stock === 0 ? 'CRITICAL_OUT_OF_STOCK' : v.stock <= 2 ? 'WARNING_VERY_LOW' : 'ALERT_LOW',
      })),
      recentOrders,
    };
  }
}
