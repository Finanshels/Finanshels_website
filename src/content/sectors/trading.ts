import type { ServicePage } from '../service-pages'

// Fresh copy — no source deck exists for this sector. UAE trading/import-export
// accounting detail is written to be accurate and conservative; no client
// testimonials are claimed.
export const trading: ServicePage = {
  title: 'Trading Business Accounting',
  subtitle:
    'Trading and distribution accounting in the UAE — true landed cost, real margin, and clean customs and VAT.',
  description:
    'A trading business lives and dies on margin per shipment — and that margin is invisible if landed cost is wrong. Freight, insurance, customs duty, and clearing charges all belong in the cost of the goods, not buried in overheads. Finanshels builds trading accounts that capitalise landed cost correctly, recognise COGS when goods are sold, and handle UAE import VAT, customs, and free-zone treatment so you know exactly what each line of stock actually earns.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Starting from', value: 'AED 899/mo' },
  ],
  problems: [
    'Your gross margin looks fine on the invoice but collapses once freight, duty, insurance, and clearing are counted — because landed cost was never built into your inventory value.',
    'Import VAT, customs duty, and reverse charge on overseas services are handled inconsistently, leaving recoverable input VAT on the table and exposure on what was missed.',
    'Receivables stretch, supplier terms tighten, and a profitable-on-paper business runs short of cash because nobody is managing the working-capital cycle.',
  ],
  whyNow: [
    'UAE Corporate Tax makes inventory and COGS accuracy a compliance issue, not just a margin one — landed cost and stock valuation now have to hold up in your return.',
    'Free-zone trading entities need a clear QFZP assessment, because qualifying for the 0% rate on qualifying income is never automatic for distribution activity.',
    'Cross-border and related-party trade raises transfer pricing questions that are far cheaper to structure correctly now than to unwind under review.',
  ],
  whoFor: [
    {
      segment: 'General trading and wholesale company',
      description:
        'You buy and sell across categories, often in volume, on supplier and customer credit terms. You need landed cost built into inventory, COGS recognised when goods sell, and margin reported by product line so you know what is actually carrying the business.',
    },
    {
      segment: 'Importer and distributor',
      description:
        'You import goods into the UAE and distribute to retailers or end customers. Customs duty, import VAT, freight, and clearing all need to land in the right place, and your input VAT recovery on imports needs to be captured in full and reconciled to customs documentation.',
    },
    {
      segment: 'Free-zone trading entity',
      description:
        'You operate from a UAE free zone — possibly a designated zone for VAT — and need both your VAT treatment and your QFZP Corporate Tax position assessed properly. Whether your income qualifies for the 0% rate depends on the nature of your goods, your customers, and your substance, and it is not automatic.',
    },
    {
      segment: 'Re-export and GCC trader',
      description:
        'You bring goods into the UAE and move them on into Saudi Arabia and the wider GCC, or re-export beyond the region. You need correct treatment of designated-zone movements, re-exports, and customs duty refunds, plus visibility on any GCC VAT obligations your volumes trigger.',
    },
    {
      segment: 'Commodities or multi-currency trader',
      description:
        'You buy and sell in multiple currencies and your reported profit is exposed to FX movements between purchase, sale, and settlement. You need foreign-exchange gains and losses recognised correctly and margin reported in a way that separates trading performance from currency swings.',
    },
  ],
  challengesEyebrow: 'Why trading is different',
  challengesHeading: 'What trading accounting has to get right',
  challenges: [
    {
      heading: 'Landed cost — the real cost of your stock',
      body: 'The cost of a traded good is not the supplier invoice — it is the supplier invoice plus freight, insurance, customs duty, and clearing charges, all the way to your warehouse. If those costs sit in overheads instead of in inventory value, your gross margin is overstated and your stock is undervalued. Finanshels capitalises landed cost into each consignment so margin per product line reflects what the goods truly cost to land.',
      points: [
        'Freight, insurance, customs duty, and clearing allocated into inventory value, not expensed to overheads',
        'Landed cost spread across a consignment so per-unit cost is accurate',
        'COGS recognised when goods are sold, not when purchased or invoiced',
        'Margin reported by product line and SKU where required',
      ],
    },
    {
      heading: 'Import VAT, customs duty, and reverse charge',
      body: 'Importing into the UAE creates several tax touch-points that must be tracked separately. Customs duty (commonly 5% on the customs value of most goods) is a real cost; import VAT paid or accounted for at clearance is recoverable as input VAT but must be reconciled to customs documentation; and overseas services such as software, freight forwarding, and agency fees can carry reverse charge. Finanshels captures each correctly so recovery is maximised and nothing is missed.',
      points: [
        'Import VAT accounted for at clearance and reconciled to customs declarations',
        'Customs duty capitalised into landed cost rather than treated as a tax credit',
        'Reverse charge applied to overseas freight, agency, and software services',
        'Designated-zone movements treated under their specific VAT rules',
      ],
    },
    {
      heading: 'Inventory valuation and stock control',
      body: 'A trader’s balance sheet is dominated by inventory, and the valuation method drives both reported margin and Corporate Tax. Finanshels configures FIFO or Weighted Average Cost to suit your goods and supplier pricing, tracks stock movements, and reconciles book inventory to physical counts so shrinkage and obsolescence surface instead of quietly inflating asset values.',
      points: [
        'FIFO or Weighted Average Cost selected for your product mix',
        'Book inventory reconciled to physical stock counts',
        'Slow-moving and obsolete stock identified and provided for',
        'Stock valuation consistent between your accounts and your CT return',
      ],
    },
    {
      heading: 'Working capital, FX, and Corporate Tax',
      body: 'Trading is a working-capital business: cash is tied up in stock and receivables while suppliers want paying. Add multi-currency exposure and a profitable trader can still run short of cash. Finanshels manages the cycle, recognises FX gains and losses correctly, and prepares Corporate Tax from reconciled accounts — including a QFZP assessment for free-zone entities and a view on transfer pricing where related-party trade exists.',
      points: [
        'Receivables, payables, and inventory days tracked to manage the cash cycle',
        'Foreign-exchange gains and losses recognised correctly on purchase, sale, and settlement',
        'QFZP assessment for free-zone trading entities seeking the 0% rate',
        'Transfer pricing considered on related-party and cross-border transactions',
      ],
    },
  ],
  valueProps: [
    'Landed cost done properly — freight, duty, insurance, and clearing capitalised into inventory so margin per line is real.',
    'Import VAT and customs handled at source — recovery maximised, reverse charge applied, and everything reconciled to customs documentation.',
    'Inventory valued consistently — FIFO or Weighted Average Cost, reconciled to physical counts, and aligned to your CT return.',
    'Working capital visible — receivable, payable, and inventory days tracked so a profitable business does not run out of cash.',
    'Free-zone position assessed — a proper QFZP review rather than an assumption about the 0% rate.',
    'Margin by product line, not just a blended total — so you know which categories to push and which to drop.',
  ],
  solutions: [
    'Landed-cost inventory accounting — freight, duty, insurance, and clearing capitalised per consignment, with COGS recognised on sale.',
    'Import VAT and customs reconciliation — clearance VAT reconciled to declarations, duty capitalised, and reverse charge applied to overseas services.',
    'Inventory valuation and stock control — FIFO or Weighted Average Cost, physical count reconciliation, and obsolescence provisioning.',
    'Margin and management reporting — monthly P&L with gross margin by product line and SKU where required.',
    'Working-capital and cash-flow reporting — receivable, payable, and inventory days, plus a rolling cash forecast on FCaaS.',
    'VAT and Corporate Tax — quarterly VAT filing, CT registration and annual return, QFZP assessment, and transfer-pricing support.',
  ],
  workflow: [
    'Day 1 — Trading onboarding: we review your goods, supplier and customer terms, free-zone or mainland structure, import routes, and currencies, and confirm your VAT, customs, and CT position.',
    'Days 2–5 — Chart of accounts and inventory setup: your chart of accounts is built for trading — inventory, landed-cost components, COGS by product line, and FX — and your inventory valuation method is configured.',
    'Days 6–28 — First month of bookkeeping: purchases and landed costs captured per consignment, import VAT reconciled to customs, sales and COGS recorded, and receivables and payables tracked.',
    'Day 30 — First month-end close: books closed; P&L with gross margin by product line, inventory position, and working-capital metrics delivered with plain-English commentary.',
    'Ongoing — quarterly VAT, annual CT, working-capital monitoring: returns filed on time, QFZP position maintained, and cash cycle tracked as volumes grow. One team, one fixed fee.',
  ],
  deliverables: [
    'Monthly P&L with gross margin by product line and SKU where required.',
    'Inventory position at landed cost, reconciled to physical counts.',
    'Import VAT and customs duty reconciliation to clearance documents.',
    'Working-capital metrics — receivable, payable, and inventory days.',
    'VAT position and Corporate Tax readiness, with QFZP status for free-zone entities.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 899/month',
      bestFor: 'Smaller traders and distributors · up to 300 transactions/month',
      includes: [
        'Landed-cost inventory accounting and bank reconciliation',
        'Monthly P&L and balance sheet with gross margin by product line',
        'Import VAT and customs reconciliation',
        'Corporate Tax registration and annual filing',
        'Compliance calendar for FTA and customs deadlines',
        'Dedicated accountant',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 1,299/month',
      highlighted: true,
      bestFor: 'Active importers and wholesalers · up to 700 transactions/month',
      includes: [
        'Everything in Essential, plus:',
        'Quarterly VAT returns with reverse charge and designated-zone treatment',
        'Multi-currency accounting with FX gain/loss recognition',
        'Working-capital reporting (receivable, payable, inventory days)',
        'WPS payroll management',
      ],
    },
    {
      name: 'Scale plan',
      price: 'AED 2,499/month',
      bestFor: 'High-volume and cross-border traders · up to 1,500 transactions/month',
      includes: [
        'Everything in Growth, plus:',
        'SKU-level margin reporting',
        'Senior accountant oversight',
        'QFZP assessment and transfer-pricing support',
        'Rolling cash flow forecast (FCaaS)',
      ],
    },
  ],
  pricingAddOns: [
    { name: 'VAT Registration', price: 'AED 499' },
    { name: 'CT Registration', price: 'AED 499' },
    { name: 'QFZP assessment (free-zone entities)', price: 'on assessment' },
    { name: 'Books Health Check', price: 'AED 299–500' },
    { name: 'Books Cleanup', price: 'from AED 1,500' },
  ],
  pricingNote:
    'Trading and distribution accounting from AED 899/month — landed-cost inventory and import VAT included.',
  faqs: [
    {
      question: 'What is landed cost and why does it matter for a trading business?',
      answer:
        'Landed cost is the total cost of getting goods to your warehouse: the supplier invoice plus freight, insurance, customs duty, and clearing charges. It matters because your real gross margin is the difference between your selling price and your landed cost — not your selling price minus the supplier invoice. If freight and duty sit in overheads instead of inventory, your margin looks better than it is and your stock is undervalued on the balance sheet. We capitalise landed cost into each consignment so margin per product line reflects reality.',
    },
    {
      question: 'How is import VAT handled when I bring goods into the UAE?',
      answer:
        'Import VAT is accounted for at the point of clearance — typically through your VAT return rather than paid in cash, where you are registered — and is recoverable as input VAT provided it is properly reconciled to your customs declarations. Customs duty, commonly 5% of the customs value on most goods, is different: it is a real cost that we capitalise into landed cost rather than treat as a recoverable credit. We track both separately and reconcile import VAT to clearance documentation so your recovery is complete and defensible.',
    },
    {
      question: 'Which inventory valuation method should my trading business use?',
      answer:
        'The two standard methods are FIFO (First In, First Out), where the earliest stock costs are recognised first, and Weighted Average Cost, where all units are valued at a rolling average. The right choice depends on your product category, how stable your supplier pricing is, and your accounting software. We assess this at onboarding and configure it consistently, because the method drives both your reported margin and your Corporate Tax — and it needs to be applied the same way in your accounts and your return.',
    },
    {
      question: 'Is my free-zone trading company eligible for 0% Corporate Tax?',
      answer:
        'Possibly, but it is never automatic. Free-zone entities may qualify as Qualifying Free Zone Persons (QFZP) and apply 0% Corporate Tax to qualifying income, but eligibility for trading and distribution depends on factors including the nature of the goods, whether customers are inside or outside the UAE, whether you operate from a designated zone, and whether the entity maintains adequate substance. We conduct a QFZP assessment at onboarding and maintain the documentation needed to support the position at filing.',
    },
    {
      question: 'Do I need to worry about transfer pricing?',
      answer:
        'If you trade with related parties — a parent, sister company, or commonly owned supplier or customer, especially across borders — then yes. UAE Corporate Tax includes transfer pricing rules requiring related-party transactions to be priced at arm’s length and supported by documentation where thresholds are met. Trading businesses frequently buy from or sell to group entities, so this is a common exposure. We flag related-party transactions, advise on documentation requirements, and structure the treatment correctly in your return.',
    },
    {
      question: 'How do you handle multi-currency purchases and FX gains and losses?',
      answer:
        'When you buy in one currency, sell in another, and settle later, the exchange rate moves at each step, creating foreign-exchange gains and losses that are separate from your trading margin. We record purchases and sales at the correct rates, recognise realised and unrealised FX gains and losses appropriately, and report them separately from gross margin — so you can see your true trading performance distinct from currency movements, which is essential for pricing and decision-making.',
    },
    {
      question: 'Can you help manage my working capital and cash flow?',
      answer:
        'Yes — this is one of the most valuable things we do for traders. Trading ties cash up in inventory and receivables while suppliers expect payment, so a profitable business can still run short of cash. We track your receivable days, payable days, and inventory days each month so you can see where cash is locked up, and on our Financial Controller service we produce a rolling cash flow forecast that shows when working-capital pressure is likely to arrive — before it does.',
    },
    {
      question: 'Does Corporate Tax apply to trading companies in the UAE?',
      answer:
        'Yes. UAE Corporate Tax applies to trading businesses at 9% on taxable profit above AED 375,000, with a 0% band below that and Small Business Relief available to eligible businesses below the revenue threshold; free-zone entities may access the 0% rate on qualifying income via QFZP status. We complete your registration, assess relief or QFZP eligibility, and prepare your annual return from reconciled accounts with inventory valued consistently and landed cost applied correctly.',
    },
  ],
}
