import type { ServicePage } from '../service-pages'

// Fresh copy — no source deck exists for this sector. UAE jewellery / precious-metals
// accounting, the gold & diamond VAT reverse-charge scheme, and DPMS AML obligations
// are written to be accurate and conservative; no client testimonials are claimed.
export const jewellery: ServicePage = {
  title: 'Jewellers & Precious Metals Accounting',
  subtitle:
    'Jewellery and precious-metals accounting in the UAE — gold-price-aware inventory, the right VAT scheme, and AML built in.',
  description:
    'A jewellery business carries enormous value in stock whose price moves every day, sells under a special VAT scheme most accountants have never applied, and operates under AML obligations that carry real penalties. Finanshels builds accounting for jewellers and precious-metals dealers around all three realities at once — gold-price-aware inventory valuation, the gold and diamond reverse-charge VAT mechanism, and DPMS anti-money-laundering compliance — so your books, your tax, and your regulator are all satisfied.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Starting from', value: 'AED 999/mo' },
  ],
  problems: [
    'Your largest asset is stock whose value moves with the daily gold price — and a flat-cost ledger cannot tell you what your inventory is really worth or what your margin truly was.',
    'The UAE gold and diamond reverse-charge VAT scheme is applied wrongly or not at all by general accountants, creating either overcharged customers or unreported tax.',
    'As a dealer in precious metals and stones you are an AML-regulated entity, with goAML registration, KYC, and cash-transaction reporting obligations that carry significant penalties if missed.',
  ],
  whyNow: [
    'Dealers in Precious Metals and Stones are designated AML-regulated businesses in the UAE — registration and reporting are not optional, and enforcement is active.',
    'The gold and diamond VAT reverse-charge mechanism has specific conditions; getting it wrong affects every B2B transaction you make.',
    'Corporate Tax applies to jewellers like any other business, and gold-price-driven inventory valuation must be consistent between your accounts and your return.',
  ],
  whoFor: [
    {
      segment: 'Retail jewellery showroom',
      description:
        'You sell gold, diamond, and gemstone jewellery to consumers, often taking old gold in part-exchange. You need inventory valued in a gold-price-aware way, making charges separated from metal value, and VAT applied correctly on retail sales and buy-backs.',
    },
    {
      segment: 'Gold and bullion trader',
      description:
        'You deal in investment-grade gold and precious metals, frequently business-to-business. The gold and diamond reverse-charge VAT mechanism applies to much of what you do, and your margins are thin enough that valuation accuracy and VAT treatment directly determine profitability.',
    },
    {
      segment: 'Wholesaler and manufacturer',
      description:
        'You supply jewellers, manufacture to order, or hold goods on memo and consignment. You need consignment stock tracked separately from owned stock, making and labour costs captured, and reverse charge applied correctly across your B2B supply chain.',
    },
    {
      segment: 'Diamond and gemstone dealer',
      description:
        'You trade in diamonds and coloured stones where each item is unique and valuation is specialist. You need item-level inventory tracking, correct VAT treatment under the precious-stones provisions, and AML compliance scoped to high-value stone transactions.',
    },
    {
      segment: 'New DMCC or mainland jewellery entity',
      description:
        'You are setting up in DMCC, the Gold Souk, or on the mainland and need your accounting, VAT scheme, Corporate Tax, and AML registration all configured correctly from day one — before your first reportable transaction.',
    },
  ],
  challengesEyebrow: 'Why precious metals is different',
  challengesHeading: 'What jewellery accounting has to get right',
  challenges: [
    {
      heading: 'Gold-price-aware inventory valuation',
      body: 'Most of a jeweller’s balance sheet is metal and stones whose market value changes daily, and the price a customer pays is metal value (by weight and purity, at the day’s rate) plus making charges. Treating stock at a single flat cost hides both what your inventory is really worth and what your true margin was on each sale. Finanshels values inventory in a way that reflects metal weight, purity, and making charges separately, so margin and stock value are both meaningful.',
      points: [
        'Metal value tracked by weight and purity, separate from making charges',
        'Making, labour, and design charges captured as their own margin component',
        'Inventory valuation method (FIFO or Weighted Average) applied consistently',
        'Old-gold buy-backs and part-exchanges accounted for correctly against new sales',
      ],
    },
    {
      heading: 'The gold and diamond VAT reverse-charge mechanism',
      body: 'The UAE applies a special reverse-charge mechanism to supplies of gold, diamonds, and related products between VAT-registered businesses: the supplier does not charge VAT, and the registered recipient accounts for both the output and input VAT on its own return. Retail sales to consumers are treated differently. Applying the wrong treatment is one of the most common — and most expensive — errors in the sector. Finanshels confirms which of your transactions qualify and applies the correct treatment at the transaction level.',
      points: [
        'Reverse charge applied on qualifying B2B supplies of gold and diamonds to VAT-registered recipients',
        'Standard 5% VAT applied correctly on retail and non-qualifying sales',
        'Making charges treated under the correct VAT rule rather than swept in with metal',
        'Declarations and recipient eligibility documented to support the treatment',
      ],
    },
    {
      heading: 'AML compliance for dealers in precious metals and stones',
      body: 'Dealers in Precious Metals and Stones (DPMS) are designated non-financial businesses under UAE AML law, with mandatory obligations that sit alongside accounting and tax. Finanshels works alongside your AML function so financial records, cash thresholds, and reporting are aligned and audit-ready, and coordinates with specialist AML support where deeper goAML work is required.',
      points: [
        'goAML registration and ongoing reporting obligations supported',
        'Cash transactions at or above the AED 55,000 reporting threshold flagged and recorded',
        'KYC and customer due-diligence records kept consistent with financial records',
        'Books maintained to a standard that supports AML and regulatory inspection',
      ],
    },
    {
      heading: 'Consignment stock, memo, and Corporate Tax',
      body: 'Jewellers routinely hold goods on memo or consignment that are not yet owned, and mixing those with owned stock distorts both the balance sheet and margin. Finanshels separates consignment from owned inventory, recognises sales correctly, and prepares Corporate Tax from reconciled accounts with inventory valued consistently.',
      points: [
        'Consignment and memo stock tracked separately from owned inventory',
        'Revenue recognised when a sale actually occurs, not when goods are received on memo',
        'Inventory valuation aligned between accounts and the Corporate Tax return',
        'Small Business Relief or free-zone QFZP position assessed where eligible',
      ],
    },
  ],
  valueProps: [
    'Gold-price-aware inventory — metal value, purity, and making charges tracked separately so stock value and margin are both real.',
    'The right VAT scheme, applied correctly — reverse charge on qualifying gold and diamond B2B supplies, standard VAT on retail, never confused.',
    'AML-aware accounting — financial records, cash thresholds, and KYC kept consistent and inspection-ready for a DPMS-regulated business.',
    'Consignment and memo stock kept separate from owned stock, so your balance sheet tells the truth.',
    'Old-gold buy-backs and part-exchanges accounted for correctly against new sales.',
    'Corporate Tax prepared from reconciled accounts with consistent inventory valuation.',
  ],
  solutions: [
    'Gold-price-aware inventory accounting — metal value by weight and purity, making charges separated, and a consistent valuation method.',
    'VAT scheme management — reverse charge on qualifying gold and diamond supplies, standard VAT on retail, with documented recipient eligibility.',
    'AML-aligned bookkeeping — cash-threshold flagging, KYC-consistent records, and coordination with specialist goAML support.',
    'Consignment and memo stock control — owned versus consignment inventory tracked separately with correct revenue recognition.',
    'Margin and management reporting — monthly P&L separating metal margin from making-charge margin.',
    'Corporate Tax registration and annual filing — prepared from reconciled accounts, with relief or QFZP assessed.',
  ],
  workflow: [
    'Day 1 — Jewellery onboarding: we review your stock profile (gold, diamonds, stones), your B2B versus retail mix, your DMCC or mainland structure, and your AML registration status, and confirm your VAT scheme and CT position.',
    'Days 2–5 — Chart of accounts and inventory setup: your chart of accounts is built for jewellery — metal value, making charges, consignment stock, and buy-backs — and reverse-charge VAT rules are configured for qualifying transactions.',
    'Days 6–28 — First month of bookkeeping: sales and purchases recorded with correct VAT treatment, metal value separated from making charges, old-gold exchanges accounted for, and cash transactions monitored against the reporting threshold.',
    'Day 30 — First month-end close: books closed; P&L separating metal and making-charge margin, inventory position, and VAT position delivered with plain-English commentary.',
    'Ongoing — quarterly VAT, annual CT, AML alignment: returns filed on time, inventory valuation kept consistent, and records maintained to AML inspection standard. One team, one fixed fee.',
  ],
  deliverables: [
    'Monthly P&L separating metal margin from making-charge margin.',
    'Gold-price-aware inventory position, owned and consignment shown separately.',
    'VAT position with reverse charge and retail sales correctly split.',
    'Cash-transaction log against the AML reporting threshold.',
    'Corporate Tax readiness with consistent inventory valuation.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 999/month',
      bestFor: 'Single-showroom retailers · up to 300 transactions/month',
      includes: [
        'Gold-price-aware inventory accounting and bank reconciliation',
        'Metal value and making charges tracked separately',
        'Monthly P&L and balance sheet',
        'Corporate Tax registration and annual filing',
        'Compliance calendar for FTA and AML deadlines',
        'Dedicated accountant',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 1,499/month',
      highlighted: true,
      bestFor: 'B2B traders and wholesalers · up to 700 transactions/month',
      includes: [
        'Everything in Essential, plus:',
        'Gold and diamond reverse-charge VAT management and quarterly filing',
        'Consignment and memo stock tracking',
        'Cash-threshold flagging aligned to AML reporting',
        'WPS payroll management',
      ],
    },
    {
      name: 'Scale plan',
      price: 'AED 2,999/month',
      bestFor: 'Multi-location and high-value dealers · up to 1,500 transactions/month',
      includes: [
        'Everything in Growth, plus:',
        'Item-level inventory for diamonds and gemstones',
        'Senior accountant oversight',
        'QFZP assessment for free-zone entities',
        'Coordination with specialist goAML / AML support',
      ],
    },
  ],
  pricingAddOns: [
    { name: 'VAT Registration', price: 'AED 499' },
    { name: 'CT Registration', price: 'AED 499' },
    { name: 'goAML registration support', price: 'on assessment' },
    { name: 'Books Health Check', price: 'AED 299–500' },
    { name: 'Books Cleanup', price: 'from AED 1,500' },
  ],
  pricingNote:
    'Jewellery and precious-metals accounting from AED 999/month — gold-aware inventory, the correct VAT scheme, and AML alignment included.',
  faqs: [
    {
      question: 'How do you value jewellery inventory when the gold price changes daily?',
      answer:
        'A jeweller’s selling price is metal value — weight and purity at the day’s gold rate — plus making charges, so a single flat cost per item tells you neither what your stock is worth nor what your real margin was. We track metal value by weight and purity separately from making and design charges, apply a consistent inventory valuation method (FIFO or Weighted Average Cost), and account for old-gold buy-backs against new sales. The result is an inventory value that reflects the real metal content and a margin you can actually rely on.',
    },
    {
      question: 'What is the gold and diamond VAT reverse-charge mechanism?',
      answer:
        'The UAE applies a special reverse-charge mechanism to supplies of gold, diamonds, and related products between VAT-registered businesses. Under it, the supplier does not charge VAT on the supply; instead the registered recipient accounts for both the output VAT and the recoverable input VAT on its own return, so the net cash effect is usually nil but the reporting is mandatory. Retail sales to consumers fall outside this mechanism and are treated under standard VAT rules. We confirm which of your transactions qualify, check recipient eligibility, and apply the correct treatment to each — because getting this wrong is one of the most expensive errors in the sector.',
    },
    {
      question: 'Do jewellers in the UAE have AML obligations?',
      answer:
        'Yes. Dealers in Precious Metals and Stones (DPMS) are designated non-financial businesses under UAE anti-money-laundering law, with mandatory obligations including registration on the goAML platform, customer due diligence (KYC), and reporting of cash transactions at or above the AED 55,000 reporting threshold, alongside suspicious-transaction reporting. Enforcement is active and penalties are significant. We keep your financial records, cash thresholds, and KYC consistent and inspection-ready, and coordinate with specialist AML support where deeper goAML work is required.',
    },
    {
      question: 'How do you account for old gold taken in part-exchange?',
      answer:
        'Old-gold buy-backs are common in retail jewellery and need careful treatment: the trade-in reduces the cash the customer pays on a new piece, but the old gold enters your inventory at its metal value and the new sale must still be recorded at its full value for both margin and VAT purposes. We account for the buy-back and the new sale separately so your revenue, your inventory, and your VAT are all correct — rather than netting the two into a single figure that distorts all three.',
    },
    {
      question: 'How is consignment or memo stock handled in the accounts?',
      answer:
        'Goods held on memo or consignment are not yet owned by you, so they should not sit on your balance sheet as owned inventory, and no sale should be recognised until the item is actually sold. Mixing consignment with owned stock overstates both your assets and your apparent activity. We track consignment and memo stock separately from owned inventory, recognise revenue only when a genuine sale occurs, and reconcile what is held against supplier records — keeping your balance sheet honest and your supplier relationships clean.',
    },
    {
      question: 'Does Corporate Tax apply to my jewellery business?',
      answer:
        'Yes. UAE Corporate Tax applies to jewellers and precious-metals dealers at 9% on taxable profit above AED 375,000, with a 0% band below that and Small Business Relief available to eligible businesses below the revenue threshold; free-zone entities such as those in DMCC may access the 0% rate on qualifying income via QFZP status. Because inventory valuation has such a large effect on a jeweller’s profit, we ensure your stock is valued consistently between your accounts and your CT return, and we assess relief or QFZP eligibility at onboarding.',
    },
    {
      question: 'Can you work with diamond and gemstone dealers, not just gold?',
      answer:
        'Yes. Diamonds and coloured stones bring their own challenges: each item can be unique, valuation is specialist, and the VAT treatment under the precious-stones provisions differs from standard retail. We support item-level inventory tracking for high-value unique pieces, apply the correct VAT treatment to qualifying stone transactions, and scope AML compliance to the high-value transactions that matter most — so the accounting fits how a stone business actually operates rather than forcing it into a gold-retail template.',
    },
  ],
}
