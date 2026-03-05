# Arabic Vocabulary Memorization App

## Overview
A frontend-focused study app for memorizing Arabic vocabulary from "Vocabulaire du Niveau 1" (27 vocabulary sets). Features include:
- Browse vocabulary by set (N°1 through N°27) via sidebar
- Hide/show Arabic or French text for self-testing
- Contextual stories in Arabic using vocabulary from each set
- Flashcard study mode with shuffle, progress tracking, and direction toggle (Arabic→French or French→Arabic)
- Dark mode support
- Search within vocabulary sets

## Architecture
- **Frontend-only app** - all vocabulary data is static and lives in `client/src/data/vocabulary.ts`
- No database needed (static educational content)
- Backend serves only the frontend (no API routes used)

## Key Files
- `client/src/data/vocabulary.ts` - All 27 vocabulary sets with words, stories, translations
- `client/src/pages/home.tsx` - Main page with tabs (Vocabulary, Story, Study)
- `client/src/components/vocabulary-card.tsx` - Individual word card with hide/show
- `client/src/components/story-view.tsx` - Arabic story viewer with translation toggle
- `client/src/components/study-mode.tsx` - Flashcard study mode
- `client/src/components/app-sidebar.tsx` - Sidebar for navigating vocabulary sets
- `client/src/components/theme-toggle.tsx` - Dark/light mode toggle

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS with Shadcn UI components
- Framer Motion for animations
- Wouter for routing (not actively used - single page)
- Amiri + Noto Naskh Arabic fonts for Arabic text

## Design
- Green primary color (hsl 142)
- Plus Jakarta Sans for UI, Amiri for Arabic text
- Responsive grid layout for vocabulary cards
