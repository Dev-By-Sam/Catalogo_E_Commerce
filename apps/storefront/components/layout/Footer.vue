<template>
  <footer class="bg-industrial-950 hairline-t mt-24 text-neutral-400 select-none">
    <!-- Top Statement Grid -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-900">
      <!-- Col 1: Manifesto -->
      <div class="p-8 md:col-span-5 space-y-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-kinetic-cyan" />
          <span class="font-mono text-xs tracking-widest text-white uppercase font-bold">
            KINETIC INDUSTRIAL ARCHITECTURE
          </span>
        </div>
        <p class="text-xs font-mono text-neutral-400 leading-relaxed">
          Plataforma de comercio electrónico de vanguardia diseñada bajo principios de ingeniería suiza y estética brutalista. Eliminamos intermediarios para ofrecer artefactos físicos de precisión y materiales aeroespaciales.
        </p>
        <div class="pt-2 text-[10px] font-mono text-neutral-500">
          LATITUDE: 47.3769° N • LONGITUDE: 8.5417° E (ZÜRICH LABS)
        </div>
      </div>

      <!-- Col 2: Navigation Links -->
      <div class="p-8 md:col-span-3 space-y-3 font-mono text-xs">
        <span class="text-white text-[10px] tracking-widest uppercase font-bold block mb-4">
          SISTEMA Y CATÁLOGO
        </span>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/catalog" class="hover:text-kinetic-cyan transition-colors" data-interactive="true">
              [01] Todos los Productos
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/catalog?category=architectural-objects" class="hover:text-kinetic-cyan transition-colors" data-interactive="true">
              [02] Architectural Objects
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/catalog?category=technical-apparel" class="hover:text-kinetic-cyan transition-colors" data-interactive="true">
              [03] Technical Apparel
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/tracking" class="hover:text-kinetic-cyan transition-colors" data-interactive="true">
              [04] Rastrear Envío
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Col 3: Direct Sales WhatsApp & Telemetry -->
      <div class="p-8 md:col-span-4 space-y-4 font-mono text-xs">
        <span class="text-white text-[10px] tracking-widest uppercase font-bold block mb-2">
          ATENCIÓN DIRECTA & DISPATCH
        </span>
        <p class="text-xs text-neutral-400">
          Atención ejecutiva sin fricciones a través de nuestra pasarela de chat comercial.
        </p>
        <a
          :href="`https://wa.me/${cleanPhone}`"
          target="_blank"
          class="inline-flex items-center space-x-2 px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-black font-mono text-xs transition-colors"
          data-interactive="true"
          data-tag="WHATSAPP_SUPPORT"
        >
          <span>WHATSAPP DIRECT SALES</span>
          <span>↗</span>
        </a>
      </div>
    </div>

    <!-- Bottom Hairline Bar -->
    <div class="hairline-t py-6 bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-neutral-600 space-y-2 sm:space-y-0">
        <div>
          © {{ new Date().getFullYear() }} KINETIC INDUSTRIAL PLATFORM. ALL RIGHTS RESERVED.
        </div>
        <div class="flex items-center space-x-4">
          <NuxtLink to="/admin/login" class="hover:text-neutral-400 transition-colors" data-interactive="true">
            [ADMIN PORTAL]
          </NuxtLink>
          <span>PLUG & PLAY V3.0</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const config = useRuntimeConfig();
const cleanPhone = computed(() => (config.public.whatsappNumber || '1234567890').replace(/[^0-9]/g, ''));
</script>
