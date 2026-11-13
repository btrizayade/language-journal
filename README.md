# Language Journal

# Build Language Journal — A Narrative Language Learning Platform

Build a focused language-learning web application called **Language Journal**.

The product should feel like a personal digital library where learners explore fictional stories, discover languages and cultures, and improve their writing through continuous narrative experiences.

## MAKE IT YOURS

**Who this tool is for:**

Self-directed language learners who want to improve their reading, listening, cultural understanding, vocabulary, and writing skills through immersive storytelling. The initial audience is Portuguese-speaking learners studying foreign languages at beginner and intermediate levels (A2–B1).

**The task it should help with:**

Help learners study a foreign language through a collection of fictional, serialized stories. Each story is presented as an independent journal, with its own language, characters, cultural setting, and narrative.

Learners consume a new episode regularly through reading, listening, or watching. After each episode, they complete a related writing activity, such as reflecting on an event, writing from a character's perspective, continuing the story, describing a scene, or writing a dialogue.

**How this works today:**

Language learners often use disconnected resources: textbooks, podcasts, videos, vocabulary apps, grammar exercises, and personal notebooks. Their learning activities are fragmented and rarely connected to a continuous narrative.

**What goes wrong:**

Learning can become repetitive and disconnected from meaningful contexts. Students memorize vocabulary without understanding how expressions are used in everyday situations. They also lack a structured way to practice writing and observe their progress over time.

**Who uses the application:**

Individual language learners. Each user has a personal library containing multiple journals. Each journal represents a different story and language.

**Information each journal needs:**

- Journal title and cover image.
- Target language and proficiency level (CEFR).
- Main character and supporting characters.
- Story synopsis and setting.
- Cultural and geographical context.
- Ordered episodes.
- Episode format (reading, listening, or watching).
- Vocabulary, grammar explanations, and cultural notes.
- Writing activity associated with each episode.

Each writing entry should store the episode, date, written content, and completion status.

**Learning workflow stages:**

1. DISCOVER — Browse the library and choose a story.
2. EXPLORE — Read, listen to, or watch the current episode.
3. UNDERSTAND — Explore contextual vocabulary, grammar, and cultural notes.
4. WRITE — Complete the writing activity associated with the episode.
5. SAVE — Save the writing entry in the personal journal.
6. CONTINUE — Access the next episode and follow the continuing story.

**What success looks like:**

A learner can open the application, choose a language journal, follow an ongoing fictional story, understand the cultural context, complete different types of writing activities, and revisit all previous episodes and personal entries.

The experience should encourage consistent learning through curiosity about the characters and their stories, rather than relying on points, rankings, or repetitive exercises.

**Colors and style:**

Create an elegant, literary, cozy, and modern visual identity. The application should resemble a contemporary digital library combined with a personal writing journal.

Suggested palette:
- Cream: #F8F5EF
- Lavender: #B9A7D9
- Soft pink: #EBCBD4
- Sage green: #B8C5B0
- Dark plum: #393044

Use editorial typography, beautiful illustrated book covers, generous whitespace, subtle borders, soft colors, and carefully designed reading and writing spaces.

Avoid a childish educational-app aesthetic, excessive gamification, and the visual conventions of a typical language-learning dashboard.

The interface should be in Brazilian Portuguese. Story content should remain in its target language, with vocabulary translations and cultural explanations in Portuguese.

---

## WHAT TO BUILD

### 1. My Library

Create a library dashboard where users can browse and access their language journals.

Each journal should appear as a beautiful book card containing:
- Cover illustration.
- Title.
- Target language.
- CEFR level.
- Short synopsis.
- Character name.
- Reading progress.

Include sections such as:
- Continue Reading.
- My Journals.
- Discover Stories.

Users should be able to open multiple journals and follow their progress independently.

For the first version, include two fictional journals:

**Journal 1: Les jours de Camille**
- Language: French.
- Level: A2.
- Setting: Montmartre, Paris.
- Main character: Camille Moreau, a 26-year-old woman who works in an independent bookstore.
- Synopsis: Camille discovers an old, forgotten letter inside a second-hand book. Her curiosity leads her to investigate the letter's origin and uncover connections between people in her neighborhood.
- Cultural context: French cafés, bookstores, neighborhood markets, daily routines, informal conversations, and French expressions.

**Journal 2: Zwischen den Straßen**
- Language: German.
- Level: A2.
- Setting: Berlin, Germany.
- Main character: Lukas, a 24-year-old architecture student.
- Synopsis: While exploring Berlin for a university project, Lukas discovers an old photograph and begins investigating the stories behind the city's changing neighborhoods.
- Cultural context: German daily life, public transportation, architecture, bakeries, university life, and local traditions.

