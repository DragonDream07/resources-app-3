import React, { useState, useEffect } from 'react';

const CategoryForm = ({
  initialData = {},
  categories = [],
  onSubmit,
  submitting = false,
  error = null,
  mode = 'create',
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    parent_id: '',
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        parent_id: initialData.parent_id || '',
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
        parent_id: form.parent_id || null,
      });
    }
  };

  const filteredParents = categories.filter(
    (c) => !initialData?.id || c.id !== initialData.id
  );

  const getSubmitLabel = () => {
    if (submitting) return mode === 'create' ? 'Creating…' : 'Saving…';
    return mode === 'create' ? 'Create Category' : 'Save Changes';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category-name">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          id="category-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category-description">
          Description
        </label>
        <textarea
          id="category-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category-parent">
          Parent Category
        </label>
        <select
          id="category-parent"
          name="parent_id"
          value={form.parent_id || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">None (top-level)</option>
          {filteredParents.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="category-active"
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700" htmlFor="category-active">
          Active
        </label>
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

export default CategoryForm;
