export interface LeadershipMember {
  name: string
  role: string
  image: string
  bio: string
  linkedin?: string
}

export interface Testimonial {
  name: string
  role: string
  quote: string
  rating: number
}

export interface CompanyValue {
  icon: string
  title: string
  description: string
}

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    name: 'Muhammed Shafeekh',
    role: 'Co-Founder & CEO',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Shafeekh&backgroundColor=6366f1',
    bio: 'CEO running and scaling the company to new heights.',
    linkedin: 'https://www.linkedin.com/in/shafeeqmohd/',
  },
  {
    name: 'Muhammed Musthafa',
    role: 'Co-Founder',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=MusthafahMale&backgroundColor=8b5cf6',
    bio: 'Running operational excellence across finance, HR, legal, and operations.',
    linkedin: 'https://www.linkedin.com/in/muhammed-musthafa-vk/',
  },
  {
    name: 'Meet Patel',
    role: 'Centre Of Excellence',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=MaleStylishBoss&backgroundColor=ec4899',
    bio: 'Driving Strategy, business and innovations',
    linkedin: 'https://www.linkedin.com/in/themeetpatel/',
  },
  {
    name: 'Rahul Kohli',
    role: 'Head of Marketing',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=RahulKohli&backgroundColor=06b6d4',
    bio: 'Building brand presence and scaling growth-driven marketing strategies.',
    linkedin: 'https://www.linkedin.com/in/kohlirahul/',
  },
  {
    name: 'Ashish Tripathi',
    role: 'Head of Product & Monetization',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=AshishTripathi&backgroundColor=10b981',
    bio: 'Building the product and pricing that turn finance operations into a platform clients rely on.',
    linkedin: 'https://www.linkedin.com/in/ashishtripathi-at/',
  },
  {
    name: 'Santo Thomas',
    role: 'AM - Org Excellence',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=SantoThomasMale&backgroundColor=0ea5e9',
    bio: 'Driving organisational excellence — the systems, rituals, and standards that keep every team performing at its best.',
    linkedin: 'https://www.linkedin.com/in/santo-thomas-991287236/',
  },
  {
    name: 'Suhail KY',
    role: 'Head of Operations',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=SuhailKYMale&backgroundColor=eab308',
    bio: 'Keeping delivery sharp across every market — process, quality, and on-time compliance for each client.',
    linkedin: 'https://www.linkedin.com/in/suhail-k-y-cma%C2%AE-011264181/',
  },
  {
    name: 'Vishal Singh',
    role: 'Partnership Lead',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=VishalSinghMale&backgroundColor=f43f5e',
    bio: 'Building the alliances and ecosystem partnerships that open new markets for Finanshels.',
    linkedin: 'https://www.linkedin.com/in/vishalsingh2302/',
  },
  {
    name: 'Ashish Yadav',
    role: 'Sales Lead',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=AshishYadav&backgroundColor=f97316',
    bio: 'Leading revenue growth and building lasting client relationships.',
    linkedin: 'https://www.linkedin.com/in/ashish-yadav-00370618a/',
  },
  {
    name: 'Jaydeep Khamkar',
    role: 'VP - Operations',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=JaydeepKhamkar&backgroundColor=14b8a6',
    bio: 'Optimizing processes and scaling operations for rapid growth.',
    linkedin: 'https://www.linkedin.com/in/jaydeep-khamkar-538ab415/',
  },
  {
    name: 'Jasmeet Monga',
    role: 'Account Manager - Finance',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=JasmeetMongaMale&backgroundColor=f59e0b',
    bio: 'Leading finance operations and client relationships across UAE markets.',
    linkedin: 'https://www.linkedin.com/in/jasmeet-monga-acca-98a39254/',
  },
  {
    name: 'Divya Mangtani',
    role: 'HR - Business Partner',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Divya&backgroundColor=a855f7',
    bio: 'Partnering with teams on hiring, growth, and the people experience that keeps Finanshels a place builders love.',
    linkedin: 'https://www.linkedin.com/in/divya-mangtani-1470271b5/',
  },
  {
    name: 'Manali Kulkarni',
    role: 'Brand & Community Manager',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=ManaliKulkarni&backgroundColor=d946ef',
    bio: 'Growing the Finanshels brand and community — the stories, events, and voice that bring our people and clients together.',
    linkedin: 'https://www.linkedin.com/in/manali-kulkarni-353ba2b1/',
  },
  {
    name: 'Emil Rizwan',
    role: 'Customer Success Manager',
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emil&backgroundColor=3b82f6',
    bio: 'Making sure every client gets more than they expected — onboarding, adoption, and outcomes that keep them growing with us.',
    linkedin: 'https://www.linkedin.com/in/emilrizwan16/',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya M Nair',
    role: 'Founder, ZWAG AI',
    quote:
      'Finanshels team is very professional. They have been handling ZWAG AI\'s accounts since 2022. From bookkeeping to Auditing and Corporate Tax filings, they made it simple and hassle free for me. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Nassib Sawaya',
    role: 'Director, UAE Business',
    quote:
      'We are genuinely happy with the way Finanshels have been handling our accounts. From day one the team has been genuinely proactive and professional. They are always available to answer our questions. They have done a great job filing our Corporate Taxes and keeping our books sound.',
    rating: 5,
  },
  {
    name: 'Elie Ronin',
    role: 'Co-Founder, Scaling Startup',
    quote:
      "Working with Finanshels has been one of the best decisions we've made as a company. They've helped us streamline our entire backend from bookkeeping and tax filings to CFO-level reporting. The level of clarity and peace of mind they bring is unmatched.",
    rating: 5,
  },
  {
    name: 'Rohan Mehta',
    role: 'Managing Partner, Premier Realty Brokers',
    quote:
      'Finanshels got us live on goAML in 4 days. We passed our MOE inspection without a single observation. Worth every dirham.',
    rating: 5,
  },
  {
    name: 'Ranya Al Suwaidi',
    role: 'Founder, Bloom Cafe UAE',
    quote:
      'Finanshels turned our messy books into a CFO-grade finance function in a week. VAT, audit prep, and board decks now run like clockwork while I stay focused on new stores.',
    rating: 5,
  },
  {
    name: 'Sami Khan',
    role: 'CEO, desertcart.ae',
    quote:
      'Having controllers, tax leads, and a fractional CFO in one WhatsApp group changed how we operate. Collections, PSP reconciliations, and CT filings are proactive instead of reactive.',
    rating: 5,
  },
  {
    name: 'Leena Kurian',
    role: 'Co-founder, Atlas Clinics',
    quote:
      'Our investors demanded monthly packs and compliance proof. Finanshels gave us both—clean numbers, scenario planning, and a tax desk that understands UAE healthcare regulations.',
    rating: 5,
  },
  {
    name: 'Ahmed Khalil',
    role: 'CEO, Greenfield Properties',
    quote:
      'Real estate finance is tricky with escrow accounts and project-based accounting. Finanshels handled it seamlessly, giving us crystal-clear visibility into every project.',
    rating: 5,
  },
]

