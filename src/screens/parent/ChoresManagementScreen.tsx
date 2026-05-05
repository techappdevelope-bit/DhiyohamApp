import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useTasksStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const ChoresManagementScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { tasks, fetchTasksByParent, deleteTask } = useTasksStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  const loadTasks = async () => {
    if (!user?.id) return;
    try {
      await fetchTasksByParent(user.id);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chores</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Add Chore Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateChore')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addGradient}
          >
            <Icon name="plus-circle" size={32} color="#FFF" />
            <Text style={styles.addText}>Create New Chore</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="clipboard-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No chores yet!</Text>
            <Text style={styles.emptySub}>Create your first chore to get started</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{task.choreName}</Text>
                <Text style={styles.taskPoints}>⭐ {task.pointsAwarded} points</Text>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="pencil" size={20} color="#667eea" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => deleteTask(task.id)}
                >
                  <Icon name="delete" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: '#111827',
  },
  content: { flex: 1, padding: SPACING.xl },
  addBtn: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  addGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  addText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#374151',
    marginTop: SPACING.lg,
  },
  emptySub: {
    fontSize: FONT_SIZE.md,
    color: '#9CA3AF',
    marginTop: SPACING.xs,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  },
  taskActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChoresManagementScreen;
