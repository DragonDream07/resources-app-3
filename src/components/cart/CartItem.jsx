import React from 'react';
import { Link } from 'react-router-dom';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const {
    itemId,
    productId,
    name,
    sku,
    variantLabel,
    quantity,
    unitPrice,
    totalPrice,
    imageUrl,
  } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(itemId, quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(itemId, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(itemId);
  };

  return (
    <div className="cart-item">
      <div className="cart-item__image-wrapper">
        <Link to={`/products/${productId}`}>
          <img
            src={imageUrl || placeholderProduct}
            alt={name}
            className="cart-item__image"
            onError={(e) => {
              e.currentTarget.src = placeholderProduct;
            }}
          />
        </Link>
      </div>

      <div className="cart-item__details">
        <Link to={`/products/${productId}`} className="cart-item__name">
          {name}
        </Link>

        {sku && (
          <p className="cart-item__sku">SKU: {sku}</p>
        )}

        {variantLabel && (
          <p className="cart-item__variant">{variantLabel}</p>
        )}

        <p className="cart-item__unit-price">
          ₹{typeof unitPrice === 'number' ? unitPrice.toFixed(2) : '0.00'} each
        </p>
      </div>

      <div className="cart-item__actions">
        <div className="cart-item__qty-stepper">
          <button
            type="button"
            className="cart-item__qty-btn cart-item__qty-btn--decrement"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <img src={minusIcon} alt="" aria-hidden="true" />
          </button>

          <span className="cart-item__qty-value" aria-label={`Quantity: ${quantity}`}>
            {quantity}
          </span>

          <button
            type="button"
            className="cart-item__qty-btn cart-item__qty-btn--increment"
            onClick={handleIncrement}
            aria-label="Increase quantity"
          >
            <img src={plusIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <p className="cart-item__total-price">
          ₹{typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}
        </p>

        <button
          type="button"
          className="cart-item__remove-btn"
          onClick={handleRemove}
          aria-label={`Remove ${name} from cart`}
        >
          <img src={trashIcon} alt="" aria-hidden="true" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
