import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sliders,
  X,
} from 'lucide-react';
import type {
  SidebarProps,
  SidebarNavItem,
} from '../../../core/contracts/NavigationContract';
import { RouteService } from '../../../core/services/RouteService';
import { UXILogo } from '../../brand/UXILogo';
import { Avatar, Badge, GoogleIcon } from '../../primitives';

/**
 * ============================================================================
 * uxiGL COMPOSITE — HIERARCHICAL ENTERPRISE SIDEBAR WITH SUB-MENUS
 * ============================================================================
 * Classic UX multi-level navigation tree with expandable sub-menus, tree
 * connector lines, badge counters, and collapsible rail mode — crafted with
 * Apple HIG glass vibrancy & Google Material You tonal active states.
 *
 * SOLID Principles Applied:
 * - [SRP] Manages only navigation tree expansion and selection presentation.
 * - [OCP] Driven entirely by `SidebarNavGroup[]` data contract.
 */

export const Sidebar: React.FC<SidebarProps> = ({
  id,
  className = '',
  style,
  groups,
  activeItemId,
  activeSubItemId,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onSelect,
  onOpenCommandPalette,
  onOpenThemeStudio,
  variant = 'standard',
  accentColor,
  drawerOpen = false,
  onCloseDrawer,
  secondaryGroups,
  brandTitle,
  brandSubtitle,
  brandBadge,
  brandLogo,
  onBrandClick,
}) => {
  const isMiniRail = variant === 'mini-rail' || Boolean(collapsed);
  const isStacked = variant === 'stacked-vertical' && !isMiniRail;
  const isDual = variant === 'dual-column';
  const isDrawer = variant === 'drawer';

  // Floating flyout submenu state in mini-rail mode
  const [flyoutState, setFlyoutState] = useState<{
    item: SidebarNavItem;
    top: number;
    left: number;
  } | null>(null);

  const flyoutCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFlyout = (item: SidebarNavItem, element: HTMLElement) => {
    if (flyoutCloseTimerRef.current) {
      clearTimeout(flyoutCloseTimerRef.current);
      flyoutCloseTimerRef.current = null;
    }
    const rect = element.getBoundingClientRect();
    const flyoutEstimatedHeight = Math.min(
      (item.subItems?.length || 1) * 36 + 64,
      440
    );
    let top = rect.top - 2;
    if (top + flyoutEstimatedHeight > window.innerHeight - 16) {
      top = Math.max(16, window.innerHeight - flyoutEstimatedHeight - 16);
    }
    setFlyoutState({
      item,
      top,
      left: rect.right + 8,
    });
  };

  const scheduleCloseFlyout = () => {
    if (flyoutCloseTimerRef.current) clearTimeout(flyoutCloseTimerRef.current);
    flyoutCloseTimerRef.current = setTimeout(() => {
      setFlyoutState(null);
    }, 180);
  };

  const cancelCloseFlyout = () => {
    if (flyoutCloseTimerRef.current) {
      clearTimeout(flyoutCloseTimerRef.current);
      flyoutCloseTimerRef.current = null;
    }
  };

  // Close flyout on scroll or window resize
  useEffect(() => {
    if (!flyoutState) return;
    const handleClose = () => setFlyoutState(null);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);
    return () => {
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
    };
  }, [flyoutState]);

  useEffect(() => {
    return () => {
      if (flyoutCloseTimerRef.current) {
        clearTimeout(flyoutCloseTimerRef.current);
      }
    };
  }, []);

  // Selected primary group for dual-column mode
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => groups[0]?.id || '');

  // Auto-sync selectedGroupId in dual-column mode to the group containing active item
  useEffect(() => {
    for (const group of groups) {
      if (
        group.items.some(
          (it) =>
            it.id === activeItemId ||
            it.id === activeSubItemId ||
            it.subItems?.some((s) => s.id === activeSubItemId)
        )
      ) {
        setSelectedGroupId(group.id);
        break;
      }
    }
  }, [activeItemId, activeSubItemId, groups]);
  // Keep track of expanded parent menu IDs (default: expand key sections so sub-menus are accessible)
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    const initial = new Set<string>([
      activeItemId,
      'sidebars',
      'forms',
      'elements',
      'docs-guide',
      'dashboard',
      'components-inputs',
      'components-surfaces',
      'components-feedback',
    ]);
    for (const group of groups) {
      for (const item of group.items) {
        if (item.subItems?.some((s) => s.id === activeSubItemId)) {
          initial.add(item.id);
        }
      }
    }
    return Array.from(initial);
  });

  // When active route / sub-item changes, ensure the active parent is expanded
  useEffect(() => {
    const toExpand: string[] = [];
    if (activeItemId) toExpand.push(activeItemId);
    for (const group of groups) {
      for (const item of group.items) {
        if (item.subItems?.some((s) => s.id === activeSubItemId)) {
          toExpand.push(item.id);
        }
      }
    }
    if (toExpand.length > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        let hasNew = false;
        for (const id of toExpand) {
          if (!next.has(id)) {
            next.add(id);
            hasNew = true;
          }
        }
        return hasNew ? Array.from(next) : prev;
      });
    }
  }, [activeItemId, activeSubItemId, groups]);

  const toggleSubMenu = (itemId: string, hasSubItems: boolean, firstSubId?: string) => {
    if (!hasSubItems) {
      onSelect(itemId);
      onCloseMobile();
      return;
    }

    if (isMiniRail) {
      if (firstSubId) {
        onSelect(itemId, firstSubId);
      }
      return;
    }

    setExpandedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((idItem) => idItem !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <>
      {isDrawer && drawerOpen && (
        <div
          className="uxu-sidebar-drawer-backdrop"
          onClick={onCloseDrawer || onCloseMobile}
          role="presentation"
        />
      )}
      {mobileOpen && !isDrawer && (
        <div
          className="uxu-sidebar-backdrop"
          onClick={onCloseMobile}
          role="presentation"
        />
      )}

      {/* --- 1. STACKED VERTICAL VARIANT --- */}
      {isStacked ? (
        <aside
          id={id}
          style={{
            ...style,
            ...(accentColor
              ? ({
                  '--uxu-sidebar-accent': accentColor,
                  '--uxu-sidebar-accent-bg': accentColor + '20',
                  '--uxu-sidebar-accent-border': accentColor + '45',
                } as React.CSSProperties)
              : {}),
          }}
          className={[
            'uxu-sidebar',
            'uxu-sidebar--stacked-vertical',
            mobileOpen ? 'uxu-sidebar--mobile-open' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Dikey Kenar Çubuğu Navigasyonu"
        >
          {/* Header */}
          <div className="uxu-sidebar__header">
            <a
              href="/"
              className="uxu-sidebar__brand"
              title={typeof brandTitle === 'string' ? brandTitle : 'uxiGL'}
              onClick={(e) => {
                if (onBrandClick) {
                  e.preventDefault();
                  onBrandClick();
                  return;
                }
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onSelect('landing', 'home');
              }}
            >
              {brandLogo !== undefined ? brandLogo : <UXILogo size={36} preserveRatio glow />}
            </a>
          </div>

          {/* Stacked Nav Items */}
          <nav className="uxu-sidebar__nav">
            {groups.flatMap((g) => g.items).map((item) => {
              const hasSub = Boolean(item.subItems && item.subItems.length > 0);
              const hasMatchingSub =
                hasSub &&
                Boolean(item.subItems?.some((s) => s.id === activeSubItemId));
              const isParentActive =
                activeItemId === item.id ||
                hasMatchingSub ||
                (!hasSub &&
                  activeItemId === 'dashboard' &&
                  activeSubItemId === item.id);
              const parentHref =
                item.href ??
                RouteService.buildPath(item.id, item.subItems?.[0]?.id);

              return (
                <a
                  key={item.id}
                  href={parentHref}
                  className={[
                    'uxu-sidebar__stacked-item',
                    isParentActive ? 'uxu-sidebar__stacked-item--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  title={item.label}
                  onClick={(e) => {
                    if (RouteService.isModifiedClick(e)) return;
                    if (parentHref.startsWith('http')) return;
                    e.preventDefault();
                    onSelect(item.id, item.subItems?.[0]?.id);
                    onCloseMobile();
                  }}
                >
                  <span className="uxu-sidebar__stacked-icon">
                    {item.icon}
                  </span>
                  <span className="uxu-sidebar__stacked-label">
                    {item.label}
                  </span>
                  {item.subLabel && (
                    <span className="uxu-sidebar__stacked-sublabel">
                      {item.subLabel}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Stacked Footer */}
          <div className="uxu-sidebar__footer">
            <Avatar
              name="Ümit Uz"
              status="online"
              size="sm"
              tone="primary"
              shape="squircle"
            />
          </div>
        </aside>
      ) : isDual ? (
        /* --- 2. DUAL-COLUMN MASTER-DETAIL VARIANT --- */
        <aside
          id={id}
          style={style}
          className={[
            'uxu-sidebar',
            'uxu-sidebar--dual-column',
            mobileOpen ? 'uxu-sidebar--mobile-open' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Çift Kolonlu Kenar Çubuğu"
        >
          {/* Primary Rail */}
          <div className="uxu-sidebar__dual-rail">
            <a
              href="/"
              className="uxu-sidebar__brand"
              title="Ana Sayfa"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onSelect('landing', 'home');
              }}
            >
              {brandLogo !== undefined ? brandLogo : <UXILogo size={36} preserveRatio glow />}
            </a>
            <div style={{ width: '100%', height: 1, background: 'var(--uxu-border-subtle)', margin: '4px 0' }} />
            {groups.map((group) => {
              const isGroupActive = selectedGroupId === group.id;
              const firstItem = group.items[0];
              return (
                <button
                  key={group.id}
                  type="button"
                  className={[
                    'uxu-sidebar__dual-rail-btn',
                    isGroupActive ? 'uxu-sidebar__dual-rail-btn--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedGroupId(group.id)}
                  title={group.title}
                >
                  {group.icon || firstItem?.icon || <GoogleIcon name="auto_awesome" size={20} />}
                  <span className="uxu-sidebar__dual-rail-label">
                    {group.railLabel || group.title.slice(0, 5)}
                  </span>
                </button>
              );
            })}
            <div style={{ marginTop: 'auto' }}>
              <Avatar
                name="Ümit Uz"
                status="online"
                size="sm"
                tone="primary"
                shape="squircle"
              />
            </div>
          </div>

          {/* Secondary Sub-Tree Panel */}
          <div className="uxu-sidebar__dual-tree">
            <div style={{ padding: '8px 4px 12px 4px', borderBottom: '1px solid var(--uxu-border-subtle)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--uxu-text-primary)' }}>
                {groups.find((g) => g.id === selectedGroupId)?.title || 'Modüller'}
              </span>
              <button
                type="button"
                className="uxu-sidebar__collapse-btn uxu-only-mobile"
                onClick={onCloseMobile}
                aria-label="Kapat"
              >
                <X size={16} />
              </button>
            </div>

            <ul className="uxu-sidebar__list">
              {(groups.find((g) => g.id === selectedGroupId)?.items || []).map((item) => {
                const hasSub = Boolean(item.subItems && item.subItems.length > 0);
                const hasMatchingSub =
                  hasSub &&
                  Boolean(item.subItems?.some((s) => s.id === activeSubItemId));
                const isParentActive =
                  activeItemId === item.id ||
                  hasMatchingSub ||
                  (!hasSub &&
                    activeItemId === 'dashboard' &&
                    activeSubItemId === item.id);
                const isExpanded = expandedIds.includes(item.id);
                const parentHref =
                  item.href ??
                  RouteService.buildPath(item.id, item.subItems?.[0]?.id);

                return (
                  <li key={item.id} className="uxu-sidebar__li">
                    <a
                      href={parentHref}
                      className={[
                        'uxu-sidebar__item',
                        isParentActive ? 'uxu-sidebar__item--active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={(e) => {
                        if (RouteService.isModifiedClick(e)) return;
                        if (parentHref.startsWith('http')) return;
                        e.preventDefault();
                        if (hasSub) {
                          toggleSubMenu(item.id, true, item.subItems?.[0]?.id);
                        } else {
                          onSelect(item.id);
                          onCloseMobile();
                        }
                      }}
                    >
                      <span className="uxu-sidebar__item-icon">{item.icon}</span>
                      <span className="uxu-sidebar__item-label">{item.label}</span>
                      {hasSub && (
                        <span className="uxu-sidebar__chevron">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      )}
                    </a>

                    {hasSub && isExpanded && (
                      <ul className="uxu-sidebar__submenu">
                        {item.subItems!.map((sub) => {
                          const isSubActive =
                            isParentActive && activeSubItemId === sub.id;
                          const subHref =
                            sub.href ?? RouteService.buildPath(item.id, sub.id);
                          return (
                            <li key={sub.id} className="uxu-sidebar__submenu-li">
                              <a
                                href={subHref}
                                className={[
                                  'uxu-sidebar__subitem',
                                  isSubActive ? 'uxu-sidebar__subitem--active' : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                onClick={(e) => {
                                  if (RouteService.isModifiedClick(e)) return;
                                  e.preventDefault();
                                  onSelect(item.id, sub.id);
                                  onCloseMobile();
                                }}
                              >
                                <span className="uxu-sidebar__subitem-dot" />
                                <span className="uxu-sidebar__subitem-label">
                                  {sub.label}
                                </span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      ) : (
        /* --- 3. STANDARD / MINI-RAIL / DRAWER VARIANT --- */
        <aside
          id={id}
          style={style}
          className={[
            'uxu-sidebar',
            isMiniRail ? 'uxu-sidebar--collapsed' : '',
            isDrawer ? 'uxu-sidebar--drawer' : '',
            isDrawer && drawerOpen ? 'uxu-sidebar--drawer-open' : '',
            mobileOpen ? 'uxu-sidebar--mobile-open' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Ana Kenar Çubuğu Navigasyonu"
        >
          {/* Top Brand & Collapse Header */}
          <div className="uxu-sidebar__header">
            <a
              href="/"
              className="uxu-sidebar__brand"
              title={typeof brandTitle === 'string' ? brandTitle : 'Qmi'}
              onClick={(e) => {
                if (onBrandClick) {
                  e.preventDefault();
                  onBrandClick();
                  return;
                }
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onSelect('landing', 'home');
              }}
            >
              {brandLogo !== undefined ? (
                brandLogo
              ) : (
                <UXILogo
                  size={isMiniRail ? 28 : 34}
                  preserveRatio
                  glow
                />
              )}
              {!isMiniRail && (
                <div className="uxu-sidebar__brand-text">
                  <div className="uxu-sidebar__brand-row">
                    {brandTitle !== undefined ? (
                      typeof brandTitle === 'string' ? (
                        <span className="uxu-brand__name">{brandTitle}</span>
                      ) : (
                        brandTitle
                      )
                    ) : (
                      <span className="uxu-brand__name">
                        uxi
                        <span
                          style={{
                            background:
                              'linear-gradient(110deg, #2FF58E 0%, #00C8FF 45%, #818CF8 75%, #C084FC 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          GL
                        </span>
                      </span>
                    )}
                    {brandBadge !== undefined ? (
                      typeof brandBadge === 'string' ? (
                        <Badge tone="primary" variant="tonal" size="xs">
                          {brandBadge}
                        </Badge>
                      ) : (
                        brandBadge
                      )
                    ) : (
                      <Badge tone="primary" variant="tonal" size="xs">
                        PRO
                      </Badge>
                    )}
                  </div>
                  {brandSubtitle !== undefined ? (
                    typeof brandSubtitle === 'string' ? (
                      <span className="uxu-sidebar__brand-sub">
                        {brandSubtitle}
                      </span>
                    ) : (
                      brandSubtitle
                    )
                  ) : (
                    <span className="uxu-sidebar__brand-sub">
                      UX × UI × WebGL
                    </span>
                  )}
                </div>
              )}
            </a>

            {!isDrawer && (
              <button
                type="button"
                className="uxu-sidebar__collapse-btn uxu-hide-mobile"
                onClick={onToggleCollapse}
                title={isMiniRail ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
                aria-label={isMiniRail ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
              >
                {isMiniRail ? (
                  <PanelLeftOpen size={17} />
                ) : (
                  <PanelLeftClose size={17} />
                )}
              </button>
            )}

            {isDrawer && (
              <button
                type="button"
                className="uxu-sidebar__collapse-btn"
                onClick={onCloseDrawer || onCloseMobile}
                aria-label="Çekmeceyi Kapat"
                title="Çekmeceyi Kapat"
              >
                <X size={18} />
              </button>
            )}

            {mobileOpen && (
              <button
                type="button"
                className="uxu-sidebar__collapse-btn uxu-only-mobile"
                onClick={onCloseMobile}
                aria-label="Menüyü Kapat"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Search / Spotlight Button inside Sidebar */}
          <div className="uxu-sidebar__search-box">
            <button
              type="button"
              className="uxu-sidebar__search-btn"
              onClick={onOpenCommandPalette}
              title="Spotlight Komut Paleti (⌘K)"
            >
              <GoogleIcon name="search" size={14} className="uxu-sidebar__search-icon" />
              {!isMiniRail && (
                <>
                  <span className="uxu-sidebar__search-text">
                    Hızlı ara...
                  </span>
                  <kbd className="uxu-sidebar__search-kbd">⌘K</kbd>
                </>
              )}
            </button>
          </div>

          {/* Scrollable Hierarchical Menu Groups & Sub-Menus */}
          <nav className="uxu-sidebar__nav">
            {groups.map((group) => (
              <div key={group.id} className="uxu-sidebar__group">
                {!isMiniRail && (
                  <div className="uxu-sidebar__group-title">{group.title}</div>
                )}

                <ul className="uxu-sidebar__list">
                  {group.items.map((item) => {
                    const hasSub = Boolean(item.subItems && item.subItems.length > 0);
                    const hasMatchingSub =
                      hasSub &&
                      Boolean(
                        item.subItems?.some((s) => s.id === activeSubItemId)
                      );
                    const isParentActive =
                      activeItemId === item.id ||
                      hasMatchingSub ||
                      (!hasSub &&
                        activeItemId === 'dashboard' &&
                        activeSubItemId === item.id);
                    const isExpanded = expandedIds.includes(item.id);
                    const parentHref =
                      item.href ??
                      RouteService.buildPath(item.id, item.subItems?.[0]?.id);

                    return (
                      <li key={item.id} className="uxu-sidebar__li">
                        <a
                          href={parentHref}
                          target={parentHref.startsWith('http') ? '_blank' : undefined}
                          rel={parentHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                          aria-expanded={hasSub ? isExpanded : undefined}
                          className={[
                            'uxu-sidebar__item',
                            isParentActive ? 'uxu-sidebar__item--active' : '',
                            isMiniRail && flyoutState?.item.id === item.id
                              ? 'uxu-sidebar__item--flyout-open'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          title={
                            isMiniRail
                              ? `${item.label}`
                              : parentHref
                          }
                          onClick={(e) => {
                            if (RouteService.isModifiedClick(e)) return;
                            if (parentHref.startsWith('http')) return;
                            e.preventDefault();
                            if (isMiniRail && hasSub) {
                              if (flyoutState?.item.id === item.id) {
                                setFlyoutState(null);
                              } else {
                                openFlyout(item, e.currentTarget);
                              }
                              return;
                            }
                            if (hasSub) {
                              toggleSubMenu(
                                item.id,
                                true,
                                item.subItems?.[0]?.id
                              );
                            } else {
                              onSelect(item.id);
                              onCloseMobile();
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (isMiniRail && hasSub) {
                              openFlyout(item, e.currentTarget);
                            } else if (isMiniRail) {
                              scheduleCloseFlyout();
                            }
                          }}
                          onMouseLeave={() => {
                            if (isMiniRail) {
                              scheduleCloseFlyout();
                            }
                          }}
                        >
                          <span className="uxu-sidebar__item-icon">
                            {item.icon}
                          </span>

                          {isMiniRail && hasSub && (
                            <span
                              className="uxu-sidebar__rail-sub-indicator"
                              title={`${item.label} (${item.subItems?.length} alt seçenek)`}
                            />
                          )}

                          {!isMiniRail && (
                            <>
                              <span className="uxu-sidebar__item-label">
                                {item.label}
                              </span>

                              {item.badge !== undefined && (
                                <span
                                  className={`uxu-sidebar__badge uxu-sidebar__badge--${item.badgeTone ?? 'primary'
                                    }`}
                                >
                                  {item.badge}
                                </span>
                              )}

                              {hasSub && (
                                <span className="uxu-sidebar__chevron">
                                  {isExpanded ? (
                                    <ChevronDown size={15} />
                                  ) : (
                                    <ChevronRight size={15} />
                                  )}
                                </span>
                              )}
                            </>
                          )}
                        </a>

                        {/* Classic Hierarchical Sub-Menu Tree */}
                        {!isMiniRail && hasSub && isExpanded && (
                          <ul className="uxu-sidebar__submenu">
                            {item.subItems!.map((sub) => {
                              const isSubActive =
                                isParentActive && activeSubItemId === sub.id;
                              const subHref =
                                sub.href ??
                                RouteService.buildPath(item.id, sub.id);

                              return (
                                <li
                                  key={sub.id}
                                  className="uxu-sidebar__submenu-li"
                                >
                                  <a
                                    href={subHref}
                                    title={subHref}
                                    className={[
                                      'uxu-sidebar__subitem',
                                      isSubActive
                                        ? 'uxu-sidebar__subitem--active'
                                        : '',
                                    ]
                                      .filter(Boolean)
                                      .join(' ')}
                                    onClick={(e) => {
                                      if (RouteService.isModifiedClick(e)) return;
                                      e.preventDefault();
                                      onSelect(item.id, sub.id);
                                      onCloseMobile();
                                    }}
                                  >
                                    {sub.icon ? (
                                      <span className="uxu-sidebar__subitem-icon mr-2 shrink-0 inline-flex items-center justify-center w-4 h-4">
                                        {sub.icon}
                                      </span>
                                    ) : (
                                      <span
                                        className="uxu-sidebar__subitem-dot"
                                        style={
                                          sub.dotColor
                                            ? { background: sub.dotColor }
                                            : undefined
                                        }
                                      />
                                    )}
                                    <span className="uxu-sidebar__subitem-label">
                                      {sub.label}
                                    </span>
                                    {sub.badge !== undefined && (
                                      <span
                                        className={`uxu-sidebar__subbadge uxu-sidebar__badge--${sub.badgeTone ?? 'neutral'
                                          }`}
                                      >
                                        {sub.badge}
                                      </span>
                                    )}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Bottom User Profile Bar */}
          <div className="uxu-sidebar__footer">
            <div className="uxu-sidebar__user-row">
              <Avatar
                name="Ümit Uz"
                status="online"
                size="sm"
                tone="primary"
                shape="squircle"
              />
              {!isMiniRail && (
                <div className="uxu-sidebar__user-meta">
                  <span className="uxu-sidebar__user-name">Ümit Uz</span>
                  <span className="uxu-sidebar__user-role">
                    Sistem Mimarı
                  </span>
                </div>
              )}
              {!isMiniRail && (
                <button
                  type="button"
                  className="uxu-sidebar__settings-btn"
                  onClick={onOpenThemeStudio}
                  title="Tema & Görünüm Ayarları"
                  aria-label="Tema ve Görünüm Ayarları"
                >
                  <Sliders size={15} />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Floating Flyout Submenu for Collapsed Mini-Rail Mode */}
      {isMiniRail &&
        flyoutState &&
        createPortal(
          <div
            className="uxu-sidebar__flyout"
            style={{
              top: flyoutState.top,
              left: flyoutState.left,
            }}
            onMouseEnter={cancelCloseFlyout}
            onMouseLeave={scheduleCloseFlyout}
            role="menu"
            aria-label={`${flyoutState.item.label} Alt Menüsü`}
          >
            {/* Flyout Header */}
            <div className="uxu-sidebar__flyout-header">
              <div className="uxu-sidebar__flyout-title">
                <span className="uxu-sidebar__flyout-icon">
                  {flyoutState.item.icon}
                </span>
                <span className="uxu-sidebar__flyout-name">
                  {flyoutState.item.label}
                </span>
              </div>
              {flyoutState.item.subItems && (
                <span className="uxu-sidebar__flyout-count">
                  {flyoutState.item.subItems.length}
                </span>
              )}
            </div>

            {/* Flyout Subitems */}
            <div className="uxu-sidebar__flyout-body">
              {flyoutState.item.subItems?.map((sub) => {
                const isSubActive =
                  (activeItemId === flyoutState.item.id ||
                    (activeItemId === 'dashboard' &&
                      activeSubItemId === flyoutState.item.id)) &&
                  activeSubItemId === sub.id;
                const subHref =
                  sub.href ??
                  RouteService.buildPath(flyoutState.item.id, sub.id);

                return (
                  <a
                    key={sub.id}
                    href={subHref}
                    role="menuitem"
                    className={[
                      'uxu-sidebar__flyout-item',
                      isSubActive ? 'uxu-sidebar__flyout-item--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={(e) => {
                      if (RouteService.isModifiedClick(e)) return;
                      e.preventDefault();
                      onSelect(flyoutState.item.id, sub.id);
                      setFlyoutState(null);
                      onCloseMobile();
                    }}
                  >
                    {sub.icon ? (
                      <span className="uxu-sidebar__flyout-item-icon">
                        {sub.icon}
                      </span>
                    ) : (
                      <span className="uxu-sidebar__flyout-dot" />
                    )}
                    <span className="uxu-sidebar__flyout-item-label">
                      {sub.label}
                    </span>
                    {sub.badge !== undefined && (
                      <span className="uxu-sidebar__badge uxu-sidebar__badge--neutral">
                        {sub.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
