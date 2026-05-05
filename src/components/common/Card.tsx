import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
  shadow?: keyof typeof SHADOWS;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'lg',
  shadow = 'sm',
}) => {
  const colors = useThemedColors();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING[padding],
      ...SHADOWS[shadow],
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;
