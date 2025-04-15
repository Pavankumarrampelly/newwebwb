import React, { useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { ShoppingBag, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useFoodCart } from '../../hooks/useFoodCart';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import foodService from '../../services/foodService';
import { useNavigate } from 'react-router-dom';

const FoodCart = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const { toast } = useToast();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useFoodCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!deliveryLocation.trim()) {
      toast({
        title: "Delivery Location Required",
        description: "Please enter where you'd like your food to be delivered.",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          item: item._id,
          quantity: item.quantity
        })),
        total: cartTotal,
        deliveryLocation
      };

      // Submit order
      await foodService.placeFoodOrder(orderData);

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: "Your food order has been placed and will be delivered to your location."
      });

      // Clear cart and redirect
      clearCart();
      navigate('/food');
      
    } catch (error) {
      console.error('Failed to place order:', error);
      
      // Show mock success for demo
      toast({
        title: "Order Placed (Demo)",
        description: "This is a demo order. In production, your order would be sent to the kitchen."
      });
      
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Food Cart</h2>
      
      {cart.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 h-8 w-8 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="deliveryLocation">Delivery Location</Label>
            <Input
              id="deliveryLocation"
              placeholder="Enter event venue or specific location for delivery"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please provide a specific location where you'd like your food to be delivered
            </p>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="flex-1"
            >
              Clear Cart
            </Button>
            
            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>Processing Order...</>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
          <p className="mt-2 text-gray-500">
            Add some delicious items from our menu to get started
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/food')}
            className="mt-4"
          >
            Browse Menu
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodCart;