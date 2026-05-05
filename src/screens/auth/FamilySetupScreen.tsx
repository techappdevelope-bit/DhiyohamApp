import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../store';
import { isValidName, isValidAge, isValidPIN } from '../../utils/validation';
import { Kid } from '../../types';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const FamilySetupScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { addKid } = useKidsStore();

  const [step, setStep] = useState(1);
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

      // Navigate to parent dashboard
      navigation.replace('ParentMain');
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

  const handleSkip = () => {
    navigation.replace('ParentMain');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
    },
    skipButton: {
      alignSelf: 'flex-end',
      padding: SPACING.sm,
    },
    skipText: {
      fontSize: FONT_SIZE.sm,
      color: colors.primary,
      fontWeight: '600',
    },
    scrollContent: {
      padding: SPACING.xl,
    },
    title: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FONT_SIZE.md,
      color: colors.textLight,
      marginBottom: SPACING.xxxl,
      textAlign: 'center',
    },
    label: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SPACING.sm,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      fontSize: FONT_SIZE.md,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: SPACING.lg,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
      marginBottom: SPACING.xl,
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
    pinContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: SPACING.md,
      marginBottom: SPACING.xl,
    },
    pinInput: {
      width: 60,
      height: 60,
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      textAlign: 'center',
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.border,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Your First Kid</Text>
        <Text style={styles.subtitle}>Let's set up your child's account</Text>

        {/* Kid Name */}
        <Text style={styles.label}>Kid's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          placeholderTextColor={colors.textLight}
          value={kidName}
          onChangeText={setKidName}
        />

        {/* Kid Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          placeholderTextColor={colors.textLight}
          value={kidAge}
          onChangeText={setKidAge}
          keyboardType="number-pad"
          maxLength={2}
        />

        {/* Theme Color */}
        <Text style={styles.label}>Choose Theme Color</Text>
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

        {/* PIN */}
        <Text style={styles.label}>Set 4-Digit PIN (for kid login)</Text>
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

        <Button
          title="Add Kid"
          onPress={handleAddKid}
          loading={loading}
          disabled={loading}
          style={{ marginTop: SPACING.lg }}
        />
      </ScrollView>
    </View>
  );
};

export default FamilySetupScreen;
