# TARS Cloud Website

The official public website, technical documentation hub, and download distribution portal for TARS Cloud (`tars.cloud`).

## Language

**Hero Terminal**:
The 100vh viewport retro-cyberpunk terminal component featuring ASCII `TARS_LETTERS` typewriter sequencing, Matrix scramble-decrypt subtitle animations, glowing taglines, and breathing cyan CTA triggers.
_Avoid_: standard hero banner, generic splash page

**Zola Engine**:
The Rust-native static site generator compiling CommonMark into static HTML with Tera templates, zero-dependency asset co-location, and sub-100ms builds.
_Avoid_: Node SSG, Gatsby, Docusaurus, Astro

**Tailwind Standalone**:
Tailwind CSS v4 compiling via standalone native CLI binary without Node, npm, `package.json`, or `node_modules/`.
_Avoid_: npm tailwind, PostCSS plugins, frontend build bundlers

**Pagefind Search**:
Static client-side WebAssembly search engine indexed directly from rendered HTML output post-build.
_Avoid_: Algolia, dynamic search backend, external SaaS indexing

**Downloads Hub**:
Version-tabbed release distribution catalog organizing v1.x/v2.x legacy archives, active v3.x releases (Antigravity plugin, `tarsctl`), and v4.x preview portal with copyable SHA-256 digests.
_Avoid_: unstructured file lists, direct binary git tracking

**Universal Installer**:
The canonical POSIX shell installer (`static/install.sh`) executing multi-architecture detection and SHA-256 verification before local path placement.
_Avoid_: unverified curl-to-bash, proprietary package managers

**COMMS_LINK**:
Cyberpunk terminal dispatch interface generating structured RFC 6068 `mailto:cooper@tars-cloud.ai` inquiries with pre-filled telemetry blocks and clipboard fallback.
_Avoid_: third-party form SaaS, tracking webhooks

**Draft Staging**:
Frontmatter `draft = true` exclusion during production builds, allowing unreleased v4.0 architecture documentation to be authored in trunk while publishing only v3.5 material.
_Avoid_: unreleased docs leakage, branch divergence for documentation
