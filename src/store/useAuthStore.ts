import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services';
import { Parent, Kid, UserRole } from '../types';

interface AuthState {
  user: Parent | Kid | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Parent | Kid) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  kidPinLogin: (pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: Parent | Kid) => {
    set({ user, isAuthenticated: true });
  },

  signIn: async (email: string, password: string) => {
    try {
      const user = await AuthService.signIn(email, password);
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userRole', user.role);
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      const user = await AuthService.signUp(name, email, password);
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userRole', user.role);
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  kidPinLogin: async (pin: string) => {
    try {
      const kid = await AuthService.kidPinLogin(pin);
      await AsyncStorage.setItem('userId', kid.id);
      await AsyncStorage.setItem('userRole', 'kid');
      await AsyncStorage.setItem('parentId', kid.parentId);
      set({ user: kid, isAuthenticated: true });
    } catch (error) {
      console.error('Kid login error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const userRole = get().user?.role;
      
      // Sign out from Firebase Auth if parent
      if (userRole === 'parent') {
        await AuthService.signOut();
      }
      
      // Clear ALL AsyncStorage keys
      await AsyncStorage.multiRemove(['userId', 'userRole', 'parentId']);
      
      // IMPORTANT: Set state AFTER clearing storage
      set({ user: null, isAuthenticated: false });
      
      console.log('Sign out complete');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear local state
      await AsyncStorage.multiRemove(['userId', 'userRole', 'parentId']);
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const [userId, userRole] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userRole'),
      ]);

      console.log('CheckAuth - userId:', userId, 'userRole:', userRole);

      if (!userId || !userRole) {
        console.log('No stored auth, setting not authenticated');
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      const user = await AuthService.getCurrentUser(userId, userRole as UserRole);
      
      if (user) {
        console.log('User found:', user.id, user.role);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        console.log('User not found in DB, clearing storage');
        await AsyncStorage.multiRemove(['userId', 'userRole', 'parentId']);
        set({ isLoading: false, isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      await AsyncStorage.multiRemove(['userId', 'userRole', 'parentId']);
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },
}));
