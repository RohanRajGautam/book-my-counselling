# Book My Counselling

A modern, production-ready Next.js application for booking professional counselling services. Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Features

- 🎨 Modern, responsive design with Tailwind CSS v4
- 🌗 Dark mode support with next-themes
- ♿ Accessibility-first approach
- 🎭 Smooth animations with Framer Motion
- 📱 Mobile-first responsive design
- 🔒 Type-safe with TypeScript
- 🎯 SEO optimized with Next.js metadata API
- 🚀 Optimized performance with Next.js 15

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (new-york style)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Theme:** next-themes
- **Image Optimization:** Sharp

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

\`\`\`bash
git clone <repository-url>
cd book-my-counselling
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles & Tailwind config
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── sections/          # Page sections (Hero, Services, etc.)
│   └── common/            # Reusable components
├── lib/
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # Site configuration
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── public/                # Static assets
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Customization

### Design Tokens

All design tokens (colors, fonts, spacing) are defined in \`src/app/globals.css\` using Tailwind v4's \`@theme\` directive.

### Site Configuration

Update site metadata and navigation in \`src/lib/constants.ts\`.

### Adding Components

Add new shadcn/ui components:

\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

## Performance

This project is optimized for performance:

- Server Components by default
- Optimized fonts with next/font
- Image optimization with next/image
- Code splitting and lazy loading
- Minimal client-side JavaScript

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Screenshots

<img width="3024" height="5257" alt="image" src="https://github.com/user-attachments/assets/f80e092f-fa3c-4782-88d2-f92ffc704bd2" />


<img width="3024" height="1952" alt="image" src="https://github.com/user-attachments/assets/f2646e26-86c2-4bfc-95af-a2a2764bfa8c" />

<img width="3024" height="3314" alt="image" src="https://github.com/user-attachments/assets/246d1fc6-ddc8-448a-ac4a-edfa7ff405c7" />

