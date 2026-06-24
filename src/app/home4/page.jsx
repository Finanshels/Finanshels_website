import { Baloo_2, Montserrat } from 'next/font/google'
import Home4 from '../../screens/Home4'

// Rounded geometric display face (skrooge-style headings) + Montserrat body.
const display = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const body = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export default function Page() {
  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <Home4 />
    </div>
  )
}
