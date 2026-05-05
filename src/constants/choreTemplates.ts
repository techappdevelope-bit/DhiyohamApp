import { ChoreCategory, ChoreDifficulty } from '../types';

export interface ChoreTemplate {
  name: string;
  description: string;
  category: ChoreCategory;
  difficulty: ChoreDifficulty;
  suggestedPoints: number;
  iconName: string;
  ageRange: { min: number; max: number };
}

export const CHORE_TEMPLATES: ChoreTemplate[] = [
  // Morning Routine
  {
    name: 'Make Your Bed',
    description: 'Straighten sheets and pillows',
    category: 'morning-routine',
    difficulty: 'easy',
    suggestedPoints: 10,
    iconName: 'bed',
    ageRange: { min: 5, max: 18 },
  },
  {
    name: 'Brush Teeth',
    description: 'Brush teeth for 2 minutes',
    category: 'morning-routine',
    difficulty: 'easy',
    suggestedPoints: 5,
    iconName: 'tooth',
    ageRange: { min: 3, max: 18 },
  },
  {
    name: 'Get Dressed',
    description: 'Put on clean clothes',
    category: 'morning-routine',
    difficulty: 'easy',
    suggestedPoints: 5,
    iconName: 'tshirt-crew',
    ageRange: { min: 4, max: 10 },
  },
  {
    name: 'Eat Breakfast',
    description: 'Finish your healthy breakfast',
    category: 'morning-routine',
    difficulty: 'easy',
    suggestedPoints: 5,
    iconName: 'food-apple',
    ageRange: { min: 3, max: 18 },
  },
  
  // After School
  {
    name: 'Do Homework',
    description: 'Complete all homework assignments',
    category: 'after-school',
    difficulty: 'medium',
    suggestedPoints: 20,
    iconName: 'book-open-page-variant',
    ageRange: { min: 6, max: 18 },
  },
  {
    name: 'Practice Instrument',
    description: 'Practice for 30 minutes',
    category: 'learning',
    difficulty: 'medium',
    suggestedPoints: 25,
    iconName: 'music',
    ageRange: { min: 6, max: 18 },
  },
  {
    name: 'Read for 20 Minutes',
    description: 'Read a book or educational material',
    category: 'learning',
    difficulty: 'easy',
    suggestedPoints: 15,
    iconName: 'book',
    ageRange: { min: 5, max: 18 },
  },
  
  // Evening Routine
  {
    name: 'Set the Table',
    description: 'Put plates, utensils, and cups on table',
    category: 'evening-routine',
    difficulty: 'easy',
    suggestedPoints: 10,
    iconName: 'silverware-fork-knife',
    ageRange: { min: 5, max: 18 },
  },
  {
    name: 'Clear the Table',
    description: 'Remove dishes after dinner',
    category: 'evening-routine',
    difficulty: 'easy',
    suggestedPoints: 10,
    iconName: 'cup',
    ageRange: { min: 5, max: 18 },
  },
  {
    name: 'Wash Dishes',
    description: 'Wash and dry dishes',
    category: 'evening-routine',
    difficulty: 'medium',
    suggestedPoints: 20,
    iconName: 'dishwasher',
    ageRange: { min: 8, max: 18 },
  },
  {
    name: 'Pack School Bag',
    description: 'Prepare bag for next day',
    category: 'evening-routine',
    difficulty: 'easy',
    suggestedPoints: 10,
    iconName: 'bag-personal',
    ageRange: { min: 6, max: 18 },
  },
  
  // Weekend Tasks
  {
    name: 'Clean Your Room',
    description: 'Organize and tidy up bedroom',
    category: 'weekend',
    difficulty: 'medium',
    suggestedPoints: 30,
    iconName: 'broom',
    ageRange: { min: 6, max: 18 },
  },
  {
    name: 'Vacuum',
    description: 'Vacuum floors in common areas',
    category: 'weekend',
    difficulty: 'medium',
    suggestedPoints: 25,
    iconName: 'vacuum',
    ageRange: { min: 10, max: 18 },
  },
  {
    name: 'Take Out Trash',
    description: 'Empty trash bins and take to curb',
    category: 'weekend',
    difficulty: 'easy',
    suggestedPoints: 15,
    iconName: 'delete',
    ageRange: { min: 8, max: 18 },
  },
  {
    name: 'Water Plants',
    description: 'Water indoor and outdoor plants',
    category: 'weekend',
    difficulty: 'easy',
    suggestedPoints: 10,
    iconName: 'watering-can',
    ageRange: { min: 5, max: 18 },
  },
  
  // Extra Credit
  {
    name: 'Help with Groceries',
    description: 'Carry and put away groceries',
    category: 'extra-credit',
    difficulty: 'medium',
    suggestedPoints: 20,
    iconName: 'cart',
    ageRange: { min: 8, max: 18 },
  },
  {
    name: 'Walk the Dog',
    description: 'Take dog for a walk',
    category: 'extra-credit',
    difficulty: 'easy',
    suggestedPoints: 15,
    iconName: 'dog',
    ageRange: { min: 8, max: 18 },
  },
  {
    name: 'Feed Pet',
    description: 'Give food and water to pet',
    category: 'extra-credit',
    difficulty: 'easy',
    suggestedPoints: 10,
    iconName: 'paw',
    ageRange: { min: 5, max: 18 },
  },
  {
    name: 'Fold Laundry',
    description: 'Fold and organize clean clothes',
    category: 'extra-credit',
    difficulty: 'medium',
    suggestedPoints: 20,
    iconName: 'hanger',
    ageRange: { min: 8, max: 18 },
  },
  {
    name: 'Organize Toys',
    description: 'Put toys in their proper places',
    category: 'extra-credit',
    difficulty: 'easy',
    suggestedPoints: 15,
    iconName: 'toy-brick',
    ageRange: { min: 4, max: 12 },
  },
  {
    name: 'Help Sibling',
    description: 'Help younger sibling with task',
    category: 'extra-credit',
    difficulty: 'medium',
    suggestedPoints: 25,
    iconName: 'account-multiple',
    ageRange: { min: 8, max: 18 },
  },
];

export const getCategorizedChores = () => {
  const categorized: Record<ChoreCategory, ChoreTemplate[]> = {
    'morning-routine': [],
    'after-school': [],
    'evening-routine': [],
    'weekend': [],
    'extra-credit': [],
    'learning': [],
    'other': [],
  };

  CHORE_TEMPLATES.forEach((chore) => {
    categorized[chore.category].push(chore);
  });

  return categorized;
};

export const getChoresForAge = (age: number): ChoreTemplate[] => {
  return CHORE_TEMPLATES.filter(
    (chore) => age >= chore.ageRange.min && age <= chore.ageRange.max
  );
};
