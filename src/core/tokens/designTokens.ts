import type {
  SeedPaletteDefinition,
  SeedPaletteId,
  ThemePreferences,
  RadiusScale,
  UIDensity,
  FontFamilyPreset,
  FontFamilyPresetDefinition,
} from '../contracts/ThemeContract';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — LIQUID GLASS × GOOGLE MATERIAL YOU DESIGN TOKENS
 * ============================================================================
 */

export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  mode: 'dark',
  seedPalette: 'cupertino-blue',
  radiusScale: 'squircle',
  customRadiusPx: 12,
  density: 'comfortable',
  fontScale: 100, // 100% = crisp 14px base UI font, adjustable 80% - 125%
  fontFamilyPreset: 'inter-jakarta',
  iconStyle: 'rounded',
  iconFilled: false,
  iconWeight: 400,
  sidebarWidth: 256,
  sidebarStackedWidth: 108,
  glassIntensity: 82,
  reducedMotion: false,
  webglEnabled: false, // Strictly optional & disabled by default for zero idle GPU load
  webglPreset: 'aurora-borealis',
  webglSpeed: 60,
  webglIntensity: 38,
};

export const SEED_PALETTES: Record<SeedPaletteId, SeedPaletteDefinition> = {
  'cupertino-blue': {
    id: 'cupertino-blue',
    name: 'Cupertino Blue',
    inspiration: 'Liquid Glass',
    description: 'Safir mavi ve turkuaz.',
    auroraColors: {
      colorA: [0.04, 0.88, 0.72], // Arctic Aurora Emerald-Cyan
      colorB: [0.16, 0.56, 1.0],  // Cupertino Electric Sapphire
      colorC: [0.58, 0.24, 0.98], // Deep Cosmic Violet
    },
    light: {
      primary: '#0066CC',
      primaryHover: '#0052A3',
      primaryContainer: 'rgba(220, 238, 255, 0.82)',
      onPrimaryContainer: '#002855',
      secondary: '#5856D6',
      accentGlow: 'rgba(0, 102, 204, 0.28)',
      bgCanvas: '#F2F6FC',
      bgElevated: '#FFFFFF',
      surfaceGlass: 'rgba(246, 250, 255, 0.82)',
      surfaceGlassHover: 'rgba(255, 255, 255, 0.94)',
      surfaceTonal: '#E6EFFA',
      surfaceTonalHigh: '#D8E6F7',
      surfaceElevated: '#F9FBFF',
      borderSubtle: 'rgba(0, 64, 128, 0.10)',
      borderStrong: 'rgba(0, 64, 128, 0.18)',
      textPrimary: '#0B192C',
      textSecondary: '#415A77',
      textMuted: '#6C84A3',
    },
    dark: {
      primary: '#2997FF',
      primaryHover: '#52ADFF',
      primaryContainer: 'rgba(13, 43, 78, 0.76)',
      onPrimaryContainer: '#B8DFFF',
      secondary: '#7D7AFF',
      accentGlow: 'rgba(41, 151, 255, 0.38)',
      bgCanvas: '#070A12',
      bgElevated: '#0D1322',
      surfaceGlass: 'rgba(15, 23, 40, 0.74)',
      surfaceGlassHover: 'rgba(22, 33, 56, 0.86)',
      surfaceTonal: '#131C31',
      surfaceTonalHigh: '#1A2742',
      surfaceElevated: '#10182B',
      borderSubtle: 'rgba(130, 185, 255, 0.12)',
      borderStrong: 'rgba(130, 185, 255, 0.22)',
      textPrimary: '#F4F8FF',
      textSecondary: '#94ACC9',
      textMuted: '#637B99',
    },
  },
  'material-violet': {
    id: 'material-violet',
    name: 'Material Iris',
    inspiration: 'Google Material You',
    description: 'Lavanta ve kozmik mor.',
    auroraColors: {
      colorA: [0.68, 0.38, 1.0],  // Iris Violet
      colorB: [0.96, 0.26, 0.68], // Neon Magenta Ribbon
      colorC: [0.22, 0.68, 0.98], // Cyan Horizon
    },
    light: {
      primary: '#6750A4',
      primaryHover: '#543E8E',
      primaryContainer: 'rgba(234, 221, 255, 0.85)',
      onPrimaryContainer: '#21005D',
      secondary: '#7D5260',
      accentGlow: 'rgba(103, 80, 164, 0.28)',
      bgCanvas: '#F6F2FF',
      bgElevated: '#FDFBFF',
      surfaceGlass: 'rgba(250, 246, 255, 0.82)',
      surfaceGlassHover: 'rgba(253, 251, 255, 0.94)',
      surfaceTonal: '#EDE6FA',
      surfaceTonalHigh: '#E2D8F5',
      surfaceElevated: '#FAF7FF',
      borderSubtle: 'rgba(103, 80, 164, 0.12)',
      borderStrong: 'rgba(103, 80, 164, 0.22)',
      textPrimary: '#1D192B',
      textSecondary: '#49454F',
      textMuted: '#79747E',
    },
    dark: {
      primary: '#D0BCFF',
      primaryHover: '#E2D4FF',
      primaryContainer: 'rgba(56, 30, 114, 0.78)',
      onPrimaryContainer: '#EADDFF',
      secondary: '#EFB8C8',
      accentGlow: 'rgba(208, 188, 255, 0.36)',
      bgCanvas: '#0D0917',
      bgElevated: '#151026',
      surfaceGlass: 'rgba(25, 19, 44, 0.76)',
      surfaceGlassHover: 'rgba(35, 27, 60, 0.88)',
      surfaceTonal: '#1E1736',
      surfaceTonalHigh: '#292047',
      surfaceElevated: '#19132E',
      borderSubtle: 'rgba(208, 188, 255, 0.14)',
      borderStrong: 'rgba(208, 188, 255, 0.24)',
      textPrimary: '#F6F0FF',
      textSecondary: '#CAC4D0',
      textMuted: '#938F99',
    },
  },
  'emerald-mint': {
    id: 'emerald-mint',
    name: 'Emerald Mint',
    inspiration: 'Hybrid Fusion',
    description: 'Zümrüt yeşili ve okyanus.',
    auroraColors: {
      colorA: [0.06, 0.94, 0.56], // Pure Northern Lights Green
      colorB: [0.05, 0.76, 0.88], // Glacial Teal
      colorC: [0.46, 0.32, 0.96], // Upper Atmosphere Indigo
    },
    light: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryContainer: 'rgba(209, 250, 229, 0.82)',
      onPrimaryContainer: '#064E3B',
      secondary: '#0D9488',
      accentGlow: 'rgba(5, 150, 105, 0.28)',
      bgCanvas: '#F1FAF6',
      bgElevated: '#FAFFFD',
      surfaceGlass: 'rgba(244, 252, 249, 0.82)',
      surfaceGlassHover: 'rgba(250, 255, 253, 0.94)',
      surfaceTonal: '#E2F4EC',
      surfaceTonalHigh: '#D2ECE1',
      surfaceElevated: '#F6FCFA',
      borderSubtle: 'rgba(5, 150, 105, 0.12)',
      borderStrong: 'rgba(5, 150, 105, 0.22)',
      textPrimary: '#09221A',
      textSecondary: '#3B5E52',
      textMuted: '#688A7E',
    },
    dark: {
      primary: '#34D399',
      primaryHover: '#6EE7B7',
      primaryContainer: 'rgba(6, 78, 59, 0.76)',
      onPrimaryContainer: '#A7F3D0',
      secondary: '#2DD4BF',
      accentGlow: 'rgba(52, 211, 153, 0.38)',
      bgCanvas: '#060F0D',
      bgElevated: '#0B1A16',
      surfaceGlass: 'rgba(13, 30, 25, 0.76)',
      surfaceGlassHover: 'rgba(19, 42, 35, 0.88)',
      surfaceTonal: '#112620',
      surfaceTonalHigh: '#18352C',
      surfaceElevated: '#0E201B',
      borderSubtle: 'rgba(52, 211, 153, 0.14)',
      borderStrong: 'rgba(52, 211, 153, 0.24)',
      textPrimary: '#F0FDF8',
      textSecondary: '#9CC5B7',
      textMuted: '#668F82',
    },
  },
  'sunset-coral': {
    id: 'sunset-coral',
    name: 'Solar Coral',
    inspiration: 'Liquid Glass',
    description: 'Mercan kızılı ve turuncu.',
    auroraColors: {
      colorA: [0.98, 0.24, 0.44], // Crimson Aurora
      colorB: [0.98, 0.52, 0.18], // Solar Flare Orange
      colorC: [0.68, 0.22, 0.88], // Twilight Purple
    },
    light: {
      primary: '#E11D48',
      primaryHover: '#BE123C',
      primaryContainer: 'rgba(255, 228, 230, 0.82)',
      onPrimaryContainer: '#881337',
      secondary: '#F97316',
      accentGlow: 'rgba(225, 29, 72, 0.28)',
      bgCanvas: '#FDF3F5',
      bgElevated: '#FFFAFB',
      surfaceGlass: 'rgba(255, 246, 248, 0.82)',
      surfaceGlassHover: 'rgba(255, 250, 251, 0.94)',
      surfaceTonal: '#F9E5E9',
      surfaceTonalHigh: '#F3D5DC',
      surfaceElevated: '#FFF7F8',
      borderSubtle: 'rgba(225, 29, 72, 0.11)',
      borderStrong: 'rgba(225, 29, 72, 0.21)',
      textPrimary: '#280B13',
      textSecondary: '#69414B',
      textMuted: '#966B76',
    },
    dark: {
      primary: '#FB7185',
      primaryHover: '#FDA4AF',
      primaryContainer: 'rgba(76, 5, 25, 0.76)',
      onPrimaryContainer: '#FFE4E6',
      secondary: '#FB923C',
      accentGlow: 'rgba(251, 113, 133, 0.38)',
      bgCanvas: '#12080C',
      bgElevated: '#1C0E14',
      surfaceGlass: 'rgba(34, 16, 24, 0.76)',
      surfaceGlassHover: 'rgba(46, 22, 33, 0.88)',
      surfaceTonal: '#27141C',
      surfaceTonalHigh: '#351B26',
      surfaceElevated: '#211018',
      borderSubtle: 'rgba(251, 113, 133, 0.14)',
      borderStrong: 'rgba(251, 113, 133, 0.24)',
      textPrimary: '#FFF2F4',
      textSecondary: '#D4A8B0',
      textMuted: '#997079',
    },
  },
  'amber-gold': {
    id: 'amber-gold',
    name: 'Amber Gold',
    inspiration: 'Google Material You',
    description: 'Kehribar sarısı ve altın.',
    auroraColors: {
      colorA: [0.98, 0.75, 0.14], // Golden Ray
      colorB: [0.96, 0.38, 0.22], // Warm Terracotta
      colorC: [0.12, 0.78, 0.68], // Turquoise Contrast
    },
    light: {
      primary: '#D97706',
      primaryHover: '#B45309',
      primaryContainer: 'rgba(254, 243, 199, 0.84)',
      onPrimaryContainer: '#78350F',
      secondary: '#EA580C',
      accentGlow: 'rgba(217, 119, 6, 0.28)',
      bgCanvas: '#FCF7EE',
      bgElevated: '#FFFDF9',
      surfaceGlass: 'rgba(254, 250, 241, 0.82)',
      surfaceGlassHover: 'rgba(255, 253, 249, 0.94)',
      surfaceTonal: '#F5EBDA',
      surfaceTonalHigh: '#EDE0C7',
      surfaceElevated: '#FEFBF4',
      borderSubtle: 'rgba(217, 119, 6, 0.12)',
      borderStrong: 'rgba(217, 119, 6, 0.22)',
      textPrimary: '#261907',
      textSecondary: '#665238',
      textMuted: '#947E61',
    },
    dark: {
      primary: '#FBBF24',
      primaryHover: '#FCD34D',
      primaryContainer: 'rgba(69, 26, 3, 0.76)',
      onPrimaryContainer: '#FDE68A',
      secondary: '#FB923C',
      accentGlow: 'rgba(251, 191, 36, 0.36)',
      bgCanvas: '#110C06',
      bgElevated: '#1B140A',
      surfaceGlass: 'rgba(32, 23, 12, 0.76)',
      surfaceGlassHover: 'rgba(44, 32, 17, 0.88)',
      surfaceTonal: '#261C0E',
      surfaceTonalHigh: '#342614',
      surfaceElevated: '#20170C',
      borderSubtle: 'rgba(251, 191, 36, 0.14)',
      borderStrong: 'rgba(251, 191, 36, 0.24)',
      textPrimary: '#FFF9ED',
      textSecondary: '#D1BC9B',
      textMuted: '#968263',
    },
  },
  'graphite-mono': {
    id: 'graphite-mono',
    name: 'Titanium Mono',
    inspiration: 'Hybrid Fusion',
    description: 'Titanyum gri ve gümüş.',
    auroraColors: {
      colorA: [0.62, 0.78, 0.96], // Ice Silver Blue
      colorB: [0.42, 0.56, 0.78], // Brushed Titanium
      colorC: [0.24, 0.82, 0.78], // Subtle Glacial Cyan
    },
    light: {
      primary: '#18181B',
      primaryHover: '#27272A',
      primaryContainer: 'rgba(228, 228, 231, 0.82)',
      onPrimaryContainer: '#09090B',
      secondary: '#52525B',
      accentGlow: 'rgba(24, 24, 27, 0.2)',
      bgCanvas: '#F4F4F6',
      bgElevated: '#FFFFFF',
      surfaceGlass: 'rgba(250, 250, 252, 0.82)',
      surfaceGlassHover: 'rgba(255, 255, 255, 0.94)',
      surfaceTonal: '#EAEAEF',
      surfaceTonalHigh: '#DFDFE6',
      surfaceElevated: '#FAFAFC',
      borderSubtle: 'rgba(24, 24, 27, 0.09)',
      borderStrong: 'rgba(24, 24, 27, 0.18)',
      textPrimary: '#09090B',
      textSecondary: '#52525B',
      textMuted: '#71717A',
    },
    dark: {
      primary: '#F4F4F5',
      primaryHover: '#FFFFFF',
      primaryContainer: 'rgba(39, 39, 42, 0.78)',
      onPrimaryContainer: '#FAFAFA',
      secondary: '#A1A1AA',
      accentGlow: 'rgba(244, 244, 245, 0.3)',
      bgCanvas: '#09090B',
      bgElevated: '#121215',
      surfaceGlass: 'rgba(20, 20, 24, 0.76)',
      surfaceGlassHover: 'rgba(29, 29, 35, 0.88)',
      surfaceTonal: '#18181D',
      surfaceTonalHigh: '#23232A',
      surfaceElevated: '#151519',
      borderSubtle: 'rgba(244, 244, 245, 0.10)',
      borderStrong: 'rgba(244, 244, 245, 0.18)',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      textMuted: '#71717A',
    },
  },
};

