<template>
  <div class="min-h-screen bg-[#070708] text-[#e8eaed] font-mono flex flex-col select-none">
    <!-- Top Admin Bar -->
    <header class="bg-industrial-950 hairline-b px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/overview" class="flex items-center space-x-2" data-interactive="true">
          <div class="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-xs">
            K
          </div>
          <span class="font-display font-black text-white text-sm">CEO DASHBOARD</span>
        </NuxtLink>
        <span class="text-[10px] text-kinetic-cyan px-2 py-0.5 bg-industrial-900 border border-neutral-800">
          TELEMETRY V3.0
        </span>
      </div>

      <!-- Quick Nav & Logout -->
      <div class="flex items-center space-x-4 text-xs">
        <NuxtLink to="/" target="_blank" class="text-neutral-400 hover:text-white flex items-center space-x-1" data-interactive="true">
          <span>VER TIENDA</span>
          <span>↗</span>
        </NuxtLink>
        <button
          @click="authStore.logout()"
          class="px-3 py-1 bg-red-950/40 border border-red-800 text-red-300 hover:bg-red-900/60 text-xs"
          data-interactive="true"
        >
          [CERRAR SESIÓN]
        </button>
      </div>
    </header>

    <!-- Admin Main Body with Sidebar -->
    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-industrial-950 hairline-r p-4 space-y-6">
        <div class="text-[10px] text-neutral-500 uppercase tracking-widest px-3">
          MÓDULOS DE CONTROL
        </div>

        <nav class="space-y-1 text-xs">
          <NuxtLink
            to="/admin/overview"
            class="flex items-center space-x-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
            active-class="bg-neutral-900 text-kinetic-cyan font-bold border-l-2 border-kinetic-cyan"
            data-interactive="true"
          >
            <span>[01]</span>
            <span>OVERVIEW & TELEMETRÍA</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/products"
            class="flex items-center space-x-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
            active-class="bg-neutral-900 text-kinetic-cyan font-bold border-l-2 border-kinetic-cyan"
            data-interactive="true"
          >
            <span>[02]</span>
            <span>INVENTARIO Y PRODUCTOS</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center space-x-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
            active-class="bg-neutral-900 text-kinetic-cyan font-bold border-l-2 border-kinetic-cyan"
            data-interactive="true"
          >
            <span>[03]</span>
            <span>BANDEJA DE PEDIDOS</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="flex items-center space-x-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
            active-class="bg-neutral-900 text-kinetic-cyan font-bold border-l-2 border-kinetic-cyan"
            data-interactive="true"
          >
            <span>[04]</span>
            <span>CONFIGURACIÓN PLUG & PLAY</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 p-6 sm:p-10 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>
