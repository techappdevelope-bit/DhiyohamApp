export const APP_CONFIG = {
  name: 'ChoreQuest',
  version: '1.0.0',
  description: 'Kids Chore Chart & Allowance Tracker',
  
  // Points & Rewards
  defaultPointsPerLevel: 1000,
  defaultPointsToMoneyRate: 0.01, // 100 points = $1
  
  // Limits
  maxKidsPerFamily: 8,
  maxChoresPerParent: 50,
  maxRewardsPerParent: 30,
  
  // Features
  features: {
    photoProof: true,
    achievements: true,
    allowanceTracking: true,
    darkMode: true,
    notifications: true,
  },
  
  // Support
  supportEmail: 'support@chorequest.app',
  privacyPolicyUrl: 'https://chorequest.app/privacy',
  termsOfServiceUrl: 'https://chorequest.app/terms',
};

export const CHORE_CATEGORIES = [
  'morning-routine',
  'after-school',
  'evening-routine',
  'weekend',
  'extra-credit',
  'learning',
  'other',
] as const;

export const REWARD_CATEGORIES = [
  'screen-time',
  'treats',
  'activities',
  'toys',
  'privileges',
  'money',
] as const;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const FREQUENCY_OPTIONS = ['daily', 'weekly', 'one-time'] as const;
