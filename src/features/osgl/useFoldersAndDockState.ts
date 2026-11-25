import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createDesktopFolderState,
  dissolveDesktopFolderState,
  moveAppsIntoFolderState,
  recolorDesktopFolderState,
  removeAppFromFolderState,
  renameDesktopFolderState,
  reorderDockPinnedApps,
  resolveEffectiveDockAppIds,
  sanitizePersistedFolders,
  setFolderAppsState,
  toggleDockPinnedApp,
} from './desktopFoldersAndDock';
import {
  loadOSGLState,
  type DesktopFolder,
  type OSWorkspaceApp,
  type PersistedOSGLState,
} from './types';

export interface ItemContextMenuState {
  x: number;
  y: number;
  kind: 'app' | 'folder' | 'dock-app';
  targetId: string;
}

export function useFoldersAndDockState({
  desktopApps,
  defaultDockAppIds,
  defaultFolders,
  savedState,
  scopeKey,
  iconSlots,
  setIconSlots,
  notify,
}: {
  desktopApps: OSWorkspaceApp[];
  defaultDockAppIds?: string[];
  defaultFolders?: DesktopFolder[];
  savedState: PersistedOSGLState | null;
  scopeKey?: string;
  iconSlots: Record<string, number>;
  setIconSlots: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  notify: (input: {
    title: string;
    description: string;
    tone: 'info' | 'success' | 'warning' | 'danger';
  }) => void;
}) {
  const allowedSet = useMemo(() => new Set(desktopApps.map((a) => a.id)), [desktopApps]);

  const [folders, setFolders] = useState<DesktopFolder[]>(() =>
    savedState?.folders?.length
      ? sanitizePersistedFolders(savedState.folders, allowedSet)
      : sanitizePersistedFolders(defaultFolders, allowedSet)
  );
  const seededDefaultFoldersRef = useRef(Boolean(savedState?.folders?.length));
  useEffect(() => {
    if (seededDefaultFoldersRef.current) return;
    if (folders.length > 0 || !defaultFolders?.length || allowedSet.size === 0) return;
    const sanitized = sanitizePersistedFolders(defaultFolders, allowedSet);
    if (sanitized.length > 0) {
      seededDefaultFoldersRef.current = true;
      setFolders(sanitized);
    }
  }, [defaultFolders, allowedSet, folders.length]);
  const [pinnedDockAppIds, setPinnedDockAppIds] = useState<string[] | undefined>(
    () => savedState?.pinnedDockAppIds
  );
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [itemContextMenu, setItemContextMenu] = useState<ItemContextMenuState | null>(null);
  const [dockCustomizerOpen, setDockCustomizerOpen] = useState(false);

  // Senkron referans: StrictMode altında iç içe setState çağrısını önler ve tekil klasör üretir
  const latestRef = useRef({ folders, iconSlots });
  latestRef.current = { folders, iconSlots };

  const prevScopeRef = useRef(scopeKey);
  useEffect(() => {
    if (prevScopeRef.current === scopeKey) {
      setFolders((prev) => sanitizePersistedFolders(prev, allowedSet));
      return;
    }
    prevScopeRef.current = scopeKey;
    const nextSaved = loadOSGLState(scopeKey);
    setFolders(sanitizePersistedFolders(nextSaved?.folders, allowedSet));
    setPinnedDockAppIds(nextSaved?.pinnedDockAppIds);
    setOpenFolderId(null);
    setRenamingFolderId(null);
    setItemContextMenu(null);
  }, [scopeKey, allowedSet]);

  const effectiveDockIds = useMemo(
    () => resolveEffectiveDockAppIds(desktopApps, defaultDockAppIds, pinnedDockAppIds),
    [desktopApps, defaultDockAppIds, pinnedDockAppIds]
  );

  const effectiveDockApps = useMemo(
    () =>
      effectiveDockIds
        .map((id) => desktopApps.find((a) => a.id === id))
        .filter((a): a is OSWorkspaceApp => Boolean(a)),
    [effectiveDockIds, desktopApps]
  );

  const createFolder = (opts?: {
    name?: string;
    initialAppIds?: string[];
    targetSlot?: number;
    startRename?: boolean;
  }) => {
    const res = createDesktopFolderState({
      prevFolders: latestRef.current.folders,
      prevSlots: latestRef.current.iconSlots,
      name: opts?.name,
      initialAppIds: opts?.initialAppIds,
      targetSlot: opts?.targetSlot,
    });
    latestRef.current = { folders: res.folders, iconSlots: res.iconSlots };
    setFolders(res.folders);
    setIconSlots(res.iconSlots);
    if (opts?.startRename !== false) {
      setRenamingFolderId(res.created.id);
    }
  };

  const renameFolder = (folderId: string, nextName: string) => {
    setFolders((prev) => renameDesktopFolderState(prev, folderId, nextName));
    setRenamingFolderId(null);
  };

  const recolorFolder = (folderId: string, color: string) => {
    setFolders((prev) => recolorDesktopFolderState(prev, folderId, color));
  };

  const moveAppsToFolder = (folderId: string, appIds: string[]) => {
    const nextFolders = moveAppsIntoFolderState(latestRef.current.folders, folderId, appIds);
    const nextSlots = { ...latestRef.current.iconSlots };
    appIds.forEach((id) => delete nextSlots[id]);
    latestRef.current = { folders: nextFolders, iconSlots: nextSlots };
    setFolders(nextFolders);
    setIconSlots(nextSlots);
  };

  const setFolderApps = (folderId: string, nextAppIds: string[]) => {
    const nextFolders = setFolderAppsState(latestRef.current.folders, folderId, nextAppIds);
    const nextSlots = { ...latestRef.current.iconSlots };
    nextAppIds.forEach((id) => delete nextSlots[id]);
    latestRef.current = { folders: nextFolders, iconSlots: nextSlots };
    setFolders(nextFolders);
    setIconSlots(nextSlots);
  };

  const removeAppFromFolder = (folderId: string, appId: string) => {
    const res = removeAppFromFolderState({
      prevFolders: latestRef.current.folders,
      prevSlots: latestRef.current.iconSlots,
      folderId,
      appId,
    });
    latestRef.current = { folders: res.folders, iconSlots: res.iconSlots };
    setFolders(res.folders);
    setIconSlots(res.iconSlots);
  };

  const dissolveFolder = (folderId: string) => {
    const res = dissolveDesktopFolderState({
      prevFolders: latestRef.current.folders,
      prevSlots: latestRef.current.iconSlots,
      folderId,
    });
    latestRef.current = { folders: res.folders, iconSlots: res.iconSlots };
    setFolders(res.folders);
    setIconSlots(res.iconSlots);
    if (openFolderId === folderId) setOpenFolderId(null);
    notify({
      title: 'Klasör Dağıtıldı',
      description: 'Klasördeki modüller masaüstüne geri çıkarıldı.',
      tone: 'info',
    });
  };

  const togglePinToDock = (appId: string) => {
    setPinnedDockAppIds(() => toggleDockPinnedApp(effectiveDockIds, appId));
  };

  const pinAppToDock = (appId: string) => {
    if (!allowedSet.has(appId) || effectiveDockIds.includes(appId)) return;
    setPinnedDockAppIds([...effectiveDockIds, appId]);
  };

  const reorderDock = (draggedAppId: string, targetAppId: string) => {
    if (!allowedSet.has(draggedAppId)) return;
    const seeded = effectiveDockIds.includes(draggedAppId)
      ? effectiveDockIds
      : [...effectiveDockIds, draggedAppId];
    setPinnedDockAppIds(reorderDockPinnedApps(seeded, draggedAppId, targetAppId));
  };

  const resetDockToDefault = () => {
    setPinnedDockAppIds(undefined);
    notify({
      title: 'Dock Varsayılana Döndürüldü',
      description: 'Alt Dock simgeleri rol varsayılanına sıfırlandı.',
      tone: 'info',
    });
  };

  return {
    folders, setFolders, pinnedDockAppIds, effectiveDockIds, effectiveDockApps,
    openFolderId, setOpenFolderId, renamingFolderId, setRenamingFolderId,
    itemContextMenu, setItemContextMenu, dockCustomizerOpen, setDockCustomizerOpen,
    createFolder, renameFolder, recolorFolder, moveAppsToFolder, setFolderApps,
    removeAppFromFolder, dissolveFolder, togglePinToDock, pinAppToDock,
    reorderDock, resetDockToDefault,
  };
}
