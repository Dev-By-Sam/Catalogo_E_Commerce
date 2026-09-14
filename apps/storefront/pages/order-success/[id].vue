<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-mono select-none">
    <!-- Success Badge & Status -->
    <div class="text-center space-y-3 hairline-b pb-8">
      <div class="w-14 h-14 bg-white text-black flex items-center justify-center mx-auto text-2xl font-bold font-mono">
        ✓
      </div>
      <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest block font-bold">
        TRANSACCIÓN REGISTRADA EXITOSAMENTE
      </span>
      <h1 class="text-3xl sm:text-4xl font-display font-black text-white uppercase">
        ORDEN GENERADA
      </h1>
      <p class="text-xs text-neutral-400 max-w-md mx-auto">
        Tu solicitud ha sido ingresada en el sistema de despacho. Hemos enviado el comprobante a tu dirección de correo electrónico.
      </p>
    </div>

    <!-- Printable Digital Receipt Card -->
    <div id="printable-receipt" class="mt-8 bg-industrial-950 hairline-all p-6 sm:p-10 space-y-6">
      <!-- Receipt Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center hairline-b pb-6 gap-4">
        <div>
          <span class="text-xs text-neutral-500 uppercase tracking-widest">NÚMERO DE ORDEN</span>
          <div class="text-xl font-bold text-white tracking-widest mt-1">
            {{ orderNumber }}
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs text-neutral-500 uppercase tracking-widest">ESTADO</span>
          <div class="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 mt-1 inline-block">
            PENDIENTE DE DESPACHO
          </div>
        </div>
      </div>

      <!-- Customer Details Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs hairline-b pb-6 text-neutral-400">
        <div>
          <span class="text-[10px] text-neutral-500 uppercase block">CLIENTE:</span>
          <span class="text-white font-bold">{{ order?.customerName || 'Cliente Ejecutivo' }}</span>
        </div>
        <div>
          <span class="text-[10px] text-neutral-500 uppercase block">CONTACTO:</span>
          <span class="text-white">{{ order?.customerEmail || 'alex.mercer@avantgarde.io' }}</span>
        </div>
        <div>
          <span class="text-[10px] text-neutral-500 uppercase block">DIRECCIÓN:</span>
          <span class="text-white">{{ order?.shippingAddress || 'Dirección Registrada' }}</span>
        </div>
        <div>
          <span class="text-[10px] text-neutral-500 uppercase block">MÉTODO DE PAGO:</span>
          <span class="text-white">{{ order?.paymentMethod || 'WHATSAPP EXPRESS' }}</span>
        </div>
      </div>

      <!-- Items List -->
      <div class="space-y-3 hairline-b pb-6 text-xs">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest block">DESGLOSE DE ARTÍCULOS:</span>
        <div
          v-for="(item, idx) in orderItems"
          :key="idx"
          class="flex justify-between items-center text-neutral-300 py-1"
        >
          <div>
            <span class="text-white font-bold">{{ item.productTitle }}</span>
            <span class="text-[10px] text-neutral-500 ml-2">({{ item.quantity }}x ${{ item.price?.toFixed(2) }})</span>
          </div>
          <span class="text-white font-bold">${{ (item.quantity * item.price).toFixed(2) }} USD</span>
        </div>
      </div>

      <!-- Receipt Financials -->
      <div class="flex justify-between items-center text-sm pt-2">
        <span class="text-neutral-400 uppercase tracking-widest">TOTAL DE LA ORDEN:</span>
        <span class="text-2xl font-bold text-kinetic-cyan font-mono">
          ${{ orderTotal.toFixed(2) }} USD
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      <button
        @click="printReceipt"
        class="px-6 py-3 bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest transition-colors"
        data-interactive="true"
        data-tag="PRINT_RECEIPT"
      >
        🖨 IMPRIMIR RECIBO
      </button>

      <NuxtLink
        :to="`/tracking?query=${orderNumber}`"
        class="px-6 py-3 bg-white text-black hover:bg-kinetic-cyan hover:text-black text-xs font-bold uppercase tracking-widest transition-colors"
        data-interactive="true"
        data-tag="TRACK_ORDER"
      >
        RASTREAR EN VIVO →
      </NuxtLink>

      <a
        :href="`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola, quisiera consultar el estado de mi orden ${orderNumber}`)}`"
        target="_blank"
        class="px-6 py-3 bg-[#25D366] text-black text-xs font-bold uppercase tracking-widest hover:bg-[#1ebd5a] transition-colors"
        data-interactive="true"
        data-tag="WHATSAPP_SUPPORT"
      >
        SOPORTE WHATSAPP ↗
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';

const route = useRoute();
const orderNumber = route.params.id as string;
const { fetchApi } = useApi();
const config = useRuntimeConfig();
const cleanPhone = computed(() => (config.public.whatsappNumber || '1234567890').replace(/[^0-9]/g, ''));

const order = ref<any>(null);

try {
  const res = await fetchApi<any>(`/orders/number/${orderNumber}`);
  if (res) order.value = res;
} catch (e) {}

const orderItems = computed(() => {
  if (order.value?.items && order.value.items.length > 0) {
    return order.value.items;
  }
  return [
    { productTitle: 'Objeto de Catálogo Kinetic — Titanium', quantity: 1, price: 680.00 },
  ];
});

const orderTotal = computed(() => {
  if (order.value?.total) return order.value.total;
  return orderItems.value.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0);
});

const printReceipt = () => {
  window.print();
};
</script>
