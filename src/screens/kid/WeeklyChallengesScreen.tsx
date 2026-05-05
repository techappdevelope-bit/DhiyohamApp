import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const WeeklyChallengesScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const kid = user as Kid;

  // Sample challenges
  const challenges = [
    {
      id: 1,
      title: '7-Day Streak Master',
      description: 'Complete at least 1 task every day for 7 days',
      icon: 'fire',
      progress: 5,
      target: 7,
      reward: 500,
      color: ['#FF6B6B', '#FF8E53'],
      difficulty: 'hard',
    },
    {
      id: 2,
      title: 'Speed Demon',
      description: 'Complete 10 tasks in one day',
      icon: 'flash',
      progress: 7,
      target: 10,
      reward: 200,
      color: ['#FFD93D', '#FFB627'],
      difficulty: 'medium',
    },
    {
      id: 3,
      title: 'Photo Pro',
      description: 'Upload photo proof for 5 tasks',
      icon: 'camera',
      progress: 3,
      target: 5,
      reward: 150,
      color: ['#6C63FF', '#4ECDC4'],
      difficulty: 'easy',
    },
    {
      id: 4,
      title: 'Early Bird',
      description: 'Complete morning routine before 8 AM for 5 days',
      icon: 'weather-sunset-up',
      progress: 2,
      target: 5,
      reward: 300,
      color: ['#95E1D3', '#4ECDC4'],
      difficulty: 'medium',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
      paddingBottom: SPACING.xxxl,
      backgroundColor: kid?.themeColor || colors.primary,
    },
    backButton: {
      position: 'absolute',
      top: SPACING.xxl,
      left: SPACING.lg,
      padding: SPACING.sm,
      zIndex: 1,
    },
    headerContent: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: SPACING.sm,
    },
    headerSubtitle: {
      fontSize: FONT_SIZE.md,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    timerCard: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginTop: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerText: {
      fontSize: FONT_SIZE.md,
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: SPACING.sm,
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    challengeCard: {
      borderRadius: BORDER_RADIUS.xl,
      marginBottom: SPACING.lg,
      overflow: 'hidden',
      ...SHADOWS.lg,
    },
    challengeGradient: {
      padding: SPACING.lg,
    },
    challengeHeader: {
      flexDirection: 'row',
      marginBottom: SPACING.md,
    },
    challengeIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    challengeInfo: {
      flex: 1,
    },
    challengeTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: SPACING.xs,
    },
    difficultyBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
    difficultyText: {
      fontSize: FONT_SIZE.xs,
      color: '#FFFFFF',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    challengeDescription: {
      fontSize: FONT_SIZE.sm,
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: SPACING.lg,
      lineHeight: 20,
    },
    progressContainer: {
      marginBottom: SPACING.md,
    },
    progressBar: {
      height: 8,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: BORDER_RADIUS.round,
      overflow: 'hidden',
      marginBottom: SPACING.xs,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: BORDER_RADIUS.round,
    },
    progressText: {
      fontSize: FONT_SIZE.sm,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    rewardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rewardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rewardText: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: SPACING.xs,
    },
    claimButton: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.round,
    },
    claimButtonText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: 'bold',
      color: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>⚡ Weekly Challenges</Text>
          <Text style={styles.headerSubtitle}>Complete for bonus points!</Text>

          <View style={styles.timerCard}>
            <Icon name="timer-sand" size={20} color="#FFFFFF" />
            <Text style={styles.timerText}>Resets in 2 days, 5 hours</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {challenges.map((challenge) => {
          const progress = (challenge.progress / challenge.target) * 100;
          const isCompleted = challenge.progress >= challenge.target;

          return (
            <View key={challenge.id} style={styles.challengeCard}>
              <LinearGradient
                colors={challenge.color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.challengeGradient}
              >
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeIcon}>
                    <Icon name={challenge.icon} size={30} color="#FFFFFF" />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.challengeDescription}>{challenge.description}</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {challenge.progress} / {challenge.target} completed
                  </Text>
                </View>

                <View style={styles.rewardRow}>
                  <View style={styles.rewardContainer}>
                    <Icon name="star" size={24} color="#FFFFFF" />
                    <Text style={styles.rewardText}>+{challenge.reward}</Text>
                  </View>

                  {isCompleted ? (
                    <TouchableOpacity style={styles.claimButton}>
                      <Text style={styles.claimButtonText}>Claim Reward</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.claimButton}>
                      <Text style={[styles.claimButtonText, { opacity: 0.5 }]}>
                        {Math.round(100 - progress)}% left
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default WeeklyChallengesScreen;
