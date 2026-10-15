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
 *   futureImprovements        string[]
 *   image                     { src, alt } — 16:9 screenshot, e.g. assets/projects/shipflow.webp
 *   githubUrl, liveUrl, npmUrl, documentationUrl   full https:// URLs. Leave out when unavailable.
 */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.projects = [
  {
    id: "shipflow",
    slug: "shipflow",
    image: { src: "assets/projects/shipflow.webp", alt: "ShipFlow release pipeline: Prepare, Build, Test, Deploy, Verify, Activate." },
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
    image: { src: "assets/projects/repolet.webp", alt: "Repolet command copying a single folder from a GitHub repository with npx." },
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
    image: { src: "assets/projects/boxify.webp", alt: "Boxify project banner." },
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
    image: { src: "assets/projects/niyamsetu.webp", alt: "NiyamSetu project banner." },
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
    category: "Full-stack food delivery platform",
    featured: false,
    shortDescription:
      "A full-stack food delivery platform that connects customers, restaurant owners, and delivery partners through one ordering and delivery workflow, with REST APIs, real-time updates over Socket.IO, location-aware delivery dispatch, and role-based access control.",
    fullDescription:
      "Foodify connects customers, restaurant owners, delivery partners, and administrators through a unified platform. It focuses on more than food ordering by addressing backend engineering challenges such as delivery assignment, real-time communication, authentication, background processing, and failure recovery. Customers browse restaurants, place orders, and track progress; restaurant owners manage incoming orders; delivery partners receive offers and handle assigned deliveries; administrators manage privileged operations.",
    problem:
      "Delivering an order involves more than saving it. The system has to find an eligible, nearby delivery partner, offer them the job for a limited time, avoid assigning the same order twice, and keep every role's screen up to date as the order moves along.",
    solution:
      "A modular backend separates API routes, controllers, business logic, data models, and real-time communication. The frontend handles user interaction, while the backend owns business rules, order transitions, dispatch decisions, and data persistence.",
    features: [
      "Order management: customer ordering and restaurant-side order processing, with backend-validated status transitions and role-specific operations",
      "Smart delivery dispatch: eligibility checks using availability and location, candidate selection based on location and workload, time-limited offers and partner acceptance, dispatch retries and failure diagnostics",
      "Real-time communication: Socket.IO events targeted to the relevant users and roles, persisted notifications, and reconnection and refresh strategies to recover missed updates where implemented",
      "Authentication and authorization: role-based access for customers, restaurant owners, delivery partners, and administrators, with backend authorization and request validation",
      "Backend infrastructure: MongoDB and Mongoose for data, Redis for caching and rate limiting where configured, shared validation in a PNPM workspace, Docker-based deployment configuration, and automated tests",
    ],
    architecture:
      "Frontend → REST API → Controllers → Business Services → MongoDB / Redis / External Services. Socket.IO provides a separate real-time path between the backend and connected clients. Keeping UI and business rules apart makes the system easier to test, maintain, and extend.",
    technologies: [
      "React",
      "Vite",
      "Node.js",
      "Express.js",
      "TypeScript",
      "MongoDB",
      "Redis",
      "Socket.IO",
      "Docker",
      "PNPM",
    ],
    engineeringHighlights: [
      "Modular backend architecture using routes, controllers, services, and models.",
      "Location-aware dispatch and time-limited delivery offers.",
      "Real-time communication with Socket.IO.",
      "Request validation and role-based authorization.",
      "Background-job handling and retry-oriented workflows.",
      "Docker deployment configuration and automated testing.",
    ],
    challenges: [
      "Reliable delivery assignment: a partner must satisfy eligibility rules before receiving an offer, so the system handles location freshness, availability, existing workload, offer expiration, and assignment conflicts.",
      "Real-time events and persistence: saving an update and delivering an event to a connected browser are separate operations, so notification and dispatch-handling mechanisms reduce missed updates and support debugging.",
      "Failure diagnosis and recovery: dispatch jobs can hit unavailable partners, stale locations, query failures, or expired offers; diagnostic logs and retries help identify failures and recover when safe.",
      "Production configuration: database connectivity, authentication, external services, and deployment settings must be verified independently from local development tests.",
    ],
    lessonsLearned: [
      "Building Foodify strengthened my understanding of full-stack development and backend system design, including asynchronous processing, geospatial queries, real-time events, concurrent operations, database consistency, and production debugging.",
      "It taught me to distinguish between a feature passing local tests and the same feature being verified in a deployed environment.",
    ],
    futureImprovements: [
      "More comprehensive dispatch observability and operational dashboards.",
      "Stronger production verification for delivery assignment and real-time updates.",
      "More detailed payment reconciliation and refund workflows.",
      "Restaurant inventory management and availability controls.",
      "Historical demand analysis and restaurant analytics.",
    ],
    image: {
      src: "assets/projects/foodify.webp",
      alt: "Foodify screens: customer home with food categories and nearby shops, restaurant owner sales dashboard, delivery partner dashboard, and admin role applications.",
    },
    githubUrl: "https://github.com/shivsingh78/Foodify",
    liveUrl: "https://foodify-student-6acf30a9f2eb2405ff9d6e9e.kuros.cryboy.in/",
  },

  {
    id: "ecommerce-store",
    slug: "ecommerce-store",
    image: { src: "assets/projects/ecommerce-store.webp", alt: "E-Store screens: home hero, all collections with filters, about page, and contact page." },
    name: "E-commerce store",
    category: "Full-stack MERN store",
    featured: false,
    shortDescription:
      "A MERN-stack clothing store with a customer storefront, a separate admin dashboard, and a REST API. It has product filtering and search, a per-user cart, cash-on-delivery and Razorpay checkout, Google sign-in, and a voice-controlled search assistant.",
    fullDescription:
      "E-Store is a full-stack shopping platform made of three apps: a React storefront for customers, a React admin panel for the store owner, and an Express API backed by MongoDB. Customers browse collections, filter by category and sub-category, sort by price, pick a size, manage a cart, and pay on delivery or online. The admin adds products with images, removes them, and moves orders through their statuses.",
    problem:
      "An online store needs more than a product page: accounts, a cart that survives between sessions, safe handling of payments, image storage, and a separate place for the owner to manage stock and orders without touching the database.",
    solution:
      "A Node.js and Express API exposes auth, product, cart and order routes. User and admin sessions use JWTs in HTTP-only cookies. Product images are uploaded through Multer to Cloudinary, carts are stored on the user document in MongoDB, and Razorpay orders are created on the server and confirmed by re-fetching the order status from Razorpay.",
    features: [
      "Storefront with home, collections, product detail with size selection, related products, cart, checkout and order history",
      "Filter by category and sub-category, sort by price, and search by product name",
      "Email and password registration and login, plus Google sign-in through Firebase",
      "Per-user cart stored in MongoDB, keyed by product and size",
      "Checkout with cash on delivery or Razorpay, with server-side payment verification",
      "Admin dashboard to add products with four images, list and remove products, and update order status",
      "Voice assistant that opens pages and runs searches from spoken commands",
      "Separate deployments for the storefront, admin panel and API, with CORS limited to known origins",
    ],
    architecture:
      "React storefront and React admin panel → Express REST API (auth, product, cart, order routes) → controllers → MongoDB through Mongoose (users, products, orders). Cloudinary stores product images, Razorpay handles online payments, and Firebase handles Google sign-in. The three apps are deployed separately.",
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Razorpay",
      "Cloudinary",
      "Firebase Auth",
    ],
    engineeringHighlights: [
      "Passwords are hashed with bcrypt, and sessions use HTTP-only, secure, SameSite=None cookies.",
      "Separate middleware for customer routes and admin routes.",
      "Razorpay payments are confirmed on the server by fetching the order from Razorpay, rather than trusting the browser.",
      "Cart quantities are stored per product and size, so the same item in two sizes stays separate.",
      "Image uploads go through Multer to Cloudinary, and the product record only stores the returned URLs.",
      "Request input is checked with validator for email format and a minimum password length.",
    ],
    tradeoffs: [
      "Order totals are sent by the client. A production version should recalculate the amount from product prices on the server.",
      "Cart updates read and write the whole cart object, so two quick updates from different tabs could overwrite each other.",
      "There are no automated tests yet.",
      "Admin access is a single account configured through environment variables.",
    ],
    futureImprovements: [
      "Server-side price calculation and stock checks at checkout.",
      "Admin-only enforcement on every order-management route.",
      "Automated API tests and a CI pipeline.",
      "Pagination and server-side filtering for large catalogues.",
    ],
    lessonsLearned: [
      "Building the store taught me how authentication, cart state and payments fit together across a separate frontend, admin app and API.",
      "Working with Razorpay showed why payment results must be verified on the server.",
      "Reviewing my own code afterwards showed me where trusting client input is risky, which I list above as planned fixes.",
    ],
    githubUrl: "https://github.com/shivsingh78/E-commerce_store",
    liveUrl: "https://e-store-frontend-4cvi.onrender.com",
  },
];
