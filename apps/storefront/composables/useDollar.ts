import { computed } from 'vue';
import { useApi } from './useApi';

export const useDollar = () => {
  const { fetchApi } = useApi();

  const { data: dollarData, pending: isLoading, refresh: fetchRates } = useAsyncData(
    'dollar-rates',
    () => fetchApi<any>('/dollar/rates'),
    {
      default: () => ({ bcv: { rate: 0 }, paralelo: { rate: 0 }, cachedAt: null }),
    }
  );

  const bcvRate = computed(() => dollarData.value?.bcv?.rate || 0);
  const paraleloRate = computed(() => dollarData.value?.paralelo?.rate || 0);
  const lastUpdated = computed(() => dollarData.value?.bcv?.updatedAt || dollarData.value?.cachedAt || null);

  const toBs = (usd: number, useParalelo = false) => {
    const rate = useParalelo ? paraleloRate.value : bcvRate.value;
    if (!rate) return 0;
    return usd * rate;
  };

  return {
    bcvRate,
    paraleloRate,
    lastUpdated,
    isLoading,
    fetchRates,
    toBs,
  };
};
