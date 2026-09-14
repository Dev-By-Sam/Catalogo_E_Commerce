<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
    <!-- Catalog Header & Telemetry Bar -->
    <div class="hairline-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="font-mono text-[10px] text-kinetic-cyan tracking-widest uppercase">
          INVENTARIO GENERAL — CATALOG VIEW
        </div>
        <h1 class="text-3xl sm:text-4xl font-display font-black text-white uppercase mt-1">
          CATÁLOGO DE PRODUCTOS
        </h1>
      </div>

      <!-- Controls & View Mode Switcher -->
      <div class="flex items-center space-x-4">
        <!-- Live Counter -->
        <span class="font-mono text-xs text-neutral-400">
          [{{ products.length }} OBJETOS DISPONIBLES]
        </span>

        <!-- View Mode Switcher -->
        <div class="flex items-center bg-black hairline-all p-1">
          <button
            @click="viewMode = 'grid'"
            class="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors"
            :class="viewMode === 'grid' ? 'bg-white text-black font-bold' : 'text-neutral-500 hover:text-white'"
            data-interactive="true"
            data-tag="VIEW_GRID"
          >
            GRILLA
          </button>
          <button
            @click="viewMode = 'list'"
            class="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors"
            :class="viewMode === 'list' ? 'bg-white text-black font-bold' : 'text-neutral-500 hover:text-white'"
            data-interactive="true"
            data-tag="VIEW_LIST"
          >
            LISTA CINÉTICA
          </button>
        </div>
      </div>
    </div>

    <!-- Main Layout: Filters Column + Product Display -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      <!-- Left: Filter Panel -->
      <div class="lg:col-span-3">
        <FilterDrawer
          :categories="categories"
          :initialCategory="filterCategory"
          @filter-change="onFilterChange"
        />
      </div>

      <!-- Right: Product Grid or Kinetic List -->
      <div class="lg:col-span-9">
        <!-- Empty State -->
        <div v-if="products.length === 0" class="p-16 bg-industrial-950 hairline-all text-center">
          <div class="w-12 h-12 border border-dashed border-neutral-700 flex items-center justify-center mx-auto mb-4 font-mono text-neutral-500">
            00
          </div>
          <h3 class="font-display font-bold text-white text-lg uppercase">
            No se encontraron productos coincidentes
          </h3>
          <p class="font-mono text-xs text-neutral-500 mt-2">
            Prueba ajustando los filtros de precio o el término de búsqueda.
          </p>
        </div>

        <!-- Grid View -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Kinetic List View -->
        <div v-else class="bg-industrial-950 hairline-all">
          <KineticRibbon :products="products" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';
import FilterDrawer from '~/components/catalog/FilterDrawer.vue';
import ProductCard from '~/components/catalog/ProductCard.vue';
import KineticRibbon from '~/components/catalog/KineticRibbon.vue';

const route = useRoute();
const { fetchApi } = useApi();

const viewMode = ref<'grid' | 'list'>('grid');

// Individual primitive refs — avoids object identity churn that triggers infinite watch loops
const filterSearch   = ref<string>('');
const filterCategory = ref<string>((route.query.category as string) || '');
const filterMaxPrice = ref<number | undefined>(undefined);
const filterInStock  = ref<boolean | undefined>(undefined);
const filterSort     = ref<string>('newest');

const { data: categoriesData } = await useAsyncData(
  'catalog-categories',
  () => fetchApi<any[]>('/categories'),
  { default: () => [] },
);
const categories = computed(() => categoriesData.value || []);

const { data: productsData, refresh: refreshProducts } = await useAsyncData(
  'catalog-products',
  async () => {
    const params: Record<string, any> = {};
    if (filterSearch.value)   params.search   = filterSearch.value;
    if (filterCategory.value) params.category  = filterCategory.value;
    if (filterMaxPrice.value) params.maxPrice  = filterMaxPrice.value;
    if (filterInStock.value)  params.inStock   = filterInStock.value;
    if (filterSort.value)     params.sort      = filterSort.value;
    const res = await fetchApi<any>('/products', { params });
    return res?.data ?? [];
  },
  { default: () => [] },
);
const products = computed(() => productsData.value || []);

// FilterDrawer emits a change → update primitives, then fire ONE refresh
const onFilterChange = (filters: any) => {
  filterSearch.value   = filters.search   ?? '';
  filterCategory.value = filters.category ?? '';
  filterMaxPrice.value = filters.maxPrice  ?? undefined;
  filterInStock.value  = filters.inStock   ?? undefined;
  filterSort.value     = filters.sort      ?? 'newest';
  refreshProducts();
};

// Keep in sync when navigating via URL query param (e.g. category links)
watch(
  () => route.query.category as string,
  (newCat) => {
    filterCategory.value = newCat || '';
    refreshProducts();
  },
);
</script>
