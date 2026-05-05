import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { Kid } from '../../types';
import { useKidsStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const KidDetailScreen = ({ route, navigation }: any) => {
  const { kidId } = route.params;
  const { deleteKid } = useKidsStore();
  const [kid, setKid] = useState<Kid | null>(null);
  const [tasksStats, setTasksStats] = useState({ completed: 0, pending: 0 });
  const [achievementsCount, setAchievementsCount] = useState(0);

  useEffect(() => {
    loadKidData();
  }, [kidId]);

  const loadKidData = async () => {
    try {
      const kidDoc = await firestore().collection('kids').doc(kidId).get();
      if (kidDoc.exists) {
        const data = kidDoc.data();
        setKid({
          id: kidDoc.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
        } as Kid);
      }

      const tasksSnap = await firestore().collection('tasks').where('kidId', '==', kidId).get();
      const completed = tasksSnap.docs.filter(d => d.data().status === 'completed' || d.data().status === 'approved').length;
      const pending = tasksSnap.docs.filter(d => d.data().status === 'pending').length;
      setTasksStats({ completed, pending });

      const achievementsSnap = await firestore().collection('achievements').where('kidId', '==', kidId).get();
      setAchievementsCount(achievementsSnap.docs.length);
    } catch (error) {
      console.error('Error loading kid data:', error);
    }
  };

  const handleDeleteKid = () => {
    Alert.alert(
      'Delete Kid?',
      `Remove ${kid?.name}? This will delete all their data. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteKid(kidId);
              Alert.alert('Deleted', `${kid?.name} has been removed.`, [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete kid');
            }
          },
        },
      ]
    );
  };

  if (!kid) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const avatarColor = kid.color || '#f093fb';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{kid.name.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.name}>{kid.name}</Text>
        <Text style={styles.age}>{kid.age} years old</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Icon name="star" size={18} color="#FFF" />
            <Text style={styles.statValue}>{kid.points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="trophy" size={18} color="#FFF" />
            <Text style={styles.statValue}>{kid.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="fire" size={18} color="#FFF" />
            <Text style={styles.statValue}>{kid.streak || 0}🔥</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="cash" size={18} color="#FFF" />
            <Text style={styles.statValue}>${kid.allowanceBalance || 0}</Text>
            <Text style={styles.statLabel}>Allowance</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditKidProfile', { kidId })}>
            <View style={[styles.menuIcon, { backgroundColor: '#667eea' }]}>
              <Icon name="pencil" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewKidTasks', { kidId, kidName: kid.name })}>
            <View style={[styles.menuIcon, { backgroundColor: '#f093fb' }]}>
              <Icon name="clipboard-check" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>View Tasks</Text>
              <Text style={styles.menuSubtext}>{tasksStats.completed} completed, {tasksStats.pending} pending</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewKidAchievements', { kidId, kidName: kid.name })}>
            <View style={[styles.menuIcon, { backgroundColor: '#4facfe' }]}>
              <Icon name="trophy" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Achievements</Text>
              <Text style={styles.menuSubtext}>{achievementsCount} unlocked</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ResetKidPIN', { kidId, kidName: kid.name })}>
            <View style={[styles.menuIcon, { backgroundColor: '#43e97b' }]}>
              <Icon name="lock-reset" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Reset PIN</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteKid}>
          <Icon name="delete" size={20} color="#EF4444" />
          <Text style={styles.deleteBtnText}>Delete Kid</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxl, paddingHorizontal: SPACING.xl, alignItems: 'center' },
  backBtn: { position: 'absolute', top: SPACING.xxxl, left: SPACING.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarContainer: { marginBottom: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontSize: 42, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF' },
  name: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF', marginBottom: SPACING.xs },
  age: { fontSize: FONT_SIZE.md, color: '#FFFFFF', opacity: 0.9, marginBottom: SPACING.xl },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, width: '100%' },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF', marginTop: SPACING.xs },
  statLabel: { fontSize: FONT_SIZE.xs, color: '#FFFFFF', opacity: 0.9 },
  content: { flex: 1, padding: SPACING.xl },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.md, marginBottom: SPACING.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: '#111827' },
  menuSubtext: { fontSize: FONT_SIZE.sm, color: '#6B7280', marginTop: 2 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: '#FEE2E2', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: '#FECACA' },
  deleteBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444' },
});

export default KidDetailScreen;
