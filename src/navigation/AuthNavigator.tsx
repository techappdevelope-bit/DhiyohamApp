import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ParentLoginScreen from '../screens/auth/ParentLoginScreen';
import ParentRegisterScreen from '../screens/auth/ParentRegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import KidLoginScreen from '../screens/auth/KidLoginScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />
      <Stack.Screen name="ParentRegister" component={ParentRegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="KidLogin" component={KidLoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
