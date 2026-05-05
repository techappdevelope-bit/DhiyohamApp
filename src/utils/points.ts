// Calculate points needed for next level
export const getPointsForNextLevel = (currentLevel: number): number => {
  return currentLevel * 1000; // 1000 points per level
};

// Calculate level from total points
export const getLevelFromPoints = (totalPoints: number): number => {
  return Math.floor(totalPoints / 1000) + 1;
};

// Check if kid should level up
export const shouldLevelUp = (currentPoints: number, currentLevel: number): boolean => {
  const pointsNeeded = getPointsForNextLevel(currentLevel);
  return currentPoints >= pointsNeeded;
};

// Get level progress percentage
export const getLevelProgress = (currentPoints: number, currentLevel: number): number => {
  const pointsNeeded = getPointsForNextLevel(currentLevel);
  const progress = (currentPoints / pointsNeeded) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Convert points to money
export const pointsToMoney = (points: number, rate: number = 0.01): number => {
  return points * rate; // Default: 100 points = $1
};

// Convert money to points
export const moneyToPoints = (money: number, rate: number = 0.01): number => {
  return Math.floor(money / rate);
};
