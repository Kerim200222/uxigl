import {
  computeDefaultWidgetPositions,
  type DesktopFolder,
  type OSDesktopWidgetDefinition,
  type OSWorkspaceApp,
  type PersistedOSGLState,
  type WidgetPosition,
  type WidgetSize,
} from './types';

/**
 * Reconciles persisted desktop icon slots when the host app or uxiGL adds/removes modules.
 * Preserves existing user slot positions & folder memberships while placing new apps into
 * the first available free slots.
 */
export function reconcileIconSlotsWithNewApps(
  savedSlots: Record<string, number>,
  appList: OSWorkspaceApp[],
  folders: DesktopFolder[] = []
): Record<string, number> {
  const validAppIds = new Set(appList.map((a) => a.id));
  const folderedAppIds = new Set(folders.flatMap((f) => f.appIds));
  const nextSlots: Record<string, number> = {};
  const occupied = new Set<number>();

  for (const [id, slot] of Object.entries(savedSlots)) {
    const isFolder = id.startsWith('folder:');
    if (isFolder || (validAppIds.has(id) && !folderedAppIds.has(id))) {
      nextSlots[id] = slot;
      occupied.add(slot);
    }
  }

  let cursor = 0;
  for (const app of appList) {
    if (folderedAppIds.has(app.id) || nextSlots[app.id] !== undefined) continue;
    while (occupied.has(cursor)) cursor++;
    nextSlots[app.id] = cursor;
    occupied.add(cursor);
    cursor++;
  }

  return nextSlots;
}

/**
 * Merges newly introduced core or host widgets into persisted widget state
 * without overwriting the user's existing positions, sizes, or visibility choices.
 */
export function reconcileWidgetsOnUpgrade(
  widgets: OSDesktopWidgetDefinition[],
  prevEnabled: Record<string, boolean>,
  prevPositions: Record<string, WidgetPosition>,
  prevSizes: Record<string, WidgetSize>,
  viewportWidth: number
): {
  enabledWidgets: Record<string, boolean>;
  widgetPositions: Record<string, WidgetPosition>;
  widgetSizes: Record<string, WidgetSize>;
} {
  const defaults = computeDefaultWidgetPositions(widgets, viewportWidth);
  const enabledWidgets = { ...prevEnabled };
  const widgetPositions = { ...prevPositions };
  const widgetSizes = { ...prevSizes };

  for (const w of widgets) {
    if (enabledWidgets[w.id] === undefined) {
      enabledWidgets[w.id] = w.defaultEnabled !== false;
    }
    if (!widgetPositions[w.id]) {
      widgetPositions[w.id] = defaults[w.id] ?? { x: 20, y: 20 };
    }
    if (!widgetSizes[w.id]) {
      widgetSizes[w.id] = w.defaultSize;
    }
  }

  return { enabledWidgets, widgetPositions, widgetSizes };
}

/**
 * Safely normalizes persisted OSGL state across package upgrades.
 */
export function reconcilePersistedOSGLState(
  saved: PersistedOSGLState | null
): PersistedOSGLState | null {
  if (!saved || typeof saved !== 'object') return null;
  return {
    ...saved,
    folders: Array.isArray(saved.folders) ? saved.folders : [],
    windows: Array.isArray(saved.windows) ? saved.windows : [],
  };
}

