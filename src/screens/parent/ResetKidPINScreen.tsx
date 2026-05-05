import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const ResetKidPINScreen = ({ route, navigation }: any) => {
  const { kidId, kidName } = route.params;
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (newPIN.length !== 4 || isNaN(Number(newPIN))) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }

    if (newPIN !== confirmPIN) {
      Alert.alert('Oops!', 'PINs do not match');
      return;
    }

    try {
      setIsLoading(true);

      await firestore().collection('kids').doc(kidId).update({ pin: newPIN });

      Alert.alert('Success!', `PIN for ${kidName} has been reset!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset PIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset PIN</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.info}>Reset the 4-digit PIN for {kidName}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New PIN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit PIN"
            placeholderTextColor="#9CA3AF"
            value={newPIN}
            onChangeText={setNewPIN}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm PIN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter PIN"
            placeholderTextColor="#9CA3AF"
            value={confirmPIN}
            onChangeText={setConfirmPIN}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={handleReset} disabled={isLoading} activeOpacity={0.8} style={{ marginTop: SPACING.xl }}>
          <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.resetBtn}>
            <Icon name={isLoading ? 'loading' : 'lock-reset'} size={24} color="#FFF" />
            <Text style={styles.resetBtnText}>{isLoading ? 'Resetting...' : 'Reset PIN'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.xxxl, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.xl, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.black, color: '#111827' },
  content: { flex: 1, padding: SPACING.xl },
  info: { fontSize: FONT_SIZE.md, color: '#6B7280', marginBottom: SPACING.xl, textAlign: 'center' },
  inputGroup: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.sm },
  label: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginBottom: SPACING.sm },
  input: { backgroundColor: '#F3F4F6', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, fontSize: FONT_SIZE.md, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.xl, ...SHADOWS.lg },
  resetBtnText: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.black, color: '#FFF' },
});

export default ResetKidPINScreen;
