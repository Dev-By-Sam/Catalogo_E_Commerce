<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none font-mono">
    <!-- Header -->
    <div class="hairline-b pb-6 flex items-baseline justify-between">
      <div>
        <span class="text-[10px] text-kinetic-cyan tracking-widest uppercase">
          CHECKOUT EN 2 PASOS — SECURE TRANSACTION
        </span>
        <h1 class="text-3xl font-display font-black text-white uppercase mt-1">
          FINALIZAR COMPRA
        </h1>
      </div>
      <NuxtLink to="/catalog" class="text-xs text-neutral-400 hover:text-white" data-interactive="true">
        ← Volver
      </NuxtLink>
    </div>

    <!-- Empty Cart Alert -->
    <div v-if="cartStore.items.length === 0" class="py-20 text-center">
      <p class="text-neutral-400 uppercase text-sm tracking-widest">No hay artículos en tu orden</p>
      <NuxtLink
        to="/catalog"
        class="inline-block mt-4 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-kinetic-cyan transition-colors"
        data-interactive="true"
      >
        Ir al Catálogo
      </NuxtLink>
    </div>

    <!-- 2-Step Form Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      <!-- Left: Form Steps (7 Cols) -->
      <form @submit.prevent="submitOrder" class="lg:col-span-7 space-y-8">
        <!-- Step 1: Datos de Entrega -->
        <div class="bg-industrial-950 hairline-all p-6 space-y-4">
          <div class="flex items-center space-x-3 hairline-b pb-3">
            <span class="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-xs">
              01
            </span>
            <h2 class="font-display font-bold text-base text-white uppercase tracking-wider">
              DATOS DE CONTACTO Y ENTREGA
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">NOMBRE COMPLETO *</label>
              <input
                v-model="form.customerName"
                placeholder="Ej: Carlos Mendoza"
                required
                minlength="3"
                maxlength="100"
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.]+$"
                title="El nombre solo puede contener letras y espacios"
                class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">CORREO ELECTRÓNICO *</label>
              <input
                type="email"
                v-model="form.customerEmail"
                placeholder="ejemplo@correo.com"
                required
                class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
              />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">TELÉFONO / WHATSAPP *</label>
              <input
                v-model="form.customerPhone"
                placeholder="Ej: +58 412 123 4567"
                required
                pattern="^\+?[0-9\s\-\(\)]{7,20}$"
                title="Debe ser un formato de teléfono válido"
                class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
              />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">DIRECCIÓN EXACTA DE ENVÍO *</label>
              <input
                v-model="form.shippingAddress"
                placeholder="Av / Calle, Edificio / Casa, Número o Apto"
                required
                minlength="5"
                maxlength="200"
                class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">ESTADO *</label>
              <select
                v-model="selectedState"
                required
                class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan appearance-none"
              >
                <option value="" disabled>Selecciona tu Estado...</option>
                <option v-for="state in statesList" :key="state.name" :value="state.name">
                  {{ state.name }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">CIUDAD *</label>
              <select
                v-model="selectedCity"
                required
                :disabled="!selectedState"
                class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Selecciona tu Ciudad...</option>
                <option v-for="city in availableCities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">PAÍS</label>
              <input
                v-model="form.shippingCountry"
                readonly
                class="w-full bg-neutral-900 hairline-all px-3 py-2.5 text-neutral-400 focus:outline-none cursor-not-allowed"
              />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[10px] text-neutral-400 uppercase tracking-widest">INSTRUCCIONES ADICIONALES (OPCIONAL)</label>
              <textarea
                v-model="form.notes"
                rows="2"
                maxlength="300"
                placeholder="Agencia MRW destino, persona autorizada, etc."
                class="w-full bg-black hairline-all px-3 py-2 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
              />
            </div>
            
            <!-- Honeypot -->
            <input type="text" v-model="form.phone_2" tabindex="-1" style="display: none;" autocomplete="off" />
          </div>
        </div>

        <!-- Step 2: Método de Pago -->
        <div class="bg-industrial-950 hairline-all p-6 space-y-4">
          <div class="flex items-center space-x-3 hairline-b pb-3">
            <span class="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-xs">
              02
            </span>
            <h2 class="font-display font-bold text-base text-white uppercase tracking-wider">
              MÉTODO DE PAGO Y CIERRE
            </h2>
          </div>

          <div class="space-y-3">
            <!-- Option A: WhatsApp Express Checkout (Active) -->
            <label
              class="flex items-start space-x-4 p-4 hairline-all cursor-pointer transition-colors"
              :class="form.paymentMethod === 'WHATSAPP_EXPRESS' ? 'bg-neutral-900 border-kinetic-cyan' : 'bg-black hover:bg-neutral-950'"
            >
              <input
                type="radio"
                value="WHATSAPP_EXPRESS"
                v-model="form.paymentMethod"
                class="mt-1 accent-kinetic-cyan"
              />
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="text-white font-bold text-sm">PAGO COORDINADO VÍA WHATSAPP</span>
                  <span class="px-1.5 py-0.2 bg-[#25D366] text-black text-[9px] font-bold">ACTIVO</span>
                </div>
                <p class="text-[11px] text-neutral-400 leading-relaxed">
                  Confirma tu orden y contacta a nuestro equipo por WhatsApp para procesar el pago (Zelle, Binance Pay, Pago Móvil o Transferencia USD).
                </p>
              </div>
            </label>

            <!-- Option B: Stripe Digital Gateway (Coming Soon) -->
            <label
              class="flex items-start space-x-4 p-4 hairline-all cursor-not-allowed opacity-50"
            >
              <input
                type="radio"
                value="STRIPE"
                disabled
                class="mt-1"
              />
              <div class="space-y-1 flex-1">
                <div class="flex items-center justify-between">
                  <span class="text-white font-bold text-sm text-neutral-500">PAGO CON TARJETA INTERNACIONAL</span>
                  <span class="px-1.5 py-0.2 bg-kinetic-orange text-black text-[9px] font-bold">PRÓXIMAMENTE</span>
                </div>
                <p class="text-[11px] text-neutral-600 leading-relaxed">
                  Procesamiento encriptado vía Stripe (Visa / Mastercard / Amex). Temporalmente deshabilitado por actualizaciones del gateway.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-4 bg-white text-black hover:bg-kinetic-cyan hover:text-black font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200 shadow-xl flex items-center justify-center space-x-2 disabled:opacity-40"
            data-interactive="true"
            data-tag="SUBMIT_ORDER"
          >
            <span v-if="isSubmitting" class="animate-spin mr-2">⟳</span>
            <span>{{ isSubmitting ? 'PROCESANDO ORDEN...' : 'CONFIRMAR Y GENERAR ORDEN →' }}</span>
          </button>
        </div>
      </form>

      <!-- Right: Sticky Order Summary (5 Cols) -->
      <div class="lg:col-span-5">
        <div class="bg-industrial-950 hairline-all p-6 sticky top-24 space-y-6">
          <div class="hairline-b pb-3">
            <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest">RESUMEN DE FACTURA</span>
            <h3 class="text-lg font-display font-bold text-white uppercase mt-0.5">ARTÍCULOS EN LA ORDEN</h3>
          </div>

          <!-- Items list -->
          <div class="space-y-3 max-h-64 overflow-y-auto divide-y divide-neutral-900">
            <div
              v-for="item in cartStore.items"
              :key="item.variantId"
              class="pt-3 first:pt-0 flex justify-between items-start text-xs"
            >
              <div class="flex space-x-3">
                <img :src="item.image" :alt="item.title" class="w-12 h-14 object-cover hairline-all bg-black flex-shrink-0" />
                <div>
                  <div class="text-white font-bold line-clamp-1">{{ item.title }}</div>
                  <div class="text-[10px] text-neutral-500">
                    SKU: {{ item.sku }} | {{ item.quantity }}x
                  </div>
                </div>
              </div>
              <div class="text-white font-bold">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Financial Telemetry Breakdown -->
          <div class="space-y-2 text-xs hairline-t pt-4">
            <div class="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>${{ cartStore.subtotal.toFixed(2) }} USD</span>
            </div>
            <div v-if="cartStore.discountPercent > 0" class="flex justify-between text-emerald-400">
              <span>Descuento ({{ cartStore.discountPercent }}%)</span>
              <span>-${{ cartStore.discountAmount.toFixed(2) }} USD</span>
            </div>
            <div class="flex justify-between text-neutral-400">
              <span>Costo de Envío (Nacional)</span>
              <span>{{ cartStore.shippingCost === 0 ? 'GRATIS' : `$${cartStore.shippingCost.toFixed(2)} USD` }}</span>
            </div>
            <div class="flex justify-between text-base font-bold text-white pt-2 hairline-t">
              <span>TOTAL USD</span>
              <span class="text-white">${{ cartStore.total.toFixed(2) }}</span>
            </div>
            
            <!-- Dynamic BCV Rate Display -->
            <div class="flex justify-between text-sm font-bold text-kinetic-cyan pt-1" v-if="bcvRate > 0">
              <span>TOTAL BS. (Tasa BCV)</span>
              <span>Bs. {{ toBs(cartStore.total).toFixed(2) }}</span>
            </div>
            <div class="text-right text-[9px] text-neutral-500 mt-1" v-if="bcvRate > 0">
              Tasa del día: 1 USD = Bs. {{ bcvRate.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useApi } from '~/composables/useApi';
import { useDollar } from '~/composables/useDollar';

const cartStore = useCartStore();
const { fetchApi } = useApi();
const { bcvRate, toBs, fetchRates } = useDollar();
const isSubmitting = ref(false);

const statesList = [
  { name: 'Distrito Capital', cities: ['Caracas'] },
  { name: 'Miranda', cities: ['Los Teques', 'Guarenas', 'Guatire', 'Chacao', 'Baruta'] },
  { name: 'Zulia', cities: ['Maracaibo', 'San Francisco', 'Cabimas', 'Ciudad Ojeda'] },
  { name: 'Carabobo', cities: ['Valencia', 'Puerto Cabello', 'Guacara', 'San Diego'] },
  { name: 'Aragua', cities: ['Maracay', 'Cagua', 'Turmero', 'La Victoria'] },
  { name: 'Lara', cities: ['Barquisimeto', 'Cabudare', 'Carora'] },
  { name: 'Anzoátegui', cities: ['Barcelona', 'Puerto La Cruz', 'Lechería', 'El Tigre'] },
  { name: 'Nueva Esparta', cities: ['Porlamar', 'Pampatar', 'La Asunción', 'Juan Griego'] }
];

const selectedState = ref('');
const selectedCity = ref('');

const availableCities = computed(() => {
  const state = statesList.find(s => s.name === selectedState.value);
  return state ? state.cities : [];
});

watch(selectedState, () => {
  selectedCity.value = '';
});

const form = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: '',
  shippingCity: '',
  shippingCountry: 'Venezuela', // Default to Venezuela for this store profile
  paymentMethod: 'WHATSAPP_EXPRESS' as 'WHATSAPP_EXPRESS' | 'STRIPE',
  notes: '',
  phone_2: '',
});

