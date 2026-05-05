import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PointsCounterProps {
  points: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const PointsCounter: React.FC<PointsCounterProps> = ({
  points,
  size = 'medium',
  showLabel = true,
}) => {
  const colors = useThemedColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevPoints = useRef(points);

  useEffect(() => {
    if (points !== prevPoints.current) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      prevPoints.current = points;
    }
  }, [points]);

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return FONT_SIZE.lg;
      case 'large':
        return FONT_SIZE.xxxl;
      default:
        return FONT_SIZE.xxl;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 40;
      default:
        return 30;
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    pointsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    points: {
      fontSize: getFontSize(),
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: SPACING.xs,
    },
    label: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      marginTop: SPACING.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pointsContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Icon name="star" size={getIconSize()} color={colors.primary} />
        <Text style={styles.points}>{points.toLocaleString()}</Text>
      </Animated.View>
      {showLabel && <Text style={styles.label}>Total Points</Text>}
    </View>
  );
};

export default PointsCounter;
