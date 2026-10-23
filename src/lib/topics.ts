export type TopicCategory =
  | 'visit-prep'
  | 'beach-conditions'
  | 'family-activities'
  | 'nearby-trips'
  | 'beach-comparisons';

export interface TopicDef {
  /** URL segment under /[locale]/, e.g. "directions". */
  slug: string;
  /** Messages namespace key, e.g. "directionsPage". */
  namespace: string;
  category: TopicCategory;
  /** Primary cross-link partner (CTA at the bottom of the page). */
  partner?: string;
}

export const TOPIC_CATEGORIES: {
  id: TopicCategory;
  labelEn: string;
  labelZh: string;
}[] = [
  { id: 'visit-prep', labelEn: 'Plan Your Visit', labelZh: '到访准备' },
  { id: 'beach-conditions', labelEn: 'Beach & Conditions', labelZh: '海滩与状况' },
  { id: 'family-activities', labelEn: 'Family & Activities', labelZh: '家庭与活动' },
  { id: 'nearby-trips', labelEn: 'Nearby & Trips', labelZh: '附近与行程' },
  { id: 'beach-comparisons', labelEn: 'Compare Naples Beaches', labelZh: '那不勒斯海滩比较' },
];

export const TOPICS: TopicDef[] = [
  // Batch 1 — Visit prep & conditions
  { slug: 'directions', namespace: 'directionsPage', category: 'visit-prep', partner: 'parking' },
  { slug: 'amenities', namespace: 'amenitiesPage', category: 'visit-prep', partner: 'accessibility' },
  { slug: 'accessibility', namespace: 'accessibilityPage', category: 'visit-prep', partner: 'amenities' },
  { slug: 'playground', namespace: 'playgroundPage', category: 'visit-prep', partner: 'family-guide' },
  { slug: 'picnic-pavilions', namespace: 'picnicPavilionsPage', category: 'visit-prep', partner: 'amenities' },
  { slug: 'food-drink', namespace: 'foodDrinkPage', category: 'visit-prep', partner: 'picnic-pavilions' },
  { slug: 'beach-rules', namespace: 'beachRulesPage', category: 'visit-prep', partner: 'swimming-safety' },
  { slug: 'sunset', namespace: 'sunsetPage', category: 'visit-prep', partner: 'best-time-to-visit' },
  { slug: 'beach-conditions', namespace: 'beachConditionsPage', category: 'beach-conditions', partner: 'water-quality' },
  { slug: 'weather', namespace: 'weatherPage', category: 'beach-conditions', partner: 'best-time-to-visit' },
  { slug: 'tides', namespace: 'tidesPage', category: 'beach-conditions', partner: 'beach-conditions' },

  // Batch 2 — Conditions, family & activities
  { slug: 'water-quality', namespace: 'waterQualityPage', category: 'beach-conditions', partner: 'red-tide' },
  { slug: 'red-tide', namespace: 'redTidePage', category: 'beach-conditions', partner: 'water-quality' },
  { slug: 'family-guide', namespace: 'familyGuidePage', category: 'family-activities', partner: 'playground' },
  { slug: 'swimming-safety', namespace: 'swimmingSafetyPage', category: 'family-activities', partner: 'beach-rules' },
  { slug: 'beach-volleyball', namespace: 'beachVolleyballPage', category: 'family-activities', partner: 'amenities' },
  { slug: 'shelling', namespace: 'shellingPage', category: 'family-activities', partner: 'wildlife' },
  { slug: 'wildlife', namespace: 'wildlifePage', category: 'family-activities', partner: 'shelling' },
  { slug: 'photos', namespace: 'photosPage', category: 'family-activities', partner: 'sunset' },
  { slug: 'beach-day-budget', namespace: 'beachDayBudgetPage', category: 'family-activities', partner: 'parking' },
  { slug: 'best-time-to-visit', namespace: 'bestTimeToVisitPage', category: 'family-activities', partner: 'weather' },
  { slug: 'winter-guide', namespace: 'winterGuidePage', category: 'family-activities', partner: 'best-time-to-visit' },
  { slug: 'summer-guide', namespace: 'summerGuidePage', category: 'family-activities', partner: 'best-time-to-visit' },
  { slug: 'spring-break', namespace: 'springBreakPage', category: 'family-activities', partner: 'parking' },
  { slug: 'rainy-day-alternatives', namespace: 'rainyDayAlternativesPage', category: 'family-activities', partner: 'nearby-attractions' },

  // Batch 3 — Nearby, trips & comparisons
  { slug: 'history', namespace: 'historyPage', category: 'nearby-trips', partner: 'one-day-itinerary' },
  { slug: 'one-day-itinerary', namespace: 'oneDayItineraryPage', category: 'nearby-trips', partner: 'nearby-attractions' },
  { slug: 'nearby-attractions', namespace: 'nearbyAttractionsPage', category: 'nearby-trips', partner: 'one-day-itinerary' },
  { slug: 'rsw-airport-to-lowdermilk', namespace: 'rswAirportPage', category: 'nearby-trips', partner: 'car-free-visit' },
  { slug: 'car-free-visit', namespace: 'carFreeVisitPage', category: 'nearby-trips', partner: 'rsw-airport-to-lowdermilk' },
  { slug: 'restaurants-nearby', namespace: 'restaurantsNearbyPage', category: 'nearby-trips', partner: 'hotels-nearby' },
  { slug: 'hotels-nearby', namespace: 'hotelsNearbyPage', category: 'nearby-trips', partner: 'restaurants-nearby' },
  { slug: 'lowdermilk-vs-clam-pass', namespace: 'vsClamPassPage', category: 'beach-comparisons', partner: 'lowdermilk-vs-vanderbilt' },
  { slug: 'lowdermilk-vs-vanderbilt', namespace: 'vsVanderbiltPage', category: 'beach-comparisons', partner: 'lowdermilk-vs-clam-pass' },
  { slug: 'lowdermilk-vs-delnor-wiggins', namespace: 'vsDelnorWigginsPage', category: 'beach-comparisons', partner: 'lowdermilk-vs-naples-pier' },
  { slug: 'lowdermilk-vs-naples-pier', namespace: 'vsNaplesPierPage', category: 'beach-comparisons', partner: 'lowdermilk-vs-delnor-wiggins' },
  { slug: 'family-beaches-naples', namespace: 'familyBeachesNaplesPage', category: 'beach-comparisons', partner: 'accessible-beaches-naples' },
  { slug: 'accessible-beaches-naples', namespace: 'accessibleBeachesNaplesPage', category: 'beach-comparisons', partner: 'sunset-beaches-naples' },
  { slug: 'sunset-beaches-naples', namespace: 'sunsetBeachesNaplesPage', category: 'beach-comparisons', partner: 'family-beaches-naples' },
];

export const NAMESPACE_BY_SLUG: Record<string, string> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t.namespace])
);

export function getTopic(slug: string): TopicDef | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function topicsByCategory(category: TopicCategory): TopicDef[] {
  return TOPICS.filter((t) => t.category === category);
}

/** Internal links (excluding self) within the same category, used for the "related guides" grid. */
export function relatedTopics(slug: string, limit = 3): TopicDef[] {
  const self = getTopic(slug);
  if (!self) return [];
  return TOPICS.filter((t) => t.category === self.category && t.slug !== slug).slice(0, limit);
}