These stories must be original fictional narratives. Avoid cultural stereotypes and incorporate cultural details naturally into the characters' lives.

### 2. Journal Details

When opening a journal, display:
- Large illustrated cover.
- Story title and synopsis.
- Character introduction.
- Language and proficiency level.
- Setting and cultural background.
- Episode list with completion indicators.
- Current progress.

Each journal should feel like an independent book with its own identity.

### 3. Episode Experience

Create an immersive reading and learning interface.

Each episode should include:

**Episode introduction**
- Episode title and number.
- Short introduction.
- Narrative context.
- Estimated duration.
- Content format indicator.

**Multimedia content**

Support three episode formats:

- READING: written narratives, letters, messages, and fictional documents.
- LISTENING: voice messages, conversations, interviews, and audio narratives.
- WATCHING: short videos, scenes, and contextualized dialogues.

Include appropriate content players and responsive media layouts.

For audio and video, support media URLs and transcripts. If actual media files are not available, use clearly identified demo placeholders rather than fake playable content.

**Language discovery**

Add a section containing:
- Vocabulary found in the episode.
- Translations into Brazilian Portuguese.
- Example sentences.
- Useful expressions and idioms.
- Grammar explanations when relevant.

Allow the learner to save vocabulary items for later review.

**Cultural notes**

Include contextual explanations about:
- Everyday customs.
- Social interactions.
- Food and traditions.
- Expressions and informal language.
- Local places and cultural references.

Cultural notes should relate directly to the episode.

### 4. Writing Studio

This is one of the central features of the application.

After consuming an episode, the learner should receive a writing activity connected to the events of the story.

Support different activity types:
- Personal reflection.
- Writing from the character's perspective.
- Continuing the story.
- Describing a scene.
- Writing dialogues.
- Letters and messages.
- Summarizing events.
- Cultural comparisons.

Each activity should include:
- A clear writing prompt.
- Instructions in Brazilian Portuguese.
- The target language.
- Suggested word count.
- A comfortable text editor.

Allow learners to save drafts and completed entries.

Do not automatically generate the learner's answers. The purpose is to encourage independent language production.

### 5. My Entries

Create a personal archive containing all writing entries.

Allow users to:
- Browse entries by journal.
- Filter by language.
- Filter by date or episode.
- Open and edit previous entries.
- Compare older and newer writing samples.

Preserve the original content of each entry when creating revisions.

### 6. My Progress

Create a simple progress dashboard showing:
- Active journals.
- Episodes completed.
- Writing entries saved.
- Vocabulary collected.
- Learning activity over time.

Keep statistics meaningful and avoid turning learning into a competitive experience.

---

## FIRST VERSION SCOPE

Keep the initial version focused on the core learning workflow.

Include:
- Two fictional language journals.
- At least three sequential episodes per journal.
- A combination of reading, listening, and watching experiences across the library.
- Different writing activity types.
- Contextual vocabulary and cultural notes.
- A functional writing editor.
- Saved personal entries.
- Basic individual progress tracking.
- Responsive desktop and mobile layouts.

Create realistic fictional sample content for all six initial episodes. Ensure that each episode continues the same story, maintains character consistency, and uses language appropriate to its selected level.

Do not build AI-generated stories or dynamic story generation in this version. All initial narrative content should be predefined and consistent.

Do not implement social features, leaderboards, complex grammar assessment, speech recognition, or advanced analytics yet.

## DATA AND ACCESS

Use Supabase for database persistence and authentication if available.

Suggested data entities:
- Users.
- Languages.
- Journals.
- Characters.
- Episodes.
- EpisodeContent.
- Vocabulary.
- CulturalNotes.
- WritingPrompts.
- WritingEntries.
- UserJournalProgress.

Each user must have private writing entries and independent progress for every journal.

If authentication is implemented, protect personal entries with appropriate database access policies. Do not expose private user data.

Start with fictional demonstration data so the application can be tested without requiring real user information.

## DESIGN AND EXPERIENCE REQUIREMENTS

Prioritize:
- Excellent typography and reading comfort.
- A visually distinctive library.
- Immersive episode pages.
- Distraction-free writing experiences.
- Clear navigation between episodes.
- Consistent visual identity across different journals.
- Mobile-friendly layouts.
- Accessible color contrast, keyboard navigation, and readable text sizes.

The application should feel more like reading and contributing to a collection of literary worlds than using a conventional language-learning platform.

**Important: Build a functional application, not just a static landing page. Prioritize the complete journey from choosing a journal to consuming an episode and saving a writing entry.**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://language-journal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f16489f-3d87-435e-baea-fbaa178f3328).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
