export const site = {
  title: "FEC Fukuoka",
  titleEn: "FEC Fukuoka",
  description:
    "Web に関わるすべての人のためのフロントエンドカンファレンス in 福岡",
  descriptionEn:
    "A frontend conference in Fukuoka for everyone involved in Web",
  url: "https://frontend-conf.fukuoka.jp",
  year: 2026,
  date: "2026年9月12日（土）",
  dateEn: "September 12, 2026 (Sat)",
  venue: "九州産業大学 12号館",
  venueEn: "Kyushu Sangyo University, Building 12",
  venueDetails: "情報科学部棟",
  venueDetailsEn: "Information Science Building",
  address: "福岡県福岡市東区松香台2-3-1",
  addressEn: "2-3-1 Matsukadai, Higashi-ku, Fukuoka City, Fukuoka",
  access: {
    jr: {
      station: "JR九産大前駅",
      stationEn: "JR Kyusan-Daimae Station",
    },
    bus: {
      stop: "西鉄バス 九産大南口",
      stopEn: "Nishi-Tetsu Bus Kyusan University South Exit",
    },
  },
  ticketUrl: "https://example.com/tickets", // TODO
  social: {
    twitter: "https://x.com/fec_fukuoka",
    github: "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp",
    wiki: "https://github.com/fec-fukuoka/frontend-conf.fukuoka.jp/wiki",
  },
  contact: {
    email: "contact.fec.fukuoka@gmail.com",
  },
} as const;
