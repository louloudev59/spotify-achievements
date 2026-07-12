export function playAchievementSound(rarity: "common" | "uncommon" | "rare" | "epic" | "legendary") {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.12, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;

    switch (rarity) {
      case "common":

        playTone(523.25, now, 0.25);
        playTone(659.25, now + 0.08, 0.35);
        break;
      case "uncommon":

        playTone(523.25, now, 0.25);
        playTone(783.99, now + 0.08, 0.35);
        break;
      case "rare":

        playTone(523.25, now, 0.22);
        playTone(659.25, now + 0.07, 0.22);
        playTone(783.99, now + 0.14, 0.22);
        playTone(1046.50, now + 0.21, 0.45);
        break;
      case "epic":

        playTone(783.99, now, 0.18);
        playTone(1046.50, now + 0.05, 0.18);
        playTone(1318.51, now + 0.10, 0.18);
        playTone(1567.98, now + 0.15, 0.55, "triangle");
        break;
      case "legendary":

        const playSweep = (startFreq: number, endFreq: number, delay: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.frequency.setValueAtTime(startFreq, now + delay);
          osc.frequency.exponentialRampToValueAtTime(endFreq, now + delay + dur);
          gainNode.gain.setValueAtTime(0.06, now + delay);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + dur);
        };
        playSweep(261.63, 523.25, 0, 0.7);
        playSweep(329.63, 659.25, 0.04, 0.7);
        playSweep(392.00, 783.99, 0.08, 0.7);
        playSweep(523.25, 1046.50, 0.12, 1.0);
        break;
    }
  } catch (e) {
    console.error("Failed to play synthesized sound:", e);
  }
}
