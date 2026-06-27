'use client'

import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SECTOR_PAGES } from '@/content/sectors'

export default function Page() {
  return <ServiceDetailPage page={SECTOR_PAGES['vc-fund-accounting']} />
}
