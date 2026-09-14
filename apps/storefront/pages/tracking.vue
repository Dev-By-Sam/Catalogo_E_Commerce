<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-mono select-none">
    <!-- Header -->
    <div class="text-center space-y-3 hairline-b pb-8">
      <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest block font-bold">
        TELEMETRÍA DE DESPACHO EN VIVO
      </span>
      <h1 class="text-3xl sm:text-4xl font-display font-black text-white uppercase">
        RASTREADOR DE PEDIDOS
      </h1>
      <p class="text-xs text-neutral-400 max-w-md mx-auto">
        Consulta el estado de preparación, empaque y despacho satelital de tu orden en tiempo real.
      </p>

      <!-- Search Box -->
      <div class="max-w-md mx-auto mt-6 flex space-x-2 relative">
        <input
          v-model="queryInput"
          placeholder="Nro de Orden, Email o Teléfono"
          @keyup.enter="searchOrder"
          :disabled="isSearching || isThrottled"
          class="flex-1 bg-black hairline-all px-4 py-3 text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan disabled:opacity-50"
        />
        <button
          @click="searchOrder"
          :disabled="isSearching || isThrottled || !queryInput.trim()"
          class="px-6 py-3 bg-white text-black hover:bg-kinetic-cyan font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
          data-interactive="true"
          data-tag="SEARCH_TRACKING"
        >
          {{ isSearching ? '...' : (isThrottled ? 'ESPERA' : 'CONSULTAR') }}
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mt-8 p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs text-center">
      {{ errorMessage }}
    </div>

    <!-- Tracking Result Card -->
    <div v-if="order" class="mt-12 bg-industrial-950 hairline-all p-6 sm:p-10 space-y-8">
      <!-- Top Order Meta -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center hairline-b pb-6 gap-4">
        <div>
          <span class="text-[10px] text-neutral-500 uppercase tracking-widest">ORDEN EN SEGUIMIENTO</span>
          <div class="text-xl font-bold text-white tracking-widest mt-1">
            {{ order.orderNumber }}
          </div>
          <div class="text-xs text-neutral-400 mt-0.5">
            Destino: {{ order.shippingCity }}, {{ order.shippingCountry }}
          </div>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-neutral-500 uppercase tracking-widest">ESTADO ACTUAL</span>
          <div class="text-xs font-bold px-3 py-1 bg-kinetic-cyan/20 border border-kinetic-cyan text-kinetic-cyan mt-1 inline-block">
            {{ formatStatus(order.status) }}
          </div>
        </div>
      </div>

      <!-- 5-Stage Interactive Timeline -->
      <div class="space-y-4">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest block">
          LÍNEA DE TIEMPO DEL DESPACHO:
        </span>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <!-- Step 1 -->
          <div
            class="p-3 hairline-all transition-all"
            :class="getStepIndex(order.status) >= 0 ? 'bg-neutral-900 border-white' : 'bg-black opacity-40'"
          >
            <div class="text-[10px] font-bold" :class="getStepIndex(order.status) >= 0 ? 'text-kinetic-cyan' : 'text-neutral-500'">
              [01] RECIBIDO
            </div>
            <div class="text-[11px] font-bold text-white mt-1">Orden Creada</div>
          </div>

          <!-- Step 2 -->
          <div
            class="p-3 hairline-all transition-all"
            :class="getStepIndex(order.status) >= 1 ? 'bg-neutral-900 border-white' : 'bg-black opacity-40'"
          >
            <div class="text-[10px] font-bold" :class="getStepIndex(order.status) >= 1 ? 'text-kinetic-cyan' : 'text-neutral-500'">
              [02] PAGO OK
            </div>
            <div class="text-[11px] font-bold text-white mt-1">Pago Confirmado</div>
          </div>

          <!-- Step 3 -->
          <div
            class="p-3 hairline-all transition-all"
            :class="getStepIndex(order.status) >= 2 ? 'bg-neutral-900 border-white' : 'bg-black opacity-40'"
          >
            <div class="text-[10px] font-bold" :class="getStepIndex(order.status) >= 2 ? 'text-kinetic-cyan' : 'text-neutral-500'">
              [03] EMPAQUE
            </div>
            <div class="text-[11px] font-bold text-white mt-1">Procesando Envío</div>
          </div>

          <!-- Step 4 -->
          <div
            class="p-3 hairline-all transition-all"
            :class="getStepIndex(order.status) >= 3 ? 'bg-neutral-900 border-white' : 'bg-black opacity-40'"
          >
            <div class="text-[10px] font-bold" :class="getStepIndex(order.status) >= 3 ? 'text-kinetic-cyan' : 'text-neutral-500'">
              [04] EN RUTA
            </div>
            <div class="text-[11px] font-bold text-white mt-1">Despachado</div>
          </div>

          <!-- Step 5 -->
          <div
            class="p-3 hairline-all transition-all"
            :class="getStepIndex(order.status) >= 4 ? 'bg-neutral-900 border-white' : 'bg-black opacity-40'"
          >
            <div class="text-[10px] font-bold" :class="getStepIndex(order.status) >= 4 ? 'text-emerald-400' : 'text-neutral-500'">
              [05] ENTREGADO
            </div>
            <div class="text-[11px] font-bold text-white mt-1">Entrega Exitosa</div>
          </div>
        </div>
      </div>

      <!-- Tracking Code Box (Only if SHIPPED or DELIVERED) -->
      <div v-if="order.trackingCode && getStepIndex(order.status) >= 3" class="mt-6 p-4 bg-kinetic-cyan/10 border border-kinetic-cyan flex items-center justify-between">
        <div>
          <span class="text-[10px] text-kinetic-cyan font-bold uppercase block tracking-widest">
            GUÍA DE RASTREO ({{ order.trackingCourier || 'COURIER' }}):
          </span>
          <span class="text-sm font-bold text-white tracking-widest mt-1 block">
            {{ order.trackingCode }}
          </span>
        </div>
        <a 
          v-if="trackingUrl" 
          :href="trackingUrl" 
          target="_blank"
          class="px-4 py-2 bg-kinetic-cyan text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
        >
          SEGUIR PAQUETE →
        </a>
      </div>

      <!-- Items In Order -->
      <div v-if="order.items" class="hairline-t pt-6 space-y-2">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest block">ARTÍCULOS INCLUIDOS:</span>
        <div v-for="item in order.items" :key="item.id" class="text-xs text-neutral-300 flex justify-between">
          <span>• {{ item.productTitle }} ({{ item.quantity }}x)</span>
          <span class="text-neutral-500 font-mono">${{ item.price?.toFixed(2) }}</span>
        </div>
        <div class="pt-4 flex justify-between items-center text-sm font-bold border-t border-neutral-900 mt-4">
          <span class="text-white">TOTAL USD:</span>
          <span class="text-kinetic-cyan">${{ order.total?.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center text-[10px] text-neutral-500" v-if="bcvRate > 0">
          <span>EQUIVALENTE BCV (Tasa: Bs. {{ bcvRate.toFixed(2) }}):</span>
          <span>Bs. {{ toBs(order.total).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';
import { useDollar } from '~/composables/useDollar';

const route = useRoute();
const { fetchApi } = useApi();
const { bcvRate, toBs, fetchRates } = useDollar();

const queryInput = ref((route.query.query as string) || '');
const isSearching = ref(false);
const isThrottled = ref(false);
const order = ref<any>(null);
const errorMessage = ref('');

const formatStatus = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'ORDEN RECIBIDA';
    case 'PAID':
      return 'PAGO VALIDADO';
    case 'PROCESSING':
      return 'PREPARANDO ENVÍO';
    case 'SHIPPED':
      return 'EN RUTA DE ENTREGA';
    case 'DELIVERED':
      return 'ENTREGADO CON ÉXITO';
    case 'CANCELLED':
      return 'CANCELADO';
    default:
      return status;
  }
};

const getStepIndex = (status: string) => {
  switch (status) {
    case 'PENDING': return 0;
    case 'PAID': return 1;
    case 'PROCESSING': return 2;
    case 'SHIPPED': return 3;
    case 'DELIVERED': return 4;
    default: return 0;
  }
};

const trackingUrl = computed(() => {
  if (!order.value?.trackingCode || !order.value?.trackingCourier) return null;
  const courier = order.value.trackingCourier.toUpperCase();
  const code = order.value.trackingCode;

  switch(courier) {
    case 'MRW': return `https://www.mrw.com.ve/seguimiento/?nro=${code}`;
    case 'ZOOM': return `https://www.zoom.net.ve/rastrear/?guia=${code}`;
    case 'DHL': return `https://www.dhl.com/ve-es/home/rastreo.html?tracking-id=${code}`;
    case 'FEDEX': return `https://www.fedex.com/fedextrack/?trknbr=${code}`;
    default: return null;
  }
});

const searchOrder = async () => {
  if (!queryInput.value.trim() || isSearching.value || isThrottled.value) return;

  isSearching.value = true;
  errorMessage.value = '';
  order.value = null;

  try {
    const res = await fetchApi<any>(`/orders/track?query=${encodeURIComponent(queryInput.value.trim())}`);
    if (res) {
      order.value = res;
    }
  } catch (err: any) {
    // Check if it's a 429 Too Many Requests (Rate limit)
    if (err.status === 429) {
      errorMessage.value = 'Demasiadas consultas. Por favor espera unos segundos.';
      isThrottled.value = true;
      setTimeout(() => {
        isThrottled.value = false;
        errorMessage.value = '';
      }, 5000); // UI cooldown for 5s
    } else {
      errorMessage.value = 'No se encontró ninguna orden activa con ese número, email o teléfono.';
    }
  } finally {
    isSearching.value = false;
  }
};

onMounted(() => {
  fetchRates();
  if (queryInput.value) {
    searchOrder();
  }
});
</script>
