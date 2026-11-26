import {
  FOLDER_SLOT_PREFIX,
  OS_THEME_STUDIO_APP_ID,
  type DesktopFolder,
  type OSWorkspaceApp,
} from './types';

export const FOLDER_COLOR_PRESETS = [
  '#3b82f6',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
];

export function toFolderSlotKey(folderId: string): string {
  return `${FOLDER_SLOT_PREFIX}${folderId}`;
}

export function fromFolderSlotKey(slotKey: string): string | null {
  return slotKey.startsWith(FOLDER_SLOT_PREFIX)
    ? slotKey.slice(FOLDER_SLOT_PREFIX.length)
    : null;
}

export function sanitizePersistedFolders(
  folders: DesktopFolder[] | undefined,
  allowedAppIds: Set<string>
): DesktopFolder[] {
  if (!Array.isArray(folders) || folders.length === 0) return [];
  const claimedApps = new Set<string>();
  const cleaned: DesktopFolder[] = [];

  for (const raw of folders) {
    if (!raw || typeof raw.id !== 'string' || !raw.id.trim()) continue;
    const uniqueApps: string[] = [];
    for (const appId of Array.isArray(raw.appIds) ? raw.appIds : []) {
      if (
        appId &&
        appId !== OS_THEME_STUDIO_APP_ID &&
        allowedAppIds.has(appId) &&
        !claimedApps.has(appId)
      ) {
        claimedApps.add(appId);
        uniqueApps.push(appId);
      }
    }
    cleaned.push({
      id: raw.id,
      name: (raw.name || 'Yeni Klasör').trim() || 'Yeni Klasör',
      appIds: uniqueApps,
      color: raw.color || FOLDER_COLOR_PRESETS[cleaned.length % FOLDER_COLOR_PRESETS.length],
    });
  }
  return cleaned;
}

export function getGroupedAppIdSet(folders: DesktopFolder[]): Set<string> {
  const set = new Set<string>();
  folders.forEach((f) => f.appIds.forEach((id) => set.add(id)));
  return set;
}

function findNextFreeDesktopSlot(
  iconSlots: Record<string, number>,
  folders: DesktopFolder[],
  preferredStart = 0
): number {
  const groupedApps = getGroupedAppIdSet(folders);
  const validFolderKeys = new Set(folders.map((f) => toFolderSlotKey(f.id)));
  const occupied = new Set<number>();

  for (const [key, slot] of Object.entries(iconSlots)) {
    if (key.startsWith(FOLDER_SLOT_PREFIX)) {
      if (validFolderKeys.has(key)) occupied.add(slot);
    } else if (!groupedApps.has(key) && key !== OS_THEME_STUDIO_APP_ID) {
      occupied.add(slot);
    }
  }

  let cursor = Math.max(0, preferredStart);
  while (occupied.has(cursor)) cursor += 1;
  return cursor;
}

function buildUniqueFolderName(existing: DesktopFolder[], requested?: string): string {
  const base = (requested || 'Yeni Klasör').trim() || 'Yeni Klasör';
  const taken = new Set(existing.map((f) => f.name.toLocaleLowerCase('tr-TR')));
  if (!taken.has(base.toLocaleLowerCase('tr-TR'))) return base;
  let n = 2;
  while (taken.has(`${base} ${n}`.toLocaleLowerCase('tr-TR'))) n += 1;
  return `${base} ${n}`;
}

