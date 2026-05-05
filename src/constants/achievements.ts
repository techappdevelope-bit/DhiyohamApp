import { AchievementType } from '../types';

export interface AchievementDefinition {
  type: AchievementType;
  name: string;
  description: string;
  iconName: string;
  unlockCriteria: {
    type: 'task-count' | 'streak' | 'points' | 'money' | 'special';
    value?: number;
  };
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    type: 'first-task',
    name: 'Getting Started',
    description: 'Complete your first task',
    iconName: 'star',
    unlockCriteria: { type: 'task-count', value: 1 },
  },
  {
    type: 'streak',
    name: 'On Fire! 🔥',
    description: 'Complete tasks 7 days in a row',
    iconName: 'fire',
    unlockCriteria: { type: 'streak', value: 7 },
  },
  {
    type: 'streak',
    name: 'Unstoppable! 💪',
    description: 'Complete tasks 30 days in a row',
    iconName: 'fire-circle',
    unlockCriteria: { type: 'streak', value: 30 },
  },
  {
    type: 'milestone',
    name: 'Task Master',
    description: 'Complete 100 total tasks',
    iconName: 'checkbox-marked-circle',
    unlockCriteria: { type: 'task-count', value: 100 },
  },
  {
    type: 'milestone',
    name: 'Super Helper',
    description: 'Complete 500 total tasks',
    iconName: 'trophy',
    unlockCriteria: { type: 'task-count', value: 500 },
  },
  {
    type: 'perfect-week',
    name: 'Perfect Week',
    description: 'Complete all tasks for 7 days',
    iconName: 'calendar-check',
    unlockCriteria: { type: 'special' },
  },
  {
    type: 'task-master',
    name: 'All-Rounder',
    description: 'Complete at least one task in every category',
    iconName: 'format-list-checks',
    unlockCriteria: { type: 'special' },
  },
  {
    type: 'money-saver',
    name: 'Money Saver',
    description: 'Save $10 without spending',
    iconName: 'piggy-bank',
    unlockCriteria: { type: 'money', value: 10 },
  },
  {
    type: 'goal-achiever',
    name: 'Goal Achiever',
    description: 'Reach your first savings goal',
    iconName: 'target',
    unlockCriteria: { type: 'special' },
  },
  {
    type: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a task in under 5 minutes',
    iconName: 'speedometer',
    unlockCriteria: { type: 'special' },
  },
  {
    type: 'early-bird',
    name: 'Early Bird',
    description: 'Complete morning tasks before 8 AM for 7 days',
    iconName: 'weather-sunset-up',
    unlockCriteria: { type: 'special' },
  },
  {
    type: 'super-helper',
    name: 'Super Helper',
    description: 'Complete 10 bonus tasks in one week',
    iconName: 'account-star',
    unlockCriteria: { type: 'special' },
  },
];

export const checkAchievementUnlock = (
  type: AchievementType,
  userProgress: {
    totalTasks: number;
    currentStreak: number;
    totalMoney: number;
    completedCategories: string[];
  }
): boolean => {
  const achievement = ACHIEVEMENTS.find((a) => a.type === type);
  if (!achievement) return false;

  const { unlockCriteria } = achievement;

  switch (unlockCriteria.type) {
    case 'task-count':
      return userProgress.totalTasks >= (unlockCriteria.value || 0);
    case 'streak':
      return userProgress.currentStreak >= (unlockCriteria.value || 0);
    case 'money':
      return userProgress.totalMoney >= (unlockCriteria.value || 0);
    case 'special':
      return false; // Checked separately in specific logic
    default:
      return false;
  }
};
