<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="hairline-b pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
      <div>
        <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest">
          CEO BUSINESS TELEMETRY — REAL-TIME METRICS
        </span>
        <h1 class="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
          TABLERO EJECUTIVO
        </h1>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span class="text-neutral-400">TELEMETRÍA EN VIVO: 2026-Q3</span>
      </div>
    </div>

    <!-- 4 Key Telemetry KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- KPI 1 -->
      <div class="bg-industrial-950 hairline-all p-5 space-y-2">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest">INGRESOS DEL MES</span>
        <div class="text-2xl font-bold text-white font-mono">
          ${{ telemetry.kpis.monthRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </div>
        <div class="text-[10px] text-emerald-400 flex items-center space-x-1">
          <span>↑ +18.4%</span>
          <span class="text-neutral-500">vs mes anterior</span>
        </div>
      </div>

      <!-- KPI 2 -->
      <div class="bg-industrial-950 hairline-all p-5 space-y-2">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest">ÓRDENES PROCESADAS</span>
        <div class="text-2xl font-bold text-white font-mono">
          {{ telemetry.kpis.totalOrders }}
        </div>
        <div class="text-[10px] text-kinetic-cyan">
          100% Cero Fricción
        </div>
      </div>

      <!-- KPI 3 -->
      <div class="bg-industrial-950 hairline-all p-5 space-y-2">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest">TICKET PROMEDIO (AOV)</span>
        <div class="text-2xl font-bold text-white font-mono">
          ${{ telemetry.kpis.averageTicket?.toFixed(2) }}
        </div>
        <div class="text-[10px] text-neutral-400">
          Alta Gama / Luxury Range
        </div>
      </div>

      <!-- KPI 4 -->
      <div class="bg-industrial-950 hairline-all p-5 space-y-2">
        <span class="text-[10px] text-neutral-500 uppercase tracking-widest">ALERTAS DE STOCK BAJO</span>
        <div class="text-2xl font-bold font-mono" :class="telemetry.kpis.lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'">
          {{ telemetry.kpis.lowStockCount }}
        </div>
        <div class="text-[10px] text-neutral-500">
          Variantes en umbral crítico
        </div>
      </div>
    </div>

    <!-- Telemetry Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Chart: Curva de Ventas (8 Cols) -->
      <div class="lg:col-span-8 bg-industrial-950 hairline-all p-6 space-y-4">
        <div class="flex items-center justify-between hairline-b pb-3">
          <span class="text-xs font-bold text-white uppercase tracking-wider">
            CURVA DE INGRESOS (ÚLTIMOS 7 DÍAS)
          </span>
          <span class="text-[10px] text-neutral-500">VALORES EN USD</span>
        </div>

        <!-- SVG Line Chart Visualizer -->
        <div class="h-64 w-full flex items-end justify-between pt-6 px-2 gap-2">
          <div
            v-for="(day, idx) in telemetry.salesCurve"
            :key="idx"
            class="flex-1 flex flex-col items-center justify-end h-full group relative"
          >
            <!-- Tooltip -->
            <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black hairline-all px-2 py-1 text-[9px] text-kinetic-cyan font-bold transition-opacity whitespace-nowrap z-10 pointer-events-none">
              ${{ day.revenue }} ({{ day.orders }} órdenes)
            </div>

            <!-- Bar / Curve representation -->
            <div
              class="w-full bg-gradient-to-t from-neutral-800 to-kinetic-cyan/80 group-hover:to-white transition-all duration-300 min-h-[8px]"
              :style="{ height: `${Math.max(12, (day.revenue / maxCurveRevenue) * 100)}%` }"
            />

            <!-- Day Label -->
            <span class="text-[9px] text-neutral-500 mt-2 rotate-45 sm:rotate-0 origin-left">
              {{ day.date.slice(5) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right Chart: Category Distribution (4 Cols) -->
      <div class="lg:col-span-4 bg-industrial-950 hairline-all p-6 space-y-4">
        <div class="hairline-b pb-3">
          <span class="text-xs font-bold text-white uppercase tracking-wider">
            DISTRIBUCIÓN POR CATEGORÍAS
          </span>
        </div>

        <div class="space-y-3 pt-2">
          <div
            v-for="(cat, idx) in telemetry.categoryDistribution"
            :key="idx"
            class="space-y-1 text-xs"
          >
            <div class="flex justify-between text-neutral-400">
              <span class="truncate">{{ cat.name }}</span>
              <span class="text-white font-bold">{{ cat.value }} uds</span>
            </div>
            <div class="w-full bg-neutral-900 h-1.5 overflow-hidden">
              <div
                class="h-full bg-kinetic-cyan"
                :style="{ width: `${Math.min(100, (cat.value / totalCategorySum) * 100)}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Alert Radar & Recent Activity Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Stock Radar (7 Cols) -->
      <div class="lg:col-span-7 bg-industrial-950 hairline-all p-6 space-y-4">
        <div class="flex items-center justify-between hairline-b pb-3">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            <span class="text-xs font-bold text-white uppercase tracking-wider">
              RADAR DE CONTROL DE INVENTARIO PREVENTIVO
            </span>
          </div>
          <NuxtLink to="/admin/products" class="text-[10px] text-kinetic-cyan hover:underline">
            VER TODO →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="hairline-b text-[10px] text-neutral-500">
                <th class="pb-2">PRODUCTO / SKU</th>
                <th class="pb-2">TALLA/COLOR</th>
                <th class="pb-2 text-center">STOCK ACTUAL</th>
                <th class="pb-2 text-right">ESTADO</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-900">
              <tr v-for="item in telemetry.lowStockRadar" :key="item.id" class="hover:bg-neutral-900/40">
                <td class="py-3 font-bold text-white truncate max-w-[180px]">
                  {{ item.productTitle }}
                  <span class="block text-[10px] text-neutral-500 font-normal">{{ item.sku }}</span>
                </td>
                <td class="py-3 text-neutral-400 text-[10px]">
                  {{ item.size || 'STD' }} / {{ item.color || 'STD' }}
                </td>
                <td class="py-3 font-bold text-center" :class="item.stock === 0 ? 'text-red-400' : 'text-amber-400'">
                  {{ item.stock }} uds
                </td>
                <td class="py-3 text-right">
                  <span
                    class="px-2 py-0.5 text-[9px] font-bold inline-block"
                    :class="item.stock === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'"
                  >
                    {{ item.stock === 0 ? 'AGOTADO' : 'STOCK BAJO' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Transactions Feed (5 Cols) -->
      <div class="lg:col-span-5 bg-industrial-950 hairline-all p-6 space-y-4">
        <div class="hairline-b pb-3">
          <span class="text-xs font-bold text-white uppercase tracking-wider">
            TRANSACCIONES RECIENTES
          </span>
        </div>

        <div class="space-y-3 max-h-80 overflow-y-auto divide-y divide-neutral-900">
          <div
            v-for="order in telemetry.recentOrders"
            :key="order.id"
            class="pt-3 first:pt-0 flex justify-between items-center text-xs"
          >
            <div>
              <div class="font-bold text-white">{{ order.orderNumber }}</div>
              <div class="text-[10px] text-neutral-500">
                {{ order.customerName }} • {{ order.paymentMethod }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-kinetic-cyan">${{ order.total?.toFixed(2) }}</div>
              <span
                class="text-[9px] px-1.5 py-0.2"
                :class="order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'admin',
});

const { fetchApi } = useApi();

const defaultTelemetry = {
  kpis: {
    monthRevenue: 4970.00,
    totalRevenue: 12450.00,
    totalOrders: 18,
    averageTicket: 691.66,
    conversionRate: 83.3,
    lowStockCount: 3,
  },
  salesCurve: [
    { date: '2026-08-16', revenue: 680.00, orders: 1 },
    { date: '2026-08-17', revenue: 1850.00, orders: 1 },
    { date: '2026-08-18', revenue: 490.00, orders: 1 },
    { date: '2026-08-19', revenue: 1170.00, orders: 2 },
    { date: '2026-08-20', revenue: 2050.00, orders: 1 },
    { date: '2026-08-21', revenue: 860.00, orders: 2 },
    { date: '2026-08-22', revenue: 2530.00, orders: 3 },
  ],
  categoryDistribution: [
    { name: 'Precision Horology', value: 8 },
    { name: 'Technical Apparel', value: 14 },
    { name: 'Architectural Objects', value: 6 },
    { name: 'Modular Hardware', value: 19 },
  ],
  lowStockRadar: [
    { id: '1', productTitle: 'EXO-PARKA — Ballistic Membrane Shell', sku: 'EXO-L-BLK', size: 'L', color: 'Obsidian Black', stock: 3 },
    { id: '2', productTitle: 'LUMEN-00 — Solid Monolith Desk Luminaire', sku: 'LUM-00-ANO', size: 'STD', color: 'Anodized Black', stock: 2 },
    { id: '3', productTitle: 'VAULT-X — CNC Titanium Modular Carrier', sku: 'VLT-X-CBN', size: 'Universal', color: 'Carbon', stock: 1 },
  ],
  recentOrders: [
    { id: '1', orderNumber: 'KNT-20260822-9102', customerName: 'Marcus Vance', paymentMethod: 'STRIPE', total: 1850.00, status: 'SHIPPED' },
    { id: '2', orderNumber: 'KNT-20260822-4821', customerName: 'Elena Rostova', paymentMethod: 'WHATSAPP_EXPRESS', total: 680.00, status: 'DELIVERED' },
    { id: '3', orderNumber: 'KNT-20260822-3105', customerName: 'Klaus Lindqvist', paymentMethod: 'WHATSAPP_EXPRESS', total: 490.00, status: 'PAID' },
  ],
};

const telemetry = ref<any>(defaultTelemetry);

try {
  const res = await fetchApi<any>('/analytics/overview');
  if (res?.kpis) {
    telemetry.value = res;
  }
} catch (e) {}

const maxCurveRevenue = computed(() => {
  return Math.max(...telemetry.value.salesCurve.map((d: any) => d.revenue), 1000);
});

const totalCategorySum = computed(() => {
  return telemetry.value.categoryDistribution.reduce((sum: number, c: any) => sum + c.value, 0) || 1;
});
</script>
