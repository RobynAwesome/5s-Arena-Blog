import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import {
  NEUTRAL_WEATHER_OPERATIONS,
  weatherToOperations,
  type ArenaWeatherSample,
  type WeatherOperations,
} from '@/lib/weatherOperations';

const LOCALITY_STORAGE_KEY = 'fivesarena.locality.v1';
const LOCALITY_EVENT = 'fivesarena:locality-change';
const DEFAULT_PROVINCE = 'western-cape';
const VALID_PROVINCES = new Set([
  'western-cape',
  'eastern-cape',
  'northern-cape',
  'free-state',
  'kwazulu-natal',
  'north-west',
  'gauteng',
  'mpumalanga',
  'limpopo',
]);

export type ArenaWeatherContext = {
  status: 'loading' | 'live' | 'unavailable';
  provinceSlug: string;
  province: string | null;
  weatherLabel: string | null;
  condition: string | null;
  temperature: number | null;
  weatherCode: number | null;
  wind: number | null;
  operations: WeatherOperations;
};

function validProvince(value: unknown) {
  return typeof value === 'string' && VALID_PROVINCES.has(value)
    ? value
    : null;
}

function readSavedProvince() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCALITY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { provinceSlug?: unknown };
    return validProvince(parsed.provinceSlug);
  } catch {
    return null;
  }
}

function initialProvince(requestedProvince?: string | null) {
  return validProvince(requestedProvince) || readSavedProvince() || DEFAULT_PROVINCE;
}

function unavailableContext(provinceSlug: string): ArenaWeatherContext {
  return {
    status: 'unavailable',
    provinceSlug,
    province: null,
    weatherLabel: null,
    condition: null,
    temperature: null,
    weatherCode: null,
    wind: null,
    operations: NEUTRAL_WEATHER_OPERATIONS,
  };
}

export function useArenaWeather(requestedProvince?: string | null) {
  const [provinceSlug, setProvinceSlug] = useState(() => initialProvince(requestedProvince));
  const [context, setContext] = useState<ArenaWeatherContext>(() => ({
    ...unavailableContext(initialProvince(requestedProvince)),
    status: 'loading',
  }));

  useEffect(() => {
    const requested = validProvince(requestedProvince);
    if (requested) setProvinceSlug(requested);
  }, [requestedProvince]);

  useEffect(() => {
    if (requestedProvince) return;

    const onLocality = (event: Event) => {
      const detail = (event as CustomEvent<{ provinceSlug?: unknown }>).detail;
      const next = validProvince(detail?.provinceSlug);
      if (next) setProvinceSlug(next);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== LOCALITY_STORAGE_KEY) return;
      const next = readSavedProvince();
      if (next) setProvinceSlug(next);
    };

    window.addEventListener(LOCALITY_EVENT, onLocality);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(LOCALITY_EVENT, onLocality);
      window.removeEventListener('storage', onStorage);
    };
  }, [requestedProvince]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      setContext((current) => ({ ...current, provinceSlug, status: 'loading' }));
      try {
        const response = await api.get('/organism/weather', {
          params: { province: provinceSlug },
          signal: controller.signal,
        });
        if (!mounted || response.data?.status !== 'live') return;

        const weather = response.data.weather;
        const sample: ArenaWeatherSample = {
          weatherCode: weather.weatherCode,
          wind: weather.wind,
          temperature: weather.temperature ?? undefined,
          humidity: weather.humidity ?? undefined,
        };

        setContext({
          status: 'live',
          provinceSlug: response.data.locality?.provinceSlug || provinceSlug,
          province: response.data.locality?.province || null,
          weatherLabel: response.data.locality?.weatherLabel || null,
          condition: weather.condition || null,
          temperature: typeof weather.temperature === 'number' ? weather.temperature : null,
          weatherCode: weather.weatherCode,
          wind: weather.wind,
          operations: weatherToOperations(sample),
        });
      } catch {
        if (mounted) setContext(unavailableContext(provinceSlug));
      }
    }

    void load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [provinceSlug]);

  return useMemo(() => context, [context]);
}
