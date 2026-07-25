import React from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">No items found for this order.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item, index) => {
            const {
              id,
              product_name,
              productName,
              sku_name,
              skuName,
              variant,
              image_url,
              imageUrl,
              quantity,
              qty,
              unit_price,
              unitPrice,
              price,
              subtotal,
            } = item;

            const displayName = product_name || productName || 'Product';
            const displayVariant = sku_name || skuName || variant;
            const displayImage = image_url || imageUrl;
            const displayQty = quantity ?? qty ?? 1;
            const displayUnitPrice = unit_price ?? unitPrice ?? price ?? 0;
            const displaySubtotal = subtotal ?? displayUnitPrice * displayQty;

            return (
              <tr key={id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={displayImage || placeholderProduct}
                      alt={displayName}
                      className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = placeholderProduct;
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      {displayVariant && (
                        <p className="text-xs text-gray-500 mt-0.5">{displayVariant}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-gray-700">{displayQty}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-gray-700">₹{Number(displayUnitPrice).toFixed(2)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{Number(displaySubtotal).toFixed(2)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderItemsList;
