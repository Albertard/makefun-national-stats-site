// NationStat charts: every chart is hand-built inline SVG, no libraries.
// Values of 1000 or more are always written out in full (e.g. "1,428.6"),
// never shortened to "1.4k", so labels stay readable in screenshots.

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Horizontal bars for the ten largest populations. The label gutter is
// 150px wide so long country names are never clipped.
function topPopulationBarChart(countries) {
  const top = sortedCountries('population').slice(0, 10);
  const rowHeight = 34;
  const labelWidth = 150;
  const valueWidth = 76;
  const width = 760;
  const height = top.length * rowHeight + 8;
  const max = top[0].population;
  const barArea = width - labelWidth - valueWidth;
  let rows = '';
  top.forEach((country, i) => {
    const y = 8 + i * rowHeight;
    const barWidth = Math.max(2, (country.population / max) * barArea);
    rows += '<g>'
      + '<text x="' + (labelWidth - 10) + '" y="' + (y + 15) + '" class="chart-label" text-anchor="end">' + escapeXml(country.name) + '</text>'
      + '<rect x="' + labelWidth + '" y="' + y + '" width="' + barWidth.toFixed(1) + '" height="20" rx="3" class="chart-bar"/>'
      + '<text x="' + (labelWidth + barWidth + 8) + '" y="' + (y + 15) + '" class="chart-value">' + formatMillions(country.population) + '</text>'
      + '</g>';
  });
  return '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Bar chart of the ten largest populations in 2023">'
    + rows + '</svg>';
}

// Vertical bars for one country's GDP series, 2019-2023.
function gdpBarChart(country) {
  const width = 560;
  const height = 260;
  const padLeft = 64;
  const padBottom = 30;
  const padTop = 14;
  const plotWidth = width - padLeft - 16;
  const plotHeight = height - padTop - padBottom;
  const max = Math.max.apply(null, country.gdpSeries) * 1.08;
  const slot = plotWidth / country.gdpSeries.length;
  const barWidth = Math.min(56, slot * 0.58);
  let bars = '';
  let labels = '';
  country.gdpSeries.forEach((value, i) => {
    const barHeight = (value / max) * plotHeight;
    const x = padLeft + i * slot + (slot - barWidth) / 2;
    const y = padTop + plotHeight - barHeight;
    bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barHeight.toFixed(1) + '" rx="3" class="chart-bar"/>'
      + '<text x="' + (x + barWidth / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" class="chart-value chart-value-center">' + formatBillions(value) + '</text>';
    labels += '<text x="' + (padLeft + i * slot + slot / 2).toFixed(1) + '" y="' + (height - 8) + '" class="chart-label chart-label-center">' + SERIES_YEARS[i] + '</text>';
  });
  const axis = '<line x1="' + padLeft + '" y1="' + padTop + '" x2="' + padLeft + '" y2="' + (padTop + plotHeight) + '" class="chart-axis"/>'
    + '<line x1="' + padLeft + '" y1="' + (padTop + plotHeight) + '" x2="' + (width - 16) + '" y2="' + (padTop + plotHeight) + '" class="chart-axis"/>';
  return '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Bar chart of GDP in billions of US dollars, 2019 to 2023">'
    + axis + bars + labels + '</svg>';
}

// Line chart for one country's population series, 2019-2023.
function populationLineChart(country) {
  const width = 560;
  const height = 260;
  const padLeft = 64;
  const padBottom = 30;
  const padTop = 20;
  const plotWidth = width - padLeft - 16;
  const plotHeight = height - padTop - padBottom;
  const min = Math.min.apply(null, country.populationSeries);
  const max = Math.max.apply(null, country.populationSeries);
  const span = (max - min) || 1;
  const lo = min - span * 0.25;
  const hi = max + span * 0.25;
  function pointX(i) {
    return padLeft + (i / (country.populationSeries.length - 1)) * plotWidth;
  }
  function pointY(value) {
    return padTop + plotHeight - ((value - lo) / (hi - lo)) * plotHeight;
  }
  let points = '';
  country.populationSeries.forEach((value, i) => {
    points += pointX(i).toFixed(1) + ',' + pointY(value).toFixed(1) + ' ';
  });
  let dots = '';
  let yearLabels = '';
  country.populationSeries.forEach((value, i) => {
    // Keep the value label inside the viewBox: the first and last points
    // sit at the plot edges, so a centred label would clip by a pixel.
    const labelX = Math.max(24, Math.min(width - 24, pointX(i)));
    dots += '<circle cx="' + pointX(i).toFixed(1) + '" cy="' + pointY(value).toFixed(1) + '" r="4.5" class="chart-dot"/>'
      + '<text x="' + labelX.toFixed(1) + '" y="' + (pointY(value) - 10).toFixed(1) + '" class="chart-value chart-value-center">' + formatMillions(value) + '</text>';
    yearLabels += '<text x="' + pointX(i).toFixed(1) + '" y="' + (height - 8) + '" class="chart-label chart-label-center">' + SERIES_YEARS[i] + '</text>';
  });
  const axis = '<line x1="' + padLeft + '" y1="' + padTop + '" x2="' + padLeft + '" y2="' + (padTop + plotHeight) + '" class="chart-axis"/>'
    + '<line x1="' + padLeft + '" y1="' + (padTop + plotHeight) + '" x2="' + (width - 16) + '" y2="' + (padTop + plotHeight) + '" class="chart-axis"/>';
  return '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Line chart of population in millions, 2019 to 2023">'
    + axis
    + '<polyline points="' + points.trim() + '" class="chart-line" fill="none"/>'
    + dots + yearLabels + '</svg>';
}

// Scaled horizontal bars for a ranking by one indicator.
function rankingBarChart(countries, key, formatValue) {
  const rowHeight = 34;
  const rankWidth = 36;
  const labelWidth = 150;
  const valueWidth = 96;
  const width = 760;
  const height = countries.length * rowHeight + 8;
  const max = countries[0][key];
  const barArea = width - rankWidth - labelWidth - valueWidth;
  let rows = '';
  countries.forEach((country, i) => {
    const y = 8 + i * rowHeight;
    const barWidth = Math.max(2, (country[key] / max) * barArea);
    rows += '<g>'
      + '<text x="8" y="' + (y + 15) + '" class="chart-rank">' + (i + 1) + '</text>'
      + '<text x="' + (rankWidth + labelWidth - 10) + '" y="' + (y + 15) + '" class="chart-label" text-anchor="end"><a href="#/country/' + country.slug + '">' + escapeXml(country.name) + '</a></text>'
      + '<rect x="' + (rankWidth + labelWidth) + '" y="' + y + '" width="' + barWidth.toFixed(1) + '" height="20" rx="3" class="chart-bar"/>'
      + '<text x="' + (rankWidth + labelWidth + barWidth + 8) + '" y="' + (y + 15) + '" class="chart-value">' + formatValue(country[key]) + '</text>'
      + '</g>';
  });
  return '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Ranking bar chart">'
    + rows + '</svg>';
}
