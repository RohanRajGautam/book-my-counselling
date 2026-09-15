// Hardcoded list of speakers/topics used by the home page's featured event
// card. Kept separate from the live /events backend integration so the home
// page can keep rendering even when the events API has no published events.

const FEATURED_GUEST_NAME = 'Renuka Shiwakoti'

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

const events: FeaturedThirtyMaThirtyEvent[] = [
  {
    guest: {
      name: 'Bhupin Baral',
      title: 'Sr. AI Engineer, Fusemachines',
      imageUrl: '/events/bhupin.png',
    },
    topic: 'Career in Robotics and Machine Learning',
    audience: 'Aspiring students',
    highlights: [
      'Getting started with machine learning',
      'Real-world robotics and automation use',
      'Required math and programming skills',
    ],
    bio: 'Bhupin Baral is a Senior AI Engineer at Fusemachines. He will guide students through robotics and machine learning career paths, the foundations needed to get started, and how AI skills connect to real-world automation work.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Renuka Shiwakoti',
      title: 'Sr. Technical Writer',
      imageUrl: '/events/renuka.png',
    },
    topic: 'Career in Technical Writing',
    audience: 'Aspiring students',
    highlights: [
      'Crafting clear software documentation guides',
      'Tools for modern technical writers',
      'Bridging developers and end users',
    ],
    bio: 'Renuka Shiwakoti is a senior technical writer who breaks down the craft of producing clear, useful documentation for software products.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Bibekmani Acharya',
      title: 'Founder/CEO, Charging Station Nepal',
      imageUrl: '/events/bibek.png',
    },
    topic: 'Career in Product Entrepreneurship',
    audience: 'Aspiring students',
    highlights: [
      'Launching successful physical tech products',
      'Securing funding for your startup',
      'Navigating hardware business in Nepal',
    ],
    bio: 'Bibekmani Acharya is the founder of Charging Station Nepal and walks students through the realities of building a hardware product company in Nepal.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Nabin Paudel',
      title: 'Sr. Project Manager, Webpoint Technology Pvt Ltd',
      imageUrl: '/events/nabin.png',
    },
    topic: 'Scope in IT Product and Project Management',
    audience: 'Aspiring students',
    highlights: [
      'Agile and Scrum methodologies explained',
      'Managing tech teams and deadlines',
      'Essential tools for project managers',
    ],
    bio: 'Nabin Paudel is a senior project manager at Webpoint Technology and breaks down what working in IT product and project management actually looks like.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Chandra Shekhar Neupane',
      title: 'Sr. Software Engineer, Webpoint Technology Pvt Ltd',
      imageUrl: '/events/chandra.png',
    },
    topic: 'Career in Electronics Engineering',
    audience: 'Aspiring students',
    highlights: [
      'Embedded systems and IoT careers',
      'Circuit design and hardware development',
      'Bridging electronics with software programming',
    ],
    bio: 'Chandra Shekhar Neupane is a senior software engineer at Webpoint Technology who talks through electronics engineering careers, embedded systems, and where hardware meets software.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Samrat Adhikari',
      title: 'Founder/Content Creator — Katha Creation',
      imageUrl: '/events/samrat.png',
    },
    topic: 'Career in Content Creation',
    audience: 'Aspiring students',
    highlights: [
      'Writing and directing social-first stories',
      'Building content people watch as a family',
      'Turning creator skills into brand work',
    ],
    bio: 'Samrat Adhikari is the founder of Katha Creation and shares what it takes to build a content career that lasts.',
    durationMinutes: 60,
    seats: 100,
    pricePerSeat: 100,
  },
  {
    guest: {
      name: 'Bikash Thapaliya',
      title: 'Executive Producer, Image Channel — CEO, NepalVox',
      imageUrl: '/events/bikash.png',
    },
    topic: 'Career in Journalism',
    audience: 'Aspiring students',
    highlights: [
      'Overview of modern journalism careers',
      'Live Q&A for starting out',
      'Building a strong media portfolio',
    ],
    bio: 'Bikash Thapaliya is an executive producer and news coordinator at Image Channel and CEO of NepalVox, walking students through modern journalism careers.',
    durationMinutes: 60,
    seats: 100,
    pricePerSeat: 100,
  },
  {
    guest: {
      name: 'Nischal Karki',
      title: 'Content Creator',
      imageUrl: '/events/nischal.png',
    },
    topic: 'Career in Content Creation',
    audience: 'Aspiring students',
    highlights: [
      'Crafting engaging content for brands',
      'Building a loyal online audience',
      'Portfolio regarding Q&A for new creators',
    ],
    bio: 'Nischal Karki is a content creator who shares how to build an engaged audience and turn creator skills into brand work.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Dr. Sameer Mani Dixit',
      title: 'Scientist / Founder, The Fab Show',
      imageUrl: '/events/drsameer.png',
    },
    topic: 'Career in Bio Technology',
    audience: 'Aspiring students',
    highlights: [
      'Scope of biotechnology in Nepal',
      'Research and lab career paths',
      'Live Q&A on biotech studies',
    ],
    bio: 'Dr. Sameer Mani Dixit is a scientist and founder of The Fab Show who breaks down biotech careers, research paths, and what students should study next.',
    durationMinutes: 60,
    seats: 75,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Kamala Shrestha',
      title: 'The First Beautician of Nepal',
      imageUrl: '/events/kamala.png',
    },
    topic: 'Career in Beautician',
    audience: 'Aspiring students',
    highlights: [
      'Starting a professional beauty salon',
      'Essential skills for makeup artists',
      'Customer management in beauty industry',
    ],
    bio: 'Kamala Shrestha, the first beautician of Nepal, shares how she built a beauty career and what newcomers to the field should know.',
    durationMinutes: 60,
    seats: 90,
    pricePerSeat: 100,
  },
  {
    guest: {
      name: 'Sr. Army Officer',
      title: 'Nepal Army',
      imageUrl: '/home/byc-logo.svg',
    },
    topic: 'Career in Nepal Army',
    audience: 'Aspiring students',
    highlights: [
      'Officer cadet selection process explained',
      'Life and discipline in military',
      'Leadership skills for army officers',
    ],
    bio: 'A senior army officer walks students through the realities of an officer career in the Nepal Army.',
    durationMinutes: 60,
    seats: 100,
    pricePerSeat: 200,
  },
  {
    guest: {
      name: 'Dr. Renuka Banjara',
      title: 'General Physician',
      imageUrl: '/events/drrenuka.png',
    },
    topic: 'Career in MBBS',
    audience: 'Aspiring students',
    highlights: [
      'Preparing for medical entrance exams',
      'Life as a medical student',
      'Specialization paths after MBBS degree',
    ],
    bio: 'Dr. Renuka Banjara is a general physician who breaks down the medical path — entrance exams, student life, and what comes after MBBS.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Kieran Kunwor',
      title: 'First Officer / Pilot, Summit Air',
      imageUrl: '/events/kieran.png',
    },
    topic: 'Career in Pilot',
    audience: 'Aspiring students',
    highlights: [
      'Flight school and training requirements',
      'Day in the life of a pilot',
      'Aviation safety and career growth',
    ],
    bio: 'Kieran Kunwor is a first officer at Summit Air who walks students through pilot training, daily flying life, and aviation safety.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Arpan Thapa',
      title: 'Aircraft Maintenance Technician, Buddha Air',
      imageUrl: '/events/arpan.png',
    },
    topic: 'Career in Mechanical Engineering',
    audience: 'Aspiring students',
    highlights: [
      'Core skills for mechanical engineers',
      'Aircraft maintenance and engineering roles',
      'Job opportunities in heavy industries',
    ],
    bio: 'Arpan Thapa is an aircraft maintenance technician at Buddha Air who talks mechanical engineering careers and aviation maintenance roles.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Er. Samir Pradhan',
      title: 'Civil Engineer, Smart Builder Nepal',
      imageUrl: '/events/ersamir.png',
    },
    topic: 'Career in Civil Engineering',
    audience: 'Aspiring students',
    highlights: [
      'Career opportunities in civil engineering',
      'Real-world experience in construction projects',
      'Skills and tools needed for modern engineers',
    ],
    bio: 'Er. Samir Pradhan is a civil engineer at Smart Builder Nepal who breaks down what civil engineering careers look like day-to-day.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Inspector Sudip Adhikari',
      title: 'APF, Nepal Police',
      imageUrl: '/events/inspsudip.png',
    },
    topic: 'Career in Armed Police Force',
    audience: 'Aspiring students',
    highlights: [
      'APF inspector exam preparation tips',
      'Physical and mental fitness requirements',
      'Serving the nation through APF',
    ],
    bio: 'Inspector Sudip Adhikari of the APF walks students through exam prep, fitness, and what life looks like inside the Armed Police Force.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Sushma Dahal',
      title: 'Criminal Lawyer, Legal Access Nepal',
      imageUrl: '/events/sushma.png',
    },
    topic: 'Career in Law',
    audience: 'Aspiring students',
    highlights: [
      'Career pathways in law and advocacy',
      'Insights into criminal law practice in Nepal',
      'Skills needed to succeed as a lawyer',
    ],
    bio: 'Sushma Dahal is a criminal lawyer at Legal Access Nepal who shares law career paths and what criminal practice looks like in Nepal.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Dr. Manisha Rokaya',
      title: 'Dental Surgeon, Manab Dental Home',
      imageUrl: '/events/drmanisha.png',
    },
    topic: 'Career in Dentistry',
    audience: 'Aspiring students',
    highlights: [
      'Pathway to becoming a dental surgeon',
      'Setting up a dental clinic',
      'Modern technologies in dental care',
    ],
    bio: 'Dr. Manisha Rokaya is a dental surgeon at Manab Dental Home who walks students through dentistry careers and clinic ownership.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Krijan Gautam',
      title: 'HR Manager',
      imageUrl: '/events/krijan.png',
    },
    topic: 'Career in HR',
    audience: 'Aspiring students',
    highlights: [
      'Core skills for HR professionals',
      'Talent acquisition and team management',
      'Building effective corporate work cultures',
    ],
    bio: 'Krijan Gautam is an HR manager who breaks down what HR careers look like — talent acquisition, people management, and culture work.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Mandira Shrestha',
      title: 'Registered Nurse, Kanti Children’s Hospital',
      imageUrl: '/events/mandira.png',
    },
    topic: 'Career in Nursing',
    audience: 'Aspiring students',
    highlights: [
      'Exploring nursing specialties and roles',
      'Patient care and clinical skills',
      'Global opportunities for registered nurses',
    ],
    bio: 'Mandira Shrestha is a registered nurse at Kanti Children’s Hospital who shares what nursing careers look like and the global paths available.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Subigya Ojha',
      title: 'Project Manager, Webpoint Technology',
      imageUrl: '/events/subigya.png',
    },
    topic: 'Career in Computer Engineering',
    audience: 'Aspiring students',
    highlights: [
      'Navigating computer engineering career paths',
      'Software vs hardware engineering roles',
      'Transitioning to tech project management',
    ],
    bio: 'Subigya Ojha is a project manager at Webpoint Technology who talks through computer engineering paths, software vs hardware, and stepping into tech PM work.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Sarthak KC',
      title: 'Ground Handling, Summit Air',
      imageUrl: '/events/sarthak.png',
    },
    topic: 'Career in Aviation',
    audience: 'Aspiring students',
    highlights: [
      'Ground handling and airport operations',
      'Aviation management career growth paths',
      'Ensuring safety in daily flights',
    ],
    bio: 'Sarthak KC works in ground handling at Summit Air and shares what aviation careers look like beyond the cockpit.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Balaram Parajuli, FCA',
      title: 'Chartered Accountant, B.R. Parajuli and Associates',
      imageUrl: '/events/balaram.png',
    },
    topic: 'Career in Chartered Accountancy',
    audience: 'Aspiring students',
    highlights: [
      'Navigating the rigorous CA exams',
      'Audit, tax, and finance roles',
      'Career prospects for chartered accountants',
    ],
    bio: 'Balaram Parajuli, FCA, walks students through the chartered accountancy path — exams, audit and tax practice, and the careers that follow.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Anjali Sharma',
      title: 'Ex cabin crew, Air Asia and Agni Air',
      imageUrl: '/events/anjali.png',
    },
    topic: 'Career in Air Hostess',
    audience: 'Aspiring students',
    highlights: [
      'How to start a career as cabin crew',
      'Interview preparation and communication skills',
      'Life and responsibilities of an air hostess',
    ],
    bio: 'Anjali Sharma is a former cabin crew member at Air Asia and Agni Air who shares what cabin crew careers look like and how to land one.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Ashwin Neupane',
      title: 'Digital Marketing and AI Content Creator',
      imageUrl: '/home/ashwin.png',
    },
    topic: 'AI Skills for +2 Appeared Students',
    audience: 'Aspiring students',
    highlights: [
      'Essential AI tools for beginners',
      'Enhancing study with AI workflows',
      'Future-proofing your career skills',
    ],
    bio: 'Ashwin Neupane is a digital marketing and AI content creator who walks +2 students through the AI tools that will keep them ahead.',
    durationMinutes: 60,
    seats: 80,
    pricePerSeat: 100,
  },
  {
    guest: {
      name: 'Prayash Poudel',
      title: 'Principal AI Engineer, Leapfrog Technology',
      imageUrl: '/events/prayash.png',
    },
    topic: 'Career in Software Engineering using AI',
    audience: 'Aspiring students',
    highlights: [
      'Integrating AI in software development',
      'Future of coding with AI',
      'Live Q&A on tech careers',
    ],
    bio: 'Prayash Poudel is a principal AI engineer at Leapfrog Technology who talks through how AI is reshaping software engineering careers.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
  {
    guest: {
      name: 'Aashutosh Poudel',
      title: 'Senior Software Engineer, Webpoint Technology',
      imageUrl: '/events/aashutosh.png',
    },
    topic: 'Career in Mobile Development',
    audience: 'Aspiring students',
    highlights: [
      'iOS and Android development paths',
      'Building scalable mobile applications today',
      'Essential frameworks for app developers',
    ],
    bio: 'Aashutosh Poudel is a senior software engineer at Webpoint Technology who shares the iOS/Android development paths and frameworks worth learning.',
    durationMinutes: 60,
    seats: 60,
    pricePerSeat: 150,
  },
]

export function getFeaturedThirtyMaThirtyEvent(): FeaturedThirtyMaThirtyEvent {
  const featuredEvent = events.find((event) => event.guest.name === FEATURED_GUEST_NAME)
  if (featuredEvent) return featuredEvent
  const first = events[0]
  if (!first) throw new Error('No 30 ma 30 events are configured.')
  return first
}
