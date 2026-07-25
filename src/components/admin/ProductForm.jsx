import React, { useState, useEffect, useCallback } from 'react';

const EMPTY_SKU = { sku_code: '', size: '', color: '', price: '', stock: '', is_active: true };

const ProductForm = ({
  initialData = {},
  categories = [],
  brands = [],
  onSubmit,
  submitting = false,
  error = null,
  mode = 'create',
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    is_active: true,
    ...initialData,
  });

  const [skus, setSkus] = useState(
    initialData.skus && initialData.skus.length > 0
      ? initialData.skus
      : [{ ...EMPTY_SKU }]
  );

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        brand_id: initialData.brand_id || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
      if (initialData.skus && initialData.skus.length > 0) {
        setSkus(initialData.skus);
      }
    }
  }, [initialData]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkuChange = useCallback((index, e) => {
    const { name, value, type, checked } = e.target;
    setSkus((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: type === 'checkbox' ? checked : value,
      };
      return updated;
    });
  }, []);

  const addSku = () => {
    setSkus((prev) => [...prev, { ...EMPTY_SKU }]);
  };

  const removeSku = useCallback((index) => {
    setSkus((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ...form, skus, images });
    }
  };

  const getSubmitLabel = () => {
    if (submitting) return mode === 'create' ? 'Creating…' : 'Saving…';
    return mode === 'create' ? 'Create Product' : 'Save Changes';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Basic Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-name">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleFieldChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-description">
            Description
          </label>
          <textarea
            id="product-description"
            name="description"
            value={form.description}
            onChange={handleFieldChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-category">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="product-category"
            name="category_id"
            value={form.category_id}
            onChange={handleFieldChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-brand">
            Brand
          </label>
          <select
            id="product-brand"
            name="brand_id"
            value={form.brand_id}
            onChange={handleFieldChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select brand…</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            id="product-active"
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleFieldChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="product-active">
            Active
          </label>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="text-sm text-gray-600"
        />
        {images.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">{images.length} file(s) selected</p>
        )}
      </div>

      {/* SKU Variants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">SKU Variants</h3>
          <button
            type="button"
            onClick={addSku}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <span>+ Add SKU</span>
          </button>
        </div>

        <div className="space-y-4">
          {skus.map((sku, index) => (
            <SkuRow
              key={index}
              sku={sku}
              index={index}
              showRemove={skus.length > 1}
              onChange={handleSkuChange}
              onRemove={removeSku}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {getSubmitLabel()}
        </button>
      </div>
    </form>
  );
};

const SkuRow = ({ sku, index, showRemove, onChange, onRemove }) => {
  const handleChange = useCallback((e) => onChange(index, e), [onChange, index]);
  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">SKU Code</label>
          <input
            type="text"
            name="sku_code"
            value={sku.sku_code}
            onChange={handleChange}
            placeholder="e.g. PROD-RED-L"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
          <input
            type="text"
            name="size"
            value={sku.size}
            onChange={handleChange}
            placeholder="e.g. L"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
          <input
            type="text"
            name="color"
            value={sku.color}
            onChange={handleChange}
            placeholder="e.g. Red"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={sku.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={sku.stock}
            onChange={handleChange}
            min="0"
            placeholder="0"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input
            type="checkbox"
            name="is_active"
            id={`sku-active-${index}`}
            checked={sku.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="text-xs font-medium text-gray-600" htmlFor={`sku-active-${index}`}>
            Active
          </label>
        </div>
      </div>

      {showRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs font-medium"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default ProductForm;
