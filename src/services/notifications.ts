import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class NotificationService {
  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
      }

      return enabled;
    } catch (error) {
      console.error('Request permission error:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  async sendLocalNotification(title: string, body: string): Promise<void> {
    // This would use a local notification library like notifee
    // For now, we'll use FCM for all notifications
    console.log('Local notification:', title, body);
  }

  onMessageReceived(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  }

  onNotificationOpenedApp(callback: (message: any) => void) {
    return messaging().onNotificationOpenedApp(callback);
  }

  async getInitialNotification() {
    return messaging().getInitialNotification();
  }
}

export default new NotificationService();
