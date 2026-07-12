import React, { useState, useEffect } from "react";
import { useStats } from "../hooks/useStats";
import { fetchUserProfile, SpotifyProfile } from "../logic/spotify";
import { ACHIEVEMENT_DEFS } from "../logic/conditions";
import { AchievementProgress } from "./AchievementProgress";
import { AchievementGrid } from "./AchievementGrid";
import { syncUserLibraryStats } from "../logic/achievementEngine";

type Language = "fr" | "en";

function TrophyIcon({ size = 16, style = {}, className = "" }: { size?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      fill="currentColor"
      className={className}
      style={{ width: `${size}px`, height: `${size}px`, display: "block", ...style }}
    >
      <path d="M208.3 64L432.3 64C458.8 64 480.4 85.8 479.4 112.2C479.2 117.5 479 122.8 478.7 128L528.3 128C554.4 128 577.4 149.6 575.4 177.8C567.9 281.5 514.9 338.5 457.4 368.3C441.6 376.5 425.5 382.6 410.2 387.1C390 415.7 369 430.8 352.3 438.9L352.3 512L416.3 512C434 512 448.3 526.3 448.3 544C448.3 561.7 434 576 416.3 576L224.3 576C206.6 576 192.3 561.7 192.3 544C192.3 526.3 206.6 512 224.3 512L288.3 512L288.3 438.9C272.3 431.2 252.4 416.9 233 390.6C214.6 385.8 194.6 378.5 175.1 367.5C121 337.2 72.2 280.1 65.2 177.6C63.3 149.5 86.2 127.9 112.3 127.9L161.9 127.9C161.6 122.7 161.4 117.5 161.2 112.1C160.2 85.6 181.8 63.9 208.3 63.9zM165.5 176L113.1 176C119.3 260.7 158.2 303.1 198.3 325.6C183.9 288.3 172 239.6 165.5 176zM444 320.8C484.5 297 521.1 254.7 527.3 176L475 176C468.8 236.9 457.6 284.2 444 320.8z"/>
    </svg>
  );
}

