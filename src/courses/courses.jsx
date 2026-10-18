import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { cardReveal, scrollReveal, scrollViewport, staggerContainer } from '../components/animations/scroll-reveal.jsx'

const courseIcons = {
  cpp: '/cplusplus.svg',
  javascript: '/javascript.svg',
  python: '/python.svg',
}

const minimumLoaderMs = 450
const ease = [0.22, 1, 0.36, 1]

function CoursesSkeleton({ count, label }) {
  return <motion.div key="courses-skeleton" role="status" aria-live="polite" aria-label={label}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}>
    <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-text-body shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <motion.span className="absolute inset-0 rounded-full bg-primary" animate={{ scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }} />
        <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
      </span>
      {label}
    </div>
    <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
      {Array.from({ length: count }, (_, index) => <motion.article key={index} aria-hidden="true"
        className="rounded-2xl border border-border bg-card p-6 shadow"
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.1, ease }}>
        <div className="flex items-center justify-between">
          <div className="skeleton h-14 w-14 rounded-xl" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="skeleton mt-6 h-5 w-3/4 rounded-md" />
        <div className="mt-5 space-y-2.5">
          <div className="skeleton h-3 w-full rounded-full" />
          <div className="skeleton h-3 w-11/12 rounded-full" />
          <div className="skeleton h-3 w-2/3 rounded-full" />
        </div>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-primary/10">
          <motion.div className="h-full rounded-full bg-primary/60"
            animate={{ width: ['0%', '70%', '100%'] }} transition={{ repeat: Infinity, duration: 1.8, delay: index * 0.2, ease: 'easeInOut' }} />
        </div>
        <div className="skeleton mt-6 h-4 w-24 rounded-md" />
      </motion.article>)}
    </div>
  </motion.div>
}

function CoursesPage() {
  const { direction, t } = useLanguage()
  const [coursesWithLessons, setCoursesWithLessons] = useState({})
  const [lessonsReady, setLessonsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadLessons() {
      const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, minimumLoaderMs))
      try {
        const responses = await Promise.all(t.courses.items.map(async (course) => {
          const response = await fetch(`/api/courses/${course.id}/lessons`)
          const payload = response.ok ? await response.json() : { lessons: [] }
          return [course.id, Boolean(payload.lessons?.length)]
        }))
        if (isMounted) setCoursesWithLessons(Object.fromEntries(responses))
      } catch {
        if (isMounted) setCoursesWithLessons({})
      } finally {
        await minimumDelay
        if (isMounted) setLessonsReady(true)
      }
    }

    void loadLessons()
    return () => { isMounted = false }
  }, [t.courses.items])

  return <MotionConfig reducedMotion="user"><main className="min-h-screen bg-surface" dir={direction}>
    <NavBar />
    <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-text-heading">{t.courses.title}</h1>
      <AnimatePresence mode="wait">
        {!lessonsReady
          ? <CoursesSkeleton key="courses-skeleton" count={t.courses.items.length} label={t.courses.loading} />
          : <motion.div key="courses-content" variants={staggerContainer} initial="hidden" animate="visible" className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {t.courses.items.map((course) => <motion.article variants={cardReveal} key={course.id} className="rounded-2xl border border-border bg-card p-6 shadow transition-shadow hover:shadow-lg">
              <img src={courseIcons[course.id]} alt="" className="h-14 w-14 object-contain" />
              <h2 className="mt-6 text-xl font-bold">{course.title}</h2>
              <p className="mt-4 leading-7 text-text-body">{course.description}</p>
              {!coursesWithLessons[course.id] && <p className="mt-4 font-bold text-text-heading">{t.courses.empty}</p>}
              <a href={`/courses/${course.id}`} className="mt-6 inline-block text-primary hover:underline">{t.courses.open}</a>
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

export default CoursesPage
