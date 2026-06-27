'use client'

import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '@/content/service-pages'

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['vat-registration-uae']} />
}
