import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const THEMES = [
  { 
    id: 'light' as const, 
    name: 'Light Mode', 
    colors: ['#667eea', '#764ba2'], 
    icon: 'white-balance-sunny',
    description: 'Bright and colorful interface'
  },
  { 
    id: 'dark' as const, 
    name: 'Dark Mode', 
    colors: ['#2c3e50', '#34495e'], 
    icon: 'moon-waning-crescent',
    description: 'Easy on the eyes at night'
  },
];

const AppThemeScreen = ({ navigation }: any) => {
  const { theme, setTheme } = useThemeStore();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleApplyTheme = async () => {
    try {
      await setTheme(selectedTheme);
      Alert.alert(
        'Theme Applied! ✨',
        `${THEMES.find(t => t.id === selectedTheme)?.name} has been activated. Some screens may need to be refreshed.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save theme. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Theme</Text>
        <Text style={styles.headerSub}>Choose your preferred theme</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>APPEARANCE</Text>

        {THEMES.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.id}
            style={[
              styles.themeCard,
              selectedTheme === themeOption.id && styles.themeCardSelected,
            ]}
            onPress={() => setSelectedTheme(themeOption.id)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={themeOption.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.themePreview}
            >
              <Icon name={themeOption.icon} size={40} color="#FFF" />
            </LinearGradient>

            <View style={styles.themeInfo}>
              <Text style={styles.themeName}>{themeOption.name}</Text>
              <Text style={styles.themeDesc}>{themeOption.description}</Text>
            </View>

            {selectedTheme === themeOption.id && (
              <View style={styles.checkCircle}>
                <Icon name="check-circle" size={28} color="#10B981" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Icon name="information" size={20} color="#667eea" />
          <Text style={styles.infoText}>
            Theme changes will apply to the app background, navigation, and overall color scheme.
          </Text>
        </View>

        {/* Apply Button */}
        <TouchableOpacity 
          onPress={handleApplyTheme} 
          activeOpacity={0.8} 
          style={{ marginTop: SPACING.lg }}
          disabled={selectedTheme === theme}
        >
          <LinearGradient
            colors={selectedTheme === theme ? ['#D1D5DB', '#9CA3AF'] : ['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.applyBtn}
          >
            <Icon name="check" size={20} color="#FFF" />
            <Text style={styles.applyBtnText}>
              {selectedTheme === theme ? 'Current Theme' : 'Apply Theme'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { 
    paddingTop: SPACING.xxxl, 
    paddingBottom: SPACING.xl, 
    paddingHorizontal: SPACING.xl 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: SPACING.md 
  },
  headerTitle: { 
    fontSize: FONT_SIZE.xxxl, 
    fontWeight: FONT_WEIGHT.black, 
    color: '#FFF' 
  },
  headerSub: { 
    fontSize: FONT_SIZE.md, 
    color: '#FFF', 
    opacity: 0.9, 
    marginTop: SPACING.xs 
  },
  content: { flex: 1, padding: SPACING.xl },
  sectionTitle: { 
    fontSize: FONT_SIZE.xs, 
    fontWeight: FONT_WEIGHT.bold, 
    color: '#9CA3AF', 
    marginBottom: SPACING.lg, 
    letterSpacing: 1 
  },
  themeCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.lg, 
    marginBottom: SPACING.lg, 
    ...SHADOWS.md, 
    borderWidth: 3, 
    borderColor: 'transparent' 
  },
  themeCardSelected: { 
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  themePreview: { 
    width: 80, 
    height: 80, 
    borderRadius: BORDER_RADIUS.xl, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: SPACING.lg,
    ...SHADOWS.lg,
  },
  themeInfo: { flex: 1 },
  themeName: { 
    fontSize: FONT_SIZE.lg, 
    fontWeight: FONT_WEIGHT.black, 
    color: '#111827', 
    marginBottom: SPACING.xs 
  },
  themeDesc: {
    fontSize: FONT_SIZE.sm,
    color: '#6B7280',
  },
  checkCircle: {
    marginLeft: SPACING.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#EEF2FF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: '#4338CA',
    lineHeight: 20,
  },
  applyBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: SPACING.sm, 
    paddingVertical: SPACING.lg, 
    borderRadius: BORDER_RADIUS.xl, 
    ...SHADOWS.lg 
  },
  applyBtnText: { 
    fontSize: FONT_SIZE.lg, 
    fontWeight: FONT_WEIGHT.black, 
    color: '#FFF' 
  },
});

export default AppThemeScreen;