export const RADIUS_SCALE_TOKENS: Record<
  RadiusScale,
  { sm: string; md: string; lg: string; xl: string; full: string }
> = {
  sharp: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  squircle: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    xl: '24px',
    full: '9999px',
  },
  pill: {
    sm: '12px',
    md: '18px',
    lg: '26px',
    xl: '34px',
    full: '9999px',
  },
};

export const DENSITY_SCALE_TOKENS: Record<
  UIDensity,
  { spacingUnit: string; controlHeightMd: string; cardPadding: string; fontSizeScale: string }
> = {
  compact: {
    spacingUnit: '0.85',
    controlHeightMd: '34px',
    cardPadding: '16px',
    fontSizeScale: '0.95',
  },
  comfortable: {
    spacingUnit: '1',
    controlHeightMd: '40px',
    cardPadding: '22px',
    fontSizeScale: '1',
  },
  spacious: {
    spacingUnit: '1.15',
    controlHeightMd: '46px',
    cardPadding: '28px',
    fontSizeScale: '1.03',
  },
};

export const FONT_FAMILY_PRESETS: Record<
  FontFamilyPreset,
  FontFamilyPresetDefinition
> = {
  'inter-jakarta': {
    id: 'inter-jakarta',
    name: 'Inter × Plus Jakarta',
    badge: 'Varsayılan • Hibrit UI',
    description: 'Okunabilir Google Inter gövde metni ve geometrik Plus Jakarta Sans başlıklar.',
    sansStack:
      "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
    displayStack:
      "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    monoStack: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
  },
  'outfit-material': {
    id: 'outfit-material',
    name: 'Outfit (Google M3)',
    badge: 'Google Material You',
    description: 'Google Sans / Material Design 3 estetiğine en yakın modern geometrik Google Font ailesi.',
    sansStack:
      "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
    displayStack:
      "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
    monoStack: "'JetBrains Mono', 'Fira Code', monospace",
  },
  'dm-sans': {
    id: 'dm-sans',
    name: 'DM Sans × Jakarta',
    badge: 'Kurumsal Stüdyo',
    description: 'Yüksek optik netliğe sahip DM Sans arayüz tipografisi ve Fira Code kod ailesi.',
    sansStack:
      "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    displayStack:
      "'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif",
    monoStack: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
  },
  'space-grotesk': {
    id: 'space-grotesk',
    name: 'Space Grotesk × Mono',
    badge: 'WebGL & Telemetri',
    description: 'Teknik gösterge panelleri, finansal veri tabloları ve WebGL sahneleri için fütüristik Google Font.',
    sansStack:
      "'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    displayStack:
      "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
    monoStack: "'JetBrains Mono', 'Fira Code', monospace",
  },
  'system-sf': {
    id: 'system-sf',
    name: 'Sistem Yerel (OS)',
    badge: 'Yerel Sistem',
    description: 'Sıfır ağ gecikmeli işletim sistemi yerel yazı tipi (SF Pro Display / Segoe UI / Roboto).',
    sansStack:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
    displayStack:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
    monoStack: "'SF Mono', 'JetBrains Mono', Consolas, monospace",
  },
};
