import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock, Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react';
import { loadOSGLWidgetData, saveOSGLWidgetData, type WidgetCustomField, type WidgetRenderContext, type WidgetSizePreset } from '..';

const STORAGE_KEY = 'focus_timer_state';
const PRESET_MINUTES = [5, 15, 25] as const;
const RING_RADIUS = 14;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const FOCUS_TIMER_SIZE_PRESETS: ReadonlyArray<WidgetSizePreset> = [
  { id: 'small', label: 'Kompakt', size: { width: 280, height: 120 } },
  { id: 'medium', label: 'Orta', size: { width: 360, height: 190 } },
  { id: 'large', label: 'Geniş Sahne', size: { width: 440, height: 300 } },
];

export const FOCUS_TIMER_CUSTOM_FIELDS: ReadonlyArray<WidgetCustomField> = [
  {
    key: 'chime', label: 'Süre Sonu Sesi', defaultValue: 'on',
    options: [{ value: 'on', label: 'Sesli Uyarı' }, { value: 'off', label: 'Sessiz' }],
  },
  {
    key: 'autoLoop', label: 'Süre Dolduğunda', defaultValue: 'stop',
    options: [{ value: 'stop', label: 'Bekle' }, { value: 'loop', label: 'Başa Sar & Devam Et' }],
  },
];

function playCompletionChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const audio = new AudioCtx();
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      const start = audio.currentTime + idx * 0.14;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      osc.connect(gain); gain.connect(audio.destination);
      osc.start(start); osc.stop(start + 0.48);
    });
  } catch { /* ignore autoplay restrictions */ }
}

/**
 * uxiGL OSGL Odak Sayacı (Focus Timer) Widget'ı — 5m/15m/25m hazır seçimler + sınırsız özel dakika ayarı.
 */
