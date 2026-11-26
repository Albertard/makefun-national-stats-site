// NationStat views: each route renders its page into #view. The dashboard
// table is searchable, filterable by region and sortable; the rankings page
// re-sorts instantly by indicator; country pages show key stats, two charts
// and a facts table. All figures come from data.js (World Bank WDI 2023).

const REGIONS = ['All regions', 'Africa', 'Asia', 'Europe', 'North America', 'South America'];

const TABLE_SORTS = [
  { key: 'population', label: 'Population (largest first)' },
  { key: 'gdp', label: 'GDP (largest first)' },
  { key: 'gdpPerCapita', label: 'GDP per capita (highest first)' },
  { key: 'lifeExpectancy', label: 'Life expectancy (highest first)' },
  { key: 'name', label: 'Name (A to Z)' },
];

let dashboardState = { search: '', region: 'All regions', sort: 'population' };

function renderDashboard() {
  const totals = worldTotals();
  const main = document.getElementById('view');
  main.innerHTML =
    '<section class="hero">'
    + '<p class="eyebrow">World Bank WDI &middot; reference year 2023</p>'
    + '<h1>Seventeen countries, one clear picture.</h1>'
    + '<p class="lede">NationStat gathers the headline numbers for the world&rsquo;s largest countries &mdash; how many people live there, what they produce, and how long they live &mdash; so you can compare them in seconds.</p>'
    + '<div class="totals">'
    + '<div class="total"><span class="total-value">' + totals.countries + '</span><span class="total-label">countries covered</span></div>'
    + '<div class="total"><span class="total-value">' + formatMillions(totals.population) + ' m</span><span class="total-label">combined population</span></div>'
    + '<div class="total"><span class="total-value">' + formatBillions(totals.gdp) + ' bn</span><span class="total-label">combined GDP</span></div>'
    + '</div>'
    + '</section>'
    + '<section class="panel"><h2>Ten largest populations, 2023</h2>'
    + '<p class="panel-note">Population in millions. India passed China as the world&rsquo;s most populous country in 2023.</p>'
    + topPopulationBarChart(COUNTRIES)
    + '</section>'
    + '<section class="panel"><h2>All countries</h2>'
    + '<div class="controls">'
    + '<label>Search <input id="country-search" type="search" placeholder="Type a country name&hellip;" value="' + escapeXml(dashboardState.search) + '"></label>'
    + '<label>Region <select id="region-filter">' + REGIONS.map((region) => '<option value="' + region + '"' + (dashboardState.region === region ? ' selected' : '') + '>' + region + '</option>').join('') + '</select></label>'
    + '<label>Sort by <select id="table-sort">' + TABLE_SORTS.map((sort) => '<option value="' + sort.key + '"' + (dashboardState.sort === sort.key ? ' selected' : '') + '>' + sort.label + '</option>').join('') + '</select></label>'
    + '</div>'
    + '<div id="country-table-wrap"></div>'
    + '<p class="panel-note">Source: World Bank World Development Indicators, 2023. Figures rounded; GDP in current US dollars.</p>'
    + '</section>';
  wireDashboardControls();
  renderCountryTable();
}

function wireDashboardControls() {
  document.getElementById('country-search').addEventListener('input', (event) => {
    dashboardState.search = event.target.value;
    renderCountryTable();
  });
  document.getElementById('region-filter').addEventListener('change', (event) => {
    dashboardState.region = event.target.value;
    renderCountryTable();
  });
  document.getElementById('table-sort').addEventListener('change', (event) => {
    dashboardState.sort = event.target.value;
    renderCountryTable();
  });
}

function filteredCountries() {
  const needle = dashboardState.search.trim().toLowerCase();
  let list = COUNTRIES.filter((country) => {
    const matchesSearch = needle === '' || country.name.toLowerCase().includes(needle) || country.capital.toLowerCase().includes(needle);
    const matchesRegion = dashboardState.region === 'All regions' || country.region === dashboardState.region;
    return matchesSearch && matchesRegion;
  });
  if (dashboardState.sort === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => b[dashboardState.sort] - a[dashboardState.sort]);
  }
  return list;
}

