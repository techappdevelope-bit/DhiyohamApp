import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const THEME_COLORS = [
  { name: 'Purple', value: '#667eea' },
  { name: 'Pink', value: '#f093fb' },
  { name: 'Cyan', value: '#4facfe' },
  { name: 'Yellow', value: '#fee140' },
  { name: 'Teal', value: '#43e97b' },
  { name: 'Coral', value: '#fa709a' },
  { name: 'Green', value: '#38f9d7' },
  { name: 'Orange', value: '#ff6b6b' },
];

const AddKidScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { createKid } = useKidsStore();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [pin, setPin] = useState('');
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0].value);
  const [isLoading, setIsLoading] = useState(false);

  const [showPin, setShowPin] = useState(false);

  const handleAddKid = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Oops!', 'Please enter kid\'s name');
      return;
    }

    if (!age.trim() || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 18) {
      Alert.alert('Oops!', 'Please enter a valid age (1-18)');
      return;
    }

//     if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
//       Alert.alert('Oops!', 'Please enter a 4-digit PIN');
//       return;
//     }


       // AFTER
       if (!pin || pin.trim().length < 4) {
         Alert.alert('Oops!', 'Password must be at least 4 characters');
         return;
       }

    if (!user?.id) {
      Alert.alert('Error', 'Parent ID not found. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);

      const kidData = {
        parentId: user.id,
        name: name.trim(),
        age: Number(age),
        pin: pin,
        color: selectedColor,
        points: 0,
        level: 1,
        streak: 0,
        allowanceBalance: 0,
        role: 'kid' as const,
        createdAt: new Date(),
      };

      console.log('Creating kid with data:', kidData);

      await createKid(kidData);

      Alert.alert(
        'Success! 🎉',
        `${name} has been added to your family!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Add kid error:', error);
      Alert.alert('Error', error.message || 'Failed to add kid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Kid</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          <Text style={styles.label}>Avatar Preview</Text>
          <View style={[styles.avatarPreview, { backgroundColor: selectedColor }]}>
            <Text style={styles.avatarText}>
              {name.trim().charAt(0).toUpperCase() || 'K'}
            </Text>
          </View>
        </View>

        {/* Kid's Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kid's Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter kid's name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age (1-18)"
            placeholderTextColor="#9CA3AF"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Theme Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Choose Theme Color *</Text>
          <View style={styles.colorGrid}>
            {THEME_COLORS.map((color) => (
              <TouchableOpacity
                key={color.name}
                onPress={() => setSelectedColor(color.value)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    selectedColor === color.value && styles.colorOptionSelected,
                  ]}
                >
                  {selectedColor === color.value && (
                    <Icon name="check" size={28} color="#FFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>




          <View style={styles.inputGroup}>
            <Text style={styles.label}>Set Password *</Text>
            <Text style={styles.helperText}>
              Create any password for your kid (e.g. John2015)
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                value={pin}
                onChangeText={setPin}
                secureTextEntry={!showPin}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPin(!showPin)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPin ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

        {/* Add Kid Button */}
        <TouchableOpacity
          onPress={handleAddKid}
          disabled={isLoading}
          activeOpacity={0.8}
          style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxxl }}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addBtn}
          >
            <Icon name={isLoading ? 'loading' : 'account-plus'} size={24} color="#FFF" />
            <Text style={styles.addBtnText}>
              {isLoading ? 'Adding Kid...' : 'Add Kid'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFF',
  },
  inputGroup: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: '#374151',
    marginBottom: SPACING.sm,
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: '#9CA3AF',
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 4,
    borderColor: '#111827',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  },
  addBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: '#111827',
  },
  eyeIcon: {
    padding: SPACING.md,
  },
});

export default AddKidScreen;
