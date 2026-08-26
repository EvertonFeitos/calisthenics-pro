class HapticService {
  private enabled = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  }

  public vibrate(pattern: number | number[]): boolean {
    if (!this.enabled || !this.isSupported()) {
      return false;
    }

    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  public cancel(): void {
    if (!this.isSupported()) {
      return;
    }

    try {
      navigator.vibrate(0);
    } catch {
      // Ignore unsupported cancellation failures on mobile webviews.
    }
  }
}

export const hapticService = new HapticService();
