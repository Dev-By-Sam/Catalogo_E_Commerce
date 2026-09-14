import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductsDto } from './dto/product.dto';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private redis: Redis | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    if (host) {
      try {
        this.redis = new Redis({
          host,
          port,
          lazyConnect: true,
          retryStrategy: () => null, // don't crash if redis is unavailable in dev
        });
        this.redis.connect().catch(() => {
          this.redis = null;
        });
      } catch (e) {
        this.redis = null;
      }
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async invalidateCache() {
    if (this.redis) {
      try {
        const keys = await this.redis.keys('catalog:*');
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } catch (err) {
        // ignore cache errors
      }
    }
  }

  async findAll(query: QueryProductsDto, isAdmin: boolean = false) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = query;

    const cacheKey = `catalog:${JSON.stringify(query)}:admin:${isAdmin}`;
    if (this.redis && !isAdmin) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {}
    }

    const where: any = {
      isDeleted: false,
    };

    if (!isAdmin) {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { slug: { contains: search } },
        {
          variants: {
            some: {
              sku: { contains: search },
            },
          },
        },
      ];
    }

    if (category) {
      where.category = {
        OR: [{ slug: category }, { id: category }, { name: { contains: category } }],
      };
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    const variantConditions: any = {};

    if (minPrice !== undefined || maxPrice !== undefined) {
      variantConditions.price = {};
      if (minPrice !== undefined) variantConditions.price.gte = minPrice;
      if (maxPrice !== undefined) variantConditions.price.lte = maxPrice;
    }

    if (size) {
      variantConditions.size = { contains: size };
    }

    if (color) {
      variantConditions.color = { contains: color };
    }

    if (inStock) {
      variantConditions.stock = { gt: 0 };
    }

    if (Object.keys(variantConditions).length > 0) {
      where.variants = {
        some: variantConditions,
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { variants: { _count: 'desc' } }; // will sort dynamically or by created
    } else if (sort === 'price_desc') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'featured') {
      orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    }

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: { orderBy: { price: 'asc' } },
          media: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const result = {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    if (this.redis && !isAdmin) {
      try {
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300); // 5 min cache
      } catch (e) {}
    }

    return result;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, isDeleted: false },
      include: {
        category: true,
        variants: { orderBy: { price: 'asc' } },
        media: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }

    // Related products in same category
    const relatedProducts = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isDeleted: false,
        isActive: true,
      },
      include: {
        category: true,
        variants: true,
        media: { orderBy: { sortOrder: 'asc' } },
      },
      take: 4,
    });

    return {
      ...product,
      relatedProducts,
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        media: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product || product.isDeleted) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug || this.slugify(dto.title);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Product slug '${slug}' already exists`);
    }

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        details: dto.details,
        categoryId: dto.categoryId,
        isFeatured: dto.isFeatured ?? false,
        has3D: dto.has3D ?? false,
        model3dUrl: dto.model3dUrl,
        isActive: dto.isActive ?? true,
        variants: {
          create: dto.variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            minStockAlert: v.minStockAlert ?? 5,
          })),
        },
        media: dto.media
          ? {
              create: dto.media.map((m, idx) => ({
                url: m.url,
                alt: m.alt || dto.title,
                sortOrder: m.sortOrder ?? idx,
                isCover: m.isCover ?? idx === 0,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
        media: true,
        category: true,
      },
    });

    await this.invalidateCache();
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, media: true },
    });

    if (!existing || existing.isDeleted) {
      throw new NotFoundException('Product not found');
    }

    const slug = dto.slug || (dto.title ? this.slugify(dto.title) : existing.slug);
    if (slug !== existing.slug) {
      const collision = await this.prisma.product.findUnique({ where: { slug } });
      if (collision && collision.id !== id) {
        throw new ConflictException(`Slug '${slug}' already in use`);
      }
    }

    // If variants were supplied, handle sync/upsert
    if (dto.variants && dto.variants.length > 0) {
      // Delete removed variants
      const incomingIds = dto.variants.map((v) => v.id).filter(Boolean);
      await this.prisma.productVariant.deleteMany({
        where: {
          productId: id,
          id: { notIn: incomingIds as string[] },
        },
      });

      for (const variant of dto.variants) {
        if (variant.id) {
          await this.prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              stock: variant.stock,
              minStockAlert: variant.minStockAlert ?? 5,
            },
          });
        } else {
          await this.prisma.productVariant.create({
            data: {
              productId: id,
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              stock: variant.stock,
              minStockAlert: variant.minStockAlert ?? 5,
            },
          });
        }
      }
    }

    // Media update
    if (dto.media) {
      await this.prisma.productMedia.deleteMany({ where: { productId: id } });
      await this.prisma.productMedia.createMany({
        data: dto.media.map((m, idx) => ({
          productId: id,
          url: m.url,
          alt: m.alt || existing.title,
          sortOrder: m.sortOrder ?? idx,
          isCover: m.isCover ?? idx === 0,
        })),
      });
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        slug,
        description: dto.description ?? existing.description,
        details: dto.details ?? existing.details,
        categoryId: dto.categoryId ?? existing.categoryId,
        isFeatured: dto.isFeatured ?? existing.isFeatured,
        has3D: dto.has3D ?? existing.has3D,
        model3dUrl: dto.model3dUrl !== undefined ? dto.model3dUrl : existing.model3dUrl,
        isActive: dto.isActive ?? existing.isActive,
      },
      include: {
        variants: true,
        media: true,
        category: true,
      },
    });

    await this.invalidateCache();
    return updated;
  }

  async softDelete(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true, isActive: false },
    });

    await this.invalidateCache();
    return { success: true, message: 'Product deleted successfully' };
  }

  async toggleActive(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    await this.invalidateCache();
    return updated;
  }
}
