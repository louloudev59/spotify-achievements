export interface TrackCacheItem {
  releaseYear?: number;
  genres: string[];
  durationMs: number;
  artistId?: string;
  albumUri?: string;
}

export interface AchievementProgress {
  progress: number;
  unlocked: boolean;
  unlockDate?: string;
}

export interface AchievementsState {
  achievements: { [id: string]: AchievementProgress };
  xp: number;
  level: number;
  unlocked: string[];
  stats: {
    totalSongsPlayed: number;
    totalListeningTimeMs: number;
    uniqueArtists: string[];
    uniqueAlbums: string[];
    uniqueTracks: string[];
    uniqueGenres: string[];
    playlistsCreated: number;
    playlistsAdded: number;
    playlistsDeleted: number;
    newSongsListened: string[];
    oldSongsListened: string[];
    longSongsListened: string[];
    shortSongsListened: string[];
    streakDays: number;
    lastActiveDate?: string;
    totalXp: number;
    genreCounts: { [genre: string]: number };
    albumTrackCompletions: { [albumUri: string]: string[] };
  };
  settings: {
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    showSecretAchievements: boolean;
    soundType: "synth" | "none";
  };
  cache: {
    tracks: { [trackId: string]: TrackCacheItem };
  };
}

export const STORAGE_KEY = "spotify-achievements:state";

export function getInitialState(): AchievementsState {
  return {
    achievements: {},
    xp: 0,
    level: 1,
    unlocked: [],
    stats: {
      totalSongsPlayed: 0,
      totalListeningTimeMs: 0,
      uniqueArtists: [],
      uniqueAlbums: [],
      uniqueTracks: [],
      uniqueGenres: [],
      playlistsCreated: 0,
      playlistsAdded: 0,
      playlistsDeleted: 0,
      newSongsListened: [],
      oldSongsListened: [],
      longSongsListened: [],
      shortSongsListened: [],
      streakDays: 0,
      lastActiveDate: undefined,
      totalXp: 0,
      genreCounts: {},
      albumTrackCompletions: {},
    },
    settings: {
      notificationsEnabled: true,
      soundEnabled: true,
      showSecretAchievements: false,
      soundType: "synth",
    },
    cache: {
      tracks: {},
    },
  };
}

export function loadState(): AchievementsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);

    const initial = getInitialState();
    return {
      ...initial,
      ...parsed,
      achievements: parsed.achievements || {},
      unlocked: parsed.unlocked || [],
      stats: {
        ...initial.stats,
        ...(parsed.stats || {}),
        uniqueArtists: parsed.stats?.uniqueArtists || [],
        uniqueAlbums: parsed.stats?.uniqueAlbums || [],
        uniqueTracks: parsed.stats?.uniqueTracks || [],
        uniqueGenres: parsed.stats?.uniqueGenres || [],
        newSongsListened: parsed.stats?.newSongsListened || [],
        oldSongsListened: parsed.stats?.oldSongsListened || [],
        longSongsListened: parsed.stats?.longSongsListened || [],
        shortSongsListened: parsed.stats?.shortSongsListened || [],
        genreCounts: parsed.stats?.genreCounts || {},
        albumTrackCompletions: parsed.stats?.albumTrackCompletions || {},
      },
      settings: {
        ...initial.settings,
        ...(parsed.settings || {}),
      },
      cache: {
        ...initial.cache,
        ...(parsed.cache || {}),
        tracks: parsed.cache?.tracks || {},
      },
    };
  } catch (e) {
    console.error("Failed to load achievements state:", e);
    return getInitialState();
  }
}

export function saveState(state: AchievementsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save achievements state:", e);
  }
}
