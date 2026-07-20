import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// إعداد ملف .env قبل أي شيء
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })

const app = express()
const PORT = process.env.PORT || 5000
const requestLog = new Map()

app.use(express.json({ limit: '20kb' }))
app.use(express.static(path.join(process.cwd(), 'dist')))

const allowedOrigins = [
  'https://ali-jalal.com',
  'https://www.ali-jalal.com',
  'http://localhost:3000',
  'https://portfolio-updated-3vas.onrender.com'
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
  const response = await fetch(`https://api.counterapi.dev/v1/ali-jalal-portfolio/visitors${increment ? '/up' : ''}`)
  if (!response.ok) throw new Error(`Counter service returned ${response.status}`)
  const data = await response.json()
  const count = Number(data.count ?? data.data ?? data.value)
  if (!Number.isFinite(count)) throw new Error('Counter service returned an invalid count')
  return count
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

// --- مسار إرسال البريد المعدل والمضمون ---
app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(ip)) return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' })
  if (!validateContact(req.body)) return res.status(400).json({ success: false, error: 'Invalid form data.' })

  // التحقق من وجود مفتاح Web3Forms في البيئة
   if (!process.env.WEB3FORMS_KEY) {
    console.error('WEB3FORMS_KEY is missing in .env file')
    return res.status(500).json({ success: false, error: 'Server configuration error.' })
  }

  try {
    const { name, email, phone, message } = req.body

    // تجهيز قالب رسالة أسهل للقراءة وجميل ومنسق لبريدك
    const formattedMessage = `
--- رسالة جديدة من موقعك ---
الاسم: ${name.trim()}
البريد: ${email.trim()}
الهاتف: ${phone.trim()}

نص الرسالة:
${message.trim()}
---------------------------
    `.trim()

    // إرسال البيانات عبر الـ API الآمن لـ Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: `رسالة بورتفوليو جديدة من: ${name.trim().slice(0, 30)}`,
        from_name: 'Portfolio Contact Form',
        name: name.trim(),
        email: email.trim(), // سيتيح لك هذا الرد مباشرة على الإيميل (Reply-To) من بريدك
        phone: phone.trim(),
        message: formattedMessage
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('Web3Forms API error response:', response.status, text)
      throw new Error(`Web3Forms API returned status ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Web3Forms API failed to send email')
    }

    return res.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ success: false, error: 'Unable to send the message.' })
  }
})

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))