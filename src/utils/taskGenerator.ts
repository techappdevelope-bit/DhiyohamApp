import FirestoreService from '../services/firebase/firestore';
import { Chore } from '../types';

/**
 * Check if task should be created today based on chore frequency
 */
export const shouldCreateTaskToday = (chore: Chore): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  switch (chore.frequency) {
    case 'daily':
      return true;
    
    case 'weekly':
      if (chore.schedule?.daysOfWeek) {
        return chore.schedule.daysOfWeek.includes(dayOfWeek);
      }
      return false;
    
    case 'one-time':
      return false;
    
    default:
      return false;
  }
};

/**
 * Generate task data from chore
 */
export const generateTaskFromChore = (chore: Chore, kidId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    choreId: chore.id,
    kidId,
    status: 'pending',
    dueDate: today,
    pointsAwarded: chore.points,
    createdAt: new Date(),
  };
};

/**
 * Generate tasks for a specific chore
 */
export const generateTasksForChore = async (chore: Chore): Promise<void> => {
  if (!shouldCreateTaskToday(chore)) return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const kidId of chore.assignedTo) {
    try {
      // Check if task already exists for today
      const existingTasks = await FirestoreService.getTasksByKid(kidId);
      
      const taskExists = existingTasks.some((task) => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return task.choreId === chore.id && taskDate.getTime() === today.getTime();
      });
      
      if (!taskExists) {
        const taskData = generateTaskFromChore(chore, kidId);
        await FirestoreService.createTask(taskData);
        console.log(`✅ Task created for chore ${chore.name}, kid ${kidId}`);
      }
    } catch (error) {
      console.error(`❌ Error creating task for chore ${chore.id}, kid ${kidId}:`, error);
    }
  }
};

/**
 * Generate all tasks for a parent's chores
 */
export const generateAllTasks = async (parentId: string): Promise<void> => {
  try {
    const chores = await FirestoreService.getChoresByParent(parentId);
    
    for (const chore of chores) {
      await generateTasksForChore(chore);
    }
    
    console.log('✅ All tasks generated successfully');
  } catch (error) {
    console.error('❌ Error generating tasks:', error);
  }
};
