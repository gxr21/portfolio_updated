import { useId, useState } from 'react'
import { useLanguage } from '../../i18n/language-context.jsx'

const initialForm = { name: '', email: '', phone: '', message: '' }

function ContactForm() {
  const { direction, t } = useLanguage()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const nameId = useId(); const emailId = useId(); const phoneId = useId(); const messageId = useId()

  const validate = (values) => {
    const next = {}
    if (values.name.trim().length < 2) next.name = values.name.trim() ? t.form.shortName : t.form.required
    if (!values.email.trim()) next.email = t.form.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.form.invalidEmail
    if (!/^\+?[0-9\s-]{7,15}$/.test(values.phone.trim())) next.phone = values.phone.trim() ? t.form.invalidPhone : t.form.required
    if (values.message.trim().length < 10) next.message = values.message.trim() ? t.form.shortMessage : t.form.required
    return next
  }
  const change = (event) => { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: undefined })) }
  const submit = async (event) => {
    event.preventDefault(); const nextErrors = validate(form); if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    setIsSubmitting(true); setStatus(null)
    try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (!response.ok) throw new Error(); setStatus('success'); setForm(initialForm) } catch { setStatus('error') } finally { setIsSubmitting(false) }
  }
  const fields = [
    [nameId, 'name', 'text', t.form.name, t.form.namePlaceholder], [emailId, 'email', 'email', t.form.email, 'email@example.com'], [phoneId, 'phone', 'tel', t.form.phone, '07733184084'], [messageId, 'message', 'text', t.form.message, t.form.messagePlaceholder],
  ]
  return <form onSubmit={submit} noValidate className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-surface-bright p-8" dir={direction}><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{fields.map(([id, name, type, label, placeholder]) => <div key={name} className={name === 'message' ? 'md:col-span-2' : ''}><label htmlFor={id} className="mb-2 block text-sm font-medium text-text-heading">{label}</label>{name === 'message' ? <textarea id={id} name={name} rows="4" value={form[name]} onChange={change} placeholder={placeholder} disabled={isSubmitting} className="w-full rounded-lg border border-gray-300 bg-surface px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" /> : <input id={id} type={type} name={name} value={form[name]} onChange={change} placeholder={placeholder} disabled={isSubmitting} className="w-full rounded-lg border border-gray-300 bg-surface px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />}{errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}</div>)}</div>{status && <p role="alert" className={`mt-4 rounded-lg border p-3 text-sm ${status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{status === 'success' ? t.form.success : t.form.failed}</p>}<button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? t.form.sending : t.form.submit}</button></form>
}

export default ContactForm
