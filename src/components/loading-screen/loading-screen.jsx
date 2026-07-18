import { useLanguage } from '../../i18n/language-context.jsx'

function LoadingScreen({ mode, pageName }) {
  const { direction, t } = useLanguage(); const isWelcome = mode === 'welcome'
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4" dir={direction}><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" /><div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" /><section className="relative w-full max-w-md text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary font-birthstone text-4xl text-white shadow-xl shadow-primary/25">A.J</div><h1 className="mt-8 text-2xl font-bold text-black">{isWelcome ? t.loading.welcome : `${t.loading.transition} ${pageName}`}</h1><p className="mt-3 text-text-body">{isWelcome ? t.loading.welcomeText : t.loading.transitionText}</p><div className="mx-auto mt-9 h-1.5 w-52 overflow-hidden rounded-full bg-primary/10"><div className="h-full w-1/2 animate-[loading_0.9s_ease-in-out_infinite] rounded-full bg-primary" /></div><div className="mt-5 flex justify-center gap-1.5" aria-label={t.common.loading}><span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" /><span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" /><span className="h-2 w-2 animate-bounce rounded-full bg-primary" /></div></section></main>
}

export default LoadingScreen
