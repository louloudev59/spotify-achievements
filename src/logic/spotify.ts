export async function getAccessToken(): Promise<string | null> {
  for (let i = 0; i < 50; i++) {
    if (
      window.Spicetify &&
      (window.Spicetify as any).Platform &&
      (window.Spicetify as any).Platform.Session
    ) {
      return (window.Spicetify as any).Platform.Session.accessToken || null;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

export interface SpotifyProfile {
  displayName: string;
  avatarUrl?: string;
}

let profileCache: SpotifyProfile | null = null;

export async function fetchUserProfile(): Promise<SpotifyProfile> {
  if (profileCache) return profileCache;

  for (let i = 0; i < 50; i++) {
    if (
      window.Spicetify &&
      (window.Spicetify as any).Platform &&
      (window.Spicetify as any).Platform.Session
    ) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  try {
    const session = (window.Spicetify as any)?.Platform?.Session;
    if (session) {
      localStorage.setItem("debug_session_keys", Object.keys(session).join(","));
    }

    try {
      const statsKeys = Object.keys(localStorage).filter(k =>
        k.includes("stats") || k.includes("listening") || k.includes("provider") || k.includes("user") || k.includes("fm")
      );
      const statsVals: Record<string, string | null> = {};
      statsKeys.forEach(k => {
        statsVals[k] = localStorage.getItem(k);
      });
      localStorage.setItem("debug_local_storage_vals", JSON.stringify(statsVals));
    } catch {}
    const platform = (window.Spicetify as any)?.Platform;
    if (platform) {
      localStorage.setItem("debug_platform_keys", Object.keys(platform).join(","));
      localStorage.setItem("debug_username_val", String(platform.username || "N/A"));
      localStorage.setItem("debug_initial_user", JSON.stringify(platform.initialUser || {}));

      if (platform.LibraryAPI) {
        localStorage.setItem("debug_library_api_keys", Object.keys(platform.LibraryAPI).join(","));
        const libProto = [];
        let p = Object.getPrototypeOf(platform.LibraryAPI);
        while (p && p !== Object.prototype) {
          libProto.push(...Object.getOwnPropertyNames(p));
          p = Object.getPrototypeOf(p);
        }
        localStorage.setItem("debug_library_api_proto", libProto.join(","));
      }

      if (platform.UserAPI) {
        const userProto = [];
        let p = Object.getPrototypeOf(platform.UserAPI);
        while (p && p !== Object.prototype) {
          userProto.push(...Object.getOwnPropertyNames(p));
          p = Object.getPrototypeOf(p);
        }
        localStorage.setItem("debug_user_api_proto", userProto.join(","));
      }
    }
  } catch {}

  try {
    const platform = (window.Spicetify as any)?.Platform;
    if (platform && platform.initialUser) {
      let displayName = platform.initialUser.displayName || platform.initialUser.username || platform.username || "";
      if (displayName && typeof displayName !== "string") {
        displayName = String(displayName);
      }

      let avatarUrl = platform.initialUser.images?.[0]?.url || undefined;
      if (avatarUrl && typeof avatarUrl !== "string") {
        avatarUrl = undefined;
      }

      if (displayName) {
        profileCache = { displayName, avatarUrl };
        return profileCache;
      }
    }
  } catch {}

  try {
    if (window.Spicetify && (window.Spicetify as any).CosmosAsync) {
      const data = await (window.Spicetify as any).CosmosAsync.get("wg://account/v1/userstate");
      localStorage.setItem("debug_profile_wg_res", JSON.stringify(data));
      localStorage.removeItem("debug_profile_wg_err");

      let displayName = data.displayName || data.name || data.username || "";
      if (displayName && typeof displayName !== "string") {
        displayName = String(displayName);
      }

      let avatarUrl = data.avatarUrl || data.avatar || data.images?.[0]?.url || undefined;
      if (avatarUrl && typeof avatarUrl !== "string") {
        avatarUrl = undefined;
      }

      if (displayName) {
        profileCache = { displayName: displayName as string, avatarUrl: avatarUrl as string };
        return profileCache;
      }
    }
  } catch (e: any) {
    localStorage.setItem("debug_profile_wg_err", e.message || String(e));
  }

  const token = await getAccessToken();
  if (token) {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        let displayName = data.display_name || "Spotify User";
        if (typeof displayName !== "string") displayName = String(displayName);

        let avatarUrl = data.images?.[0]?.url || undefined;
        if (avatarUrl && typeof avatarUrl !== "string") avatarUrl = undefined;

        profileCache = {
          displayName,
          avatarUrl,
        };
        return profileCache;
      }
    } catch (e) {
      console.error("Failed to fetch Spotify user profile via Web API:", e);
    }
  }

  try {
    const rawLocalUser = localStorage.getItem("username") || (window.Spicetify as any)?.Platform?.LocalStorageAPI?.getItem("username");
    const rawLocalName = localStorage.getItem("display-name") || localStorage.getItem("displayName") || (window.Spicetify as any)?.Platform?.Session?.displayName;

    let localUser = typeof rawLocalUser === "string" ? rawLocalUser : "";
    let localName = typeof rawLocalName === "string" ? rawLocalName : "";

    if (localUser || localName) {
      profileCache = {
        displayName: localName || localUser || "Spotify User",
        avatarUrl: undefined
      };
      return profileCache;
    }
  } catch {}

  try {
    const platformSession = (window.Spicetify as any)?.Platform?.Session;
    if (platformSession) {
      let displayName = platformSession.displayName || platformSession.username || "Spotify User";
      if (typeof displayName !== "string") displayName = String(displayName);

      let avatarUrl = platformSession.images?.[0]?.url || undefined;
      if (avatarUrl && typeof avatarUrl !== "string") avatarUrl = undefined;

      profileCache = {
        displayName,
        avatarUrl,
      };
      return profileCache;
    }
  } catch {}

  return { displayName: "Spotify User" };
}

export async function fetchLikedTracksCount(): Promise<number> {

  try {
    const lib = (window.Spicetify as any)?.Platform?.LibraryAPI;
    if (lib && typeof lib.getTracks === "function") {
      const data = await lib.getTracks();
      localStorage.setItem("debug_liked_lib_res", data ? `Type: ${typeof data}, Array: ${Array.isArray(data)}, Length: ${data.length || data.items?.length || 0}, Keys: ${Object.keys(data).join(",")}` : "Empty");
      localStorage.removeItem("debug_liked_lib_err");

      if (Array.isArray(data)) {
        return data.length;
      }
      if (data) {
        if (typeof data.unfilteredTotalLength === "number") return data.unfilteredTotalLength;
        if (typeof data.totalLength === "number") return data.totalLength;
        if (typeof data.total === "number") return data.total;
        if (Array.isArray(data.items)) return data.items.length;
        if (typeof data.length === "number") return data.length;
      }
    }
  } catch (e: any) {
    localStorage.setItem("debug_liked_lib_err", e.message || String(e));
  }

  try {
    if (window.Spicetify && (window.Spicetify as any).CosmosAsync) {
      const data = await (window.Spicetify as any).CosmosAsync.get("sp://core-collection/v1/me/tracks");
      localStorage.setItem("debug_liked_cosmos_res", data ? `Items count: ${data.items?.length || 0}, Total: ${data.total}` : "Empty");
      localStorage.removeItem("debug_liked_cosmos_err");
      if (data && typeof data.total === "number") {
        return data.total;
      }
    }
  } catch (e: any) {
    localStorage.setItem("debug_liked_cosmos_err", e.message || String(e));
  }

  const token = await getAccessToken();
  if (!token) {
    localStorage.setItem("debug_liked_token_err", "Token is null or undefined");
    return -1;
  }
  localStorage.removeItem("debug_liked_token_err");

  try {
    const res = await fetch("https://api.spotify.com/v1/me/tracks?limit=1", {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem("debug_liked_api_status", String(res.status));
    if (!res.ok) {
      const text = await res.text();
      localStorage.setItem("debug_liked_api_err", `HTTP ${res.status}: ${text}`);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const data = await res.json();
    localStorage.setItem("debug_liked_api_res", `Total: ${data.total}`);
    localStorage.removeItem("debug_liked_api_err");
    return typeof data.total === "number" ? data.total : -1;
  } catch (e: any) {
    localStorage.setItem("debug_liked_api_err", e.message || String(e));
    return -1;
  }
}

export interface TrackDetails {
  releaseYear?: number;
  artistId?: string;
  durationMs: number;
  albumUri?: string;
}

export async function fetchTrackDetails(trackId: string): Promise<TrackDetails | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const releaseDate = data.album?.release_date || "";
    let releaseYear: number | undefined = undefined;
    if (releaseDate) {
      const year = parseInt(releaseDate.split("-")[0], 10);
      if (!isNaN(year)) releaseYear = year;
    }

    return {
      releaseYear,
      artistId: data.artists?.[0]?.id || undefined,
      durationMs: data.duration_ms || 0,
      albumUri: data.album?.uri || undefined,
    };
  } catch (e) {
    console.error(`Failed to fetch track details for track ${trackId}:`, e);
    return null;
  }
}

export async function fetchArtistGenres(artistId: string): Promise<string[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.genres || [];
  } catch (e) {
    console.error(`Failed to fetch artist genres for artist ${artistId}:`, e);
    return [];
  }
}

export async function fetchUserTopGenres(): Promise<string[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const genresSet = new Set<string>();
  const timeRanges = ["short_term", "medium_term", "long_term"];

  for (const range of timeRanges) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const artists = data.items || [];
        artists.forEach((artist: any) => {
          if (artist.genres) {
            artist.genres.forEach((genre: string) => {
              genresSet.add(genre.toLowerCase());
            });
          }
        });
      }
    } catch (e) {
      console.error(`Failed to fetch top artists for range ${range}:`, e);
    }
  }

  return Array.from(genresSet);
}
