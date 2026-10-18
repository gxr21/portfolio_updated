import { motion } from 'framer-motion'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { cardReveal, scrollReveal, scrollViewport, staggerContainer } from '../components/animations/scroll-reveal.jsx'

const experienceImages = {
  'academic-horizon': '/academichorizon.jpg',
}

function ExperiencePage() {
  const { direction, t } = useLanguage()

  return <main className="min-h-screen bg-surface" dir={direction}>
    <NavBar />
    <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-text-heading">{t.experience.title}</h1>
      <p className="mt-4 max-w-2xl leading-8 text-text-body">{t.experience.intro}</p>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={scrollViewport} className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {t.experience.items.map((site) => <motion.article variants={cardReveal} key={site.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow transition-shadow hover:shadow-lg">
          <img src={experienceImages[site.id]} alt="" className="h-48 w-full object-cover" />
          <div className="p-6">
            <h2 className="text-xl font-bold">{site.title}</h2>
            <p className="mt-4 leading-7 text-text-body">{site.description}</p>
            <a href={site.url} target="_blank" rel="noreferrer" className="mt-6 inline-block text-primary hover:underline">{t.experience.openSite}</a>
          </div>
        </motion.article>)}
      </motion.div>
    </motion.section>
    <a href="/#home" className="fixed bottom-6 left-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl" aria-label={t.common.backHome} title={t.common.backHome}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22v-10h6v10" />
      </svg>
    </a>
  </main>
}

export default ExperiencePage
