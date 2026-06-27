import type { ServicePage } from '../service-pages'

// Fresh copy — no source deck exists for this sector. UAE F&B accounting detail
// is written to be accurate and conservative; no client testimonials are claimed.
export const restaurant: ServicePage = {
  title: 'Restaurant & F&B Accounting',
  subtitle:
    'Restaurant and F&B accounting in the UAE — every cover, every aggregator, every dirham of food cost accounted for.',
  description:
    'Your POS shows sales. Talabat and Deliveroo pay you net of commission. Your suppliers invoice on terms, your stock walks out the back door, and your wage bill lands every month regardless of how busy you were. Finanshels builds restaurant accounting around the numbers that actually decide whether a venue makes money — food cost percentage, prime cost, and outlet-level P&L — with every revenue channel reconciled and every supplier cost in the right period.',
  stats: [
    { label: 'UAE businesses', value: '7,000+' },
    { label: 'Trustpilot rating', value: '4.9' },
    { label: 'Starting from', value: 'AED 899/mo' },
  ],
  problems: [
    'Your POS, your aggregator settlements, and your bank balance never agree — because Talabat, Deliveroo, Careem, and Noon Food each pay you net of commission on their own schedule.',
    'Food cost and beverage cost percentages are guessed at month-end instead of tracked against recipes and stock counts, so margin leakage is invisible until it is severe.',
    'Labour is your second-largest cost after food, but without a prime-cost view you cannot see when the two together have crossed the line that kills profitability.',
  ],
  whyNow: [
    'F&B is one of the most cash-intensive, low-margin sectors there is — a few points of unmanaged food cost or shrinkage is the difference between profit and loss.',
    'VAT at 5% applies to F&B sales, and service charge, delivery, and aggregator commissions all need correct treatment before returns are filed.',
    'Corporate Tax applies to F&B operators like any other UAE business — and multi-outlet groups need outlet-level numbers that hold up under a single consolidated return.',
  ],
  whoFor: [
    {
      segment: 'Single-outlet restaurant or café',
      description:
        'You run one venue and need clean monthly accounts that tell you your real food cost percentage, your prime cost, and whether you made money this month — with your POS reconciled to your bank and your aggregator payouts accounted for correctly.',
    },
    {
      segment: 'Multi-outlet or franchise group',
      description:
        'You operate several venues or a franchise and need outlet-level P&L so you can compare performance branch by branch, plus a consolidated view for ownership and for a single Corporate Tax return — without each outlet keeping its own incompatible books.',
    },
    {
      segment: 'Cloud kitchen or delivery-only brand',
      description:
        'You run one or more virtual brands out of a shared or dedicated kitchen, with most or all revenue arriving through Talabat, Deliveroo, Careem, and Noon Food. You need every aggregator settlement reconciled, commissions booked by platform, and margin measured after the 25–35% the platforms take.',
    },
    {
      segment: 'Catering and events business',
      description:
        'You quote jobs, buy against them, and invoice clients on terms. You need job-level costing, revenue recognised in the right period, VAT handled correctly on quotes and deposits, and a clear view of margin per event rather than a blended monthly average.',
    },
    {
      segment: 'New venue in pre-opening or first year',
      description:
        'You are fitting out, hiring, and stocking up before a single cover is served. You need pre-opening costs captured correctly, your POS and accounting integrated from day one, and your VAT and Corporate Tax registrations handled before the first deadline arrives.',
    },
  ],
  challengesEyebrow: 'Why F&B is different',
  challengesHeading: 'What restaurant accounting has to get right',
  challenges: [
    {
      heading: 'Multi-channel revenue — POS, dine-in, and aggregators',
      body: 'A restaurant earns across dine-in, takeaway, delivery, and catering, and each channel settles differently. Aggregators pay you net of a commission that typically runs 25–35%, on their own cycle, with refunds and adjustments folded in. Finanshels integrates your POS and reconciles each aggregator settlement to actual orders, so your reported revenue is gross sales — with commissions booked as a cost line, not silently netted away.',
      points: [
        'POS daily sales (Z-reports) reconciled to cash and card deposits',
        'Talabat, Deliveroo, Careem, and Noon Food settlements reconciled per payout, commissions booked by platform',
        'Service charge, delivery fees, and tips treated correctly and separated from net sales',
        'Refunds, voids, and discounts mapped to the right account and VAT treatment',
      ],
    },
    {
      heading: 'Food cost, beverage cost, and prime cost',
      body: 'The two numbers that decide whether a venue is viable are food cost percentage and prime cost (food plus labour as a share of sales). Neither is reliable without inventory accounting: opening stock plus purchases minus closing stock gives true cost of goods used, not just what was invoiced. Finanshels runs COGS on a stock-count basis so your margin reflects what was actually consumed and sold.',
      points: [
        'Cost of goods recognised from opening stock + purchases − closing stock, not from invoice dates',
        'Food cost % and beverage cost % tracked monthly against target',
        'Prime cost (COGS + labour) reported as the headline viability metric',
        'Wastage, staff meals, and shrinkage made visible instead of buried in COGS',
      ],
    },
    {
      heading: 'VAT and local fees on F&B',
      body: 'F&B sales are standard-rated for VAT at 5%, but the detail matters: service charges, delivery fees, aggregator commissions, and any municipality or tourism fees that apply to your emirate and venue type each need correct treatment before a return is filed. Finanshels confirms your position at onboarding and applies the right treatment at the transaction level.',
      points: [
        'Output VAT at 5% on dine-in, takeaway, and delivery sales',
        'Input VAT recovered correctly on supplier invoices, rent, and overheads',
        'Reverse charge considered on overseas software and marketing services',
        'Municipality and tourism fees handled where they apply to your emirate and licence type',
      ],
    },
    {
      heading: 'Payroll, WPS, and gratuity',
      body: 'F&B is labour-heavy with high turnover, which makes payroll a recurring monthly burden and end-of-service gratuity a liability that quietly accrues. Finanshels runs WPS-compliant payroll, accrues gratuity correctly so it never becomes a year-end surprise, and feeds labour cost straight into the prime-cost view.',
      points: [
        'WPS-compliant monthly payroll across all outlets',
        'End-of-service gratuity accrued in line with UAE labour law',
        'Tips and service-charge distributions recorded transparently',
        'Labour cost reported by outlet and as a share of sales',
      ],
    },
  ],
  valueProps: [
    'Built for F&B, not a generic ledger with restaurant labels — POS and aggregator integrations, stock-based COGS, and prime-cost reporting configured from day one.',
    'Every channel reconciled — dine-in, takeaway, delivery, and catering settled and booked at gross, with commissions visible as a cost.',
    'Food cost and prime cost tracked monthly, so margin leakage shows up while you can still act on it.',
    'Outlet-level P&L for multi-venue operators, rolling up to one consolidated view for ownership and a single CT return.',
    'WPS payroll and gratuity handled in-house, with labour flowing straight into your prime cost.',
    'VAT and Corporate Tax filed on time, with local fees handled correctly for your emirate and licence.',
  ],
  solutions: [
    'POS and aggregator integration — your POS connected and Talabat, Deliveroo, Careem, and Noon Food settlements reconciled to orders every period.',
    'Stock-based COGS and food-cost reporting — opening and closing stock counts feeding a true cost of goods used, with food and beverage cost percentages tracked against target.',
    'Outlet-level and consolidated P&L — monthly management accounts per venue plus a group consolidation for ownership.',
    'WPS payroll and gratuity management — compliant payroll across outlets and correctly accrued end-of-service liabilities.',
    'VAT registration and quarterly filing — correct treatment of service charge, delivery, aggregator commissions, and local fees.',
    'Corporate Tax registration and annual filing — prepared from reconciled accounts, with Small Business Relief assessed where eligible.',
  ],
  workflow: [
    'Day 1 — F&B onboarding: we review your outlets, POS system, aggregator mix, supplier terms, and licence type, and confirm your VAT, CT, and local-fee obligations.',
    'Days 2–5 — Integration and chart of accounts setup: your POS and aggregator data are connected, and your chart of accounts is built for F&B — revenue by channel, COGS by category, labour, and outlet dimensions — with VAT rules set per transaction type.',
    'Days 6–28 — First month of bookkeeping: daily sales reconciled, aggregator settlements matched, supplier invoices captured, stock counts entered, and payroll run.',
    'Day 30 — First month-end close: books closed; outlet-level and consolidated P&L delivered with food cost %, prime cost, and plain-English commentary.',
    'Ongoing — quarterly VAT, monthly payroll, annual CT: returns filed on time, gratuity accrued, and outlet performance tracked month over month. One team, one fixed fee.',
  ],
  deliverables: [
    'Monthly outlet-level and consolidated P&L.',
    'Food cost %, beverage cost %, and prime cost against target.',
    'Reconciled POS and aggregator revenue with commissions booked by platform.',
    'WPS payroll summary and accrued gratuity position.',
    'VAT position and Corporate Tax readiness.',
  ],
  pricingTiers: [
    {
      name: 'Essential plan',
      price: 'AED 899/month',
      bestFor: 'Single-outlet restaurants and cafés · up to 300 transactions/month',
      includes: [
        'POS reconciliation and bank reconciliation',
        'Stock-based COGS with food and beverage cost %',
        'Monthly P&L and balance sheet',
        'Corporate Tax registration and annual filing',
        'Compliance calendar for FTA and licence deadlines',
        'Dedicated accountant',
      ],
    },
    {
      name: 'Growth plan',
      price: 'AED 1,299/month',
      highlighted: true,
      bestFor: 'Delivery-heavy venues and small groups · up to 700 transactions/month',
      includes: [
        'Everything in Essential, plus:',
        'Aggregator settlement reconciliation (Talabat, Deliveroo, Careem, Noon Food)',
        'Quarterly VAT returns',
        'WPS payroll management and gratuity accrual',
        'Prime-cost reporting against target',
      ],
    },
    {
      name: 'Scale plan',
      price: 'AED 2,499/month',
      bestFor: 'Multi-outlet groups and franchises · up to 1,500 transactions/month',
      includes: [
        'Everything in Growth, plus:',
        'Outlet-level and consolidated group P&L',
        'Senior accountant oversight',
        'Job-level catering and events costing',
        'Multi-outlet payroll and inter-outlet reporting',
      ],
    },
  ],
  pricingAddOns: [
    { name: 'VAT Registration', price: 'AED 499' },
    { name: 'CT Registration', price: 'AED 499' },
    { name: 'Books Health Check', price: 'AED 299–500' },
    { name: 'Books Cleanup', price: 'from AED 1,500' },
    { name: 'POS / aggregator integration setup', price: 'on assessment' },
  ],
  pricingNote:
    'Restaurant and F&B accounting from AED 899/month — POS reconciliation and food-cost reporting included.',
  faqs: [
    {
      question: 'How do you account for Talabat, Deliveroo, and Careem revenue?',
      answer:
        'Aggregators pay you your gross order value minus their commission — typically 25–35% — net of refunds and adjustments, on their own settlement schedule. We reconcile each settlement to your actual order data, record your revenue at gross, and book the commission as a separate cost line so your margin reflects the platform’s real cost rather than hiding it inside a lower net-sales figure. This also ensures your VAT is calculated on the correct base.',
    },
    {
      question: 'What is food cost percentage and how do you calculate it?',
      answer:
        'Food cost percentage is the cost of the food you actually used in a period, expressed as a share of your food sales. The reliable way to calculate it is opening stock plus purchases minus closing stock, which gives the true cost of goods consumed rather than just the value of invoices received. We run your COGS on this stock-count basis and report food cost percentage (and beverage cost percentage) against your target every month, so leakage from over-portioning, wastage, or theft becomes visible early.',
    },
    {
      question: 'What is prime cost and why does it matter for a restaurant?',
      answer:
        'Prime cost is your cost of goods sold plus your labour cost, expressed as a percentage of sales. It is the single most important viability metric in F&B because food and labour together are the two largest controllable costs in any venue. A restaurant can have a healthy-looking food cost but still lose money if labour is out of control, and prime cost is the number that catches that. We report prime cost monthly alongside food and beverage cost so you can manage both halves together.',
    },
    {
      question: 'Do I charge VAT on restaurant sales in the UAE?',
      answer:
        'Yes. Food and beverage sales in the UAE are standard-rated for VAT at 5%, whether dine-in, takeaway, or delivery, once you are VAT-registered (mandatory above AED 375,000 in taxable supplies in any 12-month period). Service charges, delivery fees, and aggregator commissions each need correct treatment, and any municipality or tourism fees that apply to your emirate and licence type are handled separately. We confirm your full position at onboarding and apply the right treatment at the transaction level before each return.',
    },
    {
      question: 'Can you produce separate P&L for each of my outlets?',
      answer:
        'Yes. For multi-outlet operators we set up an outlet dimension in your chart of accounts so revenue, COGS, labour, and overheads are tracked per venue. You get an individual P&L for each outlet so you can compare performance branch by branch, plus a consolidated group P&L for ownership and for your single Corporate Tax return. This is far more useful than a blended monthly figure that hides which venues are carrying the group and which are dragging it down.',
    },
    {
      question: 'Do you handle payroll and gratuity for restaurant staff?',
      answer:
        'Yes. We run WPS-compliant monthly payroll across all your outlets and accrue end-of-service gratuity in line with UAE labour law, so the liability is recognised gradually rather than landing as a year-end surprise. We also record tips and service-charge distributions transparently. Because F&B is labour-heavy with high turnover, getting payroll and gratuity right is both a compliance requirement and a meaningful part of your prime cost.',
    },
    {
      question: 'I run a cloud kitchen with no dine-in. Can Finanshels help?',
      answer:
        'Yes — cloud kitchens are a core part of what we do. With most or all revenue arriving through aggregators, the discipline is reconciling every platform settlement to orders, booking commissions by platform, and measuring true margin after the 25–35% the platforms take. We also handle the shared-kitchen cost allocation if you run multiple virtual brands from one site, so each brand has its own P&L and you can see which concepts are actually working.',
    },
    {
      question: 'Does Corporate Tax apply to restaurants in the UAE?',
      answer:
        'Yes. UAE Corporate Tax applies to F&B businesses like any other, at 9% on taxable profit above AED 375,000, with a 0% band below that and Small Business Relief available to eligible businesses below the revenue threshold. We complete your CT registration, assess your eligibility for relief, and prepare your annual return from reconciled management accounts. For multi-outlet groups, we consolidate outlet results into the single return the structure requires.',
    },
  ],
}
