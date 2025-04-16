import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import axios from 'axios';

const ManageFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'snacks',
    isAvailable: true,
    image: ''
  });
  
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        setLoading(true);
        // Fetch food items
        const itemsResponse = await axios.get('/api/food/items/all');
        setFoodItems(itemsResponse.data);
        
        // Fetch all orders
        const ordersResponse = await axios.get('/api/food/orders/all');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Failed to fetch food data:', error);
        toast.error('Failed to load food management data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoodData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };
  
  const handleCategoryChange = (value) => {
    setNewItem(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.price) {
      toast.error('Name and price are required');
      return;
    }
    
    try {
      // Add new food item
      const response = await axios.post('/api/food/items', newItem);
      setFoodItems(prev => [...prev, response.data]);
      toast.success('Food item added successfully');
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: 'snacks',
        isAvailable: true,
        image: ''
      });
    } catch (error) {
      console.error('Failed to add food item:', error);
      toast.error(error.response?.data?.msg || 'Failed to add food item');
    }
  };
  
  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/food/items/${id}/toggle`, {
        isAvailable: !currentStatus
      });
      
      setFoodItems(prev => prev.map(item => 
        item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
      ));
      
      toast.success(`Food item ${currentStatus ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error('Failed to toggle food item availability:', error);
      toast.error('Failed to update food item');
    }
  };
  
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`/api/food/items/${id}`);
        setFoodItems(prev => prev.filter(item => item._id !== id));
        toast.success('Food item deleted successfully');
      } catch (error) {
        console.error('Failed to delete food item:', error);
        toast.error('Failed to delete food item');
      }
    }
  };
  
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/food/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="items">Food Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Add New Food Item</h3>
              <form onSubmit={handleAddItem}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      placeholder="Food item name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="meals">Meals</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={newItem.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the food item"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="mt-4 bg-college-primary hover:bg-college-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food Item
                </Button>
              </form>
            </Card>
            
            <h3 className="text-lg font-medium mt-8">Food Items</h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foodItems.length === 0 ? (
                  <p className="text-muted-foreground col-span-2">No food items found. Add your first item above.</p>
                ) : (
                  foodItems.map(item => (
                    <Card key={item._id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{item.name}</h4>
                              {item.isAvailable ? (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Available</span>
                              ) : (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Unavailable</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                            <p className="text-sm mb-2">{item.description}</p>
                            <p className="font-medium">₹{item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                              className={item.isAvailable ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                            >
                              {item.isAvailable ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteItem(item._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <h3 className="text-lg font-medium mb-4">Food Orders</h3>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">No food orders found.</p>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.user?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="mb-1">
                            {item.quantity}x {item.item?.name || 'Unknown Item'}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {['pending', 'confirmed'].includes(order.status) && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}>
                              Start Preparing
                            </Button>
                          )}
                          
                          {order.status === 'preparing' && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateOrderStatus(order._id, 'ready')}>
                              Mark Ready
                            </Button>
                          )}
                          
                          {order.status === 'ready' && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}>
                              Mark Delivered
                            </Button>
                          )}
                          
                          {['pending', 'confirmed', 'preparing'].includes(order.status) && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500"
                              onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageFood;