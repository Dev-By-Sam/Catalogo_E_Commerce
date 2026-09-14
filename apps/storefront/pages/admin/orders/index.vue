<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="hairline-b pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-[10px] text-kinetic-cyan uppercase tracking-widest">
          BANDEJA DE DESPACHO & PEDIDOS — FULFILLMENT
        </span>
        <h1 class="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
          GESTIÓN DE PEDIDOS
        </h1>
      </div>

      <!-- Filter by status -->
      <div class="flex items-center space-x-2 text-xs">
        <span class="text-neutral-500 uppercase text-[10px]">ESTADO:</span>
        <select
          v-model="statusFilter"
          @change="loadOrders"
          class="bg-black hairline-all px-3 py-1.5 text-white text-xs focus:outline-none focus:border-kinetic-cyan"
        >
          <option value="">TODOS LOS ESTADOS</option>
          <option value="PENDING">PENDIENTES</option>
          <option value="PAID">PAGADOS</option>
          <option value="SHIPPED">ENVIADOS</option>
          <option value="DELIVERED">ENTREGADOS</option>
          <option value="CANCELLED">CANCELADOS</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-industrial-950 hairline-all overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080809] hairline-b text-[10px] text-neutral-500 uppercase tracking-widest">
            <tr>
              <th class="p-4">ORDEN / FECHA</th>
              <th class="p-4">CLIENTE / DESTINO</th>
              <th class="p-4">MÉTODO PAGO</th>
              <th class="p-4">TOTAL ($)</th>
              <th class="p-4">ESTADO LOGÍSTICO</th>
              <th class="p-4 text-right">CAMBIAR ESTADO</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-900">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-neutral-900/30">
              <!-- Order Number -->
              <td class="p-4 font-mono">
                <div class="font-bold text-white">{{ order.orderNumber }}</div>
                <div class="text-[10px] text-neutral-500">{{ order.createdAt?.slice(0, 10) || '2026-08-22' }}</div>
              </td>

              <!-- Customer -->
              <td class="p-4">
                <div class="font-bold text-white">{{ order.customerName }}</div>
                <div class="text-[10px] text-neutral-400">{{ order.shippingCity }}, {{ order.shippingCountry }}</div>
                <div class="text-[10px] text-neutral-500">{{ order.customerPhone }}</div>
              </td>

              <!-- Payment Method -->
              <td class="p-4">
                <span
                  class="px-2 py-0.5 text-[10px] font-bold"
                  :class="order.paymentMethod === 'WHATSAPP_EXPRESS' ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'"
                >
                  {{ order.paymentMethod }}
                </span>
              </td>

              <!-- Total -->
              <td class="p-4 font-bold text-white font-mono text-sm">
                ${{ order.total?.toFixed(2) }}
              </td>

              <!-- Current Status -->
              <td class="p-4">
                <span
                  class="px-2 py-1 text-[10px] font-bold inline-block"
                  :class="getStatusBadgeClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>

              <!-- Quick Status Updater -->
              <td class="p-4 text-right">
                <select
                  :value="order.status"
                  @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                  class="bg-black hairline-all px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-kinetic-cyan cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
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
const statusFilter = ref('');

const defaultOrders = [
  {
    id: '1',
    orderNumber: 'KNT-20260822-9102',
    customerName: 'Marcus Vance',
    customerPhone: '+49 176 882910',
    shippingCity: 'Berlin',
    shippingCountry: 'Germany',
    paymentMethod: 'STRIPE',
    total: 1850.00,
    status: 'SHIPPED',
    createdAt: '2026-08-22',
  },
  {
    id: '2',
    orderNumber: 'KNT-20260822-4821',
    customerName: 'Elena Rostova',
    customerPhone: '+41 79 1234567',
    shippingCity: 'Zurich',
    shippingCountry: 'Switzerland',
    paymentMethod: 'WHATSAPP_EXPRESS',
    total: 680.00,
    status: 'DELIVERED',
    createdAt: '2026-08-22',
  },
  {
    id: '3',
    orderNumber: 'KNT-20260822-3105',
    customerName: 'Klaus Lindqvist',
    customerPhone: '+46 8 555 0192',
    shippingCity: 'Stockholm',
    shippingCountry: 'Sweden',
    paymentMethod: 'WHATSAPP_EXPRESS',
    total: 490.00,
    status: 'PAID',
    createdAt: '2026-08-22',
  },
];

const orders = ref<any[]>(defaultOrders);

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    case 'PAID':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    case 'SHIPPED':
      return 'bg-kinetic-cyan/20 text-kinetic-cyan border border-kinetic-cyan/40';
    case 'DELIVERED':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border border-red-500/40';
    default:
      return 'bg-neutral-800 text-neutral-400';
  }
};

const loadOrders = async () => {
  try {
    const params = statusFilter.value ? { status: statusFilter.value } : {};
    const res = await fetchApi<any>('/orders/admin/all', { params });
    if (res?.data) {
      orders.value = res.data;
    }
  } catch (e) {}
};

const updateStatus = async (orderId: string, newStatus: string) => {
  try {
    await fetchApi(`/orders/admin/${orderId}/status`, {
      method: 'PATCH',
      body: { status: newStatus },
    });
    const item = orders.value.find((o) => o.id === orderId);
    if (item) item.status = newStatus;
  } catch (e) {
    const item = orders.value.find((o) => o.id === orderId);
    if (item) item.status = newStatus;
  }
};

await loadOrders();
</script>
