# KD-CE · Open Studio

A community-page concept for KrackedDevs, reimagined as a welcoming creative studio for Malaysia’s builders. The **Open Studio** design explores a warmer, more human-first direction: editorial typography, paper-inspired colors, playful artwork, and clear ways into the community.

> This is an exploratory concept, not a production redesign or a replacement for the live KrackedDevs site. It lives on the `design/open-studio` branch; `main` is unchanged.

## Design direction

**Good things happen together.** The page is designed to feel like an open invitation to learn, make, and share—not a corporate product page. It deliberately avoids hacker, terminal, and cyberpunk visuals.

The palette pairs warm paper and forest green with tomato red, marigold, leaf green, and soft blue. Display headlines use a system serif; body copy uses system sans-serif fonts, so the page does not depend on remote font requests.

## What’s included

- Responsive landing page with mobile navigation
- Community pathways for learning, guilds, projects, events, and bounties
- Community-made project cards with **Everything**, **Experiments**, and **Useful tools** filters
- Member highlights and links to the community directory
- Partner and join calls to action
- Small interactions: rotating encouragement note, scroll reveals, and hover details
- Reduced-motion support, visible keyboard focus styles, and labelled navigation controls
- Original hero illustration in `public/assets/kd-studio-illustration.png`

The page uses editorial examples and links to the corresponding public KrackedDevs destinations. It is a static concept; it does not fetch live community data.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints a local URL when the development server is ready. To build and preview the production bundle:

```bash
npm run build
npm run preview
```

To run the TypeScript check:

```bash
npx tsc --noEmit
```

## Project structure

```text
.
├── index.html                       # Vite document shell and page metadata
├── public/
│   └── assets/
│       └── kd-studio-illustration.png
└── src/
    ├── App.tsx                      # Mounts the page and its interactions
    ├── index.css                    # Design system, layout, and responsive styles
    └── new-design/
        ├── assets.d.ts              # TypeScript declaration for Vite raw imports
        └── landing.html             # Landing-page markup
```

`src/new-design/landing.html` is imported as a Vite raw string; the React entry wires up the navigation, project filters, encouragement note, and scroll-reveal behavior.

## Build output

`npm run build` creates the deployable static bundle in `dist/`. The Vite single-file plugin inlines the app’s JavaScript and CSS; the hero image remains a local asset under `assets/`.

## License

See [`LICENSE`](./LICENSE) for the repository’s license terms.
