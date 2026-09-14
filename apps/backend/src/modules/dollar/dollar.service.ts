import { Injectable, Logger } from '@nestjs/common';

interface DollarRate {
  moneda: string;
  fuente: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: string;
}

interface CachedRates {
  data: DollarRate[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes — BCV updates once a day anyway

@Injectable()
export class DollarService {
  private readonly logger = new Logger(DollarService.name);
  private cache: CachedRates | null = null;

  async getRates(): Promise<DollarRate[]> {
    // Return cached data if still fresh
    if (this.cache && Date.now() - this.cache.fetchedAt < CACHE_TTL_MS) {
      return this.cache.data;
    }

    try {
      const response = await fetch('https://ve.dolarapi.com/v1/dolares', {
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`DolarAPI responded with status ${response.status}`);
      }

      const data: DollarRate[] = await response.json();
      this.cache = { data, fetchedAt: Date.now() };
      this.logger.log(`Dollar rates refreshed. BCV: ${this.getBcvRate(data)?.promedio} VES/USD`);
      return data;
    } catch (err) {
      this.logger.warn(`Failed to fetch dollar rates: ${err.message}. Returning cached/fallback.`);

      // Return stale cache if available, otherwise hardcoded fallback
      if (this.cache) return this.cache.data;

      return [
        {
          moneda: 'USD',
          fuente: 'oficial',
          nombre: 'Dólar BCV',
          compra: null,
          venta: null,
          promedio: 0,
          fechaActualizacion: new Date().toISOString(),
        },
      ];
    }
  }

  private getBcvRate(rates: DollarRate[]): DollarRate | undefined {
    return rates.find((r) => r.fuente === 'oficial');
  }

  async getSummary() {
    const rates = await this.getRates();
    const bcv = rates.find((r) => r.fuente === 'oficial');
    const paralelo = rates.find((r) => r.fuente === 'paralelo');

    return {
      bcv: {
        rate: bcv?.promedio ?? 0,
        updatedAt: bcv?.fechaActualizacion ?? null,
      },
      paralelo: {
        rate: paralelo?.promedio ?? 0,
        updatedAt: paralelo?.fechaActualizacion ?? null,
      },
      cachedAt: this.cache ? new Date(this.cache.fetchedAt).toISOString() : null,
    };
  }
}
