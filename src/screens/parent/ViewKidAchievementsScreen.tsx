import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const ALL_ACHIEVEMENTS = [
  { key: 'first_task', title: 'First Steps', description: 'Complete first task', icon: 'trophy' },
  { key: 'streak_3', title: 'On Fire!', description: '3-day streak', icon: 'fire' },
  { key: 'streak_7', title: 'Week Warrior', description: '7-day streak', icon: 'fire-circle' },
  { key: 'points_50', title: 'Half Century', description: 'Earn 50 points', icon: 'star' },
  { key: 'points_100', title: 'Centurion', description: 'Earn 100 points', icon: 'star-circle' },
  { key: 'tasks_10', title: 'Getting Started', description: 'Complete 10 tasks', icon: 'checkbox-multiple-marked' },
];

const ViewKidAchievementsScreen = ({ route, navigation }: any) => {
  const { kidId, kidName } = route.params;
  const [achievements, setAchievements] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, [kidId]);

  const loadAchievements = async () => {
    try {
      const snapshot = await firestore()
        .collection('achievements')
        .where('kidId', '==', kidId)
        .get();

      const unlockedKeys = snapshot.docs.map(d => d.data().key);

      const all = ALL_ACHIEVEMENTS.map((ach, i) => ({
        ...ach,
        id: `ach_${i}`,
        unlocked: unlockedKeys.includes(ach.key),
      }));

      setAchievements(all);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{kidName}'s Achievements</Text>
        <Text style={styles.headerSub}>
          {unlockedCount} of {achievements.length} unlocked
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {achievements.map(ach => (
          <View
            key={ach.id}
            style={[styles.achCard, !ach.unlocked && styles.achCardLocked]}
          >
            <LinearGradient
              colors={ach.unlocked ? ['#43e97b', '#38f9d7'] : ['#D1D5DB', '#9CA3AF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.achIcon}
            >
              <Icon name={ach.icon} size={32} color="#FFF" />
            </LinearGradient>
            <View style={styles.achInfo}>
              <Text style={styles.achTitle}>{ach.title}</Text>
              <Text style={styles.achDesc}>{ach.description}</Text>
            </View>
            {ach.unlocked && <Icon name="check-circle" size={24} color="#10B981" />}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  headerSub: { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1, padding: SPACING.xl },
  achCard: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.md },
  achCardLocked: { opacity: 0.5, backgroundColor: '#F9FAFB' },
  achIcon: { width: 64, height: 64, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  achInfo: { flex: 1 },
  achTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: SPACING.xs },
  achDesc: { fontSize: FONT_SIZE.sm, color: '#6B7280' },
});

export default ViewKidAchievementsScreen;
