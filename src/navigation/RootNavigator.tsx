import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import AuthNavigator from './AuthNavigator';
import ParentNavigator from './ParentNavigator';
import KidNavigator from './KidNavigator';

const RootNavigator = () => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { loadTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([
          checkAuth(),
          loadTheme(),
        ]);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  const getNavigator = () => {
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
    }

    if (user.role === 'parent') {
      return <ParentNavigator />;
    }

    return <KidNavigator />;
  };

  return (
    <NavigationContainer>
      {getNavigator()}
    </NavigationContainer>
  );
};

export default RootNavigator;
