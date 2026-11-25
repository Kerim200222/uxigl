import React from 'react';
import type { ConcreteWorkspaceShellId } from '../../core/contracts/ThemeContract';

const C_BORDER = 'var(--uxu-border-subtle, rgba(148, 163, 184, 0.28))';
const C_SURFACE = 'var(--uxu-bg-elevated, rgba(30, 41, 59, 0.85))';
const C_SUBTLE = 'var(--uxu-surface-tonal, rgba(148, 163, 184, 0.22))';
const C_CANVAS = 'var(--uxu-bg-canvas, rgba(15, 23, 42, 0.55))';
const C_MUTED = 'var(--uxu-text-muted, #94a3b8)';

export function ShellMiniThumbnail({ id }: { id: ConcreteWorkspaceShellId }) {
  const frameStyle: React.CSSProperties = {
    position: 'relative', height: 64, borderRadius: 9, overflow: 'hidden',
    border: `1px solid ${C_BORDER}`, background: C_CANVAS, display: 'flex',
  };

  if (id === 'osgl') {
    return (
      <div
        style={{
          ...frameStyle,
          background: 'linear-gradient(135deg, var(--uxu-primary) 0%, color-mix(in srgb, var(--uxu-primary) 42%, #0f172a) 100%)',
          flexDirection: 'column', justifyContent: 'space-between', padding: 5,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 8px)', gap: 3 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: 2.5, background: 'rgba(255,255,255,0.85)' }} />
            ))}
          </div>
          <div
            style={{
              width: '56%', height: 34, borderRadius: 5, background: C_SURFACE,
              border: `1px solid ${C_BORDER}`, padding: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.28)',
            }}
          >
            <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: 9, background: '#ff5f57' }} />
              <span style={{ width: 4, height: 4, borderRadius: 9, background: '#febc2e' }} />
              <span style={{ width: 4, height: 4, borderRadius: 9, background: '#28c840' }} />
            </div>
            <div style={{ height: 15, borderRadius: 2, background: C_SUBTLE }} />
          </div>
        </div>
        <div
          style={{
            alignSelf: 'center', display: 'flex', gap: 3, padding: '2px 6px',
            borderRadius: 99, background: 'rgba(15,23,42,0.45)',
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: 2, background: 'rgba(255,255,255,0.92)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (id === 'tesseragl') {
    return (
      <div style={frameStyle}>
        <div
          style={{
            width: 15, background: C_SUBTLE, borderRight: `1px solid ${C_BORDER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6, gap: 3.5,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 6.5, height: 6.5, borderRadius: 2,
                background: i === 0 ? 'var(--uxu-primary)' : C_MUTED,
                opacity: i === 0 ? 1 : 0.5,
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: 34, background: C_SURFACE, borderRight: `1px solid ${C_BORDER}`,
            padding: 4, display: 'flex', flexDirection: 'column', gap: 3.5,
          }}
        >
          <span style={{ height: 4.5, width: '82%', borderRadius: 2, background: 'var(--uxu-primary)', opacity: 0.85 }} />
          <span style={{ height: 3.5, width: '90%', borderRadius: 2, background: C_SUBTLE }} />
          <span style={{ height: 3.5, width: '70%', borderRadius: 2, background: C_SUBTLE }} />
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 6, width: '62%', margin: '0 auto', borderRadius: 3, background: C_SUBTLE }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flex: 1 }}>
            <div style={{ borderRadius: 4, background: C_SURFACE, border: `1px solid ${C_BORDER}` }} />
            <div style={{ borderRadius: 4, background: C_SURFACE, border: `1px solid ${C_BORDER}` }} />
          </div>
        </div>
      </div>
    );
  }

  if (id === 'flowgl') {
    return (
      <div style={frameStyle}>
        <div
          style={{
            width: 32, background: C_SURFACE, borderRight: `1px solid ${C_BORDER}`,
            padding: 5, display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          <span style={{ height: 5, width: 18, borderRadius: 99, background: 'var(--uxu-primary)' }} />
          <span style={{ height: 4, width: 22, borderRadius: 99, background: C_SUBTLE }} />
          <span style={{ height: 4, width: 19, borderRadius: 99, background: C_SUBTLE }} />
          <span style={{ height: 4, width: 16, borderRadius: 99, background: C_SUBTLE }} />
        </div>
        <div style={{ flex: 1, padding: 7, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 6 }}>
          <div style={{ borderRadius: 8, background: C_SURFACE, border: `1px solid ${C_BORDER}`, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 5, width: '60%', borderRadius: 99, background: 'var(--uxu-primary)', opacity: 0.85 }} />
            <div style={{ height: 3.5, width: '85%', borderRadius: 99, background: C_SUBTLE }} />
          </div>
          <div style={{ borderRadius: 8, background: C_SURFACE, border: `1px solid ${C_BORDER}`, padding: 5 }}>
            <div style={{ height: 5, width: '50%', borderRadius: 99, background: C_SUBTLE }} />
          </div>
        </div>
      </div>
    );
  }

  if (id === 'cargogl') {
    return (
      <div style={frameStyle}>
        <div
          style={{
            width: 22, background: C_SURFACE, borderRight: `1px solid ${C_BORDER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6, gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 10, height: 8, borderRadius: 3,
                background: i === 0 ? 'var(--uxu-primary)' : C_SUBTLE,
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ height: 5, width: '42%', borderRadius: 99, background: C_SUBTLE }} />
            <div style={{ display: 'flex', gap: 2 }}>
              {['#10b981', '#0ea5e9', '#6366f1', '#f59e0b'].map((c) => (
                <span key={c} style={{ width: 4.5, height: 4.5, borderRadius: 99, background: c }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, flex: 1 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ borderRadius: 5, background: C_SURFACE, border: `1px solid ${C_BORDER}` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === 'synthgl') {
    return (
      <div
        style={{
          ...frameStyle,
          background: `linear-gradient(135deg, color-mix(in srgb, var(--uxu-primary) 18%, ${C_CANVAS}), ${C_CANVAS})`,
        }}
      >
        <div
          style={{
            width: 17, background: C_SUBTLE, borderRight: `1px solid ${C_BORDER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6, gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--uxu-primary)', opacity: i === 0 ? 1 : 0.4 }} />
          ))}
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              height: 15, borderRadius: 6,
              background: `color-mix(in srgb, var(--uxu-primary) 24%, ${C_SURFACE})`,
              border: `1px solid ${C_BORDER}`,
            }}
          />
          <div style={{ flex: 1, borderRadius: 6, background: C_SURFACE, border: `1px solid ${C_BORDER}` }} />
        </div>
      </div>
    );
  }

  return (
    <div style={frameStyle}>
      <div
        style={{
          width: 36, background: C_SURFACE, borderRight: `1px solid ${C_BORDER}`,
          padding: 4, display: 'flex', flexDirection: 'column', gap: 3.5,
        }}
      >
        <span style={{ height: 5, width: '75%', borderRadius: 2, background: 'var(--uxu-primary)' }} />
        <span style={{ height: 3.5, width: '90%', borderRadius: 2, background: C_SUBTLE }} />
        <span style={{ height: 3.5, width: '80%', borderRadius: 2, background: C_SUBTLE }} />
        <span style={{ height: 3.5, width: '85%', borderRadius: 2, background: C_SUBTLE }} />
      </div>
      <div style={{ flex: 1, padding: 4, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, height: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ borderRadius: 2.5, background: C_SURFACE, border: `1px solid ${C_BORDER}` }} />
          ))}
        </div>
        <div
          style={{
            flex: 1, borderRadius: 4, background: C_SURFACE, border: `1px solid ${C_BORDER}`,
            display: 'flex', flexDirection: 'column', gap: 2.5, padding: 3.5,
          }}
        >
          <span style={{ height: 4, borderRadius: 1, background: C_SUBTLE }} />
          <span style={{ height: 3, width: '85%', borderRadius: 1, background: C_SUBTLE, opacity: 0.75 }} />
          <span style={{ height: 3, width: '70%', borderRadius: 1, background: C_SUBTLE, opacity: 0.75 }} />
        </div>
      </div>
    </div>
  );
}
