import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useTasksStore, useAchievementsStore } from '../../store';
import { Avatar, Badge } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const KidDetailScreen = ({ route, navigation }: any) => {
  const colors = useThemedColors();
  const { kid } = route.params;
  const { tasks, fetchTasksByKid } = useTasksStore();
  const { achievements, fetchAchievements } = useAchievementsStore();

  useEffect(() => {
    if (kid?.id) {
      fetchTasksByKid(kid.id);
      fetchAchievements(kid.id);
    }
  }, [kid?.id]);

  const completedTasks = tasks.filter(t => t.status === 'approved').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  const menuItems = [
    {
      id: 'tasks',
      title: 'View All Tasks',
      icon: 'clipboard-list',
      value: `${tasks.length} total`,
      onPress: () => {},
    },
    {
      id: 'achievements',
      title: 'Achievements',
      icon: 'trophy',
      value: `${achievements.length} unlocked`,
      onPress: () => {},
    },
    {
      id: 'allowance',
      title: 'Allowance History',
      icon: 'cash',
      value: `$${kid.allowanceBalance.toFixed(2)}`,
      onPress: () => {},
    },
    {
      id: 'edit',
      title: 'Edit Kid Profile',
      icon: 'pencil',
      value: '',
      onPress: () => {},
    },
  ];

  const handleDeleteKid = () => {
    Alert.alert(
      'Delete Kid',
      `Are you sure you want to remove ${kid.name} from your family? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete logic here
            navigation.goBack();
          },
        },
      ]
    );
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
      backgroundColor: colors.surface,
    },
    backButton: {
      padding: SPACING.sm,
      marginRight: SPACING.md,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: colors.text,
    },
    profileSection: {
      alignItems: 'center',
      padding: SPACING.xxl,
      backgroundColor: kid.themeColor || colors.primary,
    },
    name: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: SPACING.lg,
      marginBottom: SPACING.xs,
    },
    age: {
      fontSize: FONT_SIZE.md,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: SPACING.xl,
      gap: SPACING.md,
    },
    statBox: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      alignItems: 'center',
    },
    statValue: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: FONT_SIZE.xs,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    menuText: {
      flex: 1,
      fontSize: FONT_SIZE.md,
      fontWeight: '500',
      color: colors.text,
    },
    menuValue: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      marginRight: SPACING.sm,
    },
    deleteButton: {
      backgroundColor: colors.error + '20',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.lg,
    },
    deleteButtonText: {
      fontSize: FONT_SIZE.md,
      fontWeight: '600',
      color: colors.error,
      marginLeft: SPACING.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kid Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar size={100} />
          <Text style={styles.name}>{kid.name}</Text>
          <Text style={styles.age}>{kid.age} years old</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{kid.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{kid.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{kid.streak}🔥</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.scrollContent}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuIcon}>
                  <Icon name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                <Icon name="chevron-right" size={24} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteKid}>
            <Icon name="delete" size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Remove Kid</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default KidDetailScreen;