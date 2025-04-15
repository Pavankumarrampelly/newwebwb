
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import FoodMenu from '../components/food/FoodMenu';
import FoodCart from '../components/food/FoodCart';
import FoodOrderHistory from '../components/food/FoodOrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useToast } from '../hooks/use-toast';
import { Utensils, ShoppingCart, ClipboardList } from 'lucide-react';
import { Card } from '../components/ui/Card';

const Food = () => {
    const [activeTab, setActiveTab] = useState('menu');
    const { toast } = useToast();
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Utensils className="mr-2 h-6 w-6 text-college-primary" />
              Food Orders
            </h1>
            <p className="mt-1 text-gray-600">
              Order food for events and view your order history
            </p>
          </div>
          
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="menu" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span className="hidden sm:inline">Menu</span>
                </TabsTrigger>
                <TabsTrigger value="cart" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">My Cart</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Order History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu">
                <FoodMenu />
              </TabsContent>
              
              <TabsContent value="cart">
                <FoodCart />
              </TabsContent>
              
              <TabsContent value="orders">
                <FoodOrderHistory />
              </TabsContent>
            </Tabs>
          </Card>
        </main>
      </div>
    );
  };
  
  export default Food;