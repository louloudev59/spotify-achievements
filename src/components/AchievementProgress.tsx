import React from "react";
import { ACHIEVEMENT_DEFS, AchievementDefinition, getLocalizedAchievement } from "../logic/conditions";
import { AchievementsState } from "../logic/storage";

interface AchievementProgressProps {
  stats: AchievementsState["stats"];
  achievements: AchievementsState["achievements"];
}

export function AchievementProgress({ stats, achievements }: AchievementProgressProps) {
  const lang = (localStorage.getItem("spotify-achievements:language") as "fr" | "en") || "fr";

  let closestDef: AchievementDefinition | null = null;
  let closestProgress = 0;
  let highestPercent = -1;

  ACHIEVEMENT_DEFS.forEach((def) => {
    if (def.isSecret) return;
    const p = achievements[def.id] || { progress: 0, unlocked: false };
    if (p.unlocked) return;

    const percent = def.maxProgress > 0 ? (p.progress / def.maxProgress) * 100 : 0;
    if (percent > highestPercent && percent < 100) {
      highestPercent = percent;
      closestDef = def;
      closestProgress = p.progress;
    }
  });

  if (!closestDef) {
    return (
      <div className="closest-achievement-card empty">
        <div className="closest-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px", display: "block" }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="closest-content">
          <div className="closest-title">
            {lang === "en" ? "All achievements unlocked!" : "Tous les succès sont débloqués !"}
          </div>
          <div className="closest-desc">
            {lang === "en" ? "You have reached the summit. Keep listening for fun!" : "Vous avez atteint le sommet. Continuez à écouter pour le plaisir !"}
          </div>
        </div>
      </div>
    );
  }

  const def = getLocalizedAchievement(closestDef as AchievementDefinition, lang);
  const remaining = def.maxProgress - closestProgress;

  const getRemainingMessage = () => {
    const isEn = lang === "en";
    switch (def.category) {
      case "general":
        return isEn
          ? `${remaining} more song${remaining > 1 ? "s" : ""} until`
          : `Encore ${remaining} chanson${remaining > 1 ? "s" : ""} avant`;
      case "time":
        return isEn
          ? `${remaining} more hour${remaining > 1 ? "s" : ""} of listening until`
          : `Encore ${remaining} heure${remaining > 1 ? "s" : ""} d'écoute avant`;
      case "diversity":
        return isEn
          ? `${remaining} more artist${remaining > 1 ? "s" : ""} to discover until`
          : `Encore ${remaining} artiste${remaining > 1 ? "s" : ""} à découvrir avant`;
      case "albums":
        return isEn
          ? `${remaining} more album${remaining > 1 ? "s" : ""} to complete until`
          : `Encore ${remaining} album${remaining > 1 ? "s" : ""} à terminer avant`;
      case "playlists":
        return isEn
          ? `${remaining} more playlist${remaining > 1 ? "s" : ""} to create until`
          : `Encore ${remaining} playlist${remaining > 1 ? "s" : ""} à créer avant`;
      case "likes":
        return isEn
          ? `${remaining} more song${remaining > 1 ? "s" : ""} to like until`
          : `Encore ${remaining} chanson${remaining > 1 ? "s" : ""} à liker avant`;
      case "genres":
        return isEn
          ? `${remaining} more genre${remaining > 1 ? "s" : ""} to discover until`
          : `Encore ${remaining} genre${remaining > 1 ? "s" : ""} à découvrir avant`;
      case "new":
        return isEn
          ? `${remaining} more new song${remaining > 1 ? "s" : ""} until`
          : `Encore ${remaining} nouvelle${remaining > 1 ? "s" : ""} chanson${remaining > 1 ? "s" : ""} avant`;
      case "old":
        return isEn
          ? `${remaining} more classic song${remaining > 1 ? "s" : ""} (< 1990) until`
          : `Encore ${remaining} chanson${remaining > 1 ? "s" : ""} classique (< 1990) avant`;
      case "long":
        return isEn
          ? `${remaining} more long track${remaining > 1 ? "s" : ""} (> 8 min) until`
          : `Encore ${remaining} morceau${remaining > 1 ? "s" : ""} de plus de 8 minutes avant`;
      case "short":
        return isEn
          ? `${remaining} more short track${remaining > 1 ? "s" : ""} (< 2 min) until`
          : `Encore ${remaining} court${remaining > 1 ? "s" : ""} morceau${remaining > 1 ? "s" : ""} (< 2 min) avant`;
      case "marathon":
        return isEn
          ? `${remaining} more hour${remaining > 1 ? "s" : ""} of continuous listening until`
          : `Encore ${remaining} heure${remaining > 1 ? "s" : ""} d'écoute continue avant`;
      case "days":
        return isEn
          ? `${remaining} more day${remaining > 1 ? "s" : ""} of listening until`
          : `Encore ${remaining} jour${remaining > 1 ? "s" : ""} d'écoute avant`;
      case "specific_genres":
        return isEn
          ? `${remaining} more track${remaining > 1 ? "s" : ""} of the correct genre until`
          : `Encore ${remaining} morceau${remaining > 1 ? "s" : ""} du bon genre avant`;
      default:
        return isEn
          ? `${remaining} more step${remaining > 1 ? "s" : ""} until`
          : `Encore ${remaining} étape${remaining > 1 ? "s" : ""} avant`;
    }
  };

  return (
    <div className="closest-achievement-card">
      <div className="closest-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px", display: "block" }}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      </div>
      <div className="closest-content">
        <div className="closest-label">
          {lang === "en" ? "Closest Achievement" : "Succès le plus proche"}
        </div>
        <div className="closest-hint">
          {getRemainingMessage()} <strong>"{def.name}"</strong>
        </div>
        <div className="closest-progress-bar-container">
          <div
            className="closest-progress-bar-fill"
            style={{ width: `${highestPercent}%` }}
          />
          <span className="closest-progress-percent">{Math.round(highestPercent)}%</span>
        </div>
      </div>
    </div>
  );
}
