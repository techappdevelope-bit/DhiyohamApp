import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const RewardsManagementScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [rewards, setRewards] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadRewards();
    }
  }, [user?.id]);

  const loadRewards = async () => {
    if (!user?.id) return;
    try {
      const snapshot = await firestore()
        .collection('rewards')
        .where('parentId', '==', user.id)
        .get();

      const rewardsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRewards(rewardsList);
    } catch (error) {
      console.error('Error loading rewards:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRewards();
    setRefreshing(false);
  };

  const handleDeleteReward = async (rewardId: string) => {
    try {
      await firestore().collection('rewards').doc(rewardId).delete();
      await loadRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Add Reward Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateReward')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#fa709a', '#fee140']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addGradient}
          >
            <Icon name="plus-circle" size={32} color="#FFF" />
            <Text style={styles.addText}>Create New Reward</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Rewards List */}
        {rewards.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="gift-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No rewards yet!</Text>
            <Text style={styles.emptySub}>Create your first reward to motivate your kids</Text>
          </View>
        ) : (
          rewards.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <LinearGradient
                colors={['#fa709a', '#fee140']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rewardIcon}
              >
                <Icon name="gift" size={28} color="#FFF" />
              </LinearGradient>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>{reward.name}</Text>
                <Text style={styles.rewardCost}>⭐ {reward.cost} points</Text>
              </View>
              <View style={styles.rewardActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="pencil" size={20} color="#667eea" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleDeleteReward(reward.id)}
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
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  rewardIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rewardInfo: { flex: 1 },
  rewardName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
    marginBottom: SPACING.xs,
  },
  rewardCost: {
    fontSize: FONT_SIZE.sm,
    color: '#fa709a',
    fontWeight: FONT_WEIGHT.semibold,
  },
  rewardActions: {
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

export default RewardsManagementScreen;
