import React from 'react';
import { useCart } from './CartContext';
import FocusTrap from 'focus-trap-react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <FocusTrap>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
        <div
          className="cart-container"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-heading"
        >
          <div className="cart-header">
            <h2 id="cart-heading">Service Cart</h2>
            <button
              className="close-cart"
              onClick={() => toggleCart(false)}
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>${item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <span aria-label="Current quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <p className="terms-notice">
                  By proceeding, you agree to our{' '}
                  <Link to="/terms" className="terms-link">
                    Terms of Service
                  </Link>
                </p>

                <Link
                  to="/checkout"
                  className="checkout-button"
                  aria-label="Proceed to checkout"
                  onClick={() => toggleCart(false)} 
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </FocusTrap>
  );
};

export default Cart;