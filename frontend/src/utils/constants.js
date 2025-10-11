// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API Endpoints
export const API_ENDPOINTS = {
  TELEMETRY_QUERY_1: `${API_BASE_URL}/telemetry-query-1`,
  TELEMETRY_QUERY_2: `${API_BASE_URL}/telemetry-query-2`,
  MORTALITY_QUERY_1: `${API_BASE_URL}/mortality-query-1`,
  MORTALITY_QUERY_2: `${API_BASE_URL}/mortality-query-2`,
};

// Map Configuration
export const MAP_CONFIG = {
  CENTER: [26.23, -81.59], // Southwest Florida
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 8,
  MAX_ZOOM: 18,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Heatmap Configuration
export const HEATMAP_CONFIG = {
  RADIUS: 20,
  BLUR: 20,
  MAX_ZOOM: 18,
  MIN_OPACITY: 0.3,
  GRADIENT: {
    0.2: 'blue',
    0.4: 'cyan',
    0.6: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  },
};

// Clustering Configuration
export const CLUSTER_CONFIG = {
  DISABLED_AT_ZOOM: 16,
  CHUNK_DELAY: 200,
  MAX_CLUSTER_RADIUS: 80,
  SPINNER_OPTIONS: {
    LINES: 13,
    LENGTH: 20,
    WIDTH: 10,
    RADIUS: 30,
  },
};

// Filter Constraints
export const FILTER_CONSTRAINTS = {
  MIN_AGE: 0,
  MAX_AGE: 25,
  MIN_YEAR: 1949,
  MAX_YEAR: new Date().getFullYear(),
};

// Sex Options
export const SEX_OPTIONS = [
  { value: '', label: 'Select Sex' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#FFD700',
  SECONDARY: '#FF6B6B',
  TERTIARY: '#4ECDC4',
  BACKGROUND: '#1a1a2e',
  TEXT: '#ffffff',
};

// Breakpoints (mobile-first)
export const BREAKPOINTS = {
  MOBILE: '320px',
  TABLET: '768px',
  DESKTOP: '1024px',
  WIDE: '1440px',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please fill in all required fields.',
  NO_DATA: 'No data found for the selected filters.',
  GENERIC: 'An error occurred. Please try again.',
};

// Loading Messages
export const LOADING_MESSAGES = {
  FETCHING_DATA: 'Loading data...',
  PROCESSING: 'Processing...',
  RENDERING_MAP: 'Rendering map...',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  MORTALITY: '/mortality',
  TELEMETRY: '/telemetry',
  NOT_FOUND: '*',
};
