import { MotionConfig, motion } from 'framer-motion'
import { useLanguage } from '../../i18n/language-context.jsx'

const ease = [0.22, 1, 0.36, 1]
const loop = { repeat: Infinity, ease: 'easeInOut' }

function Monogram({ size = 120 }) {
  return <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <defs>
      <linearGradient id="loader-aj" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0" stopColor="#0145F2" />
        <stop offset="1" stopColor="#6EA8FF" />
      </linearGradient>
    </defs>
    <motion.rect x="3" y="3" width="58" height="58" rx="17" fill="none" stroke="url(#loader-aj)" strokeWidth="2.5"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.9, ease }} />
    <motion.path d="M13 47 L24.5 17 L36 47" fill="none" stroke="url(#loader-aj)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.25, ease }} />
    <motion.path d="M18.5 36.5 H30.5" fill="none" stroke="url(#loader-aj)" strokeWidth="5" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.85, ease }} />
    <motion.path d="M50 17 V38.5 a8.5 8.5 0 0 1 -14.5 6" fill="none" stroke="url(#loader-aj)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6, ease }} />
  </svg>
}

function WelcomeVisual() {
  return <div className="relative flex h-44 w-44 items-center justify-center">
    <motion.span className="absolute inset-0 rounded-full border border-primary/30" animate={{ scale: [0.8, 1.25], opacity: [0.7, 0] }} transition={{ ...loop, duration: 1.8, ease: 'easeOut' }} />
    <motion.span className="absolute inset-4 rounded-full border border-primary/20" animate={{ scale: [0.8, 1.25], opacity: [0.6, 0] }} transition={{ ...loop, duration: 1.8, delay: 0.6, ease: 'easeOut' }} />
    <Monogram />
  </div>
}

function HomeVisual() {
  return <div className="relative flex h-44 w-44 items-center justify-center">
    <motion.div className="absolute h-36 w-36 rounded-full border-2 border-dashed border-primary/30" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} />
    <motion.div className="absolute h-3 w-3 rounded-full bg-primary" style={{ top: 14 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }} />
    <Monogram size={92} />
  </div>
}

function ProjectsVisual() {
  return <div className="grid h-44 w-44 grid-cols-3 gap-2.5 p-3">
    {Array.from({ length: 9 }, (_, index) => <motion.span key={index} className="rounded-lg bg-primary"
      animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1, 0.7] }}
      transition={{ ...loop, duration: 1.4, delay: ((index % 3) + Math.floor(index / 3)) * 0.12 }} />)}
  </div>
}

function ServicesVisual() {
  return <div className="relative flex h-44 w-44 items-center justify-center">
    <motion.div className="absolute h-36 w-36 rounded-full border-2 border-primary/20" />
    {[0, 1, 2].map((index) => <motion.div key={index} className="absolute h-36 w-36" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear', delay: -index }}>
      <span className="absolute left-1/2 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-sm text-white shadow-lg shadow-primary/30">{['⌘', '◫', '✦'][index]}</span>
    </motion.div>)}
    <motion.div className="h-12 w-12 rounded-2xl bg-primary/15" animate={{ scale: [1, 1.15, 1] }} transition={{ ...loop, duration: 1.5 }} />
  </div>
}

function CoursesVisual() {
  return <div className="flex h-44 w-56 flex-col justify-center gap-3 rounded-2xl border border-border bg-card p-5 text-start font-mono shadow-lg" dir="ltr">
    <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" /></div>
    {[72, 52, 86, 40].map((width, index) => <motion.span key={index} className="h-2.5 rounded-full bg-primary/70" style={{ marginInlineStart: index % 2 ? 16 : 0 }}
      animate={{ width: [0, width, width] }} transition={{ ...loop, duration: 1.8, delay: index * 0.2, times: [0, 0.5, 1] }} />)}
    <motion.span className="h-4 w-1.5 bg-primary" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
  </div>
}

function CourseVisual() {
  return <div className="relative flex h-44 w-44 items-center justify-center">
    <svg viewBox="0 0 100 100" className="absolute h-40 w-40 -rotate-90" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="5" className="text-primary/15" />
      <motion.circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-primary"
        animate={{ pathLength: [0, 1] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} />
    </svg>
    <motion.div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/30" animate={{ scale: [1, 1.08, 1] }} transition={{ ...loop, duration: 1.2 }}>
      <svg viewBox="0 0 24 24" className="ms-1 h-9 w-9 fill-white" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5Z" /></svg>
    </motion.div>
  </div>
}

function ExperienceVisual() {
  return <div className="h-40 w-60 overflow-hidden rounded-2xl border border-border bg-card shadow-lg" dir="ltr">
    <div className="flex items-center gap-2 border-b border-border bg-surface-bright px-3 py-2">
      <div className="flex gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-yellow-400" /><span className="h-2 w-2 rounded-full bg-green-400" /></div>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-card">
        <motion.span className="absolute inset-y-0 start-0 rounded-full bg-primary" animate={{ width: ['0%', '100%'] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }} />
      </div>
    </div>
    <div className="space-y-2.5 p-4">
      <motion.div className="h-12 rounded-lg bg-primary/20" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ ...loop, duration: 1.4 }} />
      <motion.div className="h-2.5 w-3/4 rounded-full bg-primary/30" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ ...loop, duration: 1.4, delay: 0.2 }} />
      <motion.div className="h-2.5 w-1/2 rounded-full bg-primary/30" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ ...loop, duration: 1.4, delay: 0.4 }} />
    </div>
  </div>
}

function visualFor(mode, path = '/') {
  if (mode === 'welcome') return <WelcomeVisual />
  if (path === '/projects') return <ProjectsVisual />
  if (path === '/services') return <ServicesVisual />
  if (path === '/courses') return <CoursesVisual />
  if (path.startsWith('/courses/')) return <CourseVisual />
  if (path === '/experience') return <ExperienceVisual />
  return <HomeVisual />
}

function LoadingScreen({ mode, pageName, path }) {
  const { direction, t } = useLanguage()
  const isWelcome = mode === 'welcome'

  return <MotionConfig reducedMotion="user"><main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4" dir={direction} aria-busy="true" aria-label={t.common.loading}>
    <motion.div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ ...loop, duration: 4 }} />
    <motion.div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" animate={{ scale: [1.1, 1, 1.1] }} transition={{ ...loop, duration: 4 }} />
    <motion.section className="relative flex w-full max-w-md flex-col items-center text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
      {visualFor(mode, path)}
      <h1 className="mt-8 text-2xl font-bold text-text-heading">{isWelcome ? t.loading.welcome : `${t.loading.transition} ${pageName}`}</h1>
      <p className="mt-3 text-text-body">{isWelcome ? t.loading.welcomeText : t.loading.transitionText}</p>
    </motion.section>
  </main></MotionConfig>
}

export default LoadingScreen
