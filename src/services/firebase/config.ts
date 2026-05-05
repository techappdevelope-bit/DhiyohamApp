import { initializeApp, getApps } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Initialize Firebase only once
const initializeFirebase = () => {
  const apps = getApps();
  
  if (apps.length === 0) {
    // Firebase auto-initializes from google-services.json
    console.log('Firebase initialized');
  }
  
  // Enable offline persistence
  firestore()
    .settings({
      persistence: true,
      cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    })
    .then(() => {
      console.log('Firestore offline persistence enabled');
    })
    .catch((error) => {
      console.warn('Firestore persistence error:', error);
    });
};

// Initialize immediately
initializeFirebase();

export { auth, firestore };
export default initializeFirebase;
