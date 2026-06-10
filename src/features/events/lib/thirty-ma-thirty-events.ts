import type { EventCardDetails } from '@/features/events/components/EventCard'

const FEATURED_GUEST_NAME = 'Renuka Shiwakoti'

type ThirtyMaThirtyEvent = EventCardDetails & {
  bio?: string
}

export type FeaturedThirtyMaThirtyEvent = {
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

const events: ThirtyMaThirtyEvent[] = [
  {
    guestName: 'Bhupin Baral',
    guestDesc: 'Sr. AI Engineer, Fusemachines',
    showGuestDesc: true,
    imageUrl: '/events/bhupin.png',
    topic: 'Career in Robotics and Machine Learning',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Getting started with machine learning',
      'Real-world robotics and automation use',
      'Required math and programming skills',
    ],
    isFinished: true,
    bio: 'Bhupin Baral is a Senior AI Engineer at Fusemachines. He will guide students through robotics and machine learning career paths, the foundations needed to get started, and how AI skills connect to real-world automation work.',
  },
  {
    guestName: 'Renuka Shiwakoti',
    guestDesc: 'Sr. Technical Writer',
    showGuestDesc: true,
    imageUrl: '/events/renuka.png',
    topic: 'Career in Technical Writing',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Crafting clear software documentation guides',
      'Tools for modern technical writers',
      'Bridging developers and end users',
    ],
  },
  {
    guestName: 'Bibekmani Acharya',
    guestDesc: 'Founder/ CEO, Charging station Nepal',
    showGuestDesc: true,
    imageUrl: '/events/bibek.png',
    topic: 'Career in Product Enterpreneurship',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Launching successful physical tech products',
      'Securing funding for your startup',
      'Navigating hardware business in Nepal',
    ],
  },
  {
    guestName: 'Nabin Paudel',
    guestDesc: 'Sr. Project Manager, Webpoint Technology Pvt Ltd',
    showGuestDesc: true,
    imageUrl: '/events/nabin.png',
    topic: 'Scope in IT Product and Project Management',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Agile and Scrum methodologies explained',
      'Managing tech teams and deadlines',
      'Essential tools for project managers',
    ],
  },
  {
    guestName: 'Chandra Shekhar Neupane',
    guestDesc: 'Sr. Software Engineer, Webpoint Technology Pvt Ltd',
    showGuestDesc: true,
    imageUrl: '/events/chandra.png',
    topic: 'Career in Electronics Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Embedded systems and IoT careers',
      'Circuit design and hardware development',
      'Bridging electronics with software programming',
    ],
  },
  {
    guestName: 'Samrat Adhikari',
    guestDesc: 'Founder/Content Creator - Katha Creation',
    imageUrl: '/events/samrat.png',
    topic: 'Career in Content Creation',
    seats: 100,
    pricePerSeat: 100,
    highlights: [
      'Writing and directing social-first stories',
      'Building content people watch as a family',
      'Turning creator skills into brand work',
    ],
  },
  {
    guestName: 'Bikash Thapaliya',
    guestDesc: 'Executive Producer and News Coordinator at Image Channel & CEO of NepalVox',
    imageUrl: '/events/bikash.png',
    topic: 'Career in Journalism',
    seats: 100,
    pricePerSeat: 100,
    highlights: [
      'Overview of modern journalism careers',
      'Live Q&A for starting out',
      'Building a strong media portfolio',
    ],
  },
  {
    guestName: 'Nischal Karki',
    guestDesc: 'Content Creator',
    imageUrl: '/events/nischal.png',
    topic: 'Career in Content Creation',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Crafting engaging content for brands',
      'Building a loyal online audience',
      'Portfolio regarding QnA for new creators',
    ],
  },
  {
    guestName: 'Dr. Sameer Mani Dixit',
    guestDesc: 'Scientist/ Founder, The Fab Show',
    imageUrl: '/events/drsameer.png',
    topic: 'Career in Bio Technology',
    seats: 75,
    pricePerSeat: 150,
    highlights: [
      'Scope of biotechnology in Nepal',
      'Research and lab career paths',
      'Live Q&A on biotech studies',
    ],
  },
  {
    guestName: 'Kamala Shrestha',
    guestDesc: 'The First Beautician of Nepal',
    imageUrl: '/events/kamala.png',
    topic: 'Career in Beautician',
    seats: 90,
    pricePerSeat: 100,
    highlights: [
      'Starting a professional beauty salon',
      'Essential skills for makeup artists',
      'Customer management in beauty industry',
    ],
  },
  {
    guestName: 'SR. Army Officer',
    guestDesc: ' Nepal Army',
    topic: 'Career in Nepal Army',
    seats: 100,
    pricePerSeat: 200,
    highlights: [
      'Officer cadet selection process explained',
      'Life and discipline in military',
      'Leadership skills for army officers',
    ],
  },
  {
    guestName: 'Dr. Renuka Banjara',
    guestDesc: 'General Physician',
    imageUrl: '/events/drrenuka.png',
    topic: 'Career in MBBS',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Preparing for medical entrance exams',
      'Life as a medical student',
      'Specialization paths after MBBS degree',
    ],
  },
  {
    guestName: 'Kieran Kunwor',
    guestDesc: 'First Officer/PilotSummit Air',
    imageUrl: '/events/kieran.png',
    topic: 'Career in Pilot',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Flight school and training requirements',
      'Day in the life of pilot',
      'Aviation safety and career growth',
    ],
  },
  {
    guestName: 'Arpan Thapa',
    guestDesc: 'Aircraft Maintenance Technician at Buddha Air',
    imageUrl: '/events/arpan.png',
    topic: 'Career in Mechanical Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Core skills for mechanical engineers',
      'Aircraft maintenance and engineering roles',
      'Job opportunities in heavy industries',
    ],
  },
  {
    guestName: 'Er. Samir Pradhan',
    guestDesc: 'Civil Engineer at Smart Builder Nepal',
    imageUrl: '/events/ersamir.png',
    topic: 'Career in Civil Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Career opportunities in civil engineering',
      'Real-world experience in construction projects',
      'Skills and tools needed for modern engineers',
    ],
  },
  {
    guestName: 'Inspector Sudip Adhikari ',
    guestDesc: 'APF, Nepal Police',
    imageUrl: '/events/inspsudip.png',
    topic: 'Career in Armed Police Force',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'APF inspector exam preparation tips',
      'Physical and mental fitness requirements',
      'Serving the nation through APF',
    ],
  },
  {
    guestName: 'Sushma Dahal',
    guestDesc: 'Criminal Lawyer at Legal Access Nepal',
    imageUrl: '/events/sushma.png',
    topic: 'Career in Law',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Career pathways in law and advocacy',
      'Insights into criminal law practice in Nepal',
      'Skills needed to succeed as a lawyer',
    ],
  },
  {
    guestName: 'Dr. Manisha Rokaya',
    guestDesc: 'Dental Surgeon at Manab Dental Home',
    imageUrl: '/events/drmanisha.png',
    topic: 'Career in Dentistry',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Pathway to becoming dental surgeon',
      'Setting up a dental clinic',
      'Modern technologies in dental care',
    ],
  },
  {
    guestName: 'Krijan Gautam',
    guestDesc: 'HR Manager',
    imageUrl: '/events/krijan.png',
    topic: 'Career in HR',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Core skills for HR professionals',
      'Talent acquisition and team management',
      'Building effective corporate work cultures',
    ],
  },
  {
    guestName: 'Mandira Shrestha ',
    guestDesc: "Registered nurse at Kanti Children's Hospital",
    imageUrl: '/events/mandira.png',
    topic: 'Career in Nursing',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Exploring nursing specialties and roles',
      'Patient care and clinical skills',
      'Global opportunities for registered nurses',
    ],
  },
  {
    guestName: 'Subigya Ojha',
    guestDesc: 'Project Manager at Webpoint Technology',
    imageUrl: '/events/subigya.png',
    topic: 'Career in Computer Engineering',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Navigating computer engineering career paths',
      'Software vs hardware engineering roles',
      'Transitioning to tech project management',
    ],
  },
  {
    guestName: 'Sarthak KC',
    guestDesc: 'Ground Handling at Summit Air',
    imageUrl: '/events/sarthak.png',
    topic: 'Career in Aviation',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Ground handling and airport operations',
      'Aviation management career growth paths',
      'Ensuring safety in daily flights',
    ],
  },
  {
    guestName: 'Balaram Parajuli, FCA',
    guestDesc: 'Chartered Accountant at B.R. Parajuli and Associates',
    imageUrl: '/events/balaram.png',
    topic: 'Career in Chartered Accountancy ',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Navigating the rigorous CA exams',
      'Audit, tax, and finance roles',
      'Career prospects for chartered accountants',
    ],
  },
  {
    guestName: 'Anjali Sharma',
    guestDesc: 'Ex cabin crew, Air Asia and Agni Air',
    imageUrl: '/events/anjali.png',
    topic: 'Career in Air Hostess',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'How to start a career as cabin crew',
      'Interview preparation and communication skills',
      'Life and responsibilities of an air hostess',
    ],
  },
  {
    guestName: 'Ashwin Neupane',
    guestDesc: 'Digital Marketing and AI Content Creator',
    imageUrl: '/home/ashwin.png',
    topic: 'AI Skill for +2 appeared students',
    seats: 80,
    pricePerSeat: 100,
    highlights: [
      'Essential AI tools for beginners',
      'Enhancing study with AI workflows',
      'Future-proofing your career skills',
    ],
  },
  {
    guestName: 'Prayash Poudel',
    guestDesc: 'Principal AI Engineer, Leapfrog Technology',
    showGuestDesc: true,
    imageUrl: '/events/prayash.png',
    topic: 'Career in Software Engineering using AI',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'Integrating AI in software development',
      'Future of coding with AI',
      'Live Q&A on tech careers',
    ],
  },
  {
    guestName: 'Aashutosh Poudel',
    guestDesc: 'Senior Software Engineer, Webpoint Technology',
    showGuestDesc: true,
    imageUrl: '/events/aashutosh.png',
    topic: 'Career in Mobile Development',
    seats: 60,
    pricePerSeat: 150,
    highlights: [
      'iOS and Android development paths',
      'Building scalable mobile applications today',
      'Essential frameworks for app developers',
    ],
  },
]

