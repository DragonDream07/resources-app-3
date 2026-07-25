import React, { useEffect, useState } from 'react';

const FIELD_DEFAULTS = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pinCode: '',
};

/**
 * AddressForm
 * Props:
 *   initialValues  – object with address fields (optional)
 *   onSubmit(values) – called with form values when submitted
 *   onServiceabilityCheck(pinCode) – async fn; should return { serviceable: bool }
 *   submitLabel – label for submit button (default: "Save & Continue")
 *   loading – bool
 */
const AddressForm = ({
  initialValues = {},
  onSubmit,
  onServiceabilityCheck,
  submitLabel = 'Save & Continue',
  loading = false,
}) => {
  const [values, setValues] = useState({ ...FIELD_DEFAULTS, ...initialValues });
  const [errors, setErrors] = useState({});
  const [pinStatus, setPinStatus] = useState(null); // null | 'checking' | 'serviceable' | 'unserviceable'
  const [pinChecked, setPinChecked] = useState('');

  useEffect(() => {
    setValues({ ...FIELD_DEFAULTS, ...initialValues });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === 'pinCode') {
      setPinStatus(null);
      setPinChecked('');
    }
  };

  const handlePinBlur = async () => {
    const pin = values.pinCode.trim();
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) return;
    if (pin === pinChecked) return;
    if (!onServiceabilityCheck) return;

    setPinStatus('checking');
    try {
      const result = await onServiceabilityCheck(pin);
      setPinStatus(result?.serviceable ? 'serviceable' : 'unserviceable');
      setPinChecked(pin);
    } catch {
      setPinStatus(null);
    }
  };

  const validate = () => {
    const errs = {};
    if (!values.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!values.phone.trim() || !/^\d{10}$/.test(values.phone.trim()))
      errs.phone = 'Enter a valid 10-digit phone number.';
    if (!values.line1.trim()) errs.line1 = 'Address line 1 is required.';
    if (!values.city.trim()) errs.city = 'City is required.';
    if (!values.state.trim()) errs.state = 'State is required.';
    if (!values.pinCode.trim() || !/^\d{6}$/.test(values.pinCode.trim()))
      errs.pinCode = 'Enter a valid 6-digit PIN code.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (onSubmit) onSubmit(values);
  };

  const inputClass = (field) =>
    [
      'w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
      errors[field] ? 'border-red-500' : 'border-gray-300',
    ].join(' ');

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={values.fullName}
          onChange={handleChange}
          className={inputClass('fullName')}
        />
        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={10}
          value={values.phone}
          onChange={handleChange}
          className={inputClass('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>

      {/* Address Line 1 */}
      <div>
        <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          id="line1"
          name="line1"
          type="text"
          autoComplete="address-line1"
          value={values.line1}
          onChange={handleChange}
          className={inputClass('line1')}
        />
        {errors.line1 && <p className="mt-1 text-xs text-red-600">{errors.line1}</p>}
      </div>

      {/* Address Line 2 */}
      <div>
        <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          id="line2"
          name="line2"
          type="text"
          autoComplete="address-line2"
          value={values.line2}
          onChange={handleChange}
          className={inputClass('line2')}
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            onChange={handleChange}
            className={inputClass('city')}
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            autoComplete="address-level1"
            value={values.state}
            onChange={handleChange}
            className={inputClass('state')}
          />
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
        </div>
      </div>

      {/* PIN Code with serviceability */}
      <div>
        <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
          PIN Code <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="pinCode"
            name="pinCode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            value={values.pinCode}
            onChange={handleChange}
            onBlur={handlePinBlur}
            className={inputClass('pinCode')}
          />
          {pinStatus === 'checking' && (
            <span className="absolute right-3 top-2 text-xs text-gray-400 animate-pulse">Checking…</span>
          )}
        </div>
        {errors.pinCode && <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p>}
        {pinStatus === 'serviceable' && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Delivery available at this PIN code.
          </p>
        )}
        {pinStatus === 'unserviceable' && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Sorry, we don't deliver to this PIN code yet.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
};

export default AddressForm;
