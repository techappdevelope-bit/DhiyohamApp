import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Kid } from '../../types';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface KidCardProps {
  kid: Kid;
  onPress?: () => void;
  showStats?: boolean;
}

const KidCard: React.FC<KidCardProps> = ({ kid, onPress, showStats = true }) => {
  const colors = useThemedColors();

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
      marginBottom: showStats ? SPACING.md : 0,
    },
    avatar: {
      marginRight: SPACING.md,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    age: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: FONT_SIZE.xs,
      color: colors.textLight,
    },
    chevron: {
      marginLeft: SPACING.sm,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Avatar uri={kid.avatar.background} size={60} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{kid.name}</Text>
          <Text style={styles.age}>{kid.age} years old</Text>
        </View>
        {onPress && <Icon name="chevron-right" size={24} color={colors.textLight} style={styles.chevron} />}
      </View>

      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{kid.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{kid.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{kid.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${kid.allowanceBalance.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Balance</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default KidCard;
