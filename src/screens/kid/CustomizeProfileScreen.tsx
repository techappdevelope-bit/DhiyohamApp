import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Kid } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const AVATAR_COLORS = [
  { name: 'Pink', colors: ['#f093fb', '#f5576c'] },
  { name: 'Purple', colors: ['#667eea', '#764ba2'] },
  { name: 'Blue', colors: ['#4facfe', '#00f2fe'] },
  { name: 'Green', colors: ['#43e97b', '#38f9d7'] },
  { name: 'Orange', colors: ['#fa709a', '#fee140'] },
  { name: 'Teal', colors: ['#30cfd0', '#330867'] },
];

const AVATAR_ICONS = [
  'account',
  'rocket',
  'star',
  'heart',
  'lightning-bolt',
  'crown',
  'diamond',
  'fire',
  'cloud',
  'music',
  'palette',
  'soccer',
];

const CustomizeProfileScreen = ({ navigation }: any) => {
  const { user, setUser } = useAuthStore();
  const kid = user as Kid;

  const [name, setName] = useState(kid?.name || '');
  const [selectedColor, setSelectedColor] = useState(kid?.color || 'Pink');
  const [selectedIcon, setSelectedIcon] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Oops!', 'Please enter your name');
      return;
    }

    try {
      setIsSaving(true);

      await firestore().collection('kids').doc(kid.id).update({
        name: name.trim(),
        color: selectedColor,
      });

      const updatedKid = {
        ...kid,
        name: name.trim(),
        color: selectedColor,
      };
      setUser(updatedKid);

      Alert.alert('Success! 🎉', 'Your profile has been updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save changes. Try again!');
    } finally {
      setIsSaving(false);
    }
  };

  const currentColorGradient = AVATAR_COLORS.find(c => c.name === selectedColor)?.colors || AVATAR_COLORS[0].colors;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Profile</Text>
        <Text style={styles.headerSub}>Make it yours!</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Preview */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionLabel}>Preview</Text>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={currentColorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarPreview}
            >
              <Text style={styles.avatarText}>
                {name.trim().charAt(0).toUpperCase() || 'K'}
              </Text>
            </LinearGradient>
            <Text style={styles.previewName}>{name.trim() || 'Your Name'}</Text>
          </View>
        </View>

        {/* Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Avatar Color</Text>
          <View style={styles.colorGrid}>
            {AVATAR_COLORS.map((color) => (
              <TouchableOpacity
                key={color.name}
                onPress={() => setSelectedColor(color.name)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={color.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.colorOption,
                    selectedColor === color.name && styles.colorOptionSelected,
                  ]}
                >
                  {selectedColor === color.name && (
                    <Icon name="check" size={24} color="#FFF" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
          style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            <Icon name={isSaving ? 'loading' : 'check'} size={24} color="#FFF" />
            <Text style={styles.saveBtnText}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
  },
  content: { flex: 1, padding: SPACING.xl },
  previewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: '#9CA3AF',
    marginBottom: SPACING.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 54,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  previewName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: '#111827',
    fontWeight: FONT_WEIGHT.medium,
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
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  },
  saveBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
});

export default CustomizeProfileScreen;
