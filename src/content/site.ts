// Site-wide copy. Facts about Jin come only from cv.md / article-digest.md (career-ops).

/** Must match `basePath` in next.config.ts: plain <a> links to files don't get it added automatically. */
export const BASE_PATH = "/reactportfolio";

export const site = {
  name: "Jinwoo Lim",
  identity: "Engineer · Inventor · Builder",
  subline: "I build AI products and the systems that ship them",
};

// PLACEHOLDERS until Jin supplies the real values. The deploy guard refuses to publish example.com.
export const contact = {
  email: "jin@example.com",
  resumePath: `${BASE_PATH}/resume.pdf`,
  bookingUrl: "https://calendar.example.com/jin-intro-call",
};
