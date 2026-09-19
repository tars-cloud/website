# 1. Public Website Architecture & Stack

Date: 2026-09-19

## Status

Accepted

## Context

The legacy TARS web presence was deployed as two Internet Computer (ICP) canisters: a Leptos WASM landing page (`station`) and a Zola documentation site (`archive`). Following the migration off ICP to a sovereign platform model, the public web presence required re-platforming to a dedicated public GitHub Pages repository (`tars-cloud/website`).

Key platform mandates:
1. Public sales pitch, documentation, and download distribution portal.
2. Retro-cyberpunk aesthetic matching `docs/design-system.md` and `docs/PITCH.md`.
3. Minimal to zero third-party dependencies, zero npm packages, and zero CVE exposure.
4. Fast static hosting on GitHub Pages with automated CI on enterprise self-hosted runners (`enterprise/tars-cloud`).

## Decision

1. Unify the landing page, documentation, and download hub under the **Zola** static site generator.
2. Style with **Tailwind CSS v4** standalone binary managed deterministically via `devenv.nix`.
3. Implement all dynamic interactive animations (`TARS_LETTERS` typewriter, Matrix scramble-decrypt, COMMS_LINK dispatcher, downloads tab switcher) in vanilla ES2022 JavaScript with zero external npm dependencies.
4. Implement offline search using **Pagefind** compiled post-build.
5. Deploy to GitHub Pages via GitHub Actions using the enterprise self-hosted runner group `enterprise/tars-cloud`.
6. Enforce draft staging via frontmatter `draft = true` so v4.0 docs can be authored in trunk while publishing only v3.5 material.

## Consequences

- Zero npm supply chain risk (`node_modules/` does not exist in the repository).
- Build times under 100ms.
- True sovereign airgap-compatible documentation.
- Large binary artifacts must be hosted on S3/Storj/Releases rather than tracked in git.