const TRANSLATIONS = {
  fr: {
    welcome: "Bienvenue sur Spotify Achievements",
    chooseLanguage: "Choisissez votre langue préférée pour commencer :",
    achievements: "Succès",
    statistics: "Statistiques",
    settings: "Paramètres",
    listeningStatsTitle: "Vos statistiques d'écoute",
    extOptions: "Options de l'extension",
    notificationsTitle: "Notifications de succès",
    notificationsDesc: "Afficher une popup animée lors d'un déblocage",
    soundTitle: "Effets sonores",
    soundDesc: "Jouer un carillon audio rétro lors d'un déblocage",
    secretTitle: "Révéler les succès secrets",
    secretDesc: "Afficher les descriptions des succès secrets avant de les débloquer",
    languageTitle: "Langue / Language",
    languageDesc: "Choisir la langue d'affichage de l'application",
    dataManagement: "Gestion des données",
    exportBtn: "Exporter les succès (Copier JSON)",
    exportAlert: "Données exportées et copiées dans le presse-papiers !",
    forceSyncBtn: "Forcer la synchronisation",
    forceSyncAlert: "Synchronisation forcée effectuée ! Les statistiques et votre profil ont été mis à jour.",
    importPlaceholder: "Collez ici votre JSON d'exportation pour restaurer vos succès...",
    importBtn: "Importer les données",
    importSuccess: "Importation réussie !",
    importError: "Erreur lors de l'importation. Format JSON invalide.",
    dangerZone: "Zone de danger",
    resetBtn: "Réinitialiser toutes les données",
    confirmResetTxt: "Êtes-vous sûr de vouloir réinitialiser TOUS vos succès, niveaux et statistiques ? Cette action est irréversible.",
    confirmResetYes: "Oui, tout effacer",
    confirmResetNo: "Annuler",
    totalListeningTime: "Temps d'écoute total",
    songsListened: "Chansons écoutées",
    uniqueArtists: "Artistes différents",
    completedAlbums: "Albums terminés",
    playlistsCreated: "Playlists créées",
    likedSongs: "Titres aimés",
    genresDiscovered: "Genres découverts",
    currentStreak: "Série actuelle",
    activeDays: "Jours actifs",
    daysUnit: "jours",
    techDiag: "Diagnostics techniques",
    level: "Niveau",
    unlockedAchievements: "Succès débloqués",
    totalXp: "XP Total",
    diagAvailable: "Disponible",
    diagUnavailable: "Indisponible",
    diagGenerated: "Généré",
    diagErrorLogs: "LOGS D'ERREURS RECENTS",
    diagPlatformInspection: "PLATFORM INSPECTION",
  },
  en: {
    welcome: "Welcome to Spotify Achievements",
    chooseLanguage: "Choose your preferred language to begin:",
    achievements: "Achievements",
    statistics: "Statistics",
    settings: "Settings",
    listeningStatsTitle: "Your listening statistics",
    extOptions: "Extension options",
    notificationsTitle: "Achievement notifications",
    notificationsDesc: "Show an animated popup alert on unlocks",
    soundTitle: "Sound effects",
    soundDesc: "Play a retro audio chime on unlocks",
    secretTitle: "Reveal secret achievements",
    secretDesc: "Show secret achievement requirements before unlocking",
    languageTitle: "Language / Langue",
    languageDesc: "Select application display language",
    dataManagement: "Data management",
    exportBtn: "Export achievements (Copy JSON)",
    exportAlert: "Data successfully exported and copied to clipboard!",
    forceSyncBtn: "Force synchronization",
    forceSyncAlert: "Force synchronization completed! Statistics and profile updated.",
    importPlaceholder: "Paste your exported JSON here to restore your achievements...",
    importBtn: "Import data",
    importSuccess: "Import completed successfully!",
    importError: "Error importing. Invalid JSON format.",
    dangerZone: "Danger zone",
    resetBtn: "Reset all data",
    confirmResetTxt: "Are you sure you want to reset ALL achievements, levels, and statistics? This action is irreversible.",
    confirmResetYes: "Yes, delete everything",
    confirmResetNo: "Cancel",
    totalListeningTime: "Total listening time",
    songsListened: "Songs listened to",
    uniqueArtists: "Unique artists",
    completedAlbums: "Completed albums",
    playlistsCreated: "Playlists created",
    likedSongs: "Liked songs",
    genresDiscovered: "Genres discovered",
    currentStreak: "Current streak",
    activeDays: "Active days",
    daysUnit: "days",
    techDiag: "Technical diagnostics",
    level: "Level",
    unlockedAchievements: "Unlocked achievements",
    totalXp: "Total XP",
    diagAvailable: "Available",
    diagUnavailable: "Unavailable",
    diagGenerated: "Generated",
    diagErrorLogs: "RECENT ERROR LOGS",
    diagPlatformInspection: "PLATFORM INSPECTION",
  }
};

