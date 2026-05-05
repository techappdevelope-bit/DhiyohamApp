import { create } from 'zustand';
import { Chore } from '../types';
import { FirestoreService } from '../services';

interface ChoresState {
  chores: Chore[];
  isLoading: boolean;
  
  fetchChoresByParent: (parentId: string) => Promise<void>;
  createChore: (choreData: Omit<Chore, 'id'>) => Promise<void>;
  updateChore: (choreId: string, data: Partial<Chore>) => Promise<void>;
  deleteChore: (choreId: string) => Promise<void>;
  getChoreById: (choreId: string) => Chore | undefined;
}

export const useChoresStore = create<ChoresState>((set, get) => ({
  chores: [],
  isLoading: false,

  fetchChoresByParent: async (parentId: string) => {
    try {
      set({ isLoading: true });
      const chores = await FirestoreService.getChoresByParent(parentId);
      set({ chores, isLoading: false });
    } catch (error) {
      console.error('Error fetching chores:', error);
      set({ isLoading: false });
    }
  },

  createChore: async (choreData: Omit<Chore, 'id'>) => {
    try {
      const choreId = await FirestoreService.createChore(choreData);
      const newChore: Chore = { id: choreId, ...choreData };
      set((state) => ({ chores: [...state.chores, newChore] }));
    } catch (error) {
      console.error('Error creating chore:', error);
      throw error;
    }
  },

  updateChore: async (choreId: string, data: Partial<Chore>) => {
    try {
      await FirestoreService.updateChore(choreId, data);
      set((state) => ({
        chores: state.chores.map((chore) =>
          chore.id === choreId ? { ...chore, ...data } : chore
        ),
      }));
    } catch (error) {
      console.error('Error updating chore:', error);
      throw error;
    }
  },

  deleteChore: async (choreId: string) => {
    try {
      await FirestoreService.deleteChore(choreId);
      set((state) => ({
        chores: state.chores.filter((chore) => chore.id !== choreId),
      }));
    } catch (error) {
      console.error('Error deleting chore:', error);
      throw error;
    }
  },

  getChoreById: (choreId: string) => {
    return get().chores.find((chore) => chore.id === choreId);
  },
}));
