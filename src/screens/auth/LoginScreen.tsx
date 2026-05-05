import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { isValidEmail, isValidPassword } from '../../utils/validation';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }: any) => {
  const colors = useThemedColors();
  const { signIn } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Logged in successfully',
      });

      // Navigation handled by auth state change
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Invalid credentials',
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
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
    },
    backButton: {
      padding: SPACING.sm,
      alignSelf: 'flex-start',
    },
    scrollContent: {
      flexGrow: 1,
      padding: SPACING.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: SPACING.xl,
    },
    title: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FONT_SIZE.md,
      color: colors.textLight,
      marginBottom: SPACING.xxxl,
      textAlign: 'center',
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: SPACING.xl,
    },
    forgotPasswordText: {
      fontSize: FONT_SIZE.sm,
      color: colors.primary,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: SPACING.xl,
    },
    footerText: {
      fontSize: FONT_SIZE.sm,
      color: colors.textLight,
    },
    signUpLink: {
      fontSize: FONT_SIZE.sm,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: SPACING.xs,
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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Icon name="account-tie" size={40} color={colors.primary} />
        </View>

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          icon="email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          icon="lock"
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ParentRegister')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
