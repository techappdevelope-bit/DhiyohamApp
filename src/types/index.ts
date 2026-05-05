export interface Parent {
  id: string;
  email: string;
  name: string;
  role: 'parent';
  createdAt: Date;
}

export interface Kid {
  id: string;
  parentId: string;
  name: string;
  age?: number;
  pin: string;
  points: number;
  level: number;
  streak: number;
  allowanceBalance: number;
  avatarUrl?: string;
  color?: string;
  role: 'kid';
  createdAt: Date;
}

export interface Chore {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  points: number;
  frequency: 'daily' | 'weekly' | 'one-time';
  assignedTo: string[];
  requirePhoto?: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  choreId: string;
  choreName?: string;
  kidId: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  dueDate: Date;
  completedAt?: Date;
  approvedAt?: Date;
  photoUrl?: string;
  pointsAwarded: number;
  requirePhoto?: boolean;
  bonusPoints?: number;
  approvalComment?: string;
  rejectionComment?: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  cost: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  kidId: string;
  key: string;
  unlockedAt?: Date;
}

export type UserRole = 'parent' | 'kid';
