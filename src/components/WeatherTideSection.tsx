import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { getForecast, getMarine } from '@/lib/open-meteo';
import { buildDailyAdvice } from '@/lib/beach-advice';
import type { AdviceCategory, AdviceItem } from '@/lib/beach-advice';

/** Official NWS alert events shown in plain Chinese when present. */
const ALERT_NAMES_ZH: Record<string, string> = {
  'Rip Current Statement': '离岸流风险通告',
  'Beach Hazards Statement': '海滩安全风险提示',
  'High Surf Advisory': '大浪提醒',
  'Coastal Flood Advisory': '沿海淹水提醒',
  'Small Craft Advisory': '小型船只风险提示',
  'Heat Advisory': '高温提醒',
  'Excessive Heat Warning': '高温预警',
  'Severe Thunderstorm Warning': '强雷暴预警',
  'Tropical Storm Warning': '热带风暴预警',
  'Hurricane Warning': '飓风预警',
};

function alertDisplayName(locale: string, event: string): string {
  if (locale !== 'zh') return event;
  return ALERT_NAMES_ZH[event] ?? event;
}

/* ------------------------------------------------------------------ */
/* Display helpers                                                     */
/* ------------------------------------------------------------------ */

const pad2 = (n: number) => String(n).padStart(2, '0');

