import React, { useState, useEffect } from 'react';

const UserRoleEditor = ({
  userId,
  currentRoles = [],
  availableRoles = [],
  onSave,
  submitting = false,
  error = null,
}) => {
  const [selectedRoles, setSelectedRoles] = useState(currentRoles.map((r) => (typeof r === 'object' ? r.name : r)));
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSelectedRoles(currentRoles.map((r) => (typeof r === 'object' ? r.name : r)));
  }, [currentRoles]);

  const handleToggleRole = (roleName) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
    setSuccess(false);
  };

  const handleSave = async () => {
    setLocalError(null);
    setSuccess(false);
    try {
      if (onSave) {
        await onSave(userId, selectedRoles);
        setSuccess(true);
      }
    } catch (err) {
      setLocalError(err?.message || 'Failed to update roles.');
    }
  };

  return (
    <div className="space-y-4">
      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error || localError}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded px-4 py-3 text-sm">
          Roles updated successfully.
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Assign Roles</p>
        {availableRoles.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No roles available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => {
              const roleName = typeof role === 'object' ? role.name : role;
              const isSelected = selectedRoles.includes(roleName);
              return (
                <button
                  key={roleName}
                  type="button"
                  onClick={() => handleToggleRole(roleName)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {roleName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving…' : 'Save Roles'}
        </button>
      </div>
    </div>
  );
};

export default UserRoleEditor;