export const COMPANY_VALUES: CompanyValue[] = [
  {
    icon: '🎯',
    title: 'Customer Obsession',
    description:
      'Every feature, every interaction, every decision starts with our customers. Their success defines ours, and we go the extra mile to ensure they thrive.',
  },
  {
    icon: '⚡',
    title: 'Speed & Execution',
    description:
      'We move fast without breaking things. Quick iterations, rapid feedback loops, and a bias for action help us stay ahead in a competitive market.',
  },
  {
    icon: '🧠',
    title: 'Intellectual Honesty',
    description:
      'We tackle hard problems with clear thinking. No corporate BS, no politics - just honest conversations that drive the best outcomes.',
  },
  {
    icon: '🤝',
    title: 'Radical Ownership',
    description:
      'We own outcomes, not just tasks. When something needs doing, we step up. When something breaks, we fix it. No blame, only solutions.',
  },
  {
    icon: '📈',
    title: 'Continuous Growth',
    description:
      "We're here to become the best versions of ourselves. Learning is baked into everything we do, from weekly knowledge shares to unlimited learning budgets.",
  },
  {
    icon: '🌍',
    title: 'Build for MENA',
    description:
      "We're building for our region, understanding local nuances, regulations, and culture. Global quality, local expertise.",
  },
]
