import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { Colors } from '../lib/theme';

const Root = createNativeStackNavigator();

export function AppNavigator() {
  const { session, profile, loading: authLoading } = useAuth();
  const { location } = useLocation();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.ivory }}>
        <ActivityIndicator size="large" color={Colors.turmeric} />
      </View>
    );
  }

  const isAuthenticated = !!session;
  const hasRole = !!profile?.role;
  const hasLocation = !!location;
  const showMain = isAuthenticated && hasRole && hasLocation;

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {showMain ? (
          <Root.Screen name="Main" component={MainNavigator} />
        ) : (
          <Root.Screen name="Auth" component={AuthNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
