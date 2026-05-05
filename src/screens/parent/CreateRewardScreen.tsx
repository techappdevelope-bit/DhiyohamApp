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
import { useAuthStore, useRewardsStore } from '../../store';
import { Reward, RewardCategory } from '../../types';
import { REWARD_TEMPLATES } from '../../constants/rewardTemplates';
import { Button } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const CreateRewardScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { addReward } = useRewardsStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RewardCategory>('screen-time');
  const [cost, setCost] = useState('50');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const categories: { id: RewardCategory; name: string; icon: string }[] = [
    { id: 'screen-time', name: 'Screen Time', icon: 'television' },
    { id: 'treats', name: 'Treats', icon: 'candy' },
    { id: 'activities', name: 'Activities', icon: 'run' },
    { id: 'toys', name: 'Toys', icon: 'toy-brick' },
    { id: 'privileges', name: 'Privileges', icon: 'crown' },
    { id: 'money', name: 'Money', icon: 'cash' },
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setName(template.name);
    setDescription(template.description);
    setCategory(template.category);
    setCost(template.suggestedCost.toString());
  };

  const handleCreateReward = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Name Required',
        text2: 'Please enter a reward name',
      });
      return;
    }

    if (!user?.id) return;

    setLoading(true);
    try {
      const rewardData: Omit<Reward, 'id'> = {
        parentId: user.id,
        name: name.trim(),
        description: description.trim(),
        cost: parseInt(cost) || 50,
        category,
        iconName: selectedTemplate?.iconName || 'gift',
        isAvailable: true,
        createdAt: new Date(),
      };

      await addReward(rewardData);

      Toast.show({
        type: 'success',
        text1: 'Reward Created!',
        text2: `${name} has been added`,
      });

      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: error.message || 'Could not create reward',
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
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    optionChip: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.round,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },
    optionIcon: {
      marginRight: SPACING.xs,
    },
    optionText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '600',
      color: colors.text,
    },
    optionTextActive: {
      color: colors.primary,
    },
    templatesList: {
      gap: SPACING.sm,
    },
    templateChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 2,
      borderColor: colors.border,
    },
    templateChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    templateInfo: {
      flex: 1,
      marginLeft: SPACING.sm,
    },
    templateName: {
      fontSize: FONT_SIZE.md,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    templateCost: {
      fontSize: FONT_SIZE.xs,
      color: colors.primary,
      fontWeight: '600',
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
        <Text style={styles.headerTitle}>Create Reward</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Templates (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
              {REWARD_TEMPLATES.slice(0, 5).map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.templateChip,
                    selectedTemplate === template && styles.templateChipActive,
                  ]}
                  onPress={() => handleTemplateSelect(template)}
                >
                  <Icon
                    name={template.iconName}
                    size={24}
                    color={selectedTemplate === template ? colors.primary : colors.textLight}
                  />
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateCost}>{template.suggestedCost} points</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 30 Minutes TV Time"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details..."
            placeholderTextColor={colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.optionsGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.optionChip, category === cat.id && styles.optionChipActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Icon
                  name={cat.icon}
                  size={16}
                  color={category === cat.id ? colors.primary : colors.textLight}
                  style={styles.optionIcon}
                />
                <Text style={[styles.optionText, category === cat.id && styles.optionTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cost */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Point Cost</Text>
          <TextInput
            style={styles.input}
            placeholder="50"
            placeholderTextColor={colors.textLight}
            value={cost}
            onChangeText={setCost}
            keyboardType="number-pad"
          />
        </View>

        {/* Create Button */}
        <Button
          title="Create Reward"
          onPress={handleCreateReward}
          loading={loading}
          disabled={loading}
          style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateRewardScreen;
