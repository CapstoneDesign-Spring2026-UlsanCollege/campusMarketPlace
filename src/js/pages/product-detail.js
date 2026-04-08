import { getProductById, products as allProducts, CATEGORIES, formatPrice } from '../data/products.js';
import { cartStore } from '../store/cart.js';
import { showToast } from '../utils/toast.js';
import { renderProductCard } from './products.js';

export function renderProductDetail({ container, routeParams }) {
  const id = routeParams.id;
  const product = getProductById(id);

  container.className = 'page-enter';

  if (!product) {
    container.innerHTML = `
      <div class="container" style="padding: 4rem 1rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
        <h2>Product Not Found</h2>
        <p style="color: var(--gray-600); margin-bottom: 1.5rem;">This listing may have been removed.</p>
        <a href="#/products" class="btn-primary">Back to Listings</a>
      </div>
    `;
    return;
  }

  const conditionLabels = { new: 'Brand New', 'like-new': 'Like New', good: 'Good', fair: 'Fair' };
  const conditionClass  = { new: 'condition-new', 'like-new': 'condition-like-new', good: 'condition-good', fair: 'condition-fair' };

  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // Similar products (same category, excluding current)
  const similar = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  container.innerHTML = `
    <div class="product-detail-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="#/">Home</a>
          <span class="breadcrumb-sep">›</span>
          <a href="#/products">Browse</a>
          <span class="breadcrumb-sep">›</span>
          <a href="#/products?category=${product.category}">${catLabel}</a>
          <span class="breadcrumb-sep">›</span>
          <span>${product.title}</span>
        </nav>

        <div class="product-detail-grid">
          <!-- Gallery -->
          <div class="product-gallery">
            <div class="gallery-main">${product.emoji}</div>
            <div style="display: flex; gap: 0.5rem;">
              ${[1,2,3].map(() => `
                <div style="width: 80px; height: 80px; background: var(--gray-100); border-radius: var(--radius-sm); display:flex; align-items:center; justify-content:center; font-size: 1.75rem; cursor: pointer; border: 2px solid var(--gray-200);">
                  ${product.emoji}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <span class="product-category-tag">${catLabel}</span>
            <h1>${product.title}</h1>

            <div class="product-price-block">
              <span class="product-detail-price">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>` : ''}
              ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
            </div>

            <div class="condition-row">
              <span class="condition-label">Condition:</span>
              <span class="condition-badge ${conditionClass[product.condition]}">${conditionLabels[product.condition]}</span>
              <span class="text-muted" style="font-size: 0.8rem;">👁️ ${product.views} views</span>
            </div>

            <div class="product-description">
              <h3>Description</h3>
              <p>${product.description}</p>
            </div>

            <!-- Seller -->
            <div class="seller-card">
              <div class="seller-avatar">${product.seller.avatar}</div>
              <div class="seller-info">
                <h4>${product.seller.name}</h4>
                <p>UC Student · ${product.seller.reviews} reviews</p>
              </div>
              <div class="seller-rating">
                <div class="stars">${'★'.repeat(Math.round(product.seller.rating))}${'☆'.repeat(5 - Math.round(product.seller.rating))}</div>
                <div class="rating-count">${product.seller.rating} / 5.0</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="purchase-actions">
              <button class="btn-primary btn-full" id="add-to-cart-btn">🛒 Add to Cart</button>
              <button class="btn-secondary btn-full" id="contact-seller-btn">💬 Message Seller</button>
            </div>

            <!-- Safety notice -->
            <div class="safety-notice">
              <span class="notice-icon">🛡️</span>
              <div>
                <strong>Safety First!</strong> Always meet in a campus public area (library, cafeteria, main lobby). Never share personal financial information.
              </div>
            </div>
          </div>
        </div>

        <!-- Similar listings -->
        ${similar.length > 0 ? `
          <div class="similar-section">
            <h2 style="margin-bottom: 1.5rem;">Similar Listings</h2>
            <div class="products-grid">
              ${similar.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Add to cart
  container.querySelector('#add-to-cart-btn')?.addEventListener('click', () => {
    cartStore.addItem(product);
    showToast(`"${product.title}" added to cart!`, 'success');
  });

  // Contact seller (mock)
  container.querySelector('#contact-seller-btn')?.addEventListener('click', () => {
    showToast('Messaging feature coming soon! 📬', 'info');
  });
}
