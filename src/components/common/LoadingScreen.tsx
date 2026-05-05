import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';

const LoadingScreen = () => {
  const colors = useThemedColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default LoadingScreen;
