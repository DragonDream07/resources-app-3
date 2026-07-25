import { useState, useCallback } from 'react';

const STEPS = ['address', 'payment', 'review'];

const INITIAL_STATE = {
  address: {
    addressId: '',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  },
  payment: {
    method: '',
    details: {},
  },
  review: {},
};

export function useCheckout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const stepName = STEPS[currentStep];

  const updateStepData = useCallback((step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    const idx = typeof step === 'string' ? STEPS.indexOf(step) : step;
    if (idx >= 0 && idx < STEPS.length) setCurrentStep(idx);
  }, []);

  const submitAddress = useCallback(
    async (addressData) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/checkout/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(addressData),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Address submission failed');
        }
        const data = await res.json();
        updateStepData('address', addressData);
        goNext();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateStepData, goNext]
  );

  const initiatePayment = useCallback(
    async (paymentData) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/payments/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(paymentData),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Payment initiation failed');
        }
        const data = await res.json();
        updateStepData('payment', paymentData);
        goNext();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateStepData, goNext]
  );

  const placeOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/checkout/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Order placement failed');
      }
      const data = await res.json();
      setOrderId(data.orderId ?? data.id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData(INITIAL_STATE);
    setError(null);
    setOrderId(null);
  }, []);

  return {
    currentStep,
    stepName,
    steps: STEPS,
    formData,
    loading,
    error,
    orderId,
    updateStepData,
    goNext,
    goPrev,
    goToStep,
    submitAddress,
    initiatePayment,
    placeOrder,
    reset,
  };
}
