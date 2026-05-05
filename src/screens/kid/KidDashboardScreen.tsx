import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useTasksStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const KidDashboardScreen = ({ navigation }: any) => {
  const { user, setUser } = useAuthStore();
  const { tasks, fetchTasksByKid } = useTasksStore();
  const [kid, setKid] = useState<Kid | null>(user as Kid);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Refresh kid data from Firestore
  const refreshKidData = async () => {
    if (!kid?.id) return;
    try {
      const kidDoc = await firestore().collection('kids').doc(kid.id).get();
      if (kidDoc.exists) {
        const data = kidDoc.data();
        const updatedKid: Kid = {
          ...kid,
          points: data?.points || 0,
          level: data?.level || 1,
          streak: data?.streak || 0,
          allowanceBalance: data?.allowanceBalance || 0,
        };
        setKid(updatedKid);
        setUser(updatedKid);
      }
    } catch (error) {
      console.error('Error refreshing kid data:', error);
    }
  };

  const loadData = async () => {
    if (!kid?.id) return;
    try {
      await Promise.all([
        fetchTasksByKid(kid.id),
        refreshKidData(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Auto-refresh every 5 seconds to catch point updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshKidData();
    }, 5000);
    return () => clearInterval(interval);
  }, [kid?.id]);

  // Refresh when screen regains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshKidData();
      if (kid?.id) fetchTasksByKid(kid.id).catch(console.error);
    });
    return unsubscribe;
  }, [navigation, kid?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'approved');

  const stats = [
    { id: 'points', icon: 'star', label: 'Points', value: kid?.points || 0, gradient: ['#667eea', '#764ba2'] },
    { id: 'level', icon: 'trophy', label: 'Level', value: kid?.level || 1, gradient: ['#f093fb', '#f5576c'] },
    { id: 'streak', icon: 'fire', label: 'Streak', value: `${kid?.streak || 0}🔥`, gradient: ['#fa709a', '#fee140'] },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.greeting}>Hey there,</Text>
          <Text style={styles.name}>{kid?.name || 'Kid'}! 👋</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <LinearGradient
                key={stat.id}
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <Icon name={stat.icon} size={20} color="#FFFFFF" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>My Tasks ({pendingTasks.length})</Text>

          {pendingTasks.length > 0 ? (
            <View style={styles.tasksList}>
              {pendingTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskCard}
                  onPress={() => navigation.navigate('MyChores', { screen: 'TaskDetail', params: { taskId: task.id } })}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.taskIconContainer}
                  >
                    <Icon name="checkbox-blank-circle-outline" size={28} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskName}>{task.choreName || 'Task'}</Text>
                    <Text style={styles.taskPoints}>⭐ {task.pointsAwarded} points • Tap to complete</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Icon name="checkbox-marked-circle" size={50} color="#00D9A5" />
              </View>
              <Text style={styles.emptyText}>
                {completedTasks.length > 0 ? '🎉 All tasks done!' : 'No tasks yet!'}
              </Text>
              <Text style={styles.emptySubtext}>
                {completedTasks.length > 0
                  ? 'Amazing work! Your parent will add more.'
                  : 'Your parent will assign tasks soon!'}
              </Text>
            </View>
          )}

          {completedTasks.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
                Completed ✅ ({completedTasks.length})
              </Text>
              <View style={styles.tasksList}>
                {completedTasks.map((task) => (
                  <View key={task.id} style={styles.completedCard}>
                    <LinearGradient
                      colors={['#43e97b', '#38f9d7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.taskIconContainer}
                    >
                      <Icon name="checkbox-marked-circle" size={28} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.taskInfo}>
                      <Text style={[styles.taskName, { textDecorationLine: 'line-through', opacity: 0.6 }]}>
                        {task.choreName || 'Task'}
                      </Text>
                      <Text style={styles.taskPoints}>
                        ⭐ {task.pointsAwarded} points earned •{' '}
                        {task.status === 'approved' ? '✅ Approved' : '⏳ Pending review'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxl, paddingHorizontal: SPACING.xl },
  greeting: { fontSize: FONT_SIZE.lg, color: '#FFFFFF', opacity: 0.9, marginBottom: SPACING.xs, fontWeight: FONT_WEIGHT.medium },
  name: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF', marginBottom: SPACING.xl },
  statsRow: { flexDirection: 'row', gap: SPACING.md },
  statCard: { flex: 1, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF', marginTop: SPACING.xs },
  statLabel: { fontSize: FONT_SIZE.xs, color: '#FFFFFF', opacity: 0.9, fontWeight: FONT_WEIGHT.semibold },
  content: { flex: 1, padding: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#111827', marginBottom: SPACING.lg, marginTop: SPACING.md },
  tasksList: { gap: SPACING.md },
  taskCard: { backgroundColor: '#FFFFFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, ...SHADOWS.md, borderWidth: 1, borderColor: '#E5E7EB' },
  completedCard: { backgroundColor: '#F0FFF4', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, borderWidth: 1, borderColor: '#BBF7D0' },
  taskIconContainer: { width: 50, height: 50, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  taskInfo: { flex: 1 },
  taskName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: SPACING.xs },
  taskPoints: { fontSize: FONT_SIZE.sm, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: '#FFFFFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.xxl, ...SHADOWS.sm },
  emptyIcon: { width: 100, height: 100, borderRadius: BORDER_RADIUS.xl, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  emptyText: { fontSize: FONT_SIZE.lg, color: '#111827', marginTop: SPACING.md, fontWeight: FONT_WEIGHT.bold },
  emptySubtext: { fontSize: FONT_SIZE.sm, color: '#6B7280', marginTop: SPACING.xs, textAlign: 'center' },
});

export default KidDashboardScreen;
