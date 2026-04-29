type EventName =
  | 'start_game'
  | 'chapter_enter'
  | 'chapter_complete'
  | 'resume_open'
  | 'contact_click'
  | 'game_complete';

export function trackEvent(name: EventName, data?: Record<string, string>) {
  try {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
        'event',
        name,
        data,
      );
    }
  } catch {
    // analytics should never break the app
  }
}
