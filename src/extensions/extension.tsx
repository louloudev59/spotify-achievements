import {
  processTrackPlayed,
  processListeningTimeTick,
  resetContinuousPlaySession,
  processPlaylistsScanned,
  processLikedTracksCheck,
  setUnlockCallback,
  checkAchievements,
  syncUserLibraryStats,
} from "../logic/achievementEngine";
import { getLocalizedAchievement } from "../logic/conditions";

function showAchievementToast(name: string, xp: number, rarity: string) {
  try {
    let container = document.getElementById("achievements-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "achievements-toast-container";
      container.className = "achievements-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `achievements-toast rarity-${rarity}`;

    const lang = localStorage.getItem("spotify-achievements:language") || "fr";
    const headerText = lang === "en" ? "Achievement unlocked!" : "Succès débloqué !";

    toast.innerHTML = `
      <div class="toast-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" style="width: 24px; height: 24px; color: #ecc94b; display: block;">
          <path d="M208.3 64L432.3 64C458.8 64 480.4 85.8 479.4 112.2C479.2 117.5 479 122.8 478.7 128L528.3 128C554.4 128 577.4 149.6 575.4 177.8C567.9 281.5 514.9 338.5 457.4 368.3C441.6 376.5 425.5 382.6 410.2 387.1C390 415.7 369 430.8 352.3 438.9L352.3 512L416.3 512C434 512 448.3 526.3 448.3 544C448.3 561.7 434 576 416.3 576L224.3 576C206.6 576 192.3 561.7 192.3 544C192.3 526.3 206.6 512 224.3 512L288.3 512L288.3 438.9C272.3 431.2 252.4 416.9 233 390.6C214.6 385.8 194.6 378.5 175.1 367.5C121 337.2 72.2 280.1 65.2 177.6C63.3 149.5 86.2 127.9 112.3 127.9L161.9 127.9C161.6 122.7 161.4 117.5 161.2 112.1C160.2 85.6 181.8 63.9 208.3 63.9zM165.5 176L113.1 176C119.3 260.7 158.2 303.1 198.3 325.6C183.9 288.3 172 239.6 165.5 176zM444 320.8C484.5 297 521.1 254.7 527.3 176L475 176C468.8 236.9 457.6 284.2 444 320.8z"/>
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-header">${headerText}</div>
        <div class="toast-title">${name}</div>
        <div class="toast-xp">+${xp} XP</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-12px) scale(0.95)";
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 4150);
  } catch (e) {
    console.error("Failed to render achievements toast:", e);
  }
}

(async () => {

  while (
    !window.Spicetify ||
    !Spicetify.Player ||
    !Spicetify.Platform ||
    !Spicetify.Platform.RootlistAPI ||
    !Spicetify.Platform.Session ||
    !Spicetify.Platform.Session.accessToken
  ) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  setUnlockCallback((achievement, xpEarned) => {
    const lang = (localStorage.getItem("spotify-achievements:language") as "fr" | "en") || "fr";
    const localized = getLocalizedAchievement(achievement, lang);
    showAchievementToast(localized.name, xpEarned, localized.rarity);
  });

  let lastTrackUri = "";
  let trackCompleted = false;
  let lastTickTime = Date.now();
  let pauseStartTime = 0;

  checkAchievements();

  setTimeout(() => {
    syncUserLibraryStats();
  }, 3000);

  const runBackgroundScans = async () => {
    try {
      await processLikedTracksCheck();
      const playlists = await Spicetify.Platform.RootlistAPI.getContents();
      if (playlists) {
        processPlaylistsScanned(playlists);
      }
    } catch (e) {
      console.error("Achievements background scan error:", e);
    }
  };

  runBackgroundScans();
  setInterval(runBackgroundScans, 600000);

  setInterval(() => {
    const isPlaying = Spicetify.Player.isPlaying();
    const now = Date.now();
    const elapsedSeconds = (now - lastTickTime) / 1000;
    lastTickTime = now;

    if (isPlaying) {
      pauseStartTime = 0;
      processListeningTimeTick(elapsedSeconds);

      const data = Spicetify.Player.data;
      if (data && data.item) {
        const currentUri = data.item.uri;
        const currentProgress = Spicetify.Player.getProgress();
        const duration = data.item.duration?.milliseconds || 0;

        if (currentUri !== lastTrackUri) {
          lastTrackUri = currentUri;
          trackCompleted = false;
        }

        if (duration > 0 && !trackCompleted) {
          if (currentProgress >= duration - 1500 || currentProgress / duration >= 0.98) {
            trackCompleted = true;
            processTrackPlayed(data.item);
          }
        }
      }
    } else {
      if (pauseStartTime === 0) {
        pauseStartTime = now;
      } else {
        const pausedMinutes = (now - pauseStartTime) / 60000;
        if (pausedMinutes >= 5) {
          resetContinuousPlaySession();
        }
      }
    }
  }, 1000);

  Spicetify.Player.addEventListener("songchange", (event) => {
    const data = event?.data;
    if (data && data.item) {
      const newUri = data.item.uri;
      if (newUri !== lastTrackUri) {
        lastTrackUri = newUri;
        trackCompleted = false;
        lastTickTime = Date.now();
      }
    }
  });

  const startupLang = localStorage.getItem("spotify-achievements:language") || "fr";
  Spicetify.showNotification(startupLang === "en" ? "Spotify Achievements enabled! 🏆" : "Spotify Achievements activé ! 🏆");
})();