export function createDesktopFolderState(params: {
  prevFolders: DesktopFolder[];
  prevSlots: Record<string, number>;
  name?: string;
  initialAppIds?: string[];
  targetSlot?: number;
}): { folders: DesktopFolder[]; iconSlots: Record<string, number>; created: DesktopFolder } {
  const cleanInitial = Array.from(
    new Set((params.initialAppIds ?? []).filter((id) => id && id !== OS_THEME_STUDIO_APP_ID))
  );
  const initialSet = new Set(cleanInitial);

  const strippedFolders = params.prevFolders.map((f) => ({
    ...f,
    appIds: f.appIds.filter((id) => !initialSet.has(id)),
  }));

  const created: DesktopFolder = {
    id: `fld-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: buildUniqueFolderName(strippedFolders, params.name),
    appIds: cleanInitial,
    color: FOLDER_COLOR_PRESETS[strippedFolders.length % FOLDER_COLOR_PRESETS.length],
  };

  const nextFolders = [...strippedFolders, created];
  const firstMemberSlot =
    cleanInitial.length > 0 ? params.prevSlots[cleanInitial[0]] : undefined;
  const resolvedSlot =
    params.targetSlot ??
    (typeof firstMemberSlot === 'number'
      ? firstMemberSlot
      : findNextFreeDesktopSlot(params.prevSlots, strippedFolders, 0));

  const nextSlots: Record<string, number> = {
    ...params.prevSlots,
    [toFolderSlotKey(created.id)]: resolvedSlot,
  };
  cleanInitial.forEach((id) => {
    delete nextSlots[id];
  });

  return { folders: nextFolders, iconSlots: nextSlots, created };
}

export function renameDesktopFolderState(
  prevFolders: DesktopFolder[],
  folderId: string,
  nextName: string
): DesktopFolder[] {
  const trimmed = nextName.trim();
  if (!trimmed) return prevFolders;
  return prevFolders.map((f) => (f.id === folderId ? { ...f, name: trimmed } : f));
}

export function recolorDesktopFolderState(
  prevFolders: DesktopFolder[],
  folderId: string,
  color: string
): DesktopFolder[] {
  return prevFolders.map((f) => (f.id === folderId ? { ...f, color } : f));
}

export function moveAppsIntoFolderState(
  prevFolders: DesktopFolder[],
  folderId: string,
  appIds: string[]
): DesktopFolder[] {
  const incoming = appIds.filter((id) => id && id !== OS_THEME_STUDIO_APP_ID);
  if (incoming.length === 0) return prevFolders;
  const incomingSet = new Set(incoming);

  return prevFolders.map((f) => {
    if (f.id === folderId) {
      const merged = Array.from(new Set([...f.appIds, ...incoming]));
      return { ...f, appIds: merged };
    }
    return { ...f, appIds: f.appIds.filter((id) => !incomingSet.has(id)) };
  });
}

export function setFolderAppsState(
  prevFolders: DesktopFolder[],
  folderId: string,
  nextAppIds: string[]
): DesktopFolder[] {
  const clean = Array.from(
    new Set(nextAppIds.filter((id) => id && id !== OS_THEME_STUDIO_APP_ID))
  );
  const cleanSet = new Set(clean);
  return prevFolders.map((f) => {
    if (f.id === folderId) return { ...f, appIds: clean };
    return { ...f, appIds: f.appIds.filter((id) => !cleanSet.has(id)) };
  });
}

export function removeAppFromFolderState(params: {
  prevFolders: DesktopFolder[];
  prevSlots: Record<string, number>;
  folderId: string;
  appId: string;
}): { folders: DesktopFolder[]; iconSlots: Record<string, number> } {
  const folderSlot = params.prevSlots[toFolderSlotKey(params.folderId)] ?? 0;
  const nextFolders = params.prevFolders.map((f) =>
    f.id === params.folderId
      ? { ...f, appIds: f.appIds.filter((id) => id !== params.appId) }
      : f
  );
  const freeSlot = findNextFreeDesktopSlot(params.prevSlots, nextFolders, folderSlot + 1);
  return {
    folders: nextFolders,
    iconSlots: { ...params.prevSlots, [params.appId]: freeSlot },
  };
}

export function dissolveDesktopFolderState(params: {
  prevFolders: DesktopFolder[];
  prevSlots: Record<string, number>;
  folderId: string;
}): { folders: DesktopFolder[]; iconSlots: Record<string, number> } {
  const target = params.prevFolders.find((f) => f.id === params.folderId);
  const nextFolders = params.prevFolders.filter((f) => f.id !== params.folderId);
  const nextSlots: Record<string, number> = { ...params.prevSlots };
  const folderKey = toFolderSlotKey(params.folderId);
  const startSlot = nextSlots[folderKey] ?? 0;
  delete nextSlots[folderKey];

  if (target) {
    target.appIds.forEach((appId, idx) => {
      const slot = findNextFreeDesktopSlot(nextSlots, nextFolders, startSlot + idx);
      nextSlots[appId] = slot;
    });
  }
  return { folders: nextFolders, iconSlots: nextSlots };
}

export function resolveEffectiveDockAppIds(
  desktopApps: OSWorkspaceApp[],
  defaultDockAppIds?: string[],
  pinnedDockAppIds?: string[]
): string[] {
  const allowed = new Set(desktopApps.map((a) => a.id));
  const source = Array.isArray(pinnedDockAppIds)
    ? pinnedDockAppIds
    : defaultDockAppIds && defaultDockAppIds.length > 0
      ? defaultDockAppIds
      : desktopApps.slice(0, 7).map((a) => a.id);

  return Array.from(new Set(source)).filter((id) => allowed.has(id));
}

export function toggleDockPinnedApp(currentIds: string[], appId: string): string[] {
  if (!appId) return currentIds;
  return currentIds.includes(appId)
    ? currentIds.filter((id) => id !== appId)
    : [...currentIds, appId];
}

export function reorderDockPinnedApps(
  currentIds: string[],
  draggedAppId: string,
  targetAppId: string
): string[] {
  if (!draggedAppId || draggedAppId === targetAppId) return currentIds;
  const fromIdx = currentIds.indexOf(draggedAppId);
  const toIdx = currentIds.indexOf(targetAppId);
  if (fromIdx < 0) {
    const without = currentIds.filter((id) => id !== draggedAppId);
    if (toIdx < 0) return [...without, draggedAppId];
    const next = [...without];
    next.splice(toIdx, 0, draggedAppId);
    return next;
  }
  if (toIdx < 0 || fromIdx === toIdx) return currentIds;
  const next = [...currentIds];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}
