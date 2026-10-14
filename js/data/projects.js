/*
 * PROJECTS — one object per project. Cards and the "View details" dialog are rendered from this list.
 * Order in this array = order on the page.
 *
 * To add a project: copy an entry, change the fields, and (optionally) drop an image in assets/projects/.
 * Only `id`, `slug`, `name` and `shortDescription` are required. Every other field is optional, and
 * the page simply skips whatever is missing.
 *
 * Fields
 *   id, slug, name            identifiers (slug is used in the URL: #project=<slug>)
 *   category                  small label on the card, e.g. "Developer tool"
 *   status                    short honest status text, e.g. "Current project"
 *   featured                  true = shown in the large "Featured" grid, false = "More projects"
 *   placeholder               true = shows a "details coming soon" marker. Remove once filled in.
 *   shortDescription          one or two sentences for the card
 *   fullDescription           paragraph for the Overview in the dialog
 *   problem, solution         paragraphs for the dialog
 *   features                  string[]
 *   architecture              paragraph describing the architecture
 *   pipeline                  string[] of stage names, drawn as a flow (card preview + dialog)
 *   terminal                  string[] of command lines, drawn as a terminal preview
 *   technologies              string[]  tags
 *   engineeringHighlights     string[]  decisions that are actually implemented
 *   tradeoffs                 string[]  honest limitations / trade-offs
 *   challenges                string[]
 *   lessonsLearned            string[]
 *   image                     { src, alt } — 16:9 screenshot, e.g. assets/projects/shipflow.webp
 *   githubUrl, liveUrl, npmUrl, documentationUrl   full https:// URLs. Leave out when unavailable.
 */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.projects = [
  {
    id: "shipflow",
    slug: "shipflow",
    name: "ShipFlow",
    category: "Self-hosted CI/CD",
    status: "Working demo · single-owner by design",
    featured: true,
    shortDescription:
      "A self-hosted, CLI-first CI/CD service for static sites. It builds a Git repository in an isolated container, stores an immutable artifact in S3, checks the release over HTTP, and only then makes it live, with one-command rollback.",
    fullDescription:
      "ShipFlow takes a Git repository for any Node.js project whose build writes dist/, build/ or out/. It clones, installs, builds and tests the project inside a throwaway container, uploads the result to S3, verifies it, and switches the live site over. Earlier releases can be restored with a single command.",
    problem:
      "Deploying a site safely means running someone's install and build scripts, which is untrusted code, and only sending traffic to the result once it has been proven good. Doing that yourself means designing isolation, artifact storage, verification, and rollback rather than just calling a hosted service.",
    solution:
      "A CLI talks to a token-protected Express API. Releases are queued with Redis and BullMQ and processed by a worker through six stages: Prepare, Build, Test, Deploy, Verify, Activate. State, logs and notifications live in PostgreSQL, artifacts live in a private S3 bucket, and a small site server serves whichever release is active.",
    features: [
      "CLI commands: deploy, releases, status, logs, rollback",
      "Six-stage release pipeline where a failure before Activate never touches the live site",
      "Detects npm, pnpm or yarn and uses the frozen lockfile install",
      "Tests with no test script are recorded as SKIPPED, never PASSED (optionally fail them)",
      "Per-stage logs (last 64 KB of each step) and recorded notifications",
      "Rollback to any earlier successful release, with automatic revert if the live check fails",
      "Unit tests plus a full-stack end-to-end suite, both run in GitHub Actions",
    ],
    architecture:
      "CLI → Express API → PostgreSQL (releases, logs, notifications, activations) and Redis + BullMQ → Worker → S3 (releases/<id>/source and releases/<id>/build). A separate site server on :8080 serves the active release from S3. Everything runs with Docker Compose on a single VM.",
    pipeline: ["Prepare", "Build", "Test", "Deploy", "Verify", "Activate"],
    technologies: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Docker",
      "AWS S3",
      "GitHub Actions",
    ],
    engineeringHighlights: [
      "Each release builds in its own sandbox container: no ShipFlow secrets, no host mounts, no Docker socket, uid 1000, all capabilities dropped, and memory, CPU, PID and per-step time limits.",
      "The network is cut after dependencies install, so build and test steps run offline.",
      "The worker never runs repository code. It only clones, copies files in, and copies the build output out. Symlinks are skipped.",
      "Artifacts are immutable in S3. Going live is one atomic insert into an activations table, so the site is never empty.",
      "The candidate is verified through the real serving code (status, content type, release header) before it is activated, and the previous release is restored if the live check fails.",
      "Rollback only moves the active pointer. The target must exist, be successful, not already be active, and still have its artifacts.",
      "A probe project in the test suite tries to read secrets, worker files and internal services from inside every stage, and the release fails if it finds any.",
    ],
    tradeoffs: [
      "The worker mounts the Docker socket to create sandboxes. It is trusted code, but a compromise of it would expose the host.",
      "The sandbox has outbound internet while dependencies install. On EC2 the docs recommend IMDSv2 with hop limit 1 so containers cannot reach instance credentials.",
      "One shared API token for all operators, with no per-user accounts. It is meant as a single-owner or trusted-team demo, not a public multi-tenant service.",
    ],
    githubUrl: "https://github.com/shivsingh78/shipflow",
  },

  {
    id: "repolet",
    slug: "repolet",
    name: "Repolet",
    category: "Developer tool",
    status: "npm package",
    featured: true,
    shortDescription:
      "A small CLI that copies a GitHub repository, or just one subfolder of it, straight to your machine, with no ZIP file and no .git history.",
    fullDescription:
      "Repolet takes a GitHub URL and copies the repository, or any folder inside it, into a local directory. It works on branches, handles binary files, and refuses to overwrite a destination folder that already exists.",
    problem:
      "When you only need one folder from a large repository, cloning the whole thing brings along everything else, including the full git history.",
    solution:
      "Point Repolet at a repository URL or a /tree/<branch>/<folder> URL and it copies only that part. Public repositories need no setup; private ones work with an optional GITHUB_TOKEN.",
    features: [
      "Copy a full repository or a selected subfolder",
      "Recursively copies nested directories",
      "Handles binary files such as PNG, PDF, MP3 and SVG",
      "Supports GitHub branches",
      "Optional GITHUB_TOKEN authentication for private repositories",
      "Protects existing destination folders",
      "No ZIP files and no .git history",
    ],
    terminal: [
      "$ npx repolet https://github.com/expressjs/express/tree/master/lib",
      "$ repolet https://github.com/expressjs/express/tree/master/lib my-lib",
    ],
    architecture:
      "A Node.js command-line tool distributed through npm. Install it globally with npm install -g repolet, or run it without installing through npx. Requires Node.js 18+. Licensed MIT.",
    technologies: ["Node.js", "npm", "CLI"],
    engineeringHighlights: [
      "Distributed as a reusable package: one install command, or zero-install through npx.",
      "Existing destination folders are protected rather than overwritten.",
      "Private-repository access uses a GitHub fine-grained token with read-only Contents permission.",
    ],
    // Verify this URL once the package is published; remove the field if it is not.
    npmUrl: "https://www.npmjs.com/package/repolet",
    // githubUrl: "https://github.com/shivsingh78/repolet",   // add the real repository URL
  },

  {
    id: "boxify",
    slug: "boxify",
    name: "Boxify",
    category: "Current project",
    status: "Current project",
    featured: true,
    placeholder: true,
    shortDescription: "Current project. Description, stack and screenshots to be added.",
  },

  {
    id: "niyamsetu",
    slug: "niyamsetu",
    name: "NiyamSetu",
    category: "Current project",
    status: "Current project",
    featured: true,
    placeholder: true,
    shortDescription: "Current project. Description, stack and screenshots to be added.",
  },

  {
    id: "foodify",
    slug: "foodify",
    name: "Foodify",
    category: "Full-stack web app",
    featured: false,
    placeholder: true,
    shortDescription: "A food delivery platform. Features and stack details to be added.",
  },

  {
    id: "ecommerce-store",
    slug: "ecommerce-store",
    name: "E-commerce store",
    category: "Full-stack web app",
    featured: false,
    placeholder: true,
    shortDescription: "An e-commerce store. Features and stack details to be added.",
  },
];
