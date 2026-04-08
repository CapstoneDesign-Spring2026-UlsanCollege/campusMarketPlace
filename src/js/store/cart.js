/**
 * Cart store - manages shopping cart state
 */

const CART_KEY = 'uc_marketplace_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

let items = loadCart();
const listeners = new Set();

function notify() {
  listeners.forEach(fn => fn(items));
}

export const cartStore = {
  getItems() {
    return [...items];
  },

  getCount() {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  },

  getTotal() {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  addItem(product) {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        seller: product.seller.name,
        emoji: product.emoji,
        quantity: 1,
      });
    }
    saveCart(items);
    notify();
  },

  removeItem(id) {
    items = items.filter(i => i.id !== id);
    saveCart(items);
    notify();
  },

  updateQuantity(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(items);
    notify();
  },

  clearCart() {
    items = [];
    saveCart(items);
    notify();
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
