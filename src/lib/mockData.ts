// Mock data for mentors - simulating database seeding for MVP
export interface MentorData {
  id: number
  name: string
  role: string
  company: string
  industry: string
  tags: string[]
  rating: number
  reviews: number
  description: string
  price: number
  imageUrl: string
  availableThisWeek: boolean
  instantBooking: boolean
  eveningsWeekends: boolean
  // Modal data
  title: string
  about: string[]
  services: Array<{
    icon: 'coffee' | 'pencil' | 'compass'
    title: string
    duration: string
    price: number
    popular?: boolean
  }>
  availability: Array<{
    date: string
    label: string
    slots: number
    isHighlighted: boolean
  }>
  reviewsDetail: {
    rating: number
    count: number
    text: string
    author: string
    authorInitial: string
  }
  responseTime: string
  linkedIn: string
  portfolio: string
}

export const mentorsDatabase: MentorData[] = [
  {
    id: 1,
    name: 'Sarah J.',
    role: 'Senior UX Designer',
    company: 'Google',
    industry: 'Technology',
    tags: ['#Tech', '#Google', '#PortfolioReview', '#UX'],
    rating: 4.9,
    reviews: 120,
    description: '5 years experience, specializes in helping non-traditional applicants break into tech.',
    price: 25,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWhBE6MKqHZrAlqATYsGENI0bbJdkVFNEZvPpCbBYbFRudBqZv9Pr_TAaQ5HZGNs4CCPbb1KcnqeCAldMOhGYSPgZzN2LYvlJxxK-tOmTvPkKzuyj_jrpCot8ybgIyDZ8SHXv_7cU-HynZWT4mU2-YGEolJO6nK2CcA1dJBT3pF9XTh9g5_-rcNE_lkb-tQhys2npJlzOZtXlZydUdzYcqvCddjbpW7K5UyeKbgE7EPsIszPcCIu-7QTR_tU3PAqibWY0cOyPny0',
    availableThisWeek: true,
    instantBooking: true,
    eveningsWeekends: false,
    title: 'Senior UX Researcher & Ivy League Admissions Strategist',
    about: [
      'With over a decade of experience bridging human-computer interaction and academic strategy, I specialize in helping driven students navigate complex career transitions and elite university admissions.',
      'Whether you are refining your design portfolio or crafting a compelling narrative for grad school, we will focus on structuring your ideas to maximize impact.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 25 },
      { icon: 'pencil', title: 'Portfolio Review', duration: '60 minutes', price: 50, popular: true },
      { icon: 'compass', title: 'Career Strategy', duration: '90 minutes', price: 80 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 3, isHighlighted: true },
      { date: '2024-10-25', label: 'Wed, Oct 25', slots: 2, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 5.0,
      count: 42,
      text: "Sarah didn't just review my portfolio; she completely reshaped how I talk about my design process.",
      author: 'Michael T.',
      authorInitial: 'M',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Product Lead',
    company: 'Stripe',
    industry: 'Technology',
    tags: ['#Fintech', '#Leadership', '#ProductManagement'],
    rating: 5.0,
    reviews: 84,
    description: 'Ex-Meta engineer turned product leader. I help senior ICs transition into management roles.',
    price: 45,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbuwfHqHnoZupyLYf6PvPb3MfKQf8sVLQ4h5HVCQChUTTDebXFAbWXc1_XoPfUWdmIQjDURDfhPQj5vUkBcM8vJnZK6BCHjYm6G4xNYAIEHFqdE1hy-CEgHBgH9Rk3TQ9ulM5kUE1B4svJaiuyN2eCQrK-otbpCzHzbYREiefX3_tgKiAx_zHoEIcrBpYMyu-3RelLcoGt3EQUJ7uR6k-Gv6LUypn4kPT9NX9fiXJAPM5Idnpd2U6XyOk3foqAvFFBfycd-yd56wc',
    availableThisWeek: true,
    instantBooking: false,
    eveningsWeekends: true,
    title: 'Product Lead & Engineering Manager',
    about: [
      'Former Meta engineer with 8 years of experience in product development and team leadership.',
      'My approach focuses on practical frameworks for decision-making, stakeholder management, and building high-performing teams.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 45 },
      { icon: 'pencil', title: 'Leadership Coaching', duration: '60 minutes', price: 90, popular: true },
      { icon: 'compass', title: 'Career Roadmap', duration: '90 minutes', price: 120 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 2, isHighlighted: true },
      { date: '2024-10-26', label: 'Thu, Oct 26', slots: 4, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 5.0,
      count: 84,
      text: 'Marcus helped me navigate the transition from senior engineer to engineering manager.',
      author: 'Jennifer L.',
      authorInitial: 'J',
    },
    responseTime: 'Usually responds within 12 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    company: 'Adobe',
    industry: 'Creative Arts',
    tags: ['#Design', '#Branding', '#CareerPivot'],
    rating: 4.8,
    reviews: 215,
    description: 'Helping designers master the business of design and land high-paying creative agency roles.',
    price: 30,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQSPiHH8uOEZUy9FQ2E_8vO_ll_F7hqYzrct7O9BwFmRPqerAM2jbWBWlAH5o9bn-HOsgkBuJs6Lq2H00iVJ-75J_9H_32-zcj7tkY_ThvN4OxHr21_kVu_PqenhqGRJgsaUd3CgXAFZOxH6lIuxO0d4ghMkd57Ktpd40UB71qmOhbiUSC3upJv0WQR8AyTYv62W9kpkW61t-vjytDywmCNlIn5U-irIK1rLfYWKaZMqsWb98JThLYB9ui31iFXXJng1ga5Ok4zhk',
    availableThisWeek: true,
    instantBooking: true,
    eveningsWeekends: true,
    title: 'Creative Director & Brand Strategist',
    about: [
      '15+ years in creative leadership at top agencies and tech companies.',
      'Whether you are building your personal brand or pivoting to a creative director role, I will help you position yourself strategically.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 30 },
      { icon: 'pencil', title: 'Brand Review', duration: '60 minutes', price: 65, popular: true },
      { icon: 'compass', title: 'Career Strategy', duration: '90 minutes', price: 95 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 5, isHighlighted: true },
      { date: '2024-10-24', label: 'Tue, Oct 24', slots: 3, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.8,
      count: 215,
      text: 'Elena helped me understand how to position myself as a creative leader.',
      author: 'David K.',
      authorInitial: 'D',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    role: 'Senior Data Scientist',
    company: 'Tesla',
    industry: 'Technology',
    tags: ['#DataScience', '#AI', '#PhDToIndustry'],
    rating: 4.9,
    reviews: 156,
    description: 'Guiding academic researchers into data science roles. Specialist in Python, ML, and career strategy.',
    price: 50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrI1mjakbj9tJx5yDD6S0R6nTMsXEQkHV0zEzL_2__Yk4ZiF-wH_4Z_F-LUZO3yKS-3nhA-RbOqGHz3wUz-hkiNDl9pCoBK-OJmsH_0fpDsAYI69XKGPSU7p98wjCkR-Ig25oAx0B-XSezK4ZEw-XrV6HxVAu0Y85GalqW1adeg5b7AEDfDCBVihsSr4JaoWC5s7fkeBjpz78B9FIlu10c9BqOF6US9Pi8RIQ6wa1dJjEQjbM423_cjcvHzvfvUIoeRxNEUBUhW7s',
    availableThisWeek: false,
    instantBooking: false,
    eveningsWeekends: true,
    title: 'Senior Data Scientist & ML Engineer',
    about: [
      'PhD in Computer Science with 10+ years bridging academia and industry.',
      'My mentorship covers technical skills (Python, ML, deep learning) and career strategy for landing roles at top tech companies.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 50 },
      { icon: 'pencil', title: 'Technical Review', duration: '60 minutes', price: 100, popular: true },
      { icon: 'compass', title: 'Career Strategy', duration: '90 minutes', price: 140 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 1, isHighlighted: true },
      { date: '2024-10-27', label: 'Fri, Oct 27', slots: 2, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.9,
      count: 156,
      text: 'Dr. Wilson helped me transition from academia to industry. His technical guidance was exceptional.',
      author: 'Sarah P.',
      authorInitial: 'S',
    },
    responseTime: 'Usually responds within 48 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  // Additional mentors for pagination
  {
    id: 5,
    name: 'Priya Sharma',
    role: 'Investment Banker',
    company: 'Goldman Sachs',
    industry: 'Business & Finance',
    tags: ['#Finance', '#MBA', '#WallStreet'],
    rating: 4.7,
    reviews: 98,
    description: 'Former McKinsey consultant now in investment banking. Helping candidates break into finance.',
    price: 75,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWhBE6MKqHZrAlqATYsGENI0bbJdkVFNEZvPpCbBYbFRudBqZv9Pr_TAaQ5HZGNs4CCPbb1KcnqeCAldMOhGYSPgZzN2LYvlJxxK-tOmTvPkKzuyj_jrpCot8ybgIyDZ8SHXv_7cU-HynZWT4mU2-YGEolJO6nK2CcA1dJBT3pF9XTh9g5_-rcNE_lkb-tQhys2npJlzOZtXlZydUdzYcqvCddjbpW7K5UyeKbgE7EPsIszPcCIu-7QTR_tU3PAqibWY0cOyPny0',
    availableThisWeek: true,
    instantBooking: true,
    eveningsWeekends: false,
    title: 'Investment Banking VP',
    about: [
      'MBA from Wharton with 12 years in consulting and investment banking.',
      'I specialize in helping candidates prepare for finance interviews and navigate career transitions.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 75 },
      { icon: 'pencil', title: 'Interview Prep', duration: '60 minutes', price: 150, popular: true },
      { icon: 'compass', title: 'Career Strategy', duration: '90 minutes', price: 200 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 2, isHighlighted: true },
      { date: '2024-10-28', label: 'Sat, Oct 28', slots: 1, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.7,
      count: 98,
      text: 'Priya helped me ace my Goldman Sachs interview. Her insights were invaluable.',
      author: 'Alex M.',
      authorInitial: 'A',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 6,
    name: 'Dr. Lisa Anderson',
    role: 'Clinical Psychologist',
    company: 'Mayo Clinic',
    industry: 'Healthcare',
    tags: ['#Healthcare', '#Psychology', '#Research'],
    rating: 5.0,
    reviews: 142,
    description: 'Helping psychology students navigate clinical training and research careers.',
    price: 40,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQSPiHH8uOEZUy9FQ2E_8vO_ll_F7hqYzrct7O9BwFmRPqerAM2jbWBWlAH5o9bn-HOsgkBuJs6Lq2H00iVJ-75J_9H_32-zcj7tkY_ThvN4OxHr21_kVu_PqenhqGRJgsaUd3CgXAFZOxH6lIuxO0d4ghMkd57Ktpd40UB71qmOhbiUSC3upJv0WQR8AyTYv62W9kpkW61t-vjytDywmCNlIn5U-irIK1rLfYWKaZMqsWb98JThLYB9ui31iFXXJng1ga5Ok4zhk',
    availableThisWeek: true,
    instantBooking: false,
    eveningsWeekends: true,
    title: 'Clinical Psychologist & Researcher',
    about: [
      'PhD in Clinical Psychology with 15 years of experience in both clinical practice and research.',
      'I help students navigate the complex path to becoming a licensed psychologist.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 40 },
      { icon: 'pencil', title: 'Career Guidance', duration: '60 minutes', price: 80, popular: true },
      { icon: 'compass', title: 'Research Mentorship', duration: '90 minutes', price: 110 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 3, isHighlighted: true },
      { date: '2024-10-29', label: 'Sun, Oct 29', slots: 2, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 5.0,
      count: 142,
      text: 'Dr. Anderson provided exceptional guidance for my clinical psychology career.',
      author: 'Emma R.',
      authorInitial: 'E',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 7,
    name: 'Tom Bradley',
    role: 'Software Architect',
    company: 'Amazon',
    industry: 'Technology',
    tags: ['#SoftwareEngineering', '#SystemDesign', '#AWS'],
    rating: 4.9,
    reviews: 187,
    description: '15 years building scalable systems. Helping engineers level up to senior and staff roles.',
    price: 60,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrI1mjakbj9tJx5yDD6S0R6nTMsXEQkHV0zEzL_2__Yk4ZiF-wH_4Z_F-LUZO3yKS-3nhA-RbOqGHz3wUz-hkiNDl9pCoBK-OJmsH_0fpDsAYI69XKGPSU7p98wjCkR-Ig25oAx0B-XSezK4ZEw-XrV6HxVAu0Y85GalqW1adeg5b7AEDfDCBVihsSr4JaoWC5s7fkeBjpz78B9FIlu10c9BqOF6US9Pi8RIQ6wa1dJjEQjbM423_cjcvHzvfvUIoeRxNEUBUhW7s',
    availableThisWeek: true,
    instantBooking: true,
    eveningsWeekends: false,
    title: 'Principal Software Architect',
    about: [
      'Built distributed systems at Amazon for over 15 years.',
      'I help engineers develop the skills needed for senior and staff-level positions.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 60 },
      { icon: 'pencil', title: 'System Design Review', duration: '60 minutes', price: 120, popular: true },
      { icon: 'compass', title: 'Career Coaching', duration: '90 minutes', price: 160 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 2, isHighlighted: true },
      { date: '2024-10-30', label: 'Mon, Oct 30', slots: 3, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.9,
      count: 187,
      text: 'Tom helped me understand system design at scale. Got promoted to senior engineer!',
      author: 'Chris P.',
      authorInitial: 'C',
    },
    responseTime: 'Usually responds within 12 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 8,
    name: 'Maria Garcia',
    role: 'Marketing Director',
    company: 'Nike',
    industry: 'Business & Finance',
    tags: ['#Marketing', '#Branding', '#Digital'],
    rating: 4.8,
    reviews: 134,
    description: 'Digital marketing expert helping professionals transition into marketing leadership roles.',
    price: 35,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWhBE6MKqHZrAlqATYsGENI0bbJdkVFNEZvPpCbBYbFRudBqZv9Pr_TAaQ5HZGNs4CCPbb1KcnqeCAldMOhGYSPgZzN2LYvlJxxK-tOmTvPkKzuyj_jrpCot8ybgIyDZ8SHXv_7cU-HynZWT4mU2-YGEolJO6nK2CcA1dJBT3pF9XTh9g5_-rcNE_lkb-tQhys2npJlzOZtXlZydUdzYcqvCddjbpW7K5UyeKbgE7EPsIszPcCIu-7QTR_tU3PAqibWY0cOyPny0',
    availableThisWeek: false,
    instantBooking: false,
    eveningsWeekends: true,
    title: 'Marketing Director & Brand Strategist',
    about: [
      '10+ years in digital marketing and brand strategy at Fortune 500 companies.',
      'I help marketing professionals develop leadership skills and advance their careers.',
    ],
    services: [
      { icon: 'coffee', title: 'Intro Call', duration: '30 minutes', price: 35 },
      { icon: 'pencil', title: 'Marketing Strategy', duration: '60 minutes', price: 70, popular: true },
      { icon: 'compass', title: 'Leadership Coaching', duration: '90 minutes', price: 100 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 4, isHighlighted: true },
      { date: '2024-10-31', label: 'Tue, Oct 31', slots: 2, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.8,
      count: 134,
      text: 'Maria helped me transition from marketing manager to director. Her advice was spot-on.',
      author: 'Rachel S.',
      authorInitial: 'R',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
]
