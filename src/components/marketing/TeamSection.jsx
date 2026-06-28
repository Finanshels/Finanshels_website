'use client'

import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Linkedin } from '@/components/icons/BrandIcons'
import AnimatedSection from './AnimatedSection'
import { LEADERSHIP_TEAM } from '@/content/team'

const ACCENT_FALLBACK = '#f16610'

/**
 * Each leader's avatar URL encodes their identity colour
 * (`...&backgroundColor=6366f1`). We reuse it as the card accent so every
 * person carries a distinct, consistent colour across portrait, ring, and glow.
 * @param {string} image
 * @returns {{ seed: string, accent: string }}
 */
function parseAvatar(image) {
  try {
    const url = new URL(image)
    const bg = url.searchParams.get('backgroundColor')
    return {
      seed: url.searchParams.get('seed') || 'finanshels',
      accent: bg ? `#${bg}` : ACCENT_FALLBACK,
    }
  } catch {
    return { seed: 'finanshels', accent: ACCENT_FALLBACK }
  }
}

// Editorial founder blurbs — section-specific recruiting copy that goes a
// little deeper than the one-liner used elsewhere.
const FOUNDER_NOTES = {
  'Muhammed Shafeekh':
    'Started Finanshels after watching brilliant founders lose nights to broken books. Now leads the team rewriting how MENA does finance.',
  'Muhammed Musthafa':
    'Keeps the whole engine running — finance, people, legal, ops — so every client gets a team that simply works, every single month.',
}

// Reinforces claims already made elsewhere on the page — honest, not invented.
const CULTURE_CHIPS = [
  { emoji: '🧠', label: '20% of every week on learning' },
  { emoji: '⚡', label: 'Decisions in hours, not weeks' },
  { emoji: '🤝', label: 'Ownership from day one' },
  { emoji: '🌍', label: 'One team, five markets' },
]

const FOUNDERS = LEADERSHIP_TEAM.slice(0, 2)
const CREW = LEADERSHIP_TEAM.slice(2)

function Portrait({ image, seed, accent, size }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* accent bloom — intensifies on hover */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-full opacity-30 blur-xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: accent }}
      />
      {/* gradient ring */}
      <div
        className="relative h-full w-full rounded-full p-[2.5px] transition-transform duration-500 group-hover:scale-[1.04]"
        style={{ background: `linear-gradient(140deg, ${accent}, ${accent}22)` }}
      >
        <div className="h-full w-full rounded-full bg-white p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={seed}
            loading="lazy"
            className="h-full w-full rounded-full object-cover"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
    </div>
  )
}

