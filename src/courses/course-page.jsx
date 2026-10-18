import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { scrollReveal, scrollViewport } from '../components/animations/scroll-reveal.jsx'

const uploadErrorText = {
  unauthorized: 'uploadUnauthorized',
  'upload-unavailable': 'uploadUnavailable',
  'invalid-video': 'invalidVideo',
  'file-too-large': 'fileTooLarge',
}

function CoursePage({ courseId }) {
  const { direction, t } = useLanguage()
  const course = t.courses.items.find((item) => item.id === courseId)
  const isDevelopment = import.meta.env.DEV
  const [lessons, setLessons] = useState([])
  const [uploadKey, setUploadKey] = useState(() => sessionStorage.getItem('course-upload-key') || '')
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadLessons() {
      try {
        const response = await fetch(`/api/courses/${courseId}/lessons`)
        const payload = response.ok ? await response.json() : { lessons: [] }
        if (isMounted) setLessons(payload.lessons || [])
      } catch {
        if (isMounted) setLessons([])
      }
    }

    void loadLessons()
    return () => { isMounted = false }
  }, [courseId])

  const handleUpload = async (event) => {
    event.preventDefault()
    const files = [...event.target.video.files]
    if (!files.length) return

    sessionStorage.setItem('course-upload-key', uploadKey)
    setIsUploading(true)
    setStatus('')

    try {
      for (const file of files) {
        const body = new FormData()
        body.append('video', file)
        const response = await fetch(`/api/courses/${courseId}/lessons`, {
          method: 'POST',
          headers: { 'x-upload-key': uploadKey },
          body,
        })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          const messageKey = uploadErrorText[payload.error] || 'uploadFailed'
          throw new Error(t.courses[messageKey])
        }
        setLessons((current) => [...current, payload.lesson])
      }
      event.target.reset()
      setStatus(t.courses.uploadSuccess)
    } catch (error) {
      setStatus(error.message || t.courses.uploadFailed)
    } finally {
      setIsUploading(false)
    }
  }

  if (!course) return null

  return <main className="min-h-screen bg-surface" dir={direction}>
    <NavBar />
    <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20">
      <a href="/courses" className="text-sm font-medium text-primary hover:underline">{t.courses.back}</a>
      <h1 className="mt-4 text-3xl font-bold text-text-heading">{course.title}</h1>
      <p className="mt-4 max-w-2xl leading-8 text-text-body">{course.description}</p>

      {lessons.length > 0 && <div className="mt-8 grid grid-cols-1 gap-6">
        {lessons.map((lesson) => <article key={lesson.id} className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow">
          <h2 className="mb-4 text-lg font-bold">{lesson.title}</h2>
          <video controls controlsList={isDevelopment ? undefined : 'nodownload'} disablePictureInPicture={!isDevelopment} preload="metadata" src={lesson.url} onContextMenu={isDevelopment ? undefined : (event) => event.preventDefault()} className="aspect-video w-full rounded-xl bg-black" />
        </article>)}
      </div>}

      {isDevelopment && <form onSubmit={handleUpload} className="mt-8 max-w-xl rounded-2xl border border-border bg-card p-6 shadow">
        <label htmlFor="course-upload-key" className="text-sm font-medium text-text-heading">{t.courses.uploadKey}</label>
        <input id="course-upload-key" type="password" value={uploadKey} onChange={(event) => setUploadKey(event.target.value)} placeholder={t.courses.uploadKeyPlaceholder} autoComplete="off" className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-text-heading outline-none focus:border-primary" />
        <input name="video" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" multiple className="mt-4 block w-full text-sm text-text-body file:me-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white" />
        <button type="submit" disabled={isUploading} className="mt-4 rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60">{isUploading ? t.courses.uploading : t.courses.upload}</button>
        {status && <p className="mt-3 text-sm text-text-body">{status}</p>}
      </form>}
    </motion.section>
    <a href="/#home" className="fixed bottom-6 left-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl" aria-label={t.common.backHome} title={t.common.backHome}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22v-10h6v10" />
      </svg>
    </a>
  </main>
}

export default CoursePage
