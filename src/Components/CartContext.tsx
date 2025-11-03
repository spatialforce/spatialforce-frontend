import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  cartTotal: number;
  isCartOpen: boolean;
  toggleCart: (forceState?: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

const validateCartItems = (data: any): CartItem[] => {
  if (!Array.isArray(data)) return [];
  
  return data.filter((item: any) => (
    typeof item?.id === 'string' &&
    typeof item?.name === 'string' &&
    typeof item?.price === 'number' &&
    typeof item?.quantity === 'number' &&
    (item?.image === null || typeof item?.image === 'string')
  )).map(item => ({
    id: item.id,
    name: item.name,
    price: Math.max(0, item.price),
    quantity: Math.max(1, item.quantity),
    image: item.image
  }));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        return validateCartItems(parsed);
      }
    } catch (error) {
      console.error('Error initializing cart:', error);
      localStorage.removeItem('cart');
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing ? 
        prev.map(i => i.id === item.id ? 
          { ...i, quantity: i.quantity + 1 } : i
        ) : 
        [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? 
        { ...item, quantity: Math.max(1, newQuantity) } : 
        item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const toggleCart = (forceState?: boolean) => {
    setIsCartOpen(prev => {
      const newState = forceState !== undefined ? forceState : !prev;
      document.body.style.overflow = newState ? 'hidden' : '';
      return newState;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        toggleCart,
        clearCart,
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