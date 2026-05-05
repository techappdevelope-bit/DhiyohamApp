import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const ACHIEVEMENTS: Omit<Achievement, 'id' | 'unlocked' | 'unlockedAt'>[] = [
  { key: 'first_task', title: 'First Steps', description: 'Complete your first task', icon: 'trophy' },
  { key: 'streak_3', title: 'On Fire!', description: 'Maintain a 3-day streak', icon: 'fire' },
  { key: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'fire-circle' },
  { key: 'points_50', title: 'Half Century', description: 'Earn 50 points', icon: 'star' },
  { key: 'points_100', title: 'Centurion', description: 'Earn 100 points', icon: 'star-circle' },
  { key: 'tasks_10', title: 'Getting Started', description: 'Complete 10 tasks', icon: 'checkbox-multiple-marked' },
  { key: 'tasks_50', title: 'Task Master', description: 'Complete 50 tasks', icon: 'medal' },
  { key: 'perfect_week', title: 'Perfect Week', description: 'Complete all tasks for a week', icon: 'crown' },
];

const AchievementsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const kid = user as Kid;
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAchievements = async () => {
    if (!kid?.id) return;
    try {
      const snapshot = await firestore()
        .collection('achievements')
        .where('kidId', '==', kid.id)
        .get();

      const unlockedKeys = snapshot.docs.map(doc => doc.data().key);

      const allAchievements = ACHIEVEMENTS.map((ach, index) => ({
        ...ach,
        id: `ach_${index}`,
        unlocked: unlockedKeys.includes(ach.key),
        unlockedAt: snapshot.docs.find(d => d.data().key === ach.key)?.data().unlockedAt?.toDate(),
      }));

      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [kid?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAchievements();
    setRefreshing(false);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Achievements</Text>
        <Text style={styles.headerSub}>
          {unlockedCount} of {achievements.length} unlocked
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementCardLocked,
            ]}
          >
            <LinearGradient
              colors={achievement.unlocked ? ['#43e97b', '#38f9d7'] : ['#D1D5DB', '#9CA3AF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.achievementIcon}
            >
              <Icon
                name={achievement.icon}
                size={32}
                color="#FFFFFF"
              />
            </LinearGradient>

            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDesc}>
                {achievement.description}
              </Text>
              {achievement.unlocked && achievement.unlockedAt && (
                <Text style={styles.achievementDate}>
                  Unlocked {achievement.unlockedAt.toLocaleDateString()}
                </Text>
              )}
            </View>

            {achievement.unlocked && (
              <Icon name="check-circle" size={24} color="#10B981" />
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  content: { flex: 1, padding: SPACING.xl },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementCardLocked: {
    opacity: 0.5,
    backgroundColor: '#F9FAFB',
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: { flex: 1 },
  achievementTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
    marginBottom: SPACING.xs,
  },
  achievementDesc: {
    fontSize: FONT_SIZE.sm,
    color: '#6B7280',
    marginBottom: SPACING.xs,
  },
  achievementDate: {
    fontSize: FONT_SIZE.xs,
    color: '#10B981',
    fontWeight: FONT_WEIGHT.semibold,
  },
});

export default AchievementsScreen;
