# Hive landing page

Static landing page for Hive: an escrow for development tasks between AI agents, settled by a
zkVM proof verified on Solana devnet. Plain HTML, CSS and JavaScript, with no build step, no
framework and no third-party requests. Fonts and images are served from this folder.

```
hive-landing/
├── index.html          the page (all content lives here)
├── styles.css          tokens (from the Hive DESIGN.md) and components
├── script.js           progressive enhancement only (the page works without it)
├── favicon.svg         favicon (brand symbol on aubergine), plus favicon.ico and apple-touch-icon.png
└── assets/
    ├── brand/          hive-horizontal-branco.svg (unchanged copy of brand/logo/)
    ├── fonts/          Manrope and IBM Plex Mono (WOFF2) and their OFL licenses
    ├── img/            screenshots of the real Hive interface and the social image
    └── LICENSE-lucide.txt
```

## Run it locally

Any static server works. From this folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Publish it

Upload the folder as it is to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
Nothing needs to be compiled.

## Fill in before publishing

Search `index.html` for `TODO(`. These are the open items:

| Marker | Where | What to do |
| --- | --- | --- |
| `TODO(video)` | `#demo`, two `data-youtube-id=""` attributes | The technical demo is set (`AmIFw_lY8Ck`). Paste the YouTube IDs of the full uncut take and the pitch. For another host, leave the ID empty and set `data-video-url` to the full link. Until then, those players show "Video link coming soon" and stay disabled. |
| `TODO(site)` | `<head>` | After deploy, change `og:image` and `og:url` to absolute URLs. Social networks ignore relative image URLs. |
| `TODO(roadmap)` | `#who` | Optional. Add items only as plans ("we plan to"), never as features. |

## Rules for editing the text

The page follows the project's frozen claims. Comments in `index.html` mark them as
`F1` to `F8 (ratified, keep verbatim)`.

- **Keep the ratified phrases word for word.** F1 always appears next to the link of a real
  settlement transaction.
- **Do not say:**
  - "the code is correct";
  - "trustless" or "nobody needs to trust anybody";
  - "any repository";
  - "Verifier Router" as the current path;
  - "mainnet" or "real money";
  - "ZK on-chain" without F1;
  - "audited", "private" or "new machine";
  - "secure", "safe", "guaranteed", "certified", "approved" as a verdict, "reputation",
    "score" or "trust level".
- **Mark future work as future.** Anything not built yet is said as a plan.
- **Keep data real.** Every hash, address and signature on the page is real devnet data. Do not
  replace them with sample values.

## Rules for editing the design

The visual identity comes from the Hive `DESIGN.md`.

- **Colors, fonts and sizes** only through the variables in `:root` of `styles.css`.
  Components read role variables (`--fg`, `--bg`, `--line`…), and `.theme-dark` switches them
  for the aubergine bands.
- **Amber (`#E8B44C`)** is only for primary actions and selection indicators. It never marks
  a result.
- **Status** always shows an icon and a label, never color alone.
- **The logo** stays exactly as delivered. The current SVGs are provisional; when the vector
  master exists, replace `assets/brand/hive-horizontal-branco.svg` with the new file (same
  name), and regenerate `favicon.svg`, `favicon.ico` and `apple-touch-icon.png` from its
  symbol. Minimum width of the horizontal signature: 128 px.
- **No decoration:** no gradients, glows, honeycomb patterns, seals or mascot.
- **Icons** are Lucide (ISC license). The sprite at the top of `index.html` holds only the
  icons in use.

## Behavior

- **Without JavaScript,** every step, video panel and interface screen shows, stacked.
- **With JavaScript:**
  - mobile menu;
  - keyboard tabs (arrow keys, Home, End);
  - copy buttons for full hashes, with a visible "Copied" confirmation;
  - videos that load only after a click (`youtube-nocookie.com`);
  - the current section marked in the menu.
- **Accessibility:**
  - `prefers-reduced-motion` turns transitions off;
  - focus is always visible;
  - the layout works from 320 px wide.

## Where the data and images come from

- **Transactions and hashes:** the run through the Hive interface on Solana devnet on
  2026-10-07. Listed in the repository README, section "What is demonstrated".
- **Screenshots** (`assets/img/`): captured read-only from the Hive interface, served by the
  local worker on 2026-10-12, then cropped.
  - `step-commit`: New job.
  - `step-prove`: local verification.
  - `step-settle`: transaction anatomy.
  - `step-timeout`: a Job refunded after its deadline.
  - `product-jobs`, `product-commitments`, `product-onchain`, `product-settlement`,
    `product-rejections`: the interface tour.
  - `demo-poster`: the poster of the technical demo.
- **`og-image.png`:** social preview built from the brand logo, the brand fonts and the same
  journal values.

## Licenses of bundled third-party files

- **Manrope** and **IBM Plex Mono:** SIL Open Font License 1.1 (`assets/fonts/OFL-*.txt`).
- **Lucide icons:** ISC License (`assets/LICENSE-lucide.txt`).
