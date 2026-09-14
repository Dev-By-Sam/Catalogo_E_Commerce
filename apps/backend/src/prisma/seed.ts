import { PrismaClient } from '@prisma/client';
// @ts-ignore
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// Helper to generate Nanoid for order tracking (same logic as service)
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const idStr = nanoid(6).toUpperCase();
  return `KNT-${dateStr}-${idStr}`;
};

async function main() {
  console.log('⚡ Starting KINETIC TECH E-Commerce database seeding...');

  // 1. Clean Database (Delete everything in reverse relation order)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 2. Create Default Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@kinetic.io',
      passwordHash: adminPassword,
      name: 'Kinetic Administrator',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created: admin@kinetic.io (Password: admin123)');

  // 3. Create Tech Categories
  const categoriesData = [
    { name: 'Smartphones', slug: 'smartphones', description: 'Flagship desbloqueados.' },
    { name: 'Laptops', slug: 'laptops', description: 'Portátiles ultralivianas y potentes.' },
    { name: 'Wearables', slug: 'wearables', description: 'Smartwatches y medidores biométricos.' },
    { name: 'Audio & IEM', slug: 'audio-iem', description: 'In-Ear Monitors y audio de referencia.' },
    { name: 'Peripherals', slug: 'peripherals', description: 'Teclados mecánicos y ratones.' },
    { name: 'Charging & Power', slug: 'charging-power', description: 'Carga GaN y Powerbanks.' },
    { name: 'Tech EDC', slug: 'tech-edc', description: 'Organizadores tácticos de Cordura.' },
    { name: 'Gaming', slug: 'gaming', description: 'Hardware de alto rendimiento para gaming.' },
    { name: 'Photography', slug: 'photography', description: 'Cámaras y lentes profesionales.' },
    { name: 'Office', slug: 'office', description: 'Equipos y suministros de oficina.' }
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categories[cat.slug] = createdCat.id;
  }
  console.log('✅ Tech categories created');

  // 4. Create Tech Products (Old Procedural + New Real 3D)
  const products = [
    // --- REAL 3D MODELS ---
    {
      title: 'Apple MacBook Pro M3 Max',
      slug: 'apple-macbook-pro-m3-max',
      description: 'El portátil más avanzado para creadores. Procesador M3 Max, 128GB RAM y pantalla Liquid Retina XDR de 16 pulgadas.',
      categoryId: categories['laptops'],
      isFeatured: true,
      has3D: true,
      model3dUrl: '/models/apple_macbook_pro/scene.gltf',
      variants: [
        { sku: 'MAC-PRO-M3-MAX-128', color: 'Space Black', colorHex: '#222222', price: 4299.00, stock: 5 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'Asus ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      description: 'Portátil gaming ultradelgada con pantalla AnimeMatrix. RTX 4080 y Ryzen 9.',
      categoryId: categories['laptops'],
      isFeatured: false,
      has3D: true,
      model3dUrl: '/models/asus_laptop/scene.gltf',
      variants: [
        { sku: 'ROG-G14-RTX4080', color: 'Eclipse Gray', colorHex: '#333333', price: 2199.00, stock: 12 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'Custom Gaming PC - Liquid Cooled',
      slug: 'custom-gaming-pc-liquid-cooled',
      description: 'Estación de batalla armada con Intel Core i9-14900K, RTX 4090 y refrigeración líquida de circuito abierto.',
      categoryId: categories['gaming'],
      isFeatured: true,
      has3D: true,
      model3dUrl: '/models/gaming_pc/scene.gltf',
      variants: [
        { sku: 'PC-BUILD-EXTREME', color: 'RGB Black', colorHex: '#0a0a0a', price: 5500.00, stock: 2 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'Sony Studio Headphones WH-1000XM5',
      slug: 'sony-studio-headphones',
      description: 'Cancelación de ruido líder en la industria, audio Hi-Res y comodidad extrema para largas sesiones.',
      categoryId: categories['audio-iem'],
      isFeatured: false,
      has3D: true,
      model3dUrl: '/models/headphones/scene.gltf',
      variants: [
        { sku: 'SONY-WH-XM5-BLK', color: 'Black', colorHex: '#111111', price: 348.00, stock: 20 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'Impresora 3D Industrial CoreXY',
      slug: 'impresora-3d-industrial',
      description: 'Impresión rápida a 600mm/s, cama caliente y extrusor directo. Perfecta para ABS y Nylon.',
      categoryId: categories['office'],
      isFeatured: false,
      has3D: true,
      model3dUrl: '/models/impresora/scene.gltf',
      variants: [
        { sku: 'PRINTER-3D-PRO', color: 'Industrial Gray', colorHex: '#888888', price: 899.00, stock: 8 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1615986200762-a1ed9610d3b1?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'iPhone 16 Pro Titanium',
      slug: 'iphone-16-pro-titanium',
      description: 'El nuevo iPhone 16 Pro con bordes de titanio grado aeroespacial, chip A18 Pro y botón de captura dedicado.',
      categoryId: categories['smartphones'],
      isFeatured: true,
      has3D: true,
      model3dUrl: '/models/iphone_16/scene.gltf',
      variants: [
        { sku: 'IP16-PRO-NAT-256', color: 'Natural Titanium', colorHex: '#B2AEA7', price: 1099.00, stock: 30 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'Teclado Mecánico Inalámbrico RGB',
      slug: 'teclado-mecanico-rgb',
      description: 'Switches táctiles hot-swap, keycaps PBT de doble inyección y batería de 4000mAh.',
      categoryId: categories['peripherals'],
      isFeatured: false,
      has3D: true,
      model3dUrl: '/models/keyboard/scene.gltf',
      variants: [
        { sku: 'KBD-WL-RGB-84', color: 'White', colorHex: '#ffffff', price: 129.00, stock: 25 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'Sony Alpha 3 Mirrorless Camera',
      slug: 'sony-alpha-3',
      description: 'Cámara full-frame sin espejo con autoenfoque ocular en tiempo real y video 4K HDR.',
      categoryId: categories['photography'],
      isFeatured: true,
      has3D: true,
      model3dUrl: '/models/sony_alpha_3/scene.gltf',
      variants: [
        { sku: 'SONY-A7III-BODY', color: 'Black', colorHex: '#111111', price: 1998.00, stock: 6 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },

    // --- OLD PROCEDURAL PRODUCTS (has3D = false) ---
    {
      title: 'PIXEL-X PRO — Unlocked Android Flagship (256GB)',
      slug: 'pixel-x-pro-unlocked-android-flagship-256gb',
      description: 'El pináculo de la fotografía computacional. Cuerpo de titanio aeroespacial.',
      categoryId: categories['smartphones'],
      isFeatured: false,
      has3D: false,
      model3dUrl: 'primitive:smartphone',
      variants: [
        { sku: 'PIXEL-X-OBSIDIAN-256', color: 'Obsidian', colorHex: '#18181b', price: 999.00, stock: 15 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'CHRONO-SMART ULTRA — Titanio & Zafiro',
      slug: 'chrono-smart-ultra-titanio-zafiro',
      description: 'El reloj inteligente definitivo. GPS de doble banda.',
      categoryId: categories['wearables'],
      isFeatured: false,
      has3D: false,
      model3dUrl: 'primitive:smartwatch',
      variants: [
        { sku: 'CS-ULTRA-ORANGE', color: 'Alpine Orange', price: 799.00, stock: 20 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'GAN-140 — 140W USB-C GaN Quad Charger',
      slug: 'gan-140-140w-usbc-gan-quad-charger',
      description: 'Tecnología de Nitruro de Galio (GaN). Cuatro puertos USB-C PD 3.1 capaces de entregar 140W simultáneos.',
      categoryId: categories['charging-power'],
      isFeatured: false,
      has3D: false,
      model3dUrl: 'primitive:charger',
      variants: [
        { sku: 'GAN-140W-BLK', color: 'Matte Black', price: 89.00, stock: 50 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    },
    {
      title: 'GRID-00 — Modular Tech EDC Organizer',
      slug: 'grid-00-modular-tech-edc-organizer',
      description: 'Pouch organizador hecho de Cordura balística 1050D impermeable.',
      categoryId: categories['tech-edc'],
      isFeatured: false,
      has3D: false,
      model3dUrl: 'primitive:pouch',
      variants: [
        { sku: 'GRID-POUCH-BLK', color: 'Black Multicam', price: 69.00, stock: 60 },
      ],
      media: [{ url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80', isCover: true }]
    }
  ];

  for (const productData of products) {
    const { variants, media, ...productCore } = productData;
    
    await prisma.product.create({
      data: {
        ...productCore,
        variants: {
          create: variants,
        },
        media: {
          create: media,
        },
      },
    });
  }
  console.log('✅ Tech products seeded (Real 3D models + old ones without 3D tag)');

  // 5. Create Sample Orders
  const sampleProducts = await prisma.productVariant.findMany({ include: { product: true }, take: 3 });
  
  if (sampleProducts.length >= 3) {
    await prisma.order.create({
      data: {
        orderNumber: 'KNT-20260822-ABX7K3',
        customerName: 'Alex Mercer',
        customerEmail: 'alex@avantgarde.io',
        customerPhone: '+1 555 0192',
        shippingAddress: '404 Cyberspace Ave, Sector 7',
        shippingCity: 'Neo Caracas',
        shippingCountry: 'Venezuela',
        paymentStatus: 'PAID',
        status: 'SHIPPED', // Step 4
        notes: 'Guía de Rastreo MRW Simulada',
        subtotal: sampleProducts[0].price,
        shippingCost: 15.00,
        total: sampleProducts[0].price + 15.00,
        items: {
          create: [{
            productId: sampleProducts[0].productId,
            variantId: sampleProducts[0].id,
            productTitle: sampleProducts[0].product.title,
            variantSku: sampleProducts[0].sku,
            price: sampleProducts[0].price,
            quantity: 1,
            total: sampleProducts[0].price
          }]
        }
      }
    });
    
    try {
      await prisma.$executeRawUnsafe(`UPDATE "orders" SET "trackingCode" = 'MRW-88992211', "trackingCourier" = 'MRW' WHERE "orderNumber" = 'KNT-20260822-ABX7K3'`);
    } catch (e) { console.log('Notice: trackingCode column not present in orders table'); }

    await prisma.order.create({
      data: {
        orderNumber: 'KNT-20260823-QR4MPN',
        customerName: 'Sarah Connor',
        customerEmail: 'sarah@skynet.com',
        customerPhone: '+58 412 111 2233',
        shippingAddress: 'Bunker 42, Nivel -3',
        shippingCity: 'Valencia',
        shippingCountry: 'Venezuela',
        paymentStatus: 'PAID',
        status: 'DELIVERED', // Step 5
        subtotal: sampleProducts[1].price * 2,
        total: (sampleProducts[1].price * 2),
        items: {
          create: [{
            productId: sampleProducts[1].productId,
            variantId: sampleProducts[1].id,
            productTitle: sampleProducts[1].product.title,
            variantSku: sampleProducts[1].sku,
            price: sampleProducts[1].price,
            quantity: 2,
            total: sampleProducts[1].price * 2
          }]
        }
      }
    });
    try {
      await prisma.$executeRawUnsafe(`UPDATE "orders" SET "trackingCode" = 'ZM-9988776655', "trackingCourier" = 'ZOOM' WHERE "orderNumber" = 'KNT-20260823-QR4MPN'`);
    } catch (e) {}

    await prisma.order.create({
      data: {
        orderNumber: 'KNT-20260830-DEMO01',
        customerName: 'Neo Anderson',
        customerEmail: 'neo@matrix.org',
        customerPhone: '0414-999-8877',
        shippingAddress: 'Piso 12, Apto 12A',
        shippingCity: 'Maracaibo',
        shippingCountry: 'Venezuela',
        paymentStatus: 'PENDING',
        status: 'PENDING', // Step 1
        subtotal: sampleProducts[2].price,
        total: sampleProducts[2].price,
        items: {
          create: [{
            productId: sampleProducts[2].productId,
            variantId: sampleProducts[2].id,
            productTitle: sampleProducts[2].product.title,
            variantSku: sampleProducts[2].sku,
            price: sampleProducts[2].price,
            quantity: 1,
            total: sampleProducts[2].price
          }]
        }
      }
    });
  }
  console.log('✅ Sample orders seeded');

  // 6. Configuración de Tienda
  const settings = [
    { key: 'STORE_NAME', value: 'KINETIC E-Commerce' },
    { key: 'STORE_URL', value: 'https://kinetic.com' },
    { key: 'SUPPORT_EMAIL', value: 'support@kinetic.io' },
    { key: 'WHATSAPP_NUMBER', value: '584120000000' },
  ];

  for (const s of settings) {
    await prisma.storeSetting.create({
      data: { key: s.key, value: s.value },
    });
  }
  console.log('✅ Settings and store configuration seeded.');

  console.log('🏁 Database seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
