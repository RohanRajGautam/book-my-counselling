type FeaturedEvent = {
  guest: {
    name: string
    title: string
    imageUrl: string
  }
  topic: string
  audience: string
  highlights: string[]
  bio: string
  durationMinutes: number
  seats: number
  date?: string
  time?: string
  pricePerSeat: number
}

export const FEATURED_EVENT: FeaturedEvent = {
  guest: {
    name: 'Prayash Poudel',
    title: 'Principal AI Engineer, Leapfrog Technology',
    imageUrl: '/events/prayash.png',
  },
  topic: 'Career in Software Engineering using AI',
  audience: 'Appeared Students',
  highlights: [
    'Integrating AI in software development',
    'Future of coding with AI',
    'Live Q&A on tech careers',
  ],
  bio: 'Prayash Poudel is a Principal AI Engineer at Leapfrog Technology. He helps students understand how AI is changing software engineering, what skills matter now, and how beginners can build practical confidence with modern development workflows.',
  durationMinutes: 60,
  seats: 60,
  date: 'June 7, Sunday',
  pricePerSeat: 150,
}
