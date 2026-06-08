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
    name: 'Aashutosh Poudel',
    title: 'Senior Software Engineer, Webpoint Technology',
    imageUrl: '/events/aashutosh.png',
  },
  topic: 'Career in Mobile Development',
  audience: 'Aspiring Mobile Developers',
  highlights: [
    'iOS and Android development paths',
    'Building scalable mobile applications today',
    'Essential frameworks for app developers',
  ],
  bio: 'Aashutosh Poudel is a Senior Software Engineer at Webpoint Technology. He will share insights into mobile app development, career opportunities in the industry, the skills employers look for, and practical guidance for students interested in building applications for Android and iOS platforms.',
  durationMinutes: 60,
  seats: 60,
  date: 'June 8, Monday',
  pricePerSeat: 150,
}
