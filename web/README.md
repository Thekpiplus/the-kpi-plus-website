# The KPI Plus

Next.js site for The KPI Plus. Thai is the default language. English, Russian, and Traditional Chinese live under `/en`, `/ru`, and `/zh`.

## Run

```bash
cd web
npm install
npm run dev
```

## Source of truth

- Visual / assets: `../the-kpi-plus-static-export/`
- Public media: `public/media/`
- Copy, routes, SEO: `content/pages/` and `content/seo-manifest.json`
- Compiled styles: `app/vendor.css`

Menus only link to pages that exist in the current language. Calculators run in the browser. Forms collect details locally and do not pretend to have a backend.
