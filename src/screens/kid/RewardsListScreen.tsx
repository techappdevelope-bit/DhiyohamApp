import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

interface Reward {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  cost: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  isActive: boolean;
}

const RewardsListScreen = ({ navigation }: any) => {
  const { user, setUser } = useAuthStore();
  const kid = user as Kid;
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadRewards = async () => {
    if (!kid?.parentId) {
      setIsLoading(false);
      return;
    }

    try {
      const snapshot = await firestore()
        .collection('rewards')
        .where('parentId', '==', kid.parentId)
        .get();

      const loadedRewards: Reward[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          parentId: data.parentId || '',
          name: data.name || 'Reward',
          description: data.description || '',
          cost: data.cost || 0,
          category: data.category,
          imageUrl: data.imageUrl,
          stock: data.stock,
          isActive: data.isActive !== false,
        };
      });

      const activeRewards = loadedRewards.filter(r => r.isActive);
      setRewards(activeRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
      Alert.alert('Error', 'Failed to load rewards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadRewards(); }, [kid?.parentId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRewards();
    setRefreshing(false);
  };

  const handleRedeemReward = (reward: Reward) => {
    const currentPoints = kid?.points || 0;

    if (currentPoints < reward.cost) {
      Alert.alert(
        'Not Enough Points 😕',
        `You need ${reward.cost - currentPoints} more points to get this reward!`
      );
      return;
    }

    Alert.alert(
      'Redeem Reward?',
      `Use ${reward.cost} points to get "${reward.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            try {
              const newPoints = currentPoints - reward.cost;
              
              await firestore().collection('kids').doc(kid.id).update({
                points: newPoints,
              });

              await firestore().collection('redemptions').add({
                kidId: kid.id,
                rewardId: reward.id,
                rewardName: reward.name,
                pointsCost: reward.cost,
                redeemedAt: firestore.Timestamp.now(),
                status: 'pending',
              });

              const updatedKid = { ...kid, points: newPoints };
              setUser(updatedKid);

              Alert.alert(
                '🎉 Success!',
                `Your parent will approve your "${reward.name}" reward soon!`
              );
            } catch (error) {
              console.error('Redeem error:', error);
              Alert.alert('Error', 'Failed to redeem reward. Try again!');
            }
          },
        },
      ]
    );
  };

  const currentPoints = kid?.points || 0;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fa709a" />
        <Text style={styles.loadingText}>Loading rewards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fa709a', '#fee140']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Rewards</Text>
        <Text style={styles.headerSub}>You have {currentPoints} points</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {rewards.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="gift-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No rewards yet!</Text>
            <Text style={styles.emptySub}>
              Your parent will add rewards you can redeem with your points
            </Text>
          </View>
        ) : (
          rewards.map((reward) => {
            const canAfford = currentPoints >= reward.cost;
            const outOfStock = reward.stock !== undefined && reward.stock <= 0;

            return (
              <View
                key={reward.id}
                style={[
                  styles.rewardCard,
                  !canAfford && styles.rewardCardLocked,
                ]}
              >
                <LinearGradient
                  colors={canAfford ? ['#fa709a', '#fee140'] : ['#D1D5DB', '#9CA3AF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.rewardIcon}
                >
                  <Icon name="gift" size={32} color="#FFFFFF" />
                </LinearGradient>

                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  {reward.description && (
                    <Text style={styles.rewardDesc} numberOfLines={2}>
                      {reward.description}
                    </Text>
                  )}
                  <Text style={[styles.rewardCost, !canAfford && { color: '#EF4444' }]}>
                    ⭐ {reward.cost} points
                  </Text>
                </View>

                <View style={styles.rewardAction}>
                  {outOfStock ? (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                  ) : canAfford ? (
                    <TouchableOpacity
                      onPress={() => handleRedeemReward(reward)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['#fa709a', '#fee140']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.redeemBtn}
                      >
                        <Icon name="check" size={18} color="#FFF" />
                        <Text style={styles.redeemBtnText}>Redeem</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.lockedBadge}>
                      <Icon name="lock" size={16} color="#9CA3AF" />
                      <Text style={styles.lockedText}>
                        {reward.cost - currentPoints} more
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText: { fontSize: 14, color: '#666', marginTop: 8 },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  content: { flex: 1, padding: SPACING.xl },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
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
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  rewardCardLocked: { opacity: 0.6 },
  rewardIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rewardInfo: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  rewardName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
    marginBottom: SPACING.xs,
  },
  rewardDesc: {
    fontSize: FONT_SIZE.sm,
    color: '#6B7280',
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  rewardCost: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: '#fa709a',
  },
  rewardAction: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 90,
    justifyContent: 'center',
  },
  redeemBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 90,
    justifyContent: 'center',
  },
  lockedText: {
    fontSize: FONT_SIZE.xs,
    color: '#9CA3AF',
    fontWeight: FONT_WEIGHT.semibold,
  },
  outOfStockBadge: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#FEE2E2',
    borderRadius: BORDER_RADIUS.lg,
  },
  outOfStockText: {
    fontSize: FONT_SIZE.xs,
    color: '#EF4444',
    fontWeight: FONT_WEIGHT.bold,
  },
});

export default RewardsListScreen;
