import Link from 'next/link'

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Finanshels. All rights reserved.</p>
        <nav className="flex gap-5">
          <Link href="/privacy" className="hover:text-slate-900 transition">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-900 transition">Terms</Link>
          <Link href="/contact" className="hover:text-slate-900 transition">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
