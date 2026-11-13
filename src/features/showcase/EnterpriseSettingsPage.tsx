import React, { useEffect, useState } from 'react';
import {
  Palette,
  User,
  Bell,
  Sun,
  Moon,
  Monitor,
  Save,
  RotateCcw,
  Mail,
  Smartphone,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../components/composites/Card/Card';
import { Tabs, type TabItem } from '../../components/composites/Tabs/Tabs';
import { Switch } from '../../components/primitives/Switch/Switch';
import {
  Select,
  type SelectOptionItem,
} from '../../components/primitives/Select/Select';
import { Button } from '../../components/primitives/Button/Button';
import { Input } from '../../components/primitives/Input/Input';
import { Badge } from '../../components/primitives/Badge/Badge';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { defaultThemeStorageAdapter } from '../../core/services/StorageService';
import type {
  RadiusScale,
  SeedPaletteId,
  ThemeMode,
} from '../../core/contracts/ThemeContract';

/**
 * ============================================================================
 * uxiGL SHOWCASE — ENTERPRISE SETTINGS PAGE TEMPLATE
 * ============================================================================
 * Full-page enterprise settings layout built with uxiGL primitives and
 * composites across three tabbed sections: Appearance, Account, Notifications.
 */

export type SettingsTabId = 'appearance' | 'account' | 'notifications';

export interface EnterpriseSettingsPageProps {
  /** Initial active settings tab (defaults to 'appearance') */
  initialTab?: SettingsTabId;
  /** Optional CSS class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

export const WORKSPACE_SETTINGS_STORAGE_KEY = 'uxigl.workspace.settings.v1';

export interface PersistedWorkspaceSettings {
  fullName: string;
  email: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export const DEFAULT_WORKSPACE_SETTINGS: PersistedWorkspaceSettings = {
  fullName: 'Kerim Demir',
  email: 'kerim.demir@enterprise.uxigl.io',
  emailNotifications: true,
  pushNotifications: false,
};

export function loadWorkspaceSettings(): PersistedWorkspaceSettings {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_WORKSPACE_SETTINGS;
    }
    const raw = window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_WORKSPACE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PersistedWorkspaceSettings>;
    return {
      fullName:
        typeof parsed.fullName === 'string'
          ? parsed.fullName
          : DEFAULT_WORKSPACE_SETTINGS.fullName,
      email:
        typeof parsed.email === 'string'
          ? parsed.email
          : DEFAULT_WORKSPACE_SETTINGS.email,
      emailNotifications:
        typeof parsed.emailNotifications === 'boolean'
          ? parsed.emailNotifications
          : DEFAULT_WORKSPACE_SETTINGS.emailNotifications,
      pushNotifications:
        typeof parsed.pushNotifications === 'boolean'
          ? parsed.pushNotifications
          : DEFAULT_WORKSPACE_SETTINGS.pushNotifications,
    };
  } catch {
    return DEFAULT_WORKSPACE_SETTINGS;
  }
}

export function saveWorkspaceSettings(
  settings: PersistedWorkspaceSettings
): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(
      WORKSPACE_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    );
  } catch {
    // Fail gracefully in private browsing / quota exceeded
  }
}

export function clearWorkspaceSettings(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(WORKSPACE_SETTINGS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

const SETTINGS_TABS: TabItem[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: <Palette size={15} />,
  },
  {
    id: 'account',
    label: 'Account',
    icon: <User size={15} />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell size={15} />,
  },
];

const THEME_MODE_OPTIONS: SelectOptionItem[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'High-contrast daylight surface tokens',
    icon: <Sun size={14} />,
    badge: 'Day',
    badgeTone: 'warning',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Deep Liquid Glass dark mode surfaces',
    icon: <Moon size={14} />,
    badge: 'Default',
    badgeTone: 'primary',
  },
  {
    value: 'system',
    label: 'System',
    description: 'Automatically follow OS color scheme preference',
    icon: <Monitor size={14} />,
    badge: 'Auto',
    badgeTone: 'info',
  },
];

const ACCENT_COLOR_OPTIONS: SelectOptionItem[] = [
  {
    value: 'cupertino-blue',
    label: 'Sapphire Blue (Cupertino Blue)',
    description: 'Liquid Glass primary sapphire & cyan tonal palette',
    badge: '#2997FF',
    badgeTone: 'primary',
  },
  {
    value: 'material-violet',
    label: 'Royal Iris (Material Violet)',
    description: 'Material You dynamic lavender & cosmic violet',
    badge: '#D0BCFF',
    badgeTone: 'info',
  },
  {
    value: 'emerald-mint',
    label: 'Emerald Mint',
    description: 'Hybrid fusion northern lights emerald & teal',
    badge: '#10B981',
    badgeTone: 'success',
  },
  {
    value: 'sunset-coral',
    label: 'Sunset Coral',
    description: 'Warm coral & vibrant magenta accents',
    badge: '#F43F5E',
    badgeTone: 'danger',
  },
  {
    value: 'amber-gold',
    label: 'Amber Gold',
    description: 'Solar amber & executive gold highlights',
    badge: '#F59E0B',
    badgeTone: 'warning',
  },
  {
    value: 'graphite-mono',
    label: 'Graphite Mono',
    description: 'Minimalist monochrome slate & titanium neutrals',
    badge: '#94A3B8',
    badgeTone: 'neutral',
  },
];

const CORNER_RADIUS_OPTIONS: SelectOptionItem[] = [
  {
    value: 'sharp',
    label: 'Sharp (4px)',
    description: 'Crisp technical corners for high-density data views',
    badge: '4px',
    badgeTone: 'neutral',
  },
  {
    value: 'squircle',
    label: 'Squircle (12px)',
    description: 'Balanced Apple HIG continuous corner geometry',
    badge: '12px',
    badgeTone: 'primary',
  },
  {
    value: 'pill',
    label: 'Pill (22px)',
    description: 'Expressive Material You rounded contour geometry',
    badge: '22px',
    badgeTone: 'info',
  },
];

export const EnterpriseSettingsPage: React.FC<EnterpriseSettingsPageProps> = ({
  initialTab = 'appearance',
  className = '',
  style,
}) => {
  // Global Theme & Notification Context Services
  const {
    preferences,
    resolvedMode,
    activePalette,
    setMode,
    setSeedPalette,
    setRadiusScale,
    resetPreferences,
  } = useTheme();
  const { notify } = useToast();

  // Active tab state
  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Persisted workspace settings initialization
  const [initialSettings] = useState<PersistedWorkspaceSettings>(() =>
    loadWorkspaceSettings()
  );

  // Account local state
  const [fullName, setFullName] = useState<string>(initialSettings.fullName);
  const [email, setEmail] = useState<string>(initialSettings.email);
  const [accountSaved, setAccountSaved] = useState<boolean>(false);

  // Notifications local state
  const [emailNotifications, setEmailNotifications] = useState<boolean>(
    initialSettings.emailNotifications
  );
  const [pushNotifications, setPushNotifications] = useState<boolean>(
    initialSettings.pushNotifications
  );

  const handleThemeModeChange = (nextMode: ThemeMode) => {
    setMode(nextMode);
    defaultThemeStorageAdapter.savePreferences({
      ...preferences,
      mode: nextMode,
    });
  };

  const handleAccentColorChange = (nextPalette: SeedPaletteId) => {
    setSeedPalette(nextPalette);
    defaultThemeStorageAdapter.savePreferences({
      ...preferences,
      seedPalette: nextPalette,
      customPrimaryHex: undefined,
    });
  };

  const handleCornerRadiusChange = (nextRadius: RadiusScale) => {
    const mappedPx =
      nextRadius === 'sharp' ? 4 : nextRadius === 'pill' ? 22 : 12;
    setRadiusScale(nextRadius);
    defaultThemeStorageAdapter.savePreferences({
      ...preferences,
      radiusScale: nextRadius,
      customRadiusPx: mappedPx,
    });
  };

  const handleResetAppearance = () => {
    resetPreferences();
    defaultThemeStorageAdapter.clearPreferences();
    clearWorkspaceSettings();
    setFullName(DEFAULT_WORKSPACE_SETTINGS.fullName);
    setEmail(DEFAULT_WORKSPACE_SETTINGS.email);
    setEmailNotifications(DEFAULT_WORKSPACE_SETTINGS.emailNotifications);
    setPushNotifications(DEFAULT_WORKSPACE_SETTINGS.pushNotifications);
    setAccountSaved(false);
    notify({
      title: 'Appearance reset to defaults',
      description: 'Theme mode, seed palette, and corner radius restored.',
      tone: 'info',
    });
  };

  const handleSaveAccount = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    saveWorkspaceSettings({
      fullName,
      email,
      emailNotifications,
      pushNotifications,
    });
    setAccountSaved(true);
    notify({
      title: 'Profile updated successfully',
      description: `Account settings saved for ${fullName} (${email}).`,
      tone: 'success',
    });
  };

  const handleEmailNotificationsChange = (nextValue: boolean) => {
    setEmailNotifications(nextValue);
    saveWorkspaceSettings({
      fullName,
      email,
      emailNotifications: nextValue,
      pushNotifications,
    });
    notify({
      title: nextValue
        ? 'Email notifications enabled'
        : 'Email notifications disabled',
      description: 'Notification channel preferences persisted to workspace.',
      tone: 'info',
    });
  };

  const handlePushNotificationsChange = (nextValue: boolean) => {
    setPushNotifications(nextValue);
    saveWorkspaceSettings({
      fullName,
      email,
      emailNotifications,
      pushNotifications: nextValue,
    });
    notify({
      title: nextValue
        ? 'Push notifications enabled'
        : 'Push notifications disabled',
      description: 'Real-time push alert preferences persisted to workspace.',
      tone: 'info',
    });
  };

  return (
    <div
      className={`uxu-enterprise-settings-page ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '1.5rem 0',
        ...style,
      }}
    >
      {/* Main Page Header */}
      <Card
        variant="glass"
        padding="lg"
        eyebrow="ENTERPRISE WORKSPACE CONFIGURATION"
        title="Enterprise Settings"
        subtitle="Manage your workspace appearance tokens, account profile, and real-time notification channels."
        headerIcon={<Sparkles size={20} />}
        headerAction={
          <Badge tone="primary" variant="tonal" pulse>
            {activePalette.name} · {resolvedMode.toUpperCase()}
          </Badge>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Tabs
            items={SETTINGS_TABS}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as SettingsTabId)}
            variant="pill"
            size="md"
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: 'var(--uxu-text-secondary)',
            }}
          >
            <ShieldCheck size={15} />
            <span>Active Profile: {fullName || 'Unassigned'}</span>
          </div>
        </div>
      </Card>

      {/* Section 1: Appearance */}
      {activeTab === 'appearance' && (
        <Card
          variant="glass"
          padding="lg"
          title="Appearance & Design Tokens"
          subtitle="Configure theme polarity, Material You seed accent palette, and corner radius geometry."
          headerIcon={<Palette size={18} />}
          footer={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--uxu-text-secondary)',
                }}
              >
                Active Tokens: <strong>{preferences.mode.toUpperCase()}</strong>{' '}
                ({resolvedMode}) · <strong>{preferences.seedPalette}</strong> ·{' '}
                <strong>{preferences.radiusScale}</strong>
              </span>
              <Button
                variant="tonal"
                size="sm"
                leadingIcon={<RotateCcw size={14} />}
                onClick={handleResetAppearance}
              >
                Reset Defaults
              </Button>
            </div>
          }
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <Select
              id="settings-theme-mode"
              label="Theme Mode"
              value={preferences.mode}
              onChange={(val) => handleThemeModeChange(val as ThemeMode)}
              options={THEME_MODE_OPTIONS}
              searchable={false}
              helperText="Choose between Light, Dark, or OS System synchronization."
            />

            <Select
              id="settings-accent-color"
              label="Accent Color"
              value={preferences.seedPalette}
              onChange={(val) => handleAccentColorChange(val as SeedPaletteId)}
              options={ACCENT_COLOR_OPTIONS}
              searchable
              searchPlaceholder="Search seed palettes..."
              helperText="Select the primary seed color palette for surfaces and highlights."
            />

            <Select
              id="settings-corner-radius"
              label="Corner Radius"
              value={preferences.radiusScale}
              onChange={(val) => handleCornerRadiusChange(val as RadiusScale)}
              options={CORNER_RADIUS_OPTIONS}
              searchable={false}
              helperText="Adjust component border-radius scale across cards and controls."
            />
          </div>
        </Card>
      )}

      {/* Section 2: Account */}
      {activeTab === 'account' && (
        <Card
          variant="glass"
          padding="lg"
          title="Account Profile"
          subtitle="Update your enterprise administrator identity and primary contact address."
          headerIcon={<User size={18} />}
          headerAction={
            accountSaved ? (
              <Badge
                tone="success"
                variant="tonal"
                leadingIcon={<CheckCircle2 size={13} />}
              >
                Changes Saved
              </Badge>
            ) : undefined
          }
        >
          <form
            onSubmit={handleSaveAccount}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <Input
                id="settings-account-name"
                label="Full Name"
                value={fullName}
                onChange={(val) => {
                  setFullName(val);
                  setAccountSaved(false);
                }}
                placeholder="Enter your full name"
                leadingIcon={<User size={15} />}
                clearable
                required
                helperText="Displayed across audit logs and workspace activity."
              />

              <Input
                id="settings-account-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(val) => {
                  setEmail(val);
                  setAccountSaved(false);
                }}
                placeholder="name@company.com"
                leadingIcon={<Mail size={15} />}
                clearable
                required
                helperText="Used for SSO verification and security alerts."
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '0.5rem',
              }}
            >
              <Button
                type="button"
                variant="filled"
                size="md"
                leadingIcon={<Save size={15} />}
                onClick={handleSaveAccount}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Section 3: Notifications */}
      {activeTab === 'notifications' && (
        <Card
          variant="glass"
          padding="lg"
          title="Notification Preferences"
          subtitle="Control how and when uxiGL dispatches operational alerts and digest reports."
          headerIcon={<Bell size={18} />}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Switch
              id="settings-notify-email"
              value={emailNotifications}
              onChange={handleEmailNotificationsChange}
              label={
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Mail size={15} /> Email Notifications
                </span>
              }
              description="Receive daily security digests, billing invoices, and compliance audit reports via email."
              tone="primary"
            />

            <Switch
              id="settings-notify-push"
              value={pushNotifications}
              onChange={handlePushNotificationsChange}
              label={
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Smartphone size={15} /> Push Notifications
                </span>
              }
              description="Receive instant browser and mobile push alerts for real-time cluster incidents and mentions."
              tone="primary"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnterpriseSettingsPage;

