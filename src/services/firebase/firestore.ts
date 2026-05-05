import firestore from '@react-native-firebase/firestore';
import { Parent, Kid, Chore, Task, Reward, Achievement } from '../../types';

class FirestoreService {
  // Parent operations
  static async createParent(data: Omit<Parent, 'id'>): Promise<string> {
    const docRef = await firestore().collection('users').add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getParent(parentId: string): Promise<Parent | null> {
    const doc = await firestore().collection('users').doc(parentId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Parent;
  }

  static async updateParent(parentId: string, data: Partial<Parent>): Promise<void> {
    await firestore().collection('users').doc(parentId).update(data);
  }

  // Kid operations
  static async createKid(data: Omit<Kid, 'id'>): Promise<string> {
    const docRef = await firestore().collection('kids').add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getKid(kidId: string): Promise<Kid | null> {
    const doc = await firestore().collection('kids').doc(kidId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Kid;
  }

  static async getKidsByParent(parentId: string): Promise<Kid[]> {
    const snapshot = await firestore()
      .collection('kids')
      .where('parentId', '==', parentId)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Kid));
  }

  static async updateKid(kidId: string, data: Partial<Kid>): Promise<void> {
    await firestore().collection('kids').doc(kidId).update(data);
  }

  static async deleteKid(kidId: string): Promise<void> {
    await firestore().collection('kids').doc(kidId).delete();
  }

  // Chore operations
  static async createChore(data: Omit<Chore, 'id'>): Promise<string> {
    const docRef = await firestore().collection('chores').add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getChore(choreId: string): Promise<Chore | null> {
    const doc = await firestore().collection('chores').doc(choreId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Chore;
  }

  static async getChoresByParent(parentId: string): Promise<Chore[]> {
    const snapshot = await firestore()
      .collection('chores')
      .where('parentId', '==', parentId)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chore));
  }

  static async updateChore(choreId: string, data: Partial<Chore>): Promise<void> {
    await firestore().collection('chores').doc(choreId).update(data);
  }

  static async deleteChore(choreId: string): Promise<void> {
    await firestore().collection('chores').doc(choreId).delete();
  }

  // Task operations
  static async createTask(data: Omit<Task, 'id'>): Promise<string> {
    const docRef = await firestore().collection('tasks').add({
      ...data,
      dueDate: firestore.Timestamp.fromDate(new Date(data.dueDate)),
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getTask(taskId: string): Promise<Task | null> {
    const doc = await firestore().collection('tasks').doc(taskId).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dueDate: data?.dueDate?.toDate() || new Date(),
      completedAt: data?.completedAt?.toDate(),
      approvedAt: data?.approvedAt?.toDate(),
    } as Task;
  }

  static async getTasksByKid(kidId: string, status?: string): Promise<Task[]> {
    let query = firestore()
      .collection('tasks')
      .where('kidId', '==', kidId);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        approvedAt: data.approvedAt?.toDate(),
      } as Task;
    });
  }

  static async getPendingApprovals(parentId: string): Promise<Task[]> {
    const snapshot = await firestore()
      .collection('tasks')
      .where('status', '==', 'completed')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        approvedAt: data.approvedAt?.toDate(),
      } as Task;
    });
  }

  static async updateTask(taskId: string, data: Partial<Task>): Promise<void> {
    const updateData: any = { ...data };
    
    if (data.completedAt) {
      updateData.completedAt = firestore.Timestamp.fromDate(new Date(data.completedAt));
    }
    if (data.approvedAt) {
      updateData.approvedAt = firestore.Timestamp.fromDate(new Date(data.approvedAt));
    }
    if (data.dueDate) {
      updateData.dueDate = firestore.Timestamp.fromDate(new Date(data.dueDate));
    }
    
    await firestore().collection('tasks').doc(taskId).update(updateData);
  }

  static async deleteTask(taskId: string): Promise<void> {
    await firestore().collection('tasks').doc(taskId).delete();
  }

  // Reward operations
  static async createReward(data: Omit<Reward, 'id'>): Promise<string> {
    const docRef = await firestore().collection('rewards').add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getReward(rewardId: string): Promise<Reward | null> {
    const doc = await firestore().collection('rewards').doc(rewardId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Reward;
  }

  static async getRewardsByParent(parentId: string): Promise<Reward[]> {
    const snapshot = await firestore()
      .collection('rewards')
      .where('parentId', '==', parentId)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reward));
  }

  static async updateReward(rewardId: string, data: Partial<Reward>): Promise<void> {
    await firestore().collection('rewards').doc(rewardId).update(data);
  }

  static async deleteReward(rewardId: string): Promise<void> {
    await firestore().collection('rewards').doc(rewardId).delete();
  }

  // Achievement operations
  static async createAchievement(data: Omit<Achievement, 'id'>): Promise<string> {
    const docRef = await firestore().collection('achievements').add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async getAchievementsByKid(kidId: string): Promise<Achievement[]> {
    const snapshot = await firestore()
      .collection('achievements')
      .where('kidId', '==', kidId)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Achievement));
  }
}

export default FirestoreService;
