import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AvatarProps {
  uri?: string;
  size?: number;
  iconName?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 50,
  iconName = 'account',
  backgroundColor,
  style,
}) => {
  const colors = useThemedColors();

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: backgroundColor || colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: size,
      height: size,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <Icon name={iconName} size={size * 0.5} color={colors.primary} />
      )}
    </View>
  );
};

export default Avatar;
