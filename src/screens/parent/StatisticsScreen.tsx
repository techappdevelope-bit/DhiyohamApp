import React, { useEffect, useState } from 'react';
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
import { useAuthStore, useKidsStore, useTasksStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const StatisticsScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { kids } = useKidsStore();
  const { tasks } = useTasksStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  // Sample data - replace with real calculations
  const tasksCompletedData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [12, 8, 14, 10, 16, 20, 15],
      },
    ],
  };

  const kidPerformanceData = kids.map((kid, index) => ({
    name: kid.name,
    population: kid.points,
    color: ['#6C63FF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3'][index % 5],
    legendFontColor: colors.text,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => colors.text,
    propsForLabels: {
      fontSize: 10,
    },
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
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xs,
      marginBottom: SPACING.xl,
      ...SHADOWS.sm,
    },
    periodButton: {
      flex: 1,
      paddingVertical: SPACING.sm,
      alignItems: 'center',
      borderRadius: BORDER_RADIUS.md,
    },
    periodButtonActive: {
      backgroundColor: colors.primary,
    },
    periodText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '600',
      color: colors.text,
    },
    periodTextActive: {
      color: '#FFFFFF',
    },
    sectionTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: SPACING.xl,
      marginBottom: SPACING.md,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      ...SHADOWS.md,
    },
    chartTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.lg,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
      marginBottom: SPACING.xl,
    },
    statBox: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      alignItems: 'center',
      ...SHADOWS.sm,
    },
    statIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    statValue: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics & Insights</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id as any)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
              <Icon name="check-circle" size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>95</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="star" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>1,240</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
              <Icon name="fire" size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Days Streak</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
              <Icon name="trophy" size={24} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Tasks Completed Chart */}
        <Text style={styles.sectionTitle}>Tasks Completed</Text>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Activity</Text>
          <BarChart
            data={tasksCompletedData}
            width={width - SPACING.xl * 4}
            height={220}
            chartConfig={chartConfig}
            style={{ borderRadius: BORDER_RADIUS.md }}
          />
        </View>

        {/* Kid Performance */}
        {kids.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Kid Performance</Text>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Points Distribution</Text>
              <PieChart
                data={kidPerformanceData}
                width={width - SPACING.xl * 4}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default StatisticsScreen;