function LinkedInButton({ href, name, accent }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${name} on LinkedIn`}
      style={{ '--accent': accent }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--accent)] hover:text-white hover:shadow-[0_10px_24px_-10px_var(--accent)]"
    >
      <Linkedin size={16} />
    </a>
  )
}

function FounderCard({ leader }) {
  const { accent } = parseAvatar(leader.image)
  const note = FOUNDER_NOTES[leader.name] || leader.bio
  return (
    <article
      className="group relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 sm:p-8"
      style={{ boxShadow: '0 30px 60px -40px rgba(15,23,42,0.25)' }}
    >
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: accent }}
      />
      <div className="relative z-10 flex items-start gap-5 sm:gap-6">
        <Portrait image={leader.image} seed={leader.name} accent={accent} size={104} />
        <div className="min-w-0 flex-1">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            <Sparkles size={11} /> Founder
          </span>
          <h3 className="mt-2.5 text-2xl font-semibold tracking-tight text-slate-900">{leader.name}</h3>
          <p className="text-sm font-semibold" style={{ color: accent }}>
            {leader.role}
          </p>
        </div>
      </div>
      <p className="relative z-10 mt-5 text-[15px] leading-relaxed text-slate-600">{note}</p>
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Finanshels · since 2019</span>
        {leader.linkedin ? <LinkedInButton href={leader.linkedin} name={leader.name} accent={accent} /> : null}
      </div>
    </article>
  )
}

function CrewCard({ leader }) {
  const { accent } = parseAvatar(leader.image)
  return (
    <article
      style={{ '--accent': accent }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-100 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:ring-1 hover:ring-[var(--accent)] hover:shadow-[0_28px_50px_-32px_var(--accent)]"
    >
      <div
        aria-hidden
        className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: accent }}
      />
      <div className="relative z-10 flex items-center gap-4">
        <Portrait image={leader.image} seed={leader.name} accent={accent} size={68} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-slate-900">{leader.name}</h3>
          <p className="truncate text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
            {leader.role}
          </p>
        </div>
      </div>
      <p className="relative z-10 mt-4 flex-1 text-sm leading-relaxed text-slate-600">{leader.bio}</p>
      <div className="relative z-10 mt-5 flex items-center justify-between">
        <span
          aria-hidden
          className="h-1 w-8 rounded-full transition-all duration-500 group-hover:w-12"
          style={{ background: accent }}
        />
        {leader.linkedin ? <LinkedInButton href={leader.linkedin} name={leader.name} accent={accent} /> : null}
      </div>
    </article>
  )
}

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fffaf5] to-white" />
        <div className="absolute -left-24 top-32 h-[380px] w-[380px] rounded-full bg-[#f16610]/10 blur-[130px]" />
        <div className="absolute -right-24 bottom-10 h-[420px] w-[420px] rounded-full bg-[#6366f1]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/30 bg-[#fff4ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f16610]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f16610] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f16610]" />
                </span>
                The humans behind the numbers
              </span>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
                Meet the people you&apos;ll actually{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                    text on WhatsApp
                  </span>
                  <span className="absolute inset-x-0 bottom-1 -z-0 h-3 -skew-x-6 bg-[#ffd19b]/60" />
                </span>
                .
              </h2>
              <p className="mt-5 text-lg text-slate-600">
                Not a faceless firm. A close-knit crew of accountants, controllers, tax leads, and operators who
                obsess over your numbers like they&apos;re their own — and genuinely love the work.
              </p>
            </div>

            {/* scale proof + hiring pill */}
            <div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {LEADERSHIP_TEAM.slice(0, 5).map((m) => {
                    const { accent } = parseAvatar(m.image)
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={m.name}
                        src={m.image}
                        alt=""
                        loading="lazy"
                        className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                        style={{ backgroundColor: accent }}
                      />
                    )
                  })}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[11px] font-bold text-white shadow-sm">
                    +170
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 md:text-right">
                <span className="font-bold text-slate-900">180+</span> specialists across 5 markets
              </p>
              <a
                href="/careers"
                className="group inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#f16610]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                We&apos;re hiring across MENA
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* FOUNDERS */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {FOUNDERS.map((leader, i) => (
            <AnimatedSection key={leader.name} animation="fade-up" delay={i * 90}>
              <FounderCard leader={leader} />
            </AnimatedSection>
          ))}
        </div>

        {/* CREW */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CREW.map((leader, i) => (
            <AnimatedSection key={leader.name} animation="fade-up" delay={i * 60}>
              <CrewCard leader={leader} />
            </AnimatedSection>
          ))}
        </div>

        {/* CULTURE CHIPS + JOIN CLOSER */}
        <AnimatedSection animation="fade-up">
          <div className="mt-14 overflow-hidden rounded-[36px] border border-[#ffd7c0] bg-gradient-to-br from-[#fff7f0] via-white to-[#fff9f3] p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {CULTURE_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.4)]"
                >
                  <span className="text-base leading-none">{chip.emoji}</span>
                  {chip.label}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-5 text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Liked meeting the team? Come build with us.
              </h3>
              <p className="max-w-xl text-slate-600">
                We&apos;re always hunting for exceptional finance athletes, operators, and builders. Even if you
                don&apos;t see your exact seat — if you&apos;re great, we want to talk.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/careers"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f16610] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#f16610]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  See open roles <ArrowUpRight size={18} />
                </a>
                <a
                  href="mailto:careers@finanshels.com?subject=I want to join Finanshels"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-[#f16610]/40"
                >
                  Pitch yourself
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
