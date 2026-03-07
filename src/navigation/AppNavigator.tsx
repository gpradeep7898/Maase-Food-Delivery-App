import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import {
  RootStackParamList, HomeStackParamList, MainTabParamList, CartItem,
} from '../types';
import { Colors, Typography } from '../constants/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import LocationScreen from '../screens/LocationScreen';
import HomeScreen from '../screens/HomeScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import CartScreen from '../screens/CartScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// HomeStack navigator — passes cart state down as props
function HomeStackNavigator({
  cartItems,
  setCartItems,
}: {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}) {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home">
        {props => <HomeScreen {...props} cartItems={cartItems} setCartItems={setCartItems} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="MealDetail">
        {props => <MealDetailScreen {...props} cartItems={cartItems} setCartItems={setCartItems} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Cart">
        {props => <CartScreen {...props} cartItems={cartItems} setCartItems={setCartItems} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Payment">
        {props => <PaymentScreen {...props} cartItems={cartItems} setCartItems={setCartItems} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <HomeStack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </HomeStack.Navigator>
  );
}

// MainTabs — bottom tab navigator
function MainTabs({
  cartItems,
  setCartItems,
}: {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}) {
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: Colors.turmeric,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: Typography.bodyBold,
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.turmeric, color: Colors.mocha },
        }}
      >
        {props => (
          <HomeStackNavigator
            {...props}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🍱</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// Root navigator
export default function AppNavigator() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Location" component={LocationScreen} />
        <RootStack.Screen name="MainTabs">
          {props => (
            <MainTabs
              {...props}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
