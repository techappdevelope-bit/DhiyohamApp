import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerStyle,
  ...textInputProps
}) => {
  const colors = useThemedColors();
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SPACING.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
      paddingHorizontal: SPACING.md,
    },
    icon: {
      marginRight: SPACING.sm,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      fontSize: FONT_SIZE.md,
      color: colors.text,
    },
    error: {
      fontSize: FONT_SIZE.xs,
      color: colors.error,
      marginTop: SPACING.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.textLight}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;
