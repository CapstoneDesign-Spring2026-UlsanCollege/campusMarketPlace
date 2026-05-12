export const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Sports',
  'Books',
  'Supplies',
  'Services',
  'Other',
]

export const getCategoryLabel = (category) => {
  return category && typeof category === 'string'
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Categories'
}
