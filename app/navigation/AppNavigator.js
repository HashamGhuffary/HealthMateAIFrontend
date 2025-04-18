import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/global';
import { Text, StyleSheet, View } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import RecordsScreen from '../screens/RecordsScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SymptomCheckerScreen from '../screens/SymptomCheckerScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import DiagnosisScreen from '../screens/DiagnosisScreen';
import TreatmentScreen from '../screens/TreatmentScreen';

// Conditionally import HealthGoals and Reminders screens if they exist
let HealthGoalsScreen = null;
let RemindersScreen = null;

try {
  HealthGoalsScreen = require('../screens/HealthGoalsScreen').default;
} catch (error) {
  // Create a fallback component if screen doesn't exist
  HealthGoalsScreen = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Health Goals feature coming soon!</Text>
    </View>
  );
}

try {
  RemindersScreen = require('../screens/RemindersScreen').default;
} catch (error) {
  // Create a fallback component if screen doesn't exist
  RemindersScreen = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Reminders feature coming soon!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
      />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
      <Stack.Screen name="Treatment" component={TreatmentScreen} />
      {HealthGoalsScreen && <Stack.Screen name="HealthGoals" component={HealthGoalsScreen} />}
      {RemindersScreen && <Stack.Screen name="Reminders" component={RemindersScreen} />}
    </Stack.Navigator>
  );
};

// Chat stack
const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatMain" component={ChatScreen} />
      <Stack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
    </Stack.Navigator>
  );
};

// Records stack
const RecordsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RecordsMain" component={RecordsScreen} />
    </Stack.Navigator>
  );
};

// Doctors stack
const DoctorsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DoctorsMain" component={DoctorsScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="Appointment" component={AppointmentScreen} />
    </Stack.Navigator>
  );
};

// Profile stack
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      {HealthGoalsScreen && <Stack.Screen name="HealthGoals" component={HealthGoalsScreen} />}
      {RemindersScreen && <Stack.Screen name="Reminders" component={RemindersScreen} />}
    </Stack.Navigator>
  );
};

// Main tab navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 100,
          paddingBottom: 20,
          paddingTop: 10,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SymptomChecker"
        component={SymptomCheckerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Records"
        component={RecordsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Doctors"
        component={DoctorsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Export stack navigators for testing purposes
export { HomeStack, ChatStack, RecordsStack, DoctorsStack, ProfileStack };

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  }
});

export default AppNavigator; 