// NationStat data: real national statistics for 17 countries, World Bank
// World Development Indicators (WDI), reference year 2023, figures rounded.
// Series cover 2019-2023. Population in millions, GDP in billions of current
// US dollars, GDP per capita in current US dollars, life expectancy in years,
// area in square kilometres, urban share and unemployment in percent, median
// age in years. Sources are listed on the About page of the site.

const COUNTRIES = [
  {
    slug: 'united-states', name: 'United States', region: 'North America',
    capital: 'Washington, D.C.',
    population: 335.9, gdp: 27721, gdpPerCapita: 82478,
    lifeExpectancy: 78.4, lifeExpectancy2019: 78.8,
    area: 9833517, urbanPercent: 83, unemployment: 3.6, medianAge: 38.9,
    populationSeries: [328.3, 331.5, 332.0, 333.3, 335.9],
    gdpSeries: [21381, 21060, 23320, 25744, 27721],
  },
  {
    slug: 'china', name: 'China', region: 'Asia',
    capital: 'Beijing',
    population: 1411.8, gdp: 17795, gdpPerCapita: 12610,
    lifeExpectancy: 78.2, lifeExpectancy2019: 77.9,
    area: 9596961, urbanPercent: 64, unemployment: 4.6, medianAge: 39.0,
    populationSeries: [1397.7, 1411.1, 1412.4, 1412.2, 1411.8],
    gdpSeries: [14343, 14689, 17820, 17963, 17795],
  },
  {
    slug: 'india', name: 'India', region: 'Asia',
    capital: 'New Delhi',
    population: 1428.6, gdp: 3568, gdpPerCapita: 2498,
    lifeExpectancy: 67.7, lifeExpectancy2019: 69.7,
    area: 3287263, urbanPercent: 36, unemployment: 4.8, medianAge: 28.7,
    populationSeries: [1366.4, 1380.0, 1396.4, 1412.7, 1428.6],
    gdpSeries: [2835, 2671, 3150, 3389, 3568],
  },
  {
    slug: 'indonesia', name: 'Indonesia', region: 'Asia',
    capital: 'Jakarta',
    population: 277.5, gdp: 1371, gdpPerCapita: 4919,
    lifeExpectancy: 71.1, lifeExpectancy2019: 71.3,
    area: 1904569, urbanPercent: 58, unemployment: 5.3, medianAge: 30.4,
    populationSeries: [270.6, 274.0, 276.4, 275.8, 277.5],
    gdpSeries: [1119, 1059, 1186, 1319, 1371],
  },
  {
    slug: 'pakistan', name: 'Pakistan', region: 'Asia',
    capital: 'Islamabad',
    population: 240.5, gdp: 338, gdpPerCapita: 1407,
    lifeExpectancy: 66.1, lifeExpectancy2019: 66.4,
    area: 796095, urbanPercent: 37, unemployment: 5.5, medianAge: 22.7,
    populationSeries: [216.6, 220.9, 225.2, 235.8, 240.5],
    gdpSeries: [320, 300, 348, 374, 338],
  },
  {
    slug: 'nigeria', name: 'Nigeria', region: 'Africa',
    capital: 'Abuja',
    population: 223.8, gdp: 363, gdpPerCapita: 1623,
    lifeExpectancy: 52.7, lifeExpectancy2019: 53.6,
    area: 923768, urbanPercent: 54, unemployment: 5.0, medianAge: 18.1,
    populationSeries: [200.9, 206.1, 211.4, 216.7, 223.8],
    gdpSeries: [474, 432, 441, 477, 363],
  },
  {
    slug: 'brazil', name: 'Brazil', region: 'South America',
    capital: 'Brasília',
    population: 216.4, gdp: 2174, gdpPerCapita: 10045,
    lifeExpectancy: 75.9, lifeExpectancy2019: 75.7,
    area: 8514877, urbanPercent: 87, unemployment: 8.0, medianAge: 33.9,
    populationSeries: [211.0, 212.6, 213.3, 215.3, 216.4],
    gdpSeries: [1873, 1476, 1670, 1920, 2174],
  },
  {
    slug: 'bangladesh', name: 'Bangladesh', region: 'Asia',
    capital: 'Dhaka',
    population: 173.0, gdp: 437, gdpPerCapita: 2527,
    lifeExpectancy: 74.6, lifeExpectancy2019: 72.6,
    area: 148460, urbanPercent: 40, unemployment: 4.4, medianAge: 27.6,
    populationSeries: [163.0, 164.7, 166.3, 171.2, 173.0],
    gdpSeries: [351, 373, 416, 460, 437],
  },
  {
    slug: 'russia', name: 'Russia', region: 'Europe',
    capital: 'Moscow',
    population: 143.8, gdp: 2021, gdpPerCapita: 14057,
    lifeExpectancy: 72.5, lifeExpectancy2019: 72.8,
    area: 17098242, urbanPercent: 75, unemployment: 3.2, medianAge: 40.3,
    populationSeries: [144.4, 144.1, 143.8, 143.7, 143.8],
    gdpSeries: [1693, 1488, 1836, 2290, 2021],
  },
  {
    slug: 'mexico', name: 'Mexico', region: 'North America',
    capital: 'Mexico City',
    population: 129.7, gdp: 1789, gdpPerCapita: 13797,
    lifeExpectancy: 75.4, lifeExpectancy2019: 75.0,
    area: 1964375, urbanPercent: 81, unemployment: 2.8, medianAge: 29.8,
    populationSeries: [127.8, 128.9, 129.7, 129.4, 129.7],
    gdpSeries: [1272, 1096, 1295, 1474, 1789],
  },
  {
    slug: 'japan', name: 'Japan', region: 'Asia',
    capital: 'Tokyo',
    population: 124.7, gdp: 4213, gdpPerCapita: 33789,
    lifeExpectancy: 84.0, lifeExpectancy2019: 84.5,
    area: 377975, urbanPercent: 92, unemployment: 2.6, medianAge: 49.5,
    populationSeries: [126.6, 126.1, 125.7, 125.2, 124.7],
    gdpSeries: [5118, 5049, 5005, 4256, 4213],
  },
  {
    slug: 'ethiopia', name: 'Ethiopia', region: 'Africa',
    capital: 'Addis Ababa',
    population: 126.5, gdp: 164, gdpPerCapita: 1296,
    lifeExpectancy: 66.7, lifeExpectancy2019: 66.2,
    area: 1104300, urbanPercent: 23, unemployment: 3.5, medianAge: 19.6,
    populationSeries: [112.1, 115.0, 117.9, 120.8, 126.5],
    gdpSeries: [96, 107, 111, 126, 164],
  },
  {
    slug: 'philippines', name: 'Philippines', region: 'Asia',
    capital: 'Manila',
    population: 117.3, gdp: 437, gdpPerCapita: 3725,
    lifeExpectancy: 71.9, lifeExpectancy2019: 72.2,
    area: 300000, urbanPercent: 48, unemployment: 4.3, medianAge: 25.3,
    populationSeries: [108.1, 109.9, 111.7, 115.6, 117.3],
    gdpSeries: [377, 361, 394, 404, 437],
  },
  {
    slug: 'egypt', name: 'Egypt', region: 'Africa',
    capital: 'Cairo',
    population: 112.7, gdp: 396, gdpPerCapita: 3515,
    lifeExpectancy: 70.2, lifeExpectancy2019: 71.8,
    area: 1002450, urbanPercent: 43, unemployment: 7.3, medianAge: 24.8,
    populationSeries: [100.4, 102.3, 104.3, 108.2, 112.7],
    gdpSeries: [318, 370, 424, 477, 396],
  },
  {
    slug: 'vietnam', name: 'Vietnam', region: 'Asia',
    capital: 'Hanoi',
    population: 98.9, gdp: 430, gdpPerCapita: 4346,
    lifeExpectancy: 75.4, lifeExpectancy2019: 75.0,
    area: 331212, urbanPercent: 39, unemployment: 2.3, medianAge: 33.3,
    populationSeries: [96.5, 97.3, 98.2, 98.9, 98.9],
    gdpSeries: [334, 347, 366, 409, 430],
  },
  {
    slug: 'germany', name: 'Germany', region: 'Europe',
    capital: 'Berlin',
    population: 84.7, gdp: 4526, gdpPerCapita: 53422,
    lifeExpectancy: 81.4, lifeExpectancy2019: 81.7,
    area: 357588, urbanPercent: 78, unemployment: 3.0, medianAge: 45.7,
    populationSeries: [83.1, 83.2, 83.2, 83.8, 84.7],
    gdpSeries: [3875, 3887, 4277, 4084, 4526],
  },
  {
    slug: 'turkey', name: 'Turkey', region: 'Europe',
    capital: 'Ankara',
    population: 85.3, gdp: 1118, gdpPerCapita: 13105,
    lifeExpectancy: 77.2, lifeExpectancy2019: 76.4,
    area: 783562, urbanPercent: 77, unemployment: 9.4, medianAge: 33.6,
    populationSeries: [83.4, 84.3, 84.8, 85.0, 85.3],
    gdpSeries: [761, 720, 818, 906, 1118],
  },
];

