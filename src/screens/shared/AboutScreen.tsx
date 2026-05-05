import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/appConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutScreen = ({ navigation }: any) => {
  const colors = useThemedColors();

  const links = [
    {
      title: 'Privacy Policy',
      icon: 'shield-check',
      url: APP_CONFIG.privacyPolicyUrl,
    },
    {
      title: 'Terms of Service',
      icon: 'file-document',
      url: APP_CONFIG.termsOfServiceUrl,
    },
    {
      title: 'Support',
      icon: 'help-circle',
      url: `mailto:${APP_CONFIG.supportEmail}`,
    },
  ];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.log('Cannot open URL');
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
    logoSection: {
      alignItems: 'center',
      paddingVertical: SPACING.xxxl,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    appName: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    version: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    description: {
      fontSize: FONT_SIZE.md,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 24,
      marginTop: SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    linksCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      marginBottom: SPACING.xl,
      ...SHADOWS.sm,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    linkItemLast: {
      borderBottomWidth: 0,
    },
    linkIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    linkText: {
      flex: 1,
      fontSize: FONT_SIZE.md,
      fontWeight: '500',
      color: colors.text,
    },
    credits: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      textAlign: 'center',
      marginTop: SPACING.xl,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo & Info */}
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Icon name="star" size={50} color={colors.primary} />
          </View>
          <Text style={styles.appName}>{APP_CONFIG.name}</Text>
          <Text style={styles.version}>Version {APP_CONFIG.version}</Text>
          <Text style={styles.description}>{APP_CONFIG.description}</Text>
        </View>

        {/* Links */}
        <View style={styles.linksCard}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={link.title}
              style={[styles.linkItem, index === links.length - 1 && styles.linkItemLast]}
              onPress={() => handleLinkPress(link.url)}
            >
              <View style={styles.linkIcon}>
                <Icon name={link.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.linkText}>{link.title}</Text>
              <Icon name="chevron-right" size={24} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Credits */}
        <Text style={styles.credits}>
          Made with ❤️ for families worldwide{'\n'}
          © 2024 ChoreQuest. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;
