import { AchievementsState, loadState, saveState, getInitialState } from "./storage";
import { getLevelAndProgress } from "./levels";
import { playAchievementSound } from "./sound";
import { ACHIEVEMENT_DEFS, AchievementDefinition } from "./conditions";
import { fetchTrackDetails, fetchArtistGenres, fetchLikedTracksCount, fetchUserTopGenres } from "./spotify";

type UnlockCallback = (achievement: AchievementDefinition, xpEarned: number) => void;

let unlockCallback: UnlockCallback | null = null;
let lastTickTime = Date.now();

export function setUnlockCallback(cb: UnlockCallback) {
  unlockCallback = cb;
}

function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isYesterday(dateAStr: string, dateBStr: string): boolean {
  const dateA = new Date(dateAStr);
  const dateB = new Date(dateBStr);

  const diffTime = dateB.getTime() - dateA.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export async function processTrackPlayed(track: any) {
  try {
    if (!track || !track.uri) return;
    localStorage.removeItem("debug_scrobble_err");

    const state = loadState();
    const trackUri = track.uri;
    const trackId = trackUri.split(":").pop() || "";
    const artist = track.artists?.[0];
    const artistId = artist?.uri?.split(":").pop() || "";
    const albumUri = track.album?.uri || "";

    state.stats.totalSongsPlayed += 1;

    let details = state.cache.tracks[trackId];
    if (!details) {
      const fetched = await fetchTrackDetails(trackId);
      if (fetched) {
        details = {
          releaseYear: fetched.releaseYear,
          artistId: fetched.artistId || artistId,
          durationMs: fetched.durationMs || track.duration?.milliseconds || 0,
          albumUri: fetched.albumUri || albumUri,
          genres: [],
        };
        if (details.artistId) {
          details.genres = await fetchArtistGenres(details.artistId);
        }
        state.cache.tracks[trackId] = details;
      }
    }

    const durationMs = details?.durationMs || track.duration?.milliseconds || 0;
    const releaseYear = details?.releaseYear;
    const genres = details?.genres || [];

    const artistName = artist?.name || track.metadata?.artist_name || "";
    if (artistName && !state.stats.uniqueArtists.includes(artistName)) {
      state.stats.uniqueArtists.push(artistName);
    }

    genres.forEach((genre) => {
      const lower = genre.toLowerCase();
      if (!state.stats.uniqueGenres.includes(lower)) {
        state.stats.uniqueGenres.push(lower);
      }
      state.stats.genreCounts[lower] = (state.stats.genreCounts[lower] || 0) + 1;
    });

    const albumTrackCount = parseInt(track.metadata?.album_track_count || "0", 10);
    if (albumUri && albumTrackCount > 0) {
      if (!state.stats.albumTrackCompletions[albumUri]) {
        state.stats.albumTrackCompletions[albumUri] = [];
      }
      const completions = state.stats.albumTrackCompletions[albumUri];
      if (!completions.includes(trackUri)) {
        completions.push(trackUri);
      }

      if (completions.length >= albumTrackCount) {
        const albumName = track.album?.name || track.metadata?.album_title || "";
        if (albumName && !state.stats.uniqueAlbums.includes(albumName)) {
          state.stats.uniqueAlbums.push(albumName);
        }
      }
    }

    const today = getLocalDateString();
    if (!state.stats.uniqueTracks.includes(today)) {
      state.stats.uniqueTracks.push(today);
    }

    const lastActive = state.stats.lastActiveDate;
    if (!lastActive) {
      state.stats.streakDays = 1;
    } else if (lastActive !== today) {
      if (isYesterday(lastActive, today)) {
        state.stats.streakDays += 1;
      } else {
        state.stats.streakDays = 1;
      }
    }
    state.stats.lastActiveDate = today;

    if (durationMs > 480000) {
      if (!state.stats.longSongsListened.includes(trackUri)) {
        state.stats.longSongsListened.push(trackUri);
      }
    } else if (durationMs < 120000 && durationMs > 0) {
      if (!state.stats.shortSongsListened.includes(trackUri)) {
        state.stats.shortSongsListened.push(trackUri);
      }
    }

    if (releaseYear && releaseYear < 1990) {
      if (!state.stats.oldSongsListened.includes(trackUri)) {
        state.stats.oldSongsListened.push(trackUri);
      }
    }

    if (!state.stats.newSongsListened.includes(trackUri)) {
      state.stats.newSongsListened.push(trackUri);
    }

    const hour = new Date().getHours();
    if (hour === 0) {
      state.stats.genreCounts["_tod_midnight"] = (state.stats.genreCounts["_tod_midnight"] || 0) + 1;
    } else if (hour === 3) {
      state.stats.genreCounts["_tod_3am"] = (state.stats.genreCounts["_tod_3am"] || 0) + 1;
    } else if (hour === 4) {
      state.stats.genreCounts["_tod_4am"] = (state.stats.genreCounts["_tod_4am"] || 0) + 1;
    } else if (hour >= 5 && hour <= 6) {
      state.stats.genreCounts["_tod_sunrise"] = (state.stats.genreCounts["_tod_sunrise"] || 0) + 1;
    }

    saveState(state);
    checkAchievements();
  } catch (e: any) {
    localStorage.setItem("debug_scrobble_err", `${e.message}\n${e.stack}`);
    console.error("Error in processTrackPlayed:", e);
  }
}

export function processListeningTimeTick(activeSeconds: number) {
  const state = loadState();
  const addedMs = activeSeconds * 1000;
  state.stats.totalListeningTimeMs += addedMs;

  state.stats.playlistsDeleted = (state.stats.playlistsDeleted || 0) + activeSeconds;

  saveState(state);
  checkAchievements();
}

export function resetContinuousPlaySession() {
  const state = loadState();
  state.stats.playlistsDeleted = 0;
  saveState(state);
}

export function processPlaylistsScanned(rootlist: any) {
  try {
    if (!rootlist) return;
    localStorage.removeItem("debug_playlists_err");
    const state = loadState();

    const items = rootlist.items || rootlist;
    if (!Array.isArray(items)) return;

    const sessionUsername = (window.Spicetify as any)?.Platform?.Session?.username;
    const storageUsername = (window.Spicetify as any)?.Platform?.LocalStorageAPI?.getItem("username") || localStorage.getItem("username");
    const username = sessionUsername || storageUsername || "";

    let createdCount = 0;

    items.forEach((pl) => {
      if (pl && pl.type === "playlist") {
        let isOwner = pl.isOwnedBySelf === true;

        if (!isOwner && username && pl.owner) {
          isOwner = pl.owner.username === username ||
                    pl.owner.uri?.includes(username);
        }

        if (isOwner) {
          createdCount++;
        }
      }
    });

    state.stats.playlistsCreated = createdCount;
    saveState(state);
    checkAchievements();
  } catch (e: any) {
    localStorage.setItem("debug_playlists_err", `${e.message}\n${e.stack}`);
    console.error("Error in processPlaylistsScanned:", e);
  }
}

export async function processLikedTracksCheck() {
  try {
    localStorage.removeItem("debug_liked_check_err");
    const count = await fetchLikedTracksCount();
    if (count < 0) return;
    const state = loadState();

    state.stats.playlistsAdded = count;
    saveState(state);
    checkAchievements();
  } catch (e: any) {
    localStorage.setItem("debug_liked_check_err", `${e.message}\n${e.stack}`);
    console.error("Error in processLikedTracksCheck:", e);
  }
}

export function checkAchievements() {
  const state = loadState();
  let stateChanged = false;

  ACHIEVEMENT_DEFS.forEach((def) => {
    const progress = def.check(state.stats);
    const existing = state.achievements[def.id] || { progress: 0, unlocked: false };

    let newProgress = Math.min(progress, def.maxProgress);
    if (newProgress !== existing.progress) {
      existing.progress = newProgress;
      state.achievements[def.id] = existing;
      stateChanged = true;
    }

    if (newProgress >= def.maxProgress && !existing.unlocked) {
      existing.unlocked = true;
      existing.unlockDate = new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      state.achievements[def.id] = existing;
      state.unlocked.push(def.id);

      state.xp += def.xp;
      state.stats.totalXp += def.xp;

      const oldLevel = state.level;
      const levelProgress = getLevelAndProgress(state.xp);
      state.level = levelProgress.level;

      stateChanged = true;

      if (state.settings.soundEnabled && state.settings.soundType === "synth") {
        playAchievementSound(def.rarity);
      }

      if (state.settings.notificationsEnabled && unlockCallback) {
        unlockCallback(def, def.xp);
      }
    }
  });

  if (stateChanged) {
    saveState(state);

    window.dispatchEvent(new CustomEvent("spotify-achievements-update"));
  }
}

async function importListeningStatsHistory(state: AchievementsState): Promise<boolean> {
  try {
    const { playEvents, artists }: { playEvents: any[]; artists: any[] } = await new Promise((resolve, reject) => {
      const request = indexedDB.open("listening-stats");
      request.onerror = (e) => reject(e);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("playEvents")) {
          db.close();
          resolve({ playEvents: [], artists: [] });
          return;
        }

        try {
          const hasArtists = db.objectStoreNames.contains("artists");
          const storeNames = hasArtists ? ["playEvents", "artists"] : ["playEvents"];
          const transaction = db.transaction(storeNames, "readonly");

          const playStore = transaction.objectStore("playEvents");
          const getPlays = playStore.getAll();

          let getArtists: any = null;
          if (hasArtists) {
            const artistStore = transaction.objectStore("artists");
            getArtists = artistStore.getAll();
          }

          transaction.oncomplete = () => {
            db.close();
            resolve({
              playEvents: getPlays.result || [],
              artists: getArtists ? getArtists.result || [] : []
            });
          };

          transaction.onerror = (err) => {
            db.close();
            reject(err);
          };
        } catch (err) {
          db.close();
          reject(err);
        }
      };
    });

    if (!playEvents || playEvents.length === 0) return false;

    const validPlays = playEvents.filter((ev) => ev && ev.type === "play");
    if (validPlays.length === 0) return false;

    let changed = false;

    state.stats.newSongsListened = [];
    state.stats.longSongsListened = [];
    state.stats.shortSongsListened = [];
    state.stats.uniqueArtists = [];
    state.stats.uniqueTracks = [];
    state.stats.totalListeningTimeMs = 0;

    state.stats.genreCounts["_tod_midnight"] = 0;
    state.stats.genreCounts["_tod_3am"] = 0;
    state.stats.genreCounts["_tod_4am"] = 0;
    state.stats.genreCounts["_tod_sunrise"] = 0;

    validPlays.forEach((ev) => {
      const trackUri = ev.trackUri;
      if (!trackUri) return;

      if (!state.stats.newSongsListened.includes(trackUri)) {
        state.stats.newSongsListened.push(trackUri);
      }

      const artistName = ev.artistName;
      if (artistName && !state.stats.uniqueArtists.includes(artistName)) {
        state.stats.uniqueArtists.push(artistName);
      }

      const durationMs = ev.durationMs || 0;
      if (durationMs > 480000) {
        if (!state.stats.longSongsListened.includes(trackUri)) {
          state.stats.longSongsListened.push(trackUri);
        }
      } else if (durationMs < 120000 && durationMs > 0) {
        if (!state.stats.shortSongsListened.includes(trackUri)) {
          state.stats.shortSongsListened.push(trackUri);
        }
      }

      if (ev.startedAt) {
        const d = new Date(ev.startedAt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dayStr = String(d.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${dayStr}`;

        if (!state.stats.uniqueTracks.includes(dateStr)) {
          state.stats.uniqueTracks.push(dateStr);
        }

        const hour = d.getHours();
        if (hour === 0) {
          state.stats.genreCounts["_tod_midnight"] = (state.stats.genreCounts["_tod_midnight"] || 0) + 1;
        } else if (hour === 3) {
          state.stats.genreCounts["_tod_3am"] = (state.stats.genreCounts["_tod_3am"] || 0) + 1;
        } else if (hour === 4) {
          state.stats.genreCounts["_tod_4am"] = (state.stats.genreCounts["_tod_4am"] || 0) + 1;
        } else if (hour >= 5 && hour <= 6) {
          state.stats.genreCounts["_tod_sunrise"] = (state.stats.genreCounts["_tod_sunrise"] || 0) + 1;
        }
      }

      if (ev.playedMs && ev.playedMs > 0) {
        state.stats.totalListeningTimeMs += ev.playedMs;
      }
    });

    if (artists && artists.length > 0) {
      artists.forEach((art) => {
        if (art && Array.isArray(art.genres)) {
          art.genres.forEach((genre) => {
            const lower = String(genre).toLowerCase();
            if (lower && !state.stats.uniqueGenres.includes(lower)) {
              state.stats.uniqueGenres.push(lower);
            }

            if (lower && !state.stats.genreCounts[lower]) {
              state.stats.genreCounts[lower] = 1;
            }
          });
        }
      });
    }

    state.stats.totalSongsPlayed = validPlays.length;

    if (state.stats.uniqueTracks.length > 0) {
      const sortedDates = [...state.stats.uniqueTracks].sort();
      const today = getLocalDateString();
      const lastActive = sortedDates[sortedDates.length - 1];

      let streak = 0;
      if (lastActive === today || isYesterday(lastActive, today)) {
        streak = 1;
        let prevDate = lastActive;
        for (let i = sortedDates.length - 2; i >= 0; i--) {
          const currentDate = sortedDates[i];
          if (isYesterday(currentDate, prevDate)) {
            streak++;
            prevDate = currentDate;
          } else if (currentDate === prevDate) {

          } else {
            break;
          }
        }
      } else {
        streak = 0;
      }

      state.stats.streakDays = streak || 1;
      state.stats.lastActiveDate = lastActive;
    }

    try {
      const activeProvider = localStorage.getItem("listening-stats:active-provider");
      const statsfmConfigRaw = localStorage.getItem("listening-stats:statsfm");
      if (activeProvider === "statsfm" && statsfmConfigRaw) {
        const statsfmConfig = JSON.parse(statsfmConfigRaw);
        const statsfmUsername = statsfmConfig.username;
        if (statsfmUsername) {

          const statsRes = await fetch(`https://api.stats.fm/api/v1/users/${statsfmUsername}/streams/stats`);
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData && statsData.items) {
              const item = statsData.items;
              if (typeof item.durationMs === "number" && item.durationMs > state.stats.totalListeningTimeMs) {
                state.stats.totalListeningTimeMs = item.durationMs;
              }
              if (typeof item.count === "number" && item.count > state.stats.totalSongsPlayed) {
                state.stats.totalSongsPlayed = item.count;
              }

              if (item.cardinality && typeof item.cardinality.artists === "number") {
                const targetArtistCount = item.cardinality.artists;
                while (state.stats.uniqueArtists.length < targetArtistCount) {
                  state.stats.uniqueArtists.push(`Cloud Artist #${state.stats.uniqueArtists.length + 1}`);
                }
              }
            }
          }

          const artistsRes = await fetch(`https://api.stats.fm/api/v1/users/${statsfmUsername}/top/artists?limit=100&range=lifetime`);
          if (artistsRes.ok) {
            const artistsData = await artistsRes.json();
            const items = artistsData.items || [];
            items.forEach((item: any) => {
              const artistObj = item.artist;
              if (!artistObj) return;

              const name = artistObj.name;
              if (name) {
                const placeholderIndex = state.stats.uniqueArtists.findIndex(x => x.startsWith("Cloud Artist #"));
                if (!state.stats.uniqueArtists.includes(name)) {
                  if (placeholderIndex >= 0) {
                    state.stats.uniqueArtists[placeholderIndex] = name;
                  } else {
                    state.stats.uniqueArtists.push(name);
                  }
                }
              }

              if (Array.isArray(artistObj.genres)) {
                artistObj.genres.forEach((genre) => {
                  const lower = String(genre).toLowerCase();
                  if (lower && !state.stats.uniqueGenres.includes(lower)) {
                    state.stats.uniqueGenres.push(lower);
                  }
                  if (lower && !state.stats.genreCounts[lower]) {
                    state.stats.genreCounts[lower] = 1;
                  }
                });
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("Failed to sync stats.fm cloud metrics:", e);
    }

    changed = true;
    return changed;
  } catch (e) {
    console.error("Failed to import listening-stats history:", e);
    return false;
  }
}

export async function syncUserLibraryStats() {
  const state = loadState();
  let changed = false;

  try {
    const imported = await importListeningStatsHistory(state);
    if (imported) {
      changed = true;
    }
  } catch (e) {
    console.error("Failed to import listening history from listening-stats database:", e);
  }

  const count = await fetchLikedTracksCount();
  if (count >= 0 && state.stats.playlistsAdded !== count) {
    state.stats.playlistsAdded = count;
    changed = true;
  }

  try {
    const genres = await fetchUserTopGenres();
    if (genres.length > 0) {
      genres.forEach((genre) => {
        const lower = genre.toLowerCase();
        if (!state.stats.uniqueGenres.includes(lower)) {
          state.stats.uniqueGenres.push(lower);
          changed = true;
        }

        if (!state.stats.genreCounts[lower]) {
          state.stats.genreCounts[lower] = 1;
          changed = true;
        }
      });
    }
  } catch (e) {
    console.error("Failed to sync user top genres:", e);
  }

  if (changed) {
    saveState(state);
    checkAchievements();
    window.dispatchEvent(new CustomEvent("spotify-achievements-update"));
  }
}
