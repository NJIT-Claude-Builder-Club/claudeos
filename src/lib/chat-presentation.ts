export function getTimeGreeting(hour: number): string {
  const period = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : 'evening';
  return `Good ${period}, Highlander!`;
}

interface TextSmootherOptions {
  reducedMotion?: boolean;
  schedule?: (callback: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
}

// Pace provider bursts across animation frames, speeding up when text queues up.
export function createTextSmoother(onText: (text: string) => void, options: TextSmootherOptions = {}) {
  const schedule = options.schedule ?? requestAnimationFrame;
  const cancelFrame = options.cancelFrame ?? cancelAnimationFrame;
  let pending: string[] = [];
  let displayed = '';
  let frame: number | null = null;
  let previousTime: number | null = null;
  let credit = 0;
  let cancelled = false;
  let waiters: Array<() => void> = [];

  function settled() {
    const callbacks = waiters;
    waiters = [];
    callbacks.forEach((resolve) => resolve());
  }

  function tick(time: number) {
    frame = null;
    if (cancelled) return;
    const elapsed = previousTime === null ? 16 : Math.min(64, Math.max(0, time - previousTime));
    previousTime = time;
    credit += elapsed * Math.max(75, pending.length / 0.18) / 1000;
    const count = Math.min(pending.length, Math.floor(credit));
    if (count > 0) {
      displayed += pending.splice(0, count).join('');
      credit -= count;
      onText(displayed);
    }
    if (pending.length) {
      frame = schedule(tick);
    } else {
      previousTime = null;
      credit = 0;
      settled();
    }
  }

  return {
    append(text: string) {
      if (cancelled || !text) return;
      if (options.reducedMotion) {
        displayed += text;
        onText(displayed);
        return;
      }
      pending.push(...Array.from(text));
      if (frame === null) frame = schedule(tick);
    },
    finish(): Promise<void> {
      return pending.length && !cancelled ? new Promise((resolve) => waiters.push(resolve)) : Promise.resolve();
    },
    cancel() {
      cancelled = true;
      if (frame !== null) cancelFrame(frame);
      frame = null;
      pending = [];
      settled();
    },
  };
}
