import React, { useState } from 'react';

const Cart = ({ cart, onClose, onRemoveItem, onClearCart }) => {
  const [removingItems, setRemovingItems] = useState(new Set());

  const handleRemoveItem = async (productId) => {
    setRemovingItems(prev => new Set([...prev, productId]));
    try {
      await onRemoveItem(productId);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            color: 'white',
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            🛒 Your Cart ({cart.length} items)
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '3rem 1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ margin: '0 0 1rem 0', color: 'white' }}>Your cart is empty</h3>
            <p>Add some amazing digital products to get started!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginRight: '1rem',
                    }}
                  />
                  <div style={{ flex: 1, color: 'white' }}>
                    <h4 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      {item.name}
                    </h4>
                    <p style={{
                      margin: '0',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem'
                    }}>
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removingItems.has(item.id)}
                    style={{
                      background: removingItems.has(item.id) ? 'rgba(231, 76, 60, 0.5)' : '#e74c3c',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: removingItems.has(item.id) ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      minWidth: '80px',
                    }}
                    onMouseEnter={(e) => {
                      if (!removingItems.has(item.id)) {
                        e.target.style.backgroundColor = '#c0392b';
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!removingItems.has(item.id)) {
                        e.target.style.backgroundColor = '#e74c3c';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {removingItems.has(item.id) ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>

            {/* Total and Actions */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  Total: ${totalPrice.toFixed(2)}
                </span>
                <button
                  onClick={onClearCart}
                  style={{
                    background: 'rgba(149, 165, 166, 0.2)',
                    border: '1px solid rgba(149, 165, 166, 0.3)',
                    color: '#bdc3c7',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(149, 165, 166, 0.3)';
                    e.target.style.color = '#ecf0f1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(149, 165, 166, 0.2)';
                    e.target.style.color = '#bdc3c7';
                  }}
                >
                  Clear Cart
                </button>
              </div>

              <button
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
