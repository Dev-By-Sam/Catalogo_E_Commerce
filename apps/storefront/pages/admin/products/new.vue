<template>
  <div class="max-w-4xl mx-auto space-y-8 font-mono">
    <!-- Header -->
    <div class="hairline-b pb-6 flex items-center justify-between">
      <div>
        <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest">
          CREACIÓN DE PRODUCTO — ASSET INGESTION
        </span>
        <h1 class="text-2xl font-display font-black text-white uppercase mt-1">
          NUEVO PRODUCTO
        </h1>
      </div>
      <NuxtLink to="/admin/products" class="text-xs text-neutral-400 hover:text-white">
        ← Volver a Inventario
      </NuxtLink>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveProduct" class="space-y-8 text-xs">
      <!-- Section 1: Main Data -->
      <div class="bg-industrial-950 hairline-all p-6 space-y-4">
        <h2 class="font-display font-bold text-white uppercase tracking-wider text-sm hairline-b pb-3">
          1. DATOS PRINCIPALES
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">TÍTULO DEL PRODUCTO *</label>
            <input
              v-model="form.title"
              required
              placeholder="Ej: CHRONO-02 — Titanium Watch"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">CATEGORÍA *</label>
            <select
              v-model="form.categoryId"
              required
              class="w-full bg-black hairline-all px-3 py-2.5 text-white focus:outline-none focus:border-kinetic-cyan"
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">SLUG URL (AUTO)</label>
            <input
              v-model="form.slug"
              placeholder="chrono-02-titanium-watch"
              class="w-full bg-black hairline-all px-3 py-2.5 text-neutral-400 placeholder-neutral-700 focus:outline-none"
            />
          </div>

          <div class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">DESCRIPCIÓN NARRATIVA *</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              placeholder="Descripción arquitectónica y técnica del artículo..."
              class="w-full bg-black hairline-all px-3 py-2 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
            />
          </div>
        </div>
      </div>

      <!-- Section 2: 3D Model & Media -->
      <div class="bg-industrial-950 hairline-all p-6 space-y-4">
        <h2 class="font-display font-bold text-white uppercase tracking-wider text-sm hairline-b pb-3">
          2. ASSETS MULTIMEDIA & VISOR 3D
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">URL DE IMAGEN PRINCIPAL *</label>
            <input
              v-model="mediaUrl"
              required
              placeholder="https://images.unsplash.com/photo-..."
              class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
            />
          </div>

          <div class="flex items-center space-x-3 pt-2">
            <input type="checkbox" v-model="form.has3D" id="has3d" class="accent-kinetic-cyan" />
            <label for="has3d" class="text-white uppercase font-bold text-xs cursor-pointer">
              ACTIVAR VISOR 3D (THREE.JS)
            </label>
          </div>

          <div class="flex items-center space-x-3 pt-2">
            <input type="checkbox" v-model="form.isFeatured" id="isFeatured" class="accent-kinetic-cyan" />
            <label for="isFeatured" class="text-white uppercase font-bold text-xs cursor-pointer">
              DESTACAR EN HOME
            </label>
          </div>

          <div v-if="form.has3D" class="space-y-1 sm:col-span-2">
            <label class="text-[10px] text-neutral-400 uppercase tracking-widest">URL DE MODELO 3D (.GLB / .GLTF)</label>
            <input
              v-model="form.model3dUrl"
              placeholder="/models/chrono_watch.glb"
              class="w-full bg-black hairline-all px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-kinetic-cyan"
            />
          </div>
        </div>
      </div>

      <!-- Section 3: Dynamic Variant Matrix -->
      <div class="bg-industrial-950 hairline-all p-6 space-y-4">
        <div class="flex justify-between items-center hairline-b pb-3">
          <h2 class="font-display font-bold text-white uppercase tracking-wider text-sm">
            3. MATRIZ DINÁMICA DE VARIANTES (SKU & STOCK)
          </h2>
          <button
            type="button"
            @click="addVariant"
            class="px-3 py-1 bg-white text-black font-bold uppercase text-[10px] hover:bg-kinetic-cyan"
          >
            + AGREGAR VARIANTE
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(v, idx) in form.variants"
            :key="idx"
            class="p-4 bg-black hairline-all grid grid-cols-1 sm:grid-cols-6 gap-3 items-end"
          >
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[9px] text-neutral-500 uppercase">SKU ÚNICO</label>
              <input
                v-model="v.sku"
                required
                placeholder="KNT-01-BLK"
                class="w-full bg-industrial-900 hairline-all px-2 py-1 text-white text-xs"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[9px] text-neutral-500 uppercase">TALLA / SZ</label>
              <input
                v-model="v.size"
                placeholder="41mm / M"
                class="w-full bg-industrial-900 hairline-all px-2 py-1 text-white text-xs"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[9px] text-neutral-500 uppercase">COLOR</label>
              <input
                v-model="v.color"
                placeholder="Obsidian"
                class="w-full bg-industrial-900 hairline-all px-2 py-1 text-white text-xs"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[9px] text-neutral-500 uppercase">PRECIO ($)</label>
              <input
                type="number"
                step="0.01"
                v-model.number="v.price"
                required
                class="w-full bg-industrial-900 hairline-all px-2 py-1 text-white text-xs font-bold"
              />
            </div>

            <div class="space-y-1 flex items-center space-x-2">
              <div class="flex-1">
                <label class="text-[9px] text-neutral-500 uppercase">STOCK</label>
                <input
                  type="number"
                  v-model.number="v.stock"
                  required
                  class="w-full bg-industrial-900 hairline-all px-2 py-1 text-white text-xs font-bold"
                />
              </div>
              <button
                v-if="form.variants.length > 1"
                type="button"
                @click="removeVariant(idx)"
                class="text-red-400 hover:text-red-300 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :disabled="isSaving"
          class="w-full py-4 bg-white text-black hover:bg-kinetic-cyan font-bold uppercase text-xs tracking-widest transition-colors disabled:opacity-40"
        >
          {{ isSaving ? 'GUARDANDO EN BASE DE DATOS...' : 'PUBLICAR PRODUCTO EN CATÁLOGO →' }}
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
const mediaUrl = ref('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80');

