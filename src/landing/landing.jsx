import NavBar from '../components/navbar/navbar.jsx'
import Skills from '../components/skills/skill.jsx'
import Footer from '../components/footer/footer.jsx'
import ContactForm from '../components/contact/contact.jsx'
import { useLanguage } from '../i18n/language-context.jsx'

const certificates = [
  ['/certifcate_micosoft.jpg', 'Microsoft AI Skills Fest 2026 – Verified Digital Badge (Credly)'],
  ['/certificate4.jpg', 'HSE (Health, Safety & Environment) Certificate – Jisr Al-Amal Organization'],
  ['/certificate3.jpg', 'Telecommunications Certificate – Asiacell, August 2025'],
  ['/certificate2.jpg', 'Artificial Intelligence Marathon – Southern Technical University'],
]

function LandingPage() {
  const { direction, t } = useLanguage()
  return <><NavBar /><main className="min-h-screen bg-surface" dir={direction}>
    <section id="home" className="container mx-auto flex flex-col items-center justify-between px-4 py-20 scroll-mt-20 md:flex-row">
      <div className="max-w-2xl"><h1 className="mb-4 text-6xl font-bold text-black">{t.landing.name}</h1><h2 className="text-2xl font-bold text-black">{t.landing.role}</h2><p className="mt-4 text-lg leading-8 text-gray-600">{t.landing.intro}</p><a href="/uplod/ALCV44.pdf" download="Ali-Jalal-CV.pdf" className="mt-6 inline-flex h-12 w-44 items-center justify-center rounded-md border border-primary text-primary transition-colors hover:bg-primary hover:text-white">{t.landing.downloadCv}</a></div>
      <img src="/profilecv.jpeg" alt={t.landing.name} className="mt-10 h-72 w-72 rounded-full object-cover shadow-lg md:mt-0" />
    </section>
    <Skills />
    <section id="services" className="container mx-auto px-4 py-20 scroll-mt-20"><h2 className="mb-8 text-3xl font-bold text-black">{t.landing.servicesTitle}</h2><div className="grid grid-cols-1 gap-8 md:grid-cols-3">{t.landing.serviceCards.map((service) => <article key={service.title} className="rounded-lg border bg-white p-6 shadow transition-shadow hover:shadow-lg"><h3 className="mb-4 text-xl font-bold">{service.title}</h3><p className="text-gray-600">{service.description}</p><a href="/services" className="mt-4 inline-block text-primary hover:underline">{t.common.learnMore}</a></article>)}</div></section>
    <section id="projects" className="container mx-auto px-4 py-20 scroll-mt-20"><h2 className="mb-8 text-3xl font-bold text-black">{t.landing.projectsTitle}</h2><div className="overflow-hidden rounded-[2.25rem] bg-[#1e1e1f] px-6 py-8 text-zinc-300 md:px-16 md:py-16"><div className="grid grid-cols-1 md:grid-cols-2">{t.landing.featuredProjects.map((project, index) => <article key={project.title} className={`px-4 py-8 ${index === 0 ? 'border-b border-zinc-700/80 md:border-b-0 md:border-e md:px-12 md:py-0' : index === 1 ? 'border-b border-zinc-700/80 md:border-b-0 md:px-12 md:py-0' : 'md:col-span-2 md:mx-12 md:mt-4 md:border-t md:border-zinc-700/80 md:pt-12'}`}><h3 className="mb-4 text-sm font-bold text-primary">{project.title}</h3><p className="mx-auto max-w-md leading-7">{project.description}</p><a href="/projects" className="mt-6 inline-flex text-sm text-primary transition hover:text-blue-300">{t.common.learnMore} <span className="px-2" aria-hidden="true">←</span></a></article>)}</div></div></section>
    <section id="certificate" className="container mx-auto px-4 py-20 scroll-mt-20"><h2 className="mb-8 text-3xl font-bold text-black">{t.landing.certificatesTitle}</h2><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{certificates.map(([image, title]) => <article key={title} className="flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 p-6 text-center shadow transition-shadow hover:shadow-lg"><img src={image} alt={title} className="h-32 w-32 object-contain" /><h3>{title}</h3></article>)}</div></section>
    <section id="contact" className="container mx-auto grid grid-cols-1 gap-10 px-4 py-20 scroll-mt-20 lg:grid-cols-2"><div><h2 className="text-4xl font-bold text-primary md:text-5xl">{t.landing.contactTitle}</h2><p className="mt-4 text-lg leading-8 text-gray-600">{t.landing.contactText}</p></div><ContactForm /></section>
    <Footer />
  </main></>
}

export default LandingPage
