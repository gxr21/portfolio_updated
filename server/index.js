import express from 'express'
import { Resend } from 'resend'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })

const app = express()
const PORT = process.env.PORT || 5000
const requestLog = new Map()
const resend = new Resend(process.env.RESEND_API_KEY)

app.use(express.json({ limit: '20kb' }))
app.use(express.static(path.join(process.cwd(), 'dist')))
const allowedOrigins = ['https://ali-jalal.com', 'https://www.ali-jalal.com', 'http://localhost:3000','https://portfolio-updated-3vas.onrender.com'];
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
  return callback(new Error('CORS policy: This origin is not allowed.'))
}}));
app.set('trust proxy', true)

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function isRateLimited(ip) {
  const now = Date.now(); const windowMs = 15 * 60 * 1000; const maxRequests = 5
  const requests = (requestLog.get(ip) || []).filter((time) => now - time < windowMs)
  requests.push(now); requestLog.set(ip, requests)
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

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(ip)) return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' })
  if (!validateContact(req.body)) return res.status(400).json({ success: false, error: 'Invalid form data.' })

  try {
    const { name, email, phone, message } = req.body
    const data = await resend.emails.send({
      from: 'Portfolio Contact <contact@ali-jalal.com>',
      to: ['alijalal200311@gmail.com'],
      replyTo: email.trim(),
      subject: `رسالة جديدة من موقع البورتفوليو - ${name.trim().slice(0, 100)}`,
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
    return res.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ success: false, error: 'Unable to send the message.' })
  }
})

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
