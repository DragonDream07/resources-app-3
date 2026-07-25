import React, { useState } from 'react';

const OUTCOMES = [
  { value: 'success', label: '✅ Simulate Success', description: 'Payment authorised immediately.' },
  { value: 'failure', label: '❌ Simulate Failure', description: 'Payment declined by issuer.' },
  { value: 'pending', label: '⏳ Simulate Pending', description: 'Payment is awaiting confirmation.' },
];

/**
 * PaymentMockForm
 * Props:
 *   onPay(outcome) – called with 'success' | 'failure' | 'pending' when the user submits
 *   loading        – bool  (parent is processing)
 *   amount         – number (display only)
 */
const PaymentMockForm = ({ onPay, loading = false, amount }) => {
  const [selectedOutcome, setSelectedOutcome] = useState('success');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [errors, setErrors] = useState({});

  const fmt = (v) =>
    typeof v === 'number'
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v)
      : null;

  const formatCardNumber = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const errs = {};
    if (!nameOnCard.trim()) errs.nameOnCard = 'Name on card is required.';
    const rawCard = cardNumber.replace(/\s/g, '');
    if (!rawCard || rawCard.length !== 16) errs.cardNumber = 'Enter a valid 16-digit card number.';
    const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      errs.expiry = 'Enter expiry as MM/YY.';
    } else {
      const month = parseInt(expiryMatch[1], 10);
      if (month < 1 || month > 12) errs.expiry = 'Enter a valid month (01–12).';
    }
    if (!cvv || !/^\d{3,4}$/.test(cvv)) errs.cvv = 'Enter a valid CVV (3 or 4 digits).';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (onPay) onPay(selectedOutcome);
  };

  const inputClass = (field) =>
    [
      'w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono',
      errors[field] ? 'border-red-500' : 'border-gray-300',
    ].join(' ');

  return (
    <div className="space-y-5">
      {/* Test-mode banner */}
      <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
        <span className="text-amber-600 text-xs font-semibold uppercase tracking-wide">Test Mode</span>
        <span className="text-amber-700 text-xs">
          No real charges will be made. Use the selector below to choose a simulated outcome.
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Outcome selector */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">Simulate Payment Outcome</legend>
          <div className="space-y-2">
            {OUTCOMES.map((o) => (
              <label
                key={o.value}
                className={[
                  'flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors',
                  selectedOutcome === o.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="outcome"
                  value={o.value}
                  checked={selectedOutcome === o.value}
                  onChange={() => setSelectedOutcome(o.value)}
                  className="mt-0.5 accent-indigo-600"
                />
                <div>
                  <span className="block text-sm font-medium text-gray-800">{o.label}</span>
                  <span className="block text-xs text-gray-500">{o.description}</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Card fields */}
        <div>
          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card <span className="text-red-500">*</span>
          </label>
          <input
            id="nameOnCard"
            type="text"
            autoComplete="cc-name"
            value={nameOnCard}
            onChange={(e) => { setNameOnCard(e.target.value); setErrors((p) => ({ ...p, nameOnCard: undefined })); }}
            className={[
              'w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
              errors.nameOnCard ? 'border-red-500' : 'border-gray-300',
            ].join(' ')}
            placeholder="John Doe"
          />
          {errors.nameOnCard && <p className="mt-1 text-xs text-red-600">{errors.nameOnCard}</p>}
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number <span className="text-red-500">*</span>
          </label>
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardNumber}
            onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setErrors((p) => ({ ...p, cardNumber: undefined })); }}
            className={inputClass('cardNumber')}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry <span className="text-red-500">*</span>
            </label>
            <input
              id="expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiry}
              onChange={(e) => { setExpiry(formatExpiry(e.target.value)); setErrors((p) => ({ ...p, expiry: undefined })); }}
              className={inputClass('expiry')}
              placeholder="MM/YY"
              maxLength={5}
            />
            {errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>}
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              CVV <span className="text-red-500">*</span>
            </label>
            <input
              id="cvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvv}
              onChange={(e) => { setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setErrors((p) => ({ ...p, cvv: undefined })); }}
              className={inputClass('cvv')}
              placeholder="•••"
              maxLength={4}
            />
            {errors.cvv && <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>}
          </div>
        </div>

        {/* Amount display */}
        {amount !== undefined && (
          <div className="flex justify-between items-center bg-gray-50 rounded-md px-4 py-3 border border-gray-100">
            <span className="text-sm text-gray-600">Amount to pay</span>
            <span className="text-base font-bold text-gray-900">{fmt(amount)}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors"
        >
          {loading ? 'Processing…' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentMockForm;
