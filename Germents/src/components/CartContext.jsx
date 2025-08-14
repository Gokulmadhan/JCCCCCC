// src/CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    return savedAddress ? JSON.parse(savedAddress) : {
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      instructions: ""
    };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));
  }, [cartItems, deliveryAddress]);

  const getKey = (item) => `${item.id}-${item.color}-${item.size}`;

  const addToCart = (product, quantity, selectedColor, selectedSize) => {
    const key = `${product.id}-${selectedColor}-${selectedSize}`;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => getKey(item) === key
      );

      if (existingItem) {
        return prevItems.map(item =>
          getKey(item) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.title || 'Unnamed Product',
            price:
              typeof product.price === 'string'
                ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
                : Number(product.price) || 0,
            quantity,
            image: product.images?.[0] || product.image || '',
            color: selectedColor || 'Default',
            size: selectedSize || 'Default',
          },
        ];
      }
    });
  };

  const updateQuantity = (id, color, size, newQuantity) => {
    const key = `${id}-${color}-${size}`;
    setCartItems(prevItems =>
      prevItems.map(item =>
        getKey(item) === key
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeItem = (id, color, size) => {
    const key = `${id}-${color}-${size}`;
    setCartItems(prevItems =>
      prevItems.filter(item => getKey(item) !== key)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateDeliveryAddress = (newAddress) => {
    setDeliveryAddress(newAddress);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
        deliveryAddress,
        updateDeliveryAddress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};