export const BOOKING_SUMMARY = {
  mentor: {
    name: 'Sarah J.',
    title: 'Ivy League Admissions Expert',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChHnqpgmxp0JseIenXPbUqq-LE2FalspaJkrRjwknJQNAdCX8Jw509CclXRN9tVmvww3ZNj9IP9RV5fbRXIqgOBeB8zh1nsgVxQ9n2ch9gpyOVzgwQlhFwGS9KsVCO9qXV9N_LKxn5-o-eL-B9xWW_Jbobt86DsuFz3b7iiVFxQS97gOFYsMsS1VB9sdqwcgJgJ7T0Ab4fnLanIPrOL9eWaSR21ayDexwXjzEmoQesenW4aj1JJ0ejiL4koxO7c7WsPSuVgBfBhlY',
  },
  session: {
    type: 'Intro Call',
    duration: '30 mins',
    date: 'Oct 24, 2023',
    time: '2:00 PM EST',
  },
  price: 45.0,
  // Placeholder mentor profile ID — in production this comes from the route/query params
  mentorId: '64fcb260-4924-44ab-9167-2a2ed0a77f63',
}

export const EDUCATION_LEVEL_OPTIONS = [
  { value: '', label: 'Select Level' },
  { value: 'high_school', label: 'High School' },
  { value: 'undergrad', label: 'Undergraduate' },
  { value: 'postgrad', label: 'Postgraduate' },
  { value: 'other', label: 'Other' },
]
