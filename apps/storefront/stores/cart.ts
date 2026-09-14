import { defineStore } from 'pinia';

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
    couponCode: '',
    discountPercent: 0,
    shippingThreshold: 150,
    baseShipping: 15,
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    discountAmount(state): number {
      return (this.subtotal * state.discountPercent) / 100;
    },

    shippingCost(): number {
      if (this.subtotal === 0) return 0;
      return this.subtotal >= this.shippingThreshold ? 0 : this.baseShipping;
    },

    total(): number {
      return Math.max(0, this.subtotal - this.discountAmount + this.shippingCost);
    },

    isFreeShippingEligible(): boolean {
      return this.subtotal >= this.shippingThreshold;
    },

    remainingForFreeShipping(): number {
      return Math.max(0, this.shippingThreshold - this.subtotal);
    },
  },

  actions: {
    openCart() {
      this.isOpen = true;
    },

    closeCart() {
      this.isOpen = false;
    },

    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    addItem(item: CartItem) {
      const existing = this.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        const newQty = existing.quantity + item.quantity;
        existing.quantity = Math.min(newQty, item.stock);
      } else {
        this.items.push({ ...item });
      }
      this.openCart();
    },

    updateQuantity(variantId: string, delta: number) {
      const item = this.items.find((i) => i.variantId === variantId);
      if (item) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
          this.removeItem(variantId);
        } else {
          item.quantity = Math.min(newQty, item.stock);
        }
      }
    },

    removeItem(variantId: string) {
      this.items = this.items.filter((i) => i.variantId !== variantId);
    },

    clearCart() {
      this.items = [];
      this.couponCode = '';
      this.discountPercent = 0;
    },

    applyCoupon(code: string): boolean {
      // TODO: Replace with API call to POST /api/coupons/validate
      const cleanCode = code.trim().toUpperCase();
      if (cleanCode === 'KINETIC10' || cleanCode === 'TECH10') {
        this.couponCode = cleanCode;
        this.discountPercent = 10;
        return true;
      }
      if (cleanCode === 'TECH20') {
        this.couponCode = cleanCode;
        this.discountPercent = 20;
        return true;
      }
      return false;
    },
  },

  // pinia-plugin-persistedstate: auto-saves to localStorage
  persist: {
    key: 'kinetic_cart_v2',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['items', 'couponCode', 'discountPercent'],
  },
});
