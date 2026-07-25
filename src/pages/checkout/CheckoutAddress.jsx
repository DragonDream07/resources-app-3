import { useState, useEffect } from 'react';
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
  addressCard: {
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  addressCardSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  addressText: {
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '1.5',
  },
  addressName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
    transition: 'border-color 0.15s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '2px',
  },
  pinRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  pinInputWrap: {
    flex: 1,
  },
  checkBtn: {
    height: '44px',
    padding: '0 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  serviceabilityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '8px',
  },
  serviceableOk: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
  },
  serviceableNo: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  newAddressToggle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4c6ef5',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',
    textDecoration: 'underline',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
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
};

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [pinServiceability, setPinServiceability] = useState(null);
  const [pinChecking, setPinChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/users/me/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.data) {
          setSavedAddresses(data.data);
          if (data.data.length > 0) {
            setSelectedAddressId(data.data[0].id);
          } else {
            setShowNewForm(true);
          }
        } else {
          setShowNewForm(true);
        }
      })
      .catch(() => setShowNewForm(true));
  }, []);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (field === 'pinCode') {
      setPinServiceability(null);
    }
  };

  const checkServiceability = async () => {
    if (!form.pinCode || !/^\d{6}$/.test(form.pinCode)) {
      setFormErrors((prev) => ({ ...prev, pinCode: 'Enter a valid 6-digit PIN code.' }));
      return;
    }
    setPinChecking(true);
    setPinServiceability(null);
    try {
      const res = await fetch(`/api/serviceability?pinCode=${form.pinCode}`);
      const data = await res.json();
      setPinServiceability(data.serviceable ? 'ok' : 'no');
    } catch {
      setPinServiceability('no');
    } finally {
      setPinChecking(false);
    }
  };

  const validateNewForm = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      errs.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.addressLine1.trim()) errs.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) errs.city = 'City is required.';
    if (!form.state) errs.state = 'State is required.';
    if (!form.pinCode || !/^\d{6}$/.test(form.pinCode))
      errs.pinCode = 'Enter a valid 6-digit PIN code.';
    return errs;
  };

  const handleContinue = async () => {
    if (!showNewForm && selectedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (!addr) return;
      setSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/checkout/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ addressId: addr.id }),
        });
        if (res.ok) {
          navigate('/checkout/payment');
        }
      } catch {
        /* noop */
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const errs = validateNewForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (pinServiceability !== 'ok') {
      await checkServiceability();
      const recheckRes = await fetch(`/api/serviceability?pinCode=${form.pinCode}`);
      const recheckData = await recheckRes.json();
      if (!recheckData.serviceable) {
        setPinServiceability('no');
        return;
      }
      setPinServiceability('ok');
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/checkout/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          country: form.country,
        }),
      });
      if (res.ok) {
        navigate('/checkout/payment');
      }
    } catch {
      /* noop */
    } finally {
      setSubmitting(false);
    }
  };

  const canContinue = showNewForm
    ? pinServiceability === 'ok'
    : !!selectedAddressId;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <div style={{ ...styles.stepItem, ...styles.stepItemActive }}>
            <div style={{ ...styles.stepDot, ...styles.stepDotActive }}>1</div>
            Address
          </div>
          <div style={styles.stepDivider} />
          <div style={styles.stepItem}>
            <div style={styles.stepDot}>2</div>
            Payment
          </div>
          <div style={styles.stepDivider} />
          <div style={styles.stepItem}>
            <div style={styles.stepDot}>3</div>
            Review
          </div>
        </div>

        <h1 style={styles.heading}>Delivery Address</h1>

        {savedAddresses.length > 0 && (
          <div style={styles.card}>
            <div style={styles.cardHeading}>Saved Addresses</div>
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  ...styles.addressCard,
                  ...(selectedAddressId === addr.id && !showNewForm
                    ? styles.addressCardSelected
                    : {}),
                }}
                onClick={() => {
                  setSelectedAddressId(addr.id);
                  setShowNewForm(false);
                }}
                role="radio"
                aria-checked={selectedAddressId === addr.id && !showNewForm}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedAddressId(addr.id);
                    setShowNewForm(false);
                  }
                }}
              >
                <div style={styles.addressName}>{addr.fullName}</div>
                <div style={styles.addressText}>
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                </div>
                <div style={styles.addressText}>
                  {addr.city}, {addr.state} – {addr.pinCode}
                </div>
                <div style={styles.addressText}>Phone: {addr.phone}</div>
              </div>
            ))}
            <hr style={styles.divider} />
            <button
              style={styles.newAddressToggle}
              onClick={() => {
                setShowNewForm(!showNewForm);
                setSelectedAddressId(null);
              }}
            >
              {showNewForm ? '— Use a saved address' : '+ Add a new address'}
            </button>
          </div>
        )}

        {showNewForm && (
          <div style={styles.card}>
            <div style={styles.cardHeading}>New Delivery Address</div>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  style={{
                    ...styles.input,
                    ...(formErrors.fullName ? styles.inputError : {}),
                  }}
                  value={form.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                {formErrors.fullName && (
                  <span style={styles.errorText}>{formErrors.fullName}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="phone">Mobile Number *</label>
                <input
                  id="phone"
                  style={{
                    ...styles.input,
                    ...(formErrors.phone ? styles.inputError : {}),
                  }}
                  value={form.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  autoComplete="tel"
                />
                {formErrors.phone && (
                  <span style={styles.errorText}>{formErrors.phone}</span>
                )}
              </div>

              <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                <label style={styles.label} htmlFor="addressLine1">Address Line 1 *</label>
                <input
                  id="addressLine1"
                  style={{
                    ...styles.input,
                    ...(formErrors.addressLine1 ? styles.inputError : {}),
                  }}
                  value={form.addressLine1}
                  onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                  placeholder="House No, Street Name"
                  autoComplete="address-line1"
                />
                {formErrors.addressLine1 && (
                  <span style={styles.errorText}>{formErrors.addressLine1}</span>
                )}
              </div>

              <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                <label style={styles.label} htmlFor="addressLine2">Address Line 2</label>
                <input
                  id="addressLine2"
                  style={styles.input}
                  value={form.addressLine2}
                  onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                  placeholder="Landmark, Apartment (optional)"
                  autoComplete="address-line2"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="city">City *</label>
                <input
                  id="city"
                  style={{
                    ...styles.input,
                    ...(formErrors.city ? styles.inputError : {}),
                  }}
                  value={form.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  placeholder="Mumbai"
                  autoComplete="address-level2"
                />
                {formErrors.city && (
                  <span style={styles.errorText}>{formErrors.city}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="state">State *</label>
                <select
                  id="state"
                  style={{
                    ...styles.input,
                    ...(formErrors.state ? styles.inputError : {}),
                    appearance: 'none',
                  }}
                  value={form.state}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                >
                  <option value="">Select State</option>
                  {INDIA_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {formErrors.state && (
                  <span style={styles.errorText}>{formErrors.state}</span>
                )}
              </div>

              <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                <label style={styles.label} htmlFor="pinCode">PIN Code *</label>
                <div style={styles.pinRow}>
                  <div style={{ ...styles.pinInputWrap, ...styles.formGroup, gap: '0' }}>
                    <input
                      id="pinCode"
                      style={{
                        ...styles.input,
                        ...(formErrors.pinCode ? styles.inputError : {}),
                      }}
                      value={form.pinCode}
                      onChange={(e) => handleFieldChange('pinCode', e.target.value)}
                      placeholder="400001"
                      maxLength={6}
                      autoComplete="postal-code"
                    />
                    {formErrors.pinCode && (
                      <span style={styles.errorText}>{formErrors.pinCode}</span>
                    )}
                  </div>
                  <button
                    style={styles.checkBtn}
                    onClick={checkServiceability}
                    disabled={pinChecking}
                    type="button"
                  >
                    {pinChecking ? 'Checking…' : 'Check'}
                  </button>
                </div>
                {pinServiceability === 'ok' && (
                  <div style={{ ...styles.serviceabilityBadge, ...styles.serviceableOk }}>
                    ✓ Delivery available to this PIN code
                  </div>
                )}
                {pinServiceability === 'no' && (
                  <div style={{ ...styles.serviceabilityBadge, ...styles.serviceableNo }}>
                    ✗ Delivery not available to this PIN code
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <button
            style={{
              ...styles.primaryBtn,
              ...(!canContinue || submitting ? styles.primaryBtnDisabled : {}),
            }}
            onClick={handleContinue}
            disabled={!canContinue || submitting}
            type="button"
          >
            {submitting ? 'Saving…' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
