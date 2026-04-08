import { searchProducts, CATEGORIES, CONDITIONS, formatPrice } from '../data/products.js';
import { cartStore } from '../store/cart.js';
import { showToast } from '../utils/toast.js';
import { navigate } from '../router.js';

/**
 * Renders a product card HTML string
 */
export function renderProductCard(product) {
  const conditionLabels = { new: 'Brand New', 'like-new': 'Like New', good: 'Good', fair: 'Fair' };
  const conditionColors = { new: 'success', 'like-new': 'primary', good: 'warning', fair: 'danger' };

  return `
    <a href="#/product/${product.id}" class="product-card">
      <div class="product-card-image">
        <div class="product-emoji-img">${product.emoji}</div>
        <span class="badge badge-${conditionColors[product.condition]} product-badge">
          ${conditionLabels[product.condition]}
        </span>
        <button class="wishlist-btn" data-id="${product.id}" onclick="event.preventDefault()">🤍</button>
      </div>
      <div class="product-card-body">
        <div class="product-category">${CATEGORIES.find(c => c.id === product.category)?.label || product.category}</div>
        <div class="product-title">${product.title}</div>
        <div class="product-condition">👤 ${product.seller.name}</div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-to-cart-mini" data-id="${product.id}" title="Add to cart" onclick="event.preventDefault()">+</button>
        </div>
      </div>
    </a>
  `;
}

export function renderProductsPage({ container, params }) {
  const initialCategory = params.category || 'all';
  const initialQuery    = params.q || '';

  container.className = 'page-enter';
  container.innerHTML = `
    <div class="products-page">
      <div class="container">
        <div class="products-header">
          <h1>Browse Listings</h1>
          <p>Find great deals from fellow UC students</p>
        </div>

        <!-- Filters -->
        <div class="filters-bar">
          <div class="filter-group search-filter">
            <label>Search</label>
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-control" id="search-input" placeholder="Search products…" value="${initialQuery}">
            </div>
          </div>

          <div class="filter-group">
            <label>Category</label>
            <select class="form-control" id="category-filter">
              ${CATEGORIES.map(c => `
                <option value="${c.id}" ${c.id === initialCategory ? 'selected' : ''}>${c.icon} ${c.label}</option>
              `).join('')}
            </select>
          </div>

          <div class="filter-group">
            <label>Sort By</label>
            <select class="form-control" id="sort-filter">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Condition</label>
            <select class="form-control" id="condition-filter">
              <option value="all">All Conditions</option>
              ${CONDITIONS.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
            </select>
          </div>

          <div class="filter-actions">
            <button class="btn-ghost" id="clear-filters">✕ Clear</button>
          </div>
        </div>

        <!-- Results info -->
        <div class="results-info">
          <span id="results-count" class="results-count"></span>
          <span id="active-category" class="text-muted"></span>
        </div>

        <!-- Grid -->
        <div class="products-grid" id="products-grid"></div>
      </div>
    </div>
  `;

  const searchInput  = container.querySelector('#search-input');
  const categoryEl   = container.querySelector('#category-filter');
  const sortEl       = container.querySelector('#sort-filter');
  const conditionEl  = container.querySelector('#condition-filter');
  const clearBtn     = container.querySelector('#clear-filters');
  const grid         = container.querySelector('#products-grid');
  const countEl      = container.querySelector('#results-count');
  const activeCatEl  = container.querySelector('#active-category');

  function applyFilters() {
    const query     = searchInput.value.trim();
    const category  = categoryEl.value;
    const sortBy    = sortEl.value;
    const condition = conditionEl.value;

    let results = searchProducts(query, category, sortBy);

    if (condition !== 'all') {
      results = results.filter(p => p.condition === condition);
    }

    countEl.textContent = `${results.length} listing${results.length !== 1 ? 's' : ''} found`;

    const cat = CATEGORIES.find(c => c.id === category);
    activeCatEl.textContent = category !== 'all' ? `in ${cat?.label}` : '';

    if (results.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No listings found</h3>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = results.map(p => renderProductCard(p)).join('');
  }

  searchInput.addEventListener('input', applyFilters);
  categoryEl.addEventListener('change', applyFilters);
  sortEl.addEventListener('change', applyFilters);
  conditionEl.addEventListener('change', applyFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    categoryEl.value = 'all';
    sortEl.value = 'default';
    conditionEl.value = 'all';
    applyFilters();
  });

  // Add to cart via event delegation
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-mini');
    if (btn) {
      e.preventDefault();
      const id = Number(btn.dataset.id);
      const { getAllProducts } = window.__ucData || {};
      const allProducts = (typeof getAllProducts === 'function') ? getAllProducts() : [];
      const product = allProducts.find(p => p.id === id);
      if (product) {
        cartStore.addItem(product);
        showToast(`Added to cart!`, 'success');
      }
    }
  });

  // Initial render
  applyFilters();
}
