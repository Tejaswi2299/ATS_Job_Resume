import type { BaselineResume } from "@/types";

export function baselineExtractionPrompt(rawText: string) {
  return `You are extracting a baseline profile from a source resume.
Only retain identity and timeline information.
Do not preserve or infer skills, achievements, summaries, responsibilities, certifications, or projects.
If a field is missing, omit it or leave it blank.

Extract only:
- full name
- email
- phone
- linkedin url
- github url
- location
- employment timeline: company, start date, end date
- education timeline: school, degree, start date, end date

Source resume text:
${rawText}`;
}

export function benchmarkResumePrompt(jobDescription: string, baseline: BaselineResume) {
  return `You are generating a BENCHMARK LEARNING RESUME.
This is not meant to restate the source resume's actual skills.
Use the source resume ONLY for personal identity and timeline anchors:
- full name
- email/phone/links/location
- employer names and employment dates
- education names and dates

Everything else should be rewritten to create the ideal recruiter-targeted profile for the job description.
Rewrite titles, responsibilities, skills, certifications, and projects so they look like a top-fit benchmark candidate.

Rules:
1. Optimize for recruiter skim and ATS coverage.
2. Cover all critical required and preferred skills from the job description.
3. Bullets must be measurable and outcome-oriented.
4. Projects must feel human, real-world, and aligned to the role.
5. Use ATS-safe wording. No tables, graphics, icons, ratings, or columns.
6. Keep the content credible and specific.
7. Add learner notes that explain what skill clusters this target profile demonstrates.
8. Preserve only the companies and date ranges from the baseline employment timeline.
9. Preserve the baseline education schools and dates, but the degree title may be normalized to match the role if missing.

Baseline timeline:
${JSON.stringify(baseline, null, 2)}

Job description:
${jobDescription}`;
}
