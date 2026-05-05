import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../store';
import { Kid } from '../../types';
import { isValidName, isValidAge, isValidPIN } from '../../utils/validation';
import { Button, Avatar } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const AddKidScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { addKid } = useKidsStore();

  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [kidPIN, setKidPIN] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6C63FF');
  const [loading, setLoading] = useState(false);

  const themeColors = [
    { id: 1, color: '#6C63FF', name: 'Purple' },
    { id: 2, color: '#FF6B6B', name: 'Red' },
    { id: 3, color: '#4ECDC4', name: 'Cyan' },
    { id: 4, color: '#FFD93D', name: 'Yellow' },
    { id: 5, color: '#95E1D3', name: 'Mint' },
    { id: 6, color: '#F38181', name: 'Pink' },
    { id: 7, color: '#4CAF50', name: 'Green' },
    { id: 8, color: '#FF9800', name: 'Orange' },
  ];

  const handleAddKid = async () => {
    // Validation
    if (!isValidName(kidName)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Name',
        text2: 'Please enter a valid name',
      });
      return;
    }

    const age = parseInt(kidAge);
    if (!isValidAge(age)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Age',
        text2: 'Please enter a valid age (1-100)',
      });
      return;
    }

    if (!isValidPIN(kidPIN)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'PIN must be 4 digits',
      });
      return;
    }

    if (!user?.id) return;

    setLoading(true);
    try {
      const kidData: Omit<Kid, 'id'> = {
        role: 'kid',
        parentId: user.id,
        name: kidName.trim(),
        age,
        pin: kidPIN, // In production, hash this
        points: 0,
        level: 1,
        allowanceBalance: 0,
        streak: 0,
        themeColor: selectedColor,
        avatar: {
          skin: 'default',
          hair: 'default',
          outfit: 'default',
          background: selectedColor,
        },
        createdAt: new Date(),
      };

      await addKid(kidData);

      Toast.show({
        type: 'success',
        text1: 'Kid Added!',
        text2: `${kidName} has been added to your family`,
      });

      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: error.message || 'Could not add kid',
      });
    } finally {
      setLoading(false);
    }
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
      backgroundColor: colors.surface,
    },
    backButton: {
      padding: SPACING.sm,
      marginRight: SPACING.md,
    },
    headerTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: 'bold',
      color: colors.text,
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      fontSize: FONT_SIZE.md,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
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
    },
    avatarPreview: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      marginBottom: SPACING.md,
    },
    previewLabel: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      marginTop: SPACING.md,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Kid</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Preview */}
        <View style={styles.avatarPreview}>
          <Avatar size={100} />
          <Text style={styles.previewLabel}>Avatar Preview</Text>
        </View>

        {/* Kid Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kid's Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor={colors.textLight}
            value={kidName}
            onChangeText={setKidName}
            autoCapitalize="words"
          />
        </View>

        {/* Kid Age */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            placeholderTextColor={colors.textLight}
            value={kidAge}
            onChangeText={setKidAge}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Theme Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Theme Color *</Text>
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

        {/* PIN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Set 4-Digit PIN *</Text>
          <Text style={{ fontSize: FONT_SIZE.sm, color: colors.textLight, marginBottom: SPACING.md }}>
            This PIN will be used for kid login
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit PIN"
            placeholderTextColor={colors.textLight}
            value={kidPIN}
            onChangeText={setKidPIN}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>

        {/* Add Button */}
        <Button
          title="Add Kid"
          onPress={handleAddKid}
          loading={loading}
          disabled={loading}
          style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddKidScreen;