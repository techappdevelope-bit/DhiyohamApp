import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }: any) => {
  const colors = useThemedColors();

  const handleParentLogin = () => {
    navigation.navigate('Login');
  };

  const handleKidLogin = () => {
    navigation.navigate('KidLogin');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: SPACING.xxxl,
      paddingBottom: SPACING.xl,
      paddingHorizontal: SPACING.xl,
    },
    title: {
      fontSize: FONT_SIZE.giant,
      fontWeight: FONT_WEIGHT.black,
      color: '#FFFFFF',
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FONT_SIZE.md,
      color: '#FFFFFF',
      opacity: 0.9,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: SPACING.xl,
      justifyContent: 'center',
      gap: SPACING.xl,
    },
    roleCard: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.xxl,
      padding: SPACING.xxl,
      alignItems: 'center',
      ...SHADOWS.lg,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: BORDER_RADIUS.xl,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    roleTitle: {
      fontSize: FONT_SIZE.xl,
      fontWeight: FONT_WEIGHT.black,
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    roleSubtitle: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Who's Using?</Text>
        <Text style={styles.subtitle}>Select your role to continue</Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={handleParentLogin}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Icon name="account-tie" size={50} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.roleTitle}>I'm a Parent</Text>
          <Text style={styles.roleSubtitle}>
            Manage chores, approve tasks, and track progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={handleKidLogin}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Icon name="emoticon-happy" size={50} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.roleTitle}>I'm a Kid</Text>
          <Text style={styles.roleSubtitle}>
            Complete tasks, earn points, and get rewards!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoleSelectionScreen;
