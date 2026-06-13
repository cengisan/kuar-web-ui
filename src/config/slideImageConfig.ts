/** Marketing mockups are 1920px — sizes must cover 2x DPR, quality must stay high for UI text. */
export const SLIDE_IMAGE_QUALITY = 95;

export const SLIDE_SIZES = {
  heroMain: "(max-width: 1280px) 100vw, 1920px",
  heroMobile: "(max-width: 1024px) 55vw, 880px",
  capabilityMain: "(max-width: 1280px) 100vw, 1920px",
  capabilityMobile: "(max-width: 1024px) 55vw, 800px",
  galleryWeb: "(max-width: 1280px) 100vw, 1920px",
  galleryMobile: "(max-width: 1280px) 100vw, 1200px",
  operations: "(max-width: 1280px) 100vw, 1920px",
} as const;
