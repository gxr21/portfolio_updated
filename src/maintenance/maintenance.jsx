import { useLanguage } from '../i18n/language-context.jsx'

function Maintenance() {
  const { direction, t } = useLanguage()
  return <main className="relative flex min-h-screen items-center overflow-hidden bg-surface px-4 py-12" dir={direction}>
    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
    <section className="relative mx-auto w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white/85 px-6 py-12 text-center shadow-xl shadow-slate-200/60 backdrop-blur sm:px-12 sm:py-16">
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-4xl text-white shadow-lg shadow-primary/25">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
    </div>
    <p className="mt-8 text-sm font-bold tracking-wide text-primary">
      {t.maintenance.label}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-black sm:text-4xl">
        {t.maintenance.title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-text-body">
          {t.maintenance.text}
          </p>
          <div className="mx-auto mt-9 max-w-sm rounded-xl border border-blue-100 bg-surface-bright px-5 py-4 text-sm text-text-body">
            {t.maintenance.thanks}
            </div>
            </section>
          </main>
}

export default Maintenance
