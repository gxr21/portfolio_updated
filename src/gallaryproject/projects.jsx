import { useState } from 'react'
import { motion } from 'framer-motion'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import NavBar from '../components/navbar/navbar.jsx'
import { useLanguage } from '../i18n/language-context.jsx'
import { cardReveal, scrollReveal, scrollViewport, staggerContainer } from '../components/animations/scroll-reveal.jsx'

const images = ['/sse.jpg', '/securitypackege.jpg', '/midecalcenter.jpg', '/academichorizon.jpg', '/dashboard.jpg','/ThenAndNow.jpg','/srab.jpg','/Thrwa.jpg','/wsaly.jpg','/dashboardstudent.jpg','/PHP_Website.jpg','/claculator.jpg','/abssence.jpg']
const githubProfile = 'https://github.com/gxr21'
const projectLinks = {
  1: 'https://github.com/gxr21/SseEncryptedFiles.git',
  2: 'https://github.com/gxr21/securitypackege.git',
  3: githubProfile,
  4: githubProfile,
  5: 'https://github.com/gxr21/DashBord.git' ,
  6:'https://github.com/gxr21/ThenAndNowForHistoryPicture.git',
  7: githubProfile,
  8: 'https://github.com/gxr21/MoneyThrawa.git',
  9: githubProfile,
  10:'https://github.com/gxr21/pageStudent.git',
  11: 'https://github.com/gxr21/PHP.git',
  12: githubProfile,
  13: 'https://github.com/gxr21/OnlineAttSys.git',
}

const projectLiveLinks = {
  1: 'https://sseencryptedfiles.onrender.com/',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
}

const projectTechs = {
  1: [
    { name: 'React', icon: '/react.svg' },
    { name: 'Node.js', icon: '/nodedotjs.svg' },
    { name: 'MongoDB', icon: '/mongodb.svg' },
  ],
  2: [
    { name: 'React', icon: '/react.svg' },
    { name: 'Python', icon: '/python.svg' },
    { name: 'Bootstrap', icon: '/bootstrap.svg' },
  ],
  3: [
    { name: 'React', icon: '/react.svg' },
    { name: 'Python', icon: '/nodedotjs.svg' },
    { name: 'MongoDB', icon: '/mongodb.svg' },
  ],
  4: [
    { name: 'React', icon: '/react.svg' },
    { name: 'Tailwind CSS', icon: '/tailwindcss.svg' },
    { name: 'MongoDB', icon: '/mongodb.svg' },
  ],
  5: [
    { name: 'Html', icon: '/html5.svg' },
    { name: 'Bootstrap', icon: '/bootstrap.svg' },
    { name: 'JavaScript', icon: '/javascript.svg' },
  ],
  6: [
    { name: 'React', icon: '/react.svg' },
    { name: 'Python', icon: '/python.svg' },
    { name: 'MongoDB', icon: '/mongodb.svg' },
  ],
  7: [
    { name: 'Python', icon: '/python.svg' },
    { name: 'Node.js', icon: '/nodedotjs.svg' },
    { name: 'AI Api', icon: '/googlecolab.svg' },
  ],
  8: [
    { name: 'Python', icon: '/python.svg' },
    { name: 'HuggingFace Api', icon: '/huggingface.svg' },
  ],
  9: [
    { name: 'React', icon: '/react.svg' },
    { name: 'Tailwind CSS', icon: '/tailwindcss.svg' },
    // { name: 'JavaScript', icon: '/javascript.svg' },
  ],
  10: [
    { name: 'HTML', icon: '/html5.svg' },
    { name: 'CSS3', icon: '/css.svg' },
    // { name: 'JavaScript', icon: '/javascript.svg' },
  ],
  11: [
    { name: 'PHP', icon: '/php.svg' },
    { name: 'HTML', icon: '/html5.svg' },
    { name: 'CSS3', icon: '/css.svg' },
  ],
  12: [
    { name: 'HTML', icon: '/html5.svg' },
    { name: 'CSS3', icon: '/css.svg' },
    { name: 'JavaScript', icon: '/javascript.svg' },
  ],
  13: [
    { name: 'PHP', icon: '/php.svg' },
    { name: 'HTML5', icon: '/html5.svg' },
    { name: 'SQL', icon: '/mysql.svg' },
  ],
}

function Projects() {
  const { direction, t } = useLanguage()
  const [ratings, setRatings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('project-ratings')) || {}
    } catch {
      return {}
    }
  })

  const setProjectRating = (projectId, rating) => {
    setRatings((currentRatings) => {
      const nextRatings = { ...currentRatings, [projectId]: rating }
      localStorage.setItem('project-ratings', JSON.stringify(nextRatings))
      return nextRatings
    })
  }
  
  return <main className="min-h-screen bg-surface" dir={direction}>
    <NavBar />
    <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={scrollViewport} className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-black">{t.projects.title}</h1>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={scrollViewport} className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {t.projects.items.map((project, index) =>{
          const techs = projectTechs[project.id] || []
          const projectLink = projectLinks[project.id] || githubProfile
          const liveProjectLink = projectLiveLinks[project.id] || projectLink
          const rating = ratings[project.id] || 0
          return <motion.article variants={cardReveal} key={`project-${index}`} className="overflow-hidden rounded-2xl border bg-white  shadow transition-shadow hover:shadow-lg">
        <img src={images[index]} alt="" className="h-48 w-full object-fit" loading="lazy" />
        <div className="p-6">
          <h2 className="text-xl font-bold">{project.title}</h2>
        <p className="mt-4 leading-7 text-gray-600">{project.description}</p>
        <div className="mt-4 flex items-center gap-1" aria-label={t.projects.rating}>
          {[1, 2, 3, 4, 5].map((star) => {
            const Star = star <= rating ? StarIcon : StarBorderIcon
            return <button key={`${project.id}-rating-${star}`} type="button" onClick={() => setProjectRating(project.id, star)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors duration-300 hover:bg-gray-300 hover:text-primary" aria-label={`${t.projects.rating} ${star}`}>
              <Star fontSize="small" />
            </button>
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {techs.map((tech) => <span key={`${project.id}-${tech.name}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300">
            <img src={tech.icon} alt="" className="h-5 w-5 object-contain " loading="lazy" />
            {tech.name}
          </span>)}
          <a href={projectLink} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition-colors duration-300 hover:bg-primary hover:text-white" aria-label={t.projects.viewProject} title={t.projects.viewProject}>
            <GitHubIcon fontSize="small" />
          </a>
          <a href={liveProjectLink} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition-colors duration-300 hover:bg-primary hover:text-white" aria-label={t.projects.openProject} title={t.projects.openProject}>
            <OpenInNewIcon fontSize="small" />
          </a>
        </div>
        </div>

        </motion.article> 
        
      })}
        </motion.div>
        </motion.section>
        <a href="/#home" className="fixed bottom-6 left-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl" aria-label={t.common.backHome} title={t.common.backHome}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22v-10h6v10" />
          </svg>
          </a>
        </main>
}

export default Projects
