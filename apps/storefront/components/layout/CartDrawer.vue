<template>
  <ClientOnly>
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 z-50 overflow-hidden select-none"
    >
      <!-- Backdrop with blur -->
      <div
        @click="cartStore.closeCart()"
        class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <!-- Slide-over Ticket Panel -->
      <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-[#0c0d0f] border-l border-neutral-800 flex flex-col shadow-2xl">
          <!-- Ticket Header -->
          <div class="p-6 hairline-b bg-industrial-950">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-kinetic-cyan uppercase">
                  FACTURA PRELIMINAR DIGITAL
                </span>
                <h2 class="text-xl font-display font-black tracking-tight text-white mt-0.5">
                  ORDEN DE COMPRA
                </h2>
              </div>
              <button
                @click="cartStore.closeCart()"
                class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-mono text-sm"
                data-interactive="true"
                data-tag="CLOSE_CART"
              >
                [✕]
              </button>
            </div>

            <!-- Simulated SVG Barcode -->
            <div class="mt-4 flex items-center justify-between bg-black/60 p-2 hairline-all">
              <svg class="h-6 w-48 text-neutral-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                <rect x="0" y="0" width="2" height="20" fill="currentColor" />
                <rect x="4" y="0" width="1" height="20" fill="currentColor" />
                <rect x="7" y="0" width="3" height="20" fill="currentColor" />
                <rect x="12" y="0" width="1" height="20" fill="currentColor" />
                <rect x="15" y="0" width="2" height="20" fill="currentColor" />
                <rect x="19" y="0" width="4" height="20" fill="currentColor" />
                <rect x="25" y="0" width="1" height="20" fill="currentColor" />
                <rect x="28" y="0" width="2" height="20" fill="currentColor" />
                <rect x="32" y="0" width="3" height="20" fill="currentColor" />
                <rect x="37" y="0" width="1" height="20" fill="currentColor" />
                <rect x="40" y="0" width="2" height="20" fill="currentColor" />
                <rect x="44" y="0" width="3" height="20" fill="currentColor" />
                <rect x="49" y="0" width="1" height="20" fill="currentColor" />
                <rect x="52" y="0" width="4" height="20" fill="currentColor" />
                <rect x="58" y="0" width="2" height="20" fill="currentColor" />
                <rect x="62" y="0" width="1" height="20" fill="currentColor" />
                <rect x="65" y="0" width="3" height="20" fill="currentColor" />
                <rect x="70" y="0" width="2" height="20" fill="currentColor" />
                <rect x="74" y="0" width="1" height="20" fill="currentColor" />
                <rect x="77" y="0" width="4" height="20" fill="currentColor" />
                <rect x="83" y="0" width="2" height="20" fill="currentColor" />
                <rect x="87" y="0" width="1" height="20" fill="currentColor" />
                <rect x="90" y="0" width="3" height="20" fill="currentColor" />
                <rect x="95" y="0" width="2" height="20" fill="currentColor" />
                <rect x="99" y="0" width="1" height="20" fill="currentColor" />
              </svg>
              <span class="font-mono text-[9px] text-neutral-500 tracking-widest">
                ITEMS: {{ cartStore.totalItems }}
              </span>
            </div>

            <!-- Free Shipping Progress -->
            <div class="mt-4">
              <div class="flex justify-between text-[10px] font-mono mb-1">
                <span class="text-neutral-400">ENVÍO GRATUITO ($150 USD)</span>
                <span v-if="cartStore.isFreeShippingEligible" class="text-emerald-400 font-bold">¡ALCANZADO!</span>
                <span v-else class="text-kinetic-cyan">Faltan ${{ cartStore.remainingForFreeShipping.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-neutral-800 h-1 overflow-hidden">
                <div
                  class="h-full bg-kinetic-cyan transition-all duration-300"
                  :style="{ width: `${Math.min(100, (cartStore.subtotal / cartStore.shippingThreshold) * 100)}%` }"
                />
              </div>
            </div>
          </div>

          <!-- Items Scroll Area -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-900">
            <div v-if="cartStore.items.length === 0" class="py-16 text-center">
              <div class="w-12 h-12 border border-dashed border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-500 font-mono">
                00
              </div>
              <p class="font-mono text-sm text-neutral-400 uppercase tracking-widest">
                EL CARRITO ESTÁ VACÍO
              </p>
              <p class="text-xs text-neutral-600 mt-1 font-mono">
                Explora el catálogo para agregar artículos
              </p>
              <NuxtLink
                to="/catalog"
                @click="cartStore.closeCart()"
                class="inline-block mt-6 px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-kinetic-cyan transition-colors"
                data-interactive="true"
                data-tag="EXPLORE_CATALOG"
              >
                IR AL CATÁLOGO
              </NuxtLink>
            </div>

            <div
              v-for="item in cartStore.items"
              :key="item.variantId"
              class="pt-4 first:pt-0 flex space-x-4"
            >
              <!-- Thumbnail -->
              <div class="w-20 h-24 bg-industrial-950 hairline-all overflow-hidden flex-shrink-0 relative">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Item Info -->
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start">
                    <NuxtLink
                      :to="`/products/${item.slug}`"
                      @click="cartStore.closeCart()"
                      class="text-xs font-mono font-bold text-white hover:text-kinetic-cyan line-clamp-1 transition-colors"
                    >
                      {{ item.title }}
                    </NuxtLink>
                    <button
                      @click="cartStore.removeItem(item.variantId)"
                      class="text-neutral-500 hover:text-red-400 font-mono text-xs pl-2"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                  <div class="text-[10px] font-mono text-neutral-500 mt-0.5 space-x-2">
                    <span>SKU: {{ item.sku }}</span>
                    <span v-if="item.size">| SZ: {{ item.size }}</span>
                    <span v-if="item.color">| CLR: {{ item.color }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-3">
                  <!-- Stepper Controls -->
                  <div class="flex items-center hairline-all bg-black">
                    <button
                      @click="cartStore.updateQuantity(item.variantId, -1)"
                      class="w-6 h-6 flex items-center justify-center text-xs font-mono text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      -
                    </button>
                    <span class="w-8 text-center text-xs font-mono text-white">
                      {{ item.quantity }}
                    </span>
                    <button
                      @click="cartStore.updateQuantity(item.variantId, 1)"
                      class="w-6 h-6 flex items-center justify-center text-xs font-mono text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      +
                    </button>
                  </div>

                  <!-- Price -->
                  <div class="text-right">
                    <span class="font-mono text-sm font-bold text-white">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ticket Footer / Summary & Actions -->
          <div v-if="cartStore.items.length > 0" class="p-6 hairline-t bg-industrial-950 space-y-4">
            <!-- Coupon Input -->
            <div class="flex space-x-2">
              <input
                v-model="couponInput"
                placeholder="CÓDIGO (Ej: KINETIC10)"
                class="flex-1 bg-black hairline-all px-3 py-1.5 text-xs font-mono text-white uppercase placeholder-neutral-600 focus:outline-none focus:border-kinetic-cyan"
              />
              <button
                @click="applyCoupon"
                class="px-3 py-1.5 bg-neutral-800 text-white hover:bg-neutral-700 font-mono text-xs tracking-wider"
              >
                APLICAR
              </button>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-1 text-xs font-mono">
              <div class="flex justify-between text-neutral-400">
                <span>SUBTOTAL</span>
                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="cartStore.discountPercent > 0" class="flex justify-between text-emerald-400">
                <span>DESCUENTO ({{ cartStore.discountPercent }}%)</span>
                <span>-${{ cartStore.discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-neutral-400">
                <span>ENVÍO ESTIMADO</span>
                <span>{{ cartStore.shippingCost === 0 ? 'GRATIS' : `$${cartStore.shippingCost.toFixed(2)}` }}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-white pt-2 hairline-t">
                <span>TOTAL FINAL</span>
                <span class="text-kinetic-cyan">${{ cartStore.total.toFixed(2) }} USD</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2 pt-2">
              <!-- Primary Checkout Link -->
              <NuxtLink
                to="/checkout"
                @click="cartStore.closeCart()"
                class="w-full py-3.5 bg-white text-black hover:bg-kinetic-cyan hover:text-black font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 transition-colors"
                data-interactive="true"
                data-tag="CHECKOUT"
              >
                <span>PROCEDER AL CHECKOUT</span>
                <span>→</span>
              </NuxtLink>

              <!-- WhatsApp Direct Express Checkout -->
              <a
                :href="whatsappCheckoutUrl"
                target="_blank"
                class="w-full py-3 bg-[#25D366] text-black font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-[#1ebd5a] transition-colors"
                data-interactive="true"
                data-tag="WHATSAPP_EXPRESS"
              >
                <span>COMPRAR POR WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const couponInput = ref('');



const applyCoupon = () => {
  if (couponInput.value) {
    const success = cartStore.applyCoupon(couponInput.value);
    if (success) {
      couponInput.value = '';
    }
  }
};

const whatsappCheckoutUrl = computed(() => {
  const config = useRuntimeConfig();
  const phone = (config.public.whatsappNumber || '1234567890').replace(/[^0-9]/g, '');

  const itemsList = cartStore.items
    .map(
      (item, idx) =>
        `▪ *[${idx + 1}]* ${item.title}\n  • SKU: \`${item.sku}\`\n  • Talla/Color: ${item.size || 'N/A'} / ${item.color || 'N/A'}\n  • Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = *$${(item.price * item.quantity).toFixed(2)}*`,
    )
    .join('\n\n');

  const message = `⚡ *ORDEN DIRECTA EXPRESS - KINETIC*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *ARTÍCULOS EN CARRITO:*\n\n${itemsList}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💳 *Subtotal:* $${cartStore.subtotal.toFixed(2)}\n` +
    `🚚 *Envío:* $${cartStore.shippingCost.toFixed(2)}\n` +
    `💰 *TOTAL ESTIMADO:* *$${cartStore.total.toFixed(2)} USD*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `ℹ️ *Deseo concretar la compra de estos artículos.*`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});
</script>
