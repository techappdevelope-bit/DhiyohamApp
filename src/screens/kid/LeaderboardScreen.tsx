import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../store';
import { Kid } from '../../types';
import { Avatar, Badge } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LeaderboardScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { kids, fetchKids } = useKidsStore();

  const kid = user as Kid;

  useEffect(() => {
    if (kid?.parentId) {
      fetchKids(kid.parentId);
    }
  }, [kid?.parentId]);

  // Sort kids by points
  const sortedKids = [...kids].sort((a, b) => b.points - a.points);
  const myRank = sortedKids.findIndex((k) => k.id === kid?.id) + 1;

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return colors.textLight;
    }
  };

  const getMedalIcon = (rank: number) => {
    return rank <= 3 ? 'medal' : 'numeric-' + rank + '-circle';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
      paddingBottom: SPACING.xxxl,
      backgroundColor: kid?.themeColor || colors.primary,
      alignItems: 'center',
    },
    backButton: {
      position: 'absolute',
      top: SPACING.xxl,
      left: SPACING.lg,
      padding: SPACING.sm,
      zIndex: 1,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: SPACING.md,
    },
    myRankCard: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.lg,
    },
    myRankInfo: {
      flex: 1,
      marginLeft: SPACING.md,
    },
    myRankText: {
      fontSize: FONT_SIZE.sm,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    myRankValue: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    podium: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginBottom: SPACING.xxl,
      height: 200,
    },
    podiumPlace: {
      alignItems: 'center',
      marginHorizontal: SPACING.sm,
    },
    podiumBase: {
      width: 80,
      backgroundColor: colors.card,
      borderTopLeftRadius: BORDER_RADIUS.md,
      borderTopRightRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      paddingTop: SPACING.md,
      ...SHADOWS.md,
    },
    firstPlace: {
      height: 140,
      width: 90,
    },
    secondPlace: {
      height: 110,
    },
    thirdPlace: {
      height: 90,
    },
    podiumRank: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      marginTop: SPACING.sm,
    },
    podiumPoints: {
      fontSize: FONT_SIZE.xs,
      color: colors.textLight,
      marginTop: SPACING.xs,
    },
    leaderboardList: {
      gap: SPACING.md,
    },
    rankCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      ...SHADOWS.sm,
    },
    rankCardMe: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    rankNumber: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    rankInfo: {
      flex: 1,
      marginLeft: SPACING.md,
    },
    rankName: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    rankStats: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    rankPoints: {
      alignItems: 'flex-end',
    },
    rankPointsValue: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.primary,
    },
    rankPointsLabel: {
      fontSize: FONT_SIZE.xs,
      color: colors.textLight,
    },
  });

  const topThree = sortedKids.slice(0, 3);
  const restOfList = sortedKids.slice(3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>

        {myRank > 0 && (
          <View style={styles.myRankCard}>
            <Icon name={getMedalIcon(myRank)} size={40} color={getMedalColor(myRank)} />
            <View style={styles.myRankInfo}>
              <Text style={styles.myRankText}>Your Rank</Text>
              <Text style={styles.myRankValue}>#{myRank}</Text>
            </View>
            <View style={styles.myRankInfo}>
              <Text style={styles.myRankText}>Points</Text>
              <Text style={styles.myRankValue}>{kid?.points || 0}</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Podium */}
        {topThree.length >= 3 && (
          <View style={styles.podium}>
            {/* 2nd Place */}
            <View style={styles.podiumPlace}>
              <Avatar size={50} />
              <View style={[styles.podiumBase, styles.secondPlace]}>
                <Icon name="medal" size={30} color="#C0C0C0" />
                <Text style={styles.podiumRank}>2</Text>
                <Text style={styles.podiumPoints}>{topThree[1].points}</Text>
              </View>
            </View>

            {/* 1st Place */}
            <View style={styles.podiumPlace}>
              <Avatar size={60} />
              <View style={[styles.podiumBase, styles.firstPlace]}>
                <Icon name="crown" size={30} color="#FFD700" />
                <Text style={[styles.podiumRank, { color: '#FFD700' }]}>1</Text>
                <Text style={styles.podiumPoints}>{topThree[0].points}</Text>
              </View>
            </View>

            {/* 3rd Place */}
            <View style={styles.podiumPlace}>
              <Avatar size={50} />
              <View style={[styles.podiumBase, styles.thirdPlace]}>
                <Icon name="medal" size={30} color="#CD7F32" />
                <Text style={styles.podiumRank}>3</Text>
                <Text style={styles.podiumPoints}>{topThree[2].points}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Full List */}
        <View style={styles.leaderboardList}>
          {sortedKids.map((k, index) => {
            const rank = index + 1;
            const isMe = k.id === kid?.id;

            return (
              <View key={k.id} style={[styles.rankCard, isMe && styles.rankCardMe]}>
                <View style={styles.rankNumber}>
                  <Icon
                    name={getMedalIcon(rank)}
                    size={30}
                    color={getMedalColor(rank)}
                  />
                </View>

                <Avatar size={50} />

                <View style={styles.rankInfo}>
                  <Text style={styles.rankName}>
                    {k.name} {isMe && '(You)'}
                  </Text>
                  <Text style={styles.rankStats}>
                    Level {k.level} • {k.streak} day streak
                  </Text>
                </View>

                <View style={styles.rankPoints}>
                  <Text style={styles.rankPointsValue}>{k.points}</Text>
                  <Text style={styles.rankPointsLabel}>points</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaderboardScreen;
