<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="hairline-b pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest">
          INVENTARIO & CATÁLOGO — CRUD ENGINE
        </span>
        <h1 class="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
          GESTOR DE PRODUCTOS
        </h1>
      </div>
      <NuxtLink
        to="/admin/products/new"
        class="px-4 py-2.5 bg-white text-black hover:bg-kinetic-cyan hover:text-black text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center space-x-2"
        data-interactive="true"
      >
        <span>+ CREAR NUEVO PRODUCTO</span>
      </NuxtLink>
    </div>

    <!-- Products Table -->
    <div class="bg-industrial-950 hairline-all overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080809] hairline-b text-[10px] text-neutral-500 uppercase tracking-widest">
            <tr>
              <th class="p-4">IMAGEN / TÍTULO</th>
              <th class="p-4">CATEGORÍA</th>
              <th class="p-4">VARIANTES / STOCK</th>
              <th class="p-4">3D / DESTACADO</th>
              <th class="p-4">ESTADO</th>
              <th class="p-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-900">
            <tr v-for="product in products" :key="product.id" class="hover:bg-neutral-900/30">
              <!-- Title & Image -->
              <td class="p-4 flex items-center space-x-3">
                <img
                  :src="product.media?.[0]?.url"
                  :alt="product.title"
                  class="w-12 h-14 object-cover hairline-all bg-black flex-shrink-0"
                />
                <div>
                  <div class="font-bold text-white max-w-xs truncate">{{ product.title }}</div>
                  <div class="text-[10px] text-neutral-500 font-mono">/products/{{ product.slug }}</div>
                </div>
              </td>

              <!-- Category -->
              <td class="p-4 text-neutral-300">
                {{ product.category?.name || 'General' }}
              </td>

              <!-- Variants & Stock -->
              <td class="p-4">
                <div class="space-y-1">
                  <div v-for="v in product.variants" :key="v.id" class="text-[11px] font-mono flex items-center space-x-2">
                    <span class="text-neutral-400 font-bold">{{ v.sku }}:</span>
                    <span class="text-white">${{ v.price }}</span>
                    <span
                      class="px-1.5 py-0.2 text-[9px] font-bold"
                      :class="v.stock === 0 ? 'bg-red-500/20 text-red-400' : v.stock <= 5 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'"
                    >
                      {{ v.stock }} uds
                    </span>
                  </div>
                </div>
              </td>

              <!-- Flags -->
              <td class="p-4 space-y-1">
                <span v-if="product.has3D" class="inline-block px-1.5 py-0.5 text-[9px] bg-kinetic-cyan/10 border border-kinetic-cyan text-kinetic-cyan mr-1">
                  3D VISOR
                </span>
                <span v-if="product.isFeatured" class="inline-block px-1.5 py-0.5 text-[9px] bg-white text-black font-bold">
                  DESTACADO
                </span>
              </td>

              <!-- Active Toggle -->
              <td class="p-4">
                <button
                  @click="toggleActive(product)"
                  class="px-2 py-0.5 text-[10px] font-bold uppercase transition-colors"
                  :class="product.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-800 text-neutral-400'"
                >
                  {{ product.isActive ? 'ACTIVO' : 'PAUSADO' }}
                </button>
              </td>

              <!-- Actions -->
              <td class="p-4 text-right space-x-2">
                <NuxtLink
                  :to="`/admin/products/${product.id}/edit`"
                  class="px-2.5 py-1 bg-neutral-800 text-white hover:bg-neutral-700 text-[10px] uppercase font-bold"
                >
                  EDITAR
                </NuxtLink>
                <button
                  @click="deleteProduct(product.id)"
                  class="px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-800 hover:bg-red-900/60 text-[10px] uppercase font-bold"
                >
                  ELIMINAR
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'admin',
});

const { fetchApi } = useApi();

const defaultProducts = [
  {
    id: '1',
    title: 'CHRONO-01 — Monolith Titanium Instrument',
    slug: 'chrono-01-monolith-titanium-instrument',
    category: { name: 'Precision Horology' },
    has3D: true,
    isFeatured: true,
    isActive: true,
    variants: [
      { id: 'v1', sku: 'CHRN-01-SLV', price: 1850, stock: 8 },
      { id: 'v2', sku: 'CHRN-01-DLC', price: 2050, stock: 4 },
    ],
    media: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' }],
  },
  {
    id: '2',
    title: 'EXO-PARKA — Ballistic Membrane Shell',
    slug: 'exo-parka-ballistic-membrane-shell',
    category: { name: 'Technical Apparel' },
    has3D: true,
    isFeatured: true,
    isActive: true,
    variants: [
      { id: 'v3', sku: 'EXO-M-BLK', price: 680, stock: 15 },
      { id: 'v4', sku: 'EXO-L-BLK', price: 680, stock: 3 },
    ],
    media: [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80' }],
  },
];

const products = ref<any[]>(defaultProducts);

const loadProducts = async () => {
  try {
    const res = await fetchApi<any>('/products/admin/all');
    if (res?.data) products.value = res.data;
  } catch (e) {}
};

const toggleActive = async (product: any) => {
  try {
    await fetchApi(`/products/${product.id}/toggle-active`, { method: 'PATCH' });
    product.isActive = !product.isActive;
  } catch (e) {
    product.isActive = !product.isActive;
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  try {
    await fetchApi(`/products/${id}`, { method: 'DELETE' });
    products.value = products.value.filter((p) => p.id !== id);
  } catch (e) {
    products.value = products.value.filter((p) => p.id !== id);
  }
};

await loadProducts();
</script>
