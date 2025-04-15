import { createContext, useContext, useState, useEffect } from 'react';

const FoodCartContext = createContext();

export const FoodCartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('foodCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodCart', JSON.stringify(cart));
  }, [cart]);
  
  // Add an item to the cart
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      
      if (existingItem) {
        // Item already exists, increase quantity
        return prevCart.map(cartItem => 
          cartItem._id === item._id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  
  // Update quantity of an item
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  // Remove an item from the cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate the total price of all items in cart
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );
  
  // Count total items in cart
  const itemCount = cart.reduce(
    (count, item) => count + item.quantity, 
    0
  );
  
  return (
    <FoodCartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </FoodCartContext.Provider>
  );
};

export const useFoodCart = () => {
  const context = useContext(FoodCartContext);
  if (!context) {
    throw new Error('useFoodCart must be used within a FoodCartProvider');
  }
  return context;
};

export default useFoodCart;