const SERIES_YEARS = [2019, 2020, 2021, 2022, 2023];

// People per square kilometre, from the 2023 population and land area.
function populationDensity(country) {
  return (country.population * 1e6) / country.area;
}

// GDP per capita in 2019, rebuilt from the 2019 series values, so the
// "change since 2019" cards are computed from the same series the charts draw.
function gdpPerCapita2019(country) {
  return (country.gdpSeries[0] * 1e9) / (country.populationSeries[0] * 1e6);
}

// Percent change of a 2023 value against its 2019 value.
function percentChangeSince2019(value2023, value2019) {
  return ((value2023 - value2019) / value2019) * 100;
}

// Combined totals of all 17 countries, computed from the data above.
function worldTotals() {
  let population = 0;
  let gdp = 0;
  for (const country of COUNTRIES) {
    population += country.population;
    gdp += country.gdp;
  }
  return { countries: COUNTRIES.length, population, gdp };
}

function findCountry(slug) {
  return COUNTRIES.find((country) => country.slug === slug) || null;
}

function sortedCountries(key) {
  const copy = COUNTRIES.slice();
  copy.sort((a, b) => b[key] - a[key]);
  return copy;
}

// Number formatting: full values with thousands separators, never "1.4k".
function formatMillions(value) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatBillions(value) {
  return '$' + value.toLocaleString('en-US');
}

function formatDollars(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

function formatSignedPercent(value) {
  const sign = value >= 0 ? '+' : '';
  return sign + value.toFixed(1) + '%';
}
