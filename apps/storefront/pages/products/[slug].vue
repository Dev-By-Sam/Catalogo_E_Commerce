<template>
  <div class="relative w-full min-h-screen select-none">
    <!-- Breadcrumb & Back Telemetry -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 hairline-b flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase">
      <NuxtLink to="/catalog" class="hover:text-kinetic-cyan flex items-center space-x-1" data-interactive="true">
        <span>← [VOLVER AL CATÁLOGO]</span>
      </NuxtLink>
      <div class="flex items-center space-x-4">
        <span>CATEGORÍA: {{ product.category?.name }}</span>
        <span>SKU: {{ selectedVariant?.sku }}</span>
      </div>
    </div>

    <!-- 50/50 Split-Screen Viewport Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-900 min-h-[calc(100vh-8rem)]">
      <!-- Left Column: Fixed / Sticky 3D Interactive Viewport -->
      <div class="relative lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] bg-industrial-950 flex items-center justify-center overflow-hidden">
        <ProductViewer3D
          :modelUrl="product.model3dUrl"
          :images="product.media"
          :productTitle="product.title"
          :initialMode="product.has3D ? '3d' : 'gallery'"
          :has3D="product.has3D"
        />
      </div>

      <!-- Right Column: Continuous Scroll Technical Narrative -->
      <div class="p-6 sm:p-10 lg:p-12 space-y-8 bg-[#080809]">
        <!-- Product Header & Title -->
        <div class="space-y-3">
          <div class="flex items-center space-x-3 font-mono text-[10px] text-neutral-400">
            <span class="px-2 py-0.5 bg-neutral-900 hairline-all text-kinetic-cyan">
              {{ product.category?.name }}
            </span>
            <span v-if="product.has3D" class="text-white font-bold">
              [3D ORBIT READY]
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight leading-tight">
            {{ product.title }}
          </h1>

          <!-- Price & Live Stock Indicator -->
          <div class="flex items-baseline space-x-4 pt-2 font-mono">
            <span class="text-2xl sm:text-3xl font-bold text-white">
              ${{ selectedVariant?.price?.toFixed(2) }} USD
            </span>
            <span
              v-if="selectedVariant?.compareAtPrice"
              class="text-sm text-neutral-500 line-through"
            >
              ${{ selectedVariant.compareAtPrice.toFixed(2) }}
            </span>
            <span
              class="text-xs px-2 py-0.5"
              :class="selectedVariant?.stock > 0 ? (selectedVariant.stock <= 5 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300') : 'bg-red-500/20 text-red-300'"
            >
              {{ selectedVariant?.stock > 0 ? (selectedVariant.stock <= 5 ? `STOCK BAJO (${selectedVariant.stock})` : 'STOCK DISPONIBLE') : 'AGOTADO' }}
            </span>
          </div>
        </div>

        <!-- Description Narrative -->
        <div class="font-mono text-xs text-neutral-300 leading-relaxed uppercase tracking-wider hairline-t pt-4">
          <p>{{ product.description }}</p>
        </div>

        <!-- Technical Variant Matrix (Sizes & Colors) -->
        <div class="space-y-6 hairline-t pt-6 font-mono text-xs">
          <!-- Size Selector -->
          <div v-if="availableSizes.length > 0" class="space-y-2">
            <div class="flex justify-between text-[10px] text-neutral-400 uppercase tracking-widest">
              <span>SELECCIONAR TALLA / DIMENSIÓN</span>
              <span class="text-white">[{{ selectedSize }}]</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in availableSizes"
                :key="size"
                @click="selectedSize = size"
                class="px-4 py-2 hairline-all font-mono text-xs transition-colors"
                :class="selectedSize === size ? 'bg-white text-black font-bold border-white' : 'bg-black text-neutral-400 hover:text-white hover:border-neutral-600'"
                data-interactive="true"
                :data-tag="`SIZE_${size}`"
              >
                [SZ: {{ size }}]
              </button>
            </div>
          </div>

          <!-- Color Selector -->
          <div v-if="availableColors.length > 0" class="space-y-2">
            <div class="flex justify-between text-[10px] text-neutral-400 uppercase tracking-widest">
              <span>COLOR / ACABADO</span>
              <span class="text-white">[{{ selectedColor }}]</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in availableColors"
                :key="color"
                @click="selectedColor = color"
                class="px-4 py-2 hairline-all font-mono text-xs transition-colors flex items-center space-x-2"
                :class="selectedColor === color ? 'bg-white text-black font-bold border-white' : 'bg-black text-neutral-400 hover:text-white hover:border-neutral-600'"
                data-interactive="true"
                :data-tag="`COLOR_${color}`"
              >
                <span
                  class="w-2.5 h-2.5 rounded-full border border-neutral-600"
                  :style="{ backgroundColor: getColorHex(color) }"
                />
                <span>{{ color }}</span>
              </button>
            </div>
          </div>

          <!-- Quantity Stepper -->
          <div class="space-y-2 pt-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest block">
              CANTIDAD
            </label>
            <div class="inline-flex items-center hairline-all bg-black">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                -
              </button>
              <span class="px-4 py-2 font-bold text-white text-sm">
                {{ quantity }}
              </span>
              <button
                @click="quantity = Math.min(selectedVariant?.stock || 1, quantity + 1)"
                class="px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Purchase Action Buttons (Dual CTA) -->
        <div class="space-y-3 pt-6 hairline-t">
          <!-- Primary: Add to Cart -->
          <DecoderButton
            text="AÑADIR AL CARRITO"
            variant="primary"
            size="lg"
            class="w-full"
            :disabled="!selectedVariant || selectedVariant.stock <= 0"
            @click="addToCart"
            tag="ADD_TO_CART"
          />

          <!-- WhatsApp Express Instant Checkout -->
          <a
            :href="whatsappDirectUrl"
            target="_blank"
            class="w-full py-4 bg-[#25D366] text-black font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-[#1ebd5a] transition-colors"
            data-interactive="true"
            data-tag="WHATSAPP_BUY_NOW"
          >
            <span>⚡ COMPRAR DIRECTO POR WHATSAPP</span>
          </a>
        </div>

        <!-- Accordions: Technical Specifications, Materials & Delivery -->
        <div class="space-y-3 pt-8 hairline-t font-mono text-xs divide-y divide-neutral-900">
          <!-- Specs Accordion -->
          <div class="pt-3">
            <button
              @click="toggleSection('specs')"
              class="w-full flex justify-between items-center text-left text-neutral-300 hover:text-white py-2"
            >
              <span class="uppercase tracking-widest text-[11px] font-bold">[+] ESPECIFICACIONES TÉCNICAS</span>
              <span>{{ openSections.specs ? '−' : '+' }}</span>
            </button>
            <div v-show="openSections.specs" class="py-3 text-neutral-400 text-[11px] space-y-1 bg-industrial-950 p-3 hairline-all">
              <div v-for="(val, key) in parsedDetails" :key="key" class="flex justify-between">
                <span class="text-neutral-500 uppercase">{{ key }}:</span>
                <span class="text-white">{{ val }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Accordion -->
          <div class="pt-3">
            <button
              @click="toggleSection('shipping')"
              class="w-full flex justify-between items-center text-left text-neutral-300 hover:text-white py-2"
            >
              <span class="uppercase tracking-widest text-[11px] font-bold">[+] LOGÍSTICA & DESPACHO GLOBAL</span>
              <span>{{ openSections.shipping ? '−' : '+' }}</span>
            </button>
            <div v-show="openSections.shipping" class="py-3 text-neutral-400 text-[11px] space-y-2 bg-industrial-950 p-3 hairline-all">
              <p>• Despacho prioritario en 24-48 horas hábiles vía DHL Express / FedEx.</p>
              <p>• Envío asegurado contra pérdidas o daños en tránsito.</p>
              <p>• Embalaje de alta densidad con sellado hermético antiestático.</p>
            </div>
          </div>
        </div>

        <!-- Related Products Preview -->
        <div v-if="product.relatedProducts && product.relatedProducts.length > 0" class="pt-10 hairline-t">
          <div class="font-mono text-[10px] text-kinetic-cyan uppercase tracking-widest mb-4">
            OBJETOS RELACIONADOS
          </div>
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink
              v-for="rel in product.relatedProducts"
              :key="rel.id"
              :to="`/products/${rel.slug}`"
              class="bg-industrial-950 hairline-all p-3 group"
              data-interactive="true"
            >
              <img
                :src="rel.media?.[0]?.url"
                :alt="rel.title"
                class="w-full aspect-square object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
              />
              <div class="font-display text-xs font-bold text-white mt-2 truncate group-hover:text-kinetic-cyan">
                {{ rel.title }}
              </div>
              <div class="font-mono text-[10px] text-neutral-400 mt-0.5">
                ${{ rel.variants?.[0]?.price?.toFixed(2) }}
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';
import { useCartStore } from '~/stores/cart';
import ProductViewer3D from '~/components/3d/ProductViewer3D.vue';
import DecoderButton from '~/components/ui/DecoderButton.vue';

const route = useRoute();
const slug = route.params.slug as string;
const cartStore = useCartStore();
const { fetchApi } = useApi();
const config = useRuntimeConfig();

// Fallback seed product in case API is running detached
const defaultProduct = {
  id: '1',
  title: 'CHRONO-01 — Monolith Titanium Instrument',
  slug: 'chrono-01-monolith-titanium-instrument',
  description: 'Sculpted from a single block of Grade 5 titanium, the Chrono-01 features an automatic skeleton movement with 64 hours of power reserve. Designed with hairline brushed finishes and sapphire crystal front and back.',
  details: JSON.stringify({
    casing: 'Grade 5 Titanium, 41mm diameter',
    movement: 'Calibre K-88 Automatic, 28,800 vph',
    crystal: 'Dual anti-reflective domed sapphire',
    waterResistance: '100m / 10 ATM',
  }),
  category: { name: 'Precision Horology', slug: 'precision-horology' },
  has3D: true,
  model3dUrl: '/models/chrono_watch.glb',
  variants: [
    {
      id: 'v1',
      sku: 'CHRN-01-SLV',
      size: '41mm',
      color: 'Raw Titanium',
      colorHex: '#8C929D',
      price: 1850.00,
      compareAtPrice: 2200.00,
      stock: 8,
    },
    {
      id: 'v2',
      sku: 'CHRN-01-DLC',
      size: '41mm',
      color: 'Stealth DLC Black',
      colorHex: '#121212',
      price: 2050.00,
      compareAtPrice: 2400.00,
      stock: 4,
    },
  ],
  media: [
    { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80', alt: 'Chrono-01 View 1' },
    { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80', alt: 'Chrono-01 View 2' },
  ],
  relatedProducts: [],
};

const product = ref<any>(defaultProduct);

try {
  const res = await fetchApi<any>(`/products/slug/${slug}`);
  if (res) {
    product.value = res;
  }
} catch (e) {}

const selectedSize = ref<string>('');
const selectedColor = ref<string>('');
const quantity = ref(1);

const openSections = reactive({
  specs: true,
  shipping: false,
});

const toggleSection = (section: 'specs' | 'shipping') => {
  openSections[section] = !openSections[section];
};

const availableSizes = computed(() => {
  const sizes = product.value.variants
    ?.map((v: any) => v.size)
    .filter((s: string | null) => !!s);
  return Array.from(new Set(sizes));
});

const availableColors = computed(() => {
  const colors = product.value.variants
    ?.map((v: any) => v.color)
    .filter((c: string | null) => !!c);
  return Array.from(new Set(colors));
});

// Set default selections
if (availableSizes.value.length > 0) {
  selectedSize.value = availableSizes.value[0];
}
if (availableColors.value.length > 0) {
  selectedColor.value = availableColors.value[0];
}

const selectedVariant = computed(() => {
  if (!product.value.variants || product.value.variants.length === 0) return null;

  const match = product.value.variants.find((v: any) => {
    const matchSize = selectedSize.value ? v.size === selectedSize.value : true;
    const matchColor = selectedColor.value ? v.color === selectedColor.value : true;
    return matchSize && matchColor;
  });

  return match || product.value.variants[0];
});

const getColorHex = (colorName: string) => {
  const variant = product.value.variants?.find((v: any) => v.color === colorName);
  return variant?.colorHex || '#52525b';
};

const parsedDetails = computed(() => {
  try {
    return JSON.parse(product.value.details || '{}');
  } catch (e) {
    return {};
  }
});

const addToCart = () => {
  if (!selectedVariant.value || selectedVariant.value.stock <= 0) return;

  cartStore.addItem({
    productId: product.value.id,
    variantId: selectedVariant.value.id,
    title: product.value.title,
    slug: product.value.slug,
    sku: selectedVariant.value.sku,
    size: selectedVariant.value.size,
    color: selectedVariant.value.color,
    price: selectedVariant.value.price,
    quantity: quantity.value,
    image: product.value.media?.[0]?.url || '',
    stock: selectedVariant.value.stock,
  });
};

const whatsappDirectUrl = computed(() => {
  const phone = (config.public.whatsappNumber || '1234567890').replace(/[^0-9]/g, '');
  const variant = selectedVariant.value;
  const total = ((variant?.price || 0) * quantity.value).toFixed(2);

  const message = `⚡ *SOLICITUD DE COMPRA - KINETIC*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `▪ *Artículo:* ${product.value.title}\n` +
    `• *SKU:* \`${variant?.sku || 'N/A'}\`\n` +
    `• *Talla / Acabado:* ${variant?.size || 'N/A'} / ${variant?.color || 'N/A'}\n` +
    `• *Cantidad:* ${quantity.value}\n` +
    `• *Total:* *$${total} USD*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `ℹ️ *Por favor coordinar medios de pago y dirección de despacho.*`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});
</script>
