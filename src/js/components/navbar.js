import { authStore } from '../store/auth.js';
import { cartStore } from '../store/cart.js';
import { navigate } from '../router.js';

export function renderNavbar(container) {
  const user = authStore.getUser();
  const count = cartStore.getCount();

  container.innerHTML = `
    <div class="navbar-inner">
      <a href="#/" class="navbar-brand">
        <img src="/logo.png" alt="UC Marketplace Logo" class="navbar-logo" onerror="this.style.display='none'">
        <span class="navbar-title">UC <span>Marketplace</span></span>
      </a>

      <ul class="navbar-links">
        <li><a href="#/" data-nav-link="/">🏠 Home</a></li>
        <li><a href="#/products" data-nav-link="/products">🛍️ Browse</a></li>
        <li><a href="#/sell" data-nav-link="/sell">📦 Sell</a></li>
        ${user ? `<li><a href="#/dashboard" data-nav-link="/dashboard">📊 Dashboard</a></li>` : ''}
      </ul>

      <div class="navbar-actions">
        <button class="cart-btn" id="cart-open-btn" aria-label="Open cart">
          🛒
          <span class="cart-count ${count > 0 ? 'visible' : ''}" id="navbar-cart-count">${count}</span>
        </button>

        <div class="navbar-auth">
          ${user
            ? `<div class="user-menu">
                <div class="user-avatar" title="${user.firstName} ${user.lastName}">${user.avatar}</div>
                <span style="color: rgba(255,255,255,0.85); font-size: 0.875rem;">${user.firstName}</span>
                <button class="btn-nav-outline" id="logout-btn">Logout</button>
               </div>`
            : `<a href="#/login" class="btn-nav-outline">Login</a>
               <a href="#/signup" class="btn-nav-filled">Sign Up</a>`
          }
        </div>

        <button class="navbar-toggler" id="navbar-toggler" aria-label="Toggle menu">☰</button>
      </div>
    </div>

    <div class="navbar-mobile" id="navbar-mobile">
      <a href="#/" data-nav-link="/">🏠 Home</a>
      <a href="#/products" data-nav-link="/products">🛍️ Browse</a>
      <a href="#/sell" data-nav-link="/sell">📦 Sell</a>
      ${user ? `<a href="#/dashboard" data-nav-link="/dashboard">📊 Dashboard</a>` : ''}
      <div class="mobile-auth">
        ${user
          ? `<a href="#" id="mobile-logout">Logout</a>`
          : `<a href="#/login">Login</a>
             <a href="#/signup" class="btn-signup-mobile">Sign Up</a>`
        }
      </div>
    </div>
  `;

  // Hamburger toggle
  const toggler  = container.querySelector('#navbar-toggler');
  const mobileMenu = container.querySelector('#navbar-mobile');
  toggler?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // Open cart
  container.querySelector('#cart-open-btn')?.addEventListener('click', openCartSidebar);

  // Logout
  const logoutBtn = container.querySelector('#logout-btn') || container.querySelector('#mobile-logout');
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    authStore.logout();
    navigate('/');
  });
}

export function openCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderCartSidebar();
}

export function closeCartSidebar() {
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderCartSidebar() {
  const itemsContainer = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total-price');
  const items = cartStore.getItems();
  const total = cartStore.getTotal();

  totalEl.textContent = '₩' + total.toLocaleString('ko-KR');

  if (items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <span class="empty-icon">🛒</span>
        <h3>Your cart is empty</h3>
        <p>Browse listings and add items to get started.</p>
        <a href="#/products" class="btn-primary mt-2" style="margin-top: 1rem;" id="cart-browse-btn">Start Shopping</a>
      </div>
    `;
    itemsContainer.querySelector('#cart-browse-btn')?.addEventListener('click', closeCartSidebar);
    return;
  }

  itemsContainer.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-seller">Seller: ${item.seller}</div>
        <div class="cart-item-price">₩${(item.price * item.quantity).toLocaleString('ko-KR')}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="cart-remove" data-id="${item.id}" aria-label="Remove item">🗑️</button>
      </div>
    </div>
  `).join('');

  // Quantity controls
  itemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      cartStore.updateQuantity(id, -1);
      renderCartSidebar();
    });
  });

  itemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      cartStore.updateQuantity(id, 1);
      renderCartSidebar();
    });
  });

  itemsContainer.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      cartStore.removeItem(id);
      renderCartSidebar();
    });
  });
}

export function initCartSidebar() {
  const overlay  = document.querySelector('.cart-overlay');
  const closeBtn = document.querySelector('.cart-close');
  const checkoutBtn = document.getElementById('checkout-btn');

  overlay?.addEventListener('click', closeCartSidebar);
  closeBtn?.addEventListener('click', closeCartSidebar);

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartSidebar();
  });

  checkoutBtn?.addEventListener('click', () => {
    closeCartSidebar();
    navigate('/cart');
  });
}

export function updateNavbarCart() {
  const count = cartStore.getCount();
  const badge = document.getElementById('navbar-cart-count');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }
}
