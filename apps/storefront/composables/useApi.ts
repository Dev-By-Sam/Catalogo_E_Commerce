export const useApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl || 'http://localhost:4000/api';

  const fetchApi = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      params?: any;
      headers?: Record<string, string>;
    } = {},
  ): Promise<T> => {
    const authCookie = useCookie('kinetic_auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authCookie.value) {
      headers['Authorization'] = `Bearer ${authCookie.value}`;
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    return $fetch<T>(`${baseUrl}${cleanEndpoint}`, {
      method: options.method || 'GET',
      body: options.body,
      params: options.params,
      headers,
    });
  };

  return {
    fetchApi,
    baseUrl,
  };
};
