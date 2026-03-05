# Arabic Vocabulary Memorization App — Tome 3

## Overview
A frontend-focused study app for memorizing Arabic vocabulary from "Vocabulaire du TOME 3" (29 vocabulary sets). Features include:
- Browse vocabulary by set (N°1 through N°29) via sidebar
- Hide/show Arabic or French text for self-testing
- Contextual stories in Arabic using vocabulary from each set, incorporating advanced grammar:
  - Broken plurals (جموع التكسير)
  - Manṣūbāt (مفعول به, مفعول مطلق, مفعول لأجله, ظرف)
  - Jawāzim (لم, لا الناهية, لمّا)
  - Ism fi'l (هيهات, صه)
  - Muḍāf chains (إضافة)
  - Kāna wa akhawātuhā (كان, أصبح, ظلّ, صار, ليس, ما زال, ما دام, بات, أضحى)
  - Inna wa akhawātuhā (إنّ, أنّ, لكنّ, كأنّ, ليت, لعلّ)
  - Kāda wa ẓanna wa akhawātuhā (كاد, أوشك, ظنّ, حسب, زعم, خال)
  - Fi'l mu'tall (defective verbs)
  - Tamyīz (تمييز), Ḥāl (حال), Numbers (العدد والمعدود), Diptotes (الممنوع من الصرف)
- Story view highlights vocabulary words inline and hides only those when toggled
- Flashcard study mode with shuffle, progress tracking, and direction toggle
- Dark mode support

## Architecture
- **Frontend-only app** - all vocabulary data is static and lives in `client/src/data/vocabulary.ts`
- No database needed (static educational content)
- Backend serves only the frontend (no API routes used)

## Key Files
- `client/src/data/vocabulary.ts` - All 29 vocabulary sets (Tome 3) with words, stories, translations
- `client/src/pages/home.tsx` - Main page with tabs (Vocabulary, Story, Study)
- `client/src/components/vocabulary-card.tsx` - Individual word card with hide/show
- `client/src/components/story-view.tsx` - Arabic story viewer with vocabulary highlighting and translation toggle
- `client/src/components/study-mode.tsx` - Flashcard study mode
- `client/src/components/app-sidebar.tsx` - Sidebar for navigating vocabulary sets
- `client/src/components/theme-toggle.tsx` - Dark/light mode toggle

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS with Shadcn UI components
- Framer Motion for animations
- Wouter for routing (not actively used - single page)
- Amiri + Noto Naskh Arabic fonts for Arabic text

## Word Types
- noun, verb, adjective, adverb, preposition, expression

## Design
- Green primary color (hsl 142)
- Plus Jakarta Sans for UI, Amiri for Arabic text
- Responsive grid layout for vocabulary cards
