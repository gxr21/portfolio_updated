import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { cardReveal, scrollReveal, scrollViewport, staggerContainer } from '../components/animations/scroll-reveal.jsx'

const experienceImages = {
  'academic-horizon': '/academichorizon.jpg',
}

const minimumLoaderMs = 700
const ease = [0.22, 1, 0.36, 1]

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = resolve
    image.src = src
  })
}

function PreviewLoader({ url, label, steps }) {
  const host = url.replace(/^https?:\/\//, '')
  const blocks = [
    'col-span-6 h-5',
    'col-span-4 h-16',
    'col-span-2 h-16',
    'col-span-2 h-10',
    'col-span-2 h-10',
    'col-span-2 h-10',
    'col-span-5 h-3',
    'col-span-3 h-3',
  ]

  return <motion.div key="preview-loader" role="status" aria-live="polite" aria-label={label}
    className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]"
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }} transition={{ duration: 0.4, ease }}>
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg" aria-hidden="true">
      <div className="flex items-center gap-3 border-b border-border bg-surface-bright px-4 py-3" dir="ltr">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="relative flex h-8 min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-border bg-card px-3 text-xs text-text-body">
          <svg viewBox="0 0 24 24" className="me-2 h-3.5 w-3.5 shrink-0 fill-none stroke-current" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          <span className="truncate">{host}</span>
          <motion.span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" style={{ transformOrigin: 'left' }}
            animate={{ scaleX: [0, 0.7, 1], opacity: [1, 1, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} />
        </div>
      </div>
      <div className="relative p-5 sm:p-6">
        <div className="grid grid-cols-6 gap-3">
          {blocks.map((block, index) => <motion.div key={index} className={`${block} rounded-lg border border-dashed border-primary/30 bg-primary/5`}
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: [0, 1, 1, 0.55], scale: [0.92, 1, 1, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 0.4, duration: 2.2, delay: index * 0.12, times: [0, 0.25, 0.8, 1], ease }} />)}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-primary/15 to-transparent preview-scan" />
      </div>
    </div>
    <ol className="space-y-3 self-start rounded-2xl border border-border bg-card p-5 shadow">
      <li className="mb-1 text-sm font-bold text-text-heading">{label}</li>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return <motion.li key={step} className="flex items-center gap-3 text-sm text-text-body"
          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.25, duration: 0.35, ease }}>
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40">
            {isLast
              ? <motion.span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
              : <motion.svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 + index * 0.25, duration: 0.3 }} />
              </motion.svg>}
          </span>
          {step}
        </motion.li>
      })}
    </ol>
  </motion.div>
}

function ExperiencePage() {
  const { direction, t } = useLanguage()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true
    const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, minimumLoaderMs))
    Promise.all([...Object.values(experienceImages).map(preloadImage), minimumDelay]).then(() => {
      if (isMounted) setIsReady(true)
    })
    return () => { isMounted = false }
  }, [])

  return <MotionConfig reducedMotion="user"><main className="min-h-screen bg-surface" dir={direction}>
    <NavBar />
    <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-text-heading">{t.experience.title}</h1>
      <p className="mt-4 max-w-2xl leading-8 text-text-body">{t.experience.intro}</p>
      <AnimatePresence mode="wait">
        {!isReady
          ? <PreviewLoader key="preview-loader" url={t.experience.items[0].url} label={t.experience.loading} steps={t.experience.loadingSteps} />
          : <motion.div key="experience-content" variants={staggerContainer} initial="hidden" animate="visible" className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.experience.items.map((site) => <motion.article variants={cardReveal} key={site.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow transition-shadow hover:shadow-lg">
              <img src={experienceImages[site.id]} alt="" className="h-48 w-full object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-bold">{site.title}</h2>
                <p className="mt-4 leading-7 text-text-body">{site.description}</p>
                <a href={site.url} target="_blank" rel="noreferrer" className="mt-6 inline-block text-primary hover:underline">{t.experience.openSite}</a>
              </div>
            </motion.article>)}
          </motion.div>}
      </AnimatePresence>
    </motion.section>
    <a href="/#home" className="fixed bottom-6 left-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl" aria-label={t.common.backHome} title={t.common.backHome}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22v-10h6v10" />
      </svg>
    </a>
  </main></MotionConfig>
}

export default ExperiencePage
