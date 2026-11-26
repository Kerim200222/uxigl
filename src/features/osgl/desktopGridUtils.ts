import {
  fromFolderSlotKey,
  getGroupedAppIdSet,
  toFolderSlotKey,
} from './desktopFoldersAndDock';
import type { DesktopFolder, OSWorkspaceApp } from './types';

export type GridCellOccupant =
  | { kind: 'app'; app: OSWorkspaceApp; slotKey: string }
  | { kind: 'folder'; folder: DesktopFolder; slotKey: string };

export function buildDesktopGridOccupants(params: {
  apps: OSWorkspaceApp[];
  folders: DesktopFolder[];
  iconSlots: Record<string, number>;
  totalGridSlots: number;
}): Map<number, GridCellOccupant> {
  const groupedSet = getGroupedAppIdSet(params.folders);
  const map = new Map<number, GridCellOccupant>();
  const overflow: GridCellOccupant[] = [];

  params.apps.forEach((app, idx) => {
    if (groupedSet.has(app.id)) return;
    const explicit = params.iconSlots[app.id];
    const slot = typeof explicit === 'number' ? explicit : idx;
    const occ: GridCellOccupant = { kind: 'app', app, slotKey: app.id };
    if (slot >= 0 && slot < params.totalGridSlots && !map.has(slot)) {
      map.set(slot, occ);
    } else {
      overflow.push(occ);
    }
  });

  params.folders.forEach((folder) => {
    const slotKey = toFolderSlotKey(folder.id);
    const explicitSlot = params.iconSlots[slotKey];
    const occ: GridCellOccupant = { kind: 'folder', folder, slotKey };
    if (
      typeof explicitSlot === 'number' &&
      explicitSlot >= 0 &&
      explicitSlot < params.totalGridSlots &&
      !map.has(explicitSlot)
    ) {
      map.set(explicitSlot, occ);
    } else {
      overflow.push(occ);
    }
  });

  let freeCursor = 0;
  overflow.forEach((occ) => {
    while (map.has(freeCursor) && freeCursor < params.totalGridSlots) freeCursor += 1;
    if (freeCursor < params.totalGridSlots) map.set(freeCursor, occ);
  });
  return map;
}

export function buildResetDesktopSlots(
  desktopApps: OSWorkspaceApp[],
  folders: DesktopFolder[] = []
): Record<string, number> {
  const grouped = getGroupedAppIdSet(folders);
  const next: Record<string, number> = {};
  let cursor = 0;
  desktopApps.forEach((app) => {
    if (grouped.has(app.id)) return;
    next[app.id] = cursor;
    cursor += 1;
  });
  folders.forEach((folder) => {
    next[toFolderSlotKey(folder.id)] = cursor;
    cursor += 1;
  });
  return next;
}

function resolveMovingKeysAndDelta(params: {
  slotByKey: Map<string, number>;
  draggedSlotKey: string;
  targetSlot: number;
  selectedAppIds: string[];
  rowsPerColumn: number;
  colsCount: number;
}): { movingKeys: string[]; destByKey: Map<string, number> } | null {
  const { slotByKey, draggedSlotKey, targetSlot, selectedAppIds, rowsPerColumn, colsCount } = params;
  const anchorSlot = slotByKey.get(draggedSlotKey);
  if (anchorSlot === undefined) return null;

  const movingKeys =
    selectedAppIds.length > 1 && selectedAppIds.includes(draggedSlotKey)
      ? selectedAppIds.filter((id) => slotByKey.has(id))
      : [draggedSlotKey];

  if (movingKeys.length <= 1) {
    if (anchorSlot === targetSlot) return null;
    return { movingKeys: [draggedSlotKey], destByKey: new Map([[draggedSlotKey, targetSlot]]) };
  }

  const anchorCol = Math.floor(anchorSlot / rowsPerColumn);
  const anchorRow = anchorSlot % rowsPerColumn;
  const targetCol = Math.floor(targetSlot / rowsPerColumn);
  const targetRow = targetSlot % rowsPerColumn;

  const coords = movingKeys.map((key) => {
    const s = slotByKey.get(key)!;
    return { key, col: Math.floor(s / rowsPerColumn), row: s % rowsPerColumn };
  });

  const minCol = Math.min(...coords.map((c) => c.col));
  const maxCol = Math.max(...coords.map((c) => c.col));
  const minRow = Math.min(...coords.map((c) => c.row));
  const maxRow = Math.max(...coords.map((c) => c.row));

  const dCol = Math.max(-minCol, Math.min(colsCount - 1 - maxCol, targetCol - anchorCol));
  const dRow = Math.max(-minRow, Math.min(rowsPerColumn - 1 - maxRow, targetRow - anchorRow));
  if (dCol === 0 && dRow === 0) return null;

  const destByKey = new Map<string, number>();
  coords.forEach(({ key, col, row }) => {
    destByKey.set(key, (col + dCol) * rowsPerColumn + (row + dRow));
  });
  return { movingKeys, destByKey };
}

