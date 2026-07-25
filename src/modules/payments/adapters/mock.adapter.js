const PaymentAdapterInterface = require('./payment.adapter.interface');

/**
 * MockAdapter
 *
 * Test-mode payment adapter that returns configurable success / failure
 * responses without making any real external calls.
 *
 * Usage:
 *   const adapter = new MockAdapter();               // defaults to success
 *   const adapter = new MockAdapter({ shouldFail: true, failureReason: 'Insufficient funds' });
 *
 * Options:
 *   shouldFail      {boolean}  – When true every method returns a failure response. Default: false
 *   failureReason   {string}   – Error message included in failure responses.
 *   delay           {number}   – Artificial latency in ms (simulates network). Default: 0
 *   fixedTransactionId {string} – Override auto-generated transaction id. Default: null
 *   fixedRefundId      {string} – Override auto-generated refund id.      Default: null
 */
class MockAdapter extends PaymentAdapterInterface {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.shouldFail=false]
   * @param {string}  [options.failureReason='Mock payment failure']
   * @param {number}  [options.delay=0]
   * @param {string|null} [options.fixedTransactionId=null]
   * @param {string|null} [options.fixedRefundId=null]
   */
  constructor(options = {}) {
    super();
    this.shouldFail = options.shouldFail === true;
    this.failureReason = options.failureReason || 'Mock payment failure';
    this.delay = typeof options.delay === 'number' ? options.delay : 0;
    this.fixedTransactionId = options.fixedTransactionId || null;
    this.fixedRefundId = options.fixedRefundId || null;
    this._counter = 0;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  _nextId(prefix) {
    this._counter += 1;
    return `${prefix}_mock_${this._counter}`;
  }

  async _simulate() {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
  }

  _transactionId() {
    return this.fixedTransactionId || this._nextId('txn');
  }

  _refundId() {
    return this.fixedRefundId || this._nextId('rfnd');
  }

  // ---------------------------------------------------------------------------
  // Interface implementation
  // ---------------------------------------------------------------------------

  /**
   * Initiate a payment.
   *
   * @param {Object} paymentRequest
   * @returns {Promise<{success: boolean, transactionId: string, redirectUrl: string|null, providerReference: string, raw: Object}>}
   */
  async initiatePayment(paymentRequest) {
    await this._simulate();

    if (this.shouldFail) {
      return {
        success: false,
        transactionId: null,
        redirectUrl: null,
        providerReference: null,
        raw: {
          error: this.failureReason,
          request: paymentRequest,
        },
      };
    }

    const transactionId = this._transactionId();
    return {
      success: true,
      transactionId,
      redirectUrl: null,
      providerReference: `mock_ref_${transactionId}`,
      raw: {
        provider: 'mock',
        request: paymentRequest,
        transactionId,
      },
    };
  }

  /**
   * Verify a payment.
   *
   * @param {string} paymentId
   * @param {Object} data
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: Object}>}
   */
  async verifyPayment(paymentId, data) {
    await this._simulate();

    if (this.shouldFail) {
      return {
        success: false,
        transactionId: paymentId,
        status: 'failed',
        raw: {
          error: this.failureReason,
          data,
        },
      };
    }

    return {
      success: true,
      transactionId: paymentId,
      status: 'captured',
      raw: {
        provider: 'mock',
        paymentId,
        data,
      },
    };
  }

  /**
   * Refund a payment.
   *
   * @param {string} paymentId
   * @param {number} amount
   * @returns {Promise<{success: boolean, refundId: string, status: string, raw: Object}>}
   */
  async refundPayment(paymentId, amount) {
    await this._simulate();

    if (this.shouldFail) {
      return {
        success: false,
        refundId: null,
        status: 'failed',
        raw: {
          error: this.failureReason,
          paymentId,
          amount,
        },
      };
    }

    const refundId = this._refundId();
    return {
      success: true,
      refundId,
      status: 'refunded',
      raw: {
        provider: 'mock',
        paymentId,
        amount,
        refundId,
      },
    };
  }

  /**
   * Get payment status.
   *
   * @param {string} paymentId
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: Object}>}
   */
  async getPaymentStatus(paymentId) {
    await this._simulate();

    if (this.shouldFail) {
      return {
        success: false,
        transactionId: paymentId,
        status: 'unknown',
        raw: {
          error: this.failureReason,
          paymentId,
        },
      };
    }

    return {
      success: true,
      transactionId: paymentId,
      status: 'captured',
      raw: {
        provider: 'mock',
        paymentId,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Test helpers
  // ---------------------------------------------------------------------------

  /**
   * Reconfigure the adapter between tests without creating a new instance.
   *
   * @param {Object} options
   */
  configure(options = {}) {
    if (typeof options.shouldFail === 'boolean') {
      this.shouldFail = options.shouldFail;
    }
    if (typeof options.failureReason === 'string') {
      this.failureReason = options.failureReason;
    }
    if (typeof options.delay === 'number') {
      this.delay = options.delay;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'fixedTransactionId')) {
      this.fixedTransactionId = options.fixedTransactionId;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'fixedRefundId')) {
      this.fixedRefundId = options.fixedRefundId;
    }
  }

  /**
   * Reset the internal call counter.
   */
  resetCounter() {
    this._counter = 0;
  }
}

module.exports = MockAdapter;
