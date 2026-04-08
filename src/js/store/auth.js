/**
 * Auth store - mock authentication state
 */

const AUTH_KEY = 'uc_marketplace_user';

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
}

let currentUser = loadUser();
const listeners = new Set();

function notify() {
  listeners.forEach(fn => fn(currentUser));
}

export const authStore = {
  getUser() {
    return currentUser;
  },

  isLoggedIn() {
    return currentUser !== null;
  },

  login(email, password) {
    // Mock login – accept any campus email
    if (!email.endsWith('@office.uc.ac.kr') && !email.endsWith('@uc.ac.kr')) {
      throw new Error('Please use your UC campus email address.');
    }
    if (password.length < 6) {
      throw new Error('Incorrect password.');
    }

    const name = email.split('@')[0].replace('.', ' ');
    const firstName = name.split(' ')[0];
    const lastName  = name.split(' ')[1] || '';

    currentUser = {
      email,
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName:  lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : '',
      avatar: (firstName[0] || 'U').toUpperCase(),
      joinedAt: new Date().toISOString(),
      listings: 0,
      sold: 0,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    notify();
    return currentUser;
  },

  signup(data) {
    const { firstName, lastName, email, password } = data;

    if (!email.endsWith('@office.uc.ac.kr') && !email.endsWith('@uc.ac.kr')) {
      throw new Error('Please use your UC campus email address (e.g. name@office.uc.ac.kr).');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    currentUser = {
      email,
      firstName,
      lastName,
      avatar: (firstName[0] || 'U').toUpperCase(),
      joinedAt: new Date().toISOString(),
      listings: 0,
      sold: 0,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    notify();
    return currentUser;
  },

  logout() {
    currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    notify();
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
