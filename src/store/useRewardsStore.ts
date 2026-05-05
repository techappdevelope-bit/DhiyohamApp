import { create } from 'zustand';
import { Reward, RewardRequest } from '../types';
import { FirestoreService } from '../services';

interface RewardsState {
  rewards: Reward[];
  rewardRequests: RewardRequest[];
  pendingRequests: RewardRequest[];
  isLoading: boolean;
  
  // Actions
  fetchRewards: (parentId: string) => Promise<void>;
  fetchRewardRequests: (kidId: string) => Promise<void>;
  fetchPendingRequests: (parentId: string) => Promise<void>;
  addReward: (rewardData: Omit<Reward, 'id'>) => Promise<void>;
  updateReward: (rewardId: string, data: Partial<Reward>) => Promise<void>;
  requestReward: (kidId: string, rewardId: string) => Promise<void>;
  approveRequest: (requestId: string, respondedBy: string) => Promise<void>;
  denyRequest: (requestId: string, respondedBy: string, note: string) => Promise<void>;
  redeemReward: (requestId: string) => Promise<void>;
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  rewards: [],
  rewardRequests: [],
  pendingRequests: [],
  isLoading: false,

  fetchRewards: async (parentId: string) => {
    try {
      set({ isLoading: true });
      const rewards = await FirestoreService.getRewardsByParent(parentId);
      set({ rewards, isLoading: false });
    } catch (error) {
      console.error('Fetch rewards error:', error);
      set({ isLoading: false });
    }
  },

  fetchRewardRequests: async (kidId: string) => {
    try {
      set({ isLoading: true });
      const rewardRequests = await FirestoreService.getRewardRequestsByKid(kidId);
      set({ rewardRequests, isLoading: false });
    } catch (error) {
      console.error('Fetch reward requests error:', error);
      set({ isLoading: false });
    }
  },

  fetchPendingRequests: async (parentId: string) => {
    try {
      set({ isLoading: true });
      const pendingRequests = await FirestoreService.getPendingRewardRequests(parentId);
      set({ pendingRequests, isLoading: false });
    } catch (error) {
      console.error('Fetch pending requests error:', error);
      set({ isLoading: false });
    }
  },

  addReward: async (rewardData: Omit<Reward, 'id'>) => {
    try {
      const rewardId = await FirestoreService.createReward(rewardData);
      
      const newReward: Reward = { id: rewardId, ...rewardData };
      set((state) => ({ 
        rewards: [...state.rewards, newReward] 
      }));
    } catch (error) {
      console.error('Add reward error:', error);
      throw error;
    }
  },

  updateReward: async (rewardId: string, data: Partial<Reward>) => {
    try {
      await FirestoreService.updateReward(rewardId, data);
      
      set((state) => ({
        rewards: state.rewards.map((reward) =>
          reward.id === rewardId ? { ...reward, ...data } : reward
        ),
      }));
    } catch (error) {
      console.error('Update reward error:', error);
      throw error;
    }
  },

  requestReward: async (kidId: string, rewardId: string) => {
    try {
      const requestData: Omit<RewardRequest, 'id'> = {
        kidId,
        rewardId,
        status: 'pending',
        requestedAt: new Date(),
      };
      
      const requestId = await FirestoreService.createRewardRequest(requestData);
      
      const newRequest: RewardRequest = { id: requestId, ...requestData };
      set((state) => ({ 
        rewardRequests: [...state.rewardRequests, newRequest] 
      }));
    } catch (error) {
      console.error('Request reward error:', error);
      throw error;
    }
  },

  approveRequest: async (requestId: string, respondedBy: string) => {
    try {
      const updateData: Partial<RewardRequest> = {
        status: 'approved',
        respondedAt: new Date(),
        respondedBy,
      };
      
      await FirestoreService.updateRewardRequest(requestId, updateData);
      
      set((state) => ({
        rewardRequests: state.rewardRequests.map((req) =>
          req.id === requestId ? { ...req, ...updateData } : req
        ),
        pendingRequests: state.pendingRequests.filter((req) => req.id !== requestId),
      }));
    } catch (error) {
      console.error('Approve request error:', error);
      throw error;
    }
  },

  denyRequest: async (requestId: string, respondedBy: string, note: string) => {
    try {
      const updateData: Partial<RewardRequest> = {
        status: 'denied',
        respondedAt: new Date(),
        respondedBy,
        parentNote: note,
      };
      
      await FirestoreService.updateRewardRequest(requestId, updateData);
      
      set((state) => ({
        rewardRequests: state.rewardRequests.map((req) =>
          req.id === requestId ? { ...req, ...updateData } : req
        ),
        pendingRequests: state.pendingRequests.filter((req) => req.id !== requestId),
      }));
    } catch (error) {
      console.error('Deny request error:', error);
      throw error;
    }
  },

  redeemReward: async (requestId: string) => {
    try {
      const updateData: Partial<RewardRequest> = {
        status: 'redeemed',
        redeemedAt: new Date(),
      };
      
      await FirestoreService.updateRewardRequest(requestId, updateData);
      
      set((state) => ({
        rewardRequests: state.rewardRequests.map((req) =>
          req.id === requestId ? { ...req, ...updateData } : req
        ),
      }));
    } catch (error) {
      console.error('Redeem reward error:', error);
      throw error;
    }
  },
}));
