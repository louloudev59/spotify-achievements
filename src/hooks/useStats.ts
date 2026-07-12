import { useState, useEffect } from "react";
import { AchievementsState, loadState, saveState, getInitialState } from "../logic/storage";
import { getLevelAndProgress, LevelInfo } from "../logic/levels";

export interface UseStatsReturn {
  state: AchievementsState;
  levelInfo: LevelInfo;
  resetAll: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  updateSettings: (settings: Partial<AchievementsState["settings"]>) => void;
}

export function useStats(): UseStatsReturn {
  const [state, setState] = useState<AchievementsState>(loadState);

  useEffect(() => {
    const handleUpdate = () => {
      setState(loadState());
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "spotify-achievements:state") {
        setState(loadState());
      }
    };

    window.addEventListener("spotify-achievements-update", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("spotify-achievements-update", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const levelInfo = getLevelAndProgress(state.xp);

  const resetAll = () => {
    const initial = getInitialState();
    saveState(initial);
    window.dispatchEvent(new CustomEvent("spotify-achievements-update"));
  };

  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== "object" || parsed === null) return false;

      if (typeof parsed.xp !== "number" || typeof parsed.level !== "number") {
        return false;
      }

      saveState(parsed as AchievementsState);
      window.dispatchEvent(new CustomEvent("spotify-achievements-update"));
      return true;
    } catch (e) {
      console.error("Failed to import data:", e);
      return false;
    }
  };

  const updateSettings = (newSettings: Partial<AchievementsState["settings"]>) => {
    const currentState = loadState();
    currentState.settings = {
      ...currentState.settings,
      ...newSettings,
    };
    saveState(currentState);
    window.dispatchEvent(new CustomEvent("spotify-achievements-update"));
  };

  return {
    state,
    levelInfo,
    resetAll,
    exportData,
    importData,
    updateSettings,
  };
}
