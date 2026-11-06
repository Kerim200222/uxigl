import React, { useId } from 'react';
import defaultLogoPng from '../../assets/logo/uxi_no_bg.png';

export interface UXILogoProps {
  size?: number;
  width?: number;
  height?: number;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'image' | 'svg';
  src?: string;
  alt?: string;
  preserveRatio?: boolean;
}

/**
 * uxiGL Official 3D Ribbon Monogram Logo
 * - Displays the official high-resolution 3D translucent monogram (PNG with transparency) by default.
 * - Supports vector SVG fallback via variant="svg".
 * - Dual-tone cyan & orange glow filters with squircle bounds.
 */
export const UXILogo: React.FC<UXILogoProps> = ({
  size = 32,
  width,
  height,
  glow = false,
  className = '',
  style,
  variant = 'image',
  src,
  alt = 'uxiGL Logo',
  preserveRatio = false,
}) => {
  const uid = useId().replace(/:/g, '');

  const computedWidth =
    width ?? (preserveRatio ? Math.round(size * (1024 / 582)) : size);
  const computedHeight = height ?? size;

  if (variant === 'image') {
    const imgSrc = src || defaultLogoPng;
    return (
      <div
        className={`uxu-logo ${className}`.trim()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: computedWidth,
          height: computedHeight,
          flexShrink: 0,
          userSelect: 'none',
          filter: glow
            ? 'drop-shadow(0 8px 24px rgba(0, 180, 255, 0.35)) drop-shadow(0 3px 12px rgba(255, 107, 26, 0.30))'
            : undefined,
          transition: 'transform 0.25s ease, filter 0.25s ease',
          ...style,
        }}
      >
        <img
          src={imgSrc}
          alt={alt}
          width={computedWidth}
          height={computedHeight}
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        userSelect: 'none',
        filter: glow
          ? 'drop-shadow(0 6px 18px rgba(0, 180, 255, 0.28)) drop-shadow(0 2px 10px rgba(255, 107, 26, 0.22))'
          : undefined,
        transition: 'transform 0.25s ease, filter 0.25s ease',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* MASTER POWERCLIP SQUIRCLE — Nothing spills outside this rounded square */}
          <clipPath id={`uxigl_powerclip_${uid}`}>
            <rect x="4" y="4" width="120" height="120" rx="28" />
          </clipPath>

          {/* Clip Path for Lowercase 'i' Stem */}
          <clipPath id={`uxigl_istem_clip_${uid}`}>
            <path d="M90.5 67C90.5 55.5 98.2 50.5 110 50.5V93.5C110 101.2 103.8 105.5 90.5 105.5V67Z" />
          </clipPath>

          {/* Soft 3D Elevation Drop Shadow for Foreground U & i */}
          <filter
            id={`uxigl_drop_${uid}`}
            x="-12%"
            y="-10%"
            width="128%"
            height="128%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4.5"
              floodColor="#030D14"
              floodOpacity="0.58"
            />
          </filter>

          {/* 1. Base Dark Emerald-Slate Canvas Gradient (Top & Bottom X Notches) */}
          <linearGradient
            id={`uxigl_bg_dark_${uid}`}
            x1="64"
            y1="4"
            x2="64"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#071921" />
            <stop offset="50%" stopColor="#0F2D37" />
            <stop offset="100%" stopColor="#061720" />
          </linearGradient>

          {/* 2A. Left Warm Amber-Orange Lobe Gradient */}
          <linearGradient
            id={`uxigl_left_orange_${uid}`}
            x1="8"
            y1="6"
            x2="66"
            y2="122"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#DF7A1C" />
            <stop offset="32%" stopColor="#F47920" />
            <stop offset="72%" stopColor="#F58220" />
            <stop offset="100%" stopColor="#E5892B" />
          </linearGradient>

          {/* 2B. PowerClipped Left 'X' Wing — Vivid Red-Orange Center Triangle */}
          <linearGradient
            id={`uxigl_x_left_wing_${uid}`}
            x1="4"
            y1="26"
            x2="52"
            y2="88"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF9E3B" />
            <stop offset="28%" stopColor="#F85E24" />
            <stop offset="75%" stopColor="#E63B1F" />
            <stop offset="100%" stopColor="#D6321D" />
          </linearGradient>

          {/* 2C. Inner U-Hollow Warm Shadowed X-Triangle */}
          <linearGradient
            id={`uxigl_x_inner_${uid}`}
            x1="34"
            y1="38"
            x2="66"
            y2="84"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#6D4C29" />
            <stop offset="55%" stopColor="#3B3A28" />
            <stop offset="100%" stopColor="#1E352F" />
          </linearGradient>

          {/* 3A. Top-Right Deep Emerald-Teal Dome (Behind Orange Dot) */}
          <linearGradient
            id={`uxigl_right_dome_${uid}`}
            x1="82"
            y1="8"
            x2="122"
            y2="62"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1BC47D" />
            <stop offset="50%" stopColor="#0E9471" />
            <stop offset="100%" stopColor="#0B6968" />
          </linearGradient>

          {/* 3B. Lower-Right Sweeping Emerald -> Cyan -> Ocean Blue Lobe */}
          <linearGradient
            id={`uxigl_right_wave_${uid}`}
            x1="124"
            y1="36"
            x2="68"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2EE87A" />
            <stop offset="35%" stopColor="#14B8A6" />
            <stop offset="72%" stopColor="#0891B2" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* 3C. Central S-Curve Teal-to-Azure Ribbon (Between U and i) */}
          <linearGradient
            id={`uxigl_mid_s_ribbon_${uid}`}
            x1="88"
            y1="4"
            x2="58"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1AD696" />
            <stop offset="38%" stopColor="#129AB8" />
            <stop offset="75%" stopColor="#1565C0" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>

          {/* 4A. Left 'U' Stem — Outer-Left Royal Blue Facet */}
          <linearGradient
            id={`uxigl_u_blue_outer_${uid}`}
            x1="19"
            y1="24"
            x2="48"
            y2="92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#0A84FF" />
            <stop offset="78%" stopColor="#0055D4" />
            <stop offset="100%" stopColor="#003DA6" />
          </linearGradient>

          {/* 4B. Left 'U' Stem — Inner-Right Electric Cyan-Blue Facet */}
          <linearGradient
            id={`uxigl_u_blue_inner_${uid}`}
            x1="28"
            y1="24"
            x2="39"
            y2="86"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#26C6DA" />
            <stop offset="22%" stopColor="#29B6F6" />
            <stop offset="68%" stopColor="#0288D1" />
            <stop offset="100%" stopColor="#005CE6" />
          </linearGradient>

          {/* 4C. 'U' Bowl Inner Apricot/Peach Crescent Facet */}
          <linearGradient
            id={`uxigl_u_peach_${uid}`}
            x1="22"
            y1="72"
            x2="68"
            y2="68"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="25%" stopColor="#FDBA74" />
            <stop offset="65%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#A3E635" />
          </linearGradient>

          {/* 4D. 'U' Outer Bowl to Top-Right Arch (Red-Orange -> Gold -> Neon Green) */}
          <linearGradient
            id={`uxigl_u_main_sweep_${uid}`}
            x1="24"
            y1="102"
            x2="82"
            y2="8"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#EE3A24" />
            <stop offset="22%" stopColor="#FF6B1A" />
            <stop offset="44%" stopColor="#F59E0B" />
            <stop offset="64%" stopColor="#84CC16" />
            <stop offset="82%" stopColor="#2CE87E" />
            <stop offset="100%" stopColor="#34F585" />
          </linearGradient>

          {/* 5A. Lowercase 'i' Stem — Left Electric Blue Half */}
          <linearGradient
            id={`uxigl_i_blue_${uid}`}
            x1="91"
            y1="51"
            x2="102"
            y2="105"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#29D8FF" />
            <stop offset="45%" stopColor="#0088FF" />
            <stop offset="100%" stopColor="#0048E5" />
          </linearGradient>

          {/* 5B. Lowercase 'i' Stem — Right Peach/Orange/Red Half */}
          <linearGradient
            id={`uxigl_i_orange_${uid}`}
            x1="104"
            y1="51"
            x2="104"
            y2="105"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FCD385" />
            <stop offset="38%" stopColor="#FF8524" />
            <stop offset="76%" stopColor="#F43F1A" />
            <stop offset="100%" stopColor="#E11D2E" />
          </linearGradient>

          {/* 6A. Lowercase 'i' Dot — 3D Glossy Orange Sphere */}
          <radialGradient
            id={`uxigl_i_dot_${uid}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(99.5 31.5) rotate(55) scale(16.5)"
          >
            <stop offset="0%" stopColor="#FFCA64" />
            <stop offset="38%" stopColor="#FF7E12" />
            <stop offset="78%" stopColor="#F03218" />
            <stop offset="100%" stopColor="#C81E1E" />
          </radialGradient>

          {/* 6B. Glossy Specular Highlight on Orange Sphere */}
          <radialGradient
            id={`uxigl_dot_spec_${uid}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(103.5 27.5) rotate(25) scale(6 4.2)"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FFE4B5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ===================================================================
            MASTER POWERCLIP GROUP — Everything is strictly masked inside rx=28
        =================================================================== */}
        <g clipPath={`url(#uxigl_powerclip_${uid})`}>
          {/* 1. Deep Dark Slate-Teal Base Canvas (Visible in Top & Bottom X Notches) */}
          <rect
            x="4"
            y="4"
            width="120"
            height="120"
            fill={`url(#uxigl_bg_dark_${uid})`}
          />

          {/* 2. Inner U-Hollow PowerClipped 'X' Shadow Facets */}
          <path
            d="M36 28L66 56V88L36 88V28Z"
            fill={`url(#uxigl_x_inner_${uid})`}
          />
          {/* Right-pointing X-chevron inside U hollow */}
          <path
            d="M36 42L48.5 59.5L36 77V42Z"
            fill="#8D6E3F"
            fillOpacity="0.55"
          />

          {/* 3. Left Warm Amber-Orange Lobe (Clipped inside Left Side of Squircle) */}
          <path
            d="M4 4H60C50 18 42 34 38 48L48.5 59.5L38 74C44 92 52 108 62 124H4V4Z"
            fill={`url(#uxigl_left_orange_${uid})`}
          />

          {/* 4. PowerClipped Left 'X' Diagonal Wing (Vivid Red-Orange Triangle + Glossy Upper Arc) */}
          <path
            d="M4 23C16 22 28 31 48.5 59.5L19 98C12 91 7 84 4 79V23Z"
            fill={`url(#uxigl_x_left_wing_${uid})`}
          />
          {/* Subtle Top-Left Glossy Highlight Arc on Left X Wing */}
          <path
            d="M4 23C12 21.5 18.5 23.5 24 29.5L19.5 34C14 29 9 26.5 4 26.5V23Z"
            fill="#FFD28A"
            fillOpacity="0.42"
          />

          {/* 5. Top-Right Emerald-Teal Dome (Housing the 'i' Sphere) */}
          <path
            d="M84 4H124V46C116 56 102 60 84 58V4Z"
            fill={`url(#uxigl_right_dome_${uid})`}
          />

          {/* 6. Lower-Right Sweeping Emerald -> Turquoise -> Deep Blue Wave Lobe */}
          <path
            d="M124 34C123 48 114 55 101 58C88 61 82 78 79 94C76 109 67 119 56 124H124V34Z"
            fill={`url(#uxigl_right_wave_${uid})`}
          />

          {/* 7. Central S-Curve Teal-to-Azure Ribbon (Between U and i) */}
          <path
            d="M80 4H99C90 12 84 26 83 48C82 76 76 103 56 124H44C62 106 68 82 69 48C70 24 73 11 80 4Z"
            fill={`url(#uxigl_mid_s_ribbon_${uid})`}
          />
          {/* Crisp Cyan Specular Edge Along Lower S-Curve */}
          <path
            d="M99 4C90 12 84 26 83 48C82 76 76 103 56 124"
            stroke="#5EEAD4"
            strokeWidth="1.4"
            strokeOpacity="0.7"
          />

          {/* =================================================================
              8. FOREGROUND 3D SCULPTED 'U' & 'i' (With Soft Elevation Shadow)
          ================================================================= */}
          <g filter={`url(#uxigl_drop_${uid})`}>
            {/* 8A. Left 'U' Stem — Inner-Right Electric Cyan-Blue Facet */}
            <path
              d="M27 24H30.5C35.2 24 38.5 27.5 38.5 32.5V67C38.5 78.5 45.5 85.5 55.5 85.5C58 85.5 60.5 84.8 62.5 83.8C58 89.5 51.5 92.5 43.5 91.5C33.5 90.2 27 81 27 67.5V24Z"
              fill={`url(#uxigl_u_blue_inner_${uid})`}
            />

            {/* 8B. Left 'U' Stem — Outer-Left Royal Blue Facet & Lower Curve */}
            <path
              d="M19.5 24H25.5C27.5 26 28.5 29.5 28.5 34V67.5C28.5 81 36.5 90 49.5 90C53.5 90 57.2 89 60.5 87C55.5 93 48.5 95.5 40.5 94.5C27.5 92.8 19.5 81.5 19.5 65.5V24Z"
              fill={`url(#uxigl_u_blue_outer_${uid})`}
            />

            {/* 8C. 'U' Bowl Inner Apricot/Peach Crescent Facet */}
            <path
              d="M22.5 75.5C26.5 87.5 36.5 93 48.5 91.5C59.5 90 65.5 81 66.5 66.5L71.5 61C71 81.5 62.5 95.5 46.5 97.5C33.5 99 24.5 90.5 22.5 75.5Z"
              fill={`url(#uxigl_u_peach_${uid})`}
            />

            {/* 8D. Main Outer 'U' Bowl to Top-Right Arch (Red-Orange -> Gold -> Neon Green) */}
            <path
              d="M19.5 61.5C20.5 82.5 31.5 95.5 47.5 95.5C61.5 95.5 67 83.5 67 64V36C67 19 72.5 9 80.5 4H93.5C84.5 10.5 80 21.5 80 38V65C80 90.5 67.5 104.5 46.5 104.5C28.5 104.5 19.5 89.5 19.5 66.5V61.5Z"
              fill={`url(#uxigl_u_main_sweep_${uid})`}
            />

            {/* Crisp Specular Rim Lines on 'U' */}
            <path
              d="M30.5 24C35.2 24 38.5 27.5 38.5 32.5V67C38.5 78.5 45.5 85.5 55.5 85.5"
              stroke="#7DD3FC"
              strokeWidth="1.2"
              strokeOpacity="0.85"
            />
            <path
              d="M67 64V36C67 19 72.5 9 80.5 4"
              stroke="#BBF7D0"
              strokeWidth="1.3"
              strokeOpacity="0.85"
            />

            {/* 8E. Lowercase 'i' Stem (Dual-Tone Electric Blue & Peach/Orange/Red) */}
            <g clipPath={`url(#uxigl_istem_clip_${uid})`}>
              {/* Base Blue Left Side */}
              <rect
                x="90"
                y="50"
                width="21"
                height="56"
                fill={`url(#uxigl_i_blue_${uid})`}
              />
              {/* Right Peach/Orange/Red Side Split by Smooth S-Curve */}
              <path
                d="M110 50.5C101.5 56.5 98.5 65.5 98.5 78C98.5 90.5 95.5 99 90.5 105.5H111V50.5H110Z"
                fill={`url(#uxigl_i_orange_${uid})`}
              />
              {/* Glowing Seam Highlight Along the 'i' Stem Split */}
              <path
                d="M110 50.5C101.5 56.5 98.5 65.5 98.5 78C98.5 90.5 95.5 99 90.5 105.5"
                stroke="#FDE68A"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              {/* Left Cyan Edge Highlight on 'i' Stem */}
              <path
                d="M90.5 105.5V67C90.5 55.5 98.2 50.5 110 50.5"
                stroke="#7DD3FC"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
            </g>

            {/* 8F. Lowercase 'i' Dot — 3D Glossy Orange Orb */}
            <circle
              cx="100.5"
              cy="34.5"
              r="12"
              fill={`url(#uxigl_i_dot_${uid})`}
            />
            {/* Top-Right Specular Glint on Orange Orb */}
            <ellipse
              cx="103.5"
              cy="28"
              rx="5.5"
              ry="3.8"
              transform="rotate(-18 103.5 28)"
              fill={`url(#uxigl_dot_spec_${uid})`}
            />
            {/* Crisp Rim Highlight on Orange Orb */}
            <circle
              cx="100.5"
              cy="34.5"
              r="11.4"
              stroke="#FDBA74"
              strokeWidth="0.8"
              strokeOpacity="0.55"
            />
          </g>

          {/* 9. Subtle Inner Squircle Glass Rim Border */}
          <rect
            x="4.75"
            y="4.75"
            width="118.5"
            height="118.5"
            rx="27.25"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.18"
          />
        </g>
      </svg>
    </div>
  );
};
