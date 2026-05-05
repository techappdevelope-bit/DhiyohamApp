import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore, useKidsStore, useChoresStore } from '../../store';
import { Parent } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import FirestoreService from '../../services/firebase/firestore';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import CloudinaryService from '../../services/cloudinary';

const FREQUENCIES = ['Daily', 'Weekly', 'One Time'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const pointsByDifficulty: Record<string, number> = {
  Easy: 10,
  Medium: 20,
  Hard: 30,
};

const CreateChoreScreen = ({ navigation }: any) => {
  const colors = useThemedColors();

  // ✅ Defensive checks – but the real fix is in the store exports
  const { user } = useAuthStore?.() ?? {};
  const { kids } = useKidsStore?.() ?? {};
  const { createChore } = useChoresStore?.() ?? {};

  const parent = user as Parent;

  // ✅ Correct useState declarations
  const [choreName, setChoreName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [frequency, setFrequency] = useState('Daily');
  const [points, setPoints] = useState('10');
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [requirePhoto, setRequirePhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKidToggle = (kidId: string) => {
    setSelectedKids(prev =>
      prev.includes(kidId)
        ? prev.filter(id => id !== kidId)
        : [...prev, kidId]
    );
  };

  const handleDifficultyChange = (diff: string) => {
    setDifficulty(diff);
    setPoints(String(pointsByDifficulty[diff]));
  };

  const handleCreateChore = async () => {
    if (!choreName.trim()) {
      Alert.alert('Error', 'Please enter a chore name');
      return;
    }
    if (selectedKids.length === 0) {
      Alert.alert('Error', 'Please assign at least one kid');
      return;
    }
    const parsedPoints = parseInt(points);
    if (!parsedPoints || parsedPoints <= 0) {
      Alert.alert('Error', 'Please enter valid points');
      return;
    }

    try {
      setIsSubmitting(true);

      const freq = frequency === 'One Time'
        ? 'one-time'
        : frequency.toLowerCase() as 'daily' | 'weekly' | 'one-time';

      // 1. Create the chore
      const choreData = {
        parentId: parent.id,
        name: choreName.trim(),
        description: description.trim(),
        points: parsedPoints,
        frequency: freq,
        assignedTo: selectedKids,
        requirePhoto,
        createdAt: new Date(),
      };

      const choreId = await FirestoreService.createChore(choreData);
      console.log('✅ Chore created:', choreId);

      // 2. Create tasks for each assigned kid
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const kidId of selectedKids) {
        const taskData = {
          choreId,
          choreName: choreName.trim(),
          kidId,
          status: 'pending' as const,
          dueDate: today,
          pointsAwarded: parsedPoints,
          requirePhoto,
          createdAt: new Date(),
        };

        const taskId = await FirestoreService.createTask(taskData);
        console.log(`✅ Task created for kid ${kidId}:`, taskId);
      }

      Alert.alert(
        '🎉 Success!',
        `"${choreName}" chore created and assigned to ${selectedKids.length} kid(s)!`,
        [{ text: 'Great!', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error creating chore:', error);
      Alert.alert('Error', error.message || 'Failed to create chore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Chore</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chore Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Chore Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="e.g., Clean your room"
            placeholderTextColor={colors.textLight}
            value={choreName}
            onChangeText={setChoreName}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Add details..."
            placeholderTextColor={colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Difficulty</Text>
          <View style={styles.chipsRow}>
            {DIFFICULTIES.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  difficulty === diff && { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
                ]}
                onPress={() => handleDifficultyChange(diff)}
              >
                <Text style={[
                  styles.chipText,
                  { color: colors.text },
                  difficulty === diff && { color: colors.primary },
                ]}>
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
          <View style={styles.chipsRow}>
            {FREQUENCIES.map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  frequency === freq && { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
                ]}
                onPress={() => setFrequency(freq)}
              >
                <Text style={[
                  styles.chipText,
                  { color: colors.text },
                  frequency === freq && { color: colors.primary },
                ]}>
                  {freq}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Points */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Points *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Points for completing"
            placeholderTextColor={colors.textLight}
            value={points}
            onChangeText={setPoints}
            keyboardType="number-pad"
          />
        </View>

        {/* Assign Kids */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Assign to Kids *</Text>
          {kids?.length === 0 ? (
            <View style={[styles.emptyKids, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="account-plus" size={40} color={colors.textLight} />
              <Text style={{ color: colors.textLight, marginTop: SPACING.sm }}>
                No kids added yet. Add kids first!
              </Text>
            </View>
          ) : (
            <View style={styles.kidsList}>
              {kids?.map((kid) => (
                <TouchableOpacity
                  key={kid.id}
                  style={[
                    styles.kidCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    selectedKids.includes(kid.id) && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
                  ]}
                  onPress={() => handleKidToggle(kid.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    style={styles.kidAvatar}
                  >
                    <Text style={styles.kidInitial}>
                      {kid.name.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                  <Text style={[styles.kidName, { color: colors.text }]}>{kid.name}</Text>
                  <View style={[
                    styles.checkbox,
                    { borderColor: colors.border },
                    selectedKids.includes(kid.id) && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}>
                    {selectedKids.includes(kid.id) && (
                      <Icon name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Require Photo */}
        <View style={styles.section}>
          <View style={[styles.switchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.switchInfo}>
              <Icon name="camera" size={24} color={colors.primary} />
              <Text style={[styles.switchLabel, { color: colors.text }]}>Require Photo Proof</Text>
            </View>
            <Switch
              value={requirePhoto}
              onValueChange={setRequirePhoto}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateChore}
          disabled={isSubmitting}
          activeOpacity={0.8}
          style={{ marginBottom: SPACING.xxxl }}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9CA3AF', '#6B7280'] : ['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createButton}
          >
            <Icon name={isSubmitting ? 'loading' : 'check-circle'} size={24} color="#FFFFFF" />
            <Text style={styles.createButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Chore & Assign Tasks'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
    flex: 1,
  },
  content: { flex: 1, padding: SPACING.xl },
  section: { marginBottom: SPACING.xl },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
  },
  input: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  kidsList: { gap: SPACING.sm },
  kidCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 2,
  },
  kidAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kidInitial: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  kidName: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  switchLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  createButton: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  createButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFFFFF',
  },
  emptyKids: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});

const handlePhotoUpload = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'Upload Photo Proof',
      'Take a photo or choose from gallery',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.didCancel) return reject('cancelled');
              if (response.errorCode) return reject(response.errorMessage);
              const uri = response.assets?.[0]?.uri;
              if (uri) resolve(uri);
              else reject('No image selected');
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.didCancel) return reject('cancelled');
              if (response.errorCode) return reject(response.errorMessage);
              const uri = response.assets?.[0]?.uri;
              if (uri) resolve(uri);
              else reject('No image selected');
            });
          },
        },
        { text: 'Cancel', style: 'cancel', onPress: () => reject('cancelled') },
      ]
    );
  });
};

const handleComplete = () => {
  if (!task) return;
  Alert.alert(
    'Complete Task?',
    `Did you finish "${task.choreName || 'this task'}"?`,
    [
      { text: 'Not yet', style: 'cancel' },
      {
        text: 'Yes, Done!',
        onPress: async () => {
          try {
            setIsCompleting(true);

            let photoUrl: string | undefined;

            // If photo required, upload first
            if (task.requirePhoto) {
              try {
                const imageUri = await handlePhotoUpload();
                Alert.alert('Uploading...', 'Please wait while we upload your photo');
                photoUrl = await CloudinaryService.uploadTaskPhoto(task.id, imageUri);
              } catch (err) {
                if (err === 'cancelled') {
                  setIsCompleting(false);
                  return;
                }
                Alert.alert('Error', 'Failed to upload photo. Please try again.');
                setIsCompleting(false);
                return;
              }
            }

            await completeTask(task.id, photoUrl);
            setTask(prev => prev ? { ...prev, status: 'completed' } : null);
            Alert.alert(
              'Amazing!',
              `You earned ${task.pointsAwarded} points!`,
              [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
            );
          } catch {
            Alert.alert('Error', 'Failed. Try again!');
          } finally {
            setIsCompleting(false);
          }
        },
      },
    ]
  );
};

export default CreateChoreScreen;