[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Albertard/makefun-national-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Albertard/makefun-national-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NationStat — National Statistics Explorer

NationStat is a static national statistics site that runs offline in a web
browser, on a desktop and on a phone, from its own files — no network
requests, no build step, no framework. Built for the make.fun competition
**"Make the best national statistics site"**
([best-national-statistics-site-20261126-0539](https://make.fun/bounty/best-national-statistics-site-20261126-0539)).

## What it covers

17 of the world's largest countries — United States, China, India,
Indonesia, Pakistan, Nigeria, Brazil, Bangladesh, Russia, Mexico, Japan,
Ethiopia, Philippines, Egypt, Vietnam, Germany and Turkey — with real
figures from the **World Bank World Development Indicators (WDI)**,
reference year **2023** (median age from UN World Population Prospects
2024). Each country has population, GDP, GDP per capita, life expectancy,
land area, capital, population density, urban share, unemployment and
median age, plus population and GDP series for 2019–2023.

## Pages

- `#/` — dashboard: combined totals for all 17 countries, a bar chart of
  the ten largest populations, and a table of every country that is
  searchable, filterable by region and sortable by indicator.
- `#/country/<slug>` — one page per country: four key-stat cards with the
  change since 2019, a population line chart and a GDP bar chart for
  2019–2023, and a facts table.
- `#/rankings` — all 17 countries ranked by population, GDP, GDP per
  capita, life expectancy or land area; the bars re-sort instantly.
- `#/about` — what each indicator means, the sources, and a note on the
  pandemic year 2020.

All charts are hand-built inline SVG; there are no libraries.

## Run it locally

```sh
node serve.ts            # serves app/ on http://localhost:8080
node serve.ts --port 8191
```

Then open http://localhost:8080 in a browser. Any static server works —
`app/` at the server root, `app/index.html` as the entry point.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to `$MAKEFUN_OUTPUT_DIR` (default `/output`) and writes
`/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts` (the kit's copy, unchanged):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — page shell (header, nav, footer)
- `app/data.js` — the 17 countries and their figures, plus totals and formatting helpers
- `app/charts.js` — pure-SVG bar and line charts
- `app/views.js` — dashboard, country, rankings and about pages
- `app/main.js` — hash router
- `app/style.css` — the site's own design
- `screenshots/` — real renders of the site in a browser
- `vendor/makefun-frontend.ts` — the make.fun dossier library, copied from the kit unchanged
