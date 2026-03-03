import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, HomeStackParamList, CartItem } from '../types';
import { Colors, Typography } from '../constants/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import LocationScreen from '../screens/LocationScreen';
import HomeScreen from '../screens/HomeScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import { PaymentScreen, OrderConfirmationScreen, OrderTrackingScreen } from '../screens/PaymentAndTracking';
import CartScreen from '../screens/CartScreen';
import { OrdersScreen, ProfileScreen } from '../screens/OrdersAndProfile';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// ============================================================
// HOME STACK (nested navigator inside Home tab)
// ============================================================
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

// ============================================================
// MAIN TABS
// ============================================================
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
          fontFamily: 'Poppins_700Bold',
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🏠</Text>,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.turmeric,
            color: Colors.mocha,
            fontFamily: 'Poppins_700Bold',
            fontSize: 10,
          },
        }}
      >
        {props => <HomeStackNavigator {...props} cartItems={cartItems} setCartItems={setCartItems} />}
      </Tab.Screen>

      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>📦</Text>,
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================================
// ROOT NAVIGATOR
// ============================================================
export default function AppNavigator() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

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
