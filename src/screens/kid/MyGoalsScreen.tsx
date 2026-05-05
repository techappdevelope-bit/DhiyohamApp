import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

interface Goal {
  id: string;
  kidId: string;
  title: string;
  targetPoints: number;
  completed: boolean;
  createdAt: Date;
}

const MyGoalsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const kid = user as Kid;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalPoints, setNewGoalPoints] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadGoals = async () => {
    if (!kid?.id) return;
    try {
      // REMOVED .orderBy() to avoid index requirement
      const snapshot = await firestore()
        .collection('goals')
        .where('kidId', '==', kid.id)
        .get();

      let loadedGoals: Goal[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Goal));

      // Sort in JavaScript instead
      loadedGoals = loadedGoals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  useEffect(() => { loadGoals(); }, [kid?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim() || !newGoalPoints) {
      Alert.alert('Oops!', 'Please fill in all fields');
      return;
    }

    const points = parseInt(newGoalPoints);
    if (isNaN(points) || points <= 0) {
      Alert.alert('Oops!', 'Please enter a valid number of points');
      return;
    }

    try {
      await firestore().collection('goals').add({
        kidId: kid.id,
        title: newGoalTitle.trim(),
        targetPoints: points,
        completed: false,
        createdAt: firestore.Timestamp.now(),
      });

      setNewGoalTitle('');
      setNewGoalPoints('');
      setShowAddForm(false);
      await loadGoals();
      Alert.alert('Success!', 'Goal added! 🎯');
    } catch (error) {
      Alert.alert('Error', 'Failed to add goal');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await firestore().collection('goals').doc(goalId).update({ completed: true });
      await loadGoals();
      Alert.alert('🎉 Goal Completed!', 'Amazing work!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
    }
  };

  const handleDeleteGoal = async (goalId: string, title: string) => {
    Alert.alert('Delete Goal?', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await firestore().collection('goals').doc(goalId).delete();
            await loadGoals();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete goal');
          }
        },
      },
    ]);
  };

  const currentPoints = kid?.points || 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Goals</Text>
        <Text style={styles.headerSub}>You have {currentPoints} points</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddForm(!showAddForm)}
          activeOpacity={0.7}
        >
          <Icon name={showAddForm ? 'close' : 'plus'} size={24} color="#4facfe" />
          <Text style={styles.addBtnText}>
            {showAddForm ? 'Cancel' : 'Add New Goal'}
          </Text>
        </TouchableOpacity>

        {showAddForm && (
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              placeholder="What's your goal?"
              placeholderTextColor="#9CA3AF"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Target points"
              placeholderTextColor="#9CA3AF"
              value={newGoalPoints}
              onChangeText={setNewGoalPoints}
              keyboardType="number-pad"
            />
            <TouchableOpacity onPress={handleAddGoal} activeOpacity={0.8}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnText}>Save Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {goals.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="flag-checkered" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No goals yet!</Text>
            <Text style={styles.emptySub}>Tap "Add New Goal" to get started</Text>
          </View>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((currentPoints / goal.targetPoints) * 100, 100);
            const isCompleted = goal.completed || currentPoints >= goal.targetPoints;

            return (
              <View key={goal.id} style={[styles.goalCard, isCompleted && styles.goalCardCompleted]}>
                <View style={styles.goalTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalTitle, isCompleted && { textDecorationLine: 'line-through' }]}>
                      {goal.title}
                    </Text>
                    <Text style={styles.goalPoints}>
                      {currentPoints} / {goal.targetPoints} points
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(goal.id, goal.title)}
                    style={styles.deleteBtn}
                  >
                    <Icon name="delete-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={isCompleted ? ['#10B981', '#059669'] : ['#4facfe', '#00f2fe']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>

                {!goal.completed && isCompleted && (
                  <TouchableOpacity
                    onPress={() => handleCompleteGoal(goal.id)}
                    activeOpacity={0.8}
                    style={{ marginTop: SPACING.sm }}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.completeBtn}
                    >
                      <Icon name="check" size={18} color="#FFF" />
                      <Text style={styles.completeBtnText}>Mark Complete</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
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
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  headerSub: { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1, padding: SPACING.xl },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, backgroundColor: '#FFF', marginBottom: SPACING.lg, ...SHADOWS.sm },
  addBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#4facfe' },
  addForm: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.md },
  input: { backgroundColor: '#F3F4F6', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, fontSize: FONT_SIZE.md, color: '#111827', marginBottom: SPACING.md },
  saveBtn: { borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  saveBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#FFF' },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, ...SHADOWS.sm },
  emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginTop: SPACING.lg },
  emptySub: { fontSize: FONT_SIZE.md, color: '#9CA3AF', marginTop: SPACING.xs },
  goalCard: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md },
  goalCardCompleted: { backgroundColor: '#ECFDF5', borderColor: '#10B981', borderWidth: 1 },
  goalTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  goalTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: SPACING.xs },
  goalPoints: { fontSize: FONT_SIZE.sm, color: '#6B7280' },
  deleteBtn: { padding: SPACING.xs },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: SPACING.xs },
  progressFill: { height: '100%' },
  progressText: { fontSize: FONT_SIZE.xs, color: '#6B7280', textAlign: 'right' },
  completeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg },
  completeBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: '#FFF' },
});

export default MyGoalsScreen;
