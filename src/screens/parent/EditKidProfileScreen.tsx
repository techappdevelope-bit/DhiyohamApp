import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

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

const EditKidProfileScreen = ({ route, navigation }: any) => {
  const { kidId } = route.params;
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0].value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadKidData();
  }, [kidId]);

  const loadKidData = async () => {
    try {
      const kidDoc = await firestore().collection('kids').doc(kidId).get();
      if (kidDoc.exists) {
        const data = kidDoc.data();
        setName(data?.name || '');
        setAge(String(data?.age || ''));
        setSelectedColor(data?.color || THEME_COLORS[0].value);
      }
    } catch (error) {
      console.error('Error loading kid:', error);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Oops!', 'Please enter a name');
      return;
    }

    if (!age.trim() || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 18) {
      Alert.alert('Oops!', 'Please enter a valid age (1-18)');
      return;
    }

    try {
      setIsLoading(true);

      await firestore().collection('kids').doc(kidId).update({
        name: name.trim(),
        age: Number(age),
        color: selectedColor,
      });

      Alert.alert('Success!', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View style={styles.previewSection}>
          <Text style={styles.label}>Avatar Preview</Text>
          <View style={[styles.avatarPreview, { backgroundColor: selectedColor }]}>
            <Text style={styles.avatarText}>
              {name.trim().charAt(0).toUpperCase() || 'K'}
            </Text>
          </View>
        </View>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Kid's name"
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
            placeholder="Age (1-18)"
            placeholderTextColor="#9CA3AF"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Theme Color *</Text>
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

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.8}
          style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxxl }}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            <Icon name={isLoading ? 'loading' : 'check'} size={24} color="#FFF" />
            <Text style={styles.saveBtnText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
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
  previewSection: {
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
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  },
  saveBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFF',
  },
});

export default EditKidProfileScreen;
