# BYC (Book Your Counselling) - Master Homepage Architecture

**Document Type:** UI/UX Content, Flow & Structure Guide
**Framework:** Clean Light Mode (High Trust, SaaS Aesthetic)

## 🎨 0. GLOBAL DESIGN SYSTEM (Rules for Developers)

- **DO NOT hardcode hex codes or font families.** Use the existing global design tokens (CSS variables or Tailwind config) currently active on the site.
- **Surface Colors:** Use Current Theme Pure White for main backgrounds, with Current Theme Off-White/Light Gray for section dividers or subtle card backgrounds.
- **Primary Accent:** Use Current Theme Primary Blue (the vibrant royal blue seen in the current UI).
- **Typography:** Use Current Theme Heading Font for all titles/stats, and Current Theme Body Font for paragraphs.
- **Borders & Shadows:** Rely on negative space. Use soft, diffuse shadows (`shadow-sm` resting, `shadow-lg` on hover). Avoid harsh borders.

---

## 🌊 THE SCROLL FLOW (Section by Section)

### 1. HERO SECTION (The Hook & Search)

**Flow Purpose:** Instantly communicate value and trap the user's intent with a search action.

- **UI/Design:** White background with a very faint structural grid overlay. Center-aligned text.
- **Eyebrow:** Pill tag (White bg, faint border, primary blue text).
  - _Content:_ `✨ 1:1 MENTORSHIP`
- **Headline:** Massive, bold.
  - _Content:_ `Your career journey, ` `<span style="border-bottom: 4px solid var(--theme-mint-green); color: var(--theme-primary-blue);">curated</span>.`
- **Subtext:** Medium gray, relaxed line height.
  - _Content:_ `Connect with world-class mentors from industry giants and top universities to navigate your professional growth with precision.`
- **Search Bar:** Large, pill-shaped white bar, soft shadow.
  - _Placeholder Content:_ `Looking for a Software Engineering mentor?`
  - _Button (Inside Bar):_ Solid Primary Blue pill. Text: `Find Mentor`

### 2. TRUST SLIDER (The Validation)

**Flow Purpose:** Immediate social proof to validate the "world-class" claim in the Hero.

- **UI/Design:** Edge-to-edge solid block using Current Theme Primary Blue.
- **Headline:** Small, uppercase, wide letter-spacing. Pure white text.
  - _Content:_ `OUR MENTORS WORK AT`
- **Slider Elements:** Infinite scrolling marquee. White, bold, uppercase typography.
  - _Content:_ `MADHYAPUR HOSPITAL` • `ASPIRE ACADEMY` • `LEAPFROG` • `SNAPPET` • `WEBPOINT`

### 3. THE 3-PILLARS MODULE (The Routing Engine)

**Flow Purpose:** Force the user to identify themselves (Student, Fresher, Professional) and route them to their specific funnel.

- **UI/Design:** 3 crisp white vertical cards. On hover: slight lift (`-translate-y-1`), larger shadow, and a subtle Primary Blue border appears.
- **Section Header:**
  - _Eyebrow:_ `🎯 TAILORED ADVISORY`
  - _Headline:_ `The Right Guidance, At The Right Time.`
  - _Subtext:_ `Select your current stage to find verified mentors who have already walked your path.`
- **Card 1 (Students):**
  - _Headline:_ `Academic Strategy`
  - _Body:_ `Don't let guesswork dictate your future. Match with academic mentors to select the exact college, stream, or degree based on real market ROI.`
  - _Stat Box (Soft Blue bg):_ `Stop the mismatch before it starts. (72% pick based on social pressure).`
  - _CTA (Primary Blue text, transparent bg):_ `Find Academic Mentors →`
- **Card 2 (Freshers):**
  - _Headline:_ `Fresher Launchpad`
  - _Body:_ `Graduated, qualified, but terrified? Build a recruiter-approved CV, optimize your portfolio, and pass 1:1 mock interview pressure-tests.`
  - _Stat Box (Soft Blue bg):_ `Bypass the rejection pile. (85% of CVs fail recruiter scans).`
  - _CTA (Primary Blue text, transparent bg):_ `Book Interview Prep →`
