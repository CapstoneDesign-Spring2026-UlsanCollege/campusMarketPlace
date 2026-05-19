export const CATEGORIES = [
  'Books',
  'Furniture',
  'Tools',
  'Notes',
  'Clothing',
  'Dorm Deals',
  'Electronics',
  'Supplies',
  'Other',
]

export const getCategoryLabel = (category) => {
  return category && typeof category === 'string'
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Categories'
}