export function SidebarPage() {
  const { state, levelInfo, resetAll, exportData, importData, updateSettings } = useStats();
  const [activeTab, setActiveTab] = useState<"dashboard" | "stats" | "settings">("dashboard");
  const [profile, setProfile] = useState<SpotifyProfile>({ displayName: "Spotify User" });
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<"none" | "success" | "error">("none");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [language, setLanguageState] = useState<Language | null>(() => {
    return (localStorage.getItem("spotify-achievements:language") as Language) || null;
  });

  useEffect(() => {
    fetchUserProfile().then((p) => {
      if (p) setProfile(p);
    });
    syncUserLibraryStats();
  }, []);

  const selectLanguage = (lang: Language) => {
    localStorage.setItem("spotify-achievements:language", lang);
    setLanguageState(lang);
  };

  const totalAchievements = ACHIEVEMENT_DEFS.length;
  const unlockedCount = state.unlocked.length;
  const unlockPercent = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

  if (!language) {
    return (
      <div className="achievements-page-container" style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "75vh",
        padding: "40px",
        textAlign: "center"
      }}>
        <div style={{
          background: "rgba(24, 24, 24, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "480px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{ marginBottom: "24px" }}>
            <TrophyIcon size={80} style={{ color: "#ecc94b", filter: "drop-shadow(0 4px 12px rgba(236,201,75,0.25))" }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#fff", marginBottom: "12px", letterSpacing: "-0.5px" }}>
            Spotify Achievements
          </h1>
          <p style={{ fontSize: "14px", color: "#a1a1aa", marginBottom: "30px", lineHeight: "1.6" }}>
            Welcome! Choose your preferred language / Bienvenue ! Choisissez votre langue préférée :
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={() => selectLanguage("fr")}
              style={{
                background: "#1db954",
                color: "#fff",
                border: "none",
                borderRadius: "24px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: "800",
                cursor: "pointer",
                transition: "transform 0.2s, background-color 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.backgroundColor = "#1ed760"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "#1db954"; }}
            >
              Français
            </button>
            <button
              onClick={() => selectLanguage("en")}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: "800",
                cursor: "pointer",
                transition: "transform 0.2s, background-color 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            >
              English
            </button>
          </div>
        </div>
      </div>
    );
  }

  const t = TRANSLATIONS[language];

  const formatListeningTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importData(importText);
    if (ok) {
      setImportStatus("success");
      setImportText("");
      setTimeout(() => setImportStatus("none"), 3000);
    } else {
      setImportStatus("error");
      setTimeout(() => setImportStatus("none"), 3000);
    }
  };

  const handleReset = () => {
    resetAll();
    setShowConfirmReset(false);
  };

  return (
    <div className="achievements-page-container">
      {}
      <div className="profile-header-card">
        <div className="profile-avatar-container">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              <TrophyIcon size={32} />
            </div>
          )}
        </div>

        <div className="profile-info-container">
          <div className="profile-name">{profile.displayName}</div>
          <div className="level-badge">{t.level} {levelInfo.level}</div>

          <div className="xp-progress-container">
            <div className="xp-label">
              <span>{levelInfo.currentXp} / {levelInfo.nextLevelXp} XP</span>
              <span>{Math.round(levelInfo.progressPercent)}%</span>
            </div>
            <div className="xp-progress-bar-bg">
              <div
                className="xp-progress-bar-fill"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="global-stats-summary">
          <div className="summary-stat-box">
            <div className="stat-value">{unlockedCount} / {totalAchievements}</div>
            <div className="stat-label">{t.unlockedAchievements}</div>
            <div className="stat-percentage-bar">
              <div className="stat-percentage-fill" style={{ width: `${unlockPercent}%` }} />
            </div>
          </div>
          <div className="summary-stat-box">
            <div className="stat-value">{state.stats.totalXp}</div>
            <div className="stat-label">{t.totalXp}</div>
          </div>
        </div>
      </div>

      {}
      <div className="tabs-navigation-menu">
        <button
          className={`tab-menu-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <TrophyIcon size={16} />
          {t.achievements}
        </button>

        <button
          className={`tab-menu-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          {t.statistics}
        </button>

        <button
          className={`tab-menu-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          {t.settings}
        </button>
      </div>

      {}
      <div className="tab-contents-area">
        {activeTab === "dashboard" && (
          <div className="dashboard-tab-view">
            <AchievementProgress stats={state.stats} achievements={state.achievements} />
            <AchievementGrid
              achievements={state.achievements}
              showSecretAchievements={state.settings.showSecretAchievements}
            />
          </div>
        )}

        {activeTab === "stats" && (
          <div className="stats-tab-view">
            <h2 className="section-title">{t.listeningStatsTitle}</h2>
            <div className="stats-grid">
              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4299e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{formatListeningTime(state.stats.totalListeningTimeMs)}</div>
                  <div className="stat-card-lbl">{t.totalListeningTime}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.totalSongsPlayed}</div>
                  <div className="stat-card-lbl">{t.songsListened}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9f7aea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.uniqueArtists.length}</div>
                  <div className="stat-card-lbl">{t.uniqueArtists}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ecc94b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.uniqueAlbums.length}</div>
                  <div className="stat-card-lbl">{t.completedAlbums}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.playlistsCreated}</div>
                  <div className="stat-card-lbl">{t.playlistsCreated}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.playlistsAdded}</div>
                  <div className="stat-card-lbl">{t.likedSongs}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.uniqueGenres.length}</div>
                  <div className="stat-card-lbl">{t.genresDiscovered}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.streakDays} {t.daysUnit}</div>
                  <div className="stat-card-lbl">{t.currentStreak}</div>
                </div>
              </div>

              <div className="stat-card-item">
                <div className="stat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="stat-card-details">
                  <div className="stat-card-val">{state.stats.uniqueTracks.length} {t.daysUnit}</div>
                  <div className="stat-card-lbl">{t.activeDays}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-tab-view">
            <h2 className="section-title">{t.extOptions}</h2>

            <div className="settings-options-list">
              <div className="setting-toggle-row">
                <div className="setting-info">
                  <div className="setting-name">{t.notificationsTitle}</div>
                  <div className="setting-desc">{t.notificationsDesc}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={state.settings.notificationsEnabled}
                    onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div className="setting-info">
                  <div className="setting-name">{t.soundTitle}</div>
                  <div className="setting-desc">{t.soundDesc}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={state.settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div className="setting-info">
                  <div className="setting-name">{t.secretTitle}</div>
                  <div className="setting-desc">{t.secretDesc}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={state.settings.showSecretAchievements}
                    onChange={(e) => updateSettings({ showSecretAchievements: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div className="setting-info">
                  <div className="setting-name">{t.languageTitle}</div>
                  <div className="setting-desc">{t.languageDesc}</div>
                </div>
                <select
                  value={language}
                  onChange={(e) => selectLanguage(e.target.value as Language)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "6px 12px",
                    fontWeight: "bold",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="fr" style={{ background: "#181818" }}>Français</option>
                  <option value="en" style={{ background: "#181818" }}>English</option>
                </select>
              </div>
            </div>

            <hr className="settings-separator" />

            <h2 className="section-title">{t.dataManagement}</h2>
            <div className="settings-data-management">
              <div className="data-action-row" style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <button
                  className="data-btn export-btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const data = exportData();
                    navigator.clipboard.writeText(data);
                    alert(t.exportAlert);
                  }}
                >
                  {t.exportBtn}
                </button>

                <button
                  className="data-btn import-btn"
                  style={{ flex: 1, background: "#1db954", color: "#fff" }}
                  onClick={async () => {
                    await syncUserLibraryStats();
                    fetchUserProfile().then((p) => {
                      if (p) setProfile(p);
                    });
                    alert(t.forceSyncAlert);
                  }}
                >
                  {t.forceSyncBtn}
                </button>
              </div>

              <div className="data-import-box">
                <textarea
                  className="import-textarea"
                  placeholder={t.importPlaceholder}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                <button className="data-btn import-btn" onClick={handleImport}>
                  {t.importBtn}
                </button>
                {importStatus === "success" && (
                  <div className="import-status success">{t.importSuccess}</div>
                )}
                {importStatus === "error" && (
                  <div className="import-status error">{t.importError}</div>
                )}
              </div>

              <div className="data-danger-zone">
                <div className="danger-zone-title">{t.dangerZone}</div>
                {!showConfirmReset ? (
                  <button className="data-btn reset-btn" onClick={() => setShowConfirmReset(true)}>
                    {t.resetBtn}
                  </button>
                ) : (
                  <div className="confirm-reset-box">
                    <div className="confirm-reset-txt">
                      {t.confirmResetTxt}
                    </div>
                    <div className="confirm-reset-actions">
                      <button className="data-btn reset-btn-final" onClick={handleReset}>
                        {t.confirmResetYes}
                      </button>
                      <button
                        className="data-btn cancel-btn"
                        onClick={() => setShowConfirmReset(false)}
                      >
                        {t.confirmResetNo}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="settings-separator" />

            <h2 className="section-title">{t.techDiag}</h2>
            <textarea
              readOnly
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              style={{
                width: "100%",
                height: "250px",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px dashed rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                padding: "16px",
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#ccc",
                resize: "vertical",
                marginTop: "16px",
                outline: "none"
              }}
              value={[
                `Spicetify Global: ${window.Spicetify ? `✅ ${t.diagAvailable}` : `❌ ${t.diagUnavailable}`}`,
                `Platform Session: ${(window.Spicetify as any)?.Platform?.Session ? `✅ ${t.diagAvailable}` : `❌ ${t.diagUnavailable}`}`,
                `Cosmos API: ${(window.Spicetify as any)?.CosmosAsync ? `✅ ${t.diagAvailable}` : `❌ ${t.diagUnavailable}`}`,
                `Username: ${typeof (window.Spicetify as any)?.Platform?.Session?.username === "string" ? (window.Spicetify as any).Platform.Session.username : "N/A"}`,
                `AccessToken: ${typeof (window.Spicetify as any)?.Platform?.Session?.accessToken === "string" ? `✅ ${t.diagGenerated} (Start: ` + (window.Spicetify as any).Platform.Session.accessToken.substring(0, 15) + "...)" : `❌ ${t.diagUnavailable}`}`,
                "",
                `--- ${t.diagErrorLogs} ---`,
                `Cosmos Res: ${localStorage.getItem("debug_liked_cosmos_res") || "N/A"}`,
                `Cosmos Err: ${localStorage.getItem("debug_liked_cosmos_err") || "N/A"}`,
                `Token Err: ${localStorage.getItem("debug_liked_token_err") || "N/A"}`,
                `Web API Status: ${localStorage.getItem("debug_liked_api_status") || "N/A"}`,
                `Web API Res: ${localStorage.getItem("debug_liked_api_res") || "N/A"}`,
                `Web API Err: ${localStorage.getItem("debug_liked_api_err") || "N/A"}`,
                `Scrobble Err: ${localStorage.getItem("debug_scrobble_err") || "N/A"}`,
                `Playlists Err: ${localStorage.getItem("debug_playlists_err") || "N/A"}`,
                `Liked Check Err: ${localStorage.getItem("debug_liked_check_err") || "N/A"}`,
                `Session Keys: ${localStorage.getItem("debug_session_keys") || "N/A"}`,
                `WG Profile Res: ${localStorage.getItem("debug_profile_wg_res") || "N/A"}`,
                `WG Profile Err: ${localStorage.getItem("debug_profile_wg_err") || "N/A"}`,
                "",
                `--- ${t.diagPlatformInspection} ---`,
                `Platform Keys: ${localStorage.getItem("debug_platform_keys") || "N/A"}`,
                `LibraryAPI Keys: ${localStorage.getItem("debug_library_api_keys") || "N/A"}`,
                `Username Val: ${localStorage.getItem("debug_username_val") || "N/A"}`,
                `Initial User: ${localStorage.getItem("debug_initial_user") || "N/A"}`,
                `LibraryAPI Proto: ${localStorage.getItem("debug_library_api_proto") || "N/A"}`,
                `UserAPI Proto: ${localStorage.getItem("debug_user_api_proto") || "N/A"}`,
                `Library getTracks Res: ${localStorage.getItem("debug_liked_lib_res") || "N/A"}`,
                `Library getTracks Err: ${localStorage.getItem("debug_liked_lib_err") || "N/A"}`,
                `StatsFM LS Keys: ${localStorage.getItem("debug_local_storage_vals") || "N/A"}`
              ].join("\n")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
