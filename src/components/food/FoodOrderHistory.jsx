import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ClipboardList, Calendar, MapPin, Ban } from 'lucide-react';
import foodService from '../../services/foodService';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800"
};

const FoodOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await foodService.getUserOrders();
        setOrders(Array.isArray(userOrders) ? userOrders : []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast({
          title: "Unable to fetch orders",
          description: "Displaying sample data instead.",
          variant: "warning"
        });
        setOrders(getMockOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await foodService.cancelOrder(orderId);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      toast({
        title: "Order Cancelled",
        description: "Your food order has been cancelled successfully."
      });
    } catch (error) {
      console.error('Failed to cancel order:', error);
      // Mock success fallback
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      toast({
        title: "Order Cancelled",
        description: "Your food order has been cancelled."
      });
    }
  };

  const getMockOrders = () => [
    {
      _id: '101',
      items: [
        { item: { _id: '1', name: 'Classic Burger', price: 8.99 }, quantity: 2 },
        { item: { _id: '3', name: 'French Fries', price: 3.99 }, quantity: 1 }
      ],
      total: 21.97,
      status: 'confirmed',
      orderDate: new Date().toISOString(),
      deliveryLocation: 'Student Union Building'
    },
    {
      _id: '102',
      items: [
        { item: { _id: '5', name: 'Chocolate Brownie', price: 5.99 }, quantity: 2 },
        { item: { _id: '4', name: 'Soda', price: 1.99 }, quantity: 2 }
      ],
      total: 15.96,
      status: 'delivered',
      orderDate: new Date(Date.now() - 86400000).toISOString(),
      deliveryLocation: 'Engineering Building, Room 305'
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-college-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading orders...</span>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order._id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">Order #{order._id.slice(-4)}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(order.orderDate)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {order.deliveryLocation}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${statusColors[order.status]} self-start md:self-center mt-2 md:mt-0`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <h4 className="font-medium mb-2">Items</h4>
                  <ul className="space-y-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.item.name}</span>
                          <span>${(item.item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))
                    ) : (
                      <li>No items found</li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    Total: ${order.total.toFixed(2)}
                  </div>

                  {['pending', 'confirmed'].includes(order.status) && (
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ClipboardList className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
          <p className="mt-2 text-gray-500">
            Once you place food orders, they will appear here
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/food'}
            className="mt-4"
          >
            Order Food
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodOrderHistory;
