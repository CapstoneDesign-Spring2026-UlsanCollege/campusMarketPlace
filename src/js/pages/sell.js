import { authStore } from '../store/auth.js';
import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';
import { products, CATEGORIES, formatPrice } from '../data/products.js';
import { cartStore } from '../store/cart.js';
import { renderProductCard } from './products.js';

export function renderSellPage({ container }) {
  const user = authStore.getUser();

  if (!user) {
    container.className = 'page-enter';
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-card" style="max-width: 480px;">
          <div class="auth-logo">
            <span class="logo-icon">📦</span>
            <h1>Sell an Item</h1>
            <p>Sign in to post your first listing</p>
          </div>
          <div style="text-align: center; margin-top: 1rem;">
            <a href="#/login" class="btn-primary" style="margin-right: 0.75rem;">Sign In</a>
            <a href="#/signup" class="btn-secondary">Create Account</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  container.className = 'page-enter';
  container.innerHTML = `
    <div style="padding: 2rem 0 4rem;">
      <div class="container" style="max-width: 680px;">
        <h1 style="margin-bottom: 0.25rem;">📦 Post a Listing</h1>
        <p style="color: var(--gray-600); margin-bottom: 2rem;">Fill in the details to list your item on UC Marketplace</p>

        <div class="card">
          <div class="card-body" style="padding: 2rem;">
            <form id="sell-form" novalidate>
              <div class="form-group">
                <label for="sell-title">Item Title *</label>
                <input type="text" id="sell-title" class="form-control" placeholder="e.g. Introduction to Programming Textbook" maxlength="100" required>
                <span class="form-hint" id="title-hint"></span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label for="sell-category">Category *</label>
                  <select class="form-control" id="sell-category">
                    ${CATEGORIES.filter(c => c.id !== 'all').map(c =>
                      `<option value="${c.id}">${c.icon} ${c.label}</option>`
                    ).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="sell-condition">Condition *</label>
                  <select class="form-control" id="sell-condition">
                    <option value="new">Brand New</option>
                    <option value="like-new">Like New</option>
                    <option value="good" selected>Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label for="sell-price">Price (₩) *</label>
                  <input type="number" id="sell-price" class="form-control" placeholder="e.g. 15000" min="0" step="500">
                  <span class="form-hint" id="price-hint"></span>
                </div>
                <div class="form-group">
                  <label for="sell-original">Original Price (₩)</label>
                  <input type="number" id="sell-original" class="form-control" placeholder="Optional" min="0" step="500">
                </div>
              </div>

              <div class="form-group">
                <label for="sell-description">Description *</label>
                <textarea id="sell-description" class="form-control" rows="5"
                  placeholder="Describe your item – condition details, why you're selling, any included accessories…"
                  style="resize: vertical;" required></textarea>
                <span class="form-hint" id="desc-hint"></span>
              </div>

              <div class="form-group">
                <label for="sell-meetup">Preferred Meetup Location</label>
                <select class="form-control" id="sell-meetup">
                  <option value="library">Library (Main Entrance)</option>
                  <option value="cafeteria">Student Cafeteria</option>
                  <option value="main-building">Main Building Lobby</option>
                  <option value="gym">Campus Gym</option>
                  <option value="other">Other (specify in description)</option>
                </select>
              </div>

              <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                <button type="submit" class="btn-primary" style="flex: 1;" id="sell-submit">📦 Post Listing</button>
                <button type="button" class="btn-secondary" id="sell-cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <div style="margin-top: 2rem; padding: 1.25rem; background: var(--primary-light); border-radius: var(--radius-md); font-size: 0.875rem; color: var(--primary-dark);">
          <strong>📋 Selling Guidelines</strong>
          <ul style="margin-top: 0.5rem; padding-left: 1.25rem; line-height: 1.9;">
            <li>Only list items you personally own and intend to sell</li>
            <li>Be honest about the condition – include any flaws</li>
            <li>Set a fair price; check similar listings for reference</li>
            <li>Always meet buyers in a campus public space</li>
            <li>Do not list prohibited or illegal items</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const form     = container.querySelector('#sell-form');
  const titleEl  = container.querySelector('#sell-title');
  const priceEl  = container.querySelector('#sell-price');
  const descEl   = container.querySelector('#sell-description');
  const submitBtn = container.querySelector('#sell-submit');
  const cancelBtn = container.querySelector('#sell-cancel-btn');

  cancelBtn?.addEventListener('click', () => navigate('/dashboard'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const titleHint = container.querySelector('#title-hint');
    const priceHint = container.querySelector('#price-hint');
    const descHint  = container.querySelector('#desc-hint');

    if (!titleEl.value.trim()) {
      titleEl.classList.add('error'); titleHint.textContent = 'Title is required'; valid = false;
    } else {
      titleEl.classList.remove('error'); titleHint.textContent = '';
    }

    if (!priceEl.value || Number(priceEl.value) <= 0) {
      priceEl.classList.add('error'); priceHint.textContent = 'Enter a valid price'; valid = false;
    } else {
      priceEl.classList.remove('error'); priceHint.textContent = '';
    }

    if (!descEl.value.trim()) {
      descEl.classList.add('error'); descHint.textContent = 'Description is required'; valid = false;
    } else {
      descEl.classList.remove('error'); descHint.textContent = '';
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Posting…';

    await new Promise(r => setTimeout(r, 700));

    showToast(`"${titleEl.value.trim()}" has been listed! 🎉`, 'success', 4000);
    navigate('/dashboard');
  });
}
