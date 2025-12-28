export type EventStatus = 'upcoming' | 'past';

export interface Event {
  year: number;
  status: EventStatus;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  dateEn: string;
  venue: string;
  venueEn: string;
  ticketUrl?: string;
  pathJa: string; // e.g., '/ja/2026/'
  pathEn: string; // e.g., '/en/2026/'
}

export const events: Event[] = [
  {
    year: 2026,
    status: 'upcoming',
    title: 'FEC Fukuoka 2026',
    titleEn: 'FEC Fukuoka 2026',
    description: '未来のフロントエンドと徹底的に向き合う',
    descriptionEn: 'A conference for frontend engineers in Fukuoka, Japan',
    date: '2026年9月12日（土）',
    dateEn: 'September 12, 2026 (Sat)',
    venue: '福岡市内',
    venueEn: 'Fukuoka City',
    ticketUrl: 'https://example.com/tickets',
    pathJa: '/ja/2026/',
    pathEn: '/en/2026/',
  },
];

/**
 * Get upcoming events sorted by year (ascending)
 */
export function getUpcomingEvents(): Event[] {
  return events
    .filter((event) => event.status === 'upcoming')
    .sort((a, b) => a.year - b.year);
}

/**
 * Get past events sorted by year (descending)
 */
export function getPastEvents(): Event[] {
  return events
    .filter((event) => event.status === 'past')
    .sort((a, b) => b.year - a.year);
}

/**
 * Get event by year
 */
export function getEventByYear(year: number): Event | undefined {
  return events.find((event) => event.year === year);
}

/**
 * Get the latest upcoming event
 */
export function getLatestUpcomingEvent(): Event | undefined {
  const upcoming = getUpcomingEvents();
  return upcoming.length > 0 ? upcoming[0] : undefined;
}

// Site-wide constants
export const siteConfig = {
  url: 'https://frontend-conf.fukuoka.jp',
  social: {
    twitter: 'https://twitter.com/frontend_fuk',
    github: 'https://github.com/frontend-conf/fukuoka',
  },
  contact: {
    email: 'contact@frontend-conf.fukuoka.jp',
  },
} as const;
