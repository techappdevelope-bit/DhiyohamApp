import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const ViewKidTasksScreen = ({ route, navigation }: any) => {
  const { kidId, kidName } = route.params;
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    loadTasks();
  }, [kidId]);

  const loadTasks = async () => {
    try {
      const snapshot = await firestore()
        .collection('tasks')
        .where('kidId', '==', kidId)
        .get();

      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(tasksList);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed' || task.status === 'approved';
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'To Do', color: '#F59E0B', icon: 'clock-outline' };
      case 'completed': return { label: 'Waiting', color: '#3B82F6', icon: 'clock-check-outline' };
      case 'approved': return { label: 'Approved', color: '#10B981', icon: 'check-circle' };
      case 'rejected': return { label: 'Rejected', color: '#EF4444', icon: 'close-circle' };
      default: return { label: status, color: '#6B7280', icon: 'help-circle' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{kidName}'s Tasks</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['all', 'pending', 'completed'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredTasks.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="clipboard-check-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tasks here!</Text>
          </View>
        ) : (
          filteredTasks.map(task => {
            const statusConfig = getStatusConfig(task.status);
            return (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.choreName}</Text>
                  <Text style={styles.taskPoints}>⭐ {task.pointsAwarded} points</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                  <Icon name={statusConfig.icon} size={14} color={statusConfig.color} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.label}
                  </Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: { backgroundColor: '#667eea' },
  filterText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#6B7280',
  },
  filterTextActive: { color: '#FFF' },
  content: { flex: 1, padding: SPACING.xl },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#374151',
    marginTop: SPACING.lg,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  taskInfo: { flex: 1 },
  taskName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
    marginBottom: SPACING.xs,
  },
  taskPoints: {
    fontSize: FONT_SIZE.sm,
    color: '#6B7280',
    fontWeight: FONT_WEIGHT.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
});

export default ViewKidTasksScreen;
