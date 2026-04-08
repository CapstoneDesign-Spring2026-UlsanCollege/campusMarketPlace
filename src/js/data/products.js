/**
 * Mock product data for UC Marketplace
 */

export const CATEGORIES = [
  { id: 'all',        label: 'All',         icon: '🏪' },
  { id: 'books',      label: 'Textbooks',   icon: '📚' },
  { id: 'electronics',label: 'Electronics', icon: '💻' },
  { id: 'clothing',   label: 'Clothing',    icon: '👕' },
  { id: 'furniture',  label: 'Furniture',   icon: '🪑' },
  { id: 'supplies',   label: 'Supplies',    icon: '🖊️' },
  { id: 'food',       label: 'Food & Drink',icon: '🍜' },
  { id: 'sports',     label: 'Sports',      icon: '⚽' },
  { id: 'misc',       label: 'Misc',        icon: '📦' },
];

export const CONDITIONS = [
  { id: 'new',       label: 'Brand New' },
  { id: 'like-new',  label: 'Like New' },
  { id: 'good',      label: 'Good' },
  { id: 'fair',      label: 'Fair' },
];

export const products = [
  {
    id: 1,
    title: 'Introduction to Computer Science – Textbook',
    category: 'books',
    price: 18000,
    originalPrice: 35000,
    condition: 'good',
    description: 'Used for one semester. Highlights and notes inside but fully readable. Perfect for CS101 students. Original price was ₩35,000 at the campus bookstore.',
    seller: { name: 'Kim Jiyeon', avatar: 'KJ', rating: 4.8, reviews: 24 },
    emoji: '📚',
    views: 142,
    listed: '2026-03-28',
    featured: true,
  },
  {
    id: 2,
    title: 'Samsung Galaxy Tab S6 Lite – 10.4"',
    category: 'electronics',
    price: 185000,
    originalPrice: 290000,
    condition: 'like-new',
    description: 'Barely used Galaxy Tab S6 Lite with S-Pen. Comes with original charger and protective case. Great for taking notes in class.',
    seller: { name: 'Park Sungmin', avatar: 'PS', rating: 4.9, reviews: 31 },
    emoji: '📱',
    views: 388,
    listed: '2026-04-01',
    featured: true,
  },
  {
    id: 3,
    title: 'University Hoodie – UC Blue (Size M)',
    category: 'clothing',
    price: 22000,
    originalPrice: 42000,
    condition: 'good',
    description: 'Official UC Ulsan College hoodie in university blue. Size Medium. Worn a handful of times, no stains or damage.',
    seller: { name: 'Lee Minji', avatar: 'LM', rating: 4.5, reviews: 9 },
    emoji: '👕',
    views: 76,
    listed: '2026-04-03',
    featured: false,
  },
  {
    id: 4,
    title: 'IKEA LINNMON Desk + ADILS Legs',
    category: 'furniture',
    price: 45000,
    originalPrice: 75000,
    condition: 'good',
    description: 'White desk with two legs. Perfect for a dorm room. Disassembled and ready for pickup. Minor scratch on one corner.',
    seller: { name: 'Choi Donghyun', avatar: 'CD', rating: 4.7, reviews: 15 },
    emoji: '🪑',
    views: 203,
    listed: '2026-03-30',
    featured: false,
  },
  {
    id: 5,
    title: 'Scientific Calculator – CASIO FX-991ES',
    category: 'supplies',
    price: 12000,
    originalPrice: 22000,
    condition: 'like-new',
    description: 'CASIO FX-991ES Plus scientific calculator. Used one semester. All keys work perfectly. Comes with original case.',
    seller: { name: 'Yoon Sooyeon', avatar: 'YS', rating: 4.6, reviews: 7 },
    emoji: '🖩',
    views: 95,
    listed: '2026-04-05',
    featured: true,
  },
  {
    id: 6,
    title: 'Organic Chemistry Textbook (5th Ed.)',
    category: 'books',
    price: 25000,
    originalPrice: 58000,
    condition: 'fair',
    description: 'Organic Chemistry 5th Edition. Used for two semesters. Many highlights and annotations throughout, but all content is legible. Covers slightly worn.',
    seller: { name: 'Han Seojun', avatar: 'HS', rating: 4.3, reviews: 11 },
    emoji: '📖',
    views: 119,
    listed: '2026-03-25',
    featured: false,
  },
  {
    id: 7,
    title: 'Logitech MX Keys Mini Keyboard',
    category: 'electronics',
    price: 68000,
    originalPrice: 115000,
    condition: 'like-new',
    description: 'Logitech MX Keys Mini compact wireless keyboard. Used for 3 months. Excellent condition, all keys fully functional. Batteries included.',
    seller: { name: 'Jung Haewon', avatar: 'JH', rating: 5.0, reviews: 18 },
    emoji: '⌨️',
    views: 271,
    listed: '2026-04-02',
    featured: true,
  },
  {
    id: 8,
    title: 'Instant Ramen Variety Pack (×20)',
    category: 'food',
    price: 8500,
    originalPrice: null,
    condition: 'new',
    description: 'Assorted pack of 20 instant ramen cups – various flavors. All within expiry date. Great for dorm life.',
    seller: { name: 'Oh Hyunbin', avatar: 'OH', rating: 4.4, reviews: 6 },
    emoji: '🍜',
    views: 58,
    listed: '2026-04-06',
    featured: false,
  },
  {
    id: 9,
    title: 'Nike Air Max 270 – Size 260mm',
    category: 'clothing',
    price: 55000,
    originalPrice: 130000,
    condition: 'good',
    description: 'Nike Air Max 270 in white/black. Size 260mm (US 8). Worn about 10 times. Minor scuffs on sole, uppers are clean.',
    seller: { name: 'Kwon Minjae', avatar: 'KM', rating: 4.7, reviews: 20 },
    emoji: '👟',
    views: 334,
    listed: '2026-03-29',
    featured: true,
  },
  {
    id: 10,
    title: 'Yoga Mat with Carrying Strap',
    category: 'sports',
    price: 9500,
    originalPrice: 18000,
    condition: 'good',
    description: '6mm thick non-slip yoga mat in teal. Includes carrying strap. Cleaned and ready to go. Perfect for the campus gym.',
    seller: { name: 'Shin Yeri', avatar: 'SY', rating: 4.6, reviews: 8 },
    emoji: '🧘',
    views: 87,
    listed: '2026-04-04',
    featured: false,
  },
  {
    id: 11,
    title: 'Engineering Drawing Set',
    category: 'supplies',
    price: 15000,
    originalPrice: 32000,
    condition: 'good',
    description: 'Full engineering drawing kit – compass, rulers, set squares, protractor. All pieces included. Used one year.',
    seller: { name: 'Baek Jinhyuk', avatar: 'BJ', rating: 4.5, reviews: 5 },
    emoji: '📐',
    views: 61,
    listed: '2026-04-01',
    featured: false,
  },
  {
    id: 12,
    title: 'Mini Fridge – 43L (Perfect for Dorms)',
    category: 'furniture',
    price: 72000,
    originalPrice: 130000,
    condition: 'good',
    description: '43L mini refrigerator, compact and energy-efficient. Works perfectly. Moving out of dorm, must sell. Buyer collects.',
    seller: { name: 'Im Nayoung', avatar: 'IN', rating: 4.9, reviews: 27 },
    emoji: '🧊',
    views: 498,
    listed: '2026-03-27',
    featured: true,
  },
  {
    id: 13,
    title: 'Wireless Earbuds – Sony WF-C500',
    category: 'electronics',
    price: 42000,
    originalPrice: 79000,
    condition: 'like-new',
    description: 'Sony WF-C500 true wireless earbuds. Only used for 2 months. Good battery life, great sound. Comes with original charging case and box.',
    seller: { name: 'Cha Eunwoo', avatar: 'CE', rating: 4.8, reviews: 14 },
    emoji: '🎧',
    views: 256,
    listed: '2026-04-03',
    featured: false,
  },
  {
    id: 14,
    title: 'Calculus: Early Transcendentals (8th Ed.)',
    category: 'books',
    price: 20000,
    originalPrice: 48000,
    condition: 'good',
    description: 'James Stewart Calculus: Early Transcendentals, 8th Edition. Some pencil marks, pages intact. Great for Math and Engineering students.',
    seller: { name: 'Song Mirae', avatar: 'SM', rating: 4.4, reviews: 10 },
    emoji: '📕',
    views: 131,
    listed: '2026-03-31',
    featured: false,
  },
  {
    id: 15,
    title: 'A4 Printer Paper (500 sheets)',
    category: 'supplies',
    price: 4500,
    originalPrice: null,
    condition: 'new',
    description: 'Unopened ream of 80g/m² A4 printer paper. Brand new. Great for assignments and printing. Too many packs, selling one.',
    seller: { name: 'Jang Wooyoung', avatar: 'JW', rating: 4.2, reviews: 4 },
    emoji: '📄',
    views: 44,
    listed: '2026-04-07',
    featured: false,
  },
];

export function getProductById(id) {
  return products.find(p => p.id === Number(id)) || null;
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

export function searchProducts(query, category = 'all', sortBy = 'default') {
  let result = category === 'all' ? [...products] : products.filter(p => p.category === category);

  if (query && query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  switch (sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.listed) - new Date(a.listed));
      break;
    default:
      break;
  }

  return result;
}

export function formatPrice(price) {
  return '₩' + price.toLocaleString('ko-KR');
}
