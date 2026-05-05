import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BadgeProps {
  label: string;
  iconName?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  iconName,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const colors = useThemedColors();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary + '20';
      case 'secondary':
        return colors.secondary + '20';
      case 'success':
        return colors.success + '20';
      case 'warning':
        return colors.warning + '20';
      case 'error':
        return colors.error + '20';
      case 'info':
        return colors.info + '20';
      default:
        return colors.primary + '20';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: SPACING.sm, paddingVertical: 4 };
      case 'large':
        return { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm };
      default:
        return { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return FONT_SIZE.xs;
      case 'large':
        return FONT_SIZE.md;
      default:
        return FONT_SIZE.sm;
    }
  };

  const styles = StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: getBackgroundColor(),
      borderRadius: BORDER_RADIUS.round,
      ...getPadding(),
    },
    text: {
      fontSize: getFontSize(),
      fontWeight: '600',
      color: getTextColor(),
    },
    icon: {
      marginRight: SPACING.xs,
    },
  });

  return (
    <View style={[styles.badge, style]}>
      {iconName && (
        <Icon name={iconName} size={getFontSize()} color={getTextColor()} style={styles.icon} />
      )}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export default Badge;
