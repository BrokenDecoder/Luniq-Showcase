# Worklog: Luniq Showcase Website

## Session Summary

### 1. Liquid Jelly & Smooth Velocity Scroll Engine
- Installed and integrated `lenis` for smooth continuous velocity scrolling.
- Developed `useJellyScroll` hook with:
  - Real-time velocity-to-physics mapping (`--jelly-skew`, `--jelly-scale-y`, `--jelly-scale-x`).
  - Elastic spring recovery when scrolling slows down.
  - 10% magnetic snap on scroll pause with quartic deceleration glide ($1 - (1 - t)^4$).
  - Full bidirectional reverse scroll compatibility.

### 2. Left Edge-Hover Navigation Drawer
- Converted `ScrollWheelNav` into an interactive edge-peek drawer:
  - Hidden by default to maximize content view.
  - Automatically slides out when hovering the left edge ($\le 180\text{px}$) or ambient pill indicator.
  - Automatically retracts when moving away from the edge.
  - Remains isolated/hidden on the Hero and Reviews landing stages.

### 3. React Bits Component Integrations
- **`<SplitText />`**:
  - Integrated in the Features section headline (*"Everything you need. / Nothing you don't."*) with bidirectional character-by-character 3D flipping.
- **`<BlurText />`**:
  - Integrated in the Details section headline (*"Small things, / done right."*) with staged Gaussian de-blurring and multi-directional entry.
- **`<DepthCarousel />`**:
  - Integrated in the Showcase section displaying a 3D depth stack with 5 real high-resolution screenshots from `/public/carousel/` (`1.png` to `5.png`).
  - Set to exact native aspect ratio ($1200\text{px} \times 646\text{px}$) with `object-fit: contain` to prevent corner/edge cuts.

### 4. Layout De-Congestion
- **Showcase Section**: Partitioned into two dedicated $100\text{vh}$ pages:
  - Page 1 (`#showcase`): Overview `<FoldText />` typography with modern `Outfit` & `Plus Jakarta Sans` font pairing.
  - Page 2 (`#showcase-stage`): Grand 3D Carousel Showcase stage with scale-in entrance.
- **Features Section**: Partitioned into two dedicated $100\text{vh}$ pages:
  - Page 1 (`#features`): Overview `<SplitText />` headline with no awkward line breaks.
  - Page 2 (`#features-cards`): Spacious $2 \times 2$ glassmorphic feature card grid.

### 5. SEO Optimization & Search Indexing
- **Semantic Metadata & Canonical URL**:
  - Configured title: *"Luniq — Minimalist, Ad-Free Desktop Music Player"*.
  - Added targeted keywords, descriptive summary, author, and `canonical` tag targeting `https://luniq.vercel.app/`.
- **Social Sharing (OpenGraph & Twitter Cards)**:
  - Added `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`.
  - Added `twitter:card` (summary_large_image) and social tags.
- **Structured Data (Schema.org / JSON-LD)**:
  - Injected `SoftwareApplication` structured schema with OS platforms (Windows, macOS, Linux), applicationCategory (`MultimediaApplication`), price (`0 USD`), and author info for Google Rich Snippets.
- **Crawler Assets**:
  - Generated [public/robots.txt](file:///d:/Luniq%20Website/public/robots.txt) allowing search indexing.
  - Generated [public/sitemap.xml](file:///d:/Luniq%20Website/public/sitemap.xml) with section priority mapping.

### 6. Source Control & Vercel Readiness
- Initialized git repository on branch `main`.
- Created [.gitignore](file:///d:/Luniq%20Website/.gitignore) excluding `node_modules`, `dist`, `.gemini`, `.claude`, `.vscode`, and editor artifacts.
- Removed `.claude/` tracking from the repository.
- Created [vercel.json](file:///d:/Luniq%20Website/vercel.json) with:
  - SPA fallback rewrites (`/(.*) -> /index.html`).
  - Immutable 1-year CDN caching for static bundles and carousel images (`/assets/*`, `/carousel/*`).
  - Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Pushed complete codebase and deployment configuration to `https://github.com/BrokenDecoder/Luniq-Showcase.git` on branch `main`.

---

## Session: 2026-08-19 (Team Section & Member Spotlights)
- Policy established: Git commits & pushes are strictly executed ONLY when the user explicitly requests them.
- Updated Team Member order & profiles ([src/components/TeamSection.jsx](file:///d:/Luniq%20Website/src/components/TeamSection.jsx), [src/components/TeamSection.css](file:///d:/Luniq%20Website/src/components/TeamSection.css)):
  - **1st Member**: **Saraans .** (`saraansx`), Core Developer (India, `saraans.bali@icloud.com`, avatar from GitHub).
  - **2nd Member**: **xAshu / BrokenDecoder**, Lead Architect (Audio engine, WebGL shaders, Spicetify theme foundation).
  - **3rd Member**: Design & Motion systems slot.
- Policy established: Git commits & pushes are strictly executed ONLY when the user explicitly requests them.
- Updated all references across team profiles to explicitly specify **Luniq Music**:
  - Core Developer works: "Full-stack desktop features & Luniq Music core modules".
  - Lead Architect works: "Luniq Music theme architecture & MoltenMetal fluid reactive background".
  - Updated all Discord links directly to official Luniq Music server `https://discord.gg/TardrVJT9N`.
- Verified production build (`npm run build`) completed with 0 errors.



