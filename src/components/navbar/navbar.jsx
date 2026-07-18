import { useLanguage } from '../../i18n/language-context.jsx'

function NavBar() {
  const { direction, t, toggleLanguage } = useLanguage()
  const links = [
    { name: t.nav.home, href: '/#home' },
    { name: t.nav.services, href: '/#services' },
    { name: t.nav.projects, href: '/#projects' },
    { name: t.nav.certificates, href: '/#certificate' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-surface/95 font-tajawal backdrop-blur" dir={direction}>
      <div className="container flex items-center justify-between gap-4 py-4">
        <a href="/#home" className="font-birthstone text-2xl font-bold text-primary" aria-label="A.J home">A.J</a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => <a key={link.href} href={link.href} className="font-medium text-text-heading transition-colors hover:text-primary">{link.name}</a>)}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleLanguage} className="rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white" aria-label={t.nav.switchLanguage}>
            {t.nav.switchLanguage}
          </button>
          <a href="/#contact" className="rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">{t.nav.contact}</a>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
