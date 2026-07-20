import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/language-context.jsx'

const VISIT_RECORDED_KEY = 'portfolio-visitor-recorded'

function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    let isMounted = true
    const recordVisit = !localStorage.getItem(VISIT_RECORDED_KEY)
    const loadCount = async () => {
      try {
        const baseUrl = 'https://api.counterapi.dev/v1/ali-jalal-portfolio/visitors'
        const response = await fetch(recordVisit ? `${baseUrl}/up` : baseUrl, { method: recordVisit ? 'POST' : 'GET' })
        if (!response.ok) throw new Error('Unable to load visitor count')
        const { count } = await response.json()
        if (recordVisit) localStorage.setItem(VISIT_RECORDED_KEY, 'true')
        if (isMounted) setVisitorCount(count)
      } catch {
        if (isMounted) setVisitorCount(null)
      }
    }
    void loadCount()
    return () => { isMounted = false }
  }, [])

  return <div className="flex items-center gap-2 text-sm text-white"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" /><circle cx="12" cy="12" r="3" strokeWidth="2" /></svg><span className="font-medium">{visitorCount === null ? '—' : visitorCount.toLocaleString('en-US')}</span><span>{t.footer.visitors}</span></div>
}

export default VisitorCounter
