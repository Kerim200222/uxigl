// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useCopyToClipboard } from '../../src/hooks/useCopyToClipboard';

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

describe('useCopyToClipboard', () => {
  let originalClipboard: any;

  beforeEach(() => {
    vi.useFakeTimers();
    originalClipboard = navigator.clipboard;
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  it('initializes with copied=false and copiedText=null', () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
    unmount();
  });

  it('copies text via navigator.clipboard.writeText and updates state', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const { result, unmount } = renderHook(() => useCopyToClipboard(2000));

    let success: boolean = false;
    await act(async () => {
      success = await result.current.copy('npm install truncgil-uxigl');
    });

    expect(success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('npm install truncgil-uxigl');
    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe('npm install truncgil-uxigl');

    // Fast-forward 2000ms: state should automatically reset
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
    unmount();
  });

  it('falls back to document.execCommand when navigator.clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const execCommandMock = vi.fn().mockReturnValue(true);
    (document as any).execCommand = execCommandMock;

    const { result, unmount } = renderHook(() => useCopyToClipboard(1500));

    let success: boolean = false;
    await act(async () => {
      success = await result.current.copy('fallback-text');
    });

    expect(success).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe('fallback-text');

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.copied).toBe(false);
    unmount();
  });

  it('handles writeText errors gracefully and returns false', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const { result, unmount } = renderHook(() => useCopyToClipboard());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.copy('failed-text');
    });

    expect(success).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
    unmount();
  });
});
