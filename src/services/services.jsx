import { motion } from 'framer-motion'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { cardReveal, scrollReveal, scrollViewport, staggerContainer } from '../components/animations/scroll-reveal.jsx'

const images = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
]

function Services() {
  const { direction, t } = useLanguage()
  return <main className="min-h-screen bg-surface" dir={direction}><NavBar /><motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20 md:py-28"><div className="mx-auto max-w-2xl text-center"><p className="mb-3 text-sm font-bold text-primary">{t.services.eyebrow}</p><h1 className="text-4xl font-bold md:text-5xl">{t.services.title}</h1><p className="mt-5 text-lg leading-8 text-text-body">{t.services.intro}</p></div><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={scrollViewport} className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">{t.services.items.map((service, index) => <motion.article variants={cardReveal} key={`service-${index}`} className="group overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"><img src={images[index]} alt="" className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div className="p-7"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">{index === 0 ? '⌘' : index === 1 ? '◫' : '✦'}</div><h2 className="mt-7 text-xl font-bold">{service.title}</h2><p className="mt-4 leading-7 text-text-body">{service.description}</p></div></motion.article>)}</motion.div></motion.section><a href="/#home" className="fixed bottom-6 left-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl" aria-label={t.common.backHome} title={t.common.backHome}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22v-10h6v10" /></svg></a></main>
}

export default Services
