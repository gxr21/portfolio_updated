import { useLanguage } from '../../i18n/language-context.jsx'

const skills = [
  { name: 'React', icon: '/react.svg' }, { name: 'JavaScript', icon: '/javascript.svg' }, { name: 'Node.js', icon: '/nodedotjs.svg' }, { name: 'MongoDB', icon: '/mongodb.svg' },
  { name: 'Tailwind CSS', icon: '/tailwindcss.svg' }, { name: 'Figma', icon: '/figma.svg' }, { name: 'Git', icon: '/git.svg' }, { name: 'Python', icon: '/python.svg' },
  { name: 'Bootstrap', icon: '/bootstrap.svg' }, { name: 'C++', icon: '/cplusplus.svg' }, { name: 'HTML', icon: '/html5.svg' }, { name: 'CSS3', icon: '/css.svg' },
]

function Skills() {
  const { direction, t } = useLanguage()
  return <section className="overflow-hidden py-16" aria-labelledby="skills-title" dir={direction}>
    <div className="container mx-auto mb-9 px-4 text-center"><p className="mb-2 text-sm font-bold tracking-[0.2em] text-primary">{t.landing.skillsLabel}</p><h2 id="skills-title" className="font-tajawal text-3xl md:text-4xl">{t.landing.skillsTitle}</h2></div>
    <div className="skills-marquee flex w-max">{[skills, skills].map((group, groupIndex) => <div key={groupIndex} className="flex shrink-0 gap-5">{group.map((skill) => <div key={`${skill.name}-${groupIndex}`} className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-3 p-4"><img src={skill.icon} alt="" className="h-10 w-10 object-contain" /><span className="text-center text-xs font-medium text-text-heading">{skill.name}</span></div>)}</div>)}</div>
  </section>
}

export default Skills
