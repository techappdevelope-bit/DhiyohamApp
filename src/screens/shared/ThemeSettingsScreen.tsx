import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { useThemeStore } from '../../store/useThemeStore';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const ThemeSettingsScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { isDark, setTheme } = useThemeStore();

  const themeOptions = [
    {
      id: 'light',
      title: 'Light Mode',
      description: 'Classic bright theme',
      icon: 'white-balance-sunny',
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      description: 'Easy on the eyes',
      icon: 'moon-waning-crescent',
    },
  ];

  const currentTheme = isDark ? 'dark' : 'light';

  const handleThemeChange = async (themeId: string) => {
    try {
      const newIsDark = themeId === 'dark';
      await setTheme(newIsDark);

      Toast.show({
        type: 'success',
        text1: 'Theme Changed',
        text2: `Switched to ${themeId} mode`,
        visibilityTime: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to change theme',
      });
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
    themeCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      padding: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      ...SHADOWS.sm,
    },
    themeCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    themeIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    themeIconActive: {
      backgroundColor: colors.primary + '20',
    },
    themeInfo: {
      flex: 1,
    },
    themeTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    themeDescription: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    preview: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      marginTop: SPACING.xl,
      ...SHADOWS.sm,
    },
    previewTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    previewGrid: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    colorBox: {
      flex: 1,
      height: 60,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorLabel: {
      fontSize: FONT_SIZE.xs,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theme</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.themeCard,
              currentTheme === option.id && styles.themeCardActive,
            ]}
            onPress={() => handleThemeChange(option.id)}
          >
            <View
              style={[
                styles.themeIcon,
                currentTheme === option.id && styles.themeIconActive,
              ]}
            >
              <Icon
                name={option.icon}
                size={24}
                color={currentTheme === option.id ? colors.primary : colors.textLight}
              />
            </View>
            <View style={styles.themeInfo}>
              <Text style={styles.themeTitle}>{option.title}</Text>
              <Text style={styles.themeDescription}>{option.description}</Text>
            </View>
            {currentTheme === option.id && (
              <Icon name="check-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Color Preview */}
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Color Preview</Text>
          <View style={styles.previewGrid}>
            <View style={[styles.colorBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.colorLabel}>Primary</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: colors.secondary }]}>
              <Text style={styles.colorLabel}>Secondary</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: colors.accent }]}>
              <Text style={styles.colorLabel}>Accent</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ThemeSettingsScreen;