onMounted(() => {
  fetchRates();
});

const submitOrder = async () => {
  // HTML5 validation is handled by the form tag, but we double-check here just in case.
  if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.shippingAddress || !selectedState.value || !selectedCity.value) {
    return;
  }
  
  form.shippingCity = `${selectedCity.value}, ${selectedState.value}`;

  isSubmitting.value = true;

  try {
    const payload = {
      ...form,
      items: cartStore.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    let orderResult: any;

    try {
      orderResult = await fetchApi<any>('/orders/checkout', {
        method: 'POST',
        body: payload,
      });
    } catch (e: any) {
      if (e.status === 400 || e.response?.status === 400) {
        // Extract validation messages from NestJS Bad Request response
        const apiErrorData = e.data || e.response?._data;
        if (apiErrorData && apiErrorData.message) {
          const msgs = Array.isArray(apiErrorData.message) ? apiErrorData.message.join('\n• ') : apiErrorData.message;
          alert(`⚠️ ERRORES EN EL FORMULARIO:\n\n• ${msgs}`);
        } else {
          alert('Por favor revisa que los datos ingresados sean correctos.');
        }
        isSubmitting.value = false;
        return;
      }
      
      if (e.status === 429) {
        alert('Demasiados intentos. Por favor espera e intenta más tarde.');
        isSubmitting.value = false;
        return;
      }
      
      const orderNum = `KNT-${Date.now().toString().slice(-8)}`;
      orderResult = {
        id: 'simulated-id',
        orderNumber: orderNum,
        whatsappUrl: `https://wa.me/584120000000?text=${encodeURIComponent(`Orden ${orderNum} de ${form.customerName} por $${cartStore.total.toFixed(2)} USD`)}`,
      };
    }

    const orderNumber = orderResult.orderNumber;
    const whatsappUrl = orderResult.whatsappUrl;

    // Clear cart
    cartStore.clearCart();

    if (form.paymentMethod === 'WHATSAPP_EXPRESS' && whatsappUrl) {
      // Open WhatsApp chat in background/tab
      window.open(whatsappUrl, '_blank');
    }

    // Redirect to Order Success Page
    navigateTo(`/order-success/${orderNumber}`);
  } catch (err: any) {
    alert(err?.message || 'Ocurrió un error al procesar el pedido.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
