import type { ThemeContextContract } from '../../../core/contracts/ThemeContract';
import type { OSWallpaperId } from '../osglEngine';
import type { BgMode, IconBgStyle, QualityMode, WindowControlsSide } from '../types';

export { StudioChoicePill, StudioFieldLabel } from './StudioPrimitives';

export type OSThemeCategory =
  | 'appearance'
  | 'wallpaper'
  | 'desktop'
  | 'icons'
  | 'typography'
  | 'performance';

export interface OSThemeCategoryItem {
  id: OSThemeCategory;
  label: string;
  subtitle: string;
  googleIcon: string;
  badgeBg: string;
}

export const OS_THEME_CATEGORIES: OSThemeCategoryItem[] = [
  {
    id: 'appearance',
    label: 'Görünüm',
    subtitle: 'Uygulama kabuğu, aydınlık/karanlık mod, renk paleti ve cam yoğunluğu',
    googleIcon: 'palette',
    badgeBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    id: 'wallpaper',
    label: 'Duvar Kağıdı',
    subtitle: 'WebGL Aurora sahneleri, özel gradyan, düz renk veya görsel arka plan',
    googleIcon: 'wallpaper',
    badgeBg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  },
  {
    id: 'desktop',
    label: 'Masaüstü & Dock',
    subtitle: 'Alt Dock çubuğu, masaüstü widget görünürlüğü ve yerleşim sıfırlama',
    googleIcon: 'dock_to_bottom',
    badgeBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  {
    id: 'icons',
    label: 'Simgeler',
    subtitle: 'Simge boyutu, etiket ölçeği, arka plan stili, renkler ve ikon dolgu tipi',
    googleIcon: 'apps',
    badgeBg: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
  {
    id: 'typography',
    label: 'Yazı Tipi',
    subtitle: 'Kurumsal yazı tipi ailesi, okunabilirlik ölçeği ve arayüz yoğunluğu',
    googleIcon: 'text_fields',
    badgeBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    id: 'performance',
    label: 'Performans & Sıfırla',
    subtitle: 'WebGL grafik kalitesi, animasyon tercihleri ve fabrika ayarlarına dönüş',
    googleIcon: 'tune',
    badgeBg: 'linear-gradient(135deg, #10b981, #059669)',
  },
];

export interface OSThemeStudioProps {
  theme: ThemeContextContract;
  wallpaper: OSWallpaperId;
  setWallpaper: (wp: OSWallpaperId) => void;
  bgMode: BgMode;
  setBgMode: (m: BgMode) => void;
  solidBgColor: string;
  setSolidBgColor: (c: string) => void;
  bgGradColor1: string;
  setBgGradColor1: (c: string) => void;
  bgGradColor2: string;
  setBgGradColor2: (c: string) => void;
  customBgUrl: string;
  setCustomBgUrl: (url: string) => void;
  uploadedBgDataUrl: string;
  setUploadedBgDataUrl: (url: string) => void;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  dockVisible: boolean;
  setDockVisible: (v: boolean) => void;
  widgetsVisible: boolean;
  setWidgetsVisible: (v: boolean) => void;
  windowAnimation: boolean;
  setWindowAnimation: (v: boolean) => void;
  windowControlsSide?: WindowControlsSide;
  setWindowControlsSide?: (side: WindowControlsSide) => void;
  iconBgStyle: IconBgStyle;
  setIconBgStyle: (s: IconBgStyle) => void;
  iconBgColor?: string;
  setIconBgColor?: (c: string) => void;
  iconGradColor1?: string;
  setIconGradColor1?: (c: string) => void;
  iconGradColor2?: string;
  setIconGradColor2?: (c: string) => void;
  iconColor?: string;
  setIconColor?: (c: string) => void;
  iconSizePx: number;
  setIconSizePx: (px: number) => void;
  onResetIcons?: () => void;
  onResetWidgets?: () => void;
  onCreateFolder?: () => void;
  onOpenDockCustomizer?: () => void;
  onResetDock?: () => void;
  onSwitchToClassic?: () => void;
  onOpenFullThemeStudio?: () => void;
  loginBgUrl?: string;
}
