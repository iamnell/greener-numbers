# Greener Numbers

Greener Numbers is a data-first publication and tools business explaining the economics of energy, transportation, and the green transition.

## Stack

- Next.js 16 / React 19
- TypeScript and Tailwind CSS
- Static-first App Router pages, ready for Vercel
- Future-ready for Supabase, scheduled data updates, and route handlers

## Local development

```bash
npm install
npm run dev
```

Validate a production build with `npm run build`; run `npm run lint` for static checks.

## Deploying on Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **New Project** and import the repository.
3. Keep the detected Next.js framework preset and use the repository root as the project root.
4. Deploy. Vercel will use `npm run build` and handle the server/runtime automatically.
5. Add the production domain in **Settings → Domains**.

Use `main` as the production branch; pull requests and other branches will receive preview deployments automatically.

## Content architecture

The initial homepage provides the design system for future SEO routes:

- `/solar/solar-payback-calculator/`
- `/electric-vehicles/ev-vs-gas-cost-calculator/`
- `/electricity/electricity-prices-by-state/`
- `/home-energy/heat-pump-vs-furnace/`

Each tool and data route should use the same pattern: useful interactive result, concise methodology, clearly dated sources, FAQs, related analysis, and an appropriate newsletter or commercial CTA.
