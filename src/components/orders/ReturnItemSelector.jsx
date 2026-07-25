import React, { useState, useCallback } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function ReturnItemSelector({ items, onSelectionChange, maxReturnable }) {
  const [selected, setSelected] = useState({});
  const [quantities, setQuantities] = useState({});

  const eligibleItems = (items || []).filter(
    (item) => item.returnable !== false && item.eligible !== false
  );

  const handleToggle = useCallback(
    (itemId, item) => {
      setSelected((prev) => {
        const next = { ...prev };
        if (next[itemId]) {
          delete next[itemId];
        } else {
          next[itemId] = true;
        }

        const updatedQuantities = { ...quantities };
        if (!next[itemId]) {
          delete updatedQuantities[itemId];
        } else if (!updatedQuantities[itemId]) {
          updatedQuantities[itemId] = 1;
        }

        const selectedItems = eligibleItems
          .filter((i) => next[i.id || i.order_item_id])
          .map((i) => ({
            ...i,
            returnQuantity: updatedQuantities[i.id || i.order_item_id] || 1,
          }));

        if (onSelectionChange) {
          onSelectionChange(selectedItems);
        }

        return next;
      });
    },
    [eligibleItems, quantities, onSelectionChange]
  );

  const handleQuantityChange = useCallback(
    (itemId, value, maxQty) => {
      const parsed = parseInt(value, 10);
      const clamped = Math.max(1, Math.min(parsed || 1, maxQty || 1));
      setQuantities((prev) => {
        const next = { ...prev, [itemId]: clamped };
        const selectedItems = eligibleItems
          .filter((i) => selected[i.id || i.order_item_id])
          .map((i) => ({
            ...i,
            returnQuantity: next[i.id || i.order_item_id] || 1,
          }));
        if (onSelectionChange) {
          onSelectionChange(selectedItems);
        }
        return next;
      });
    },
    [eligibleItems, selected, onSelectionChange]
  );

  if (eligibleItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No eligible items available for return.
      </div>
    );
  }

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="space-y-3">
      {maxReturnable !== undefined && (
        <p className="text-xs text-gray-500 mb-2">
          You may select up to {maxReturnable} item(s) for return.
        </p>
      )}

      {eligibleItems.map((item) => {
        const itemId = item.id || item.order_item_id;
        const isChecked = Boolean(selected[itemId]);
        const displayName = item.product_name || item.productName || 'Product';
        const displayVariant = item.sku_name || item.skuName || item.variant;
        const displayImage = item.image_url || item.imageUrl;
        const itemQty = item.quantity || item.qty || 1;
        const returnQty = quantities[itemId] || 1;
        const isDisabled =
          !isChecked &&
          maxReturnable !== undefined &&
          selectedCount >= maxReturnable;

        return (
          <label
            key={itemId}
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              isChecked
                ? 'border-indigo-400 bg-indigo-50'
                : isDisabled
                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => !isDisabled && handleToggle(itemId, item)}
            />

            <img
              src={displayImage || placeholderProduct}
              alt={displayName}
              className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = placeholderProduct;
              }}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              {displayVariant && (
                <p className="text-xs text-gray-500 mt-0.5">{displayVariant}</p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">Qty ordered: {itemQty}</p>
            </div>

            {isChecked && itemQty > 1 && (
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <label className="text-xs text-gray-500">Return qty</label>
                <input
                  type="number"
                  min={1}
                  max={itemQty}
                  value={returnQty}
                  onClick={(e) => e.preventDefault()}
                  onChange={(e) => handleQuantityChange(itemId, e.target.value, itemQty)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}
          </label>
        );
      })}

      {selectedCount > 0 && (
        <p className="text-xs text-indigo-600 font-medium pt-1">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected for return
        </p>
      )}
    </div>
  );
}

export default ReturnItemSelector;