function renderCountryTable() {
  const wrap = document.getElementById('country-table-wrap');
  const list = filteredCountries();
  if (list.length === 0) {
    wrap.innerHTML = '<p class="empty-note">No country matches that search. Try clearing the search or choosing another region.</p>';
    return;
  }
  let rows = '';
  list.forEach((country) => {
    rows += '<tr>'
      + '<td><a href="#/country/' + country.slug + '">' + escapeXml(country.name) + '</a></td>'
      + '<td>' + escapeXml(country.region) + '</td>'
      + '<td class="num">' + formatMillions(country.population) + ' m</td>'
      + '<td class="num">' + formatBillions(country.gdp) + ' bn</td>'
      + '<td class="num">' + formatDollars(country.gdpPerCapita) + '</td>'
      + '<td class="num">' + country.lifeExpectancy.toFixed(1) + ' yrs</td>'
      + '<td class="num">' + country.area.toLocaleString('en-US') + ' km&sup2;</td>'
      + '</tr>';
  });
  wrap.innerHTML = '<table class="data-table"><thead><tr>'
    + '<th>Country</th><th>Region</th><th class="num">Population</th><th class="num">GDP</th>'
    + '<th class="num">GDP per capita</th><th class="num">Life expectancy</th><th class="num">Area</th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table>';
}

function keyStatCard(label, value, change, note) {
  const changeClass = change >= 0 ? 'change-up' : 'change-down';
  return '<div class="stat-card"><span class="stat-label">' + label + '</span>'
    + '<span class="stat-value">' + value + '</span>'
    + '<span class="stat-change ' + changeClass + '">' + formatSignedPercent(change) + ' since 2019</span>'
    + '<span class="stat-note">' + note + '</span></div>';
}

function renderCountryPage(slug) {
  const country = findCountry(slug);
  const main = document.getElementById('view');
  if (!country) {
    main.innerHTML = '<section class="panel"><h1>Country not found</h1>'
      + '<p>There is no country with that address in NationStat&rsquo;s 17-country set. <a href="#/">Back to the dashboard</a>.</p></section>';
    return;
  }
  const popChange = percentChangeSince2019(country.population, country.populationSeries[0]);
  const gdpChange = percentChangeSince2019(country.gdp, country.gdpSeries[0]);
  const gdpPcChange = percentChangeSince2019(country.gdpPerCapita, gdpPerCapita2019(country));
  const lifeChange = percentChangeSince2019(country.lifeExpectancy, country.lifeExpectancy2019);
  main.innerHTML =
    '<p class="crumb"><a href="#/">&larr; All countries</a> &middot; ' + escapeXml(country.region) + '</p>'
    + '<section class="hero country-hero"><p class="eyebrow">Capital: ' + escapeXml(country.capital) + '</p>'
    + '<h1>' + escapeXml(country.name) + '</h1>'
    + '<p class="lede">Headline statistics for ' + escapeXml(country.name) + ', reference year 2023, from the World Bank&rsquo;s World Development Indicators.</p></section>'
    + '<section class="stat-grid">'
    + keyStatCard('Population', formatMillions(country.population) + ' million', popChange, 'people, 2023')
    + keyStatCard('GDP', formatBillions(country.gdp) + ' billion', gdpChange, 'current US dollars, 2023')
    + keyStatCard('GDP per capita', formatDollars(country.gdpPerCapita), gdpPcChange, 'current US dollars, 2023')
    + keyStatCard('Life expectancy', country.lifeExpectancy.toFixed(1) + ' years', lifeChange, 'at birth, 2023')
    + '</section>'
    + '<section class="panel"><h2>Population, 2019&ndash;2023</h2>'
    + '<p class="panel-note">Population in millions. The 2020 dip in several countries reflects the pandemic years; growth resumed afterwards.</p>'
    + populationLineChart(country) + '</section>'
    + '<section class="panel"><h2>GDP, 2019&ndash;2023</h2>'
    + '<p class="panel-note">GDP in billions of current US dollars. The 2020 fall and 2021 rebound follow the COVID-19 shock.</p>'
    + gdpBarChart(country) + '</section>'
    + '<section class="panel"><h2>Facts about ' + escapeXml(country.name) + '</h2>'
    + '<dl class="facts">'
    + '<div><dt>Capital</dt><dd>' + escapeXml(country.capital) + '</dd></div>'
    + '<div><dt>Region</dt><dd>' + escapeXml(country.region) + '</dd></div>'
    + '<div><dt>Land area</dt><dd>' + country.area.toLocaleString('en-US') + ' km&sup2;</dd></div>'
    + '<div><dt>Population density</dt><dd>' + Math.round(populationDensity(country)).toLocaleString('en-US') + ' people per km&sup2;</dd></div>'
    + '<div><dt>Urban population</dt><dd>' + country.urbanPercent + '% of the population</dd></div>'
    + '<div><dt>Unemployment</dt><dd>' + country.unemployment.toFixed(1) + '% (modelled ILO estimate)</dd></div>'
    + '<div><dt>Median age</dt><dd>' + country.medianAge.toFixed(1) + ' years</dd></div>'
    + '<div><dt>Life expectancy</dt><dd>' + country.lifeExpectancy.toFixed(1) + ' years at birth</dd></div>'
    + '</dl>'
    + '<p class="panel-note">Sources: World Bank World Development Indicators (2023) and UN World Population Prospects 2024. Figures rounded.</p>'
    + '</section>';
}

