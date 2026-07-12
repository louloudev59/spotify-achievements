import React from "react";
import { AchievementDefinition, AchievementRarity, getLocalizedAchievement } from "../logic/conditions";
import { AchievementProgress } from "../logic/storage";

interface AchievementCardProps {
  definition: AchievementDefinition;
  progress?: AchievementProgress;
  showSecretAchievements: boolean;
}

export function AchievementCard({
  definition: rawDefinition,
  progress,
  showSecretAchievements,
}: AchievementCardProps) {
  const lang = (localStorage.getItem("spotify-achievements:language") as "fr" | "en") || "fr";
  const definition = getLocalizedAchievement(rawDefinition, lang);

  const isUnlocked = progress?.unlocked || false;
  const currentProgress = progress?.progress || 0;
  const isSecret = definition.isSecret;

  const revealInfo = !isSecret || isUnlocked || showSecretAchievements;
  const displayName = revealInfo ? definition.name : "???";
  const displayDescription = revealInfo
    ? definition.description
    : definition.secretDescription || (lang === "en" ? "Secret achievement. Unlock it to reveal!" : "Description cachée. Débloquez-la pour en savoir plus !");

  const progressPercent = Math.min((currentProgress / definition.maxProgress) * 100, 100);

  const rarityLabels: { [key in AchievementRarity]: string } = lang === "en" ? {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  } : {
    common: "Commun",
    uncommon: "Peu commun",
    rare: "Rare",
    epic: "Épique",
    legendary: "Légendaire",
  };

  const renderIcon = () => {
    const colorMap: { [key in AchievementRarity]: string } = {
      common: "#718096",
      uncommon: "#48bb78",
      rare: "#4299e1",
      epic: "#9f7aea",
      legendary: "#ecc94b",
    };
    const color = colorMap[definition.rarity];

    if (!revealInfo) {

      return (
        <svg viewBox="0 0 24 24" className="badge-svg locked-secret">
          <circle cx="12" cy="12" r="10" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
          <path d="M12 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1-5.5a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2z" fill="#718096" />
          <circle cx="12" cy="7" r="1.5" fill="#718096" />
        </svg>
      );
    }

    if (!isUnlocked) {

      return (
        <svg viewBox="0 0 24 24" className="badge-svg locked">
          <circle cx="12" cy="12" r="10" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
          <path d="M12 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3-4V9a3 3 0 0 0-6 0v2H8v5h8v-5h-1zm-2 0h-2V9a1 1 0 1 1 2 0v2z" fill="#4a5568" />
        </svg>
      );
    }

    switch (definition.category) {
      case "general":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
          </svg>
        );
      case "time":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "diversity":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M12 2v20M2 12h20" stroke={color} strokeWidth="1" />
          </svg>
        );
      case "albums":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M7 9h10v6H7z" fill="none" stroke={color} strokeWidth="2" />
            <circle cx="12" cy="12" r="1.5" fill={color} />
          </svg>
        );
      case "playlists":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M7 8h10M7 12h10M7 16h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "likes":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M12 16.5s-4.5-2.7-4.5-5.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0c0 2.8-4.5 5.5-4.5 5.5z" fill={color} />
          </svg>
        );
      case "genres":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M6 15V9M10 17V7M14 15V9M18 13V11" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "days":
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M12 6.5s-4 4.5-4 6.5a4 4 0 0 0 8 0c0-2-4-6.5-4-6.5z" fill={color} />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="badge-svg unlocked">
            <circle cx="12" cy="12" r="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
            <path d="M12 7l1.8 3.7 4 .6-3 3 1 4-3.8-2-3.8 2 1-4-3-3 4-.6z" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div
      className={`achievement-card rarity-${definition.rarity} ${isUnlocked ? "unlocked" : "locked"} ${
        isSecret && !isUnlocked ? "secret" : ""
      }`}
    >
      <div className="card-badge-container">{renderIcon()}</div>

      <div className="card-main">
        <div className="card-header">
          <span className={`rarity-badge ${definition.rarity}`}>
            {rarityLabels[definition.rarity]}
          </span>
          {revealInfo && <span className="xp-value">{definition.xp} XP</span>}
        </div>

        <div className="card-title">{displayName}</div>
        <div className="card-description">{displayDescription}</div>

        {revealInfo && (
          <div className="card-progress-section">
            <div className="progress-text">
              <span>{lang === "en" ? "Progress" : "Progression"}</span>
              <span>
                {currentProgress} / {definition.maxProgress}
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${definition.rarity}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {isUnlocked && progress?.unlockDate && (
          <div className="unlock-date">
            {lang === "en" ? `Unlocked on ${progress.unlockDate}` : `Débloqué le ${progress.unlockDate}`}
          </div>
        )}
      </div>
    </div>
  );
}
