import { useLanguage } from '../i18n/language-context.jsx'

function Maintenance() {
  const { direction, t } = useLanguage()
  return <main className="relative flex min-h-screen items-center overflow-hidden bg-surface px-4 py-12" dir={direction}><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" /><div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" /><section className="relative mx-auto w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white/85 px-6 py-12 text-center shadow-xl shadow-slate-200/60 backdrop-blur sm:px-12 sm:py-16"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-4xl text-white shadow-lg shadow-primary/25">⚙</div><p className="mt-8 text-sm font-bold tracking-wide text-primary">{t.maintenance.label}</p><h1 className="mt-3 text-3xl font-bold text-black sm:text-4xl">{t.maintenance.title}</h1><p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-text-body">{t.maintenance.text}</p><div className="mx-auto mt-9 max-w-sm rounded-xl border border-blue-100 bg-surface-bright px-5 py-4 text-sm text-text-body">{t.maintenance.thanks}</div></section></main>
}

export default Maintenance