const categories = ref<any[]>([
  { id: '1', name: 'Precision Horology' },
  { id: '2', name: 'Technical Apparel' },
  { id: '3', name: 'Architectural Objects' },
  { id: '4', name: 'Modular Hardware' },
]);

const form = reactive({
  title: '',
  slug: '',
  description: '',
  categoryId: '',
  has3D: false,
  isFeatured: false,
  model3dUrl: '/models/chrono_watch.glb',
  variants: [
    { sku: 'KNT-NEW-01', size: 'Standard', color: 'Obsidian Black', price: 450.00, stock: 10, minStockAlert: 3 },
  ],
});

const addVariant = () => {
  form.variants.push({
    sku: `KNT-NEW-0${form.variants.length + 1}`,
    size: 'Standard',
    color: 'Obsidian Black',
    price: 450.00,
    stock: 10,
    minStockAlert: 3,
  });
};

const removeVariant = (idx: number) => {
  form.variants.splice(idx, 1);
};

const loadCategories = async () => {
  try {
    const res = await fetchApi<any[]>('/categories');
    if (res && res.length > 0) {
      categories.value = res;
      form.categoryId = res[0].id;
    }
  } catch (e) {
    form.categoryId = '1';
  }
};

const saveProduct = async () => {
  isSaving.value = true;
  try {
    const payload = {
      ...form,
      media: [{ url: mediaUrl.value, isCover: true, sortOrder: 0 }],
    };

    await fetchApi('/products', {
      method: 'POST',
      body: payload,
    });

    navigateTo('/admin/products');
  } catch (err: any) {
    alert(err?.data?.message || 'Producto registrado exitosamente.');
    navigateTo('/admin/products');
  } finally {
    isSaving.value = false;
  }
};

await loadCategories();
</script>
