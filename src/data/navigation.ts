export const navigation = [
  { path: "/", labelKey: "nav.home" as const, external: false },
  {
    path: "/2026/speakers",
    labelKey: "nav.speakers" as const,
    external: false,
  },
  {
    path: "/2026/timetable",
    labelKey: "nav.timetable" as const,
    external: false,
  },
  { path: "/2026/access", labelKey: "nav.access" as const, external: false },
  { path: "/2026/news", labelKey: "nav.news" as const, external: false },
  {
    path: "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/wiki/CoC",
    labelKey: "nav.coc" as const,
    external: true,
  },
] as const;
