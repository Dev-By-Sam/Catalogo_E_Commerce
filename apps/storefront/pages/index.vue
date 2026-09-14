<template>
  <div class="relative w-full overflow-hidden select-none">
    <!-- 1. Fullscreen Kinetic Hero Section -->
    <section class="relative min-h-[92vh] flex flex-col justify-between p-6 sm:p-10 lg:p-14 hairline-b overflow-hidden">
      <!-- 3D Three.js Ambient Canvas Background -->
      <div class="absolute inset-0 z-0">
        <ClientOnly>
          <HeroScene />
        </ClientOnly>
      </div>

      <!-- Top Hero Telemetry Meta Bar -->
      <div class="relative z-10 flex flex-wrap items-center justify-between font-mono text-[10px] sm:text-xs text-neutral-400 tracking-widest uppercase">
        <div class="flex items-center space-x-3">
          <span class="inline-block w-2 h-2 bg-kinetic-cyan animate-ping" />
          <span class="text-white font-bold">TECH DROP 2026_Q4</span>
        </div>
        <div class="hidden md:flex items-center space-x-6 text-neutral-500">
          <span>LAT: 10.4806° N • LON: 66.9036° W</span>
          <span>DISPATCH: MRW / ZOOM / DHL</span>
        </div>
      </div>

      <!-- Center: Fluid Kinetic Typography -->
      <div class="relative z-10 my-auto py-8">
        <h1 class="font-display font-extrabold text-white uppercase fluid-hero-text mix-blend-difference tracking-tighter">
          KINETIC<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-700">
            TECHNOLOGY
          </span>
        </h1>
        <p class="mt-4 max-w-xl font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed uppercase tracking-wider">
          DISPOSITIVOS FLAGSHIP DESBLOQUEADOS, AUDIO IN-EAR REFERENCE, SISTEMAS DE CARGA GAN Y HARDWARE EDC DE PRECISIÓN.
        </p>
      </div>

      <!-- Bottom: Action Controls & Status -->
      <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 hairline-t">
        <div class="flex flex-wrap items-center gap-3">
          <DecoderButton
            text="EXPLORAR CATÁLOGO"
            to="/catalog"
            variant="primary"
            size="lg"
            tag="HERO_CATALOG_BTN"
          />
          <DecoderButton
            text="VENTAS WHATSAPP"
            :to="`https://wa.me/${cleanPhone}`"
            variant="outline"
            size="lg"
            tag="HERO_WHATSAPP_BTN"
          />
        </div>

        <div class="font-mono text-[10px] text-neutral-500 tracking-widest flex items-center space-x-4">
          <span v-if="pending">[SSR RENDER: PENDING]</span>
          <span v-else>[SSR RENDER: {{ featuredProducts.length > 0 ? 'SUCCESS' : 'FALLBACK' }}]</span>
          <span>[3D WEBGL: READY]</span>
        </div>
      </div>
    </section>

    <!-- 2. Bento Grid of Collections -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="flex flex-col sm:flex-row items-start sm:items-baseline justify-between mb-8 hairline-b pb-4">
        <div>
          <span class="font-mono text-[10px] text-kinetic-cyan tracking-widest uppercase">
            TAXONOMÍA DE HARDWARE
          </span>
          <h2 class="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
            CATEGORÍAS DESTACADAS
          </h2>
        </div>
        <NuxtLink
          to="/catalog"
          class="font-mono text-xs text-neutral-400 hover:text-kinetic-cyan transition-colors mt-2 sm:mt-0"
          data-interactive="true"
        >
          [VER TODO EL INVENTARIO →]
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Bento 1: Smartphones -->
        <NuxtLink
          to="/catalog?category=smartphones"
          class="md:col-span-8 relative min-h-[380px] bg-industrial-950 hairline-all overflow-hidden group p-8 flex flex-col justify-between"
          data-interactive="true"
          data-tag="BENTO_SMARTPHONES"
        >
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
            alt="Flagship Smartphones"
            class="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
          />
          <div class="relative z-10 flex justify-between items-start">
            <span class="font-mono text-[10px] bg-black/80 px-2 py-1 hairline-all text-kinetic-cyan">
              [01] GLOBAL UNLOCKED
            </span>
            <span class="font-mono text-xs text-neutral-400">LTE VENEZUELA</span>
          </div>
          <div class="relative z-10">
            <h3 class="text-3xl font-display font-black text-white uppercase group-hover:text-kinetic-cyan transition-colors">
              FLAGSHIP SMARTPHONES
            </h3>
            <p class="font-mono text-xs text-neutral-300 mt-2 max-w-md">
              Dispositivos tope de gama desbloqueados de fábrica, procesadores Snapdragon y pantallas AMOLED 120Hz.
            </p>
          </div>
        </NuxtLink>

        <!-- Bento 2: Audio & IEM -->
        <NuxtLink
          to="/catalog?category=audio-iem"
          class="md:col-span-4 relative min-h-[380px] bg-industrial-950 hairline-all overflow-hidden group p-8 flex flex-col justify-between"
          data-interactive="true"
          data-tag="BENTO_AUDIO"
        >
          <img
            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
            alt="Audio IEM"
            class="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
          />
          <div class="relative z-10 flex justify-between items-start">
            <span class="font-mono text-[10px] bg-black/80 px-2 py-1 hairline-all text-neutral-300">
              [02] HIGH FIDELITY
            </span>
          </div>
          <div class="relative z-10">
            <h3 class="text-2xl font-display font-black text-white uppercase group-hover:text-kinetic-cyan transition-colors">
              AUDIO & IEMs
            </h3>
            <p class="font-mono text-xs text-neutral-400 mt-2">
              In-ear monitors híbridos y auriculares de referencia para audiófilos.
            </p>
          </div>
        </NuxtLink>

        <!-- Bento 3: Charging & Power -->
        <NuxtLink
          to="/catalog?category=charging-power"
          class="md:col-span-6 relative min-h-[320px] bg-industrial-950 hairline-all overflow-hidden group p-8 flex flex-col justify-between"
          data-interactive="true"
          data-tag="BENTO_CHARGING"
        >
          <img
            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
            alt="GaN Chargers"
            class="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
          />
          <div class="relative z-10 flex justify-between items-start">
            <span class="font-mono text-[10px] bg-black/80 px-2 py-1 hairline-all text-neutral-300">
              [03] POWER DELIVERY 3.1
            </span>
          </div>
          <div class="relative z-10">
            <h3 class="text-2xl font-display font-black text-white uppercase group-hover:text-kinetic-cyan transition-colors">
              CARGA GaN & ENERGÍA
            </h3>
            <p class="font-mono text-xs text-neutral-400 mt-2">
              Cargadores multipuerto de nitruro de galio (GaN) ultracompactos de hasta 140W.
            </p>
          </div>
        </NuxtLink>

        <!-- Bento 4: Tech EDC -->
        <NuxtLink
          to="/catalog?category=tech-edc"
          class="md:col-span-6 relative min-h-[320px] bg-industrial-950 hairline-all overflow-hidden group p-8 flex flex-col justify-between"
          data-interactive="true"
          data-tag="BENTO_EDC"
        >
          <img
            src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1000&q=80"
            alt="Tech EDC"
            class="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
          />
          <div class="relative z-10 flex justify-between items-start">
            <span class="font-mono text-[10px] bg-black/80 px-2 py-1 hairline-all text-neutral-300">
              [04] TACTICAL CARRY
            </span>
          </div>
          <div class="relative z-10">
            <h3 class="text-2xl font-display font-black text-white uppercase group-hover:text-kinetic-cyan transition-colors">
              TECH EDC POUCHES
            </h3>
            <p class="font-mono text-xs text-neutral-400 mt-2">
              Organizadores modulares de Cordura balística para tu equipo diario y accesorios.
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- 3. Kinetic Ribbon Product Showcase -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-baseline justify-between mb-8 hairline-b pb-4">
        <div>
          <span class="font-mono text-[10px] text-kinetic-cyan tracking-widest uppercase">
            INVENTARIO PREMIUM EN STOCK
          </span>
          <h2 class="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
            EQUIPOS DESTACADOS
          </h2>
        </div>
      </div>

      <!-- Use fetched products, ribbon handles rendering -->
      <KineticRibbon :products="featuredProducts" />
    </section>

    <!-- 4. Industrial Trust Architecture -->
    <section class="hairline-t bg-industrial-950 py-16 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900">
          <div class="pt-6 sm:pt-0 sm:px-6 first:px-0 space-y-2">
            <div class="font-mono text-[10px] text-kinetic-cyan uppercase font-bold">[01] GARANTÍA DIRECTA</div>
            <h4 class="font-display font-bold text-white text-base">Equipos Sellados</h4>
            <p class="font-mono text-xs text-neutral-500 leading-relaxed">
              Todos nuestros equipos son originales, sellados de fábrica y cuentan con garantía contra defectos.
            </p>
          </div>

          <div class="pt-6 sm:pt-0 sm:px-6 space-y-2">
            <div class="font-mono text-[10px] text-kinetic-cyan uppercase font-bold">[02] TASA BCV OFICIAL</div>
            <h4 class="font-display font-bold text-white text-base">Pagos Transparentes</h4>
            <p class="font-mono text-xs text-neutral-500 leading-relaxed">
              Sistema de conversión a Bolívares usando la tasa oficial del BCV en tiempo real.
            </p>
          </div>

          <div class="pt-6 sm:pt-0 sm:px-6 space-y-2">
            <div class="font-mono text-[10px] text-kinetic-cyan uppercase font-bold">[03] CHECKOUT WHATSAPP</div>
            <h4 class="font-display font-bold text-white text-base">Atención Uno a Uno</h4>
            <p class="font-mono text-xs text-neutral-500 leading-relaxed">
              Cierre de pedidos ágil mediante enlace codificado directo a nuestra línea de ventas.
            </p>
          </div>

          <div class="pt-6 sm:pt-0 sm:px-6 space-y-2">
            <div class="font-mono text-[10px] text-kinetic-cyan uppercase font-bold">[04] DISPATCH NACIONAL</div>
            <h4 class="font-display font-bold text-white text-base">Envíos Asegurados</h4>
            <p class="font-mono text-xs text-neutral-500 leading-relaxed">
              Tracking en vivo y despachos el mismo día vía MRW o Grupo ZOOM a nivel nacional.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAsyncData } from '#imports';
