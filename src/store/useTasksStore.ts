import { create } from 'zustand';
import { Task } from '../types';
import firestore from '@react-native-firebase/firestore';

interface TasksState {
  tasks: Task[];
  pendingApprovals: Task[];
  isLoading: boolean;
  fetchTasksByKid: (kidId: string) => Promise<void>;
  fetchPendingApprovals: (parentId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  approveTask: (taskId: string, bonusPoints?: number, comment?: string) => Promise<void>;
  rejectTask: (taskId: string, comment: string) => Promise<void>;
}

const toTask = (doc: any): Task => {
  const d = doc.data();
  return {
    id: doc.id,
    choreId: d.choreId || '',
    choreName: d.choreName || 'Task',
    kidId: d.kidId || '',
    status: d.status || 'pending',
    dueDate: d.dueDate?.toDate?.() ?? new Date(),
    pointsAwarded: d.pointsAwarded || 0,
    requirePhoto: d.requirePhoto || false,
    completedAt: d.completedAt?.toDate?.() ?? undefined,
    approvedAt: d.approvedAt?.toDate?.() ?? undefined,
    photoUrl: d.photoUrl || undefined,
    bonusPoints: d.bonusPoints || undefined,
    approvalComment: d.approvalComment || undefined,
    rejectionComment: d.rejectionComment || undefined,
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
  } as Task;
};

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  pendingApprovals: [],
  isLoading: false,

  fetchTasksByKid: async (kidId: string) => {
    try {
      set({ isLoading: true });
      const snap = await firestore()
        .collection('tasks')
        .where('kidId', '==', kidId)
        .get();
      const tasks = snap.docs.map(toTask);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('fetchTasksByKid error:', error);
      set({ isLoading: false });
    }
  },

  fetchPendingApprovals: async (_parentId: string) => {
    try {
      set({ isLoading: true });
      const snap = await firestore()
        .collection('tasks')
        .where('status', '==', 'completed')
        .get();
      const pendingApprovals = snap.docs.map(toTask);
      set({ pendingApprovals, isLoading: false });
    } catch (error) {
      console.error('fetchPendingApprovals error:', error);
      set({ isLoading: false });
    }
  },

//   completeTask: async (taskId: string) => {
//     try {
//       // Minimal update - only status and timestamp, zero undefined
//       await firestore()
//         .collection('tasks')
//         .doc(taskId)
//         .update({
//           status: 'completed',
//           completedAt: firestore.Timestamp.now(),
//         });
//
//       set((state) => ({
//         tasks: state.tasks.map((t) =>
//           t.id === taskId
//             ? { ...t, status: 'completed' as const, completedAt: new Date() }
//             : t
//         ),
//       }));
//     } catch (error) {
//       console.error('completeTask error:', error);
//       throw error;
//     }
//   },

// Change this:
completeTask: async (taskId: string) => {
  try {
    await firestore()
      .collection('tasks')
      .doc(taskId)
      .update({
        status: 'completed',
        completedAt: firestore.Timestamp.now(),
      });

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: 'completed' as const, completedAt: new Date() }
          : t
      ),
    }));
  } catch (error) {
    console.error('completeTask error:', error);
    throw error;
  }
},

// To this:
completeTask: async (taskId: string, photoUrl?: string) => {
  try {
    const update: Record<string, any> = {
      status: 'completed',
      completedAt: firestore.Timestamp.now(),
    };
    if (photoUrl) update.photoUrl = photoUrl;

    await firestore()
      .collection('tasks')
      .doc(taskId)
      .update(update);

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: 'completed' as const, completedAt: new Date(), ...(photoUrl && { photoUrl }) }
          : t
      ),
    }));
  } catch (error) {
    console.error('completeTask error:', error);
    throw error;
  }
},

  approveTask: async (taskId: string, bonusPoints?: number, comment?: string) => {
    try {
      const update: Record<string, any> = {
        status: 'approved',
        approvedAt: firestore.Timestamp.now(),
      };
      if (bonusPoints && bonusPoints > 0) update.bonusPoints = bonusPoints;
      if (comment && comment.length > 0) update.approvalComment = comment;

      await firestore().collection('tasks').doc(taskId).update(update);

      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter((t) => t.id !== taskId),
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'approved' as const } : t
        ),
      }));
    } catch (error) {
      console.error('approveTask error:', error);
      throw error;
    }
  },

  rejectTask: async (taskId: string, comment: string) => {
    try {
      const update: Record<string, any> = { status: 'rejected' };
      if (comment && comment.length > 0) update.rejectionComment = comment;

      await firestore().collection('tasks').doc(taskId).update(update);

      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter((t) => t.id !== taskId),
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'rejected' as const } : t
        ),
      }));
    } catch (error) {
      console.error('rejectTask error:', error);
      throw error;
    }
  },
}));