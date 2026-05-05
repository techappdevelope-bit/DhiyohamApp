import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const NotificationSettingsScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();

  const [settings, setSettings] = useState({
    taskCompleted: true,
    taskApproved: true,
    rewardRequested: true,
    dailyReminder: true,
    weeklyReport: false,
    achievements: true,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));

    Toast.show({
      type: 'success',
      text1: 'Setting Updated',
      visibilityTime: 2000,
    });
  };

  const notificationOptions = [
    {
      key: 'taskCompleted',
      title: 'Task Completed',
      description: 'When a kid completes a task',
      icon: 'checkbox-marked-circle',
    },
    {
      key: 'taskApproved',
      title: 'Task Approved',
      description: 'When you approve a task',
      icon: 'check-circle',
    },
    {
      key: 'rewardRequested',
      title: 'Reward Requested',
      description: 'When a kid requests a reward',
      icon: 'gift',
    },
    {
      key: 'dailyReminder',
      title: 'Daily Reminder',
      description: 'Daily summary of pending tasks',
      icon: 'clock-alert',
    },
    {
      key: 'weeklyReport',
      title: 'Weekly Report',
      description: 'Weekly progress summary',
      icon: 'chart-line',
    },
    {
      key: 'achievements',
      title: 'Achievements',
      description: 'When a kid unlocks an achievement',
      icon: 'trophy',
    },
  ];

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
    scrollContent: {
      padding: SPACING.xl,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    settingDescription: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <View style={styles.card}>
            {notificationOptions.map((option, index) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.settingItem,
                  index === notificationOptions.length - 1 && styles.settingItemLast,
                ]}
                onPress={() => toggleSetting(option.key)}
              >
                <View style={styles.settingIcon}>
                  <Icon name={option.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingDescription}>{option.description}</Text>
                </View>
                <Icon
                  name={settings[option.key as keyof typeof settings] ? 'toggle-switch' : 'toggle-switch-off'}
                  size={48}
                  color={settings[option.key as keyof typeof settings] ? colors.primary : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettingsScreen;
