import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CalendarViewScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const [selected, setSelected] = useState('');

  // Sample marked dates - replace with real task data
  const markedDates = {
    '2024-02-15': {
      marked: true,
      dotColor: colors.success,
      customStyles: {
        container: {
          backgroundColor: colors.success + '20',
        },
      },
    },
    '2024-02-16': {
      marked: true,
      dotColor: colors.primary,
    },
    '2024-02-17': {
      marked: true,
      dotColor: colors.warning,
    },
  };

  const tasksForDay = [
    { id: 1, kid: 'Alex', chore: 'Make Bed', status: 'completed' },
    { id: 2, kid: 'Sarah', chore: 'Homework', status: 'pending' },
    { id: 3, kid: 'Alex', chore: 'Clean Room', status: 'completed' },
  ];

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
    calendarContainer: {
      backgroundColor: colors.card,
      margin: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      ...SHADOWS.md,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: SPACING.lg,
      backgroundColor: colors.card,
      marginHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.lg,
      ...SHADOWS.sm,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: SPACING.xs,
    },
    legendText: {
      fontSize: FONT_SIZE.sm,
      color: colors.text,
    },
    tasksList: {
      padding: SPACING.lg,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
    },
    taskCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      flexDirection: 'row',
      alignItems: 'center',
      ...SHADOWS.sm,
    },
    taskInfo: {
      flex: 1,
      marginLeft: SPACING.sm,
    },
    taskTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: '600',
      color: colors.text,
    },
    taskKid: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar View</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day: any) => setSelected(day.dateString)}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textLight,
              monthTextColor: colors.text,
              arrowColor: colors.primary,
            }}
          />
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
            <Text style={styles.legendText}>Missed</Text>
          </View>
        </View>

        {/* Tasks for selected day */}
        <View style={styles.tasksList}>
          <Text style={styles.sectionTitle}>Tasks for Today</Text>
          {tasksForDay.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <Icon
                name={task.status === 'completed' ? 'check-circle' : 'clock-outline'}
                size={24}
                color={task.status === 'completed' ? colors.success : colors.warning}
              />
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.chore}</Text>
                <Text style={styles.taskKid}>{task.kid}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CalendarViewScreen;
