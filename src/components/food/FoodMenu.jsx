import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Pizza, Coffee, IceCream, Cookie, ShoppingCart, Plus, Loader2 } from 'lucide-react';
import foodService from '../../services/foodService';
import { useFoodCart } from '../../hooks/useFoodCart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Input } from '../ui/Input';

const categoryIcons = {
    'snacks': Cookie,
    'meals': Pizza,
    'beverages': Coffee,
    'desserts': IceCream
  };
  
  const FoodMenu = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();
    const { addToCart } = useFoodCart();
  
    useEffect(() => {
      const fetchFoodItems = async () => {
        try {
          const items = await foodService.getAllFoodItems();
          // Ensure we're setting an array even if the API returns something unexpected
          const itemsArray = Array.isArray(items) ? items : [];
          setFoodItems(itemsArray);
          setFilteredItems(itemsArray);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch food items:', error);
          // Mock data if API fails
          const mockData = getMockFoodItems();
          setFoodItems(mockData);
          setFilteredItems(mockData);
          setLoading(false);
        }
      };
  
      fetchFoodItems();
    }, []);
  
    useEffect(() => {
      if (!Array.isArray(foodItems)) {
        console.error('foodItems is not an array:', foodItems);
        return;
      }
      
      let result = [...foodItems];
      
      // Filter by category
      if (selectedCategory !== 'all') {
        result = result.filter(item => item.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.description?.toLowerCase().includes(query)
        );
      }
      
      setFilteredItems(result);
    }, [selectedCategory, searchQuery, foodItems]);
  
    const handleAddToCart = (item) => {
      addToCart(item);
      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`
      });
    };
  
    const getMockFoodItems = () => {
      return [
        {
          _id: '1',
          name: 'Classic Burger',
          description: 'Beef patty with lettuce, tomato, and cheese',
          price: 8.99,
          category: 'meals',
          isAvailable: true,
          image: 'burger.jpg'
        },
        {
          _id: '2',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with Caesar dressing and croutons',
          price: 6.99,
          category: 'meals',
          isAvailable: true,
          image: 'salad.jpg'
        },
        {
          _id: '3',
          name: 'French Fries',
          description: 'Crispy golden fries with ketchup',
          price: 3.99,
          category: 'snacks',
          isAvailable: true,
          image: 'fries.jpg'
        },
        {
          _id: '4',
          name: 'Soda',
          description: 'Refreshing carbonated beverage',
          price: 1.99,
          category: 'beverages',
          isAvailable: true,
          image: 'soda.jpg'
        },
        {
          _id: '5',
          name: 'Chocolate Brownie',
          description: 'Warm chocolate brownie with vanilla ice cream',
          price: 5.99,
          category: 'desserts',
          isAvailable: true,
          image: 'brownie.jpg'
        },
        {
          _id: '6',
          name: 'Coffee',
          description: 'Hot freshly brewed coffee',
          price: 2.49,
          category: 'beverages',
          isAvailable: true,
          image: 'coffee.jpg'
        }
      ];
    };
  
    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <Input 
              placeholder="Search menu items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:max-w-md">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="meals">Meals</TabsTrigger>
                <TabsTrigger value="snacks">Snacks</TabsTrigger>
                <TabsTrigger value="beverages">Drinks</TabsTrigger>
                <TabsTrigger value="desserts">Desserts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-college-primary" />
            <span className="ml-2">Loading menu items...</span>
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const IconComponent = categoryIcons[item.category] || Pizza;
              
              return (
                <Card key={item._id} className="overflow-hidden">
                  <div className="p-2 bg-gray-100 flex justify-center items-center h-40">
                    <IconComponent className="h-24 w-24 text-gray-400" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center pt-0">
                    <span className="font-semibold">${item.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">No items found</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'No food items available in this category right now'}
            </p>
          </div>
        )}
      </div>
    );
  };
  
  export default FoodMenu;