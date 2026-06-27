import type { ServicePage } from '../service-pages'
import { smallBusiness } from './small-business'
import { realEstate } from './real-estate'
import { healthcare } from './healthcare'
import { nonProfit } from './non-profit'
import { ecommerce } from './ecommerce'
import { technology } from './technology'
import { restaurant } from './restaurant'
import { trading } from './trading'
import { jewellery } from './jewellery'
import { vcFund } from './vc-fund'

// Keyed by route slug — the per-sector route page reads SECTOR_PAGES[slug].
// Keep keys in sync with the route directories under src/app/<slug>/ and with
// NON_RESOURCE_STATIC_PAGE_PATHS in src/lib/staticPageRoutes.ts.
export const SECTOR_PAGES: Record<string, ServicePage> = {
  'small-business-accounting': smallBusiness,
  'real-estate-accounting': realEstate,
  'healthcare-accounting': healthcare,
  'non-profit-accounting': nonProfit,
  'ecommerce-accounting': ecommerce,
  'technology-accounting': technology,
  'restaurant-accounting': restaurant,
  'trading-business-accounting': trading,
  'jewellery-business-accounting': jewellery,
  'vc-fund-accounting': vcFund,
}

export const SECTOR_SLUGS = Object.keys(SECTOR_PAGES)
