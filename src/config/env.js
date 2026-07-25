// Environment variable configuration
// Reads from import.meta.env (Vite) and exports typed constants

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

export const IS_PRODUCTION = APP_ENV === 'production';

export const IS_DEVELOPMENT = APP_ENV === 'development';

export const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200';

export const PAYMENT_GATEWAY_KEY = import.meta.env.VITE_PAYMENT_GATEWAY_KEY || '';

export const DEFAULT_PAGE_SIZE = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20;

export const MAX_CART_QUANTITY = Number(import.meta.env.VITE_MAX_CART_QUANTITY) || 10;

export const ENABLE_GUEST_CHECKOUT = import.meta.env.VITE_ENABLE_GUEST_CHECKOUT !== 'false';

export const AUTOCOMPLETE_DEBOUNCE_MS = Number(import.meta.env.VITE_AUTOCOMPLETE_DEBOUNCE_MS) || 300;

export const IMAGE_CDN_BASE_URL = import.meta.env.VITE_IMAGE_CDN_BASE_URL || '';
