import FirestoreService from './firebase/firestore';
import { generateAllTasks } from '../utils/taskGenerator';
import { updateKidStreak } from '../utils/streakCalculator';

class BackgroundTaskService {
  private dailyTaskInterval: NodeJS.Timeout | null = null;

  /**
   * Generate daily tasks for all chores
   */
  async generateDailyTasks(parentId: string): Promise<void> {
    try {
      console.log('🔄 Generating daily tasks for parent:', parentId);
      await generateAllTasks(parentId);
      console.log('✅ Daily tasks generated successfully');
    } catch (error) {
      console.error('❌ Error generating daily tasks:', error);
    }
  }

  /**
   * Update streaks for all kids
   */
  async updateAllStreaks(parentId: string): Promise<void> {
    try {
      console.log('🔄 Updating streaks for parent:', parentId);
      const kids = await FirestoreService.getKidsByParent(parentId);
      
      for (const kid of kids) {
        await updateKidStreak(kid.id);
      }
      
      console.log('✅ Streaks updated successfully');
    } catch (error) {
      console.error('❌ Error updating streaks:', error);
    }
  }

  /**
   * Start daily task generation (runs at midnight)
   */
  startDailyTaskGeneration(parentId: string): void {
    if (this.dailyTaskInterval) {
      clearInterval(this.dailyTaskInterval);
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.generateDailyTasks(parentId);
      this.updateAllStreaks(parentId);
      
      this.dailyTaskInterval = setInterval(() => {
        this.generateDailyTasks(parentId);
        this.updateAllStreaks(parentId);
      }, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    console.log('⏰ Daily task generation scheduled');
  }

  /**
   * Stop daily task generation
   */
  stopDailyTaskGeneration(): void {
    if (this.dailyTaskInterval) {
      clearInterval(this.dailyTaskInterval);
      this.dailyTaskInterval = null;
      console.log('⏸️ Daily task generation stopped');
    }
  }

  /**
   * Check and unlock achievements for a kid
   */
  async checkAchievements(kidId: string): Promise<void> {
    try {
      console.log('Checking achievements for kid:', kidId);
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }
}

export default new BackgroundTaskService();
