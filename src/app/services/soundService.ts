class SoundService {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private listenersInstalled = false;

  constructor() {
    this.installLifecycleListeners();
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.ctx?.state === 'running') {
      void this.ctx.suspend().catch(() => undefined);
      return;
    }
    if (enabled) {
      void this.resumeIfNeeded();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return !!(window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  }

  public async unlock(): Promise<boolean> {
    if (!this.enabled) {
      return false;
    }

    const ctx = this.ensureContext();
    if (!ctx) {
      return false;
    }

    try {
      if (ctx.state !== 'running') {
        await ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.01);
    } catch {
      return false;
    }

    return this.isContextRunning(ctx);
  }

  private ensureContext(): AudioContext | null {
    if (!this.enabled || !this.isSupported()) {
      return null;
    }

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    return this.ctx;
  }

  private getContext(): AudioContext | null {
    const ctx = this.ensureContext();
    if (!ctx) {
      return null;
    }

    if (ctx.state !== 'running') {
      void this.resumeIfNeeded();
      return null;
    }

    return ctx;
  }

  private async resumeIfNeeded(): Promise<boolean> {
    if (!this.enabled) {
      return false;
    }

    const ctx = this.ensureContext();
    if (!ctx) {
      return false;
    }

    if (ctx.state === 'running') {
      return true;
    }

    try {
      await ctx.resume();
    } catch {
      return false;
    }

    return this.isContextRunning(ctx);
  }

  private isContextRunning(ctx: AudioContext): boolean {
    return ctx.state === 'running';
  }

  private installLifecycleListeners(): void {
    if (this.listenersInstalled || typeof window === 'undefined') {
      return;
    }

    const tryUnlock = () => {
      void this.unlock();
    };

    window.addEventListener('pointerdown', tryUnlock, { once: true, passive: true });
    window.addEventListener('touchend', tryUnlock, { once: true, passive: true });
    window.addEventListener('keydown', tryUnlock, { once: true });
    window.addEventListener('pageshow', () => {
      void this.resumeIfNeeded();
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          void this.resumeIfNeeded();
        }
      });
    }

    this.listenersInstalled = true;
  }

  // Short warning beep (e.g. 3, 2, 1 countdown)
  public playCountdownTick(pitch = 600) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  // Rest finish alert (cheerful dual tone)
  public playRestFinished() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.15); // A5
      gain2.gain.setValueAtTime(0.18, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.4);
    } catch (e) {}
  }

  // Set completed sound (satisfying subtle chime)
  public playSetComplete() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25]; // C5, E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  // Workout Victory Fanfare
  public playWorkoutComplete() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.16, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch (e) {}
  }
}

export const soundService = new SoundService();
