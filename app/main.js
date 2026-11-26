// NationStat router: hash routes #/ (dashboard), #/country/<slug>,
// #/rankings and #/about. Renders the matching view and moves the
// navigation highlight; unknown routes fall back to the dashboard.

function currentRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1);
  const parts = path.split('/').filter((part) => part.length > 0);
  if (parts.length === 0) return { page: 'dashboard' };
  if (parts[0] === 'country' && parts[1]) return { page: 'country', slug: parts[1] };
  if (parts[0] === 'rankings') return { page: 'rankings' };
  if (parts[0] === 'about') return { page: 'about' };
  return { page: 'dashboard' };
}

function markActiveNav(page) {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const target = link.getAttribute('data-page');
    if (target === page) {
      link.classList.add('nav-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('nav-active');
      link.removeAttribute('aria-current');
    }
  });
}

function renderRoute() {
  const route = currentRoute();
  if (route.page === 'country') {
    renderCountryPage(route.slug);
  } else if (route.page === 'rankings') {
    renderRankingsPage();
  } else if (route.page === 'about') {
    renderAboutPage();
  } else {
    renderDashboard();
  }
  markActiveNav(route.page === 'country' ? 'dashboard' : route.page);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderRoute);
document.addEventListener('DOMContentLoaded', renderRoute);
