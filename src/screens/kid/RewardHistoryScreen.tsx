import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Redemption {
  id: string;
  kidId: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  status: 'pending' | 'approved' | 'rejected';
  redeemedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

const RewardHistoryScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const kid = user as Kid;
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRedemptions = async () => {
    if (!kid?.id) return;
    try {
      const snapshot = await firestore()
        .collection('redemptions')
        .where('kidId', '==', kid.id)
        .get();

      let loadedRedemptions: Redemption[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        redeemedAt: doc.data().redeemedAt?.toDate() || new Date(),
        approvedAt: doc.data().approvedAt?.toDate(),
        rejectedAt: doc.data().rejectedAt?.toDate(),
      } as Redemption));

      // Sort by date (newest first)
      loadedRedemptions = loadedRedemptions.sort(
        (a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime()
      );

      setRedemptions(loadedRedemptions);
    } catch (error) {
      console.error('Error loading redemptions:', error);
    }
  };

  useEffect(() => { loadRedemptions(); }, [kid?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRedemptions();
    setRefreshing(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          icon: 'check-circle',
          color: '#10B981',
          bgColor: '#ECFDF5',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: 'close-circle',
          color: '#EF4444',
          bgColor: '#FEE2E2',
        };
      default:
        return {
          label: 'Pending',
          icon: 'clock-outline',
          color: '#F59E0B',
          bgColor: '#FEF3C7',
        };
    }
  };

  const totalPointsSpent = redemptions
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.pointsCost, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reward History</Text>
        <Text style={styles.headerSub}>
          {redemptions.length} reward{redemptions.length !== 1 ? 's' : ''} redeemed
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalPointsSpent}</Text>
            <Text style={styles.statLabel}>Points Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {redemptions.filter(r => r.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {redemptions.filter(r => r.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {redemptions.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="gift-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No rewards yet!</Text>
            <Text style={styles.emptySub}>
              Redeem rewards from the Rewards tab to see them here
            </Text>
          </View>
        ) : (
          redemptions.map((redemption) => {
            const statusConfig = getStatusConfig(redemption.status);

            return (
              <View key={redemption.id} style={styles.redemptionCard}>
                <View style={styles.redemptionTop}>
                  <LinearGradient
                    colors={['#fa709a', '#fee140']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.redemptionIcon}
                  >
                    <Icon name="gift" size={28} color="#FFFFFF" />
                  </LinearGradient>

                  <View style={styles.redemptionInfo}>
                    <Text style={styles.redemptionName}>
                      {redemption.rewardName}
                    </Text>
                    <Text style={styles.redemptionPoints}>
                      ⭐ {redemption.pointsCost} points
                    </Text>
                    <Text style={styles.redemptionDate}>
                      {redemption.redeemedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusConfig.bgColor },
                    ]}
                  >
                    <Icon
                      name={statusConfig.icon}
                      size={16}
                      color={statusConfig.color}
                    />
                    <Text
                      style={[styles.statusText, { color: statusConfig.color }]}
                    >
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>

                {/* Additional info for approved/rejected */}
                {redemption.status === 'approved' && redemption.approvedAt && (
                  <View style={styles.additionalInfo}>
                    <Icon name="check" size={14} color="#10B981" />
                    <Text style={styles.additionalText}>
                      Approved on{' '}
                      {redemption.approvedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                )}

                {redemption.status === 'pending' && (
                  <View style={styles.additionalInfo}>
                    <Icon name="information" size={14} color="#F59E0B" />
                    <Text style={styles.additionalText}>
                      Waiting for parent approval
                    </Text>
                  </View>
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
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: { flex: 1, padding: SPACING.xl },
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
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  redemptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  redemptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  redemptionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redemptionInfo: { flex: 1 },
  redemptionName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
    marginBottom: SPACING.xs,
  },
  redemptionPoints: {
    fontSize: FONT_SIZE.sm,
    color: '#fa709a',
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: 2,
  },
  redemptionDate: {
    fontSize: FONT_SIZE.xs,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
  additionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  additionalText: {
    fontSize: FONT_SIZE.xs,
    color: '#6B7280',
  },
});

export default RewardHistoryScreen;