export function computePreviewDropSlots(params: {
  occupantMap: Map<number, GridCellOccupant>;
  draggedSlotKey: string | null;
  targetSlot: number | null;
  selectedAppIds: string[];
  rowsPerColumn: number;
  colsCount: number;
}): Set<number> {
  const result = new Set<number>();
  if (!params.draggedSlotKey || params.targetSlot === null) return result;

  const targetOcc = params.occupantMap.get(params.targetSlot);
  if (!fromFolderSlotKey(params.draggedSlotKey) && targetOcc?.kind === 'folder') {
    result.add(params.targetSlot);
    return result;
  }

  const slotByKey = new Map<string, number>();
  params.occupantMap.forEach((occ, slot) => slotByKey.set(occ.slotKey, slot));

  const resolved = resolveMovingKeysAndDelta({
    slotByKey,
    draggedSlotKey: params.draggedSlotKey,
    targetSlot: params.targetSlot,
    selectedAppIds: params.selectedAppIds,
    rowsPerColumn: params.rowsPerColumn,
    colsCount: params.colsCount,
  });
  if (!resolved) {
    result.add(params.targetSlot);
    return result;
  }
  resolved.destByKey.forEach((slot) => result.add(slot));
  return result;
}

export function reorderDesktopGridOnDrop(params: {
  apps: OSWorkspaceApp[];
  folders: DesktopFolder[];
  prevSlots: Record<string, number>;
  draggedSlotKey: string;
  targetSlot: number;
  selectedAppIds: string[];
  rowsPerColumn: number;
  colsCount: number;
}): Record<string, number> {
  const totalGridSlots = Math.max(
    params.apps.length + params.folders.length,
    params.rowsPerColumn * params.colsCount
  );
  const occupantMap = buildDesktopGridOccupants({
    apps: params.apps,
    folders: params.folders,
    iconSlots: params.prevSlots,
    totalGridSlots,
  });

  const slotByKey = new Map<string, number>();
  const keyBySlot = new Map<number, string>();
  occupantMap.forEach((occ, slot) => {
    slotByKey.set(occ.slotKey, slot);
    keyBySlot.set(slot, occ.slotKey);
  });

  const resolved = resolveMovingKeysAndDelta({
    slotByKey,
    draggedSlotKey: params.draggedSlotKey,
    targetSlot: params.targetSlot,
    selectedAppIds: params.selectedAppIds,
    rowsPerColumn: params.rowsPerColumn,
    colsCount: params.colsCount,
  });
  if (!resolved) return params.prevSlots;

  const { movingKeys, destByKey } = resolved;

  // Tekil simge / klasör taşıma: boş hücreye doğrudan yerleşir; dolu hücrede önce aynı sütun içi boşluğa kaydırır, sütun doluysa iki simgeyi takas (swap) eder (diğer sütunlar asla dağılmaz!)
  if (movingKeys.length === 1) {
    const key = movingKeys[0];
    const sourceSlot = slotByKey.get(key)!;
    const destSlot = destByKey.get(key)!;
    const occupantAtDest = keyBySlot.get(destSlot);

    if (!occupantAtDest) {
      slotByKey.set(key, destSlot);
    } else {
      const colStart = Math.floor(destSlot / params.rowsPerColumn) * params.rowsPerColumn;
      const colEnd = colStart + params.rowsPerColumn - 1;
      keyBySlot.delete(sourceSlot);

      let freeInCol = -1;
      for (let s = destSlot + 1; s <= colEnd; s += 1) {
        if (!keyBySlot.has(s)) { freeInCol = s; break; }
      }
      if (freeInCol >= 0) {
        for (let s = freeInCol; s > destSlot; s -= 1) {
          const k = keyBySlot.get(s - 1)!;
          slotByKey.set(k, s);
        }
        slotByKey.set(key, destSlot);
      } else {
        slotByKey.set(occupantAtDest, sourceSlot);
        slotByKey.set(key, destSlot);
      }
    }
  } else {
    // Çoklu seçim (2B blok) taşıma: tüm seçili simgeler (dCol, dRow) kadar birlikte kayar; hedefteki diğer simgeler boşalan kaynak hücrelere yerleşir
    const movingSet = new Set(movingKeys);
    const destValues = new Set(destByKey.values());
    const vacatedSlots = movingKeys
      .map((k) => slotByKey.get(k)!)
      .filter((s) => !destValues.has(s))
      .sort((a, b) => a - b);

    const displacedKeys: string[] = [];
    Array.from(destValues)
      .sort((a, b) => a - b)
      .forEach((dSlot) => {
        const occKey = keyBySlot.get(dSlot);
        if (occKey && !movingSet.has(occKey)) displacedKeys.push(occKey);
      });

    destByKey.forEach((dSlot, k) => slotByKey.set(k, dSlot));
    displacedKeys.forEach((dKey, i) => {
      const fallbackSlot = vacatedSlots[i];
      if (typeof fallbackSlot === 'number') slotByKey.set(dKey, fallbackSlot);
    });
  }

  const nextRecord: Record<string, number> = {};
  slotByKey.forEach((slot, key) => {
    nextRecord[key] = slot;
  });
  return nextRecord;
}

export { reorderDesktopGridOnDrop as reorderIconSlotsOnDrop };

export function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}
