import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { COLORS } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();

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
    <NavigationContainer>
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
});

export default RootNavigator; 