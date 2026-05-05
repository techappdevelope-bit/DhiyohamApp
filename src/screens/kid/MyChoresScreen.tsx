import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useTasksStore } from '../../store';
import { Kid, Task } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const FILTERS = ['All', 'Pending', 'Completed'];

const MyChoresScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { tasks, fetchTasksByKid } = useTasksStore();
  const kid = user as Kid;
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    if (kid?.id) {
      await fetchTasksByKid(kid.id).catch(console.error);
    }
  };

  useEffect(() => { loadTasks(); }, [kid?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // Filter tasks based on selected filter - NO external function needed
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return task.status === 'pending';
    if (filter === 'Completed') return task.status === 'completed' || task.status === 'approved';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':   return '#F59E0B';
      case 'completed': return '#3B82F6';
      case 'approved':  return '#10B981';
      case 'rejected':  return '#EF4444';
      default:          return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':   return 'To Do';
      case 'completed': return 'Waiting';
      case 'approved':  return 'Approved';
      case 'rejected':  return 'Rejected';
      default:          return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':   return 'clock-outline';
      case 'completed': return 'clock-check-outline';
      case 'approved':  return 'check-circle';
      case 'rejected':  return 'close-circle';
      default:          return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Chores</Text>
        <Text style={styles.headerSub}>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</Text>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
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
            <Text style={styles.emptySub}>
              {filter === 'All' ? 'Your parent will assign tasks soon!' : `No ${filter.toLowerCase()} tasks`}
            </Text>
          </View>
        ) : (
          filteredTasks.map(task => {
            const statusColor = getStatusColor(task.status);
            const isDone = task.status !== 'pending';
            return (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isDone ? ['#43e97b', '#38f9d7'] : ['#4facfe', '#00f2fe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.taskIcon}
                >
                  <Icon
                    name={isDone ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                    size={26}
                    color="#FFF"
                  />
                </LinearGradient>

                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.choreName || 'Task'}</Text>
                  <Text style={styles.taskPoints}>⭐ {task.pointsAwarded} points</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                  <Icon name={getStatusIcon(task.status)} size={14} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {getStatusLabel(task.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F5F5F5' },
  header:          { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
  headerTitle:     { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  headerSub:       { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
  filterRow:       { flexDirection: 'row', backgroundColor: '#FFF', padding: SPACING.sm, gap: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filterTab:       { flex: 1, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: '#F3F4F6' },
  filterTabActive: { backgroundColor: '#4facfe' },
  filterText:      { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: '#6B7280' },
  filterTextActive:{ color: '#FFF' },
  content:         { flex: 1, padding: SPACING.xl },
  empty:           { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, marginTop: SPACING.xl, ...SHADOWS.sm },
  emptyTitle:      { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginTop: SPACING.lg },
  emptySub:        { fontSize: FONT_SIZE.md, color: '#9CA3AF', marginTop: SPACING.xs, textAlign: 'center', paddingHorizontal: SPACING.xl },
  taskCard:        { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.md },
  taskIcon:        { width: 50, height: 50, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  taskInfo:        { flex: 1 },
  taskName:        { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: SPACING.xs },
  taskPoints:      { fontSize: FONT_SIZE.sm, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
  statusBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.round },
  statusText:      { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold },
});

export default MyChoresScreen;
