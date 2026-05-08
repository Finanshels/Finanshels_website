'use client'

import { use } from 'react'
import { SERVICE_PAGES } from '../../../data/servicePages'
import ServiceDetailPage from '../../../screens/services/ServiceDetailPage'

export default function ServiceRoute({ params }) {
  const { slug } = use(params)
  return <ServiceDetailPage page={SERVICE_PAGES[slug]} />
}
