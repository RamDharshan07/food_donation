const fs = require('fs')
const path = require('path')
const multer = require('multer')

function ensureUploadsDir() {
  const dir = path.join(__dirname, '..', '..', 'uploads')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, ensureUploadsDir())
  },
  filename: function (_req, file, cb) {
    const safe = String(file.originalname || 'image').replace(/[^a-zA-Z0-9._-]/g, '_')
    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}_${safe}`
    cb(null, unique)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

module.exports = { upload }

