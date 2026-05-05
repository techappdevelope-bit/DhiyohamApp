import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../store';
import { Parent } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const ParentDashboardScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { kids, fetchKids } = useKidsStore();
  const parent = user as Parent;
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const loadData = async () => {
    if (!parent?.id) return;
    try {
      await fetchKids(parent.id);
      const kidsSnap = await firestore().collection('kids').where('parentId', '==', parent.id).get();
      const kidIds = kidsSnap.docs.map(d => d.id);
      if (kidIds.length > 0) {
        const tasksSnap = await firestore().collection('tasks').where('status', '==', 'completed').get();
        setPendingCount(tasksSnap.docs.filter(d => kidIds.includes(d.data().kidId)).length);
      } else {
        setPendingCount(0);
      }
    } catch (e) { console.error('Dashboard load error:', e); }
  };

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [parent?.id]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  // PendingApprovals is in the SAME stack (DashStack), so navigate directly
  const goToPending = () => navigation.navigate('PendingApprovals');

  const totalPoints = kids.reduce((s, k) => s + (k.points || 0), 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{parent?.name || 'Parent'}</Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{kids.length}</Text>
              <Text style={styles.statLabel}>Kids</Text>
            </View>
            <TouchableOpacity
              style={[styles.statCard, pendingCount > 0 && styles.statCardAlert]}
              onPress={goToPending} activeOpacity={0.8}
            >
              <Text style={[styles.statValue, pendingCount > 0 && { color: '#FCD34D' }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>{pendingCount > 0 ? '⚠️ Review' : 'Pending'}</Text>
            </TouchableOpacity>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {pendingCount > 0 && (
            <TouchableOpacity style={styles.alertBanner} onPress={goToPending} activeOpacity={0.8}>
              <LinearGradient colors={['#F59E0B', '#EF4444']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.alertGrad}>
                <Icon name="bell-ring" size={24} color="#FFF" />
                <Text style={styles.alertText}>{pendingCount} task{pendingCount > 1 ? 's' : ''} waiting for approval!</Text>
                <Icon name="chevron-right" size={24} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}
              onPress={() => navigation.getParent()?.navigate('Chores', { screen: 'CreateChore' })}
              activeOpacity={0.7}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionIcon}>
                <Icon name="plus" size={32} color="#FFF" />
              </LinearGradient>
              <Text style={styles.actionText}>Add Chore</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}
              onPress={() => navigation.navigate('AddKid')} activeOpacity={0.7}
            >
              <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.actionIcon}>
                <Icon name="account-plus" size={32} color="#FFF" />
              </LinearGradient>
              <Text style={styles.actionText}>Add Kid</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={goToPending} activeOpacity={0.7}>
              <LinearGradient
                colors={pendingCount > 0 ? ['#F59E0B', '#EF4444'] : ['#43e97b', '#38f9d7']}
                style={styles.actionIcon}
              >
                <Icon name="clipboard-check" size={32} color="#FFF" />
              </LinearGradient>
              <Text style={styles.actionText}>Approvals{pendingCount > 0 ? ` (${pendingCount})` : ''}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Your Kids</Text>
          {kids.length > 0 ? (
            <View style={styles.kidsList}>
              {kids.map((kid) => (
                <TouchableOpacity key={kid.id} style={styles.kidCard}
                  onPress={() => navigation.navigate('KidDetail', { kidId: kid.id })} activeOpacity={0.7}
                >
                  <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.kidAvatar}>
                    <Text style={styles.kidInitial}>{kid.name.charAt(0).toUpperCase()}</Text>
                  </LinearGradient>
                  <View style={styles.kidInfo}>
                    <Text style={styles.kidName}>{kid.name}</Text>
                    <Text style={styles.kidMeta}>Level {kid.level || 1} • {kid.points || 0} pts • {kid.streak || 0}🔥</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyKids}>
              <Icon name="account-plus" size={50} color="#D1D5DB" />
              <Text style={styles.emptyText}>No kids added yet</Text>
              <Text style={styles.emptySub}>Tap "Add Kid" to get started!</Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F5F5F5' },
  header:       { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxl, paddingHorizontal: SPACING.xl },
  greeting:     { fontSize: FONT_SIZE.lg, color: '#FFF', opacity: 0.9, marginBottom: SPACING.xs, fontWeight: FONT_WEIGHT.medium },
  name:         { fontSize: FONT_SIZE.giant, fontWeight: FONT_WEIGHT.black, color: '#FFF', marginBottom: SPACING.xl },
  statsRow:     { flexDirection: 'row', gap: SPACING.md },
  statCard:     { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statCardAlert:{ backgroundColor: 'rgba(252,211,77,0.2)', borderColor: 'rgba(252,211,77,0.5)' },
  statValue:    { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF', marginBottom: SPACING.xs },
  statLabel:    { fontSize: FONT_SIZE.sm, color: '#FFF', opacity: 0.9, fontWeight: FONT_WEIGHT.semibold },
  content:      { flex: 1, padding: SPACING.xl },
  alertBanner:  { marginBottom: SPACING.lg, borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  alertGrad:    { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  alertText:    { flex: 1, color: '#FFF', fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.md },
  sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#111827', marginBottom: SPACING.lg, marginTop: SPACING.md },
  quickActions: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  actionCard:   { flex: 1, backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, alignItems: 'center', gap: SPACING.sm, ...SHADOWS.md },
  actionIcon:   { width: 64, height: 64, borderRadius: BORDER_RADIUS.xl, justifyContent: 'center', alignItems: 'center' },
  actionText:   { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: '#111827', textAlign: 'center' },
  kidsList:     { gap: SPACING.md },
  kidCard:      { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, ...SHADOWS.md },
  kidAvatar:    { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  kidInitial:   { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  kidInfo:      { flex: 1 },
  kidName:      { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: SPACING.xs },
  kidMeta:      { fontSize: FONT_SIZE.sm, color: '#6B7280', fontWeight: FONT_WEIGHT.medium },
  emptyKids:    { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, ...SHADOWS.sm },
  emptyText:    { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginTop: SPACING.md },
  emptySub:     { fontSize: FONT_SIZE.md, color: '#9CA3AF', marginTop: SPACING.xs },
});

export default ParentDashboardScreen;