- **Card 3 (Professionals):**
  - _Headline:_ `Executive & Professional Advisory`
  - _Body:_ `Hit a ceiling at Year 5? Need to resolve an HR crisis, scale sales, or pivot industries? Book 1:1 time with senior industry leaders.`
  - _Stat Box (Soft Blue bg):_ `Break the 5-year ceiling. (60% face mid-career stagnation).`
  - _CTA (Primary Blue text, transparent bg):_ `Consult Industry Leaders →`

### 4. THE HARD STATS (The Logic & Urgency)

**Flow Purpose:** Provide hard, undeniable data that proves the cost of _not_ using BYC.

- **UI/Design:** Massive edge-to-edge block using Current Theme Primary Blue (matching the Trust Slider).
- **Section Headline:** White text, centered, massive margin bottom.
  - _Content:_ `A platform that delivers results.`
- **Data Grid:** 4-column CSS grid. Pure white cards, rounded corners (Current Theme Standard Radius), heavy internal padding (`p-8`). Center-aligned content.
- **Card 1:**
  - _Top Label (Gray):_ `CV Screening`
  - _Giant Stat (Primary Blue):_ `85%`
  - _Bottom Text (Dark Navy):_ `Of standard CVs fail recruiter scan`
- **Card 2:**
  - _Top Label (Gray):_ `Career Direction`
  - _Giant Stat (Primary Blue):_ `72%`
  - _Bottom Text (Dark Navy):_ `Of freshers graduate with no set path`
- **Card 3:**
  - _Top Label (Gray):_ `Communication Skills`
  - _Giant Stat (Primary Blue):_ `65%`
  - _Bottom Text (Dark Navy):_ `Of applicants rejected in interviews due to communication`
- **Card 4:**
  - _Top Label (Gray):_ `Work-Life Balance`
  - _Giant Stat (Primary Blue):_ `60%`
  - _Bottom Text (Dark Navy):_ `Of professional workers face work life stress`

### 5. EXCLUSIVE SESSIONS (The Human Element)

**Flow Purpose:** Show them the actual product—the people.

- **UI/Design:** Clean white background. Horizontal scrolling container or a 4-card grid. High-res images, soft shadows.
- **Headline:** `Learn directly from the practitioners.`
- **Card Content (Dynamic UI):**
  - most of thwe things will be as is.

### 6. TESTIMONIALS (The Social Proof)

**Flow Purpose:** Peer validation. "People like me use this."

- **UI/Design:** Very soft gray/blue background (Current Theme Off-White) to separate from the sections above and below. Masonry grid or a sleek slider.
- **Content:** Minimum 3 cards representing the 3 pillars (1 Student, 1 Fresher, 1 Professional). Real names, real titles. No generic fluff.

### 7. THE SUPPLY-SIDE CTA (Recruit Mentors)

**Flow Purpose:** Convert high-level traffic into platform supply (Mentors).

- **UI/Design:** White background, center-aligned block. Keep it breathable and elegant.
- **Headline:** Bold, dark navy.
  - _Content:_ `Are you a professional looking to share your expertise?`
- **Body:** Medium gray.
  - _Content:_ `Join our community of mentors, share your knowledge, and help shape careers. Inspire the next generation of leaders while earning and growing your professional network.`
- **CTA Button:** Solid Primary Blue pill.
  - _Text:_ `Apply to be a Mentor`

### 8. FAQ & FOOTER

**Flow Purpose:** Answer objections and provide navigation.

- **FAQ UI:** Pure white background. Borderless accordions (pure typography) using Current Theme Primary Blue for the expand/collapse icons (`+`).
- **Footer UI:** Solid Primary Blue background. White text. Clean 4-column grid with links.
  - _Closing Tagline:_ `Designed with structure. Built for people.`
