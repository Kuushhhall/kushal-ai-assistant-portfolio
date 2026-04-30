# Graph Report - .  (2026-04-30)

## Corpus Check
- 86 files · ~187,265 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 229 nodes · 239 edges · 16 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Frontend Stack|Frontend Stack]]
- [[_COMMUNITY_Chat Interface Components|Chat Interface Components]]
- [[_COMMUNITY_API Routes & Handlers|API Routes & Handlers]]
- [[_COMMUNITY_UI Components Library|UI Components Library]]
- [[_COMMUNITY_Portfolio Projects|Portfolio Projects]]
- [[_COMMUNITY_DevOps & Infrastructure|DevOps & Infrastructure]]
- [[_COMMUNITY_MLAI Skills|ML/AI Skills]]
- [[_COMMUNITY_Voice Features|Voice Features]]
- [[_COMMUNITY_Theme & Styling|Theme & Styling]]
- [[_COMMUNITY_Professional Profiles|Professional Profiles]]
- [[_COMMUNITY_Verification Systems|Verification Systems]]
- [[_COMMUNITY_Component Group 12|Component Group 12]]
- [[_COMMUNITY_Component Group 21|Component Group 21]]
- [[_COMMUNITY_Component Group 38|Component Group 38]]
- [[_COMMUNITY_Component Group 39|Component Group 39]]
- [[_COMMUNITY_Component Group 40|Component Group 40]]

## God Nodes (most connected - your core abstractions)
1. `React` - 46 edges
2. `AI-Native Portfolio` - 20 edges
3. `Framer Motion` - 20 edges
4. `Kushal Jain` - 15 edges
5. `StreamingAudioBuffer` - 9 edges
6. `AudioLevelSmoother` - 5 edges
7. `AI Tutor: Voice-Interactive Learning Platform` - 5 edges
8. `Real-Time Parking Occupancy Detection System` - 5 edges
9. `submitQuery()` - 4 edges
10. `useVoiceConversation()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Kushal Jain` --implements--> `AI-Native Portfolio`  [EXTRACTED]
  public/Resume_Kushal_Jain.pdf → README.md
- `Kushal Jain` --references--> `LinkedIn Profile`  [EXTRACTED]
  public/Resume_Kushal_Jain.pdf → README.md
- `Kushal Jain` --references--> `GitHub Profile`  [EXTRACTED]
  public/Resume_Kushal_Jain.pdf → README.md
- `Kushal Jain` --references--> `Instagram Profile`  [EXTRACTED]
  public/Resume_Kushal_Jain.pdf → README.md
- `AI-Native Portfolio` --implements--> `Logo KJ`  [EXTRACTED]
  README.md → public/logo-kushal.svg

## Hyperedges (group relationships)
- **Frontend Technology Stack** — nextjs_15, typescript, tailwind_css, framer_motion, radix_ui, shadcn_ui [EXTRACTED 1.00]
- **ML and AI Skills** — pytorch, tensorflow, yolov5, langchain, python_lang, neo4j [EXTRACTED 1.00]
- **DevOps and Containerization** — docker, kubernetes, fastapi [EXTRACTED 1.00]
- **Kushal's Portfolio Projects** — ai_tutor_project, workload_prediction_project, parking_detection_project [EXTRACTED 1.00]
- **Hackathon and Academic Achievements** — bits_pilani_hackathon, student_achiever_award, pune_mahametro_hackathon [EXTRACTED 1.00]
- **Kushal's Social and Professional Profiles** — linkedin_profile, github_profile, instagram_profile, ai_portfolio_project [EXTRACTED 1.00]
- **Portfolio UI Components** — landing_page, chat_component, projects_showcase, skills_section [EXTRACTED 1.00]

## Communities

### Community 0 - "Frontend Stack"
Cohesion: 0.05
Nodes (1): React

### Community 1 - "Chat Interface Components"
Cohesion: 0.06
Nodes (1): Framer Motion

### Community 2 - "API Routes & Handlers"
Cohesion: 0.09
Nodes (24): AI Tutor: Voice-Interactive Learning Platform, BITS Pilani National Hackathon Winner, Computer Vision, Docker, FastAPI, Flask, Full-Stack Development, GenAI Applications (+16 more)

### Community 3 - "UI Components Library"
Cohesion: 0.1
Nodes (21): AI Chatbot Feature, AI-Native Portfolio, Chat Interface, DeepSeek AI, GitHub Repository, Landing Page, Logo KJ, Landing Page Memoji Avatar (+13 more)

### Community 4 - "Portfolio Projects"
Cohesion: 0.18
Nodes (5): createVoiceAudioContext(), pcmToWav(), StreamingAudioBuffer, writeString(), handleStop()

### Community 5 - "DevOps & Infrastructure"
Cohesion: 0.24
Nodes (4): onSubmit(), submitQuery(), handleDrawerQuestionClick(), handleQuestionClick()

