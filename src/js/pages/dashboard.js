import { authStore } from '../store/auth.js';
import { products } from '../data/products.js';
import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';
import { formatPrice } from '../data/products.js';

// Mock seller's listings (first 4 products as demo)
const MY_LISTINGS_KEY = 'uc_my_listings';

function getMyListings() {
  try {
    const stored = JSON.parse(localStorage.getItem(MY_LISTINGS_KEY) || 'null');
    return stored || products.slice(0, 3).map(p => ({ ...p, status: 'active', views: p.views }));
  } catch {
    return products.slice(0, 3).map(p => ({ ...p, status: 'active', views: p.views }));
  }
}

function saveMyListings(listings) {
  localStorage.setItem(MY_LISTINGS_KEY, JSON.stringify(listings));
}

export function renderDashboard({ container }) {
  const user = authStore.getUser();

  if (!user) {
    container.innerHTML = `
      <div class="container" style="padding: 4rem 1rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
        <h2>Sign In Required</h2>
        <p style="color: var(--gray-600); margin-bottom: 1.5rem;">You need to be logged in to access the dashboard.</p>
        <a href="#/login" class="btn-primary">Sign In</a>
      </div>
    `;
    return;
  }

  let myListings = getMyListings();

  function render() {
    const activeListings = myListings.filter(l => l.status === 'active').length;
    const totalViews = myListings.reduce((s, l) => s + (l.views || 0), 0);
    const soldItems = 3; // Mock
    const earnings = 92500; // Mock

    container.className = 'page-enter';
    container.innerHTML = `
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <div class="container">
          <div class="dashboard-greeting">
            <h1>Hello, ${user.firstName}! 👋</h1>
            <p>Manage your listings and track your activity</p>
          </div>
          <button class="btn-white" id="new-listing-btn"
            style="background: var(--white); color: var(--primary-dark); border: 2px solid var(--white); padding: 0.65rem 1.5rem; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer; font-size: 0.9rem; font-family: var(--font-family);">
            + New Listing
          </button>
        </div>
      </div>

      <div class="dashboard-page">
        <div class="container">
          <!-- Stats -->
          <div class="dashboard-stats">
            <div class="stat-card">
              <div class="stat-icon blue">📦</div>
              <div class="stat-info">
                <span class="stat-value">${activeListings}</span>
                <span class="stat-name">Active Listings</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">✅</div>
              <div class="stat-info">
                <span class="stat-value">${soldItems}</span>
                <span class="stat-name">Items Sold</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">👁️</div>
              <div class="stat-info">
                <span class="stat-value">${totalViews.toLocaleString()}</span>
                <span class="stat-name">Total Views</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">💰</div>
              <div class="stat-info">
                <span class="stat-value">${formatPrice(earnings)}</span>
                <span class="stat-name">Total Earnings</span>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- My Listings -->
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3>My Listings</h3>
                <button class="btn-primary" style="font-size: 0.8rem; padding: 0.4rem 1rem;" id="add-listing-btn">+ Add New</button>
              </div>

              ${myListings.length === 0 ? `
                <div class="empty-state" style="padding: 3rem 1rem;">
                  <div class="empty-icon">📦</div>
                  <h3>No listings yet</h3>
                  <p>Start selling by creating your first listing.</p>
                </div>
              ` : `
                <table class="listings-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Condition</th>
                      <th>Views</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${myListings.map(listing => `
                      <tr>
                        <td data-label="Item">
                          <div class="listing-title-cell">
                            <div class="listing-thumb">${listing.emoji}</div>
                            <div>
                              <div class="listing-name">${listing.title}</div>
                              <div class="listing-category">${listing.category}</div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Price" style="font-weight: 700; color: var(--primary-dark);">${formatPrice(listing.price)}</td>
                        <td data-label="Condition">
                          <span class="badge ${conditionBadge(listing.condition)}">${conditionLabel(listing.condition)}</span>
                        </td>
                        <td data-label="Views">${listing.views}</td>
                        <td data-label="Status">
                          <span class="badge ${listing.status === 'active' ? 'badge-success' : 'badge-gray'}">
                            ${listing.status === 'active' ? '● Active' : '● Inactive'}
                          </span>
                        </td>
                        <td>
                          <div class="action-btns">
                            <button class="btn-icon toggle-status-btn" data-id="${listing.id}" title="${listing.status === 'active' ? 'Deactivate' : 'Activate'}">
                              ${listing.status === 'active' ? '⏸️' : '▶️'}
                            </button>
                            <button class="btn-icon danger delete-listing-btn" data-id="${listing.id}" title="Delete listing">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `}
            </div>

            <!-- Right sidebar -->
            <div>
              <!-- Create Listing Form -->
              <div class="create-listing-card dashboard-card" style="margin-bottom: 1.5rem;">
                <div class="dashboard-card-header">
                  <h3>Quick List an Item</h3>
                </div>
                <div class="card-body" style="padding: 1.25rem;">
                  <form id="quick-list-form">
                    <div class="form-group">
                      <label>Item Title</label>
                      <input type="text" class="form-control" id="item-title" placeholder="What are you selling?" required>
                    </div>
                    <div class="form-group">
                      <label>Price (₩)</label>
                      <input type="number" class="form-control" id="item-price" placeholder="e.g. 15000" min="0" required>
                    </div>
                    <div class="form-group">
                      <label>Category</label>
                      <select class="form-control" id="item-category">
                        <option value="books">📚 Textbooks</option>
                        <option value="electronics">💻 Electronics</option>
                        <option value="clothing">👕 Clothing</option>
                        <option value="furniture">🪑 Furniture</option>
                        <option value="supplies">🖊️ Supplies</option>
                        <option value="food">🍜 Food & Drink</option>
                        <option value="sports">⚽ Sports</option>
                        <option value="misc">📦 Misc</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Condition</label>
                      <select class="form-control" id="item-condition">
                        <option value="new">Brand New</option>
                        <option value="like-new">Like New</option>
                        <option value="good" selected>Good</option>
                        <option value="fair">Fair</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Description</label>
                      <textarea class="form-control" id="item-desc" rows="3" placeholder="Describe your item…" style="resize: vertical;"></textarea>
                    </div>
                    <button type="submit" class="btn-primary btn-full">📦 Post Listing</button>
                  </form>
                </div>
              </div>

              <!-- Mock messages -->
              <div class="dashboard-card">
                <div class="dashboard-card-header">
                  <h3>Recent Messages</h3>
                  <span class="badge badge-primary">3 new</span>
                </div>
                <div class="messages-list">
                  ${mockMessages().map(m => `
                    <div class="message-item">
                      <div class="message-avatar">${m.avatar}</div>
                      <div class="message-info">
                        <div class="msg-sender">${m.sender}</div>
                        <div class="msg-preview">${m.message}</div>
                        <div class="msg-time">${m.time}</div>
                      </div>
                      ${m.unread ? `<div class="msg-unread">${m.unread}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // New listing buttons → scroll to form
    container.querySelectorAll('#new-listing-btn, #add-listing-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelector('#quick-list-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    // Toggle status
    container.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const listing = myListings.find(l => l.id === id);
        if (listing) {
          listing.status = listing.status === 'active' ? 'inactive' : 'active';
          saveMyListings(myListings);
          render();
          showToast(`Listing ${listing.status === 'active' ? 'activated' : 'deactivated'}.`, 'info');
        }
      });
    });

    // Delete listing
    container.querySelectorAll('.delete-listing-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Remove this listing?')) return;
        const id = Number(btn.dataset.id);
        myListings = myListings.filter(l => l.id !== id);
        saveMyListings(myListings);
        render();
        showToast('Listing removed.', 'info');
      });
    });

    // Quick list form
    const quickForm = container.querySelector('#quick-list-form');
    quickForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = container.querySelector('#item-title').value.trim();
      const price = Number(container.querySelector('#item-price').value);
      const category = container.querySelector('#item-category').value;
      const condition = container.querySelector('#item-condition').value;
      const desc = container.querySelector('#item-desc').value.trim();

      if (!title || !price) {
        showToast('Please fill in the required fields.', 'error');
        return;
      }

      const categoryEmojis = { books: '📚', electronics: '💻', clothing: '👕', furniture: '🪑', supplies: '🖊️', food: '🍜', sports: '⚽', misc: '📦' };

      const newListing = {
        id: Date.now(),
        title,
        price,
        category,
        condition,
        description: desc || 'No description provided.',
        emoji: categoryEmojis[category] || '📦',
        seller: { name: `${user.firstName} ${user.lastName}`, avatar: user.avatar, rating: 5.0, reviews: 0 },
        views: 0,
        listed: new Date().toISOString().split('T')[0],
        status: 'active',
        featured: false,
      };

      myListings.unshift(newListing);
      saveMyListings(myListings);
      render();
      showToast(`"${title}" listed successfully! 🎉`, 'success');
    });
  }

  render();
}

// Helpers
function conditionLabel(c) {
  return { new: 'New', 'like-new': 'Like New', good: 'Good', fair: 'Fair' }[c] || c;
}

function conditionBadge(c) {
  return { new: 'badge-success', 'like-new': 'badge-primary', good: 'badge-warning', fair: 'badge-danger' }[c] || 'badge-gray';
}

function mockMessages() {
  return [
    { sender: 'Park Sungmin', avatar: 'PS', message: 'Is the tablet still available?', time: '2m ago', unread: 2 },
    { sender: 'Lee Minji', avatar: 'LM', message: 'Can you lower the price a bit?', time: '15m ago', unread: 1 },
    { sender: 'Choi Donghyun', avatar: 'CD', message: 'Where can we meet on campus?', time: '1h ago', unread: null },
  ];
}
