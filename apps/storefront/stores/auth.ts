import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { useApi } from '~/composables/useApi';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: useCookie('kinetic_auth_token').value || '',
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    setAuth(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      const cookie = useCookie('kinetic_auth_token', { maxAge: 60 * 60 * 24 * 7 });
      cookie.value = token;
    },

    logout() {
      this.token = '';
      this.user = null;
      const cookie = useCookie('kinetic_auth_token');
      cookie.value = null;
      // Use window.location in browser to ensure full reload, navigateTo in SSR
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      } else {
        navigateTo('/admin/login');
      }
    },

    async fetchProfile() {
      if (!this.token) return;
      try {
        const { fetchApi } = useApi();
        const data = await fetchApi<AuthUser>('/auth/me');
        this.user = data;
      } catch (err) {
        this.logout();
      }
    },
  },
});
