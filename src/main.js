// ===== STYLES =====
import './styles/main.css';
import './styles/navbar.css';
import './styles/footer.css';
import './styles/home.css';
import './styles/products.css';
import './styles/product-detail.css';
import './styles/cart.css';
import './styles/auth.css';
import './styles/dashboard.css';

// ===== MODULES =====
import { initRouter, route } from './js/router.js';
import { renderNavbar, initCartSidebar, updateNavbarCart } from './js/components/navbar.js';
import { renderFooter } from './js/components/footer.js';
import { cartStore } from './js/store/cart.js';
import { authStore } from './js/store/auth.js';
import { products } from './js/data/products.js';

// ===== PAGES =====
import { renderHome } from './js/pages/home.js';
import { renderProductsPage } from './js/pages/products.js';
import { renderProductDetail } from './js/pages/product-detail.js';
import { renderCartPage } from './js/pages/cart.js';
import { renderLoginPage, renderSignupPage } from './js/pages/auth.js';
import { renderDashboard } from './js/pages/dashboard.js';
import { renderSellPage } from './js/pages/sell.js';

// Expose product data for event handlers in pages
window.__ucData = {
  getAllProducts: () => products,
};

// ===== INIT APP =====
function initApp() {
  const navbarEl = document.getElementById('navbar');
  const footerEl = document.getElementById('footer');

  // Initial renders
  renderNavbar(navbarEl);
  renderFooter(footerEl);
  initCartSidebar();

  // Re-render navbar when auth or cart changes
  authStore.subscribe(() => {
    renderNavbar(navbarEl);
    initCartSidebar();
  });

  cartStore.subscribe(() => {
    updateNavbarCart();
  });

  // ===== ROUTES =====
  route('/', renderHome);
  route('/products', ({ container, params }) => renderProductsPage({ container, params }));
  route('/product/:id', ({ container, routeParams }) => renderProductDetail({ container, routeParams }));
  route('/cart', renderCartPage);
  route('/login', renderLoginPage);
  route('/signup', renderSignupPage);
  route('/dashboard', renderDashboard);
  route('/sell', renderSellPage);

  initRouter();
}

initApp();
