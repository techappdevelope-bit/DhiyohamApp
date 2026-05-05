import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useKidsStore } from '../../store';
import { Avatar } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const FamilyStatsScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { kids } = useKidsStore();

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      paddingTop: SPACING.xxl,
      backgroundColor: colors.primary,
    },
    backButton: {
      padding: SPACING.sm,
      marginRight: SPACING.md,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      marginBottom: SPACING.xl,
      ...SHADOWS.md,
    },
    summaryTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.lg,
      textAlign: 'center',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
    },
    statBox: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      alignItems: 'center',
    },
    statValue: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: FONT_SIZE.xs,
      color: colors.textLight,
      textAlign: 'center',
    },
    kidCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      ...SHADOWS.sm,
    },
    kidHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    kidInfo: {
      flex: 1,
      marginLeft: SPACING.md,
    },
    kidName: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
    },
    kidLevel: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    metricsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    metricItem: {
      alignItems: 'center',
    },
    metricValue: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
    },
    metricLabel: {
      fontSize: FONT_SIZE.xs,
      color: colors.textLight,
      marginTop: SPACING.xs,
    },
  });

  const totalPoints = kids.reduce((sum, kid) => sum + kid.points, 0);
  const totalTasks = 142; // Sample
  const averageStreak = kids.reduce((sum, kid) => sum + kid.streak, 0) / (kids.length || 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Stats</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overall Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Overall Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{kids.length}</Text>
              <Text style={styles.statLabel}>Total Kids</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{Math.round(averageStreak)}</Text>
              <Text style={styles.statLabel}>Avg Streak</Text>
            </View>
          </View>
        </View>

        {/* Individual Kid Stats */}
        {kids.map((kid) => (
          <View key={kid.id} style={styles.kidCard}>
            <View style={styles.kidHeader}>
              <Avatar size={60} />
              <View style={styles.kidInfo}>
                <Text style={styles.kidName}>{kid.name}</Text>
                <Text style={styles.kidLevel}>Level {kid.level}</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{kid.points}</Text>
                <Text style={styles.metricLabel}>Points</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{kid.streak}🔥</Text>
                <Text style={styles.metricLabel}>Streak</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>${kid.allowanceBalance.toFixed(2)}</Text>
                <Text style={styles.metricLabel}>Balance</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FamilyStatsScreen;