function toEventCardDetails(event: ThirtyMaThirtyEvent): EventCardDetails {
  return {
    guestName: event.guestName,
    guestDesc: event.guestDesc,
    showGuestDesc: event.showGuestDesc,
    imageUrl: event.imageUrl,
    topic: event.topic,
    date: event.date,
    time: event.time,
    highlights: event.highlights,
    seats: event.seats,
    pricePerSeat: event.pricePerSeat,
  }
}

function toFeaturedEvent(event: ThirtyMaThirtyEvent): FeaturedThirtyMaThirtyEvent {
  const name = event.guestName ?? 'Exclusive Guest'

  return {
    guest: {
      name,
      title: event.guestDesc,
      imageUrl: event.imageUrl ?? '/home/byc-logo.svg',
    },
    topic: event.topic,
    audience: 'Aspiring students',
    highlights: event.highlights,
    bio:
      event.bio ??
      `${name} will share practical guidance on ${event.topic.toLowerCase()}, including career paths, useful skills, and answers to student questions.`,
    durationMinutes: 60,
    seats: event.seats,
    date: event.date,
    time: event.time,
    pricePerSeat: event.pricePerSeat,
  }
}

export function getThirtyMaThirtyEventsForDisplay(): EventCardDetails[] {
  const cardEvents = events.map((event) => ({
    ...toEventCardDetails(event),
    isFinished: event.isFinished ?? false,
  }))

  const openEvents = cardEvents.filter((event) => !event.isFinished)
  const completedEvents = cardEvents.filter((event) => event.isFinished)

  return [...openEvents, ...completedEvents]
}

export function getFeaturedThirtyMaThirtyEvent(): FeaturedThirtyMaThirtyEvent {
  const featuredEvent =
    events.find((event) => event.guestName === FEATURED_GUEST_NAME) ??
    events.find((event) => !event.isFinished) ??
    events[0]

  if (!featuredEvent) {
    throw new Error('No 30 ma 30 events are configured.')
  }

  return toFeaturedEvent(featuredEvent)
}
