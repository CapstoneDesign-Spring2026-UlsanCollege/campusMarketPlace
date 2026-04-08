/**
 * Simple hash-based client-side router
 */

const routes = new Map();
let currentCleanup = null;

export function route(path, handler) {
  routes.set(path, handler);
}

function getHash() {
  return window.location.hash.slice(1) || '/';
}

function parsePath(hash) {
  const [path, ...rest] = hash.split('?');
  const params = {};
  const queryString = rest.join('?');
  if (queryString) {
    for (const [k, v] of new URLSearchParams(queryString)) {
      params[k] = v;
    }
  }
  return { path, params };
}

function matchRoute(path) {
  // Exact match
  if (routes.has(path)) return { handler: routes.get(path), routeParams: {} };

  // Pattern match (e.g. /product/:id)
  for (const [pattern, handler] of routes) {
    const patternParts = pattern.split('/');
    const pathParts    = path.split('/');

    if (patternParts.length !== pathParts.length) continue;

    const routeParams = {};
    let matched = true;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        routeParams[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        matched = false;
        break;
      }
    }

    if (matched) return { handler, routeParams };
  }

  return null;
}

export function navigate(path) {
  window.location.hash = path;
}

export function initRouter() {
  function handleRoute() {
    const hash = getHash();
    const { path, params } = parsePath(hash);
    const match = matchRoute(path);

    const container = document.getElementById('main-content');

    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    if (match) {
      const result = match.handler({ params, routeParams: match.routeParams, container });
      if (typeof result === 'function') currentCleanup = result;
    } else {
      container.innerHTML = `
        <div class="container" style="padding: 4rem 1rem; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
          <h2>Page Not Found</h2>
          <p style="color: var(--gray-600); margin-bottom: 1.5rem;">The page you are looking for does not exist.</p>
          <a href="#/" class="btn-primary">Go Home</a>
        </div>
      `;
    }

    // Update active nav links
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      const linkPath = link.getAttribute('data-nav-link');
      link.classList.toggle('active', path === linkPath || (linkPath !== '/' && path.startsWith(linkPath)));
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