const RANKING_INDICATORS = [
  { key: 'population', label: 'Population', format: (v) => formatMillions(v) + ' m' },
  { key: 'gdp', label: 'GDP', format: (v) => formatBillions(v) + ' bn' },
  { key: 'gdpPerCapita', label: 'GDP per capita', format: (v) => formatDollars(v) },
  { key: 'lifeExpectancy', label: 'Life expectancy', format: (v) => v.toFixed(1) + ' yrs' },
  { key: 'area', label: 'Land area', format: (v) => v.toLocaleString('en-US') + ' km²' },
];

let rankingIndicator = 'population';

function renderRankingsPage() {
  const main = document.getElementById('view');
  const indicator = RANKING_INDICATORS.find((item) => item.key === rankingIndicator);
  const ranked = sortedCountries(indicator.key);
  main.innerHTML =
    '<section class="hero"><p class="eyebrow">World Bank WDI &middot; reference year 2023</p>'
    + '<h1>Rankings</h1>'
    + '<p class="lede">All 17 countries, ranked by the indicator you choose. Pick an indicator and the bars re-sort instantly.</p></section>'
    + '<section class="panel"><div class="controls ranking-controls" role="group" aria-label="Choose an indicator">'
    + RANKING_INDICATORS.map((item) => '<button type="button" class="rank-btn' + (item.key === rankingIndicator ? ' rank-btn-active' : '') + '" data-indicator="' + item.key + '">' + item.label + '</button>').join('')
    + '</div>'
    + '<h2>' + indicator.label + ', 2023</h2>'
    + rankingBarChart(ranked, indicator.key, indicator.format)
    + '<p class="panel-note">Source: World Bank World Development Indicators, 2023. Figures rounded; GDP in current US dollars. Click a country name to open its page.</p>'
    + '</section>';
  main.querySelectorAll('.rank-btn').forEach((button) => {
    button.addEventListener('click', () => {
      rankingIndicator = button.getAttribute('data-indicator');
      renderRankingsPage();
    });
  });
}

function renderAboutPage() {
  document.getElementById('view').innerHTML =
    '<section class="hero"><p class="eyebrow">Method &amp; sources</p>'
    + '<h1>About NationStat</h1>'
    + '<p class="lede">NationStat is a small, original statistics explorer. It covers 17 of the world&rsquo;s largest countries with the numbers people actually look up, and it works entirely offline from its own files.</p></section>'
    + '<section class="panel"><h2>What each indicator means</h2>'
    + '<dl class="facts">'
    + '<div><dt>Population</dt><dd>Total number of people living in the country, mid-year estimate, in millions.</dd></div>'
    + '<div><dt>GDP</dt><dd>Gross domestic product in billions of current US dollars &mdash; the value of everything produced in a year.</dd></div>'
    + '<div><dt>GDP per capita</dt><dd>GDP divided by population, in current US dollars &mdash; a rough gauge of average output per person, not of typical income.</dd></div>'
    + '<div><dt>Life expectancy</dt><dd>Years a newborn could expect to live if mortality patterns of that year stayed the same.</dd></div>'
    + '<div><dt>Land area</dt><dd>Total surface area in square kilometres, including inland water.</dd></div>'
    + '<div><dt>Urban population</dt><dd>Share of people living in areas classed as urban, in percent.</dd></div>'
    + '<div><dt>Unemployment</dt><dd>Share of the labour force without work but available for and seeking it (modelled ILO estimate), in percent.</dd></div>'
    + '<div><dt>Median age</dt><dd>The age that splits the population in half &mdash; half younger, half older.</dd></div>'
    + '</dl></section>'
    + '<section class="panel"><h2>Sources</h2>'
    + '<p>Population, GDP, GDP per capita, life expectancy, land area, urban share and unemployment come from the <strong>World Bank World Development Indicators (WDI)</strong>, reference year 2023, figures rounded. Median age comes from the <strong>UN World Population Prospects 2024</strong>. Series run 2019&ndash;2023.</p>'
    + '<p><strong>A note on 2020.</strong> The pandemic year shows up in the series: GDP fell almost everywhere in 2020 and rebounded in 2021, and life expectancy dipped in several countries before recovering. The 2019 baseline in the &ldquo;change since 2019&rdquo; cards is the last pre-pandemic year, so those changes span the whole shock and recovery.</p>'
    + '<p><strong>What this site is not.</strong> NationStat is an independent explorer built for the make.fun bounty &ldquo;Make the best national statistics site&rdquo;. It is not affiliated with the World Bank or the United Nations, and its figures are rounded summaries, not a substitute for the source databases.</p>'
    + '</section>';
}
