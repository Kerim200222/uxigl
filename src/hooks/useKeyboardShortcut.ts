import { useEffect } from 'react';

/**
 * [SRP] Single-responsibility hook for listening to global keyboard shortcuts
 * (e.g., Cmd/Ctrl + K for Spotlight Command Palette, Escape for modals).
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: { metaOrCtrl?: boolean; enabled?: boolean } = {}
): void {
  const { metaOrCtrl = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.key || !key) return;
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      if (!matchesKey) return;

      if (metaOrCtrl) {
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          callback(event);
        }
      } else {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, metaOrCtrl, enabled]);
}
