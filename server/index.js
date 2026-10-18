import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import multer from 'multer'
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'
import { fileURLToPath } from 'url'
import cors from 'cors'
// إعداد ملف .env قبل أي شيء
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })
const app = express()
const PORT = process.env.PORT || 5000
const requestLog = new Map()
async function createArcjetClient() {
  if (!process.env.ARCJET_KEY || process.env.ARCJET_KEY === 'your-arcjet-site-key') return null

  // On Windows, @arcjet/analyze-wasm can fail to resolve its "_." folder, so a load failure must not stop the server.
  try {
    const { default: arcjet, detectBot, shield, slidingWindow, validateEmail } = await import('@arcjet/node')
    return arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({ mode: 'LIVE', allow: [] }),
        validateEmail({ mode: 'LIVE', deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'] }),
        slidingWindow({ mode: 'LIVE', interval: '10m', max: 5 }),
      ],
    })
  } catch (error) {
    console.error('Arcjet could not be loaded:', error.code || error.message)
    return null
  }
}

const arcjetClient = await createArcjetClient()

const resend = new Resend(process.env.RESEND_API_KEY)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null

app.use(express.json({ limit: '20kb' }))
app.use(express.static(path.join(process.cwd(), 'dist')))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), { index: false, dotfiles: 'deny' }))

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://portfolio-r8qp.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // تمكين الطلبات بدون Origin (مثل Postman أو طلبات السيرفر الداخلية) بالإضافة للمواقع المسموحة
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('CORS policy: This origin is not allowed.'))
  }
}));

app.set('trust proxy', true)

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function isRateLimited(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 دقيقة
  const maxRequests = 5

  const requests = (requestLog.get(ip) || []).filter((time) => now - time < windowMs)
  requests.push(now)
  requestLog.set(ip, requests)
  return requests.length > maxRequests
}

function validateContact({ name, email, phone, message }) {
  if (![name, email, phone, message].every((value) => typeof value === 'string')) return false
  if (name.trim().length < 2 || name.length > 100 || message.trim().length < 10 || message.length > 3000) return false
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return false
  return /^\+?[0-9\s-]{7,15}$/.test(phone.trim())
}

async function getVisitorCount(increment = false) {
  if (!redis) throw new Error('Upstash Redis configuration is missing.')

  if (increment) return redis.incr('portfolio:visitor-count')

  const count = await redis.get('portfolio:visitor-count')
  return Number(count || 0)
}

const PROJECT_IDS = Array.from({ length: 13 }, (_, index) => index + 1)

function projectRatingKeys(projectId) {
  return {
    total: `portfolio:project:${projectId}:rating-total`,
    count: `portfolio:project:${projectId}:rating-count`,
  }
}

async function getProjectRatings() {
  if (!redis) throw new Error('Upstash Redis configuration is missing.')

  const keys = PROJECT_IDS.flatMap((projectId) => {
    const { total, count } = projectRatingKeys(projectId)
    return [total, count]
  })
  const values = await redis.mget(...keys)

  return Object.fromEntries(PROJECT_IDS.map((projectId, index) => {
    const total = Number(values[index * 2] || 0)
    const count = Number(values[index * 2 + 1] || 0)
    return [projectId, { count, average: count ? Number((total / count).toFixed(1)) : 0 }]
  }))
}

app.get('/api/visitors', async (req, res) => {
  try {
    return res.json({ count: await getVisitorCount() })
  } catch (error) {
    console.error('Error reading visitor count:', error)
    return res.status(503).json({ error: 'Visitor counter is temporarily unavailable.' })
  }
})

app.post('/api/visitors', async (req, res) => {
  try {
    return res.json({ count: await getVisitorCount(true) })
  } catch (error) {
    console.error('Error updating visitor count:', error)
    return res.status(503).json({ error: 'Visitor counter is temporarily unavailable.' })
  }
})

app.get('/api/projects/ratings', async (req, res) => {
  try {
    return res.json({ ratings: await getProjectRatings() })
  } catch (error) {
    console.error('Error reading project ratings:', error)
    return res.status(503).json({ error: 'Project ratings are temporarily unavailable.' })
  }
})

app.post('/api/projects/:projectId/ratings', async (req, res) => {
  const projectId = Number(req.params.projectId)
  const rating = Number(req.body?.rating)

  if (!PROJECT_IDS.includes(projectId) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid project rating.' })
  }

  try {
    if (!redis) throw new Error('Upstash Redis configuration is missing.')

    const { total, count } = projectRatingKeys(projectId)
    const [updatedTotal, updatedCount] = await Promise.all([
      redis.incrby(total, rating),
      redis.incr(count),
    ])
    return res.status(201).json({
      projectId,
      count: Number(updatedCount),
      average: Number((Number(updatedTotal) / Number(updatedCount)).toFixed(1)),
    })
  } catch (error) {
    console.error('Error saving project rating:', error)
    return res.status(503).json({ error: 'Project ratings are temporarily unavailable.' })
  }
})

