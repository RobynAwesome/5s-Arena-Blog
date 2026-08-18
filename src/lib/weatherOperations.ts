export type WeatherSceneMode =
  | 'neutral'
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'storm'
  | 'snow';

export type ArenaWeatherSample = {
  weatherCode: number;
  wind: number;
  temperature?: number;
  humidity?: number;
};

export type WeatherOperations = {
  mode: WeatherSceneMode;
  rainIntensity: number;
  snowIntensity: number;
  windStrength: number;
  fogDensity: number;
  lightLevel: number;
  lightning: boolean;
  accumulationRate: number;
};

export const NEUTRAL_WEATHER_OPERATIONS: WeatherOperations = {
  mode: 'neutral',
  rainIntensity: 0,
  snowIntensity: 0,
  windStrength: 0,
  fogDensity: 0.018,
  lightLevel: 0.78,
  lightning: false,
  accumulationRate: 0,
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function rainIntensity(code: number) {
  if (code === 51) return 0.22;
  if (code === 53) return 0.36;
  if (code === 55) return 0.52;
  if (code === 61) return 0.42;
  if (code === 63) return 0.66;
  if (code === 65) return 0.9;
  if (code === 80) return 0.5;
  if (code === 81) return 0.72;
  if (code === 82) return 1;
  if (code === 95) return 0.88;
  if (code === 96) return 0.96;
  if (code === 99) return 1;
  return 0;
}

function snowIntensity(code: number) {
  if (code === 71) return 0.34;
  if (code === 73) return 0.62;
  if (code === 75) return 0.92;
  return 0;
}

/**
 * Converts canonical Five's Arena/Open-Meteo WMO truth into visual operations.
 *
 * Towers invariant: storm is a stronger rain state. It does not receive a
 * second precipitation system. The renderer consumes rainIntensity and adds
 * storm-only light/fog/lightning operations on top of the same rain pool.
 */
export function weatherToOperations(
  sample: ArenaWeatherSample | null | undefined,
): WeatherOperations {
  if (!sample || !Number.isFinite(sample.weatherCode)) {
    return NEUTRAL_WEATHER_OPERATIONS;
  }

  const code = sample.weatherCode;
  const windStrength = clamp01((Number.isFinite(sample.wind) ? sample.wind : 0) / 55);
  const rain = rainIntensity(code);
  const snow = snowIntensity(code);
  const storm = code === 82 || code === 95 || code === 96 || code === 99;
  const fog = code === 45 || code === 48;
  const cloudy = code === 2 || code === 3;

  if (snow > 0) {
    return {
      mode: 'snow',
      rainIntensity: 0,
      snowIntensity: snow,
      windStrength,
      fogDensity: 0.027 + snow * 0.012,
      lightLevel: 0.72,
      lightning: false,
      accumulationRate: 0.08 + snow * 0.14,
    };
  }

  if (rain > 0) {
    return {
      mode: storm ? 'storm' : 'rain',
      rainIntensity: rain,
      snowIntensity: 0,
      windStrength,
      fogDensity: storm ? 0.052 : 0.028 + rain * 0.014,
      lightLevel: storm ? 0.38 : 0.62 - rain * 0.12,
      lightning: storm,
      accumulationRate: 0,
    };
  }

  if (fog) {
    return {
      mode: 'fog',
      rainIntensity: 0,
      snowIntensity: 0,
      windStrength,
      fogDensity: code === 48 ? 0.06 : 0.052,
      lightLevel: 0.52,
      lightning: false,
      accumulationRate: 0,
    };
  }

  if (cloudy) {
    return {
      mode: 'cloudy',
      rainIntensity: 0,
      snowIntensity: 0,
      windStrength,
      fogDensity: code === 3 ? 0.025 : 0.021,
      lightLevel: code === 3 ? 0.62 : 0.72,
      lightning: false,
      accumulationRate: 0,
    };
  }

  return {
    mode: 'clear',
    rainIntensity: 0,
    snowIntensity: 0,
    windStrength,
    fogDensity: 0.012,
    lightLevel: 0.9,
    lightning: false,
    accumulationRate: 0,
  };
}
