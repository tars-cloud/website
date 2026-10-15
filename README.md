# TARS Cloud Website

The sovereign public portal, technical documentation hub, and binary distribution catalog for TARS Cloud, hosted at [https://tars-cloud.ai](https://tars-cloud.ai).

## Architecture

- **Static Compiler**: [Zola](https://www.getzola.org/) (v0.23.4) provides native Rust CommonMark rendering and Tera templating without Node.js runtime overhead.
- **Styling Pipeline**: [Tailwind CSS v4](https://tailwindcss.com/) (v4.3.3) standalone CLI binary compiles utility styles directly.
- **Search Engine**: [Pagefind](https://pagefind.app/) (v1.5.2) generates offline WebAssembly search indexes directly from compiled HTML assets.
- **Release Automation**: [convco](https://convco.github.io/) (v0.6.3) enforces Conventional Commits and generates changelogs.
- **Reproducible Toolchain**: [devenv](https://devenv.sh/) with Nix flakes provisions identical binaries locally and in CI.
- **Zero Node Footprint**: Zero `package.json`, zero npm packages, and zero `node_modules/` dependencies.

## Prerequisites

- [Nix](https://nixos.org/download.html) package manager with Flakes enabled.
- [devenv](https://devenv.sh/getting-started/) CLI installed.

## Quickstart

Enter the reproducible development shell:

```bash
devenv shell
```

Once inside the shell, all required tools and workflow scripts are available.

## Command Reference

| Command | Description | Underlying Execution |
| :--- | :--- | :--- |
| `build` | Compiles site assets and constructs Pagefind search index | `zola build && pagefind --site public` |
| `check` | Validates markdown links, anchors, and taxonomy paths | `zola check` |
| `serve` | Launches local development server with draft previews | `zola serve --drafts` |
| `devenv test` | Headless verification suite running syntax and build checks | `zola check && zola build` |
| `convco check` | Validates commit messages against conventional commit format | `convco check <commit>` |

## Project Structure

```
├── .github/
│   ├── actions/       # Reusable GitHub Actions composite actions
│   └── workflows/     # CI and deployment workflows
├── content/           # Markdown content pages and sections
├── static/            # Static assets copied directly to public/
├── templates/         # Tera templates for layout and pages
├── config.toml        # Authoritative Zola site configuration
├── devenv.nix         # Nix package manifest and developer scripts
├── devenv.yaml        # Nixpkgs channel input pinning
└── .versionrc         # Conventional commit schema configuration
```

## Continuous Integration & Deployment

- **Validation**: `.github/workflows/ci.yml` runs link checks, devenv test suites, and build validation on push and pull requests targeting `trunk`.
- **Deployment**: `.github/workflows/deploy.yml` compiles production static assets on push to `trunk` and publishes to GitHub Pages via enterprise self-hosted runners (`[self-hosted, tars-cloud]`).
