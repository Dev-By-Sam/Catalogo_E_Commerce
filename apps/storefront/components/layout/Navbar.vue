<template>
  <header class="sticky top-0 z-40 w-full bg-[#080809]/90 backdrop-blur-md hairline-b select-none">
    <!-- Top System Ticker / Marquee -->
    <div class="bg-industrial-950 hairline-b text-[10px] font-mono tracking-widest text-neutral-400 py-1 overflow-hidden flex items-center">
      <div class="flex whitespace-nowrap animate-marquee-slow">
        <span class="mx-6 text-kinetic-cyan">⚡ KINETIC TECH ARCHITECTURAL COMMERCE</span>
        <span class="mx-6">SYSTEM STATUS: <span class="text-emerald-400">NOMINAL (99.9%)</span></span>
        <span class="mx-6">WORLDWIDE DISPATCH: <span class="text-white">ACTIVE (FEDEX / DHL EXPRESS)</span></span>
        <span class="mx-6">WHATSAPP EXPRESS SALES: <span class="text-[#25D366]">ONLINE</span></span>
        
        <span class="mx-6 text-kinetic-cyan">⚡ KINETIC TECH ARCHITECTURAL COMMERCE</span>
        <span class="mx-6">SYSTEM STATUS: <span class="text-emerald-400">NOMINAL (99.9%)</span></span>
        <span class="mx-6">WORLDWIDE DISPATCH: <span class="text-white">ACTIVE (FEDEX / DHL EXPRESS)</span></span>
        <span class="mx-6">WHATSAPP EXPRESS SALES: <span class="text-[#25D366]">ONLINE</span></span>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Left: Brand Logo & Telemetry Indicator -->
      <div class="flex items-center space-x-6">
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 group"
          data-interactive="true"
          data-tag="HOME"
        >
          <!-- Industrial Geometric Glyph -->
          <div class="w-7 h-7 bg-white text-black flex items-center justify-center font-mono font-bold text-sm tracking-tighter group-hover:bg-kinetic-cyan transition-colors">
            K
          </div>
          <div class="flex flex-col">
            <span class="font-display font-black tracking-tight text-lg leading-none text-white group-hover:text-kinetic-cyan transition-colors">
              KINETIC
            </span>
            <span class="font-mono text-[9px] text-neutral-500 tracking-widest leading-none mt-0.5">
              TECH & INDUSTRIAL EDC
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <nav class="hidden md:flex items-center space-x-1 pl-6 hairline-l">
          <NuxtLink
            to="/catalog"
            class="px-4 py-1.5 text-xs font-mono tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-all"
            active-class="text-white font-bold bg-neutral-900"
            data-interactive="true"
            data-tag="CATALOG"
          >
            [01] CATÁLOGO
          </NuxtLink>
          <NuxtLink
            to="/tracking"
            class="px-4 py-1.5 text-xs font-mono tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-all"
            active-class="text-white font-bold bg-neutral-900"
            data-interactive="true"
            data-tag="TRACKING"
          >
            [02] SEGUIMIENTO
          </NuxtLink>
          <NuxtLink
            to="/admin/overview"
            class="px-4 py-1.5 text-xs font-mono tracking-widest text-neutral-500 hover:text-kinetic-cyan hover:bg-neutral-900/60 transition-all"
            data-interactive="true"
            data-tag="CEO_ADMIN"
          >
            [03] CEO DASHBOARD
          </NuxtLink>
        </nav>
      </div>

      <!-- Right: Search, Currency & Cart Drawer Trigger -->
      <div class="flex items-center space-x-4">
        <!-- Currency / BCV Indicator -->
        <div class="hidden sm:flex flex-col items-end px-2.5 py-1 bg-industrial-900 hairline-all font-mono text-[10px]">
          <div class="flex items-center text-neutral-400">
            <span class="w-1.5 h-1.5 rounded-full mr-2" :class="bcvRate > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'" />
            <span class="uppercase tracking-widest">BCV RATE</span>
          </div>
          <div class="text-white font-bold mt-0.5" v-if="bcvRate > 0">
            Bs. {{ bcvRate.toFixed(2) }}
          </div>
          <div class="text-neutral-500 mt-0.5" v-else>
            Loading...
          </div>
        </div>

        <!-- Catalog Instant Search Link -->
        <NuxtLink
          to="/catalog"
          class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 hairline-all transition-colors flex items-center space-x-1.5"
          data-interactive="true"
          data-tag="SEARCH"
          title="Buscar productos"
        >
          <SearchIcon class="w-4 h-4" />
          <span class="hidden sm:inline text-[10px] font-mono text-neutral-500">BUSCAR</span>
        </NuxtLink>

        <!-- Cart Button -->
        <button
          @click="cartStore.toggleCart()"
          class="relative px-3.5 py-2 bg-white text-black hover:bg-kinetic-cyan hover:text-black font-mono text-xs font-bold tracking-widest transition-colors flex items-center space-x-2"
          data-interactive="true"
          data-tag="CART_DRAWER"
        >
          <ShoppingBagIcon class="w-4 h-4" />
          <span>CART</span>
          <span
            class="ml-1 px-1.5 py-0.2 bg-black text-white text-[10px] font-mono"
            :class="{ 'bg-kinetic-orange text-white': cartStore.totalItems > 0 }"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useDollar } from '~/composables/useDollar';
import { ShoppingBag as ShoppingBagIcon, Search as SearchIcon } from 'lucide-vue-next';

const cartStore = useCartStore();
const { bcvRate } = useDollar();
</script>
