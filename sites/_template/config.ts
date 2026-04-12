// Copy this file to sites/{slug}/config.ts when onboarding a new breeder.
export const breederConfig = {
  slug: "replace-with-slug",
  domain: "replace-with-domain.com",
  locale: "en",
  cfPagesProject: "replace-with-slug-site",
  theme: {
    primaryColor: "#EC6B15",
  },
  features: {
    hallOfFame: true,
    litters: false,
  },
} as const;

export type BreederConfig = typeof breederConfig;
