// Site-wide copy. Facts about Jin come only from cv.md / article-digest.md (career-ops).

/** Must match `basePath` in next.config.ts: plain <a> links to files don't get it added automatically. */
export const BASE_PATH = "/reactportfolio";

/** The live address on GitHub Pages: sitemap URLs and Person data are absolute under it. */
export const SITE_URL = `https://j1nnnn.github.io${BASE_PATH}/`;

export const site = {
  name: "Jinwoo Lim",
  identity: "Engineer · Inventor · Builder · Architect",
  subline: "An engineer first: I solve real-world problems, with the business sense to lead",
};

// Public contact details (Jin, 2026-11-09). Never add a phone number: the deploy guard refuses one.
export const contact = {
  email: "devj49i@outlook.com",
  resumePath: `${BASE_PATH}/resume.pdf`,
  /** No booking link yet: the "Book a call" button stays hidden until this is set. */
  bookingUrl: null as string | null,
};
