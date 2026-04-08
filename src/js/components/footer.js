export function renderFooter(container) {
  container.innerHTML = `
    <div class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">🏪 UC Marketplace</div>
            <p>The trusted campus marketplace for Ulsan College students. Buy, sell, and trade within our campus community safely and easily.</p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Instagram">📸</a>
              <a href="#" class="social-link" aria-label="KakaoTalk">💬</a>
              <a href="#" class="social-link" aria-label="Naver Band">🎵</a>
            </div>
          </div>

          <div class="footer-col">
            <h4>Marketplace</h4>
            <ul>
              <li><a href="#/products">Browse All</a></li>
              <li><a href="#/products?category=books">Textbooks</a></li>
              <li><a href="#/products?category=electronics">Electronics</a></li>
              <li><a href="#/products?category=clothing">Clothing</a></li>
              <li><a href="#/products?category=furniture">Furniture</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Account</h4>
            <ul>
              <li><a href="#/login">Login</a></li>
              <li><a href="#/signup">Sign Up</a></li>
              <li><a href="#/dashboard">My Dashboard</a></li>
              <li><a href="#/sell">Post a Listing</a></li>
              <li><a href="#/cart">My Cart</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Safety Tips</a></li>
              <li><a href="#">Community Rules</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© 2026 UC Marketplace · Ulsan College · All rights reserved</span>
          <span>Made with ❤️ by UC Students</span>
        </div>
      </div>
    </div>
  `;
}
