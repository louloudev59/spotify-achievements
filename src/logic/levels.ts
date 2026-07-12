export function getXpForLevel(level: number): number {
  if (level >= 100) return 0;
  return Math.floor(100 * Math.pow(level, 1.25)) + 100;
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function getLevelAndProgress(totalXp: number): LevelInfo {
  let level = 1;
  let xpRemaining = totalXp;

  while (level < 100) {
    const needed = getXpForLevel(level);
    if (xpRemaining >= needed) {
      xpRemaining -= needed;
      level++;
    } else {
      break;
    }
  }

  const nextLevelXp = getXpForLevel(level);
  const progressPercent = nextLevelXp > 0 ? (xpRemaining / nextLevelXp) * 100 : 100;

  return {
    level,
    currentXp: xpRemaining,
    nextLevelXp,
    progressPercent,
  };
}
