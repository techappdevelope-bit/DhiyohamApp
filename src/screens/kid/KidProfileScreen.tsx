import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const KidProfileScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuthStore();
  const kid = user as Kid;

  const handleSignOut = () => {
    Alert.alert('Sign Out?', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); } },
    ]);
  };

  const menuItems = [
    { id: 'achievements', title: 'My Achievements', icon: 'trophy', color: '#667eea', screen: 'Achievements' },
    { id: 'customize', title: 'Customize Profile', icon: 'palette', color: '#f093fb', screen: 'CustomizeProfile' },
    { id: 'goals', title: 'My Goals', icon: 'flag', color: '#4facfe', screen: 'MyGoals' },
    { id: 'history', title: 'Reward History', icon: 'history', color: '#43e97b', screen: 'RewardHistory' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient colors={['#f093fb', '#f5576c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
            <Text style={styles.avatarText}>{(kid?.name || 'K').charAt(0).toUpperCase()}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.name}>{kid?.name || 'Kid'}</Text>
        <Text style={styles.age}>{kid?.age ? `${kid.age} years old` : 'Awesome Kid!'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Icon name="star" size={18} color="#FFF" />
            <Text style={styles.statValue}>{kid?.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="trophy" size={18} color="#FFF" />
            <Text style={styles.statValue}>{kid?.points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="fire" size={18} color="#FFF" />
            <Text style={styles.statValue}>{kid?.streak || 0}🔥</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>MY STUFF</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.7}>
          <Icon name="logout" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxl, paddingHorizontal: SPACING.xl, alignItems: 'center' },
  avatarContainer: { marginBottom: SPACING.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontSize: 42, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF' },
  name: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF', marginBottom: SPACING.xs },
  age: { fontSize: FONT_SIZE.md, color: '#FFFFFF', opacity: 0.9, marginBottom: SPACING.xl },
  statsRow: { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.black, color: '#FFFFFF', marginTop: SPACING.xs },
  statLabel: { fontSize: FONT_SIZE.xs, color: '#FFFFFF', opacity: 0.9 },
  content: { flex: 1, padding: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: '#9CA3AF', marginBottom: SPACING.md, letterSpacing: 1 },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.md, marginBottom: SPACING.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: '#111827' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: '#FEE2E2', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: '#FECACA' },
  signOutText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#EF4444' },
});

export default KidProfileScreen;
