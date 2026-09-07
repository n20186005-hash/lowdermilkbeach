/**
 * Rules engine that turns the day's coastal forecast into short, actionable
 * suggestions for beach visitors. Output is category-tagged message keys that
 * are translated per locale; an entry is only ever emitted when its condition
 * matches, so ordinary days stay clean and focused.
 */

export type AdviceCategory = 'wardrobe' | 'activity' | 'gear' | 'risk';

export interface AdviceItem {
  category: AdviceCategory;
  /** Key inside `weatherTide.advice` of the locale messages. */
  key: string;
  /** Optional interpolation values for the message. */
  params?: Record<string, string>;
}

export interface AdviceContext {
  /** Current WMO weather code at the beach. */
  code: number;
  /** 1 during daylight, 0 at night. */
  isDay: number;
  /** Today's max / min air temperature in Celsius. */
  tMaxC: number | null;
  tMinC: number | null;
  /** Today's max precipitation probability (0-100). */
  precipProbPct: number | null;
  /** Today's max UV index. */
  uvMax: number | null;
  /** Today's max wind speed in km/h. */
  windMaxKmh: number | null;
  /** Latest near-coast sea temperature in Celsius. */
  seaTempC: number | null;
  /** Locale-formatted sea temperature, e.g. "32°C". */
  seaTempDisplay: string;
  /** Latest near-coast wave height in metres. */
  waveM: number | null;
}

const SUN = new Set([0]);
const SUNNY_MILD = new Set([0, 1, 2]);
const OVERCAST = new Set([3]);
const DRIZZLE = new Set([51, 53, 55, 56, 57, 61, 80]);
const RAIN_HEAVY = new Set([63, 65, 66, 67, 81, 82]);
const RAIN_ACTIVE = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]);
const THUNDER = new Set([95, 96, 99]);
const SNOW = new Set([71, 73, 75, 77, 85, 86]);
const FOG = new Set([45, 48]);

/** Approximate Beaufort scale from km/h. */
function beaufort(kmh: number | null): number {
  if (kmh === null || !Number.isFinite(kmh)) return 0;
  const thresholds = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  let bft = 0;
  for (const t of thresholds) {
    if (kmh >= t) bft += 1;
  }
  return bft;
}

const num = (v: number | null | undefined) =>
  v === null || v === undefined || !Number.isFinite(v) ? null : v;

const CAPS: Record<Exclude<AdviceCategory, 'risk'>, number> = {
  wardrobe: 3,
  activity: 3,
  gear: 4,
};

/**
 * Evaluate all rules. Entries never duplicate a key, and the wardrobe /
 * activity / gear groups are capped so the panel stays scannable; risk rules
 * are always shown in full since safety matters most.
 */
export function buildDailyAdvice(ctx: AdviceContext): AdviceItem[] {
  const code = ctx.code;
  const tMax = num(ctx.tMaxC);
  const tMin = num(ctx.tMinC);
  const precip = num(ctx.precipProbPct);
  const uv = num(ctx.uvMax);
  const wind = num(ctx.windMaxKmh);
  const seaTemp = num(ctx.seaTempC);
  const wave = num(ctx.waveM);
  const bft = beaufort(wind);

  const rainyNow = RAIN_ACTIVE.has(code) || SNOW.has(code) || THUNDER.has(code);
  const calm = wave !== null && wave < 0.8;
  const pleasantWater = seaTemp !== null && seaTemp >= 24;

  const result: AdviceItem[] = [];
  const seen = new Set<string>();
  const emit = (category: AdviceCategory, key: string, params?: Record<string, string>) => {
    if (seen.has(key)) return;
    seen.add(key);
    result.push({ category, key, ...(params ? { params } : {}) });
  };

  /* Rain / thunderstorms — the most disruptive, handled first. */
  if (THUNDER.has(code)) {
    emit('risk', 'boltRisk');
    emit('activity', 'boltPlay');
  } else if (RAIN_HEAVY.has(code)) {
    emit('wardrobe', 'rainHeavyWardrobe');
    emit('risk', 'rainRisk');
    emit('activity', 'rainPlayHeavy');
    emit('gear', 'rainGearHeavy');
  } else if (DRIZZLE.has(code)) {
    emit('wardrobe', 'drizzleWardrobe');
    emit('activity', 'drizzlePlay');
    emit('gear', 'drizzleGear');
  } else if (SNOW.has(code)) {
    emit('wardrobe', 'snowWardrobe');
    emit('gear', 'snowGear');
  } else if (precip !== null && precip >= 60) {
    emit('wardrobe', 'chanceWardrobe');
    emit('activity', 'chancePlay');
    emit('gear', 'chanceGear');
  }

  /* Strong wind. */
  if (bft >= 7) {
    emit('risk', 'windRisk');
    emit('activity', 'windPlayStrong');
  } else if (bft >= 5) {
    emit('wardrobe', 'windWardrobe');
    emit('activity', 'windPlay');
    emit('gear', 'windGear');
  }

  /* Rough water. */
  if (wave !== null && wave >= 2) {
    emit('risk', 'waveRiskHigh');
    emit('activity', 'wavePlayHigh');
  } else if (wave !== null && wave >= 1) {
    emit('risk', 'waveRiskMed');
  }

  /* Cold water. */
  if (seaTemp !== null && seaTemp < 20) {
    emit('risk', 'coldSeaRisk');
  } else if (seaTemp !== null && seaTemp < 23) {
    emit('wardrobe', 'coolSeaWardrobe');
  }

  /* Perfect swimming conditions. */
  if (
    !rainyNow &&
    bft < 5 &&
    wave !== null &&
    wave < 0.8 &&
    seaTemp !== null &&
    seaTemp >= 24 &&
    ctx.isDay === 1 &&
    SUNNY_MILD.has(code)
  ) {
    emit('activity', 'swimActivity', { temp: ctx.seaTempDisplay });
    emit('gear', 'swimGear');
  }

  /* Fog. */
  if (FOG.has(code)) {
    emit('risk', 'fogRisk');
    emit('activity', 'fogPlay');
    emit('gear', 'fogGear');
  }

  /* Clear-ish sky / cloudiness (only on fair, calm weather). */
  if (SUN.has(code) && !rainyNow && bft < 7) {
    // Hot days already carry their own dressing tip; skip the generic one.
    if (tMax === null || tMax < 32) {
      emit('wardrobe', 'sunWardrobe');
    }
    emit('activity', 'sunActivity');
  }
  if (OVERCAST.has(code) && !rainyNow) {
    emit('activity', 'cloudActivity');
  }

  /* Temperature. */
  if (tMax !== null && tMax >= 32) {
    emit('wardrobe', 'hotWardrobe');
    emit('activity', 'hotActivity');
    emit('gear', 'hotGear');
  }
  if (tMax !== null && tMax <= 10) {
    emit('wardrobe', 'coldWardrobe');
    emit('gear', 'coldGear');
  }
  if (tMax !== null && tMin !== null && tMax - tMin > 8) {
    emit('wardrobe', 'deltaWardrobe');
  }

  /* UV — only when actually strong. */
  if (uv !== null && uv >= 5) {
    emit('gear', 'uvGear');
  }

  /* Enforce the per-group caps while keeping risk unbounded. */
  const counts: Record<Exclude<AdviceCategory, 'risk'>, number> = {
    wardrobe: 0,
    activity: 0,
    gear: 0,
  };
  return result.filter((item) => {
    if (item.category === 'risk') return true;
    const cat = item.category;
    const current = counts[cat];
    counts[cat] = current + 1;
    return current < CAPS[cat];
  });
}
