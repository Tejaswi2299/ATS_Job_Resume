# Benchmark Resume Studio

A GitHub-ready starter project for generating **benchmark ATS resumes** from a pasted job description and a base resume.

## What this app does

1. The user pastes a full job description.
2. The app asks the user to select a previously uploaded resume or upload a new one.
3. The resume parser extracts only:
   - name
   - contact links
   - employer names and date ranges
   - education names and dates
4. The generator builds a **benchmark learning resume** that rewrites everything else around the job description:
   - summary
   - titles
   - skills
   - responsibilities
   - certifications
   - projects
5. The app renders a live preview and lets the user export **DOCX** and **PDF** versions.

## Why this project structure works

- Keeps the uploaded resume useful without being locked to the original skill set.
- Lets users see the exact target profile a recruiter would likely shortlist.
- Produces ATS-safe output: single column, plain text hierarchy, measurable bullets, and clean export formats.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- OpenAI Responses API with structured JSON output
- Mammoth for DOCX parsing
- pdf-parse for PDF parsing
- docx for Word export
- @react-pdf/renderer for PDF export

## Key routes

- `POST /api/upload-resume` — upload and parse a resume into timeline metadata
- `GET /api/resumes` — list saved resumes
- `POST /api/generate-resume` — generate the benchmark resume JSON
- `POST /api/export/docx` — export DOCX
- `POST /api/export/pdf` — export PDF

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the environment variable:

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5.4
```

## Suggested production upgrades

- Use object storage such as S3 or Supabase instead of local file storage.
- Add authentication.
- Add a manual "Edit timeline anchors" step before generation.
- Add multiple output modes:
  - benchmark learning resume
  - truthful tailored resume
  - recruiter-shortlist benchmark
- Add JD keyword heatmap and match scoring.
- Save past generations and version history.
- Add PDF preview thumbnails.
- Add GitHub or LinkedIn project ingestion for stronger project sections.

## Prompt design

The generator is intentionally split into two steps:

### 1. Baseline extraction
Uses the uploaded resume only for identity and timeline anchors.

### 2. Benchmark generation
Uses the job description plus the baseline anchors to create the ideal recruiter-facing target profile.

This makes the output more controllable and easier to explain to users.

## Important product note

This app is best positioned as a **learning and benchmarking tool**. The UI copy already explains that it generates the target profile for a role so users can understand what skills and projects the market expects.
