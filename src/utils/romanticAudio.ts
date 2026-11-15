/**
 * Romantic Ambient Audio Synthesizer (Web Audio API)
 * Zero external audio file dependencies. Synthesizes a soothing, royal harp & chime
 * harmonic progression based on Pachelbel's romantic cadence with gentle reverberation.
 */

class RomanticAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;

  // Romantic chord frequencies (Canon-inspired, D Major romantic inversion: D, A, Bm, F#m, G, D, G, A)
  private readonly chordNotes: number[][] = [
    [146.83, 220.0, 293.66, 369.99, 440.0],   // D Major
    [110.0, 164.81, 220.0, 277.18, 329.63],   // A Major
    [123.47, 185.0, 246.94, 293.66, 369.99],  // B minor
    [92.5, 146.83, 185.0, 220.0, 293.66],     // F# minor
    [98.0, 146.83, 196.0, 246.94, 293.66],    // G Major
    [146.83, 220.0, 293.66, 369.99, 440.0],   // D Major
    [98.0, 146.83, 196.0, 246.94, 329.63],    // G Major
    [110.0, 164.81, 220.0, 277.18, 329.63],   // A Major
  ];

  private chordIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single soft harp pluck
  private pluckNote(freq: number, delaySec: number) {
    if (!this.ctx || !this.gainNode) return;
    const t = this.ctx.currentTime + delaySec;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm harp tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 2.8);

    // Exponential pluck envelope
    noteGain.gain.setValueAtTime(0.0001, t);
    noteGain.gain.linearRampToValueAtTime(0.22, t + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(t);
    osc.stop(t + 3.3);
  }

  // Play current chord arpeggio
  private playChordCycle() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chordNotes[this.chordIndex];
    // Gentle harp strum delays
    chord.forEach((freq, idx) => {
      this.pluckNote(freq, idx * 0.18);
    });

    // High shimmer octave note
    const shimmerFreq = chord[2] * 2;
    this.pluckNote(shimmerFreq, 0.72);

    this.chordIndex = (this.chordIndex + 1) % this.chordNotes.length;

    // Schedule next romantic chord after 3.2 seconds
    this.timerId = window.setTimeout(() => {
      this.playChordCycle();
    }, 3200);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.initContext();
    this.isPlaying = true;
    this.playChordCycle();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticAudioPlayer();
