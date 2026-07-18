import { useState } from 'react'
import { useLanguage } from '../../i18n/language-context.jsx'

const VISITOR_KEY = 'portfolio_visitor_id'
const COUNT_KEY = 'portfolio_visitor_count'

function getVisitorCount() {
  try {
    let count = Number.parseInt(localStorage.getItem(COUNT_KEY) || '0', 10)
    if (!localStorage.getItem(VISITOR_KEY)) {
      localStorage.setItem(VISITOR_KEY, `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`)
      count += 1
      localStorage.setItem(COUNT_KEY, String(count))
    }
    return count
  } catch { return 0 }
}

function VisitorCounter() {
  const [visitorCount] = useState(getVisitorCount)
  const { t } = useLanguage()
  return <div className="flex items-center gap-2 text-sm text-white"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" /><circle cx="12" cy="12" r="3" strokeWidth="2" /></svg><span className="font-medium">{visitorCount.toLocaleString('en-US')}</span><span>{t.footer.visitors}</span></div>
}

export default VisitorCounter
