import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore, useRewardsStore, useKidsStore } from '../../store';
import { Kid } from '../../types';
import { EmptyState, Badge } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const RewardsStoreScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { rewards, fetchRewards, requestReward } = useRewardsStore();
  const { kids } = useKidsStore();
  
  const kid = user as Kid;
  const [filter, setFilter] = useState<'all' | 'affordable'>('all');

  useEffect(() => {
    if (kid?.parentId) {
      fetchRewards(kid.parentId);
    }
  }, [kid?.parentId]);

  const canAfford = (cost: number) => {
    return (kid?.points || 0) >= cost;
  };

  const filteredRewards = filter === 'affordable'
    ? rewards.filter(r => r.isAvailable && canAfford(r.cost))
    : rewards.filter(r => r.isAvailable);

  const handleRequestReward = async (reward: any) => {
    if (!canAfford(reward.cost)) {
      Toast.show({
        type: 'error',
        text1: 'Not Enough Points',
        text2: `You need ${reward.cost - (kid?.points || 0)} more points`,
      });
      return;
    }

    Alert.alert(
      'Request Reward?',
      `Do you want to request "${reward.name}" for ${reward.cost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: async () => {
            try {
              await requestReward(kid.id, reward.id);
              
              Toast.show({
                type: 'success',
                text1: 'Request Sent!',
                text2: 'Waiting for parent approval',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Could not send request',
              });
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
      backgroundColor: kid?.themeColor || colors.primary,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: SPACING.sm,
    },
    pointsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
    },
    pointsText: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: SPACING.sm,
    },
    filtersContainer: {
      flexDirection: 'row',
      padding: SPACING.md,
      backgroundColor: colors.surface,
      gap: SPACING.sm,
    },
    filterChip: {
      flex: 1,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: colors.card,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    filterChipActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '600',
      color: colors.text,
    },
    filterTextActive: {
      color: colors.primary,
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    rewardCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    rewardCardLocked: {
      opacity: 0.6,
    },
    rewardContent: {
      padding: SPACING.lg,
    },
    rewardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    rewardIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    rewardInfo: {
      flex: 1,
    },
    rewardName: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    rewardDescription: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    rewardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    costContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    costText: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: SPACING.xs,
    },
    requestButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
    },
    requestButtonDisabled: {
      backgroundColor: colors.border,
    },
    requestButtonText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    lockIcon: {
      position: 'absolute',
      top: SPACING.md,
      right: SPACING.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards Store</Text>
        <View style={styles.pointsContainer}>
          <Icon name="star" size={24} color="#FFFFFF" />
          <Text style={styles.pointsText}>
            {kid?.points || 0} points available
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'affordable' && styles.filterChipActive]}
          onPress={() => setFilter('affordable')}
        >
          <Text style={[styles.filterText, filter === 'affordable' && styles.filterTextActive]}>
            Can Afford
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rewards List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => {
            const affordable = canAfford(reward.cost);
            
            return (
              <View
                key={reward.id}
                style={[styles.rewardCard, !affordable && styles.rewardCardLocked]}
              >
                <View style={styles.rewardContent}>
                  {!affordable && (
                    <Icon
                      name="lock"
                      size={24}
                      color={colors.textLight}
                      style={styles.lockIcon}
                    />
                  )}
                  
                  <View style={styles.rewardHeader}>
                    <View style={styles.rewardIconContainer}>
                      <Icon name={reward.iconName} size={30} color={colors.primary} />
                    </View>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardName}>{reward.name}</Text>
                      <Text style={styles.rewardDescription}>{reward.description}</Text>
                    </View>
                  </View>

                  <View style={styles.rewardFooter}>
                    <View style={styles.costContainer}>
                      <Icon name="star" size={20} color={colors.primary} />
                      <Text style={styles.costText}>{reward.cost}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.requestButton,
                        !affordable && styles.requestButtonDisabled,
                      ]}
                      onPress={() => handleRequestReward(reward)}
                      disabled={!affordable}
                    >
                      <Text style={styles.requestButtonText}>
                        {affordable ? 'Request' : 'Locked'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            iconName="gift-outline"
            title="No Rewards Available"
            message={
              filter === 'affordable'
                ? 'Keep earning points to unlock more rewards!'
                : 'Ask your parents to add some rewards!'
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default RewardsStoreScreen;
