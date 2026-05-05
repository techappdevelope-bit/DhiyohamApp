import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useKidsStore, useTasksStore } from '../../store';
import { Parent, Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const PendingApprovalsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { kids, fetchKids } = useKidsStore();
  const parent = user as Parent;

  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPendingTasks = async () => {
    if (!parent?.id) return;
    try {
      // Fetch all kids for this parent
      await fetchKids(parent.id);

      // Get all kids IDs
      const kidsSnap = await firestore()
        .collection('kids')
        .where('parentId', '==', parent.id)
        .get();

      const kidIds = kidsSnap.docs.map(d => d.id);
      const kidMap: Record<string, string> = {};
      kidsSnap.docs.forEach(d => { kidMap[d.id] = d.data().name; });

      if (kidIds.length === 0) {
        setPendingTasks([]);
        return;
      }

      // Get completed (pending approval) tasks for all kids
      const tasksSnap = await firestore()
        .collection('tasks')
        .where('status', '==', 'completed')
        .get();

      // Filter only tasks belonging to this parent's kids
      const tasks = tasksSnap.docs
        .filter(d => kidIds.includes(d.data().kidId))
        .map(d => {
          const data = d.data();
          return {
            id: d.id,
            choreName: data.choreName || 'Task',
            kidId: data.kidId,
            kidName: kidMap[data.kidId] || 'Kid',
            pointsAwarded: data.pointsAwarded || 0,
            completedAt: data.completedAt?.toDate?.() ?? new Date(),
            status: data.status,
          };
        });

      setPendingTasks(tasks);
    } catch (error) {
      console.error('Error loading pending tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingTasks();
  }, [parent?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingTasks();
    setRefreshing(false);
  };

  const handleApprove = async (taskId: string, kidId: string, points: number, choreName: string) => {
    Alert.alert(
      'Approve Task?',
      `Approve "${choreName}" and award ${points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve ✅',
          onPress: async () => {
            try {
              // Update task status
              await firestore().collection('tasks').doc(taskId).update({
                status: 'approved',
                approvedAt: firestore.Timestamp.now(),
              });

              // Add points to kid
              const kidRef = firestore().collection('kids').doc(kidId);
              const kidDoc = await kidRef.get();
              const currentPoints = kidDoc.data()?.points || 0;
              await kidRef.update({ points: currentPoints + points });

              // Remove from list
              setPendingTasks(prev => prev.filter(t => t.id !== taskId));
              Alert.alert('Approved! 🎉', `${points} points added!`);
            } catch (error) {
              Alert.alert('Error', 'Failed to approve task');
            }
          },
        },
      ]
    );
  };

  const handleReject = async (taskId: string, choreName: string) => {
    Alert.alert(
      'Reject Task?',
      `Reject "${choreName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject ❌',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('tasks').doc(taskId).update({
                status: 'rejected',
                rejectionComment: 'Please try again.',
              });
              setPendingTasks(prev => prev.filter(t => t.id !== taskId));
            } catch {
              Alert.alert('Error', 'Failed to reject task');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
        <Text style={styles.headerSub}>
          {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} waiting
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {pendingTasks.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="check-circle-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No tasks waiting for approval</Text>
          </View>
        ) : (
          pendingTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskTop}>
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.kidAvatar}
                >
                  <Text style={styles.kidInitial}>
                    {task.kidName.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.choreName}</Text>
                  <Text style={styles.kidName}>{task.kidName}</Text>
                  <Text style={styles.taskMeta}>
                    ⭐ {task.pointsAwarded} pts •{' '}
                    {task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString()
                      : 'Today'}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(task.id, task.choreName)}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={20} color="#EF4444" />
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleApprove(task.id, task.kidId, task.pointsAwarded, task.choreName)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#43e97b', '#38f9d7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.approveBtn}
                  >
                    <Icon name="check" size={20} color="#FFF" />
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </LinearGradient>
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
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  headerSub:   { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
  content:     { flex: 1, padding: SPACING.xl },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    marginTop: SPACING.xl,
    ...SHADOWS.sm,
  },
  emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginTop: SPACING.lg },
  emptySub:   { fontSize: FONT_SIZE.md, color: '#9CA3AF', marginTop: SPACING.xs },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  taskTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  kidAvatar: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
  },
  kidInitial: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  taskInfo:   { flex: 1 },
  taskName:   { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: 2 },
  kidName:    { fontSize: FONT_SIZE.sm, color: '#667eea', fontWeight: FONT_WEIGHT.semibold, marginBottom: 2 },
  taskMeta:   { fontSize: FONT_SIZE.sm, color: '#6B7280' },
  actions:    { flexDirection: 'row', gap: SPACING.md },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#FEF2F2',
    borderWidth: 1, borderColor: '#FECACA',
  },
  rejectBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444' },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  approveBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#FFF' },
});

export default PendingApprovalsScreen;