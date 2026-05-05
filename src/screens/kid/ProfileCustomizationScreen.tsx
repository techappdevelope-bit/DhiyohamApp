import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import { Avatar, Button } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const ProfileCustomizationScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const kid = user as Kid;

  const [selectedColor, setSelectedColor] = useState(kid?.themeColor || '#6C63FF');
  const [selectedAvatar, setSelectedAvatar] = useState('default');

  const themeColors = [
    { id: 1, color: '#6C63FF', name: 'Purple' },
    { id: 2, color: '#FF6B6B', name: 'Red' },
    { id: 3, color: '#4ECDC4', name: 'Cyan' },
    { id: 4, color: '#FFD93D', name: 'Yellow' },
    { id: 5, color: '#95E1D3', name: 'Mint' },
    { id: 6, color: '#F38181', name: 'Pink' },
    { id: 7, color: '#4CAF50', name: 'Green' },
    { id: 8, color: '#FF9800', name: 'Orange' },
    { id: 9, color: '#9C27B0', name: 'Violet' },
    { id: 10, color: '#00BCD4', name: 'Blue' },
  ];

  const avatarStyles = [
    { id: 'default', name: 'Default', icon: 'account' },
    { id: 'robot', name: 'Robot', icon: 'robot' },
    { id: 'cat', name: 'Cat', icon: 'cat' },
    { id: 'dog', name: 'Dog', icon: 'dog' },
    { id: 'alien', name: 'Alien', icon: 'alien' },
    { id: 'ninja', name: 'Ninja', icon: 'ninja' },
  ];

  const handleSave = () => {
    // Save customization logic here
    Toast.show({
      type: 'success',
      text1: 'Profile Updated!',
      text2: 'Your new look is awesome!',
    });
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      paddingTop: SPACING.xxl,
      backgroundColor: selectedColor,
    },
    backButton: {
      padding: SPACING.sm,
      marginRight: SPACING.md,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    previewCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      alignItems: 'center',
      marginBottom: SPACING.xl,
      ...SHADOWS.md,
    },
    previewLabel: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      marginTop: SPACING.lg,
    },
    section: {
      marginBottom: SPACING.xxl,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
    },
    colorOption: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionActive: {
      borderColor: colors.text,
      transform: [{ scale: 1.1 }],
    },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
    },
    avatarOption: {
      width: 80,
      height: 80,
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    avatarOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    avatarName: {
      fontSize: FONT_SIZE.xs,
      color: colors.text,
      marginTop: SPACING.xs,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View style={styles.previewCard}>
          <Avatar size={100} />
          <Text style={styles.previewLabel}>Preview</Text>
        </View>

        {/* Theme Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Color</Text>
          <View style={styles.colorGrid}>
            {themeColors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: item.color },
                  selectedColor === item.color && styles.colorOptionActive,
                ]}
                onPress={() => setSelectedColor(item.color)}
              >
                {selectedColor === item.color && (
                  <Icon name="check" size={30} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Avatar Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Avatar Style</Text>
          <View style={styles.avatarGrid}>
            {avatarStyles.map((avatar) => (
              <View key={avatar.id}>
                <TouchableOpacity
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar.id && styles.avatarOptionActive,
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                >
                  <Icon
                    name={avatar.icon}
                    size={30}
                    color={selectedAvatar === avatar.id ? colors.primary : colors.textLight}
                  />
                </TouchableOpacity>
                <Text style={styles.avatarName}>{avatar.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Button
          title="Save Changes"
          onPress={handleSave}
          icon="check"
          style={{ marginBottom: SPACING.xxl }}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileCustomizationScreen;
