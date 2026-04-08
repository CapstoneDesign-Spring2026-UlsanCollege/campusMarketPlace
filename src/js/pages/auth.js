import { authStore } from '../store/auth.js';
import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';

export function renderLoginPage({ container }) {
  if (authStore.isLoggedIn()) {
    navigate('/dashboard');
    return;
  }

  container.className = 'page-enter';
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-icon">🏪</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your UC Marketplace account</p>
        </div>

        <form id="login-form" novalidate>
          <div class="form-group">
            <label for="login-email">Campus Email</label>
            <input type="email" id="login-email" class="form-control" placeholder="name@office.uc.ac.kr" autocomplete="email" required>
            <span class="form-hint" id="email-hint"></span>
          </div>

          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="Your password" autocomplete="current-password" required>
            <span class="form-hint" id="pw-hint"></span>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <a href="#" style="font-size: 0.85rem;" onclick="alert('Password reset coming soon!')">Forgot password?</a>
          </div>

          <button type="submit" class="btn-primary btn-full" id="login-submit">
            Sign In
          </button>
        </form>

        <div class="auth-divider">or</div>

        <div class="social-login">
          <button class="btn-social" onclick="alert('Google login coming soon!')">
            <span class="social-icon">🌐</span> Continue with Google
          </button>
          <button class="btn-social" onclick="alert('KakaoTalk login coming soon!')">
            <span class="social-icon">💬</span> Continue with KakaoTalk
          </button>
        </div>

        <div class="auth-footer">
          Don't have an account? <a href="#/signup">Sign up for free</a>
        </div>
      </div>
    </div>
  `;

  const form      = container.querySelector('#login-form');
  const emailEl   = container.querySelector('#login-email');
  const pwEl      = container.querySelector('#login-password');
  const emailHint = container.querySelector('#email-hint');
  const pwHint    = container.querySelector('#pw-hint');
  const submitBtn = container.querySelector('#login-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;

    if (!emailEl.value.trim()) {
      setError(emailEl, emailHint, 'Email is required');
      valid = false;
    } else {
      clearError(emailEl, emailHint);
    }

    if (!pwEl.value) {
      setError(pwEl, pwHint, 'Password is required');
      valid = false;
    } else {
      clearError(pwEl, pwHint);
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Signing in…';

    try {
      await delay(600); // Simulate network request
      authStore.login(emailEl.value.trim(), pwEl.value);
      showToast('Welcome back! 🎉', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

export function renderSignupPage({ container }) {
  if (authStore.isLoggedIn()) {
    navigate('/dashboard');
    return;
  }

  container.className = 'page-enter';
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-icon">🏪</span>
          <h1>Create Account</h1>
          <p>Join the UC campus marketplace community</p>
        </div>

        <form id="signup-form" novalidate>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="first-name">First Name *</label>
              <input type="text" id="first-name" class="form-control" placeholder="First name" autocomplete="given-name">
              <span class="form-hint" id="fn-hint"></span>
            </div>
            <div class="form-group">
              <label for="last-name">Last Name *</label>
              <input type="text" id="last-name" class="form-control" placeholder="Last name" autocomplete="family-name">
              <span class="form-hint" id="ln-hint"></span>
            </div>
          </div>

          <div class="form-group">
            <label for="signup-email">Campus Email *</label>
            <input type="email" id="signup-email" class="form-control" placeholder="name@office.uc.ac.kr" autocomplete="email">
            <span class="form-hint" id="email-hint">Must be your UC campus email address</span>
          </div>

          <div class="form-group">
            <label for="signup-password">Password *</label>
            <input type="password" id="signup-password" class="form-control" placeholder="Min. 8 characters" autocomplete="new-password">
            <div class="password-strength">
              <div class="strength-bar"><div class="strength-fill" id="strength-fill"></div></div>
              <span class="strength-label" id="strength-label"></span>
            </div>
            <span class="form-hint" id="pw-hint"></span>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password *</label>
            <input type="password" id="confirm-password" class="form-control" placeholder="Repeat your password" autocomplete="new-password">
            <span class="form-hint" id="cpw-hint"></span>
          </div>

          <button type="submit" class="btn-primary btn-full" id="signup-submit">
            Create Account
          </button>
        </form>

        <div class="terms-text">
          By creating an account you agree to our
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          This platform is exclusively for Ulsan College students.
        </div>

        <div class="auth-footer">
          Already have an account? <a href="#/login">Sign in</a>
        </div>
      </div>
    </div>
  `;

  const form       = container.querySelector('#signup-form');
  const fnEl       = container.querySelector('#first-name');
  const lnEl       = container.querySelector('#last-name');
  const emailEl    = container.querySelector('#signup-email');
  const pwEl       = container.querySelector('#signup-password');
  const cpwEl      = container.querySelector('#confirm-password');
  const fnHint     = container.querySelector('#fn-hint');
  const lnHint     = container.querySelector('#ln-hint');
  const emailHint  = container.querySelector('#email-hint');
  const pwHint     = container.querySelector('#pw-hint');
  const cpwHint    = container.querySelector('#cpw-hint');
  const submitBtn  = container.querySelector('#signup-submit');
  const strengthFill = container.querySelector('#strength-fill');
  const strengthLabel = container.querySelector('#strength-label');

  // Real-time password strength
  pwEl.addEventListener('input', () => {
    const { score, label, color } = getPasswordStrength(pwEl.value);
    strengthFill.style.width = `${score}%`;
    strengthFill.style.background = color;
    strengthLabel.textContent = pwEl.value ? label : '';

    if (cpwEl.value) checkPasswords();
  });

  cpwEl.addEventListener('input', checkPasswords);

  function checkPasswords() {
    if (cpwEl.value && pwEl.value !== cpwEl.value) {
      setError(cpwEl, cpwHint, 'Passwords do not match');
    } else if (cpwEl.value) {
      setSuccess(cpwEl, cpwHint, '');
    }
  }

  emailEl.addEventListener('blur', () => {
    const v = emailEl.value.trim();
    if (v && !v.endsWith('@office.uc.ac.kr') && !v.endsWith('@uc.ac.kr')) {
      setError(emailEl, emailHint, 'Use your UC campus email (e.g. name@office.uc.ac.kr)');
    } else if (v) {
      setSuccess(emailEl, emailHint, '');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;

    if (!fnEl.value.trim()) { setError(fnEl, fnHint, 'Required'); valid = false; } else clearError(fnEl, fnHint);
    if (!lnEl.value.trim()) { setError(lnEl, lnHint, 'Required'); valid = false; } else clearError(lnEl, lnHint);

    const email = emailEl.value.trim();
    if (!email.endsWith('@office.uc.ac.kr') && !email.endsWith('@uc.ac.kr')) {
      setError(emailEl, emailHint, 'Use your UC campus email');
      valid = false;
    } else {
      clearError(emailEl, emailHint);
    }

    if (pwEl.value.length < 8) {
      setError(pwEl, pwHint, 'Password must be at least 8 characters');
      valid = false;
    } else {
      clearError(pwEl, pwHint);
    }

    if (pwEl.value !== cpwEl.value) {
      setError(cpwEl, cpwHint, 'Passwords do not match');
      valid = false;
    } else {
      clearError(cpwEl, cpwHint);
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Creating account…';

    try {
      await delay(800);
      authStore.signup({
        firstName: fnEl.value.trim(),
        lastName:  lnEl.value.trim(),
        email:     email,
        password:  pwEl.value,
      });
      showToast(`Welcome to UC Marketplace, ${fnEl.value.trim()}! 🎉`, 'success', 4000);
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
}

// Helpers
function setError(input, hint, msg) {
  input.classList.add('error');
  input.classList.remove('success');
  if (hint) { hint.textContent = msg; hint.className = 'form-hint error'; }
}

function setSuccess(input, hint, msg) {
  input.classList.remove('error');
  input.classList.add('success');
  if (hint) { hint.textContent = msg; hint.className = 'form-hint success'; }
}

function clearError(input, hint) {
  input.classList.remove('error', 'success');
  if (hint) { hint.textContent = ''; hint.className = 'form-hint'; }
}

function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score += 25;
  if (pw.length >= 12) score += 15;
  if (/[A-Z]/.test(pw)) score += 20;
  if (/[0-9]/.test(pw)) score += 20;
  if (/[^A-Za-z0-9]/.test(pw)) score += 20;

  if (score < 30)  return { score, label: 'Weak', color: '#dc3545' };
  if (score < 60)  return { score, label: 'Fair', color: '#ffc107' };
  if (score < 85)  return { score, label: 'Good', color: '#28a745' };
  return { score: 100, label: 'Strong 💪', color: '#155724' };
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
