import React from 'react';
import type {
  ComponentSize,
  IdentifiableProps,
  SemanticTone,
} from '../../../core/contracts/ComponentContracts';
import type { GoogleIconStyle } from '../../../core/contracts/ThemeContract';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — GOOGLE MATERIAL SYMBOLS VARIABLE FONT ICON (<GoogleIcon />)
 * ============================================================================
 * Renders Google's official Material Symbols variable font icons ('Rounded',
 * 'Outlined', 'Sharp') with live support for all 4 variable font axes:
 * - `FILL`: 0 (outline) to 1 (filled)
 * - `wght`: 100 to 700 stroke weight
 * - `GRAD`: -25 (dark mode optical compensation) to 200 (emphasized)
 * - `opsz`: 20 to 48 optical size
 */

export interface GoogleIconProps extends IdentifiableProps {
  /** Official Google Material Symbol ligature name (e.g. 'auto_awesome', 'dashboard', 'palette', 'bolt') */
  name: string;
  /** Variable font family variant ('rounded' | 'outlined' | 'sharp'). Defaults to active theme iconStyle */
  iconStyle?: GoogleIconStyle;
  /** Variable FILL axis (true = 1, false = 0). Defaults to active theme iconFilled */
  filled?: boolean;
  /** Variable weight axis (100..700). Defaults to active theme iconWeight */
  weight?: number;
  /** Variable grade axis (-25..200). Defaults to active theme optical grade */
  grade?: number;
  /** Semantic size preset ('xs' | 'sm' | 'md' | 'lg') or exact pixel number */
  size?: ComponentSize | number;
  /** Optional semantic color tone */
  tone?: SemanticTone | 'inherit' | 'muted';
  /** Accessible title (if omitted, icon is treated as decorative aria-hidden) */
  title?: string;
}

// Global font loading detection to prevent ligature text flash (FOUT) before web font is ready
let isFontLoadedGlobal =
  typeof document !== 'undefined' && 'fonts' in document
    ? document.fonts.check('20px "Material Symbols Rounded"')
    : true;

const fontLoadSubscribers = new Set<() => void>();

if (typeof document !== 'undefined' && 'fonts' in document && !isFontLoadedGlobal) {
  const markReady = () => {
    if (!isFontLoadedGlobal) {
      isFontLoadedGlobal = true;
      document.documentElement.classList.remove('uxu-icon-fonts-loading');
      document.documentElement.classList.add('uxu-icon-fonts-loaded');
      fontLoadSubscribers.forEach((cb) => cb());
      fontLoadSubscribers.clear();
    }
  };

  document.fonts.ready.then(markReady).catch(markReady);
  // Failsafe timeout so icons are never stuck hidden permanently
  setTimeout(markReady, 1800);
}

export const GoogleIcon: React.FC<GoogleIconProps> = ({
  id,
  className = '',
  style,
  name,
  iconStyle,
  filled,
  weight,
  grade,
  size = 'md',
  tone = 'inherit',
  title,
}) => {
  const [fontReady, setFontReady] = React.useState(isFontLoadedGlobal);

  React.useEffect(() => {
    if (fontReady || isFontLoadedGlobal) return;
    const onReady = () => setFontReady(true);
    fontLoadSubscribers.add(onReady);
    return () => {
      fontLoadSubscribers.delete(onReady);
    };
  }, [fontReady]);

  const pxSize =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 16
      : size === 'sm'
      ? 18
      : size === 'lg'
      ? 24
      : 20;

  const opticalSize = Math.max(20, Math.min(48, Math.round(pxSize)));

  const fontFamilyOverride =
    iconStyle === 'outlined'
      ? "'Material Symbols Outlined'"
      : iconStyle === 'sharp'
      ? "'Material Symbols Sharp'"
      : iconStyle === 'rounded'
      ? "'Material Symbols Rounded'"
      : undefined;

  const classes = [
    'uxu-google-icon',
    fontReady ? 'uxu-google-icon--ready' : 'uxu-google-icon--loading',
    tone !== 'inherit' ? `uxu-google-icon--${tone}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      id={id}
      className={classes}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      title={title}
      style={
        {
          fontSize: `${pxSize}px`,
          width: `${pxSize}px`,
          height: `${pxSize}px`,
          ...(!fontReady ? { visibility: 'hidden', opacity: 0 } : {}),
          ...(fontFamilyOverride
            ? { '--uxu-icon-font-family': fontFamilyOverride }
            : {}),
          ...(typeof filled === 'boolean'
            ? { '--uxu-icon-fill': filled ? '1' : '0' }
            : {}),
          ...(typeof weight === 'number'
            ? { '--uxu-icon-weight': String(weight) }
            : {}),
          ...(typeof grade === 'number'
            ? { '--uxu-icon-grade': String(grade) }
            : {}),
          '--uxu-icon-opsz': String(opticalSize),
          ...style,
        } as React.CSSProperties
      }
    >
      {name}
    </span>
  );
};
