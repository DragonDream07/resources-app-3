/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that every payment provider adapter must satisfy.
 * Concrete adapters should extend this class (or implement all methods).
 *
 * Method signatures:
 *
 *   initiatePayment(paymentRequest)  → Promise<PaymentInitiateResult>
 *   verifyPayment(paymentId, data)   → Promise<PaymentVerifyResult>
 *   refundPayment(paymentId, amount) → Promise<PaymentRefundResult>
 *   getPaymentStatus(paymentId)      → Promise<PaymentStatusResult>
 *
 * Shape of paymentRequest:
 *   { orderId, amount, currency, method, metadata }
 *
 * Shape of PaymentInitiateResult:
 *   { success, transactionId, redirectUrl, providerReference, raw }
 *
 * Shape of PaymentVerifyResult:
 *   { success, transactionId, status, raw }
 *
 * Shape of PaymentRefundResult:
 *   { success, refundId, status, raw }
 *
 * Shape of PaymentStatusResult:
 *   { success, transactionId, status, raw }
 */
class PaymentAdapterInterface {
  /**
   * Initiate a payment with the provider.
   *
   * @param {Object} paymentRequest
   * @param {string} paymentRequest.orderId
   * @param {number} paymentRequest.amount
   * @param {string} paymentRequest.currency
   * @param {string} paymentRequest.method
   * @param {Object} [paymentRequest.metadata]
   * @returns {Promise<{success: boolean, transactionId: string, redirectUrl: string|null, providerReference: string, raw: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async initiatePayment(paymentRequest) {
    throw new Error('PaymentAdapterInterface.initiatePayment() must be implemented by subclass');
  }

  /**
   * Verify a payment after the provider callback/redirect.
   *
   * @param {string} paymentId  - Internal or provider payment/transaction identifier
   * @param {Object} data       - Raw callback payload from provider
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async verifyPayment(paymentId, data) {
    throw new Error('PaymentAdapterInterface.verifyPayment() must be implemented by subclass');
  }

  /**
   * Refund a previously captured payment.
   *
   * @param {string} paymentId  - Provider transaction/payment identifier
   * @param {number} amount     - Amount to refund (full or partial)
   * @returns {Promise<{success: boolean, refundId: string, status: string, raw: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async refundPayment(paymentId, amount) {
    throw new Error('PaymentAdapterInterface.refundPayment() must be implemented by subclass');
  }

  /**
   * Fetch the current status of a payment from the provider.
   *
   * @param {string} paymentId
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async getPaymentStatus(paymentId) {
    throw new Error('PaymentAdapterInterface.getPaymentStatus() must be implemented by subclass');
  }
}

module.exports = PaymentAdapterInterface;
