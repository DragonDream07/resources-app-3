import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '40px 16px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  stepItemActive: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
  stepItemDone: {
    color: '#37b24d',
  },
  stepDot: {
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
  },
  stepDotActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
  },
  stepDotDone: {
    backgroundColor: '#37b24d',
    color: '#ffffff',
  },
  stepDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  testModeBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff3e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '10px 16px',
    fontSize: '13px',
    color: '#343a40',
    marginBottom: '20px',
  },
  paymentMethodList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paymentMethodCard: {
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'border-color 0.15s',
  },
  paymentMethodCardSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  paymentMethodLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
  },
  paymentMethodDesc: {
    fontSize: '13px',
    color: '#495057',
    marginTop: '2px',
  },
  radioCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '9999px',
    border: '2px solid #868e96',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioCircleSelected: {
    border: '2px solid #4c6ef5',
  },
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '20px',
  },
  formGridFull: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  input: {
    height: '44px',
    padding: '0 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '2px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  hintText: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '12px',
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
  },
  backBtn: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  primaryBtn: {
    height: '44px',
    padding: '0 32px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  primaryBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  upiRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    marginTop: '20px',
  },
  upiInputWrap: {
    flex: 1,
  },
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', desc: 'Pay using any UPI app' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
];

const TEST_CARDS = [
  { number: '4111 1111 1111 1111', label: 'Visa — Success' },
  { number: '5500 0000 0000 0004', label: 'MC — Success' },
  { number: '4000 0000 0000 0002', label: 'Visa — Declined' },
];

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');

  const handleCardField = (field, value) => {
    let v = value;
    if (field === 'cardNumber') {
      v = value.replace(/\D/g, '').slice(0, 16);
      v = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    if (field === 'expiry') {
      v = value.replace(/\D/g, '').slice(0, 4);
      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    if (field === 'cvv') {
      v = value.replace(/\D/g, '').slice(0, 4);
    }
    setCardForm((prev) => ({ ...prev, [field]: v }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateCard = () => {
    const errs = {};
    const raw = cardForm.cardNumber.replace(/\s/g, '');
    if (raw.length < 13) errs.cardNumber = 'Enter a valid card number.';
    if (!cardForm.cardHolder.trim()) errs.cardHolder = 'Cardholder name is required.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiry)) errs.expiry = 'Enter expiry as MM/YY.';
    if (cardForm.cvv.length < 3) errs.cvv = 'Enter a valid CVV.';
    return errs;
  };

  const validateUpi = () => {
    const errs = {};
    if (!/^[\w.\-+]+@[\w]+$/.test(upiId.trim())) errs.upiId = 'Enter a valid UPI ID (e.g. name@upi).';
    return errs;
  };

  const validateNetbanking = () => {
    const errs = {};
    if (!bank) errs.bank = 'Select a bank.';
    return errs;
  };

  const handleContinue = async () => {
    setGlobalError('');
    let errs = {};
    if (selectedMethod === 'card') errs = validateCard();
    else if (selectedMethod === 'upi') errs = validateUpi();
    else if (selectedMethod === 'netbanking') errs = validateNetbanking();

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { method: selectedMethod };
      if (selectedMethod === 'card') {
        payload.cardNumber = cardForm.cardNumber.replace(/\s/g, '');
        payload.cardHolder = cardForm.cardHolder;
        payload.expiry = cardForm.expiry;
        payload.cvv = cardForm.cvv;
      } else if (selectedMethod === 'upi') {
        payload.upiId = upiId.trim();
      } else if (selectedMethod === 'netbanking') {
        payload.bank = bank;
      }

      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/checkout/review');
      } else {
        const data = await res.json();
        setGlobalError(data.message || 'Payment initiation failed. Please try again.');
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <div style={{ ...styles.stepItem, ...styles.stepItemDone }}>
            <div style={{ ...styles.stepDot, ...styles.stepDotDone }}>✓</div>
            Address
          </div>
          <div style={styles.stepDivider} />
          <div style={{ ...styles.stepItem, ...styles.stepItemActive }}>
            <div style={{ ...styles.stepDot, ...styles.stepDotActive }}>2</div>
            Payment
          </div>
          <div style={styles.stepDivider} />
          <div style={styles.stepItem}>
            <div style={styles.stepDot}>3</div>
            Review
          </div>
        </div>

        <h1 style={styles.heading}>Payment</h1>

        <div style={styles.testModeBanner}>
          <span>🧪</span>
          <span>
            <strong>Test mode active.</strong> No real payments will be processed.
            Use test card: <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>4111 1111 1111 1111</code>
          </span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeading}>Select Payment Method</div>
          <div style={styles.paymentMethodList}>
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.id}
                style={{
                  ...styles.paymentMethodCard,
                  ...(selectedMethod === m.id ? styles.paymentMethodCardSelected : {}),
                }}
                onClick={() => {
                  setSelectedMethod(m.id);
                  setFormErrors({});
                  setGlobalError('');
                }}
                role="radio"
                aria-checked={selectedMethod === m.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedMethod(m.id);
                    setFormErrors({});
                  }
                }}
              >
                <div
                  style={{
                    ...styles.radioCircle,
                    ...(selectedMethod === m.id ? styles.radioCircleSelected : {}),
                  }}
                >
                  {selectedMethod === m.id && <div style={styles.radioInner} />}
                </div>
                <div>
                  <div style={styles.paymentMethodLabel}>{m.label}</div>
                  <div style={styles.paymentMethodDesc}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedMethod === 'card' && (
            <div style={styles.formGrid}>
              <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                <label style={styles.label} htmlFor="cardNumber">Card Number *</label>
                <input
                  id="cardNumber"
                  style={{
                    ...styles.input,
                    ...(formErrors.cardNumber ? styles.inputError : {}),
                  }}
                  value={cardForm.cardNumber}
                  onChange={(e) => handleCardField('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                />
                {formErrors.cardNumber && (
                  <span style={styles.errorText}>{formErrors.cardNumber}</span>
                )}
              </div>

              <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                <label style={styles.label} htmlFor="cardHolder">Cardholder Name *</label>
                <input
                  id="cardHolder"
                  style={{
                    ...styles.input,
                    fontFamily: "'Inter', sans-serif",
                    ...(formErrors.cardHolder ? styles.inputError : {}),
                  }}
                  value={cardForm.cardHolder}
                  onChange={(e) => handleCardField('cardHolder', e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="cc-name"
                />
                {formErrors.cardHolder && (
                  <span style={styles.errorText}>{formErrors.cardHolder}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="expiry">Expiry (MM/YY) *</label>
                <input
                  id="expiry"
                  style={{
                    ...styles.input,
                    ...(formErrors.expiry ? styles.inputError : {}),
                  }}
                  value={cardForm.expiry}
                  onChange={(e) => handleCardField('expiry', e.target.value)}
                  placeholder="08/26"
                  autoComplete="cc-exp"
                />
                {formErrors.expiry && (
                  <span style={styles.errorText}>{formErrors.expiry}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="cvv">CVV *</label>
                <input
                  id="cvv"
                  style={{
                    ...styles.input,
                    ...(formErrors.cvv ? styles.inputError : {}),
                  }}
                  value={cardForm.cvv}
                  onChange={(e) => handleCardField('cvv', e.target.value)}
                  placeholder="123"
                  autoComplete="cc-csc"
                  type="password"
                  maxLength={4}
                />
                {formErrors.cvv && (
                  <span style={styles.errorText}>{formErrors.cvv}</span>
                )}
              </div>

              <div style={{ ...styles.formGridFull }}>
                <div style={styles.hintText}>
                  Test cards: {TEST_CARDS.map((c) => c.label + ': ' + c.number).join(' · ')}
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div style={{ marginTop: '20px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="upiId">UPI ID *</label>
                <input
                  id="upiId"
                  style={{
                    ...styles.input,
                    fontFamily: "'JetBrains Mono', monospace",
                    ...(formErrors.upiId ? styles.inputError : {}),
                  }}
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    if (formErrors.upiId) setFormErrors((p) => ({ ...p, upiId: '' }));
                  }}
                  placeholder="yourname@upi"
                />
                {formErrors.upiId && (
                  <span style={styles.errorText}>{formErrors.upiId}</span>
                )}
              </div>
              <div style={styles.hintText}>Test UPI ID: success@mockupi</div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div style={{ marginTop: '20px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="bank">Select Bank *</label>
                <select
                  id="bank"
                  style={{
                    ...styles.input,
                    fontFamily: "'Inter', sans-serif",
                    ...(formErrors.bank ? styles.inputError : {}),
                  }}
                  value={bank}
                  onChange={(e) => {
                    setBank(e.target.value);
                    if (formErrors.bank) setFormErrors((p) => ({ ...p, bank: '' }));
                  }}
                >
                  <option value="">Choose a bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
                {formErrors.bank && (
                  <span style={styles.errorText}>{formErrors.bank}</span>
                )}
              </div>
            </div>
          )}

          {selectedMethod === 'cod' && (
            <div
              style={{
                marginTop: '20px',
                backgroundColor: '#fff4e6',
                borderRadius: '6px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#343a40',
              }}
            >
              You will pay in cash when your order is delivered. A convenience fee of ₹40 may apply.
            </div>
          )}
        </div>

        {globalError && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#f03e3e',
              marginBottom: '16px',
            }}
          >
            {globalError}
          </div>
        )}

        <div style={styles.footer}>
          <button
            style={styles.backBtn}
            onClick={() => navigate('/checkout/address')}
            type="button"
          >
            ← Back
          </button>
          <button
            style={{
              ...styles.primaryBtn,
              ...(submitting ? styles.primaryBtnDisabled : {}),
            }}
            onClick={handleContinue}
            disabled={submitting}
            type="button"
          >
            {submitting ? 'Processing…' : 'Continue to Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
