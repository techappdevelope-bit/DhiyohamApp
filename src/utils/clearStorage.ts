import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage cleared');
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
  }
};

export const clearThemeOnly = async () => {
  try {
    await AsyncStorage.removeItem('theme');
    console.log('✅ Theme cleared');
  } catch (error) {
    console.error('❌ Failed to clear theme:', error);
  }
};
