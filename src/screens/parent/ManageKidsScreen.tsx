import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Alert,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const ManageKidsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { kids, fetchKids } = useKidsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadKids();
    }
  }, [user?.id]);

  const loadKids = async () => {
    if (!user?.id) return;
    try {
      await fetchKids(user.id);
    } catch (error) {
      console.error('Error loading kids:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadKids();
    setRefreshing(false);
  };

  const handleKidPress = (kidId: string) => {
    // Navigate to KidDetail with kidId parameter
    navigation.navigate('KidDetail', { kidId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Kids</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Add Kid Button */}
        <TouchableOpacity
          style={styles.addKidBtn}
          onPress={() => navigation.navigate('AddKid')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addKidGradient}
          >
            <Icon name="plus-circle" size={32} color="#FFF" />
            <Text style={styles.addKidText}>Add New Kid</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Kids List */}
        {kids.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="account-multiple-plus" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Kids Yet</Text>
            <Text style={styles.emptySub}>Tap "Add New Kid" to get started!</Text>
          </View>
        ) : (
          kids.map((kid) => {
            const avatarColor = kid.color || '#f093fb';
            return (
              <TouchableOpacity
                key={kid.id}
                style={styles.kidCard}
                onPress={() => handleKidPress(kid.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.kidAvatar, { backgroundColor: avatarColor }]}>
                  <Text style={styles.kidAvatarText}>
                    {kid.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.kidInfo}>
                  <Text style={styles.kidName}>{kid.name}</Text>
                  <Text style={styles.kidAge}>{kid.age} years old</Text>
                  <View style={styles.kidStats}>
                    <View style={styles.statItem}>
                      <Icon name="star" size={14} color="#F59E0B" />
                      <Text style={styles.statText}>{kid.points || 0} pts</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Icon name="trophy" size={14} color="#667eea" />
                      <Text style={styles.statText}>Level {kid.level || 1}</Text>
                    </View>
                  </View>
                </View>

                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.black,
    color: '#111827',
  },
  content: { flex: 1, padding: SPACING.xl },
  addKidBtn: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  addKidGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  addKidText: {
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
  kidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  kidAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  kidAvatarText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  kidInfo: { flex: 1 },
  kidName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
    marginBottom: SPACING.xs,
  },
  kidAge: {
    fontSize: FONT_SIZE.sm,
    color: '#6B7280',
    marginBottom: SPACING.xs,
  },
  kidStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FONT_SIZE.xs,
    color: '#6B7280',
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default ManageKidsScreen;
