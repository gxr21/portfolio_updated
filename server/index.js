import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '20kb' }))
app.use(express.static(path.join(process.cwd(), 'dist')))
const allowedOrigins = ['https://ali-jalal.com', 'https://www.ali-jalal.com', 'http://localhost:3000','https://portfolio-updated-3vas.onrender.com'];
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
  return callback(new Error('CORS policy: This origin is not allowed.'))
}}));

const requestLog = new Map()

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

async function sendEmailViaBrevoApi({ name, email, phone, message }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('BREVO_API_KEY is missing or empty')
    throw new Error('Missing BREVO_API_KEY in environment variables')
  }
  console.log('Using Brevo API key:', apiKey.slice(0, 8) + '...')

  const htmlContent = `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0145F2">رسالة جديدة من الموقع</h2>
      <p><strong>الاسم:</strong> ${escapeHtml(name)}</p>
      <p><strong>البريد الإلكتروني:</strong> ${escapeHtml(email)}</p>
      <p><strong>الهاتف:</strong> ${escapeHtml(phone)}</p>
      <p><strong>الرسالة:</strong></p>
      <p style="background:#f5f5f5;padding:15px;border-radius:8px;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { name: name, email: process.env.SMTP_FROM || process.env.SMTP_USER },
      to: [{ email: process.env.CONTACT_EMAIL }],
      replyTo: { email: email.trim() },
      subject: `رسالة جديدة من موقع البورتفوليو - ${name.trim().slice(0, 100)}`,
      htmlContent,
      textContent: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Brevo API error ${response.status}: ${errorText}`)
  }
}

app.get('/api/contact', async (req, res) => {
  res.status(405).json({ error: 'Method not allowed' })
})

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(ip)) return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' })
  if (!validateContact(req.body)) return res.status(400).json({ success: false, error: 'Invalid form data.' })

  try {
    const { name, email, phone, message } = req.body
    await sendEmailViaBrevoApi({ name, email, phone, message })
    return res.json({ success: true, message: 'تم إرسال الرسالة بنجاح' })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ success: false, error: 'Unable to send the message.' })
  }
})

app.get('/api/visitors', async (req, res) => {
  try {
    const response = await fetch('https://api.counterapi.dev/v1/ali-jalal-portfolio/visitors')
    if (!response.ok) throw new Error('Counter service unavailable')
    const data = await response.json()
    const count = Number(data.count ?? data.data ?? data.value)
    if (!Number.isFinite(count)) throw new Error('Invalid count')
    return res.json({ count })
  } catch (error) {
    console.error('Error reading visitor count:', error)
    return res.status(503).json({ error: 'Visitor counter is temporarily unavailable.' })
  }
})

app.post('/api/visitors', async (req, res) => {
  try {
    const response = await fetch('https://api.counterapi.dev/v1/ali-jalal-portfolio/visitors/up', { method: 'POST' })
    if (!response.ok) throw new Error('Counter service unavailable')
    const data = await response.json()
    const count = Number(data.count ?? data.data ?? data.value)
    if (!Number.isFinite(count)) throw new Error('Invalid count')
    return res.json({ count })
  } catch (error) {
    console.error('Error updating visitor count:', error)
    return res.status(503).json({ error: 'Visitor counter is temporarily unavailable.' })
  }
})

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
