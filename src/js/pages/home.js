import { getFeaturedProducts, CATEGORIES, formatPrice } from '../data/products.js';
import { cartStore } from '../store/cart.js';
import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';
import { renderProductCard } from './products.js';

export function renderHome({ container }) {
  container.className = 'page-enter';
  container.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Your Campus<br><span>Marketplace</span></h1>
          <p>Buy and sell within Ulsan College. Trusted by students, for students. Safe, simple, and campus-verified.</p>

          <div class="hero-search">
            <span class="search-icon">🔍</span>
            <input type="text" id="hero-search-input" placeholder="Search textbooks, electronics, clothing…" />
            <button id="hero-search-btn">Search</button>
          </div>

          <div class="hero-actions">
            <a href="#/products" class="btn-white">🛍️ Start Shopping</a>
            <a href="#/sell" class="btn-outline-white">📦 Sell an Item</a>
          </div>
        </div>

        <div class="hero-image">
          <img src="/logo.png" alt="UC Marketplace" class="hero-logo" onerror="this.style.display='none'">
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="stat-value">500+</span>
              <span class="stat-label">Listings</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">1,200+</span>
              <span class="stat-label">Students</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">99%</span>
              <span class="stat-label">Safe Trades</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories-section">
      <div class="container">
        <div class="section-heading">
          <h2>Shop by Category</h2>
          <div class="divider"></div>
          <p>Find exactly what you need</p>
        </div>
        <div class="categories-grid">
          ${CATEGORIES.filter(c => c.id !== 'all').map(cat => `
            <a href="#/products?category=${cat.id}" class="category-card">
              <div class="cat-icon">${cat.icon}</div>
              <div class="cat-name">${cat.label}</div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FEATURED LISTINGS -->
    <section class="recent-section">
      <div class="container">
        <div class="section-header">
          <h2>⭐ Featured Listings</h2>
          <a href="#/products" class="btn-secondary">View All →</a>
        </div>
        <div class="products-grid" id="featured-grid">
          ${getFeaturedProducts().map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features-section">
      <div class="container">
        <div class="section-heading">
          <h2>Why UC Marketplace?</h2>
          <div class="divider"></div>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Campus-Only Access</h3>
            <p>Only verified UC students can buy and sell. Your campus email is your key.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💸</div>
            <h3>Save Big</h3>
            <p>Buy used textbooks and essentials at a fraction of store prices.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Safe Trading</h3>
            <p>Meet in campus public spaces. All sellers are verified students.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Korean & English</h3>
            <p>Accessible for both Korean and international students at Ulsan College.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Browse and shop from your phone between classes, anytime.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">♻️</div>
            <h3>Eco Friendly</h3>
            <p>Reduce waste by giving items a second life within the campus community.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Start Trading?</h2>
        <p>Join over 1,200 UC students already buying and selling on campus.</p>
        <div class="cta-actions">
          <a href="#/signup" class="btn-white">Create Free Account</a>
          <a href="#/products" class="btn-outline-white">Browse Listings</a>
        </div>
      </div>
    </section>
  `;

  // Hero search
  const searchInput = container.querySelector('#hero-search-input');
  const searchBtn   = container.querySelector('#hero-search-btn');

  const doSearch = () => {
    const q = searchInput.value.trim();
    if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
    else navigate('/products');
  };

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  // Add to cart on featured grid
  container.querySelector('#featured-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-mini');
    if (btn) {
      e.preventDefault();
      const id = Number(btn.dataset.id);
      const getAllProducts = window.__ucData?.getAllProducts;
      const allProducts = typeof getAllProducts === 'function' ? getAllProducts() : [];
      const product = allProducts.find(p => p.id === id);
      if (product) {
        cartStore.addItem(product);
        showToast(`"${product.title}" added to cart!`, 'success');
      }
    }
  });
}
