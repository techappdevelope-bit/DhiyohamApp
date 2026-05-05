


import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, TextInput,
} from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from '../../constants/theme';
import { useAuthStore } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const KidLoginScreen = ({ navigation }: any) => {
  const { kidPinLogin } = useAuthStore();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!pin || pin.trim().length < 4) {
      Alert.alert('Oops!', 'Please enter your password');
      return;
    }
    try {
      setIsLoading(true);
      await kidPinLogin(pin.trim());
    } catch (error: any) {
      Alert.alert('Oops! 😕', error.message || 'Invalid password. Try again!');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Hi Kid! 👋</Text>
        <Text style={styles.subtitle}>Enter your secret password</Text>
      </LinearGradient>

      <View style={styles.content}>

        <View style={styles.card}>
          <Icon name="shield-lock-outline" size={48} color="#f093fb" style={styles.lockIcon} />
          <Text style={styles.label}>Enter Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={pin}
              onChangeText={setPin}
              secureTextEntry={!showPin}
              autoCapitalize="none"
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setShowPin(!showPin)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPin ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>


         <TouchableOpacity
           onPress={handleLogin}
           disabled={isLoading}
           activeOpacity={0.8}
           style={{ marginTop: SPACING.lg, width: '100%' }}
         >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginBtn}
            >
              <Icon
                name={isLoading ? 'loading' : 'login'}
                size={22}
                color="#FFF"
              />
              <Text style={styles.loginBtnText}>
                {isLoading ? 'Checking...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: SPACING.xxxl,
    left: SPACING.xl,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFF',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockIcon: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#374151',
    marginBottom: SPACING.lg,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: '#111827',
  },
  eyeIcon: {
    padding: SPACING.md,
  },
 loginBtn: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: SPACING.sm,
     paddingVertical: SPACING.lg,
     borderRadius: BORDER_RADIUS.xl,
   },
  loginBtnText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.black,
    color: '#FFF',
  },
});

export default KidLoginScreen;