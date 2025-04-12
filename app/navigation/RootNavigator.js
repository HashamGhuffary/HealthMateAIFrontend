import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { COLORS } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();

// Handle navigation errors
const handleNavigationError = (error) => {
  console.error('Navigation error:', error);
  // You can implement additional error logging here
};

// Define custom theme with linking configuration
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    primary: COLORS.primary,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.border,
  },
};

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check if it's the first time the app is opened
    async function checkFirstLaunch() {
      try {
        const hasLaunched = await SecureStore.getItemAsync('has_launched');

        if (hasLaunched !== 'true') {
          // First time using the app
          await SecureStore.setItemAsync('has_launched', 'true');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      } finally {
        setInitializing(false);
      }
    }

    checkFirstLaunch();
  }, []);

  if (isLoading || initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer 
      theme={MyTheme}
      onStateChange={(state) => {
        // Optional: Track navigation state changes
        console.log('New navigation state', state?.routes?.[state.index]?.name);
      }}
      onReady={() => {
        console.log('Navigation container ready');
      }}
      onUnhandledAction={(action) => {
        // Log unhandled actions
        console.warn('Unhandled navigation action:', action);
      }}
      fallback={
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading...</Text>
        </View>
      }
      onError={handleNavigationError}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default RootNavigator; 