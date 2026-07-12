import React, { useState } from "react";
import { ACHIEVEMENT_DEFS, AchievementDefinition, AchievementCategory, AchievementRarity } from "../logic/conditions";
import { AchievementsState } from "../logic/storage";
import { AchievementCard } from "./AchievementCard";

interface AchievementGridProps {
  achievements: AchievementsState["achievements"];
  showSecretAchievements: boolean;
}

function getCategoryIcon(catKey: AchievementCategory | "all") {
  const size = 14;
  const style = { marginRight: "6px" };
  switch (catKey) {
    case "all":
      return null;
    case "general":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case "time":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "diversity":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "albums":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "playlists":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );
    case "likes":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "genres":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "tod":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case "days":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "specific_genres":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, ...style }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return null;
  }
}

export function AchievementGrid({ achievements, showSecretAchievements }: AchievementGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "locked" | "secret">("all");
  const [rarityFilter, setRarityFilter] = useState<"all" | AchievementRarity>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | AchievementCategory>("all");
  const lang = (localStorage.getItem("spotify-achievements:language") as "fr" | "en") || "fr";
  const isEn = lang === "en";

  const categories: { key: "all" | AchievementCategory; label: string }[] = isEn ? [
    { key: "all", label: "All" },
    { key: "general", label: "General" },
    { key: "time", label: "Listening Time" },
    { key: "diversity", label: "Artists" },
    { key: "albums", label: "Albums" },
    { key: "playlists", label: "Playlists" },
    { key: "likes", label: "Likes" },
    { key: "genres", label: "Genres" },
    { key: "tod", label: "Night & Hours" },
    { key: "days", label: "Streaks & Days" },
    { key: "specific_genres", label: "Rare" },
  ] : [
    { key: "all", label: "Toutes" },
    { key: "general", label: "Général" },
    { key: "time", label: "Temps d'écoute" },
    { key: "diversity", label: "Artistes" },
    { key: "albums", label: "Albums" },
    { key: "playlists", label: "Playlists" },
    { key: "likes", label: "Likes" },
    { key: "genres", label: "Genres" },
    { key: "tod", label: "Nuit & Heures" },
    { key: "days", label: "Séries & Jours" },
    { key: "specific_genres", label: "Rares" },
  ];

  const rarities: { key: "all" | AchievementRarity; label: string }[] = isEn ? [
    { key: "all", label: "All rarities" },
    { key: "common", label: "Common" },
    { key: "uncommon", label: "Uncommon" },
    { key: "rare", label: "Rare" },
    { key: "epic", label: "Epic" },
    { key: "legendary", label: "Legendary" },
  ] : [
    { key: "all", label: "Toutes les raretés" },
    { key: "common", label: "Commun" },
    { key: "uncommon", label: "Peu commun" },
    { key: "rare", label: "Rare" },
    { key: "epic", label: "Épique" },
    { key: "legendary", label: "Légendaire" },
  ];

  const filteredAchievements = ACHIEVEMENT_DEFS.filter((def) => {
    const progress = achievements[def.id] || { progress: 0, unlocked: false };
    const isUnlocked = progress.unlocked;

    if (def.isSecret && !isUnlocked && !showSecretAchievements && statusFilter !== "secret") {
      return false;
    }

    if (statusFilter === "unlocked" && !isUnlocked) return false;
    if (statusFilter === "locked" && isUnlocked) return false;
    if (statusFilter === "secret" && !def.isSecret) return false;

    if (rarityFilter !== "all" && def.rarity !== rarityFilter) return false;

    if (categoryFilter !== "all" && def.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();

      if (q === "non débloqué" || q === "non debloque" || q === "locked") {
        return !isUnlocked;
      }
      if (q === "débloqué" || q === "debloque" || q === "unlocked") {
        return isUnlocked;
      }
      if (q === "secret") {
        return def.isSecret;
      }

      if (["commun", "common"].includes(q)) return def.rarity === "common";
      if (["peu commun", "uncommon"].includes(q)) return def.rarity === "uncommon";
      if (q === "rare") return def.rarity === "rare";
      if (["épique", "epique", "epic"].includes(q)) return def.rarity === "epic";
      if (["légendaire", "legendaire", "legendary"].includes(q)) return def.rarity === "legendary";

      const matchesName = def.name.toLowerCase().includes(q);
      const matchesDesc = def.description.toLowerCase().includes(q);
      const matchesCat = def.category.toLowerCase().includes(q);
      return matchesName || matchesDesc || matchesCat;
    }

    return true;
  });

  return (
    <div className="achievement-grid-section">
      {}
      <div className="grid-controls">
        <input
          type="text"
          className="search-input"
          placeholder={isEn ? "Search (e.g. album, artist, rare, locked...)" : "Rechercher (ex: album, artiste, rare, non débloqué...)"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="filter-selects">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">{isEn ? "All achievements" : "Tous les succès"}</option>
            <option value="unlocked">{isEn ? "Unlocked" : "Débloqués"}</option>
            <option value="locked">{isEn ? "Locked" : "Non débloqués"}</option>
            <option value="secret">{isEn ? "Secret" : "Secrets"}</option>
          </select>

          <select
            className="filter-select"
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as any)}
          >
            {rarities.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {}
      <div className="categories-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-badge-btn ${categoryFilter === cat.key ? "active" : ""}`}
            onClick={() => setCategoryFilter(cat.key)}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            {getCategoryIcon(cat.key)}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {}
      <div className="grid-count">
        {isEn
          ? `${filteredAchievements.length} matching achievement${filteredAchievements.length > 1 ? "s" : ""}`
          : `${filteredAchievements.length} succès correspondant${filteredAchievements.length > 1 ? "s" : ""}`}
      </div>

      <div className="achievements-cards-grid">
        {filteredAchievements.map((def) => (
          <AchievementCard
            key={def.id}
            definition={def}
            progress={achievements[def.id]}
            showSecretAchievements={showSecretAchievements}
          />
        ))}
      </div>
    </div>
  );
}
