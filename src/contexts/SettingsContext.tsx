import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_SETTINGS, type Settings } from '../lib/settings';

type SettingsApi = {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
  save: (patch: Partial<Settings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsApi>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
  save: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('settings');
      const data = (await res.json()) as Partial<Settings>;
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (patch: Partial<Settings>) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error((payload as { error?: string }).error || 'تعذّر حفظ الإعدادات');
    }
    const data = (await res.json()) as Partial<Settings>;
    setSettings({ ...DEFAULT_SETTINGS, ...data });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ settings, loading, refresh, save }),
    [settings, loading, refresh, save]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
