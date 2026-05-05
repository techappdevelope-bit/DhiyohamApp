import { RewardCategory } from '../types';

export interface RewardTemplate {
  name: string;
  description: string;
  category: RewardCategory;
  suggestedCost: number;
  iconName: string;
}

export const REWARD_TEMPLATES: RewardTemplate[] = [
  // Screen Time
  {
    name: '30 Minutes TV Time',
    description: 'Extra 30 minutes of TV or streaming',
    category: 'screen-time',
    suggestedCost: 50,
    iconName: 'television',
  },
  {
    name: '1 Hour Video Games',
    description: 'Play video games for an hour',
    category: 'screen-time',
    suggestedCost: 100,
    iconName: 'gamepad-variant',
  },
  {
    name: 'Movie Night',
    description: 'Watch a movie of your choice',
    category: 'screen-time',
    suggestedCost: 150,
    iconName: 'movie',
  },
  
  // Treats
  {
    name: 'Ice Cream',
    description: 'Get ice cream from the store',
    category: 'treats',
    suggestedCost: 75,
    iconName: 'ice-cream',
  },
  {
    name: 'Candy Bar',
    description: 'Choose a candy from the store',
    category: 'treats',
    suggestedCost: 40,
    iconName: 'candy',
  },
  {
    name: 'Pizza Night',
    description: 'Order pizza for dinner',
    category: 'treats',
    suggestedCost: 200,
    iconName: 'pizza',
  },
  
  // Activities
  {
    name: 'Park Visit',
    description: 'Trip to the park or playground',
    category: 'activities',
    suggestedCost: 100,
    iconName: 'park',
  },
  {
    name: 'Movie Theater',
    description: 'See a movie in theaters',
    category: 'activities',
    suggestedCost: 300,
    iconName: 'theater',
  },
  {
    name: 'Sleepover',
    description: 'Have a friend sleep over',
    category: 'activities',
    suggestedCost: 250,
    iconName: 'account-group',
  },
  
  // Toys & Items
  {
    name: 'Small Toy',
    description: 'Choose a small toy ($5-10)',
    category: 'toys',
    suggestedCost: 500,
    iconName: 'toy-brick',
  },
  {
    name: 'Book',
    description: 'Get a new book of your choice',
    category: 'toys',
    suggestedCost: 400,
    iconName: 'book',
  },
  {
    name: 'Art Supplies',
    description: 'New drawing or craft materials',
    category: 'toys',
    suggestedCost: 300,
    iconName: 'palette',
  },
  
  // Privileges
  {
    name: 'Stay Up Late',
    description: 'Stay up 30 minutes past bedtime',
    category: 'privileges',
    suggestedCost: 80,
    iconName: 'sleep-off',
  },
  {
    name: 'Pick Dinner',
    description: 'Choose what we eat for dinner',
    category: 'privileges',
    suggestedCost: 60,
    iconName: 'food',
  },
  {
    name: 'Skip One Chore',
    description: 'Skip one chore for the day',
    category: 'privileges',
    suggestedCost: 120,
    iconName: 'skip-next',
  },
  
  // Money
  {
    name: '$1 Cash',
    description: 'Receive $1 in real money',
    category: 'money',
    suggestedCost: 100,
    iconName: 'currency-usd',
  },
  {
    name: '$5 Cash',
    description: 'Receive $5 in real money',
    category: 'money',
    suggestedCost: 500,
    iconName: 'cash',
  },
  {
    name: '$10 Cash',
    description: 'Receive $10 in real money',
    category: 'money',
    suggestedCost: 1000,
    iconName: 'cash-100',
  },
];

export const getCategorizedRewards = () => {
  const categorized: Record<RewardCategory, RewardTemplate[]> = {
    'screen-time': [],
    'treats': [],
    'activities': [],
    'toys': [],
    'privileges': [],
    'money': [],
  };

  REWARD_TEMPLATES.forEach((reward) => {
    categorized[reward.category].push(reward);
  });

  return categorized;
};
