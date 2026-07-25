import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';

const PromoCodeInput = ({ appliedPromo, onApply, onRemove, isLoading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError('');
  };

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a promo code.');
      return;
    }
    try {
      await onApply(trimmed);
      setCode('');
      setError('');
    } catch (err) {
      setError(err?.message || 'Invalid or expired promo code.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleRemove = () => {
    setCode('');
    setError('');
    if (onRemove) onRemove();
  };

  if (appliedPromo) {
    return (
      <div className="promo-code promo-code--applied">
        <div className="promo-code__applied-row">
          <img src={checkIcon} alt="" aria-hidden="true" className="promo-code__check-icon" />
          <span className="promo-code__applied-label">
            Promo <strong>{appliedPromo.code}</strong> applied
          </span>
          {appliedPromo.discountAmount != null && (
            <span className="promo-code__applied-discount">
              - ₹{Number(appliedPromo.discountAmount).toFixed(2)}
            </span>
          )}
        </div>
        <button
          type="button"
          className="promo-code__remove-btn"
          onClick={handleRemove}
          aria-label="Remove promo code"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="promo-code">
      <label htmlFor="promo-code-input" className="promo-code__label">
        Promo Code
      </label>
      <div className="promo-code__input-row">
        <input
          id="promo-code-input"
          type="text"
          className={`promo-code__input${error ? ' promo-code__input--error' : ''}`}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter promo code"
          aria-describedby={error ? 'promo-code-error' : undefined}
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="button"
          className="promo-code__apply-btn"
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p id="promo-code-error" className="promo-code__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PromoCodeInput;
