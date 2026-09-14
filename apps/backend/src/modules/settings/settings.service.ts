import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Seed default settings if empty
    const defaults = [
      { key: 'STORE_NAME', value: this.configService.get('STORE_NAME', 'KINETIC // INDUSTRIAL') },
      { key: 'STORE_TAGLINE', value: this.configService.get('STORE_TAGLINE', 'Avant-Garde Architectural Goods') },
      { key: 'STORE_CURRENCY', value: this.configService.get('STORE_CURRENCY', 'USD') },
      { key: 'STORE_CURRENCY_SYMBOL', value: this.configService.get('STORE_CURRENCY_SYMBOL', '$') },
      { key: 'STORE_WHATSAPP_NUMBER', value: this.configService.get('STORE_WHATSAPP_NUMBER', '1234567890') },
      { key: 'BASE_SHIPPING_COST', value: this.configService.get('BASE_SHIPPING_COST', '15.00') },
      { key: 'FREE_SHIPPING_THRESHOLD', value: this.configService.get('FREE_SHIPPING_THRESHOLD', '150.00') },
      { key: 'STRIPE_PUBLIC_KEY', value: this.configService.get('STRIPE_PUBLIC_KEY', 'pk_test_51MockIndustrialKey') },
      { key: 'FEATURE_3D_ENABLED', value: 'true' },
    ];

    for (const item of defaults) {
      const exists = await this.prisma.storeSetting.findUnique({ where: { key: item.key } });
      if (!exists) {
        await this.prisma.storeSetting.create({
          data: { key: item.key, value: item.value },
        });
      }
    }
  }

  async getPublicSettings() {
    const settings = await this.prisma.storeSetting.findMany({
      where: {
        key: {
          notIn: ['STRIPE_SECRET_KEY', 'JWT_SECRET', 'DATABASE_URL'],
        },
      },
    });

    const configMap: Record<string, string> = {};
    settings.forEach((s) => {
      configMap[s.key] = s.value;
    });

    return configMap;
  }

  async getAllSettings() {
    return this.prisma.storeSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateSettings(settings: Record<string, string>) {
    const operations = Object.entries(settings).map(([key, value]) =>
      this.prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      }),
    );

    await this.prisma.$transaction(operations);
    return this.getPublicSettings();
  }
}
