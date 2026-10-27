# Mostar City — Cinematic Scrollytelling Website

**An immersive, scroll-driven journey through Mostar, Bosnia and Herzegovina.** Explore Stari Most, the historic bazaar and Neretva River with cinematic transitions, layered parallax and interactive photography.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-111111?style=for-the-badge)](https://mostar-city-sooty.vercel.app/)

> **About the 3D effect:** This website uses layered **2.5D parallax** with CSS transforms and vanilla JavaScript. It does not require Three.js, WebGL or a 3D rendering engine.

## Features

- **Cinematic scrollytelling** — sticky full-screen scenes respond fluidly to page scroll.
- **3D-style parallax** — layered imagery shifts, scales and fades to create depth.
- **Pointer-responsive movement** — desktop mouse movement subtly influences the scene.
- **Chapter navigation** — discover Mostar landmarks and photographic stories.
- **Interactive gallery** — photo carousel with keyboard, arrow and touch controls.
- **Responsive layout** — optimized for mobile, tablet and desktop.
- **Accessible motion** — reduced-motion support and a motion pause control.
- **Lightweight stack** — no framework, npm installation, backend or API keys required.

## Technologies

| Technology | Purpose |
| --- | --- |
| HTML5 | Semantic content, layout and navigation |
| CSS3 | Responsive design, layered composition and transitions |
| Vanilla JavaScript | Scroll easing, pointer movement, gallery navigation |
| WebP | Optimized scene and destination photography |
| Vercel | Static website deployment |

## Running locally

Clone the repository and run:

```bash
git clone https://github.com/Musamahlangu1977/mostar-city-cinematic-website.git
cd mostar-city-cinematic-website
python -m http.server 8000
```

Visit **http://localhost:8000**. Alternatively, open `index.html` directly.

## Project structure

```text
.
├── index.html                 # Main page
├── styles.css                 # Cinematic scenes and responsive styling
├── script.js                  # Scroll-driven animations
├── gallery.css                # Gallery styling
├── gallery.js                 # Gallery controls
├── assets/
│   ├── scene-1.webp ...      # Layered parallax artwork
│   ├── ogg-medium.woff2      # Display typeface (license requires checking)
│   └── photos/               # City photographs and credits.json
├── scripts/
│   └── validate_assets.py    # Local file integrity checks
├── .github/workflows/
│   ├── validate.yml          # Automated checks
│   └── import-live-site.yml  # One-time source import automation
├── vercel.json
├── _headers
├── DEPLOYMENT.md
├── ASSET_CREDITS.md
└── README.md
```

## How the motion works

The visitor scrolls through a tall cinematic section while a `position: sticky` stage holds the scene in place. `script.js` eases progress through `requestAnimationFrame`, updates CSS custom properties, and `styles.css` uses those values to translate, scale and crossfade layered artwork. Gallery navigation is controlled separately in `gallery.js`.

## Deployment

**Vercel:** Import this repository, select `Other` for the framework, and deploy without a build command (output is the repository root).

**Netlify:** Build command empty; publish directory `.`.

**GitHub Pages:** Settings → Pages → Deploy from branch → `main` / `/(root)`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for more details.

## Validation

```bash
python scripts/validate_assets.py
node --check script.js
node --check gallery.js
```

## Credits and licensing

See [ASSET_CREDITS.md](ASSET_CREDITS.md) and [assets/photos/credits.json](assets/photos/credits.json). Some imagery is attributed under Creative Commons; user-supplied imagery, scene illustrations and the Ogg Medium font may have additional restrictions. **Publication on GitHub does not itself grant third-party redistribution rights.** Verify these before reusing or redistributing assets. No blanket open-source license is applied.

## Live experience

**https://mostar-city-sooty.vercel.app/**

Built as a creative front-end portfolio project demonstrating motion design, layered depth effects and interactive destination storytelling.
