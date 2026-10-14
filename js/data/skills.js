/*
 * SKILLS — grouped by category.
 *
 * To add a skill: add { name: "..." } to a category's `items`.
 * To add a category: add a new { id, title, items } object.
 *
 * status (optional):
 *   "demonstrated" (default)  used in a project or in real work
 *   "learning"                currently exploring; shown with a dashed tag
 * note (optional): small tooltip text explaining where you used it.
 */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.skills = [
  {
    id: "languages",
    title: "Languages",
    items: [
      { name: "JavaScript" },
      { name: "SQL", note: "PostgreSQL in ShipFlow" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    items: [{ name: "React" }, { name: "HTML & CSS" }],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    items: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "REST APIs" },
      { name: "BullMQ job queues", note: "ShipFlow release worker" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    items: [{ name: "MongoDB" }, { name: "PostgreSQL" }, { name: "Redis" }],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    items: [
      { name: "Docker" },
      { name: "Docker Compose" },
      { name: "GitHub Actions" },
      { name: "AWS EC2" },
      { name: "AWS S3" },
    ],
  },
  {
    id: "tooling",
    title: "Developer tools",
    items: [
      { name: "Git & GitHub" },
      { name: "npm package publishing", note: "Repolet" },
      { name: "CLI development" },
      { name: "pnpm" },
    ],
  },
];
