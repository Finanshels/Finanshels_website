'use client'

import ServiceDetailPage from '../../screens/services/ServiceDetailPage'
import { SERVICE_PAGES } from '../../data/servicePages'

export default function Page() {
  return <ServiceDetailPage page={SERVICE_PAGES['audit-services-dubai']} />
}
