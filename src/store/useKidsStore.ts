import { create } from 'zustand';
import { Kid } from '../types';
import FirestoreService from '../services/firebase/firestore';

interface KidsState {
  kids: Kid[];
  isLoading: boolean;
  fetchKids: (parentId: string) => Promise<void>;
  fetchKidsByParent: (parentId: string) => Promise<void>;
  createKid: (kidData: Omit<Kid, 'id'>) => Promise<void>;
  updateKid: (kidId: string, data: Partial<Kid>) => Promise<void>;
  deleteKid: (kidId: string) => Promise<void>;
}

export const useKidsStore = create<KidsState>((set) => ({
  kids: [],
  isLoading: false,

  fetchKids: async (parentId: string) => {
    try {
      set({ isLoading: true });
      const kids = await FirestoreService.getKidsByParent(parentId);
      set({ kids, isLoading: false });
    } catch (error) {
      console.error('Error fetching kids:', error);
      set({ isLoading: false });
    }
  },

  fetchKidsByParent: async (parentId: string) => {
    try {
      set({ isLoading: true });
      const kids = await FirestoreService.getKidsByParent(parentId);
      set({ kids, isLoading: false });
    } catch (error) {
      console.error('Error fetching kids:', error);
      set({ isLoading: false });
    }
  },

  createKid: async (kidData: Omit<Kid, 'id'>) => {
    try {
      const kidId = await FirestoreService.createKid(kidData);
      const newKid: Kid = { id: kidId, ...kidData };
      set((state) => ({ kids: [...state.kids, newKid] }));
    } catch (error) {
      console.error('Error creating kid:', error);
      throw error;
    }
  },

  updateKid: async (kidId: string, data: Partial<Kid>) => {
    try {
      await FirestoreService.updateKid(kidId, data);
      set((state) => ({
        kids: state.kids.map((kid) =>
          kid.id === kidId ? { ...kid, ...data } : kid
        ),
      }));
    } catch (error) {
      console.error('Error updating kid:', error);
      throw error;
    }
  },

  deleteKid: async (kidId: string) => {
    try {
      await FirestoreService.deleteKid(kidId);
      set((state) => ({
        kids: state.kids.filter((kid) => kid.id !== kidId),
      }));
    } catch (error) {
      console.error('Error deleting kid:', error);
      throw error;
    }
  },
}));
