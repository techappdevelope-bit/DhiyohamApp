import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const HelpSupportScreen = ({ navigation }: any) => {
  const helpTopics = [
    { icon: 'account-group', title: 'Getting Started', desc: 'Learn how to set up your family' },
    { icon: 'clipboard-check', title: 'Creating Chores', desc: 'Best practices for task management' },
    { icon: 'gift', title: 'Reward System', desc: 'How rewards and points work' },
    { icon: 'trophy', title: 'Achievements', desc: 'Understanding the achievement system' },
    { icon: 'cash', title: 'Allowance', desc: 'Setting up automatic allowances' },
  ];

  const contactOptions = [
    { icon: 'email', title: 'Email Support', value: 'support@chorequest.app', action: () => Linking.openURL('mailto:support@chorequest.app') },
    { icon: 'chat', title: 'Live Chat', value: 'Available Mon-Fri 9AM-5PM', action: () => {} },
    { icon: 'book-open-variant', title: 'Documentation', value: 'docs.chorequest.app', action: () => Linking.openURL('https://chorequest.app/docs') },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#fa709a', '#fee140']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSub}>We're here to help!</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>POPULAR TOPICS</Text>
        {helpTopics.map((topic, index) => (
          <TouchableOpacity key={index} style={styles.topicCard}>
            <View style={[styles.topicIcon, { backgroundColor: '#667eea' }]}>
              <Icon name={topic.icon} size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDesc}>{topic.desc}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>CONTACT US</Text>
        {contactOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.contactCard} onPress={option.action}>
            <View style={[styles.contactIcon, { backgroundColor: '#f093fb' }]}>
              <Icon name={option.icon} size={20} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>{option.title}</Text>
              <Text style={styles.contactValue}>{option.value}</Text>
            </View>
            <Icon name="open-in-new" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
  headerSub: { fontSize: FONT_SIZE.md, color: '#FFF', opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1, padding: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: '#9CA3AF', marginBottom: SPACING.md, letterSpacing: 1 },
  topicCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md, gap: SPACING.md },
  topicIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  topicTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: 2 },
  topicDesc: { fontSize: FONT_SIZE.sm, color: '#6B7280' },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md, gap: SPACING.md },
  contactIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  contactTitle: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: '#111827', marginBottom: 2 },
  contactValue: { fontSize: FONT_SIZE.sm, color: '#6B7280' },
});

export default HelpSupportScreen;
