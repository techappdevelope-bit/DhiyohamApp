import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';

interface EmptyStateProps {
  iconName: string;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  iconName,
  title,
  message,
  buttonText,
  onButtonPress,
}) => {
  const colors = useThemedColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xxl,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + '10',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: FONT_SIZE.md,
      color: colors.textLight,
      textAlign: 'center',
      marginBottom: SPACING.xl,
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={50} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && onButtonPress && (
        <Button title={buttonText} onPress={onButtonPress} variant="primary" />
      )}
    </View>
  );
};

export default EmptyState;
