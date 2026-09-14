<template>
  <div class="bg-industrial-950 hairline-all p-6 space-y-6 select-none font-mono text-xs">
    <!-- Header -->
    <div class="flex items-center justify-between hairline-b pb-3">
      <span class="text-[10px] text-kinetic-cyan font-bold tracking-widest uppercase">
        FILTROS & TELEMETRÍA
      </span>
      <button
        @click="resetFilters"
        class="text-neutral-500 hover:text-white text-[10px] tracking-wider uppercase"
      >
        [RESETEAR]
      </button>
    </div>

    <!-- Search Input with Debouncing -->
    <div class="space-y-2">
      <label class="text-[10px] text-neutral-400 tracking-widest uppercase block">
        BÚSQUEDA PREDICTIVA (TÍTULO / SKU)
      </label>
      <div class="relative">
        <input
          v-model="searchInput"
          @input="handleSearch"
          placeholder="Buscar..."
          class="w-full bg-black hairline-all px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-kinetic-cyan"
        />
        <span v-if="searchInput" @click="clearSearch" class="absolute right-2 top-2.5 text-neutral-500 hover:text-white cursor-pointer">
          ✕
        </span>
      </div>
    </div>

    <!-- Categories List -->
    <div class="space-y-2">
      <label class="text-[10px] text-neutral-400 tracking-widest uppercase block">
        CATEGORÍAS
      </label>
      <div class="space-y-1">
        <button
          @click="selectCategory('')"
          class="w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between"
          :class="!selectedCategory ? 'bg-neutral-800 text-kinetic-cyan font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'"
        >
          <span>[TODAS LAS COLECCIONES]</span>
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.slug)"
          class="w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between"
          :class="selectedCategory === cat.slug ? 'bg-neutral-800 text-kinetic-cyan font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'"
        >
          <span>{{ cat.name }}</span>
          <span class="text-[10px] text-neutral-600">({{ cat._count?.products || 0 }})</span>
        </button>
      </div>
    </div>

    <!-- Price Range Slider -->
    <div class="space-y-2">
      <div class="flex justify-between items-center text-[10px] text-neutral-400 tracking-widest uppercase">
        <span>PRECIO MÁXIMO</span>
        <span class="text-white font-bold">${{ maxPrice }} USD</span>
      </div>
      <input
        type="range"
        min="100"
        max="3000"
        step="50"
        v-model.number="maxPrice"
        @change="emitFilters"
        class="w-full accent-kinetic-cyan bg-neutral-800 cursor-pointer"
      />
    </div>

    <!-- Stock Only Switch -->
    <div class="pt-2">
      <label class="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          v-model="inStockOnly"
          @change="emitFilters"
          class="w-4 h-4 rounded-none accent-kinetic-cyan bg-black border-neutral-800"
        />
        <span class="text-neutral-300 text-[11px] uppercase tracking-wider">SOLO EN STOCK</span>
      </label>
    </div>

    <!-- Sort Order -->
    <div class="space-y-2 pt-2">
      <label class="text-[10px] text-neutral-400 tracking-widest uppercase block">
        ORDENAMIENTO
      </label>
      <select
        v-model="selectedSort"
        @change="emitFilters"
        class="w-full bg-black hairline-all px-3 py-2 text-white text-xs focus:outline-none focus:border-kinetic-cyan"
      >
        <option value="newest">MÁS RECIENTES</option>
        <option value="price_asc">PRECIO: MENOR A MAYOR</option>
        <option value="price_desc">PRECIO: MAYOR A MENOR</option>
        <option value="featured">DESTACADOS</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  categories: any[];
  initialCategory?: string;
}>();

const emit = defineEmits(['filter-change']);

const searchInput = ref('');
const selectedCategory = ref(props.initialCategory || '');
const maxPrice = ref(3000);
const inStockOnly = ref(false);
const selectedSort = ref('newest');

let debounceTimer: any = null;

const handleSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emitFilters();
  }, 350);
};

const clearSearch = () => {
  searchInput.value = '';
  emitFilters();
};

const selectCategory = (slug: string) => {
  selectedCategory.value = slug;
  emitFilters();
};

const resetFilters = () => {
  searchInput.value = '';
  selectedCategory.value = '';
  maxPrice.value = 3000;
  inStockOnly.value = false;
  selectedSort.value = 'newest';
  emitFilters();
};

const emitFilters = () => {
  emit('filter-change', {
    search: searchInput.value,
    category: selectedCategory.value,
    maxPrice: maxPrice.value,
    inStock: inStockOnly.value ? true : undefined,
    sort: selectedSort.value,
  });
};

watch(
  () => props.initialCategory,
  (val) => {
    selectedCategory.value = val || '';
    emitFilters();
  },
);
</script>
