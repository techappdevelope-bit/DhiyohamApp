import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/appConfig';
import { Button } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const HelpSupportScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const faqs = [
    {
      id: '1',
      question: 'How do I add a new kid?',
      answer: 'Go to Profile → Manage Kids → Tap the + button. Enter their name, age, and create a 4-digit PIN for them to login.',
    },
    {
      id: '2',
      question: 'How do kids login?',
      answer: 'Kids use a 4-digit PIN code that you set up. They select their profile and enter their PIN on the kid login screen.',
    },
    {
      id: '3',
      question: 'How does the points system work?',
      answer: 'Kids earn points by completing chores. You can set custom point values for each chore. Points can be converted to allowance money in Settings.',
    },
    {
      id: '4',
      question: 'What are achievements?',
      answer: 'Achievements are unlocked when kids reach milestones like completing 10 tasks, maintaining a 7-day streak, or earning certain amounts of points.',
    },
    {
      id: '5',
      question: 'How do I approve tasks?',
      answer: 'When a kid marks a task as complete, it appears in your Pending Approvals. Review the task (and photo if required), then approve or reject with feedback.',
    },
    {
      id: '6',
      question: 'Can I customize chore templates?',
      answer: 'Yes! When creating a chore, you can use templates as a starting point and modify the name, points, category, and requirements.',
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Message Required',
        text2: 'Please enter your message',
      });
      return;
    }

    const subject = 'ChoreQuest Support Request';
    const body = message;
    const mailtoUrl = `mailto:${APP_CONFIG.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).then(() => {
      Toast.show({
        type: 'success',
        text1: 'Opening Email App',
        text2: 'Please send your message',
      });
      setMessage('');
    });
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
      marginBottom: SPACING.xxl,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.md,
    },
    faqCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.sm,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    faqQuestion: {
      flex: 1,
      fontSize: FONT_SIZE.md,
      fontWeight: '600',
      color: colors.text,
    },
    faqAnswer: {
      padding: SPACING.lg,
      paddingTop: 0,
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      lineHeight: 20,
    },
    contactCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      ...SHADOWS.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: FONT_SIZE.md,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: SPACING.md,
      height: 120,
      textAlignVertical: 'top',
    },
    contactInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.md,
      padding: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
    },
    contactText: {
      flex: 1,
      fontSize: FONT_SIZE.sm,
      color: colors.text,
      marginLeft: SPACING.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon
                  name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.textLight}
                />
              </TouchableOpacity>
              {expandedFAQ === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactCard}>
            <TextInput
              style={styles.input}
              placeholder="Describe your issue or question..."
              placeholderTextColor={colors.textLight}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
            />

            <Button
              title="Send Message"
              onPress={handleSendMessage}
              icon="email-send"
            />

            <View style={styles.contactInfo}>
              <Icon name="email" size={20} color={colors.primary} />
              <Text style={styles.contactText}>{APP_CONFIG.supportEmail}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;
