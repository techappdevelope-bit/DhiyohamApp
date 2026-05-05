import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import { Button, EmptyState } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const GoalTrackerScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const kid = user as Kid;

  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalPoints, setGoalPoints] = useState('');

  // Sample goals - replace with real data
  const [goals, setGoals] = useState([
    { id: 1, name: 'New Bicycle', targetPoints: 500, currentPoints: 250, icon: 'bike' },
    { id: 2, name: 'Video Game', targetPoints: 300, currentPoints: 180, icon: 'gamepad-variant' },
  ]);

  const handleCreateGoal = () => {
    if (!goalName.trim() || !goalPoints) {
      Toast.show({
        type: 'error',
        text1: 'Fill All Fields',
      });
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName,
      targetPoints: parseInt(goalPoints),
      currentPoints: 0,
      icon: 'flag-checkered',
    };

    setGoals([...goals, newGoal]);
    setShowModal(false);
    setGoalName('');
    setGoalPoints('');

    Toast.show({
      type: 'success',
      text1: 'Goal Created!',
      text2: `Keep earning points for ${goalName}`,
    });
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
      backgroundColor: kid?.themeColor || colors.primary,
    },
    backButton: {
      padding: SPACING.sm,
      marginRight: SPACING.md,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      flex: 1,
    },
    addButton: {
      padding: SPACING.sm,
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    goalCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      ...SHADOWS.md,
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    goalIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    goalInfo: {
      flex: 1,
    },
    goalName: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    goalProgress: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    progressBarContainer: {
      height: 12,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.round,
      overflow: 'hidden',
      marginBottom: SPACING.sm,
    },
    progressBar: {
      height: '100%',
      borderRadius: BORDER_RADIUS.round,
    },
    progressText: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      textAlign: 'right',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: SPACING.xl,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
    },
    modalTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xl,
      textAlign: 'center',
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: FONT_SIZE.md,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: SPACING.md,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginTop: SPACING.lg,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Goals</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <Icon name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = (goal.currentPoints / goal.targetPoints) * 100;
            const remaining = goal.targetPoints - goal.currentPoints;

            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalIcon}>
                    <Icon name={goal.icon} size={30} color={colors.primary} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalProgress}>
                      {remaining} points to go!
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {goal.currentPoints} / {goal.targetPoints} points ({Math.round(progress)}%)
                </Text>
              </View>
            );
          })
        ) : (
          <EmptyState
            iconName="flag-checkered"
            title="No Goals Yet"
            message="Set a goal and start saving points!"
            buttonText="Create Goal"
            onButtonPress={() => setShowModal(true)}
          />
        )}
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Goal</Text>

            <TextInput
              style={styles.input}
              placeholder="Goal Name (e.g., New Bike)"
              placeholderTextColor={colors.textLight}
              value={goalName}
              onChangeText={setGoalName}
            />

            <TextInput
              style={styles.input}
              placeholder="Target Points"
              placeholderTextColor={colors.textLight}
              value={goalPoints}
              onChangeText={setGoalPoints}
              keyboardType="number-pad"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Create"
                onPress={handleCreateGoal}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GoalTrackerScreen;
