<template>
  <div class="max-w-3xl space-y-8 font-mono">
    <!-- Header -->
    <div class="hairline-b pb-6">
      <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest">
        CONFIGURACIÓN PLUG & PLAY — SYSTEM PARAMETERS
      </span>
      <h1 class="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
        AJUSTES DE LA TIENDA
      </h1>
      <p class="text-xs text-neutral-400 mt-1">
        Personaliza tu tienda instantáneamente sin necesidad de editar código fuente.
      </p>
    </div>

    <!-- Settings Form -->
    <form @submit.prevent="saveSettings" class="space-y-6 text-xs">
      <!-- Group 1: Identidad & Moneda -->
      <div class="bg-industrial-950 hairline-all p-6 space-y-4">
        <h2 class="font-display font-bold text-white uppercase tracking-wider text-sm hairline-b pb-3">
          1. IDENTIDAD DE MARCA
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">NOMBRE COMERCIAL</label>
            <input
              v-model="settings.STORE_NAME"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">MONEDA BASE (ISO)</label>
            <input
              v-model="settings.STORE_CURRENCY"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            />
          </div>

          <div class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">TAGLINE / LEMA</label>
            <input
              v-model="settings.STORE_TAGLINE"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            />
          </div>
        </div>
      </div>

      <!-- Group 2: WhatsApp & Pasarela -->
      <div class="bg-industrial-950 hairline-all p-6 space-y-4">
        <h2 class="font-display font-bold text-white uppercase tracking-wider text-sm hairline-b pb-3">
          2. CANALES DE VENTA & PAGOS
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-[#25D366] uppercase tracking-widest font-bold">
              NÚMERO DE WHATSAPP RECEPTOR DE VENTAS (CON CÓDIGO DE PAÍS)
            </label>
            <input
              v-model="settings.STORE_WHATSAPP_NUMBER"
              placeholder="+584121234567"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-[#25D366]"
            />
            <span class="text-[10px] text-neutral-500 block">
              A esta línea llegarán los mensajes codificados del checkout en 1 clic.
            </span>
          </div>

          <div class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">STRIPE PUBLIC KEY (SANDBOX)</label>
            <input
              v-model="settings.STRIPE_PUBLIC_KEY"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            />
          </div>
        </div>
      </div>

      <!-- Group 3: Reglas de Envío -->
      <div class="bg-industrial-950 hairline-all p-6 space-y-4">
        <h2 class="font-display font-bold text-white uppercase tracking-wider text-sm hairline-b pb-3">
          3. LOGÍSTICA Y ENVÍOS
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">COSTO BASE DE ENVÍO ($)</label>
            <input
              type="number"
              step="0.01"
              v-model="settings.BASE_SHIPPING_COST"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">UMBRAL ENVÍO GRATUITO ($)</label>
            <input
              type="number"
              step="0.01"
              v-model="settings.FREE_SHIPPING_THRESHOLD"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            />
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div>
        <button
          type="submit"
          :disabled="isSaving"
          class="w-full py-4 bg-white text-black hover:bg-kinetic-cyan font-bold uppercase text-xs tracking-widest transition-colors disabled:opacity-40"
        >
          {{ isSaving ? 'GUARDANDO CAMBIOS...' : 'GUARDAR CONFIGURACIÓN PLUG & PLAY →' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'admin',
});

const { fetchApi } = useApi();
const isSaving = ref(false);

const settings = reactive({
  STORE_NAME: 'KINETIC INDUSTRIAL',
  STORE_TAGLINE: 'Avant-Garde Architectural Goods & High-Performance Objects',
  STORE_CURRENCY: 'USD',
  STORE_WHATSAPP_NUMBER: '1234567890',
  BASE_SHIPPING_COST: '15.00',
  FREE_SHIPPING_THRESHOLD: '150.00',
  STRIPE_PUBLIC_KEY: 'pk_test_51MockIndustrialKey',
});

const loadSettings = async () => {
  try {
    const res = await fetchApi<any>('/settings/public');
    if (res) {
      Object.assign(settings, res);
    }
  } catch (e) {}
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await fetchApi('/settings/admin', {
      method: 'PUT',
      body: settings,
    });
    alert('Configuración guardada exitosamente.');
  } catch (err: any) {
    alert('Configuración guardada en memoria.');
  } finally {
    isSaving.value = false;
  }
};

await loadSettings();
</script>
