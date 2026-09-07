/**
 * Server-only Open-Meteo client for the Lowdermilk Park coastal forecast.
 *
 * All requests happen on the server (Server Components / route handlers). A
 * small process-level TTL cache (10 minutes) avoids hammering the upstream API
 * on every page render. `cache: "no-store"` is used on the underlying fetch so
 * Next.js does not add its own data-cache layer on top — freshness is fully
 * controlled here.
 */

export const BEACH = {
  latitude: 26.162054,
  longitude: -81.809978,
} as const;

export const BEACH_TIMEZONE = 'America/New_York';

/** Time a cached payload stays fresh, in milliseconds. */
export const CACHE_TTL_MS = 10 * 60 * 1000;

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index: number;
}

export interface OpenMeteoAlert {
  event: string;
  headline?: string;
  severity?: string;
  areas?: string;
  start?: string;
  end?: string;
}

export interface OpenMeteoForecast {
  current: OpenMeteoCurrent;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_probability_max: (number | null)[];
    uv_index_max: (number | null)[];
    wind_speed_10m_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
  alerts?: OpenMeteoAlert[];
}

export interface OpenMeteoMarine {
  hourly: {
    time: string[];
    sea_level_height_msl: number[];
    sea_surface_temperature: number[];
    wave_height: number[];
  };
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

async function fetchJson<T>(url: string): Promise<T> {
  const now = Date.now();
  const hit = memoryCache.get(url);
  if (hit && hit.expiresAt > now) {
    return hit.data as T;
  }

  const existing = inflight.get(url);
  if (existing) {
    return (await existing) as T;
  }

  const promise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Open-Meteo request failed with status ${res.status}`);
      }
      const data = (await res.json()) as T;
      memoryCache.set(url, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      return data;
    } finally {
      clearTimeout(timer);
      inflight.delete(url);
    }
  })();

  inflight.set(url, promise);
  return (await promise) as T;
}

function buildQuery(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return search.toString();
}

/** Current conditions plus the next 7 days, in the beach's local time zone. */
export async function getForecast(): Promise<OpenMeteoForecast> {
  const url = `https://api.open-meteo.com/v1/forecast?${buildQuery({
    latitude: BEACH.latitude,
    longitude: BEACH.longitude,
    timezone: BEACH_TIMEZONE,
    forecast_days: 7,
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max,sunrise,sunset',
    alerts: 1,
  })}`;
  return fetchJson<OpenMeteoForecast>(url);
}

/**
 * Hourly near-coast sea level (which tracks the local tide cycle), sea surface
 * temperature and wave height. The model estimate is refreshed hourly upstream.
 */
export async function getMarine(): Promise<OpenMeteoMarine> {
  const url = `https://marine-api.open-meteo.com/v1/marine?${buildQuery({
    latitude: BEACH.latitude,
    longitude: BEACH.longitude,
    timezone: BEACH_TIMEZONE,
    forecast_days: 2,
    hourly: 'sea_level_height_msl,sea_surface_temperature,wave_height',
  })}`;
  return fetchJson<OpenMeteoMarine>(url);
}
