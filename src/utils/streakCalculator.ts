import FirestoreService from '../services/firebase/firestore';

/**
 * Calculate consecutive days streak
 */
export const calculateStreak = async (kidId: string): Promise<number> => {
  try {
    const tasks = await FirestoreService.getTasksByKid(kidId, 'approved');
    
    if (tasks.length === 0) return 0;
    
    // Sort by approval date (newest first)
    const sortedTasks = tasks.sort((a, b) => {
      const dateA = a.approvedAt ? new Date(a.approvedAt).getTime() : 0;
      const dateB = b.approvedAt ? new Date(b.approvedAt).getTime() : 0;
      return dateB - dateA;
    });
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check last 365 days
    for (let i = 0; i < 365; i++) {
      const hasTaskOnDate = sortedTasks.some((task) => {
        if (!task.approvedAt) return false;
        const taskDate = new Date(task.approvedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === currentDate.getTime();
      });
      
      if (hasTaskOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};

/**
 * Update kid's streak in database
 */
export const updateKidStreak = async (kidId: string): Promise<void> => {
  try {
    const streak = await calculateStreak(kidId);
    await FirestoreService.updateKid(kidId, { streak });
    console.log(`✅ Streak updated for kid ${kidId}: ${streak} days`);
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

/**
 * Check if kid completed tasks today
 */
export const completedTasksToday = async (kidId: string): Promise<boolean> => {
  try {
    const tasks = await FirestoreService.getTasksByKid(kidId, 'approved');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.some((task) => {
      if (!task.approvedAt) return false;
      const taskDate = new Date(task.approvedAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  } catch (error) {
    console.error('Error checking tasks today:', error);
    return false;
  }
};
