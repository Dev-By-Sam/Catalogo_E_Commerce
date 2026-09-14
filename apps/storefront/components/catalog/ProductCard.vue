<template>
  <div class="relative bg-industrial-950 hairline-all group flex flex-col justify-between transition-all duration-300 hover:border-neutral-700">
    <!-- Top Tags Bar -->
    <div class="p-3 hairline-b flex items-center justify-between font-mono text-[10px] text-neutral-500 bg-[#080809]">
      <span class="tracking-widest uppercase truncate max-w-[150px]">
        {{ product.category?.name || 'KINETIC' }}
      </span>
      <div class="flex items-center space-x-2">
        <span v-if="product.has3D" class="text-kinetic-cyan bg-kinetic-cyan/10 px-1 py-0.2 border border-kinetic-cyan/30">
          3D
        </span>
        <!-- Stock Status Pill -->
        <span
          class="w-2 h-2 rounded-full"
          :class="stockStatusColor"
          :title="stockStatusText"
        />
      </div>
    </div>

    <!-- Image Container with Hover Flip -->
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="relative aspect-square w-full bg-industrial-900 overflow-hidden flex items-center justify-center p-4 block"
      data-interactive="true"
      :data-tag="product.title"
    >
      <img
        :src="primaryImage"
        :alt="product.title"
        class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
      />
      <!-- Secondary image reveal on hover -->
      <img
        :src="secondaryImage"
        :alt="product.title"
        class="absolute inset-0 w-full h-full object-cover p-4 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
    </NuxtLink>

    <!-- Product Meta & Actions -->
    <div class="p-4 hairline-t bg-industrial-950 flex flex-col justify-between flex-1">
      <div>
        <div class="font-mono text-[10px] text-neutral-500 tracking-widest mb-1">
          SKU: {{ defaultVariant?.sku || 'N/A' }}
        </div>
        <NuxtLink
          :to="`/products/${product.slug}`"
          class="font-display font-bold text-base text-white hover:text-kinetic-cyan line-clamp-1 transition-colors"
          data-interactive="true"
          :data-tag="product.title"
        >
          {{ product.title }}
        </NuxtLink>
      </div>

      <div class="mt-4 pt-3 hairline-t flex items-center justify-between">
        <!-- Price -->
        <div class="flex items-baseline space-x-2 font-mono">
          <span class="text-sm font-bold text-white">
            ${{ defaultVariant?.price?.toFixed(2) }}
          </span>
          <span
            v-if="defaultVariant?.compareAtPrice"
            class="text-xs text-neutral-600 line-through"
          >
            ${{ defaultVariant.compareAtPrice.toFixed(2) }}
          </span>
        </div>

        <!-- Quick Add Action -->
        <button
          @click.prevent="quickAdd"
          class="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-white hover:text-black transition-colors"
          :disabled="isOutOfStock"
          data-interactive="true"
          data-tag="QUICK_ADD"
        >
          {{ isOutOfStock ? 'AGOTADO' : '+ AGREGAR' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const props = defineProps<{
  product: any;
}>();

const cartStore = useCartStore();

const defaultVariant = computed(() => {
  return props.product.variants?.[0] || null;
});

const isOutOfStock = computed(() => {
  if (!defaultVariant.value) return true;
  return defaultVariant.value.stock <= 0;
});

const stockStatusColor = computed(() => {
  if (!defaultVariant.value || defaultVariant.value.stock <= 0) return 'bg-red-500';
  if (defaultVariant.value.stock <= (defaultVariant.value.minStockAlert || 5)) return 'bg-amber-400';
  return 'bg-emerald-400';
});

const stockStatusText = computed(() => {
  if (!defaultVariant.value || defaultVariant.value.stock <= 0) return 'Agotado';
  if (defaultVariant.value.stock <= 5) return 'Stock bajo';
  return 'Stock óptimo';
});

const primaryImage = computed(() => {
  return props.product.media?.[0]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80';
});

const secondaryImage = computed(() => {
  return props.product.media?.[1]?.url || primaryImage.value;
});

const quickAdd = () => {
  if (!defaultVariant.value || isOutOfStock.value) return;

  cartStore.addItem({
    productId: props.product.id,
    variantId: defaultVariant.value.id,
    title: props.product.title,
    slug: props.product.slug,
    sku: defaultVariant.value.sku,
    size: defaultVariant.value.size,
    color: defaultVariant.value.color,
    price: defaultVariant.value.price,
    quantity: 1,
    image: primaryImage.value,
    stock: defaultVariant.value.stock,
  });
};
</script>
