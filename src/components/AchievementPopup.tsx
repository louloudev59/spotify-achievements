import React, { useState, useEffect } from "react";

export interface ToastItem {
  id: string;
  name: string;
  xp: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export function AchievementPopupManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      const newToast: ToastItem = {
        id: detail.id || String(Date.now()),
        name: detail.name || "Succès débloqué !",
        xp: detail.xp || 0,
        rarity: detail.rarity || "common",
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    };

    window.addEventListener("spotify-achievements-show-toast", handleShowToast);
    return () => {
      window.removeEventListener("spotify-achievements-show-toast", handleShowToast);
    };
  }, []);

  return (
    <div className="achievements-toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`achievements-toast rarity-${toast.rarity}`}
        >
          <div className="toast-icon">🏆</div>
          <div className="toast-content">
            <div className="toast-header">Succès débloqué !</div>
            <div className="toast-title">{toast.name}</div>
            <div className="toast-xp">+{toast.xp} XP</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function triggerAchievementToast(id: string, name: string, xp: number, rarity: string) {
  window.dispatchEvent(
    new CustomEvent("spotify-achievements-show-toast", {
      detail: { id, name, xp, rarity },
    })
  );
}
