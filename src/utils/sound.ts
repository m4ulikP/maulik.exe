/**
 * MAULIK.EXE Tactile Feedback Synthesizer
 * Synthesizes subtle tactile mechanical clicks using native Web Audio API.
 * No external sound files, zero bandwidth cost, completely self-contained.
 * Default state: ON (persisted in localStorage).
 */

let audioCtx: AudioContext | null = null;

const getStoredPreference = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem('maulik_sound_pref');
    if (saved === null) return true; // Default ON
    return saved === 'on';
  } catch {
    return true;
  }
};

let soundEnabled = getStoredPreference();

const initAudioContext = (): void => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
};

export const isSoundEnabled = (): boolean => soundEnabled;

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('maulik_sound_pref', enabled ? 'on' : 'off');
    } catch {
      // Ignore localStorage errors (e.g., incognito storage limits)
    }
  }
  if (enabled) {
    initAudioContext();
  }
};

export const playTactileClick = (frequency = 820, duration = 0.018): void => {
  if (!soundEnabled) return;

  try {
    initAudioContext();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Handled silently if user gesture is required
      });
    }

    if (audioCtx.state !== 'running') {
      // If still blocked, do not attempt to play
      return;
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Graceful fallback if audio is blocked by browser policy
  }
};

export const playSwitchTone = (high = true): void => {
  if (!soundEnabled) return;
  playTactileClick(high ? 960 : 440, 0.025);
};
