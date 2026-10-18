import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { cardReveal, scrollReveal, scrollViewport, staggerContainer } from '../components/animations/scroll-reveal.jsx'

const courseIcons = {
  cpp: '/cplusplus.svg',
  javascript: '/javascript.svg',
  python: '/python.svg',
}

function CoursesPage() {
  const { direction, t } = useLanguage()
  const [coursesWithLessons, setCoursesWithLessons] = useState({})
  const [lessonsReady, setLessonsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadLessons() {
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
        if (isMounted) setLessonsReady(true)
      }
    }

    void loadLessons()
    return () => { isMounted = false }
  }, [t.courses.items])

  return <main className="min-h-screen bg-surface" dir={direction}>
    <NavBar />
    <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-text-heading">{t.courses.title}</h1>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={scrollViewport} className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {t.courses.items.map((course) => <motion.article variants={cardReveal} key={course.id} className="rounded-2xl border border-border bg-card p-6 shadow transition-shadow hover:shadow-lg">
          <img src={courseIcons[course.id]} alt="" className="h-14 w-14 object-contain" />
          <h2 className="mt-6 text-xl font-bold">{course.title}</h2>
          <p className="mt-4 leading-7 text-text-body">{course.description}</p>
          {lessonsReady && !coursesWithLessons[course.id] && <p className="mt-4 font-bold text-text-heading">{t.courses.empty}</p>}
          <a href={`/courses/${course.id}`} className="mt-6 inline-block text-primary hover:underline">{t.courses.open}</a>
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

export default CoursesPage
