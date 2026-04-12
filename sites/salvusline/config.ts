export const breederConfig = {
  slug: "salvusline",
  domain: "salvusline.com",
  locale: "en",
  cfPagesProject: "salvusline-site",
  theme: {
    primaryColor: "#EC6B15",
  },
  features: {
    hallOfFame: true,
    litters: false,
  },
} as const;

export type BreederConfig = typeof breederConfig;
