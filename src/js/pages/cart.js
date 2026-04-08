import { cartStore } from '../store/cart.js';
import { navigate } from '../router.js';
import { formatPrice } from '../data/products.js';
import { showToast } from '../utils/toast.js';

export function renderCartPage({ container }) {
  container.className = 'page-enter';

  function render() {
    const items = cartStore.getItems();
    const total = cartStore.getTotal();
    const shipping = 0; // Free campus pickup
    const grandTotal = total + shipping;

    container.innerHTML = `
      <div class="cart-page">
        <div class="container">
          <h1 style="margin-bottom: 1.75rem;">🛒 My Cart</h1>

          ${items.length === 0 ? `
            <div class="empty-state" style="background: var(--white); border-radius: var(--radius-md); padding: 4rem 2rem; box-shadow: var(--shadow-sm);">
              <div class="empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Browse listings and add some items to your cart.</p>
              <a href="#/products" class="btn-primary" style="margin-top: 1.25rem; display: inline-flex;">Start Shopping</a>
            </div>
          ` : `
            <div class="cart-page-grid">
              <!-- Items -->
              <div class="cart-page-items">
                <h3 style="margin-bottom: 1.25rem; font-size: 1rem; color: var(--gray-600);">${items.length} item${items.length !== 1 ? 's' : ''}</h3>

                ${items.map(item => `
                  <div class="cart-page-item" data-id="${item.id}">
                    <div class="cart-page-img">${item.emoji}</div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem;">${item.title}</div>
                      <div style="font-size: 0.8rem; color: var(--gray-500); margin-bottom: 0.5rem;">Seller: ${item.seller}</div>
                      <div style="font-weight: 700; color: var(--primary-dark);">${formatPrice(item.price)}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem;">
                      <div class="quantity-control">
                        <button class="qty-btn cart-qty-minus" data-id="${item.id}">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn cart-qty-plus" data-id="${item.id}">+</button>
                      </div>
                      <div style="font-weight: 700; color: var(--gray-900);">${formatPrice(item.price * item.quantity)}</div>
                      <button class="btn-danger" data-id="${item.id}" style="font-size: 0.75rem; padding: 0.3rem 0.7rem;">Remove</button>
                    </div>
                  </div>
                `).join('')}

                <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--gray-200);">
                  <button class="btn-ghost" id="clear-cart-btn" style="color: var(--danger);">🗑️ Clear all items</button>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="order-summary">
                <h3>Order Summary</h3>
                <div class="summary-row">
                  <span>Subtotal (${items.length} item${items.length !== 1 ? 's' : ''})</span>
                  <span>${formatPrice(total)}</span>
                </div>
                <div class="summary-row">
                  <span>Pickup</span>
                  <span style="color: var(--success);">Free</span>
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>${formatPrice(grandTotal)}</span>
                </div>
                <button class="btn-primary btn-full" id="checkout-page-btn" style="margin-top: 1rem; font-size: 1rem; padding: 0.9rem;">
                  Proceed to Checkout
                </button>
                <a href="#/products" class="btn-secondary btn-full" style="margin-top: 0.75rem; font-size: 0.9rem; padding: 0.7rem; display: flex; justify-content: center;">
                  Continue Shopping
                </a>
                <div style="margin-top: 1.25rem; padding: 1rem; background: var(--gray-100); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--gray-600);">
                  🛡️ All transactions are between verified UC students. Meet on campus for handoffs.
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    container.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        cartStore.updateQuantity(Number(btn.dataset.id), -1);
        render();
      });
    });

    container.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        cartStore.updateQuantity(Number(btn.dataset.id), 1);
        render();
      });
    });

    container.querySelectorAll('.btn-danger[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        cartStore.removeItem(Number(btn.dataset.id));
        render();
        showToast('Item removed from cart.', 'info');
      });
    });

    container.querySelector('#clear-cart-btn')?.addEventListener('click', () => {
      if (confirm('Remove all items from your cart?')) {
        cartStore.clearCart();
        render();
        showToast('Cart cleared.', 'info');
      }
    });

    container.querySelector('#checkout-page-btn')?.addEventListener('click', () => {
      showToast('Checkout coming soon! 🎉 Contact sellers directly.', 'info', 5000);
    });
  }

  render();
}
