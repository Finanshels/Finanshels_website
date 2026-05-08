import Link from 'next/link'

export default function CareersRoute() {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-32 sm:px-10 lg:px-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f16610]">Careers</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Build with the Finanshels team</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600">
          We hire operators who enjoy solving finance and compliance challenges for ambitious companies across MENA.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-lg font-semibold">Teams hiring now</p>
            <p className="mt-2 text-sm text-slate-600">Accounting, tax, compliance, and product operations.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-lg font-semibold">How to apply</p>
            <p className="mt-2 text-sm text-slate-600">Share your profile and role preference with our talent team.</p>
          </article>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://finanshels.kekahire.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl bg-[#f16610] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d95a0e]"
          >
            View open roles
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  )
}
