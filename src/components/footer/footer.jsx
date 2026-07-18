import VisitorCounter from '../visitor-counter/visitor-counter.jsx'
import { useLanguage } from '../../i18n/language-context.jsx'

const GitHubIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.56.1.77-.24.77-.54v-2.16c-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.51-.29-5.15-1.26-5.15-5.59 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.66 0C17.04 4.77 18 5.07 18 5.07c.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.34-2.65 5.29-5.17 5.57.41.35.77 1.02.77 2.05v3.04c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z" /></svg>
const LinkedInIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 3H3.55A.55.55 0 0 0 3 3.55v16.9c0 .3.25.55.55.55h16.9c.3 0 .55-.25.55-.55V3.55A.55.55 0 0 0 20.45 3ZM8.34 18.34H5.66v-8.6h2.68v8.6ZM7 8.55a1.56 1.56 0 1 1 0-3.11A1.56 1.56 0 0 1 7 8.55Zm11.35 9.79h-2.67v-4.18c0-1 0-2.29-1.4-2.29-1.4 0-1.61 1.09-1.61 2.22v4.25H10v-8.6h2.57v1.18h.04c.36-.68 1.23-1.4 2.54-1.4 2.72 0 3.22 1.79 3.22 4.12v4.7Z" /></svg>
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.08c0-.87.24-1.46 1.5-1.46h1.6V3.94c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4.02V10H7.78v3h2.62v8h3.1Z" /></svg>
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>

const socialLinks = [
  ['GitHub', 'https://github.com/gxr21', GitHubIcon]
, ['LinkedIn', 'https://www.linkedin.com/in/ali-jalal-336544310', LinkedInIcon],
  ['Facebook', 'https://www.facebook.com/share/18rbNSLu4q/', FacebookIcon], 
  ['Instagram', 'https://www.instagram.com/_ipx2_?igsh=aTJqcGR3cmZ0MXU5', InstagramIcon],
]

function Footer() {
  const { direction, t } = useLanguage()
  const links = [[t.nav.home, '/#home'], [t.nav.contact, '/#contact'], [t.nav.projects, '/projects'], [t.nav.services, '/services'], [t.nav.certificates, '/#certificate']]
  return <footer className="rounded-t-4xl bg-[#1e1e1f] py-8 text-center text-white" dir={direction}>
    <div className="container mx-auto px-4">
     <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <a href="/#home" className="font-birthstone text-2xl font-bold text-primary">A.J</a>
        <nav className="flex flex-wrap justify-center gap-4">{links.map(([name, href]) => <a key={href} href={href} className="transition-colors hover:text-primary">{name}</a>)}
        </nav>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-700 pt-6 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
             <p className="text-sm">
                © {new Date().getFullYear()} {t.landing.name} — {t.footer.rights}
            </p>
                <VisitorCounter />
            </div>
  <div className="flex items-center gap-3">
    <span className="text-sm">{t.footer.follow}
    </span>
    {socialLinks.map(([name, href, Icon]) =>
     <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name} title={name} className="text-white transition-colors hover:text-primary [&>svg]:size-6">
        <Icon />
        </a>
        )}
        </div>
     </div>
    </div>
</footer>
}

export default Footer
