import { useEffect, useState } from 'react'
import LandingPage from './landing/landing.jsx'
import Projects from './gallaryproject/projects.jsx'
import Services from './services/services.jsx'
import Maintenance from './maintenance/maintenance.jsx'
import LoadingScreen from './components/loading-screen/loading-screen.jsx'
import { useLanguage } from './i18n/language-context.jsx'

const isMaintenanceMode = false;
function App() {
  const { t } = useLanguage()
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, '') || '/')
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const [nextPage, setNextPage] = useState('')

  useEffect(() => { const timer = window.setTimeout(() => setIsWelcomeVisible(false), 1500); return () => window.clearTimeout(timer) }, [])

  useEffect(() => {
    const pageNames = { '/': t.nav.home, '/projects': t.projects.title, '/services': t.services.title }
    const handleNavigation = (event) => {
      const link = event.target.closest('a')
      if (!link || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const targetUrl = new URL(link.href, window.location.origin)
      const targetPath = targetUrl.pathname.replace(/\/$/, '') || '/'
      if (targetUrl.origin !== window.location.origin || targetUrl.hash || !pageNames[targetPath] || targetPath === path) return
      event.preventDefault(); setNextPage(pageNames[targetPath]); setIsNavigating(true)
      window.setTimeout(() => { window.history.pushState({}, '', targetUrl.pathname); setPath(targetPath); setIsNavigating(false) }, 550)
    }
    const handlePopState = () => setPath(window.location.pathname.replace(/\/$/, '') || '/')
    document.addEventListener('click', handleNavigation); window.addEventListener('popstate', handlePopState)
    return () => { document.removeEventListener('click', handleNavigation); window.removeEventListener('popstate', handlePopState) }
  }, [path, t])

  let content = <LandingPage />

  if (isMaintenanceMode) return <Maintenance />
  if (isWelcomeVisible) return <LoadingScreen mode="welcome" />
  if (isNavigating) return <LoadingScreen pageName={nextPage} />
  if (path === '/projects') {
    content = <Projects />
  } else if (path === '/services') {
    content = <Services />
  }

  return content
}

export default App
