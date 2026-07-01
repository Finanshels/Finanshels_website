'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Handshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import AnimatedSection from '../components/marketing/AnimatedSection'

const COMMUNITY_STATS = [
  { value: 'Slack', label: 'private founder community' },
  { value: 'UAE/GCC', label: 'operator-led founder conversations' },
  { value: 'Peer-first', label: 'questions, intros, and practical answers' },
]

const PILLARS = [
  {
    icon: MessageCircle,
    title: 'Founder questions, answered fast',
    description:
      'Ask about banking, VAT, corporate tax, hiring, fundraising, tools, and operations without waiting for a scheduled call.',
  },
  {
    icon: Users,
    title: 'Peer network for operators',
    description:
      'Connect with founders building in the UAE and GCC who are solving similar finance and growth problems.',
  },
  {
    icon: Handshake,
    title: 'Warm intros and trusted referrals',
    description:
      'Find accountants, banks, service partners, hires, investors, and operators through community-led recommendations.',
  },
  {
    icon: ShieldCheck,
    title: 'Signal without noise',
    description:
      'A focused Slack space moderated by Finanshels so the feed stays useful, practical, and founder-safe.',
  },
]

const PROGRAMS = [
  {
    icon: MessageCircle,
    title: '#ask-finance',
    description:
      'Ask finance, tax, banking, accounting, and compliance questions in a founder-friendly channel.',
    href: '/contact',
    cta: 'Request invite',
  },
  {
    icon: Users,
    title: '#founder-intros',
    description:
      'Introduce what you are building, find relevant peers, and start useful operator conversations.',
    href: '/contact',
    cta: 'Join Slack',
  },
  {
    icon: Handshake,
    title: '#wins-and-asks',
    description:
      'Share launches, hiring needs, fundraising asks, partner requests, and useful referrals.',
    href: '/contact',
    cta: 'Get access',
  },
]

const BENEFITS = [
  'Get fast peer input before choosing a bank, accountant, tool, or finance workflow.',
  'Learn from founders who have handled similar UAE setup, VAT, corporate tax, and compliance questions.',
  'Share asks, intros, launches, and hiring needs with a focused founder audience.',
  'Stay close to practical Finanshels guidance without turning the community into a sales channel.',
]

export default function Community() {
  return (
    <div className="bg-[#fffdfb] text-slate-900 overflow-hidden">
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,102,16,0.18),transparent_34%),linear-gradient(180deg,#fff7f0_0%,#fffdfb_68%,#ffffff_100%)]" />
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,#f16610_1px,transparent_1px),linear-gradient(180deg,#f16610_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="max-w-6xl mx-auto grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatedSection animation="fade-right" className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f16610]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#f16610] shadow-sm">
              <Sparkles className="h-4 w-4" />
              Founder Slack Community
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.04] tracking-tight">
                Join the Slack community for{' '}
                <span className="bg-gradient-to-r from-[#f16610] to-[#ff8a3c] bg-clip-text text-transparent">
                  UAE founders building smarter
                </span>
              </h1>
              <p className="max-w-2xl text-lg sm:text-xl leading-8 text-slate-600">
                A private Finanshels-led Slack space where founders ask
                questions, trade referrals, share operator lessons, and get
                practical finance context from people building in the UAE and
                GCC.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f16610] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#f16610]/25 transition hover:bg-[#d95708]"
              >
                Request Slack invite
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#community-channels"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:border-[#f16610]/40 hover:text-[#f16610]"
              >
                See channels
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" className="relative">
            <div className="absolute -left-6 top-8 hidden h-28 w-28 rounded-[2rem] bg-[#ffd19b] opacity-70 blur-2xl lg:block" />
            <div className="relative rounded-[2rem] border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-100/70">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#fff7f0]">
                <Image
                  src="/shafeekh.png"
                  alt="Finanshels founder community for UAE operators"
                  width={1080}
                  height={1080}
                  priority
                  className="aspect-[4/4.2] w-full object-cover object-center"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f16610] text-white">
                      <Handshake className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Founder Slack, not another newsletter
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        Ask, answer, introduce, and learn with operators
                        building across the UAE and GCC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-8 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Building2 className="h-4 w-4 text-[#f16610]" />
                  Private founder Slack
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="max-w-6xl mx-auto mt-14 grid gap-3 sm:grid-cols-3">
          {COMMUNITY_STATS.map((stat) => (
            <AnimatedSection
              key={stat.value}
              className="rounded-3xl border border-orange-100 bg-white/85 p-5 shadow-sm backdrop-blur"
            >
              <p className="text-2xl font-extrabold text-[#f16610]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                {stat.label}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f16610]">
              Inside the Slack
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              A focused space for founder questions, intros, and operator
              context
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The community is designed for daily founder questions: useful
              answers, warm introductions, practical finance context, and
              conversations that help operators move faster.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon

              return (
                <AnimatedSection
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-slate-100 bg-[#fffdfb] p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-100/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e6] text-[#f16610]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-950">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {pillar.description}
                  </p>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-[#0f172a] p-6 text-white shadow-2xl shadow-slate-200 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <AnimatedSection animation="fade-right" className="space-y-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#ff8a3c]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffd19b]">
                What members get
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Founder help without the noise
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-300">
              Slack works when channels stay focused. Finanshels keeps the
              community useful for founders who want practical answers, relevant
              intros, and business-building context.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" className="grid gap-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#ff8a3c]" />
                <p className="leading-7 text-slate-200">{benefit}</p>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <section
        id="community-channels"
        className="bg-white px-6 py-20 sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f16610]">
                Community channels
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Slack rooms for the questions founders actually ask
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-[#f16610]/40 hover:text-[#f16610]"
            >
              Request an invite
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {PROGRAMS.map((program) => {
              const Icon = program.icon

              return (
                <AnimatedSection
                  key={program.title}
                  className="rounded-[1.75rem] border border-slate-100 bg-[#fffdfb] p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-100/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e6] text-[#f16610]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-950">
                    {program.title}
                  </h3>
                  <p className="mt-3 min-h-[5.25rem] leading-7 text-slate-600">
                    {program.description}
                  </p>
                  <Link
                    href={program.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#f16610] transition hover:text-[#d95708]"
                  >
                    {program.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <AnimatedSection className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-[#f16610] to-[#ff8a3c] p-8 text-white shadow-2xl shadow-orange-100 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">
                Founder community
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Get access to the Finanshels founder Slack.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                Request an invite and we will route you into the right founder
                channels for finance questions, intros, and operator support.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#f16610] shadow-lg transition hover:bg-[#fff7f0]"
            >
              Request Slack invite
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
