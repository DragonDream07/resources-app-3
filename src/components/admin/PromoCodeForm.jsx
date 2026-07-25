import React, { useState, useEffect } from 'react';

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount' },
];

const PromoCodeForm = ({
  initialData = {},
  onSubmit,
  submitting = false,
  error = null,
  mode = 'create',
}) => {
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_value: '',
    max_discount_amount: '',
    expiry_date: '',
    usage_limit: '',
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        code: initialData.code || '',
        discount_type: initialData.discount_type || 'percentage',
        discount_value: initialData.discount_value || '',
        min_order_value: initialData.min_order_value || '',
        max_discount_amount: initialData.max_discount_amount || '',
        expiry_date: initialData.expiry_date
          ? initialData.expiry_date.split('T')[0]
          : '',
        usage_limit: initialData.usage_limit || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        ...form,
        discount_value: parseFloat(form.discount_value) || 0,
        min_order_value: form.min_order_value !== '' ? parseFloat(form.min_order_value) : null,
        max_discount_amount: form.max_discount_amount !== '' ? parseFloat(form.max_discount_amount) : null,
        usage_limit: form.usage_limit !== '' ? parseInt(form.usage_limit, 10) : null,
        expiry_date: form.expiry_date || null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-code">
            Promo Code <span className="text-red-500">*</span>
          </label>
          <input
            id="promo-code"
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="e.g. SUMMER20"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-discount-type">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <select
            id="promo-discount-type"
            name="discount_type"
            value={form.discount_type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DISCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-discount-value">
            {form.discount_type === 'percentage' ? 'Discount %' : 'Discount Amount'}{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="promo-discount-value"
            type="number"
            name="discount_value"
            value={form.discount_value}
            onChange={handleChange}
            required
            min="0"
            step={form.discount_type === 'percentage' ? '1' : '0.01'}
            max={form.discount_type === 'percentage' ? '100' : undefined}
            placeholder={form.discount_type === 'percentage' ? '0–100' : '0.00'}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-min-order">
            Minimum Order Value
          </label>
          <input
            id="promo-min-order"
            type="number"
            name="min_order_value"
            value={form.min_order_value}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {form.discount_type === 'percentage' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-max-discount">
              Max Discount Amount
            </label>
            <input
              id="promo-max-discount"
              type="number"
              name="max_discount_amount"
              value={form.max_discount_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-expiry">
            Expiry Date
          </label>
          <input
            id="promo-expiry"
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-usage-limit">
            Usage Limit
          </label>
          <input
            id="promo-usage-limit"
            type="number"
            name="usage_limit"
            value={form.usage_limit}
            onChange={handleChange}
            min="1"
            placeholder="Unlimited"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            id="promo-active"
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="promo-active">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting
            ? mode === 'create' ? 'Creating…' : 'Saving…'
            : mode === 'create' ? 'Create Promo Code' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;
