import { create } from 'zustand';
import { Achievement } from '../types';
import { FirestoreService } from '../services';

interface AchievementsState {
  achievements: Achievement[];
  isLoading: boolean;
  
  fetchAchievementsByKid: (kidId: string) => Promise<void>;
  unlockAchievement: (kidId: string, achievementKey: string) => Promise<void>;
  checkAndUnlockAchievements: (kidId: string) => Promise<void>;
}

export const useAchievementsStore = create<AchievementsState>((set, get) => ({
  achievements: [],
  isLoading: false,

  fetchAchievementsByKid: async (kidId: string) => {
    try {
      set({ isLoading: true });
      const achievements = await FirestoreService.getAchievementsByKid(kidId);
      set({ achievements, isLoading: false });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      set({ isLoading: false });
    }
  },

  unlockAchievement: async (kidId: string, achievementKey: string) => {
    try {
      const achievementData = {
        kidId,
        key: achievementKey,
        unlockedAt: new Date(),
      };
      
      await FirestoreService.createAchievement(achievementData);
      
      set((state) => ({
        achievements: [...state.achievements, { id: '', ...achievementData }],
      }));
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  },

  checkAndUnlockAchievements: async (kidId: string) => {
    try {
      // This would contain logic to check various conditions
      // and unlock achievements accordingly
      console.log('Checking achievements for kid:', kidId);
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  },
}));
