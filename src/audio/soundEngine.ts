/**
 * 8-Bit Web Audio Synthesizer for Dragon Quest 1 Tribute
 * Generates authentic NES/Famicom chiptune sound effects and melodies using Web Audio API.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private currentBgmTrack: 'overworld' | 'battle' | 'boss' | null = null;

  constructor() {
    // Sound will initialize on first user interaction to comply with browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.15;
      this.bgmGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.25;
    }
    if (muted) {
      this.stopBgm();
    }
  }

  public setBgmMute(muted: boolean) {
    this.bgmMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = muted ? 0 : 0.15;
    }
    if (muted) {
      this.stopBgm();
    } else if (this.currentBgmTrack) {
      this.playBgm(this.currentBgmTrack);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmMuted(): boolean {
    return this.bgmMuted;
  }

  // --- Chiptune primitives ---
  private playTone(freq: number, duration: number, type: OscillatorType = 'square', startDelay: number = 0, volume: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(0.2 * volume, this.ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + startDelay);
      osc.stop(this.ctx.currentTime + startDelay + duration);
    } catch {
      // AudioContext might fail gracefully
    }
  }

  private playNoise(duration: number, volume: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3 * volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {
      // fallback
    }
  }

  // --- Sound Effects ---

  public playCursor() {
    this.playTone(660, 0.04, 'square', 0, 0.4);
  }

  public playSelect() {
    this.playTone(880, 0.06, 'square', 0, 0.6);
    this.playTone(1320, 0.09, 'square', 0.05, 0.6);
  }

  public playConfirm() {
    this.playTone(660, 0.06, 'square', 0, 0.6);
    this.playTone(990, 0.1, 'square', 0.05, 0.6);
  }

  public playCancel() {
    this.playTone(550, 0.06, 'square', 0, 0.5);
    this.playTone(330, 0.08, 'square', 0.06, 0.5);
  }

  public playStep() {
    this.playTone(180, 0.03, 'triangle', 0, 0.2);
  }

  public playAttack() {
    this.playTone(400, 0.08, 'sawtooth', 0, 0.5);
    this.playNoise(0.07, 0.6);
  }

  public playHit() {
    this.playNoise(0.15, 0.9);
    this.playTone(120, 0.12, 'square', 0, 0.8);
  }

  public playHeroDamage() {
    this.playTone(220, 0.08, 'sawtooth', 0, 0.8);
    this.playTone(140, 0.14, 'square', 0.06, 0.8);
  }

  public playSpellCast() {
    // Magic chime arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.08, 'sine', idx * 0.04, 0.7);
    });
  }

  public playHeal() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.14, 'sine', idx * 0.06, 0.7);
    });
  }

  public playEncounter() {
    // Classic sudden descending encounter alarm
    const notes = [1200, 900, 700, 500, 350, 200];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.06, 'sawtooth', idx * 0.04, 0.8);
    });
  }

  public playRun() {
    this.playTone(350, 0.07, 'triangle', 0, 0.5);
    this.playTone(500, 0.07, 'triangle', 0.07, 0.5);
    this.playTone(700, 0.1, 'triangle', 0.14, 0.5);
  }

  public playTreasure() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.12, 'square', idx * 0.08, 0.7);
    });
  }

  public playLevelUp() {
    // Iconic Dragon Quest Level-Up Fanfare: G4, G4, G4, C5, D5, E5, F5, G5!
    const notes = [
      { f: 392.00, d: 0.12, t: 0.00 },
      { f: 392.00, d: 0.12, t: 0.14 },
      { f: 392.00, d: 0.12, t: 0.28 },
      { f: 523.25, d: 0.35, t: 0.42 },
      { f: 587.33, d: 0.12, t: 0.80 },
      { f: 659.25, d: 0.12, t: 0.94 },
      { f: 698.46, d: 0.12, t: 1.08 },
      { f: 783.99, d: 0.50, t: 1.22 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, n.d, 'square', n.t, 0.8);
    });
  }

  public playVictory() {
    // Victory fanfare
    const notes = [
      { f: 523.25, d: 0.12, t: 0.00 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.50, d: 0.3, t: 0.36 },
      { f: 783.99, d: 0.15, t: 0.70 },
      { f: 1046.50, d: 0.45, t: 0.88 },
    ];
    notes.forEach(n => {
      this.playTone(n.f, n.d, 'square', n.t, 0.7);
    });
  }

  public playGameOver() {
    const notes = [
      { f: 392.00, d: 0.25, t: 0.00 },
      { f: 369.99, d: 0.25, t: 0.25 },
      { f: 349.23, d: 0.25, t: 0.50 },
      { f: 329.63, d: 0.60, t: 0.75 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, n.d, 'triangle', n.t, 0.8);
    });
  }

  // --- Background Music Sequencer ---

  public stopBgm() {
    if (this.bgmInterval !== null) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public playBgm(track: 'overworld' | 'battle' | 'boss') {
    this.currentBgmTrack = track;
    this.stopBgm();

    if (this.bgmMuted || this.isMuted) return;
    this.initCtx();

    if (track === 'overworld') {
      // 8-measure gentle Alefgard melody
      const melody = [
        { f: 261.63, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.3 }, { f: 329.63, d: 0.2 },
        { f: 349.23, d: 0.2 }, { f: 440.00, d: 0.2 }, { f: 392.00, d: 0.4 }, { f: 0, d: 0.1 },
        { f: 293.66, d: 0.2 }, { f: 349.23, d: 0.2 }, { f: 440.00, d: 0.3 }, { f: 349.23, d: 0.2 },
        { f: 329.63, d: 0.2 }, { f: 293.66, d: 0.2 }, { f: 261.63, d: 0.4 }, { f: 0, d: 0.1 }
      ];
      let step = 0;
      const tick = () => {
        if (this.bgmMuted || this.isMuted) return;
        const note = melody[step];
        if (note.f > 0) {
          this.playTone(note.f, note.d, 'triangle', 0, 0.3);
          // add gentle bass
          this.playTone(note.f / 2, note.d * 0.8, 'sine', 0, 0.25);
        }
        step = (step + 1) % melody.length;
      };
      this.bgmInterval = window.setInterval(tick, 300);
      tick();
    } else if (track === 'battle') {
      // Fast paced tense battle riff
      const riff = [
        { f: 220, d: 0.1 }, { f: 220, d: 0.1 }, { f: 330, d: 0.12 }, { f: 220, d: 0.1 },
        { f: 293.66, d: 0.12 }, { f: 277.18, d: 0.12 }, { f: 246.94, d: 0.12 }, { f: 220, d: 0.12 }
      ];
      let step = 0;
      const tick = () => {
        if (this.bgmMuted || this.isMuted) return;
        const note = riff[step];
        this.playTone(note.f, note.d, 'sawtooth', 0, 0.25);
        if (step % 2 === 0) {
          this.playTone(note.f / 2, 0.1, 'square', 0, 0.3);
        }
        step = (step + 1) % riff.length;
      };
      this.bgmInterval = window.setInterval(tick, 180);
      tick();
    } else if (track === 'boss') {
      // Ominous deep boss march
      const bossNotes = [
        { f: 130.81, d: 0.18 }, { f: 123.47, d: 0.18 }, { f: 116.54, d: 0.22 }, { f: 110.00, d: 0.3 },
        { f: 146.83, d: 0.18 }, { f: 138.59, d: 0.18 }, { f: 130.81, d: 0.22 }, { f: 123.47, d: 0.3 }
      ];
      let step = 0;
      const tick = () => {
        if (this.bgmMuted || this.isMuted) return;
        const note = bossNotes[step];
        this.playTone(note.f, note.d, 'sawtooth', 0, 0.4);
        this.playTone(note.f * 2, note.d * 0.7, 'square', 0, 0.2);
        step = (step + 1) % bossNotes.length;
      };
      this.bgmInterval = window.setInterval(tick, 220);
      tick();
    }
  }
}

export const soundEngine = new SoundEngine();
