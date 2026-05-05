import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Parent, Kid, UserRole } from '../../types';

class AuthService {
  static async signIn(email: string, password: string): Promise<Parent> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (!userDoc.exists) throw new Error('User not found');
      const userData = userDoc.data()!;
      return {
        id: uid,
        email: userData.email,
        name: userData.name,
        role: 'parent',
        createdAt: userData.createdAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  }

  static async signUp(name: string, email: string, password: string): Promise<Parent> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      const parentData = {
        email, name, role: 'parent',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      await firestore().collection('users').doc(uid).set(parentData);
      return {
        id: uid, email, name, role: 'parent', createdAt: new Date(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  }

  static async kidPinLogin(pin: string): Promise<Kid> {
    try {
      const kidsSnapshot = await firestore()
        .collection('kids')
        .where('pin', '==', pin)
        .limit(1)
        .get();

      if (kidsSnapshot.empty) {
        throw new Error('Invalid PIN. Try again!');
      }

      const kidDoc = kidsSnapshot.docs[0];
      const kidData = kidDoc.data();

      return {
        id: kidDoc.id,
        parentId: kidData.parentId || '',
        name: kidData.name || 'Kid',
        age: kidData.age || undefined,
        pin: kidData.pin || '',
        points: kidData.points || 0,
        level: kidData.level || 1,
        streak: kidData.streak || 0,
        allowanceBalance: kidData.allowanceBalance || 0,
        avatarUrl: kidData.avatarUrl || undefined,
        color: kidData.color || undefined,
        role: 'kid',
        createdAt: kidData.createdAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      console.error('Kid PIN login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  static async signOut(): Promise<void> {
    await auth().signOut();
  }

  static async getCurrentUser(userId: string, role: UserRole): Promise<Parent | Kid | null> {
    try {
      if (role === 'parent') {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) return null;
        const data = userDoc.data()!;
        return {
          id: userId,
          email: data.email,
          name: data.name,
          role: 'parent',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      } else {
        const kidDoc = await firestore().collection('kids').doc(userId).get();
        if (!kidDoc.exists) return null;
        const data = kidDoc.data()!;
        return {
          id: userId,
          parentId: data.parentId || '',
          name: data.name || 'Kid',
          age: data.age || undefined,
          pin: data.pin || '',
          points: data.points || 0,
          level: data.level || 1,
          streak: data.streak || 0,
          allowanceBalance: data.allowanceBalance || 0,
          role: 'kid',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}

export default AuthService;
