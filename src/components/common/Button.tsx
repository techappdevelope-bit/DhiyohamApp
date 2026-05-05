import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const colors = useThemedColors();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = SPACING.sm;
        baseStyle.paddingHorizontal = SPACING.md;
        break;
      case 'large':
        baseStyle.paddingVertical = SPACING.lg;
        baseStyle.paddingHorizontal = SPACING.xl;
        break;
      default:
        baseStyle.paddingVertical = SPACING.md;
        baseStyle.paddingHorizontal = SPACING.lg;
    }

    // Variant
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = colors.primary;
        if (!disabled) {
          Object.assign(baseStyle, SHADOWS.sm);
        }
        break;
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        if (!disabled) {
          Object.assign(baseStyle, SHADOWS.sm);
        }
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = colors.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    // Disabled
    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size
    switch (size) {
      case 'small':
        baseStyle.fontSize = FONT_SIZE.sm;
        break;
      case 'large':
        baseStyle.fontSize = FONT_SIZE.lg;
        break;
      default:
        baseStyle.fontSize = FONT_SIZE.md;
    }

    // Variant
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle.color = '#FFFFFF';
        break;
      case 'outline':
      case 'text':
        baseStyle.color = colors.primary;
        break;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={getTextStyle().color}
              style={{ marginRight: SPACING.xs }}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
