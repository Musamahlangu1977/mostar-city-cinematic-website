# Deploy the Mostar City website

This project is a static HTML/CSS/JavaScript website without a build step.

## Vercel
Import this GitHub repository into Vercel. Set framework preset to **Other**, leave build command blank, and deploy the repository root. The supplied `vercel.json` adds basic security headers.

## Netlify
Connect the repo. Leave build command blank, set publish directory to `.`, and deploy. The `_headers` file supplies Netlify-compatible headers.

## GitHub Pages
Repository **Settings → Pages → Deploy from a branch → main → /(root)**. All site resources use relative paths.

## Preview locally

```sh
python -m http.server 8000
```

Then open http://localhost:8000.

## Initial import
The `.github/workflows/import-live-site.yml` workflow can import source files and media from the website's original Vercel deployment. It validates binary signatures rather than silently saving HTML error pages. For best long-term reliability, review imported files and use the GitHub repository as the canonical source.
