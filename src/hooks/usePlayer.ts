import { useState, useEffect } from "react";

export interface UsePlayerReturn {
  isPlaying: boolean;
  currentTrack: any;
  progress: number;
}

export function usePlayer(): UsePlayerReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!window.Spicetify || !Spicetify.Player) return;

    const updateState = () => {
      setIsPlaying(Spicetify.Player.isPlaying() || false);
      setCurrentTrack(Spicetify.Player.data?.item || null);
      setProgress(Spicetify.Player.getProgress() || 0);
    };

    updateState();

    const handleSongChange = () => {
      updateState();
    };

    const handlePlayPause = () => {
      updateState();
    };

    const handleProgress = (event?: any) => {
      setProgress(event?.data || Spicetify.Player.getProgress() || 0);
    };

    Spicetify.Player.addEventListener("songchange", handleSongChange);
    Spicetify.Player.addEventListener("onplaypause", handlePlayPause);
    Spicetify.Player.addEventListener("onprogress", handleProgress);

    return () => {
      Spicetify.Player.removeEventListener("songchange", handleSongChange);
      Spicetify.Player.removeEventListener("onplaypause", handlePlayPause);
      Spicetify.Player.removeEventListener("onprogress", handleProgress);
    };
  }, []);

  return {
    isPlaying,
    currentTrack,
    progress,
  };
}