// --- مسار إرسال البريد عبر nodemailer ---
app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (!validateContact(req.body)) return res.status(400).json({ success: false, error: 'Invalid form data.' })

  if (arcjetClient) {
    try {
      const decision = await arcjetClient.protect(req, { email: req.body.email })
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' })
        if (decision.reason.isEmail()) return res.status(400).json({ success: false, error: 'Please use a valid email address.' })
        return res.status(403).json({ success: false, error: 'This request was blocked for security reasons.' })
      }
    } catch (error) {
      console.error('Arcjet protection error:', error)
    }
  } else if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' })
  }

  try {
    const { name, email, phone, message } = req.body

    const formattedMessage = `
--- رسالة جديدة من موقعك ---
الاسم: ${name.trim()}
البريد: ${email.trim()}
الهاتف: ${phone.trim()}

نص الرسالة:
${message.trim()}
---------------------------
    `.trim()
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM || !process.env.CONTACT_EMAIL) {
      throw new Error('Resend configuration is missing. Set RESEND_API_KEY, RESEND_FROM, and CONTACT_EMAIL.')
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [process.env.CONTACT_EMAIL],
      replyTo: email.trim(),
      subject: `رسالة جديدة من موقع البورتفوليو - ${name.trim().slice(0, 100)}`,
      text: formattedMessage,
      html: `
      <div dir="rtl" 
      style="font-family:Arial,sans-serif;
      max-width:600px;margin:0 auto">
      <h2 style="color:#0145F2">رسالة جديدة من الموقع</h2><p><strong>الاسم:</strong> 
      ${escapeHtml(name)}</p><p><strong>البريد الإلكتروني:</strong> 
      ${escapeHtml(email)}</p><p><strong>الهاتف:</strong> 
      ${escapeHtml(phone)}</p>
      <p><strong>الرسالة:</strong>
      </p>
      <p style="background:#f5f5f5;
      padding:15px;border-radius:8px;
      white-space:pre-wrap">${escapeHtml(message)}</p></div>`,
    })
    if (error) throw new Error(error.message)
    return res.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ success: false, error: 'Unable to send the message.' })
  }
})

const COURSE_IDS = ['cpp', 'javascript', 'python']
const uploadsRoot = path.join(process.cwd(), 'public', 'course-lessons')
const videoUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const directory = path.join(uploadsRoot, req.params.courseId)
      fs.mkdirSync(directory, { recursive: true })
      cb(null, directory)
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(file.originalname).toLowerCase()}`)
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase()
    const allowedExtension = ['.mp4', '.webm', '.mov'].includes(extension)
    const allowedType = ['video/mp4', 'video/webm', 'video/quicktime', 'application/octet-stream', ''].includes(file.mimetype)
    if (!allowedExtension || !allowedType) {
      cb(new Error('invalid-video'))
      return
    }
    cb(null, true)
  },
})

function lessonsFile(courseId) {
  return path.join(uploadsRoot, courseId, 'lessons.json')
}

function readLessons(courseId) {
  const publishedFile = path.join(process.cwd(), 'dist', 'course-lessons', courseId, 'lessons.json')
  const sourceFile = lessonsFile(courseId)
  const file = process.env.NODE_ENV === 'production' && fs.existsSync(publishedFile) ? publishedFile : sourceFile
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return []
  }
}

function writeLessons(courseId, lessons) {
  const file = lessonsFile(courseId)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(lessons, null, 2))
}

function isUploadAuthorized(req) {
  const expected = process.env.COURSE_UPLOAD_KEY
  const provided = req.get('x-upload-key') || ''
  if (!expected || !provided) return false
  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)
  if (expectedBuffer.length !== providedBuffer.length) return false
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

app.get('/api/courses/:courseId/lessons', (req, res) => {
  if (!COURSE_IDS.includes(req.params.courseId)) return res.status(404).json({ error: 'unknown-course' })
  return res.json({ lessons: readLessons(req.params.courseId) })
})

app.post('/api/courses/:courseId/lessons', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'upload-unavailable' })
  if (!COURSE_IDS.includes(req.params.courseId)) return res.status(404).json({ error: 'unknown-course' })
  if (!process.env.COURSE_UPLOAD_KEY) return res.status(503).json({ error: 'upload-unavailable' })
  if (!isUploadAuthorized(req)) return res.status(401).json({ error: 'unauthorized' })

  videoUpload.single('video')(req, res, (error) => {
    if (error) {
      const code = error.code === 'LIMIT_FILE_SIZE' ? 'file-too-large' : error.message === 'invalid-video' ? 'invalid-video' : 'upload-failed'
      return res.status(400).json({ error: code })
    }
    if (!req.file) return res.status(400).json({ error: 'invalid-video' })

    const title = path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/[^\p{L}\p{N}\s._-]/gu, '').trim().slice(0, 120) || 'مقطع'
    const lesson = {
      id: crypto.randomBytes(8).toString('hex'),
      title,
      url: `/course-lessons/${req.params.courseId}/${req.file.filename}`,
      uploadedAt: new Date().toISOString(),
    }

    try {
      writeLessons(req.params.courseId, [...readLessons(req.params.courseId), lesson])
      return res.status(201).json({ lesson })
    } catch (writeError) {
      fs.unlink(req.file.path, () => {})
      console.error('Error saving course lesson:', writeError)
      return res.status(500).json({ error: 'upload-failed' })
    }
  })
})

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')))
console.log(arcjetClient ? 'Arcjet protection is enabled.' : 'Arcjet protection is disabled. Using basic rate limiting.')
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
