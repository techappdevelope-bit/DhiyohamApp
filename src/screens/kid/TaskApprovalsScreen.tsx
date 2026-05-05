import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore, useTasksStore, useKidsStore, useChoresStore } from '../../store';
import { EmptyState, Button, Badge } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const TaskApprovalsScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { pendingApprovals, fetchPendingApprovals, approveTask, rejectTask } = useTasksStore();
  const { kids, addPoints } = useKidsStore();
  const { chores } = useChoresStore();

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [bonusPoints, setBonusPoints] = useState('0');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchPendingApprovals(user.id);
    }
  }, [user?.id]);

  const getKidById = (kidId: string) => {
    return kids.find(k => k.id === kidId);
  };

  const getChoreById = (choreId: string) => {
    return chores.find(c => c.id === choreId);
  };

  const handleApprove = async (task: any) => {
    const chore = getChoreById(task.choreId);
    const totalPoints = (chore?.points || 0) + parseInt(bonusPoints || '0');

    try {
      await approveTask(task.id, parseInt(bonusPoints || '0'), comment);
      await addPoints(task.kidId, totalPoints);

      Toast.show({
        type: 'success',
        text1: 'Task Approved!',
        text2: `${totalPoints} points awarded`,
      });

      setSelectedTask(null);
      setBonusPoints('0');
      setComment('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Could not approve task',
      });
    }
  };

  const handleReject = async (task: any) => {
    if (!comment.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Comment Required',
        text2: 'Please add a comment explaining why',
      });
      return;
    }

    try {
      await rejectTask(task.id, comment);

      Toast.show({
        type: 'info',
        text1: 'Task Rejected',
        text2: 'Kid will be notified',
      });

      setSelectedTask(null);
      setComment('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Could not reject task',
      });
    }
  };

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
    taskCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.lg,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    taskHeader: {
      padding: SPACING.lg,
    },
    kidRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    kidName: {
      fontSize: FONT_SIZE.md,
      fontWeight: '600',
      color: colors.text,
      marginLeft: SPACING.sm,
    },
    choreName: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.sm,
    },
    chorePoints: {
      fontSize: FONT_SIZE.sm,
      color: colors.primary,
      fontWeight: '600',
    },
    photoContainer: {
      width: '100%',
      aspectRatio: 4 / 3,
      backgroundColor: colors.surface,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    actionsContainer: {
      padding: SPACING.lg,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: FONT_SIZE.sm,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: SPACING.md,
    },
    buttonsRow: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    approveButton: {
      flex: 1,
      backgroundColor: colors.success,
    },
    rejectButton: {
      flex: 1,
      backgroundColor: colors.error,
    },
  });

  if (selectedTask) {
    const kid = getKidById(selectedTask.kidId);
    const chore = getChoreById(selectedTask.choreId);
    const totalPoints = (chore?.points || 0) + parseInt(bonusPoints || '0');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTask(null)}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Task</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <View style={styles.kidRow}>
                <Icon name="account" size={20} color={colors.textLight} />
                <Text style={styles.kidName}>{kid?.name}</Text>
              </View>
              <Text style={styles.choreName}>{chore?.name}</Text>
              <Text style={styles.chorePoints}>Base Points: {chore?.points}</Text>
            </View>

            {selectedTask.photoUrl && (
              <View style={styles.photoContainer}>
                <Image source={{ uri: selectedTask.photoUrl }} style={styles.photo} resizeMode="cover" />
              </View>
            )}

            <View style={styles.actionsContainer}>
              <TextInput
                style={styles.input}
                placeholder="Bonus points (optional)"
                placeholderTextColor={colors.textLight}
                value={bonusPoints}
                onChangeText={setBonusPoints}
                keyboardType="number-pad"
              />

              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Add a comment (required for rejection)"
                placeholderTextColor={colors.textLight}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
              />

              <View style={{ marginBottom: SPACING.md }}>
                <Text style={{ fontSize: FONT_SIZE.sm, color: colors.textLight }}>
                  Total Points: {totalPoints}
                </Text>
              </View>

              <View style={styles.buttonsRow}>
                <Button
                  title="Approve"
                  onPress={() => handleApprove(selectedTask)}
                  icon="check"
                  style={styles.approveButton}
                />
                <Button
                  title="Reject"
                  onPress={() => handleReject(selectedTask)}
                  icon="close"
                  style={styles.rejectButton}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pendingApprovals.length > 0 ? (
          pendingApprovals.map((task) => {
            const kid = getKidById(task.kidId);
            const chore = getChoreById(task.choreId);

            return (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => setSelectedTask(task)}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.kidRow}>
                    <Icon name="account" size={20} color={colors.textLight} />
                    <Text style={styles.kidName}>{kid?.name}</Text>
                  </View>
                  <Text style={styles.choreName}>{chore?.name}</Text>
                  <Text style={styles.chorePoints}>{chore?.points} points</Text>
                </View>

                {task.photoUrl && (
                  <View style={styles.photoContainer}>
                    <Image source={{ uri: task.photoUrl }} style={styles.photo} resizeMode="cover" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <EmptyState
            iconName="clipboard-check-outline"
            title="All Caught Up!"
            message="No tasks waiting for approval"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default TaskApprovalsScreen;