### Community 6 - "ML/AI Skills"
Cohesion: 0.29
Nodes (7): getScrollDistance(), handleCardClose(), handleClose(), isMobile(), onKeyDown(), scrollLeft(), scrollRight()

### Community 7 - "Voice Features"
Cohesion: 0.25
Nodes (4): useMurfTTS(), useSpeechRecognition(), useVoiceActivity(), useVoiceConversation()

### Community 8 - "Theme & Styling"
Cohesion: 0.29
Nodes (2): AudioLevelSmoother, useFluidCursor()

### Community 9 - "Professional Profiles"
Cohesion: 0.6
Nodes (3): handleClick(), handleKeyDown(), navigateToRepo()

### Community 10 - "Verification Systems"
Cohesion: 0.67
Nodes (2): errorHandler(), POST()

### Community 12 - "Component Group 12"
Cohesion: 0.67
Nodes (1): GET()

### Community 21 - "Component Group 21"
Cohesion: 1.0
Nodes (2): PyTorch, TensorFlow

### Community 38 - "Component Group 38"
Cohesion: 1.0
Nodes (1): Namecheap

### Community 39 - "Component Group 39"
Cohesion: 1.0
Nodes (1): Mistral AI Setup

### Community 40 - "Component Group 40"
Cohesion: 1.0
Nodes (1): README Photo

## Knowledge Gaps
- **38 isolated node(s):** `Next.js 15`, `TypeScript`, `Tailwind CSS`, `Radix UI`, `shadcn/ui` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Frontend Stack`** (44 nodes): `AnimatedShinyText()`, `Avatar()`, `AvatarFallback()`, `AvatarImage()`, `Badge()`, `cn()`, `ChatBubbleAvatar()`, `Crazy()`, `FluidCursor()`, `RootLayout()`, `Page()`, `React`, `ScrollArea()`, `ScrollBar()`, `Separator()`, `page.tsx`, `layout.tsx`, `chat-message-content.tsx`, `crazy.tsx`, `FluidCursor.tsx`, `animated-shiny-text.tsx`, `sport.tsx`, `theme-provider.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `button-with-tooltip.tsx`, `chat-bubble.tsx`, `drawer.tsx`, `input-landing.tsx`, `scroll-area.tsx`, `separator.tsx`, `textarea.tsx`, `ThemeToggle.tsx`, `tooltip.tsx`, `turbo-title.tsx`, `use-outside-click.tsx`, `cn()`, `ThemeProvider()`, `ThemeToggle()`, `Tooltip()`, `TooltipContent()`, `TooltipProvider()`, `useOutsideClick()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat Interface Components`** (34 nodes): `handleNext()`, `handlePrev()`, `isActive()`, `randomRotateY()`, `ChatBottombar()`, `mouseEnterHandler()`, `mouseLeaveHandler()`, `Framer Motion`, `InternshipCard()`, `goToChat()`, `closePhoto()`, `getGridClasses()`, `openPhoto()`, `handleDownload()`, `Skills()`, `SparklesCore()`, `page.tsx`, `chat-bottombar.tsx`, `chat-landing.tsx`, `simple-chat-view.tsx`, `InternshipCard.tsx`, `photos.tsx`, `presentation.tsx`, `resume.tsx`, `skills.tsx`, `animated-testimonials.tsx`, `compare.tsx`, `sparkles.tsx`, `live-transcript.tsx`, `voice-conversation-ui.tsx`, `waveform-visualizer.tsx`, `welcome-modal.tsx`, `handleToggle()`, `trigger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme & Styling`** (7 nodes): `AudioLevelSmoother`, `.constructor()`, `.level()`, `.reset()`, `.update()`, `use-FluidCursor.tsx`, `useFluidCursor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verification Systems`** (4 nodes): `errorHandler()`, `POST()`, `route.ts`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Component Group 12`** (3 nodes): `GET()`, `route.ts`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Component Group 21`** (2 nodes): `PyTorch`, `TensorFlow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Component Group 38`** (1 nodes): `Namecheap`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Component Group 39`** (1 nodes): `Mistral AI Setup`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Component Group 40`** (1 nodes): `README Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React` connect `Frontend Stack` to `Chat Interface Components`, `API Routes & Handlers`, `DevOps & Infrastructure`, `ML/AI Skills`, `Voice Features`, `Professional Profiles`, `Component Group 11`, `Component Group 14`?**
  _High betweenness centrality (0.449) - this node is a cross-community bridge._
- **Why does `Framer Motion` connect `Chat Interface Components` to `UI Components Library`, `DevOps & Infrastructure`, `ML/AI Skills`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **Why does `AI-Native Portfolio` connect `UI Components Library` to `Chat Interface Components`, `API Routes & Handlers`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Kushal Jain` (e.g. with `Computer Vision` and `ML Systems`) actually correct?**
  _`Kushal Jain` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Next.js 15`, `TypeScript`, `Tailwind CSS` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Stack` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Chat Interface Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._