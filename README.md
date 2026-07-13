# Atlas Golf Tour app

A mobile app prototype for the **PGA of Atlantica** — the fictional governing body of three
professional golf tours:

| Tour | Audience | Theme |
| --- | --- | --- |
| **Atlas Golf Tour** | Men's tour | Azure blue |
| **Clover Tour** | Women's tour | Clover green |
| **The Golden Tour** | Over-50s tour | Gold |

The PGA of Atlantica master brand (splash screen, member Player Portal) is deep Atlantic navy;
in fan mode the whole app re-themes to the active tour's palette via CSS custom properties.
All logo marks are text-based SVGs — the roundel emblem and the three tour banner wordmarks
live in `docs/assets/pga-of-atlantica-icon-set-brand-emblem.js`.

The prototype covers live leaderboards, hole-by-hole scorecards, a full season schedule,
tournament pages, an Order of Merit with exemption cut-offs, player profiles, fan accounts,
and a members-only Player Portal (entries, event hubs, billing, accreditation).

## Running it

`docs/` is a fully static site — serve it with anything:

```sh
python3 -m http.server 8000 --directory docs
```

Append `?controls` to the URL to reveal the prototype control rail (screen jump menu,
iOS Live Activity mock, visual style guide).

## Structure

- `index.html` — the Claude design export: a self-unpacking bundle with every script,
  font and image stored as base64 in `__bundler` blocks. Source of truth.
- `build.mjs` — unpacks the export into `docs/` with readable asset names, strips the
  design-canvas staging (faux iPhone frame, control rail), and adds PWA meta so the site
  installs edge-to-edge on a phone. Re-run with `node build.mjs`.
- `docs/` — the built site, served from the main branch by GitHub Pages.

All tournament data, players and scores are illustrative sample data.
