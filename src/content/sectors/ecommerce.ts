import type { ServicePage } from '../service-pages'

export const ecommerce: ServicePage = {
  title: 'E-Commerce Accounting',
  subtitle:
    'E-commerce accounting in the UAE — real margins, real profit, every channel reconciled.',
  description:
    'Your Shopify dashboard shows revenue. Your Noon settlement shows gross sales. Your bank account shows something else entirely — and none of them tell you your actual margin. Finanshels builds e-commerce accounting from the channel up: every platform reconciled, every fee accounted for, COGS matched to the period goods were sold, and a monthly P&L that tells you what you actually made — by channel, by SKU, and in total.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Starting from', value: 'AED 800/mo' },
  ],
  problems: [
    'Your Shopify, Noon, and Amazon.ae numbers never agree with your bank balance, because every platform settles on its own schedule, net of its own fees.',
    'Cash-basis COGS distorts your gross margin by 10–30% in volatile months, so you cannot tell which channel or SKU is actually profitable.',
    'Reverse charge on overseas platform and advertising fees is one of the most commonly missed UAE VAT obligations — and one the FTA specifically looks for.',
  ],
  whyNow: [
    'Most fast-growing UAE e-commerce businesses cross the AED 375,000 VAT threshold within 12 to 18 months of launch — and the obligation starts the day you cross it, not when you apply.',
    'Scaling into Saudi Arabia, Bahrain, Oman, Kuwait, or Qatar creates separate GCC VAT registration obligations that arrive without warning.',
    'Corporate Tax now makes inventory-based COGS a compliance issue, not just a margin-accuracy one — cash-basis COGS risks discrepancies between your accounts and your CT return.',
  ],
  whoFor: [
    {
      segment: 'D2C brand on your own Shopify or WooCommerce store',
      description:
        'You have your own UAE-registered brand selling direct to customers through your website. Your accounting needs to reconcile Shopify payouts to your bank account daily, handle VAT on domestic sales correctly, zero-rate exports with proof, and produce a channel P&L that shows your true margin after payment processing, shipping, and returns.',
    },
    {
      segment: 'Marketplace seller on Noon, Amazon.ae, or both',
      description:
        'You sell through Noon UAE, Amazon.ae, or multiple UAE marketplaces. You receive monthly or bi-weekly settlement reports showing gross sales minus commissions, refunds, and fees — but reconciling those settlements to actual orders, and booking the fee categories correctly, is where most marketplace accounting breaks down.',
    },
    {
      segment: 'Multi-channel operator across owned and marketplace channels',
      description:
        'You sell through your own store and on one or more marketplaces simultaneously. You need consolidated reporting across all channels in a single P&L, plus a channel-by-channel breakdown showing which channel is actually profitable after all costs — not just which one has the highest gross revenue.',
    },
    {
      segment: 'Growing brand expanding into GCC markets',
      description:
        'You are selling beyond the UAE — into Saudi Arabia, Bahrain, Oman, Kuwait, or Qatar. Your growth is real, but your cross-border VAT obligations may have arrived before you noticed. Each GCC country has its own VAT registration threshold and filing requirements — completely separate from your UAE VAT position.',
    },
    {
      segment: 'Early-stage seller approaching the VAT threshold',
      description:
        'Your online store is growing fast and you are approaching or have crossed AED 375,000 in annual taxable sales. You need VAT registration completed correctly, your Shopify or marketplace integration set up for VAT from day one, and quarterly returns filed before every FTA deadline — without disrupting your operations.',
    },
  ],
  challengesEyebrow: 'Why e-commerce is different',
  challengesHeading: 'The five accounting challenges every UAE e-commerce business faces',
  challenges: [
    {
      heading: 'Multi-channel reconciliation — every platform settles differently',
      body: 'This is the most operationally complex element of e-commerce accounting — and the one most general accountants get wrong. Finanshels connects directly to your platforms through native integrations or certified connectors to Xero and Zoho Books, so every transaction is captured at source, not entered manually from a monthly summary. What is reflected in your books is what actually happened, at the transaction level that makes reconciliation possible.',
      points: [
        'Shopify — pays out every two to three business days net of processing fees; refunds, returns, gift cards, and discount codes each need separate treatment and matching to bank deposits',
        'Noon UAE — settles monthly with gross sales, commissions, and refunds consolidated; the settlement must be reconciled against actual orders to catch over-deducted commissions or missing orders',
        'Amazon.ae — referral, FBA fulfilment, storage, and advertising fees are separate line items, each booked as cost of sale or operating expense by nature; treating them as one cost overstates gross margin',
        'Cash on Delivery — batches settle slowly; rejected orders were counted in gross sales but never converted to cash, so each batch must be matched to orders, booked in the correct period, and reconciled against rejections',
      ],
    },
    {
      heading: 'COGS — the number that makes or breaks your margin',
      body: 'Your gross margin is only as accurate as your cost of goods sold calculation, and COGS in e-commerce is not simple: the cost of goods must be recognised when goods are sold, not when they are purchased or invoiced. Buy 1,000 units in January, receive the invoice in February, sell 600 across March and April — your COGS should reflect the 600 units sold, not all 1,000. A business targeting 30% gross margin on cash-basis COGS may report anywhere from 15% to 45% in individual months purely on purchase timing. Finanshels configures inventory accounting from the start so your margin reflects what you actually made.',
      points: [
        'FIFO (First In, First Out) — goods are assumed to sell in the order purchased, with earlier costs recognised first',
        'Weighted Average Cost — all inventory costs are averaged across units held, with each sale recognised at that average cost',
        'The right method depends on your product category, supplier pricing patterns, and accounting software — configured for you, not applied generically',
      ],
    },
    {
      heading: 'VAT — the rules most UAE e-commerce accountants get wrong',
      body: 'E-commerce VAT in the UAE has several specific provisions that trip up non-specialist accountants. Finanshels tags every transaction to the correct VAT treatment at the point of recording.',
      points: [
        'Domestic sales — standard-rated at 5%, with input VAT recoverable on related costs',
        'Export sales — zero-rated at 0%, but only with valid FTA proof of export (airway bills, customs declarations, delivery evidence); without it the FTA can reclassify the sale as standard-rated plus penalties',
        'Imported goods — customs duty and import VAT at the port of entry; import VAT is recoverable but must be tracked separately from supplier-invoice VAT',
        'Overseas platform fees and digital services — Amazon, Noon (depending on entity), Meta, Google, TikTok, and SaaS tools are subject to reverse charge VAT; net cash is often zero but the reporting obligation exists regardless',
      ],
    },
    {
      heading: 'Cross-border VAT — the GCC obligation most growing brands miss',
      body: 'UAE VAT and GCC country VAT are entirely separate obligations. A UAE brand whose sales into any GCC country exceed that country’s threshold must register there, charge that country’s VAT rate, and file with that country’s tax authority — independent of UAE VAT. The consequences of missing a GCC registration mirror missing a UAE one: penalties, retrospective liability, and disruption to marketplace operations. Finanshels monitors cross-border volumes, flags approaching thresholds, and manages GCC registrations and filings.',
      points: [
        'Saudi Arabia (KSA) — 15% VAT, registration threshold SAR 375,000 in annual sales to Saudi customers',
        'Bahrain, Oman, Kuwait, Qatar — each with its own VAT framework, thresholds, and filing requirements, separate from the UAE and from each other',
      ],
    },
    {
      heading: 'Corporate Tax — e-commerce specific positions',
      body: 'E-commerce businesses have CT-specific questions that require careful structuring from the start. Finanshels assesses each at onboarding and books the underlying transactions so the position is defensible at filing.',
      points: [
        'Free zone QFZP eligibility — free zone e-commerce entities may qualify for the 0% rate on qualifying income, but eligibility is not automatic and depends on goods, customer base, mainland fulfilment, and substance',
        'COGS deductibility — COGS is deductible in the period the related revenue is recognised, making inventory-based accounting a CT compliance issue, not just margin accuracy',
        'Platform fee deductions — Amazon, Noon, and marketplace fees are deductible but must be correctly classified to support the deduction',
        'Advertising spend — Meta, Google, and TikTok spend is CT-deductible and also carries reverse charge VAT, so the two must be handled consistently',
      ],
    },
  ],
  valueProps: [
    'Built for e-commerce, not adapted from a commercial template — chart of accounts, platform integrations, COGS method, and channel reporting configured for e-commerce from day one.',
    'Transaction-level reconciliation, not monthly summary entries — every settlement reconciled to actual orders, every fee booked by category, every COD batch matched to the orders it covers.',
    'COGS that reflects what you actually sold — inventory-based FIFO or Weighted Average Cost, recognised in the period goods are sold.',
    'VAT handled at every level — domestic, export with proof tracking, reverse charge on overseas fees, and cross-border GCC monitoring and registration.',
    'Cross-border GCC expansion without compliance blind spots — sales volumes monitored per country and thresholds flagged before you cross them.',
    'Monthly channel P&L you can make decisions from — consolidated and channel-by-channel performance, delivered by the 10th of every month.',
  ],
  solutions: [
    'Multi-channel platform reconciliation — direct connections or certified connectors to Shopify, Noon, Amazon.ae, WooCommerce, Magento, and major gateways; every transaction captured at source, settlements reconciled to orders, fees booked by category, and COD rejection rates tracked as a management metric.',
    'Inventory accounting and COGS management — FIFO or Weighted Average Cost configured for your product mix, inventory updated with every sale, and monthly gross margin by channel, category, and SKU where required.',
    'Channel-by-channel P&L reporting — a monthly management pack with consolidated and per-channel P&L (gross revenue, fees, refunds, COGS, fulfilment, net margin), delivered by the 10th.',
    'UAE VAT management and quarterly filing — every transaction tagged to the correct treatment, exports zero-rated with proof, reverse charge applied, import VAT reconciled, and returns filed before every FTA deadline.',
    'Cross-border GCC VAT monitoring and registration — volumes to KSA, Bahrain, Oman, Kuwait, and Qatar monitored, thresholds flagged in advance, registrations handled, and returns filed per jurisdiction.',
    'Corporate Tax registration and annual filing — CT registration, QFZP assessment for free zone entities, and an annual return prepared from reconciled management accounts with all allowable deductions applied.',
    'Cash flow visibility for e-commerce — a monthly cash flow statement and, on FCaaS, a rolling forecast that shows where the cash position is heading through settlement delays, COD float, and seasonal stock builds.',
  ],
  workflow: [
    'Day 1 — E-commerce onboarding: we review your platforms, current accounting setup, and VAT status, confirm the correct VAT treatment for each revenue stream, identify cross-border exposure, and assess QFZP eligibility for free zone entities.',
    'Days 2–5 — Platform integrations and chart of accounts setup: your platforms are connected via direct integrations or certified connectors, and your chart of accounts is built for e-commerce — channel revenue, platform fee categories, COGS by product line, and inventory accounts — with VAT rules configured at category level.',
    'Days 6–28 — First month of e-commerce bookkeeping: every transaction captured from platform data (not bank statements), settlements reconciled to orders, fees booked by category, COGS matched to sales, and COD batches reconciled to specific orders.',
    'Day 30 — First month-end close: books closed; consolidated P&L, channel-level P&L, inventory position, and VAT position delivered with plain-English commentary — your real margin, by channel, for the first time.',
    'Ongoing — quarterly VAT, annual CT, GCC monitoring: VAT filed quarterly, CT filed annually, and cross-border volumes monitored with GCC thresholds flagged as you grow. One team, one fixed fee.',
  ],
  deliverables: [
    'Monthly consolidated P&L plus channel-level P&L for each platform.',
    'Gross margin by channel, product category, and SKU where required.',
    'Reconciled inventory position and inventory-based COGS.',
    'UAE VAT position with reverse charge and proof-of-export tracking.',
    'Cross-border GCC sales monitoring and a monthly cash flow statement.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 800/month',
      bestFor: 'Single-channel D2C or early marketplace sellers · up to 200 orders/month',
      includes: [
        'Single-channel platform reconciliation (Shopify, Noon, or Amazon.ae)',
        'Inventory-based COGS with FIFO or Weighted Average Cost',
        'Monthly channel P&L and balance sheet',
        'UAE VAT treatment applied at transaction level',
        'Corporate Tax registration and annual filing',
        'Dedicated accountant',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 999/month',
      highlighted: true,
      bestFor: 'Multi-channel sellers across owned and marketplace channels · up to 500 orders/month',
      includes: [
        'Everything in Essential, plus:',
        'Multi-channel reconciliation across all platforms and gateways',
        'Consolidated and channel-by-channel P&L by the 10th',
        'Quarterly VAT returns with reverse charge and export proof tracking',
        'COD batch reconciliation and rejection-rate reporting',
        'WPS payroll management',
      ],
    },
    {
      name: 'Scale plan',
      price: 'AED 1,999/month',
      bestFor: 'High-volume or GCC-expanding brands · up to 1,000 orders/month',
      includes: [
        'Everything in Growth, plus:',
        'Cross-border GCC VAT monitoring and registration support',
        'SKU-level margin reporting',
        'Senior accountant oversight',
        'Rolling cash flow forecast (FCaaS)',
        'QFZP assessment and documentation for free zone entities',
      ],
    },
  ],
  pricingAddOns: [
    { name: 'VAT Registration', price: 'AED 499' },
    { name: 'GCC VAT Registration (per jurisdiction)', price: 'on assessment' },
    { name: 'CT Registration', price: 'AED 499' },
    { name: 'Books Health Check', price: 'AED 299–500' },
    { name: 'Books Cleanup', price: 'from AED 1,500' },
  ],
  pricingNote:
    'E-commerce accounting from AED 800/month — platform integrations and inventory accounting included from day one.',
  faqs: [
    {
      question: "Do I need to register for UAE VAT if I'm only selling online?",
      answer:
        'Yes — if your total taxable sales to UAE customers exceed AED 375,000 in any 12-month period, VAT registration is mandatory regardless of whether you sell online, in-store, or both. Most fast-growing UAE e-commerce businesses cross this threshold within 12 to 18 months of launch. The obligation starts from the day you cross the threshold — not from when you apply for registration. Finanshels monitors your taxable sales throughout the year and triggers registration at the right time.',
    },
    {
      question: "Why doesn't my Shopify or Noon revenue match my bank balance?",
      answer:
        'Because platforms don’t pay you your gross sales. They pay you your gross sales minus their fees, minus refunds, minus any holding for disputed orders — and they do it on their own settlement schedule, not yours. Shopify pays every two to three business days net of processing fees. Noon settles monthly with commission and refund deductions. COD payments settle by batch after delivery confirmation. Your bank receives what the platform paid, not what customers ordered. Reconciling these correctly — settlement by settlement, at transaction level — is the only way to produce a P&L that reflects what your business actually made.',
    },
    {
      question: 'What is the correct way to account for COGS in an e-commerce business?',
      answer:
        'COGS should be recognised in the accounting period when goods are sold — not when they are purchased or when the supplier invoice is received. This requires inventory-based accounting: tracking the quantity and unit cost of every SKU held, and matching the cost of each unit sold to the revenue from that sale in the same period. The two standard inventory accounting methods are FIFO (First In, First Out) and Weighted Average Cost. Finanshels configures your inventory accounting from onboarding — so your gross margin reflects what you actually made on the goods you sold, not a distortion created by purchase timing.',
    },
    {
      question: 'What is reverse charge VAT and does it apply to my platform fees?',
      answer:
        'Reverse charge VAT applies when a UAE-registered business receives a service from an overseas supplier. Under reverse charge, you account for both the output VAT (as if you were the supplier) and the input VAT (which you can recover) on the same transaction. For e-commerce businesses, this typically applies to Amazon seller fees, Noon commissions where charged by a non-UAE entity, and advertising spend on Meta, Google, TikTok, and other overseas platforms. The net cash position is usually zero — but the obligation to report exists regardless. Missing reverse charge is one of the most commonly identified errors in UAE e-commerce VAT audits.',
    },
    {
      question: "I'm selling into Saudi Arabia. Do I need to register for Saudi VAT separately?",
      answer:
        'Yes — if your sales to Saudi customers exceed SAR 375,000 in any 12-month period, you are required to register for KSA VAT separately from your UAE VAT registration. KSA VAT is 15% (higher than the UAE’s 5%) and has its own filing requirements. This obligation is entirely independent of your UAE registration and is commonly missed by UAE brands that are scaling internationally. Finanshels monitors your GCC sales volumes and flags KSA and other GCC VAT thresholds before you cross them.',
    },
    {
      question: "Can I use Shopify's built-in analytics as my accounting?",
      answer:
        'Shopify’s analytics are useful for sales reporting, but they are not accounting records. They do not distinguish between gross sales and net settlement values, they do not capture platform fees and refunds in a format your accountant or the FTA can use, they do not produce a P&L or Balance Sheet, they do not handle VAT treatment, and they do not support Corporate Tax filing. Finanshels integrates Shopify data into your accounting system — mapping every transaction type (sales, refunds, discounts, fees, shipping) to the correct account code and VAT treatment — so your books reflect your actual business performance.',
    },
    {
      question: 'How does COD accounting work and why does the rejection rate matter?',
      answer:
        'Cash on delivery orders are fulfilled, counted in gross sales, and then delivered for payment collection. If the customer refuses delivery — the order is rejected — the goods come back, the sale is reversed, and the cash is never received. COD rejection rates in UAE e-commerce range from 5% to 25% depending on product category, price point, and delivery area. Each rejected order reduces your real revenue, reverses your COGS recognition, and adjusts your VAT position. For businesses with high COD volumes, the rejection rate is one of the most important financial metrics — and it only appears correctly in your books when COD batches are reconciled at order level, not averaged.',
    },
    {
      question: 'Is a free zone e-commerce business eligible for 0% Corporate Tax?',
      answer:
        'Possibly — but it is not automatic and requires careful assessment. Free zone e-commerce entities may qualify as Qualifying Free Zone Persons (QFZP) and apply a 0% CT rate to qualifying income. Eligibility depends on several factors: the nature of the goods sold, whether sales are made to UAE customers or overseas customers, whether any mainland operations or fulfilment are involved, and whether the free zone entity maintains adequate substance. Finanshels conducts a QFZP assessment for every free zone e-commerce client at onboarding and maintains the documentation required to support the position at filing.',
    },
    {
      question: 'How long does it take to set up e-commerce accounting with Finanshels?',
      answer:
        'Most e-commerce clients are connected, configured, and operating on their first monthly close within two weeks of onboarding. Day one, we confirm your platform structure and VAT position. Days two to five, we connect your platforms, build your chart of accounts for e-commerce, and configure your inventory accounting method. From day six, your transactions are being captured and classified. Your first full month-end close — with channel P&L, consolidated P&L, and VAT position — is delivered by the 10th of the following month.',
    },
  ],
}
