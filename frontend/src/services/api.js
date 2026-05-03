import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Cannot reach the backend. Make sure Flask is running on port 5000.';
      return Promise.reject(error);
    }
    if (error.response.data?.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

// --- ORDER ENDPOINTS (Student -> Vendor -> Admin) ---

/**
 * Step 1: Student places order
 * @param {object} orderData - { student_id, vendor_id, items, pickup_slot, is_express }
 */
export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Step 3: Vendor receives orders
 * @param {string|number} vendorId
 */
export const getVendorOrders = async (vendorId) => {
  const response = await api.get(`/vendor/orders?vendor_id=${vendorId}`);
  return response.data;
};

/**
 * Step 4: Vendor updates status
 * @param {number} orderId
 * @param {string} status - 'preparing', 'ready', 'completed'
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

/**
 * Step 5: Student tracks order
 * @param {number} orderId
 */
export const trackOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Step 6: Admin Dashboard data
 */
export const getAdminDashboardData = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// --- PREVIOUS ANALYTICS ENDPOINTS (Keeping for compatibility) ---

export const predictDemand = async (item, history, timeSlot) => {
  const response = await api.post('/predict', { item, history, time_slot: timeSlot });
  return response.data.prediction;
};

export const wasteAnalysis = async (item, predicted, actual) => {
  const response = await api.post('/waste-analysis', { item, predicted, actual });
  return response.data;
};

export const checkHealth = async () => {
  const rootUrl = BASE_URL.replace(/\/api\/?$/, '');
  const response = await axios.get(`${rootUrl}/health`, { timeout: 4000 });
  return response.data;
};

export default api;
