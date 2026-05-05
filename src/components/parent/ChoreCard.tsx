import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Chore } from '../../types';
import Badge from '../common/Badge';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ChoreCardProps {
  chore: Chore;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({ chore, onPress, onEdit, onDelete }) => {
  const colors = useThemedColors();

  const getDifficultyColor = () => {
    switch (chore.difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'info';
    }
  };

  const getFrequencyIcon = () => {
    switch (chore.frequency) {
      case 'daily':
        return 'calendar-today';
      case 'weekly':
        return 'calendar-week';
      case 'one-time':
        return 'calendar-check';
      default:
        return 'calendar';
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      ...SHADOWS.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    description: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      marginBottom: SPACING.sm,
    },
    badges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.xs,
      marginBottom: SPACING.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    points: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pointsText: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: SPACING.xs,
    },
    actions: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    actionButton: {
      padding: SPACING.sm,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name={chore.iconName} size={24} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{chore.name}</Text>
          {chore.description && <Text style={styles.description}>{chore.description}</Text>}
        </View>
      </View>

      <View style={styles.badges}>
        <Badge label={chore.category} variant="info" size="small" />
        <Badge label={chore.difficulty} variant={getDifficultyColor() as any} size="small" />
        <Badge
          label={chore.frequency}
          iconName={getFrequencyIcon()}
          variant="secondary"
          size="small"
        />
        {chore.requiresPhoto && (
          <Badge label="Photo Required" iconName="camera" variant="warning" size="small" />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.points}>
          <Icon name="star" size={20} color={colors.primary} />
          <Text style={styles.pointsText}>{chore.points} points</Text>
        </View>

        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Icon name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Icon name="delete" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChoreCard;
