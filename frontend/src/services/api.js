/**
 * OptiMeal – API Service Layer
 * ================================
 * All backend communication goes through this file.
 * Base URL is configurable via the .env file.
 *
 * Available functions:
 *   predictDemand(item, history, timeSlot)  → POST /api/predict
 *   wasteAnalysis(item, predicted, actual)  → POST /api/waste-analysis
 *   getAllData()                             → GET  /api/data
 *   checkHealth()                           → GET  /health
 *
 * Common integration issues & fixes:
 *  ① CORS error       — Fixed in Flask with flask-cors covering all routes.
 *  ② "Network Error"  — Backend is not running. Start with: python app.py
 *  ③ 415 Unsupported  — Always send Content-Type: application/json (done here).
 *  ④ undefined data   — Response shape is { mode, prediction:{...} }; we unwrap it.
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Axios instance — single source of truth for baseURL, headers, timeout
// ---------------------------------------------------------------------------
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 s — enough for slow dev machines
});

// ---------------------------------------------------------------------------
// Response interceptor — normalize error messages across all calls
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (backend not running)
    if (!error.response) {
      error.message =
        'Cannot reach the backend. Make sure Flask is running on port 5000.';
      return Promise.reject(error);
    }
    // Backend returned a JSON error body — surface it as the error message
    if (error.response.data?.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// predictDemand — POST /api/predict
// ---------------------------------------------------------------------------
/**
 * Send a demand prediction request for a single food item.
 *
 * @param {string}   item      - Food item name (e.g. "Rice")
 * @param {number[]} history   - Array of exactly 7 past-day values [oldest → newest]
 * @param {string}   timeSlot  - "morning" | "lunch" | "evening"
 * @returns {Promise<object>}  - { item, time_slot, recommended_quantity, recommendation, ... }
 */
export const predictDemand = async (item, history, timeSlot) => {
  const response = await api.post('/predict', {
    item,
    history,
    time_slot: timeSlot,   // Flask expects snake_case
  });
  // Backend wraps response: { mode: "single", prediction: { ... } }
  return response.data.prediction;
};

// ---------------------------------------------------------------------------
// wasteAnalysis — POST /api/waste-analysis
// ---------------------------------------------------------------------------
/**
 * Analyze waste for a single food item.
 *
 * @param {string} item       - Food item name
 * @param {number} predicted  - Quantity prepared
 * @param {number} actual     - Quantity consumed
 * @returns {Promise<object>} - { waste_quantity, waste_percentage, efficiency_rate, status, tip }
 */
export const wasteAnalysis = async (item, predicted, actual) => {
  const response = await api.post('/waste-analysis', {
    item,
    predicted: parseFloat(predicted),
    actual:    parseFloat(actual),
  });
  return response.data;
};

// ---------------------------------------------------------------------------
// getAllData — GET /api/data
// ---------------------------------------------------------------------------
/**
 * Fetch the full historical consumption dataset.
 * @returns {Promise<object[]>} - Array of { item, date, time_slot, quantity, actual }
 */
export const getAllData = async () => {
  const response = await api.get('/data');
  return response.data.dataset;
};

// ---------------------------------------------------------------------------
// checkHealth — GET /health  (root-level, NOT under /api)
// ---------------------------------------------------------------------------
/**
 * Ping Flask to verify the backend is reachable.
 * Used by the ConnectionStatus pill in the page header.
 *
 * @returns {Promise<object>} - { status: "healthy", project: "...", version: "..." }
 */
// ---------------------------------------------------------------------------
// checkHealth — GET /health  (root-level, NOT under /api)
// ---------------------------------------------------------------------------
/**
 * Ping Flask to verify the backend is reachable.
 * Used by the ConnectionStatus pill in the page header.
 *
 * @returns {Promise<object>} - { status: "healthy", project: "...", version: "..." }
 */
export const checkHealth = async () => {
  const rootUrl = BASE_URL.replace(/\/api\/?$/, ''); // strip trailing /api
  const response = await axios.get(`${rootUrl}/health`, { timeout: 4000 });
  return response.data;
};

// ---------------------------------------------------------------------------
// getShops — GET /api/shops
// ---------------------------------------------------------------------------
/**
 * Fetch all registered vendor shops.
 * Used by Student Dashboard (browse) and Vendor Dashboard (shop picker).
 *
 * @returns {Promise<object[]>} - Array of shop objects with menu, crowd_level, etc.
 */
export const getShops = async () => {
  const response = await api.get('/shops');
  return response.data.shops;
};

// ---------------------------------------------------------------------------
// getAnalytics — GET /api/analytics
// ---------------------------------------------------------------------------
/**
 * Fetch platform-wide admin analytics.
 * Used by Admin Dashboard.
 *
 * @returns {Promise<object>} - { summary, shop_performance, crowd_distribution }
 */
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export default api;
