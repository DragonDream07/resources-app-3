import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const INITIAL_FORM = {
  code: '',
  type: 'percentage',
  discount: '',
  expiry: '',
  is_active: true,
  min_order_value: '',
  max_uses: '',
};

export default function AdminPromotionNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.code.trim()) errors.code = 'Code is required.';
    if (!form.discount || isNaN(Number(form.discount)) || Number(form.discount) <= 0)
      errors.discount = 'Discount must be a positive number.';
    if (form.type === 'percentage' && Number(form.discount) > 100)
      errors.discount = 'Percentage discount cannot exceed 100.';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        discount: Number(form.discount),
        expiry: form.expiry || null,
        is_active: form.is_active,
        min_order_value: form.min_order_value ? Number(form.min_order_value) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
      };
      const res = await fetch('/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create promo code');
      }
      navigate('/admin/promotions');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/promotions"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <img src="/src/assets/icons/chevron-left.svg" alt="Back" className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Promo Code</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Promo Code <span className="text-red-500">*</span>
          </label>
          <input
            id="code"
            name="code"
            type="text"
            value={form.code}
            onChange={handleChange}
            placeholder="e.g. SAVE20"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {fieldErrors.code && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.code}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Value <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
              {form.type === 'percentage' ? '%' : '₹'}
            </span>
            <input
              id="discount"
              name="discount"
              type="number"
              min="0"
              step="0.01"
              value={form.discount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {fieldErrors.discount && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.discount}</p>
          )}
        </div>

        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            id="expiry"
            name="expiry"
            type="date"
            value={form.expiry}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="min_order_value" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Order Value
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">₹</span>
            <input
              id="min_order_value"
              name="min_order_value"
              type="number"
              min="0"
              step="0.01"
              value={form.min_order_value}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="max_uses" className="block text-sm font-medium text-gray-700 mb-1">
            Max Uses
          </label>
          <input
            id="max_uses"
            name="max_uses"
            type="number"
            min="1"
            step="1"
            value={form.max_uses}
            onChange={handleChange}
            placeholder="Leave blank for unlimited"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Creating...' : 'Create Promo Code'}
          </button>
          <Link
            to="/admin/promotions"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
