import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const AboutAppScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <LinearGradient colors={['#f093fb', '#f5576c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo}>
            <Icon name="star" size={48} color="#FFF" />
          </LinearGradient>
        </View>

        <Text style={styles.appName}>ChoreQuest</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.aboutText}>
            ChoreQuest turns household chores into an exciting adventure for families! 
            Kids earn points, level up, and unlock achievements while learning responsibility. 
            Parents get a simple way to manage tasks and rewards.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Gamified chore management</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Points & rewards system</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Achievements & streaks</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Automatic allowance</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>Multi-kid support</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LINKS</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://chorequest.app')}>
            <Icon name="web" size={20} color="#667eea" />
            <Text style={styles.linkText}>chorequest.app</Text>
            <Icon name="open-in-new" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://chorequest.app/privacy')}>
            <Icon name="shield-check" size={20} color="#667eea" />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Icon name="open-in-new" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://chorequest.app/terms')}>
            <Icon name="file-document" size={20} color="#667eea" />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Icon name="open-in-new" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Made with ❤️ for families worldwide{'\n'}
          © 2026 ChoreQuest. All rights reserved.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxl, paddingHorizontal: SPACING.xl, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  logoContainer: { marginBottom: SPACING.lg },
  logo: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF', marginBottom: SPACING.xs },
  version: { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9 },
  content: { flex: 1, padding: SPACING.xl },
  section: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md },
  aboutText: { fontSize: FONT_SIZE.md, color: '#6B7280', lineHeight: 22 },
  sectionTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: '#9CA3AF', marginBottom: SPACING.md, letterSpacing: 1 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  featureText: { fontSize: FONT_SIZE.md, color: '#374151' },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  linkText: { flex: 1, fontSize: FONT_SIZE.md, color: '#111827', fontWeight: FONT_WEIGHT.medium },
  footer: { fontSize: FONT_SIZE.sm, color: '#9CA3AF', textAlign: 'center', marginTop: SPACING.xl },
});

export default AboutAppScreen;
