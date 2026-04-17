const normalizedBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export const API_BASE_URL = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;
