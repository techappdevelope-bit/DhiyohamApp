import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Task } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Badge from '../common/Badge';

interface TaskCardProps {
  task: Task;
  choreName: string;
  choreIcon?: string;
  onPress?: () => void;
  showCheckbox?: boolean;
  onCheckboxPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  choreName,
  choreIcon = 'format-list-checks',
  onPress,
  showCheckbox = false,
  onCheckboxPress,
}) => {
  const colors = useThemedColors();

  const getStatusBadge = () => {
    switch (task.status) {
      case 'pending':
        return { label: 'To Do', variant: 'info' as const };
      case 'completed':
        return { label: 'Done!', variant: 'warning' as const };
      case 'approved':
        return { label: 'Approved', variant: 'success' as const };
      case 'rejected':
        return { label: 'Try Again', variant: 'error' as const };
      default:
        return { label: 'To Do', variant: 'info' as const };
    }
  };

  const badge = getStatusBadge();

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
      alignItems: 'center',
    },
    checkbox: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: task.status === 'approved' ? colors.success : colors.primary,
      backgroundColor: task.status === 'approved' ? colors.success : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
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
    points: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pointsText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: SPACING.xs,
    },
    badge: {
      marginTop: SPACING.sm,
      alignSelf: 'flex-start',
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        {showCheckbox && (
          <TouchableOpacity style={styles.checkbox} onPress={onCheckboxPress}>
            {task.status === 'approved' && <Icon name="check" size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        )}

        <View style={styles.iconContainer}>
          <Icon name={choreIcon} size={24} color={colors.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{choreName}</Text>
          <View style={styles.points}>
            <Icon name="star" size={16} color={colors.primary} />
            <Text style={styles.pointsText}>
              {task.pointsAwarded || 0} points
              {task.bonusPoints ? ` (+${task.bonusPoints} bonus!)` : ''}
            </Text>
          </View>
        </View>
      </View>

      <Badge label={badge.label} variant={badge.variant} size="small" style={styles.badge} />
    </TouchableOpacity>
  );
};

export default TaskCard;
