/*
 * PROFILE — name, headline, intro, contact, social links, photos, resume.
 * Edit this file to change anything personal. Leave a field as "" to hide it.
 */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.profile = {
  name: "Shiv Singh Baghel",
  initials: "SB",
  location: "Bhopal, Madhya Pradesh, India",

  // Small label above the name. Set to "" to hide it.
  availability: "Open to fresher & internship roles in backend engineering",

  headline: "Building useful software, reliable backend systems, and developer tools.",
  intro:
    "Final-year B.Tech IT student who likes to build the whole thing: the API, the data, and how it gets deployed. Recent work includes a self-hosted CI/CD service and an npm developer tool.",

  // Short facts shown under the hero buttons. Only include facts you can back up.
  facts: [
    { value: "300+", label: "DSA problems solved on LeetCode" },
    { value: "B.Tech IT", label: "Class of 2027, 7th semester" },
  ],

  about: [
    "I'm a B.Tech Information Technology student at Indira Gandhi Engineering College, Sagar, based in Bhopal. I prefer building software end to end (the API, the database, and the way it gets shipped) over polishing one layer in isolation.",
    "That interest in how things run is why ShipFlow exists: a self-hosted CI/CD service where I had to think about sandboxing untrusted builds, immutable artifacts, and safe rollbacks. Repolet comes from the same instinct: a small npm CLI that copies just the part of a GitHub repository you need.",
    "Day to day I work with the MERN stack and REST APIs, and use Docker, GitHub Actions, and AWS (EC2, S3) to ship. I've solved 300+ DSA problems on LeetCode, and I'm looking for fresher and internship roles in backend engineering.",
  ],

  photos: {
    hero: {
      src: "assets/img/profile-800.webp",
      srcset: "assets/img/profile-480.webp 480w, assets/img/profile-800.webp 800w",
      width: 800,
      height: 800,
      alt: "Portrait of Shiv Singh Baghel in a teal checked shirt against a dark background",
    },
    about: {
      src: "assets/img/about-720.webp",
      srcset: "assets/img/about-480.webp 480w, assets/img/about-720.webp 720w",
      width: 720,
      height: 960,
      alt: "Shiv Singh Baghel typing on a laptop at a wooden table in a bright, modern workspace",
    },
  },

  // Put your email here to show a "Send an email" button and mailto link, e.g. "you@example.com".
  email: "",

  social: {
    github: "https://github.com/shivsingh78",
    linkedin: "", // add your LinkedIn profile URL to show it
  },

  // The Download Resume buttons stay hidden until this PDF actually exists.
  resume: {
    path: "assets/resume/Shiv_Singh_Baghel_Resume.pdf",
    downloadName: "Shiv_Singh_Baghel_Resume.pdf",
  },

  // Fill in once you have a domain, e.g. "https://shivsingh.dev/". Used for canonical + Open Graph URLs.
  siteUrl: "",
};
