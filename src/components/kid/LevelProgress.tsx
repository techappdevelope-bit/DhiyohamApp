import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LevelProgressProps {
  level: number;
  currentPoints: number;
  nextLevelPoints?: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentPoints,
  nextLevelPoints = level * 1000, // Default: 1000 points per level
}) => {
  const colors = useThemedColors();

  const progress = (currentPoints / nextLevelPoints) * 100;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const styles = StyleSheet.create({
    container: {
      marginVertical: SPACING.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    levelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.round,
    },
    levelText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: SPACING.xs,
    },
    pointsText: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    progressBarContainer: {
      height: 12,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.sm,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: BORDER_RADIUS.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Icon name="trophy" size={16} color={colors.primary} />
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
        <Text style={styles.pointsText}>
          {currentPoints} / {nextLevelPoints}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${clampedProgress}%` }]} />
      </View>
    </View>
  );
};

export default LevelProgress;
