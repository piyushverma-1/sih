# 🎓 InternSetu — Smart Internship & Job Readiness Platform

> **Smart India Hackathon (SIH) Prototype**  
> *Bridging the gap between students and industry through AI-driven ATS scoring, Career Twin evidence verification, and adaptive job readiness indexing.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.7-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.15-orange?style=flat-square)](https://github.com/pmndrs/zustand)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Complete Feature Breakdown](#-complete-feature-breakdown)
  - [1. Multi-Format Resume Intelligence & ATS Scorer](#1-multi-format-resume-intelligence--ats-scorer)
  - [2. The Career Twin & Evidence Verification Matrix](#2-the-career-twin--evidence-verification-matrix)
  - [3. Job Readiness Index (JRI) Mathematical Engine](#3-job-readiness-index-jri-mathematical-engine)
  - [4. Semantic Search & Weighted Skill Matching](#4-semantic-search--weighted-skill-matching)
  - [5. Timed Adaptive Multi-Discipline Assessment Engine](#5-timed-adaptive-multi-discipline-assessment-engine)
  - [6. Personalized Milestone Roadmap & Resource Curation](#6-personalized-milestone-roadmap--resource-curation)
  - [7. Skill Quest: Gamified RPG-HUD & Badge Locker](#7-skill-quest-gamified-rpg-hud--badge-locker)
  - [8. Dual-Criteria Internship Discovery & Why-Matched Breakdown](#8-dual-criteria-internship-discovery--why-matched-breakdown)
  - [9. Kanban Application Lifecycle Tracker](#9-kanban-application-lifecycle-tracker)
  - [10. Career Simulator ("What If You Pivoted?")](#10-career-simulator-what-if-you-pivoted)
  - [11. Live JD Analyzer & AI Resume Bullet Generator](#11-live-jd-analyzer--ai-resume-bullet-generator)
  - [12. Verified Digital Portfolio & One-Click PDF Generator](#12-verified-digital-portfolio--one-click-pdf-generator)
- [UI & Route Sitemap](#-ui--route-sitemap)
- [Algorithmic Specifications & Mathematical Models](#-algorithmic-specifications--mathematical-models)
- [Tech Stack & Library Justifications](#-tech-stack--library-justifications)
- [Data Models & Schema Reference](#-data-models--schema-reference)
- [Local Installation & Setup](#-local-installation--setup)
- [Contributing & Roadmap](#-contributing--roadmap)

---

## 🌟 Executive Summary & Problem Statement

### The Problem
In today's collegiate landscape, over **80% of engineering students struggle to secure internships**, while tech recruiters face an influx of hundreds of generic resumes per opening:
1. **The "Black Box" ATS Trap**: Students submit PDF/DOCX resumes without knowing how enterprise Applicant Tracking Systems (ATS) evaluate their formatting, keywords, or structure.
2. **Unverified Claims**: Traditional portals let applicants check boxes for skills without verification, forcing recruiters to rely on crude filters (college tier or GPA cutoffs).
3. **Missing Feedback Loops**: Rejected applicants never learn *why* they were disqualified or what actionable skills they need to learn next.
4. **Mismatched Roles**: Students are often uncertain which career path aligns with their current skills, or how pivoting (e.g. from Frontend to Java Backend) affects their employability.

### The InternSetu Solution
**InternSetu** is a comprehensive, student-first career acceleration platform developed for the **Smart India Hackathon**. It bridges students and recruiters through a transparent, evidence-based paradigm:
- **Instant ATS Transparency**: In-browser parsing of PDF, DOCX, and TXT resumes across a 7-dimensional scoring rubric.
- **Evidence-Backed Career Twin**: Skills are verified across multiple channels (Resume + Projects + Adaptive Assessments), transforming self-proclaimed claims into trusted proof.
- **Explainable Job Readiness Index (JRI)**: A multi-factor mathematical score that tells the student exactly where they stand and calculates projected gains for every action taken.
- **Closed-Loop Action Pathway**: Instead of dead-end rejections, InternSetu pinpoints the student's `#1 Top Blocker`, prescribes curated open-access resources, and offers instant re-testing to verify mastery.

---

## 🏗 System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                       |
|                                                                                         |
|   +-------------------+     +-------------------------+     +-----------------------+   |
|   |  Resume Upload    |     |    Zustand Store (Z)    |     |   Adaptive Assessment |   |
|   |  (PDF/DOCX/TXT)   |     |   `useCareerTwin`       |     |   Engine (90 min)     |   |
|   +---------+---------+     |   - StudentProfile      |     +-----------+-----------+   |
|             |               |   - ParsedResume & ATS  |                 |               |
|             v               |   - SkillEvidence[]     |                 v               |
|   +-------------------+     |   - JRI Breakdown       |     +-----------------------+   |
|   |   Local Parser    |---->|   - Quests & Streaks    |<----| Skill Promotion       |   |
|   |  & ATS Evaluator  |     |   - Kanban Applications |     | (Score >= 80% -> Met) |   |
|   +-------------------+     +------------+------------+     +-----------------------+   |
|             |                            |                                              |
|             v                            v                                              |
|   +-------------------+     +-------------------------+     +-----------------------+   |
|   |  Semantic Search  |     |  Interactive Views:     |     | One-Click PDF Export  |   |
|   |  (TF-IDF IR Model)|     |  Dashboard, Simulator,  |     | & Verified Public URL |   |
|   +-------------------+     |  Gap Matrix, Roadmap    |     +-----------------------+   |
|                             +------------+------------+                                 |
+------------------------------------------|----------------------------------------------+
                                           | HTTP JSON Sync
                                           v
+-----------------------------------------------------------------------------------------+
|                                  NEXT.JS BACKEND                                        |
|                                                                                         |
|   +--------------------------------------+     +------------------------------------+   |
|   | API Route Handler (`/api/profile`)   |     | File-Based Persistence Engine      |   |
|   | GET / POST / DELETE                  |---->| Atomic `.data/profile.json` Store  |   |
|   +--------------------------------------+     +------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

---

## 🚀 Complete Feature Breakdown

### 1. Multi-Format Resume Intelligence & ATS Scorer
- **Zero-Dependency Native Parsing (`src/lib/resume-parser.ts`)**:
  - **PDF Documents**: Direct parsing of binary stream buffers, extraction of `Tj` text operators, octal character decode, and whitespace normalization without requiring server-side Python or poppler dependencies.
  - **Word DOCX Documents**: ZIP-container inspection targeting `word/document.xml` to parse `<w:t>` XML tokens.
  - **Text & Markdown**: Full UTF-8 extraction and newline preservation.
- **Intelligent Entity Recognizers**:
  - Contact information detection (RFC-5322 email regex, international phone numbers, profile links to GitHub, LinkedIn, Behance, Dribbble, Figma).
  - Education history parser detecting degree acronyms (`B.Tech`, `BCA`, `M.Tech`, `B.Sc`, `MBA`), branch/field, and graduation year ranges.
  - Experience & project extraction with company names, roles, date intervals, and technology badges.
  - Impact verb classifier (`built`, `optimized`, `reduced`, `shipped`, `architected`, `automated`) and numerical metric quantification counter (`35%`, `2x`, `12k MAU`, `180ms`).
- **7-Dimension Enterprise ATS Scoring (`src/lib/ats-scorer.ts`)**:
  1. **Skills Density** (20%): Evaluates breadth and relevance against target roles.
  2. **Experience Quality** (20%): Evaluates role count, bullet count, and tenure.
  3. **Contact Information** (15%): Verifies presence of name, phone, email, and external links.
  4. **Education Depth** (15%): Verifies institution, degree, field, and year.
  5. **Projects Quality** (10%): Scans project portfolio and tech stack diversity.
  6. **Formatting & Structure** (10%): Flags resumes that are too short (<180 words), too long (>1200 words), or lack proper section breaks.
  7. **Impact Quantification** (10%): Measures use of hard metrics and strong action verbs.
- **Actionable ATS Feedback & Fix Cards**:
  - Produces dynamic `strengths` and `improvements`.
  - Provides pre-formatted **"Before vs. After"** bullet transformations that students can copy to their clipboard in one click.

---

### 2. The Career Twin & Evidence Verification Matrix
InternSetu rejects the notion of "self-proclaimed" skills. Instead, every skill in the candidate's profile is tracked via an evidence-backed tri-state model:

```
[ UNVERIFIED (0.2) ] -----> [ PARTIAL (0.6) ] -----> [ VERIFIED (0.95) ]
  (Self-claimed /             (Found on Resume OR      (Found in >=2 sources OR
   Target Role Gap)            Verified Project)        Scored >=80% in Assessment)
```

- **Verification Sources**:
  - `RESUME`: Extracted from raw resume text or technical skills section.
  - `PROJECT`: Evidenced in a parsed or submitted project tech stack.
  - `ASSESSMENT`: Proved by scoring >= 80% on tagged domain questions in the timed assessment.
  - `SELF`: Manually added or selected during onboarding.
- **Interactive Gap Matrix (`src/app/student/skills/page.tsx`)**:
  - Compares candidate skills directly against industry target roles (e.g. *Full-Stack Developer*, *Java Backend Developer*, *Data Scientist*).
  - Sorts gaps by priority: `Critical` (High-weight requirement unfulfilled), `High`, and `Medium`.
  - Highlights the **#1 Top Roadblock** ("*Your biggest roadblock is Next.js for Full-Stack Developer*") and routes the student directly to verification.

---

### 3. Job Readiness Index (JRI) Mathematical Engine
The **Job Readiness Index (JRI)** is a holistic score (0–100) reflecting a student's real-world employability:

$$\text{JRI} = \text{round}\Big(0.20 \cdot \text{Resume} + 0.25 \cdot \text{Technical} + 0.25 \cdot \text{Assessment} + 0.15 \cdot \text{Projects} + 0.10 \cdot \text{Aptitude} + 0.05 \cdot \text{Profile}\Big)$$

#### Weight Distribution
| Dimension | Weight | Description |
| :--- | :---: | :--- |
| **Technical Skills** | **25%** | Percentage of verified skills (Verified = 100%, Partial = 50%) |
| **Assessment Score** | **25%** | Score achieved in the comprehensive 90-minute assessment |
| **Resume ATS Health** | **20%** | Overall 7-dimension ATS benchmark score |
| **Projects Score** | **15%** | Scaled project portfolio (25 pts per project, up to 100 pts) |
| **Aptitude Score** | **10%** | Average performance in Quantitative and Verbal reasoning |
| **Profile Completeness** | **5%** | Contact details, college, branch, CGPA, and social links |

#### Readiness Bands
- **Top Candidate** (>= 85): Ready for premier product companies and high-stipend roles.
- **Strong** (70 - 84): Solid candidate meeting all baseline engineering requirements.
- **Ready** (55 - 69): Eligible for entry-level internships with minor skill polishing.
- **Developing** (35 - 54): Foundational knowledge present; requires structured project work.
- **Beginner** (< 35): Early stage; needs onboarding and core fundamentals.

#### Projected Gains Engine
Explains *why* the student has their current score and calculates dynamic "what-if" score increases:
- `+3 pts` if you verify Docker
- `+4 pts` if you add 1 more project to your resume
- `+7 pts` if you score >= 80% in the assessment

---

### 4. Semantic Search & Weighted Skill Matching
- **TF-IDF Vector Space Retrieval (`src/lib/semantic-search.ts`)**:
  - Indexes all internship postings across titles, locations, descriptions, and required stacks.
  - Expands candidate queries with resume tokens, project descriptions, detected skills, and domain aliases.
  - Employs sub-linear term frequency scaling with Euclidean document length normalization:
    $$\text{Score}(q, d) = \frac{1}{\sqrt{|d|}} \sum_{t \in q \cap d} \text{IDF}(t) \cdot (1 + \ln(\text{TF}_{t, d}))$$
  - Returns ranked hits with semantic explanations: *"matches your skills: React, TypeScript; shared context: dashboard, B2B"*.
- **Weighted Skill Matching (`src/lib/skill-matcher.ts`)**:
  - Compares candidate skills against job requirements weighted by importance (1 - 10).
  - Partial credit (50%) awarded for contextual matches in experience bullet points.

---

### 5. Timed Adaptive Multi-Discipline Assessment Engine
- **90-Minute Timed Test Environment (`src/app/student/assessment/page.tsx`)**:
  - Full timer with visual warnings, question palette, and section switcher.
  - Real-time status palette tracking:
    - 🟢 **Answered**
    - 🟣 **Marked for Review**
    - ⚪ **Unanswered**
    - 🔵 **Current Question**
- **4 Comprehensive Question Sections (`src/mock/questions.ts`)**:
  1. **Technical**: Role-specific engineering across Web, Java, Python/Data Science, Mobile, and UI/UX.
  2. **DSA**: Data structures, Big-O complexity, binary search, tree traversals, Dijkstra, and sorting algorithms.
  3. **Verbal Ability**: Syllogisms, coding-decoding, reading comprehension, analogies, and grammatical correction.
  4. **Quantitative Aptitude**: Time-speed-distance, probability, compound interest, permutations, and algebra.
- **Question Typologies**:
  - Conceptual Multiple Choice (MCQ)
  - Code Output Prediction
  - Code Debugging & Syntax Bug Identification
- **Automated Skill Promotion**:
  - Every question is tagged with a `skillTag` (e.g., `react`, `sql`, `spring`, `dsa`, `stats`).
  - Upon submission, the engine evaluates accuracy per skill tag. Scoring >= 80% on tagged questions automatically promotes that skill to `VERIFIED` status in the student's Career Twin!

---

### 6. Personalized Milestone Roadmap & Resource Curation
- **5-Stage Milestone Pathway (`src/app/student/roadmap/page.tsx`)**:
  $$\text{Gap Identified} \longrightarrow \text{Learn Module} \longrightarrow \text{Practice Task} \longrightarrow \text{Build Project} \longrightarrow \text{Re-assess \& Verify}$$
- **Curated Open-Access Resource Hub (`src/mock/resources.ts`)**:
  - Directly maps identified skill gaps to curated tutorials from **freeCodeCamp**, **MDN Web Docs**, **NPTEL**, **LeetCode**, **GeeksforGeeks**, and **Official Docs**.
  - Displays estimated duration (e.g. `2h`, `6h`, `40h`) and difficulty levels (`Beginner`, `Intermediate`, `Advanced`).

---

### 7. Skill Quest: Gamified RPG-HUD & Badge Locker
- **Experience Points (XP) & Progression (`src/app/student/skill-quest/page.tsx`)**:
  - Level formula: $\text{Level} = 1 + \lfloor \frac{\text{XP}}{500} \rfloor$.
  - Students earn XP for uploading resumes (+50 XP), taking assessments (+100 XP), and verifying skills.
- **Daily Streak Tracker**:
  - Promotes consistent learning through activity streaks with animated fire indicators.
- **Mission Board Quests**:
  - *Resume Master*: Score >= 80% on ATS scoring (+50 XP).
  - *Aptitude Ace*: Clear the Quantitative section (+100 XP).
  - *Full-Stack Artisan*: Verify 3 backend skills (+250 XP).
  - *Streak Keeper*: Maintain a 3-day streak (+30 XP).
  - *Project Builder*: List 3+ verified projects (+80 XP).
- **Unlockable Badges**:
  - 📄 Resume Master
  - 🧮 Quant Ace
  - ⚡ DSA Decimator
  - 🛠️ Verifier
  - 🔥 Streak Keeper

---

### 8. Dual-Criteria Internship Discovery & Why-Matched Breakdown
- **Fixed vs. Improvable Eligibility Engine (`src/app/student/internships/[id]/page.tsx`)**:
  - **Fixed Criteria (Hard Pass/Fail)**:
    - Minimum CGPA cutoff (e.g. >= 6.5)
    - Eligible branches (e.g. `CSE`, `IT`, `ECE`)
    - Graduation year eligibility (e.g. `2026`, `2027`, `2028`)
    - *If fixed criteria fail, the application is disabled with clear explanations.*
  - **Improvable Criteria (Actionable Gaps)**:
    - Specific skills required by the company.
    - Direct links to *"Open Quest"* or *"Take Assessment"* to turn a rejection into an interview.
- **"Why This Match?" Explainability Modal (`src/app/student/internships/page.tsx`)**:
  - Transparent point-by-point breakdown of the candidate's match percentage:
    - Skills Fit (50 pts)
    - Education Fit (20 pts)
    - Experience Fit (10 pts)
    - Assessment Fit (15 pts)

---

### 9. Kanban Application Lifecycle Tracker
- **Stage Management (`src/app/student/applications/page.tsx`)**:
  - Full lifecycle tracking across 6 distinct pipeline columns:
    1. `Applied`
    2. `Shortlisted`
    3. `Online Assessment`
    4. `Technical Interview`
    5. `Selected`
    6. `Rejected`
- **Application History & Interview Notes**:
  - Automatically records timestamped audit logs whenever a candidate advances through a stage.
  - Integrated private note-taking area for interview preparation and HR contact details.

---

### 10. Career Simulator ("What If You Pivoted?")
- **Instant Role Pivot Sandbox (`src/app/student/career-simulator/page.tsx`)**:
  - Lets students simulate switching their career target across 10 industry roles:
    - Full-Stack Developer
    - Java Backend Developer
    - Python Developer
    - Data Analyst
    - Data Scientist
    - Cybersecurity Analyst
    - Cloud Engineer
    - DevOps Engineer
    - AI/ML Engineer
    - UI/UX Designer
  - Recalculates JRI, identifies new top roadblocks, and highlights academic eligibility differences in real time without overwriting their primary profile.

---

### 11. Live JD Analyzer & AI Resume Bullet Generator
- **Job Description Semantic Matching (`src/app/student/job-analyzer/page.tsx`)**:
  - Paste any external job description to generate an instant semantic compatibility score.
  - Highlights exact keyword hits and identifies critical missing requirements.
- **Impact Bullet Generator**:
  - Provides pre-engineered, metric-driven resume bullet points tailored to the specific role that students can copy directly into their resume.

---

### 12. Verified Digital Portfolio & One-Click PDF Generator
- **Shareable Public Profile (`src/app/student/portfolio/page.tsx`)**:
  - Toggle between **Public** and **Private** visibility.
  - Generates a shareable vanity link: `https://skillbridge.local/p/student-name`.
  - Displays verified skills with badges showing proof sources (e.g. *Verified by RESUME + ASSESSMENT*).
- **One-Click Print & PDF Generator**:
  - Generates a clean, ATS-formatted printable HTML resume view styled specifically for browser printing or saving as PDF.

---

## 🗺 UI & Route Sitemap

```
├── /                                   Landing page with platform overview & quick start
├── /auth
│   ├── /login                          Student login via academic email
│   └── /signup                         Career Twin creation (College, Branch, CGPA, Grad Year)
├── /onboarding                         4-Step Progressive Onboarding Flow
│   ├── /profile                        Step 1: Academic & personal credentials
│   ├── /interests                      Step 2: Technology domain selection
│   ├── /roles                          Step 3: Target role selection (up to 2 roles)
│   └── /resume                         Step 4: Drag-and-drop resume upload & parsing
├── /student                            Authenticated Student Portal (Shell Layout)
│   ├── /dashboard                      Central command center (JRI dial, top blocker, active quests)
│   ├── /resume-analysis                7-dimension ATS analysis, scores & before/after fixes
│   ├── /skills                         Evidence-based skill matrix & gap analyzer
│   ├── /assessment                     90-minute timed adaptive assessment with live palette
│   │   └── /result                     Assessment scorecard & promoted verified skills
│   ├── /roadmap                        Milestone pathway with curated learning resources
│   ├── /skill-quest                    RPG-style HUD, XP progression, streaks & badges
│   ├── /internships                    Searchable internship catalog with match percentages
│   │   └── /[id]                       Detailed internship spec with Pass/Fail fixed criteria
│   ├── /applications                   Kanban pipeline application tracker
│   ├── /portfolio                      Digital verified portfolio with PDF export & public link
│   ├── /career-simulator               "What if you pivoted?" real-time role sandbox
│   └── /job-analyzer                   Paste external JD for semantic match & bullet suggestions
├── /upload                             Standalone resume upload portal
│   └── /results                        Standalone ATS analysis & semantic search results
└── /api
    └── /profile                        REST endpoint for server-side profile persistence
```

---

## 🧮 Algorithmic Specifications & Mathematical Models

### 1. Job Readiness Index (JRI)
```typescript
const JRI = Math.round(
  0.20 * resumeAtsScore +
  0.25 * technicalSkillsScore +
  0.25 * assessmentScore +
  0.15 * projectsScore +
  0.10 * aptitudeScore +
  0.05 * profileCompleteness
);
```
- **Technical Skills Score**: `(Verified * 100 + Partial * 50) / Total Skills`
- **Projects Score**: `min(100, Project Count * 25)`
- **Aptitude Score**: `(Quant Score + Verbal Score) / 2`
- **Profile Completeness**: Percentage of 6 core profile attributes present.

### 2. Weighted Internship Match Algorithm
```typescript
const totalWeight = requiredSkillIds.reduce((acc, id) => acc + skillWeight(id), 0);
let earnedWeight = 0;

for (const id of requiredSkillIds) {
  if (candidateHasSkill(id)) {
    earnedWeight += skillWeight(id);
  } else if (candidateHasPartialSkill(id)) {
    earnedWeight += skillWeight(id) * 0.5; // 50% partial credit
  }
}

const matchPct = Math.round((earnedWeight / totalWeight) * 100);
```

### 3. Semantic TF-IDF Search Engine
- Token extraction via pattern `/[a-z0-9+#.]+/g` with stopword filtration.
- Term Frequency ($TF$) and Inverse Document Frequency ($IDF$):
  $$\text{IDF}(t) = \ln\left(1 + \frac{N}{1 + \text{DF}(t)}\right)$$
  $$\text{Score} = \frac{1}{\sqrt{L_{\text{doc}}}} \sum_{t} \text{IDF}(t) \cdot (1 + \ln(\text{TF}_t))$$

---

## 💻 Tech Stack & Library Justifications

| Layer | Technology | Version | Justification |
| :--- | :--- | :---: | :--- |
| **Framework** | **Next.js** | `14.2.5` | React Server Components, App Router, and fast client-side transitions. |
| **Language** | **TypeScript** | `5.5.3` | Type-safety across candidate profiles, assessments, and internship schemas. |
| **Styling** | **Tailwind CSS** | `3.4.7` | Custom design system (`brand`, `ink`), responsive utility classes, micro-animations. |
| **Client State** | **Zustand** | `5.0.15` | Lightweight state management with LocalStorage persistence middleware. |
| **Icons** | **Lucide React** | `0.439.0` | Accessible, modern icon set. |
| **File Persistence** | **Node.js `fs`** | Built-in | Atomic file-writing queue for local profile storage (`.data/profile.json`). |
| **Server Limit** | **Server Actions** | Next Config | Configured `bodySizeLimit: 10mb` for handling rich multi-page PDF/DOCX resumes. |

---

## 📊 Data Models & Schema Reference

### `CareerTwin`
```typescript
interface CareerTwin {
  profile: StudentProfile | null;
  ats: AtsResult | null;
  resume: ParsedResume | null;
  skills: SkillEvidence[];
  targetRoleIds: TargetRoleId[];
  interests: string[];
  jri: JobReadinessIndex;
  assessment: {
    lastScore: number;
    lastTechScore: number;
    lastVerbalScore: number;
    lastQuantScore: number;
    lastDsaScore: number;
    completedAt?: string;
  };
  xp: number;
  level: number;
  streak: number;
  applications: ApplicationRecord[];
  portfolioPublic: boolean;
}
```

### `SkillEvidence`
```typescript
interface SkillEvidence {
  skillId: string;
  skillName: string;
  status: "VERIFIED" | "PARTIAL" | "UNVERIFIED";
  confidence: number;
  sources: Array<"RESUME" | "PROJECT" | "ASSESSMENT" | "SELF">;
  assessmentScore?: number;
}
```

### `InternshipOpportunity`
```typescript
interface InternshipOpportunity {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  location: string;
  stipend: string;
  durationWeeks: number;
  domain: string;
  description: string;
  requiredSkillIds: string[];
  niceToHaveSkillIds?: string[];
  fixedCriteria: {
    minCgpa: number;
    branch: string[];
    gradYear: number[];
  };
  improvableCriteria: string[];
  applicants: number;
  postedAt: string;
}
```

---

## ⚡ Local Installation & Setup

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/piyushverma-1/sih.git
cd sih

# 2. Install dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience InternSetu.

### Production Build & Linting
```bash
# Run TypeScript compilation and production build
npm run build

# Start production server
npm run start

# Run ESLint validation
npm run lint
```

---

## 🗺 Contributing & Roadmap

### Future Enhancements for Smart India Hackathon
- [ ] **AI-Powered Voice Mock Interviews**: Integrating browser speech-to-text with LLM interview feedback.
- [ ] **College Placement Cell Portal**: Admin dashboard for TPOs to view cohort readiness scores and batch analytics.
- [ ] **Direct Recruiter Dashboard**: Verified candidate search by verified skills and JRI thresholds.
- [ ] **Automated GitHub Repository Scraping**: Real-time project code validation and complexity analysis.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE). Built with ❤️ for the Smart India Hackathon.