export function FocusTimerWidget({ ctx, storageScopeKey = 'default' }: { ctx: WidgetRenderContext; storageScopeKey?: string }) {
  const initialTotal = loadOSGLWidgetData<number>(STORAGE_KEY, 25 * 60, storageScopeKey);
  const safeInitial = Number.isFinite(initialTotal) && initialTotal >= 10 ? Math.min(28800, Math.round(initialTotal)) : 1500;
  const [totalSeconds, setTotalSeconds] = useState<number>(safeInitial);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(safeInitial);
  const [isRunning, setIsRunning] = useState(false);
  const [editingCustom, setEditingCustom] = useState(false);
  const [draftMinutes, setDraftMinutes] = useState<string>(() => String(Math.max(1, Math.round(safeInitial / 60))));

  const optsRef = useRef({ chime: true, autoLoop: false, totalSeconds });
  optsRef.current = {
    chime: ctx.getOption?.('chime', 'on') !== 'off',
    autoLoop: ctx.getOption?.('autoLoop', 'stop') === 'loop',
    totalSeconds,
  };

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (optsRef.current.chime) playCompletionChime();
          if (optsRef.current.autoLoop) return optsRef.current.totalSeconds;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  const applyDurationSeconds = (nextSec: number) => {
    const clamped = Math.max(60, Math.min(480 * 60, Math.round(nextSec)));
    setIsRunning(false);
    setTotalSeconds(clamped);
    setRemainingSeconds(clamped);
    setDraftMinutes(String(Math.round(clamped / 60)));
    saveOSGLWidgetData(STORAGE_KEY, clamped, storageScopeKey);
  };

  const commitCustomMinutes = (e?: React.FormEvent) => {
    e?.preventDefault();
    const parsed = Number.parseInt(draftMinutes, 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      applyDurationSeconds(parsed * 60);
    }
    setEditingCustom(false);
  };

  const z = Math.max(0.88, Math.min(1.65, ctx.scale));
  const btnScale = Math.min(1.25, z);
  const accent = ctx.primaryColor || '#2563eb';
  const totalMinutesExact = Math.round(totalSeconds / 60);
  const isCustomActive = !PRESET_MINUTES.includes(totalMinutesExact as (typeof PRESET_MINUTES)[number]);
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const ss = String(remainingSeconds % 60).padStart(2, '0');
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  const ringSize = Math.round(36 * Math.min(1.45, z));

  const pillBtnStyle = (active: boolean): React.CSSProperties => ({
    border: 'none', outline: 'none',
    backgroundColor: active ? (ctx.isDark ? 'rgba(59, 130, 246, 0.24)' : '#ffffff') : 'transparent',
    color: active ? (ctx.isDark ? '#93c5fd' : accent) : 'inherit',
    opacity: active ? 1 : 0.74,
    boxShadow: active ? '0 1px 3px rgba(15,23,42,0.12)' : 'none',
    fontSize: Math.round(10 * Math.min(1.25, z)),
    fontWeight: 700, padding: ctx.width < 248 ? '2px 5px' : '2px 7px',
    borderRadius: 999, cursor: 'pointer', transition: 'all 140ms ease', whiteSpace: 'nowrap',
  });

  const statusText = remainingSeconds === 0 ? 'Süre doldu' : isRunning ? 'Odaklanılıyor...' : 'Hazır';

  return (
    <div
      data-widget-kind="focus-timer"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 6, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}
    >
      {/* Satır 1: Başlık + Hazır & Özel Süre Kapsülü */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: Math.round(12 * z), fontWeight: 700, minWidth: 0, whiteSpace: 'nowrap' }}>
          <Clock size={Math.round(14 * z)} color={accent} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Odak Sayacı</span>
        </span>

        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 2, borderRadius: 999, backgroundColor: ctx.subtleBg, border: `1px solid ${ctx.subtleBorder}`, flexShrink: 0 }}
        >
          {PRESET_MINUTES.map((mins) => {
            const isPresetActive = !editingCustom && totalSeconds === mins * 60;
            return (
              <button
                key={mins}
                type="button"
                aria-pressed={isPresetActive}
                onClick={() => {
                  setEditingCustom(false);
                  applyDurationSeconds(mins * 60);
                }}
                style={pillBtnStyle(isPresetActive)}
              >
                {mins}m
              </button>
            );
          })}
          <button
            type="button"
            data-testid="focus-timer-custom-btn"
            title="İstediğiniz dakikayı (1–480 dk) belirleyin"
            aria-pressed={editingCustom || isCustomActive}
            onClick={() => {
              setIsRunning(false);
              setDraftMinutes(String(Math.max(1, Math.round(totalSeconds / 60))));
              setEditingCustom((v) => !v);
            }}
            style={pillBtnStyle(editingCustom || isCustomActive)}
          >
            {isCustomActive ? `${totalMinutesExact}m` : ctx.width < 252 ? '+' : 'Özel'}
          </button>
        </div>
      </div>

      {/* Satır 2: İlerleme Halkası + Sayaç / Özel Süre Girişi + Başlat / Sıfırla */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 0 }}>
        {editingCustom ? (
          <form onSubmit={commitCustomMinutes} onPointerDown={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
            <button
              type="button" aria-label="1 dakika azalt"
              onClick={() => setDraftMinutes((v) => String(Math.max(1, (Number.parseInt(v, 10) || 25) - 1)))}
              style={{ width: 24, height: 24, borderRadius: 999, border: `1px solid ${ctx.subtleBorder}`, background: ctx.subtleBg, color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              <Minus size={12} />
            </button>
            <input
              type="number" min={1} max={480} aria-label="Özel odak süresi (dakika)"
              value={draftMinutes} onChange={(e) => setDraftMinutes(e.target.value)} autoFocus
              style={{ width: 54, height: 28, borderRadius: 8, border: `1.5px solid ${accent}`, background: ctx.subtleBg, color: 'inherit', fontSize: 13, fontWeight: 800, textAlign: 'center', outline: 'none', padding: '0 4px' }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.72 }}>dk</span>
            <button
              type="button" aria-label="5 dakika artır"
              onClick={() => setDraftMinutes((v) => String(Math.min(480, (Number.parseInt(v, 10) || 25) + 5)))}
              style={{ width: 24, height: 24, borderRadius: 999, border: `1px solid ${ctx.subtleBorder}`, background: ctx.subtleBg, color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              <Plus size={12} />
            </button>
            <button type="submit" aria-label="Süreyi uygula" style={{ height: 26, padding: '0 9px', borderRadius: 999, border: 'none', background: accent, color: '#ffffff', fontSize: 11, fontWeight: 750, display: 'inline-flex', alignItems: 'center', gap: 3, cursor: 'pointer', flexShrink: 0 }}>
              <Check size={12} /> Tamam
            </button>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(9 * Math.min(1.3, z)), minWidth: 0 }}>
              <svg width={ringSize} height={ringSize} viewBox="0 0 36 36" aria-hidden="true" style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r={RING_RADIUS} fill="none" stroke={ctx.subtleBorder} strokeWidth="3.2" />
                <circle
                  cx="18" cy="18" r={RING_RADIUS} fill="none" stroke={accent} strokeWidth="3.2"
                  strokeLinecap="round" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>

              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <button
                  type="button"
                  title="Süreyi istediğiniz dakikaya ayarlamak için tıklayın"
                  aria-label={`Kalan süre ${mm}:${ss} — süreyi düzenlemek için tıklayın`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    if (isRunning) return;
                    setDraftMinutes(String(Math.max(1, Math.round(totalSeconds / 60))));
                    setEditingCustom(true);
                  }}
                  className="djs-tabular"
                  style={{
                    border: 'none', background: 'transparent', color: 'inherit', padding: 0, textAlign: 'left',
                    fontSize: Math.round(23 * z), fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05,
                    fontVariantNumeric: 'tabular-nums', cursor: isRunning ? 'default' : 'pointer',
                  }}
                >
                  {mm}:{ss}
                </button>
                <span style={{ fontSize: Math.round(10 * Math.min(1.25, z)), opacity: 0.62, fontWeight: 600, marginTop: 2 }}>
                  {statusText}
                </span>
              </div>
            </div>

            <div onPointerDown={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => {
                  if (!isRunning && remainingSeconds === 0) setRemainingSeconds(totalSeconds);
                  setIsRunning((v) => !v);
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: `${Math.round(6 * btnScale)}px ${Math.round(12 * btnScale)}px`,
                  borderRadius: 999, border: 'none', backgroundColor: accent, color: '#ffffff',
                  fontSize: Math.round(11.5 * btnScale), fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 4px 12px color-mix(in srgb, ${accent} 34%, transparent)`,
                }}
              >
                {isRunning ? <Pause size={Math.round(13 * btnScale)} /> : <Play size={Math.round(13 * btnScale)} />}
                <span>{isRunning ? 'Durdur' : 'Başlat'}</span>
              </button>

              <button
                type="button"
                title="Sayacı Sıfırla"
                aria-label="Sayacı sıfırla"
                onClick={() => { setIsRunning(false); setRemainingSeconds(totalSeconds); }}
                style={{
                  width: Math.round(28 * btnScale), height: Math.round(28 * btnScale),
                  borderRadius: 999, border: `1px solid ${ctx.subtleBorder}`, backgroundColor: ctx.subtleBg,
                  color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
                }}
              >
                <RotateCcw size={Math.round(13 * btnScale)} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