function fmtClockTime(iso: string, hour12: boolean): string {
  const hhmm = iso.length >= 16 ? iso.slice(11, 16) : iso;
  const [hhRaw, mmRaw] = hhmm.split(':');
  const hh = Number(hhRaw);
  const mm = Number(mmRaw);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return hhmm;
  if (hour12) {
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${pad2(mm)} ${suffix}`;
  }
  return `${pad2(hh)}:${pad2(mm)}`;
}

function dayNumber(dateStr: string): number {
  return Math.round(
    Date.UTC(
      Number(dateStr.slice(0, 4)),
      Number(dateStr.slice(5, 7)) - 1,
      Number(dateStr.slice(8, 10)),
    ) / 86400000,
  );
}

function dayString(n: number): string {
  const d = new Date(n * 86400000);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

const tempC = (c: number, imperial: boolean) =>
  `${Math.round(imperial ? (c * 9) / 5 + 32 : c)}°${imperial ? 'F' : 'C'}`;

const windSpeed = (kmh: number, imperial: boolean) =>
  `${Math.round(imperial ? kmh * 0.621371 : kmh)} ${imperial ? 'mph' : 'km/h'}`;

const cleanRound = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  return rounded === 0 ? 0 : rounded;
};

const meters = (m: number, imperial: boolean) => {
  const value = imperial ? m * 3.28084 : m;
  const decimals = imperial ? 1 : 2;
  return `${cleanRound(value, decimals)} ${imperial ? 'ft' : 'm'}`;
};

/* ------------------------------------------------------------------ */
/* Weather glyphs (inline SVG, theme-aware via currentColor)           */
/* ------------------------------------------------------------------ */

type GlyphKind =
  | 'sun'
  | 'moon'
  | 'sun-cloud'
  | 'moon-cloud'
  | 'cloud'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunder';

function glyphKindFor(code: number, isDay: boolean): GlyphKind {
  switch (code) {
    case 0:
      return isDay ? 'sun' : 'moon';
    case 1:
    case 2:
      return isDay ? 'sun-cloud' : 'moon-cloud';
    case 3:
      return 'cloud';
    case 45:
    case 48:
      return 'fog';
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return 'rain';
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return 'snow';
    case 95:
    case 96:
    case 99:
      return 'thunder';
    default:
      return 'cloud';
  }
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function glyphBody(kind: GlyphKind): ReactNode {
  switch (kind) {
    case 'sun':
      return (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </>
      );
    case 'moon':
      return <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />;
    case 'sun-cloud':
      return (
        <>
          <circle cx="9" cy="8" r="2.6" />
          <path d="M9 2.6V4.2M9 11.8v1.6M4.4 4.4l1.1 1.1M12.5 12.5l1.1 1.1M2.6 8h1.6M8.8 8h1.4" />
          <path d="M18 19.2H11.3a4.7 4.7 0 1 1 4.5-6.3h2.2a3.3 3.3 0 0 1 0 6.3Z" />
        </>
      );
    case 'moon-cloud':
      return (
        <>
          <path d="M10 7.2A4.4 4.4 0 1 1 4.6 12.4 3.7 3.7 0 1 1 10 7.2Z" />
          <path d="M18 19.2H11.3a4.7 4.7 0 1 1 4.5-6.3h2.2a3.3 3.3 0 0 1 0 6.3Z" />
        </>
      );
    case 'fog':
      return (
        <>
          <path d="M18 16.5h-1.26A5.5 5.5 0 1 0 13 6.6a6.6 6.6 0 0 0-6.6 6.3A3.6 3.6 0 0 0 9.3 16.5H18a3.3 3.3 0 0 0 0-6.3h-1" />
          <path d="M5 20h8M15 20h4" />
        </>
      );
    case 'rain':
      return (
        <>
          <path d="M17.5 15.5H8.2A5.5 5.5 0 1 1 13.6 7.4a6.3 6.3 0 0 1 6.3 5.2A3.4 3.4 0 0 1 17.5 15.5Z" />
          <path d="M8.5 18.5 7.4 21M12.4 18.5l-1.1 2.6M16.3 18.5l-1.1 2.6" />
        </>
      );
    case 'snow':
      return (
        <>
          <path d="M17.5 15.5H8.2A5.5 5.5 0 1 1 13.6 7.4a6.3 6.3 0 0 1 6.3 5.2A3.4 3.4 0 0 1 17.5 15.5Z" />
          <circle cx="8" cy="20" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="21.4" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="20" r="1" fill="currentColor" stroke="none" />
        </>
      );
    case 'thunder':
      return (
        <>
          <path d="M17.5 15.5H8.2A5.5 5.5 0 1 1 13.6 7.4a6.3 6.3 0 0 1 6.3 5.2A3.4 3.4 0 0 1 17.5 15.5Z" />
          <path d="M11 17v4.5h2.6L12 24" />
        </>
      );
    default:
      return <path d="M17.5 15.5H8.2A5.5 5.5 0 1 1 13.6 7.4a6.3 6.3 0 0 1 6.3 5.2A3.4 3.4 0 0 1 17.5 15.5Z" />;
  }
}

function WeatherGlyph({ kind, size = 26 }: { kind: GlyphKind; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      {glyphBody(kind)}
    </svg>
  );
}

function Droplet({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21a6 6 0 0 0 6-6c0-3-3.1-6.7-5.1-8.7A1.1 1.1 0 0 0 11.1 6.3C9.1 8.3 6 12 6 15a6 6 0 0 0 6 6Z" />
    </svg>
  );
}

function TideArrow({ rising, size = 16 }: { rising: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {rising ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tide math                                                           */
/* ------------------------------------------------------------------ */

interface TideExtreme {
  time: string;
  value: number;
}

function toMs(iso: string): number {
  return Date.UTC(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10)),
    Number(iso.slice(11, 13)),
    Number(iso.slice(14, 16)),
  );
}

/**
 * Picks the dominant high and low tide over the coming hours. Coastal sea
 * level can wobble with short-lived swells; choosing the single largest and
 * smallest value in the window keeps the readings aligned with the daily tide
 * cycle visitors actually plan around.
 */
function dominantTides(
  times: string[],
  values: number[],
  now: string,
  windowHours = 30,
): { high: TideExtreme | undefined; low: TideExtreme | undefined } {
  const nowMs = toMs(now);
  const horizonMs = nowMs + windowHours * 3_600_000;

  let high: TideExtreme | undefined;
  let low: TideExtreme | undefined;
  let highIndex = -1;
  let lowIndex = -1;

  for (let i = 0; i < Math.min(times.length, values.length); i += 1) {
    const timeMs = toMs(times[i]);
    if (!Number.isFinite(timeMs) || timeMs <= nowMs || timeMs > horizonMs) continue;
    const value = values[i];
    if (!Number.isFinite(value)) continue;
    if (highIndex === -1 || value > values[highIndex]) highIndex = i;
    if (lowIndex === -1 || value < values[lowIndex]) lowIndex = i;
  }

  if (highIndex >= 0) high = { time: times[highIndex], value: values[highIndex] };
  if (lowIndex >= 0) low = { time: times[lowIndex], value: values[lowIndex] };
  return { high, low };
}

type TidePhase = 'rising' | 'falling' | 'steady';

function tidePhaseAt(times: string[], values: number[], now: string): TidePhase {
  let index = times.findIndex((time) => time > now);
  if (index === -1) index = Math.min(times.length, values.length) - 1;
  else index -= 1;
  index = Math.max(0, Math.min(index, values.length - 1));
  const current = values[index];
  const previous = index > 0 ? values[index - 1] : undefined;
  if (!Number.isFinite(current) || previous === undefined || !Number.isFinite(previous)) {
    return 'steady';
  }
  const diff = current - previous;
  if (Math.abs(diff) < 0.004) return 'steady';
  return diff > 0 ? 'rising' : 'falling';
}

function tideCurve(
  times: string[],
  values: number[],
  now: string,
): { line: string; area: string } | null {
  let start = times.findIndex((time) => time > now);
  if (start === -1) start = 0;
  start = Math.max(0, start - 1);
  const end = Math.min(times.length, start + 25);
  const sliceValue = values.slice(start, end);
  if (sliceValue.length < 6) return null;
  const finite = sliceValue.filter((v) => Number.isFinite(v));
  if (finite.length < 6) return null;

  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const span = max - min || 1;

  const points = sliceValue.map((value, i) => {
    const x = (i / (sliceValue.length - 1)) * 100;
    const y = 28 - ((Number.isFinite(value) ? value : min) - min) * (24 / span);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = points.map((p) => `L${p}`).join(' ');
  const area = `M0,28 L${points.join(' L')} L100,28 Z`;
  return { line: `M${points[0]} ${line}`, area };
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default async function WeatherTideSection() {
  const locale = await getLocale();
  const t = await getTranslations('weatherTide');
  const imperial = locale === 'en';
  const hour12 = imperial;

  const [forecast, marine] = await Promise.all([getForecast(), getMarine()]);

  const current = forecast.current;
  const daily = forecast.daily;
  const tideTimes = marine.hourly.time;
  const tideValues = marine.hourly.sea_level_height_msl;
  const now = current.time;

  if (!current || !daily.time.length || !tideTimes.length || !tideValues.length) {
    return null;
  }

  const codes = t.raw('codes') as Record<string, string>;
  const weekdays = t.raw('weekdays') as string[];
  const adviceCopy = t.raw('advice') as Record<string, string>;
  const currentDay = now.slice(0, 10);
  const tomorrow = dayString(dayNumber(currentDay) + 1);

  const conditionText = codes[String(current.weather_code)] ?? '';

  const { high: nextHigh, low: nextLow } = dominantTides(tideTimes, tideValues, now);
  const phase = tidePhaseAt(tideTimes, tideValues, now);

  let marineIndex = tideTimes.findIndex((time) => time > now);
  if (marineIndex === -1) marineIndex = tideTimes.length - 1;
  else marineIndex -= 1;
  marineIndex = Math.max(0, marineIndex);
  const seaTemp = marine.hourly.sea_surface_temperature[marineIndex];
  const waveHeight = marine.hourly.wave_height[marineIndex];
  const seaTempStr =
    seaTemp !== undefined && Number.isFinite(seaTemp) ? tempC(seaTemp, imperial) : '—';
  const waveStr =
    waveHeight !== undefined && Number.isFinite(waveHeight) ? meters(waveHeight, imperial) : '—';

  const curve = tideCurve(tideTimes, tideValues, now);

  const currentFacts = [
    { label: t('labelFeels'), value: tempC(current.apparent_temperature, imperial) },
    { label: t('labelHumidity'), value: `${Math.round(current.relative_humidity_2m)}%` },
    { label: t('labelWind'), value: windSpeed(current.wind_speed_10m, imperial) },
    { label: t('labelGusts'), value: windSpeed(current.wind_gusts_10m, imperial) },
    { label: t('labelUv'), value: String(Math.round(current.uv_index * 10) / 10) },
  ];

  const seaFacts = [
    { label: t('labelSeaTemp'), value: seaTempStr },
    { label: t('labelWave'), value: waveStr },
    { label: t('labelSunrise'), value: fmtClockTime(daily.sunrise[0] ?? '', hour12) },
    { label: t('labelSunset'), value: fmtClockTime(daily.sunset[0] ?? '', hour12) },
  ];

  const dayCount = Math.min(daily.time.length, 7);

  /* Today's headline values driving the advice rules. */
  const todayIndex = daily.time.indexOf(currentDay);
  const idx = todayIndex >= 0 ? todayIndex : 0;
  const todayMax = daily.temperature_2m_max[idx] ?? null;
  const todayMin = daily.temperature_2m_min[idx] ?? null;
  const todayProb = daily.precipitation_probability_max[idx] ?? null;
  const todayUv = daily.uv_index_max[idx] ?? null;
  const todayWindMax = daily.wind_speed_10m_max[idx] ?? null;
  const todayMaxStr = todayMax != null ? tempC(todayMax, imperial) : null;
  const todayMinStr = todayMin != null ? tempC(todayMin, imperial) : null;

  const seaTempSafe = seaTemp != null && Number.isFinite(seaTemp) ? seaTemp : null;
  const waveSafe = waveHeight != null && Number.isFinite(waveHeight) ? waveHeight : null;

  const adviceItems = buildDailyAdvice({
    code: current.weather_code,
    isDay: current.is_day,
    tMaxC: todayMax,
    tMinC: todayMin,
    precipProbPct: todayProb,
    uvMax: todayUv,
    windMaxKmh: todayWindMax,
    seaTempC: seaTempSafe,
    seaTempDisplay: seaTempSafe != null ? tempC(seaTempSafe, imperial) : '',
    waveM: waveSafe,
  });

  const adviceByCategory: Record<AdviceCategory, AdviceItem[]> = {
    wardrobe: [],
    activity: [],
    gear: [],
    risk: [],
  };
  for (const item of adviceItems) {
    adviceByCategory[item.category].push(item);
  }

  const resolveAdvice = (item: AdviceItem) => {
    let text = adviceCopy[item.key] ?? '';
    if (item.params) {
      for (const [key, value] of Object.entries(item.params)) {
        text = text.replace(`{${key}}`, value);
      }
    }
    return text;
  };

  const alerts = forecast.alerts ?? [];
  const alertLines = alerts
    .slice(0, 2)
    .map((alert) => adviceCopy.alertLine.replace('{name}', alertDisplayName(locale, alert.event)));

  const normalGroupDefs = [
    { cat: 'wardrobe' as const, title: adviceCopy.wardrobeTitle },
    { cat: 'activity' as const, title: adviceCopy.activityTitle },
    { cat: 'gear' as const, title: adviceCopy.gearTitle },
  ];
  const hasAdvice =
    alertLines.length > 0 ||
    adviceByCategory.wardrobe.length > 0 ||
    adviceByCategory.activity.length > 0 ||
    adviceByCategory.gear.length > 0 ||
    adviceByCategory.risk.length > 0;

  const accent = 'var(--accent)';
  const textPrimary = 'var(--text-primary)';
  const textSecondary = 'var(--text-secondary)';
  const textMuted = 'var(--text-muted)';
  const borderColor = 'var(--border-color)';
  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--card-shadow)',
  } as const;
  const danger = 'var(--danger, #c2403a)';
  const dangerSoft = 'rgba(194, 64, 58, 0.08)';

  return (
    <section
      id="beach-weather"
      className="section-padding"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: textPrimary }}
        >
          {t('title')}
        </h2>
        <p className="mb-1 text-sm sm:text-base" style={{ color: textMuted }}>
          {t('subtitle')}
        </p>
        <p className="mb-8 text-xs" style={{ color: textMuted }}>
          {t('updatedAt', { time: fmtClockTime(now, hour12) })}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: accent }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Current weather */}
          <div className="flex flex-col rounded-2xl p-6 h-full" style={cardStyle}>
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-5 pb-3 border-b"
              style={{ color: accent, borderColor }}
            >
              {t('nowTitle')}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span style={{ color: accent }}>
                <WeatherGlyph kind={glyphKindFor(current.weather_code, current.is_day === 1)} size={46} />
              </span>
              <div>
                <div
                  className="font-display text-4xl font-semibold leading-none"
                  style={{ color: textPrimary }}
                >
                  {tempC(current.temperature_2m, imperial)}
                </div>
                {conditionText && (
                  <div className="mt-1.5 text-sm" style={{ color: textSecondary }}>
                    {conditionText}
                  </div>
                )}
                <div
                  className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                  style={{ color: textMuted }}
                >
                  {todayMaxStr && <span>{t('dayHigh')} {todayMaxStr}</span>}
                  {todayMinStr && <span>{t('dayLow')} {todayMinStr}</span>}
                  {todayProb != null && (
                    <span className="inline-flex items-center gap-1">
                      <Droplet size={11} />
                      {t('rainChance')} {Math.round(todayProb)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <dl
              className="grid grid-cols-2 gap-x-4 gap-y-4 mt-auto pt-5 border-t"
              style={{ borderColor }}
            >
              {currentFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs" style={{ color: textMuted }}>
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-base font-medium" style={{ color: textPrimary }}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Tides */}
          <div className="flex flex-col rounded-2xl p-6 h-full" style={cardStyle}>
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-5 pb-3 border-b"
              style={{ color: accent, borderColor }}
            >
              {t('tideTitle')}
            </p>

            <div className="mb-5">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
                style={{ background: 'var(--bg-tertiary)', color: textSecondary }}
              >
                <span style={{ color: accent }}>
                  <TideArrow rising={phase === 'rising'} />
                </span>
                {phase === 'rising' ? t('rising') : phase === 'falling' ? t('falling') : t('steady')}
              </span>
            </div>

            <div className="space-y-4 mb-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium" style={{ color: textSecondary }}>
                  {t('labelNextHigh')}
                </span>
                {nextHigh ? (
                  <span className="text-right text-sm" style={{ color: textPrimary }}>
                    <span className="font-semibold">{fmtClockTime(nextHigh.time, hour12)}</span>
                    <span className="ml-2 text-xs" style={{ color: textMuted }}>
                      {meters(nextHigh.value, imperial)}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm" style={{ color: textMuted }}>
                    —
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium" style={{ color: textSecondary }}>
                  {t('labelNextLow')}
                </span>
                {nextLow ? (
                  <span className="text-right text-sm" style={{ color: textPrimary }}>
                    <span className="font-semibold">{fmtClockTime(nextLow.time, hour12)}</span>
                    <span className="ml-2 text-xs" style={{ color: textMuted }}>
                      {meters(nextLow.value, imperial)}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm" style={{ color: textMuted }}>
                    —
                  </span>
                )}
              </div>
            </div>

            {curve && (
              <div className="mt-auto pt-2">
                <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="w-full h-14" aria-hidden="true">
                  <path d={curve.area} fill={accent} opacity={0.12} />
                  <path
                    d={curve.line}
                    fill="none"
                    stroke={accent}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Sea conditions */}
          <div className="flex flex-col rounded-2xl p-6 h-full" style={cardStyle}>
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-5 pb-3 border-b"
              style={{ color: accent, borderColor }}
            >
              {t('seaTitle')}
            </p>
            <dl className="space-y-5">
              {seaFacts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-3">
                  <dt className="text-sm" style={{ color: textSecondary }}>
                    {fact.label}
                  </dt>
                  <dd className="text-base font-semibold" style={{ color: textPrimary }}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Visitor advice — groups render only when their rules fire */}
        {hasAdvice && (
          <div className="mt-10 rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h3
              className="font-display text-xl sm:text-2xl font-semibold mb-6"
              style={{ color: textPrimary }}
            >
              {adviceCopy.panelTitle}
            </h3>

            {alertLines.length > 0 && (
              <div
                className="mb-5 rounded-xl px-4 py-3.5"
                style={{ background: dangerSoft, border: `1px solid ${danger}` }}
              >
                <p className="flex items-center gap-2 text-sm font-bold" style={{ color: danger }}>
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3 2 20h20L12 3Z" />
                    <path d="M12 9.5v4.5M12 17.5h.01" />
                  </svg>
                  {adviceCopy.alertHead}
                </p>
                <ul className="mt-1.5 space-y-1 text-sm" style={{ color: textPrimary }}>
                  {alertLines.map((line, index) => (
                    <li key={`alert-${index}`}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {adviceByCategory.risk.length > 0 && (
              <div
                className="mb-6 rounded-xl px-4 py-3.5"
                style={{ background: dangerSoft, border: `1px solid ${danger}` }}
              >
                <p className="text-sm font-bold" style={{ color: danger }}>
                  {adviceCopy.riskTitle}
                </p>
                <ul className="mt-2 space-y-2 text-sm" style={{ color: textPrimary }}>
                  {adviceByCategory.risk.map((item) => (
                    <li key={item.key} className="flex gap-2.5">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: danger }}
                      />
                      <span>{resolveAdvice(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-3">
              {normalGroupDefs.map((group) => {
                const items = adviceByCategory[group.cat];
                if (items.length === 0) return null;
                return (
                  <div key={group.cat}>
                    <p
                      className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color: accent }}
                    >
                      {group.title}
                    </p>
                    <ul className="mt-3 space-y-3">
                      {items.map((item) => (
                        <li key={item.key} className="flex gap-2.5 text-sm" style={{ color: textPrimary }}>
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: accent }}
                          />
                          <span>{resolveAdvice(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7-day forecast */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h3
              className="font-display text-xl sm:text-2xl font-semibold"
              style={{ color: textPrimary }}
            >
              {t('forecastTitle')}
            </h3>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-tertiary)', color: textSecondary }}
            >
              {imperial ? '°F' : '°C'}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: dayCount }).map((_, index) => {
              const date = daily.time[index];
              const dateLabel = imperial
                ? `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`
                : `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
              const dayLabel =
                date === currentDay
                  ? t('today')
                  : date === tomorrow
                    ? t('tomorrow')
                    : weekdays[
                        new Date(
                          Date.UTC(
                            Number(date.slice(0, 4)),
                            Number(date.slice(5, 7)) - 1,
                            Number(date.slice(8, 10)),
                          ),
                        ).getUTCDay()
                      ];
              const dayKind = glyphKindFor(daily.weather_code[index] ?? 3, true);
              const rainProb = daily.precipitation_probability_max[index];
              const rainValue = rainProb == null ? '—' : `${Math.round(rainProb)}%`;

              return (
                <div
                  key={date}
                  className="flex-none w-28 sm:w-32 flex flex-col items-center rounded-2xl px-3 py-4"
                  style={cardStyle}
                >
                  <div className="text-sm font-semibold" style={{ color: textPrimary }}>
                    {dayLabel}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {dateLabel}
                  </div>
                  <div className="my-3" style={{ color: accent }}>
                    <WeatherGlyph kind={dayKind} size={30} />
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: textSecondary }}
                  >
                    <span style={{ color: 'var(--water-600)' }}>
                      <Droplet />
                    </span>
                    <span>{rainValue}</span>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold" style={{ color: textPrimary }}>
                      {tempC(daily.temperature_2m_max[index] ?? 0, imperial)}
                    </div>
                    <div className="text-xs" style={{ color: textMuted }}>
                      {tempC(daily.temperature_2m_min[index] ?? 0, imperial)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed" style={{ color: textMuted }}>
          {t('note')}
        </p>
      </div>
    </section>
  );
}