import HeroScene from '~/components/3d/HeroScene.vue';
import DecoderButton from '~/components/ui/DecoderButton.vue';
import KineticRibbon from '~/components/catalog/KineticRibbon.vue';
import { useApi } from '~/composables/useApi';

const config = useRuntimeConfig();
const cleanPhone = computed(() => (config.public.whatsappNumber || '1234567890').replace(/[^0-9]/g, ''));

const { fetchApi } = useApi();

// Fetch live products strictly using useAsyncData for SSR safety
const { data, pending, error } = await useAsyncData(
  'featuredProducts',
  () => fetchApi<any>('/products?featured=true')
);

// Fallback seed data in case API is down or empty
const defaultProducts = [
  {
    id: '1',
    title: 'PIXEL-X — Unlocked Android Flagship (256GB)',
    slug: 'pixel-x-unlocked-android-flagship-256gb',
    category: { name: 'Smartphones' },
    has3D: true,
    variants: [{ price: 749.00 }],
    media: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80' }],
  },
  {
    id: '2',
    title: 'SONIC-01 — Hybrid IEM Tribrid Reference',
    slug: 'sonic-01-hybrid-iem-tribrid-reference',
    category: { name: 'Audio & IEM' },
    has3D: true,
    variants: [{ price: 279.00 }],
    media: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80' }],
  },
  {
    id: '3',
    title: 'GAN-140 — 140W USB-C GaN Quad Charger',
    slug: 'gan-140-140w-usbc-gan-quad-charger',
    category: { name: 'Charging & Power' },
    has3D: false,
    variants: [{ price: 89.00 }],
    media: [{ url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80' }],
  },
  {
    id: '4',
    title: 'GRID-00 — Modular Tech EDC Organizer',
    slug: 'grid-00-modular-tech-edc-organizer',
    category: { name: 'Tech EDC' },
    has3D: false,
    variants: [{ price: 69.00 }],
    media: [{ url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80' }],
  },
];

const featuredProducts = computed(() => {
  if (data.value?.data && data.value.data.length > 0) {
    return data.value.data;
  }
  return defaultProducts;
});
</script>
