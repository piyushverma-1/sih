# Roadmap & Job Analyzer — Feature Documentation

> Feature modules for the **Student** side of InternSetu / SkillBridge.
> This document covers uniqueness, workflow, feature breakdown, and implementation details for:
> - `/student/roadmap`
> - `/student/job-analyzer`

---

## Table of Contents
1. [Roadmap](#roadmap)
2. [Job Analyzer](#job-analyzer)
3. [Shared Architecture](#shared-architecture)
4. [User Flows](#user-flows)
5. [Future Enhancements](#future-enhancements)

---

## Roadmap

### What it is
The **Roadmap** turns abstract skill-gap data into a concrete, step-by-step learning plan.  
It connects the student's current profile, target role, detected gaps, and verified skills into a single actionable pathway with curated external resources.

### Uniqueness
- **Gap-driven, not content-driven**: Unlike generic course catalogs, the roadmap is generated from the student's actual skill gaps for their chosen target role.
- **Single biggest blocker surfaced first**: Uses `topBlocker()` to identify the highest-impact missing skill and promotes it as the "Next Best Action".
- **Curated external resources**: Links to freeCodeCamp, MDN, NPTEL, GeeksforGeeks, LeetCode, and official docs — not a proprietary course library.
- **Tight integration with JRI**: Opening the roadmap recomputes the Job Readiness Index live, so the student sees score impact immediately.
- **Verification loop**: The final roadmap step is always "Re-assess & Verify", closing the loop back to the adaptive assessment.

### Workflow
```
Student has target role + resume/skills
          │
          ▼
  buildGapMatrix(roleId)
          │
          ▼
  Filter unverified / partial skills
          │
          ▼
  Sort by requiredWeight descending
          │
          ▼
  topBlocker() → single highest-priority gap
          │
          ▼
  Render:
    - Next Best Action banner
    - 5-step milestone pathway
    - Resources per gap
    - JRI breakdown
          │
          ▼
  Student clicks "Take assessment"
          │
          ▼
  Assessment → skill promotion → JRI update
```

### Feature Details

#### 1. Next Best Action Banner
- Surfaces the single skill whose verification would unlock the most internships.
- Format: *"Verify **Spring Boot** — your biggest blocker for Java Backend Developer."*
- CTA button links directly to `/student/assessment`.

#### 2. Milestone Pathway
A horizontal 5-step visual:
1. **Gap Identified** — skill is missing or partial
2. **Learn Module** — consume curated resources
3. **Practice Task** — hands-on exercises (external links)
4. **Build Project** — apply skill in a real project
5. **Re-assess & Verify** — take assessment to verify skill

#### 3. Curated Resources per Gap
For each unverified/partial skill, the roadmap fetches matching `LEARNING_RESOURCES`:
- Title, source platform, URL, duration, difficulty
- Sources: freeCodeCamp, MDN, NPTEL, GeeksforGeeks, LeetCode, Official docs, YouTube
- Displayed as a card with external link

#### 4. JRI Integration
- `computeJri(twin)` runs on mount and when twin state changes.
- JRI formula: `0.2 × Resume + 0.25 × Tech + 0.25 × Assessment + 0.15 × Projects + 0.1 × Aptitude + 0.05 × Profile`
- Projected gains shown: *"+7 pts if you verify Spring Boot"*

#### 5. Gap Matrix Integration
- Reads from the same `buildGapMatrix()` used in `/student/skills`.
- Shows only the top 6 gaps to avoid overload.
- Each gap card shows: skill name, required level (High/Med/Low), current status (Missing/Partial), impact priority (Critical/High/Medium).

### Data Model
```ts
interface GapRow {
  skillId: string;
  skillName: string;
  requiredLevel: "High" | "Medium" | "Low";
  requiredWeight: number;
  currentLevel: "VERIFIED" | "PARTIAL" | "UNVERIFIED";
  impact: "Critical" | "High" | "Medium";
  domain?: string;
}
```

### Dependencies
- `src/lib/career-engine.ts`: `buildGapMatrix()`, `topBlocker()`, `computeJri()`
- `src/mock/resources.ts`: `LEARNING_RESOURCES`
- `src/types/student.ts`: `TargetRoleId`, `TARGET_ROLE_BY_ID`

---

## Job Analyzer

### What it is
The **Job Analyzer** lets a student paste any live job description and instantly see how well their resume matches it. It provides a semantic similarity score, keyword-level match/miss breakdown, and copy-pastable resume bullet recommendations.

### Uniqueness
- **JD-agnostic**: Works with any company's JD — not limited to InternSetu-posted opportunities.
- **Semantic scoring, not keyword counting**: Reuses the same TF-IDF semantic search engine used for internship matching, so related terms match even when wording differs.
- **Instant, no API round-trip**: Runs entirely client-side using the already-parsed resume and the semantic corpus.
- **Actionable bullets**: Provides ready-to-use resume bullets that align with the JD, with one-click copy.
- **Skill-level granularity**: Shows exactly which skills from the JD the student has vs. is missing, using the same 32-skill taxonomy as the rest of the platform.

### Workflow
```
Student pastes JD into textarea
          │
          ▼
  Create pseudo ParsedResume { ...twin.resume, text: jd }
          │
          ▼
  semanticSearch(pseudo, { limit: 1 })
          │
          ▼
  Extract top hit → match score
          │
          ▼
  Scan JD text for known skills
          │
          ▼
  Classify each skill as:
    - MATCHED: skill in JD AND student has it
    - MISSING: skill in JD AND student lacks it
          │
          ▼
  Render:
    - Left: JD input + match score
    - Right: Keyword chips + suggested bullets
```

### Feature Details

#### 1. JD Input
- Large textarea for pasting any job description.
- Real-time analysis as the student types (debounced via `useMemo`).
- Placeholder text guides the user.

#### 2. Semantic Match Score
- Uses `semanticSearch()` with the JD as the "document" and the student's resume as the "query corpus".
- Returns a floating-point similarity score.
- Displayed prominently below the textarea.

#### 3. Keyword Match / Miss Chips
- Scans the JD text for all 32 known skills from `SKILLS`.
- For each skill found in the JD:
  - **Green chip** + checkmark if student has it
  - **Red chip** + alert icon if student is missing it
- Gives immediate visual feedback on skill gaps for that specific role.

#### 4. Suggested Resume Bullets
- Provides 3 high-impact, JD-aligned resume bullets.
- Each bullet has a **Copy** button using `navigator.clipboard`.
- Bullets are generic but framed to match common JD patterns (metrics, technologies, outcomes).

### Data Model
```ts
// No new types — reuses existing:
type ParsedResume = {
  text: string;           // JD text injected here for scoring
  detectedSkillIds: string[];
  // ... other resume fields
}

interface SemanticSearchHit {
  internship: Internship; // in JD mode, this is the "closest opportunity"
  score: number;          // TF-IDF similarity
  matchedSkills: string[];
  matchedTerms: string[];
  explanation: string;
}
```

### Dependencies
- `src/lib/semantic-search.ts`: `semanticSearch()`, tokenization, TF-IDF scoring
- `src/lib/sample-data.ts`: `SKILLS` taxonomy (32 skills)
- `src/lib/store-z.ts`: `useCareerTwin` for resume access
- `src/types/student.ts`: `ParsedResume` (imported from `@/lib/types`)

---

## Shared Architecture

### Skill Taxonomy
Both features rely on the same 32-skill catalog defined in `src/lib/sample-data.ts`:
```ts
export const SKILLS: Skill[] = [
  { id: "react", name: "React", domain: "web", weight: 9, aliases: [...] },
  { id: "python", name: "Python", domain: "python", weight: 9, aliases: [...] },
  // ... 30 more
];
```
This ensures that a skill identified in a JD is the same skill tracked in the student's profile, assessment, and gap matrix.

### State Management
- Both features use **Zustand** (`useCareerTwin`) for state.
- Roadmap reads: `twin.skills`, `twin.targetRoleIds`, `twin.resume`, `twin.assessment`
- Job Analyzer reads: `twin.resume`, `twin.skills`
- Neither feature writes to the store — they are read-only analysis views.

### Computation Pattern
```ts
// Roadmap
const matrix = useMemo(() => buildGapMatrix(twin, roleId), [twin, roleId]);
const blocker = useMemo(() => topBlocker(matrix), [matrix]);

// Job Analyzer
const result = useMemo(() => semanticSearch(pseudoResume, { limit: 1 }), [jd, twin.resume]);
const matched = useMemo(() => SKILLS.filter(...), [jd, twin.resume]);
const missing = useMemo(() => SKILLS.filter(...), [jd, twin.resume]);
```

---

## User Flows

### Roadmap Flow
1. Student completes onboarding → selects target roles → uploads resume.
2. Student opens `/student/roadmap`.
3. Page computes gap matrix for the first target role.
4. Next Best Action banner shows the biggest blocker.
5. Student sees 5-step pathway + curated resources.
6. Student clicks "Take assessment" → goes to `/student/assessment`.
7. After assessment, skill status updates → JRI recomputes → student returns to roadmap to see updated gaps.

### Job Analyzer Flow
1. Student opens `/student/job-analyzer`.
2. Student pastes a JD from any company website.
3. Page instantly shows:
   - Semantic match score
   - Green/red skill chips
   - 3 suggested resume bullets
4. Student copies bullets and updates their resume.
5. Student can re-analyze by re-pasting the JD.

---

## Implementation Notes

### Files
| File | Purpose |
|------|---------|
| `src/app/student/roadmap/page.tsx` | Roadmap page component |
| `src/app/student/job-analyzer/page.tsx` | Job Analyzer page component |
| `src/lib/career-engine.ts` | `buildGapMatrix()`, `topBlocker()`, `computeJri()` |
| `src/lib/semantic-search.ts` | `semanticSearch()`, TF-IDF engine |
| `src/mock/resources.ts` | `LEARNING_RESOURCES` array |
| `src/types/student.ts` | `TargetRoleId`, `TARGET_ROLE_BY_ID`, `GapRow` |

### Performance
- Both pages use `useMemo` extensively to avoid recomputation.
- `buildGapMatrix` is O(roles × skills) — bounded by max 10 roles × ~30 skills = trivial.
- `semanticSearch` scans a pre-built corpus of 12 opportunities — constant time for demo scale.
- `computeJri` is called only when `twin` changes, not on every render.

### Accessibility
- Semantic HTML: `<main>`, `<header>`, `<section>`, `<nav>`
- Icon + text labels on all interactive elements
- Color contrast: ink-400 for secondary, ink-700 for primary, brand-600 for CTAs
- Focus states on inputs via `focus:border-brand-500 focus:ring-2`

---

## Future Enhancements

### Roadmap
- [ ] Persist roadmap progress per skill (Learn → Practice → Build → Verified)
- [ ] Add estimated time per milestone
- [ ] Show completion percentage per skill
- [ ] Connect to actual course progress if integrated with learning platforms
- [ ] Allow students to mark resources as "completed"
- [ ] Show peer progress: "87% of students who targeted this role also learned Spring Boot first"

### Job Analyzer
- [ ] Save JD analysis history
- [ ] Show side-by-side diff: resume bullets vs. JD requirements
- [ ] Suggest which resume section to update (Summary, Experience, Skills)
- [ ] Generate a cover letter snippet based on JD
- [ ] Compare against multiple JDs at once
- [ ] Export analysis as PDF
- [ ] Integration with company-posted opportunities: one-click "Analyze my fit" from `/student/internships`
