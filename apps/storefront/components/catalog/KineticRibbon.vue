<template>
  <div class="relative w-full border-t border-neutral-800" @mousemove="onMouseMove">
    <!-- Floating Product Image Preview Following Cursor -->
    <div
      v-if="hoveredProduct"
      class="fixed pointer-events-none z-30 w-64 h-80 bg-black hairline-all overflow-hidden hidden lg:block transition-opacity duration-200 shadow-2xl"
      :style="{
        left: `${mouseX + 25}px`,
        top: `${mouseY - 140}px`,
        opacity: hoveredProduct ? 1 : 0,
      }"
    >
      <img
        :src="hoveredImage"
        :alt="hoveredProduct.title"
        class="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 hover:scale-105"
      />
      <div class="absolute bottom-0 inset-x-0 bg-black/90 p-2.5 hairline-t flex justify-between items-center text-[10px] font-mono">
        <span class="text-white uppercase font-bold">{{ hoveredProduct.category?.name || 'KINETIC' }}</span>
        <span class="text-kinetic-cyan font-mono font-bold">${{ hoveredProduct.variants?.[0]?.price?.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Product Rows -->
    <div
      v-for="(product, idx) in products"
      :key="product.id"
      class="hairline-b group relative"
      @mouseenter="onHover(product)"
      @mouseleave="onLeave"
    >
      <NuxtLink
        :to="`/products/${product.slug}`"
        class="flex flex-col md:flex-row md:items-center justify-between py-6 px-4 md:px-8 group-hover:bg-neutral-900/60 transition-colors"
        data-interactive="true"
        :data-tag="product.title"
      >
        <!-- Left: Index & Title -->
        <div class="flex items-baseline space-x-4 md:space-x-8">
          <span class="font-mono text-xs text-neutral-500 group-hover:text-kinetic-cyan transition-colors">
            [{{ String(idx + 1).padStart(2, '0') }}]
          </span>
          <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-white group-hover:text-kinetic-cyan group-hover:translate-x-2 transition-all">
            {{ product.title }}
          </h3>
        </div>

        <!-- Right: Specs & Price Tag -->
        <div class="flex items-center justify-between md:justify-end space-x-6 mt-3 md:mt-0 font-mono text-xs">
          <span class="text-neutral-500 uppercase tracking-widest text-[10px]">
            {{ product.category?.name }}
          </span>
          <span v-if="product.has3D" class="px-1.5 py-0.5 text-[9px] bg-kinetic-cyan/10 border border-kinetic-cyan text-kinetic-cyan">
            3D MODEL
          </span>
          <span class="text-base font-bold text-white group-hover:text-kinetic-cyan transition-colors">
            ${{ product.variants?.[0]?.price?.toFixed(2) }} USD
          </span>
          <span class="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all">
            →
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  products: any[];
}>();

const hoveredProduct = ref<any | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);

const hoveredImage = computed(() => {
  if (!hoveredProduct.value) return '';
  return hoveredProduct.value.media?.[0]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80';
});

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

const onHover = (product: any) => {
  hoveredProduct.value = product;
};

const onLeave = () => {
  hoveredProduct.value = null;
};
</script>
