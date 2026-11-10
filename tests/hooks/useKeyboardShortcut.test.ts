// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useKeyboardShortcut } from '../../src/hooks/useKeyboardShortcut';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderHook<T>(hookFn: () => T) {
  let result = {} as { current: T };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    result.current = hookFn();
    return null;
  }

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    result,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
  };
}

describe('useKeyboardShortcut', () => {
  it('triggers callback when target key is pressed', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut('Escape', callback));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('matches key case-insensitively', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut('k', callback));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'K' }));
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('does not trigger when a different key is pressed', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut('Escape', callback));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(callback).not.toHaveBeenCalled();

    unmount();
  });

  it('requires metaKey or ctrlKey when metaOrCtrl is true', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcut('k', callback, { metaOrCtrl: true })
    );

    // Pressing 'k' without modifier: should NOT trigger
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(callback).not.toHaveBeenCalled();

    // Pressing with metaKey (Mac): SHOULD trigger and call preventDefault
    const metaEvent = new KeyboardEvent('keydown', { key: 'k', metaKey: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(metaEvent, 'preventDefault');
    window.dispatchEvent(metaEvent);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(preventDefaultSpy).toHaveBeenCalled();

    // Pressing with ctrlKey (Windows/Linux): SHOULD trigger
    const ctrlEvent = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    window.dispatchEvent(ctrlEvent);
    expect(callback).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('does not trigger when enabled is false', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcut('k', callback, { enabled: false })
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(callback).not.toHaveBeenCalled();

    unmount();
  });

  it('cleans up event listener upon unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut('k', callback));

    unmount();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(callback).not.toHaveBeenCalled();
  });
});
