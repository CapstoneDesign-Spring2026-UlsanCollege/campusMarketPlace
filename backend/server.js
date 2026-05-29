const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())

// Sample data
const ITEMS = [
  {
    _id: '6a1641f0a6e0e26eb6bddc96',
    title: 'Canon DSLR with 18-55mm Lens',
    price: 249.99,
    category: 'Electronics',
    condition: 'Good',
    location: 'Campus Library',
    createdAt: new Date().toISOString(),
    description: 'Well-maintained DSLR camera. Includes charger, strap, and 32GB SD card. Perfect for photography students.',
    images: ['/uploads/demo-camera-1.jpg', '/uploads/demo-camera-2.jpg', '/uploads/demo-camera-3.jpg'],
    sellerName: 'Demo Seller',
    seller_verified: true,
  },
]

app.get('/api/items', (req, res) => {
  const limit = parseInt(req.query.limit) || ITEMS.length
  const skip = parseInt(req.query.skip) || 0
  const items = ITEMS.slice(skip, skip + limit)
  res.json({ items })
})

app.get('/api/items/:id', (req, res) => {
  const id = req.params.id
  const item = ITEMS.find((i) => String(i._id) === String(id))
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json({ item })
})

// Dynamic placeholder SVG for uploads endpoint so demo images load without binary files
app.get('/uploads/:name', (req, res) => {
  const { name } = req.params
  const text = name.replace(/\.[^.]+$/, '')
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>` +
    `<defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#d9ecef'/><stop offset='1' stop-color='#e6f4f0'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<g transform='translate(60,60)'><rect x='0' y='0' width='1080' height='680' rx='20' fill='rgba(255,255,255,0.9)' stroke='rgba(0,0,0,0.04)'/></g>` +
    `<text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, sans-serif' font-size='48' fill='#06424d' font-weight='700'>${escapeXml(text)}</text>` +
    `</svg>`
  res.set('Content-Type', 'image/svg+xml')
  res.send(svg)
})

function escapeXml(unsafe) {
  return String(unsafe).replace(/[&<>\"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]
  })
}

app.listen(port, () => {
  console.log(`Backend demo server listening at http://localhost:${port}`)
})
