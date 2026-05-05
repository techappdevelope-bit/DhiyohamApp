import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const NotificationsScreen = ({ navigation }: any) => {
  const [taskCompleted, setTaskCompleted] = useState(true);
  const [taskApproved, setTaskApproved] = useState(true);
  const [rewardRedeemed, setRewardRedeemed] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSub}>Manage your notification preferences</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TASK NOTIFICATIONS</Text>
          
          <View style={styles.notifItem}>
            <View style={styles.notifLeft}>
              <View style={[styles.notifIcon, { backgroundColor: '#4facfe' }]}>
                <Icon name="check-circle" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Task Completed</Text>
                <Text style={styles.notifDesc}>Get notified when a kid completes a task</Text>
              </View>
            </View>
            <Switch
              value={taskCompleted}
              onValueChange={setTaskCompleted}
              trackColor={{ false: '#D1D5DB', true: '#667eea' }}
            />
          </View>

          <View style={styles.notifItem}>
            <View style={styles.notifLeft}>
              <View style={[styles.notifIcon, { backgroundColor: '#10B981' }]}>
                <Icon name="checkbox-marked-circle" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Task Approved</Text>
                <Text style={styles.notifDesc}>Confirm when you approve a task</Text>
              </View>
            </View>
            <Switch
              value={taskApproved}
              onValueChange={setTaskApproved}
              trackColor={{ false: '#D1D5DB', true: '#667eea' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REWARD NOTIFICATIONS</Text>
          
          <View style={styles.notifItem}>
            <View style={styles.notifLeft}>
              <View style={[styles.notifIcon, { backgroundColor: '#fa709a' }]}>
                <Icon name="gift" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Reward Redeemed</Text>
                <Text style={styles.notifDesc}>Know when kids redeem rewards</Text>
              </View>
            </View>
            <Switch
              value={rewardRedeemed}
              onValueChange={setRewardRedeemed}
              trackColor={{ false: '#D1D5DB', true: '#667eea' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REMINDERS</Text>
          
          <View style={styles.notifItem}>
            <View style={styles.notifLeft}>
              <View style={[styles.notifIcon, { backgroundColor: '#F59E0B' }]}>
                <Icon name="clock-outline" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Daily Summary</Text>
                <Text style={styles.notifDesc}>Daily digest of pending tasks</Text>
              </View>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: '#D1D5DB', true: '#667eea' }}
            />
          </View>

          <View style={styles.notifItem}>
            <View style={styles.notifLeft}>
              <View style={[styles.notifIcon, { backgroundColor: '#667eea' }]}>
                <Icon name="calendar-week" size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Weekly Report</Text>
                <Text style={styles.notifDesc}>Family activity summary every Sunday</Text>
              </View>
            </View>
            <Switch
              value={weeklyReport}
              onValueChange={setWeeklyReport}
              trackColor={{ false: '#D1D5DB', true: '#667eea' }}
            />
          </View>
        </View>

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
  section: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md },
  sectionTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: '#9CA3AF', marginBottom: SPACING.md, letterSpacing: 1 },
  notifItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  notifLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  notifIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  notifTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: '#111827', marginBottom: 2 },
  notifDesc: { fontSize: FONT_SIZE.sm, color: '#6B7280' },
});

export default NotificationsScreen;
