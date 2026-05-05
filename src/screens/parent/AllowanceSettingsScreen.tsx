import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS, FONT_WEIGHT } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const AllowanceSettingsScreen = ({ navigation }: any) => {
  const [allowanceEnabled, setAllowanceEnabled] = useState(true);
  const [weeklyAmount, setWeeklyAmount] = useState('10');
  const [autoTransfer, setAutoTransfer] = useState(true);
  const [bonusEnabled, setBonusEnabled] = useState(true);
  const [bonusPercentage, setBonusPercentage] = useState('10');

  const handleSave = () => {
    Alert.alert('Settings Saved', 'Your allowance settings have been updated!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Allowance Settings</Text>
        <Text style={styles.headerSub}>Configure automatic allowance system</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enable Allowance */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Enable Allowance System</Text>
              <Text style={styles.settingDesc}>Automatically give kids weekly allowance</Text>
            </View>
            <Switch
              value={allowanceEnabled}
              onValueChange={setAllowanceEnabled}
              trackColor={{ false: '#D1D5DB', true: '#4facfe' }}
            />
          </View>
        </View>

        {allowanceEnabled && (
          <>
            {/* Weekly Amount */}
            <View style={styles.section}>
              <Text style={styles.label}>Weekly Allowance Amount</Text>
              <View style={styles.inputRow}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  value={weeklyAmount}
                  onChangeText={setWeeklyAmount}
                  keyboardType="decimal-pad"
                  placeholder="10.00"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <Text style={styles.helperText}>
                Each kid will receive ${weeklyAmount} every Sunday at 8:00 AM
              </Text>
            </View>

            {/* Auto Transfer */}
            <View style={styles.section}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingTitle}>Auto-Transfer to Bank</Text>
                  <Text style={styles.settingDesc}>
                    Automatically convert points to real money
                  </Text>
                </View>
                <Switch
                  value={autoTransfer}
                  onValueChange={setAutoTransfer}
                  trackColor={{ false: '#D1D5DB', true: '#4facfe' }}
                />
              </View>
            </View>

            {/* Bonus System */}
            <View style={styles.section}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingTitle}>Completion Bonus</Text>
                  <Text style={styles.settingDesc}>Extra bonus for 100% task completion</Text>
                </View>
                <Switch
                  value={bonusEnabled}
                  onValueChange={setBonusEnabled}
                  trackColor={{ false: '#D1D5DB', true: '#4facfe' }}
                />
              </View>

              {bonusEnabled && (
                <View style={{ marginTop: SPACING.md }}>
                  <Text style={styles.label}>Bonus Percentage</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={bonusPercentage}
                      onChangeText={setBonusPercentage}
                      keyboardType="number-pad"
                      placeholder="10"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.percentSymbol}>%</Text>
                  </View>
                  <Text style={styles.helperText}>
                    Kids get {bonusPercentage}% extra if they complete all tasks
                  </Text>
                </View>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveBtn}
              >
                <Icon name="check" size={20} color="#FFF" />
                <Text style={styles.saveBtnText}>Save Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

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
  section: { backgroundColor: '#FFF', borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  settingTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#111827', marginBottom: 2 },
  settingDesc: { fontSize: FONT_SIZE.sm, color: '#6B7280' },
  label: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: '#374151', marginBottom: SPACING.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: BORDER_RADIUS.lg, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: '#E5E7EB' },
  currencySymbol: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#6B7280', marginRight: SPACING.xs },
  percentSymbol: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: '#6B7280', marginLeft: SPACING.xs },
  input: { flex: 1, paddingVertical: SPACING.md, fontSize: FONT_SIZE.md, color: '#111827', fontWeight: FONT_WEIGHT.medium },
  helperText: { fontSize: FONT_SIZE.xs, color: '#9CA3AF', marginTop: SPACING.sm },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.xl, marginTop: SPACING.lg, ...SHADOWS.lg },
  saveBtnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: '#FFF' },
});

export default AllowanceSettingsScreen;
