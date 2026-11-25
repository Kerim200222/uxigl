import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Badge } from '../../components/primitives';
import type {
  ConcreteWorkspaceShellId,
  WorkspaceShellPreset,
} from '../../core/contracts/ThemeContract';
import {
  normalizeConcreteShellId,
  WORKSPACE_SHELL_CATALOG,
} from '../../core/tokens/workspaceShellPresets';
import { ShellMiniThumbnail } from './ShellMiniThumbnail';

export const WorkspaceShellGallery: React.FC<{
  value: WorkspaceShellPreset | undefined;
  onChange: (next: WorkspaceShellPreset) => void;
  defaultRoleShell?: ConcreteWorkspaceShellId;
  compact?: boolean;
}> = ({ value = 'auto', onChange, defaultRoleShell = 'enterprisegl', compact = false }) => {
  const isAuto = !value || value === 'auto';
  const effectiveConcrete = normalizeConcreteShellId(value, defaultRoleShell);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--uxu-text-secondary, var(--text-secondary))', lineHeight: 1.4 }}>
          Yetkili olduğunuz menüler sabit kalır; tüm uygulama seçtiğiniz <strong>uxiGL</strong> kabuğuna giydirilir.
        </span>
        <button
          type="button"
          data-testid="uxigl-shell-card-auto"
          onClick={() => onChange('auto')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 999,
            border: isAuto ? '1.5px solid var(--uxu-primary)' : '1px solid var(--uxu-border-subtle, rgba(148,163,184,0.28))',
            background: isAuto ? 'var(--uxu-primary-container, rgba(59,130,246,0.16))' : 'var(--uxu-surface-tonal, rgba(148,163,184,0.12))',
            color: isAuto ? 'var(--uxu-primary)' : 'var(--uxu-text-secondary, var(--text-secondary))',
            fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Sparkles size={12} />
          <span>Rol Varsayılanı ({defaultRoleShell.toUpperCase()})</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: 10 }}>
        {WORKSPACE_SHELL_CATALOG.map((item) => {
          const isSelected = !isAuto && effectiveConcrete === item.id;
          const isEffectiveViaAuto = isAuto && effectiveConcrete === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-testid={`uxigl-shell-card-${item.id}`}
              onClick={() => onChange(item.id)}
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column',
                minWidth: 0, overflow: 'hidden',
                gap: 7, padding: 10, borderRadius: 12,
                border: isSelected || isEffectiveViaAuto ? '2px solid var(--uxu-primary)' : '1px solid var(--uxu-border-subtle, rgba(148,163,184,0.25))',
                background:
                  isSelected || isEffectiveViaAuto
                    ? 'color-mix(in srgb, var(--uxu-primary) 10%, var(--uxu-bg-elevated, var(--surface)))'
                    : 'var(--uxu-surface-tonal, rgba(148,163,184,0.06))',
                color: 'var(--uxu-text-primary, var(--text))', textAlign: 'left', cursor: 'pointer',
                transition: 'border-color 0.14s ease, transform 0.12s ease, box-shadow 0.14s ease',
              }}
            >
              <ShellMiniThumbnail id={item.id} />

              <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', gap: 4, minWidth: 0 }}>
                <strong style={{ fontSize: 12, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                  {item.name}
                </strong>
                <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                  <Badge size="xs" variant="tonal" tone={isSelected || isEffectiveViaAuto ? 'primary' : 'neutral'}>
                    {item.badge}
                  </Badge>
                </span>
              </div>

              {!compact && (
                <span
                  style={{
                    fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.35,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}
                >
                  {item.shortDesc}
                </span>
              )}

              {(isSelected || isEffectiveViaAuto) && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute', top: 13, right: 13, width: 18, height: 18,
                    borderRadius: 999, background: 'var(--uxu-primary)', color: 'var(--uxu-on-primary)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  }}
                >
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
