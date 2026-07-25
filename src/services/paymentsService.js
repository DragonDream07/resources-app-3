import api from './api';

/**
 * POST /payments/initiate
 * Initiates a payment session. The mock adapter returns a simulated gateway
 * response including a mock redirect URL or token.
 */
export async function initiatePayment(payload) {
  const response = await api.post('/payments/initiate', payload);
  return response.data;
}

/**
 * POST /payments/confirm
 * Confirms/captures a payment. The mock adapter surfaces the outcome
 * (success, failure, pending) deterministically based on the payload.
 */
export async function confirmPayment(payload) {
  const response = await api.post('/payments/confirm', payload);
  return response.data;
}
