import type { BaselineResume, ResumeOutput } from "@/types";

export function ResumePreview({ baseline, resume }: { baseline: BaselineResume; resume: ResumeOutput }) {
  return (
    <div className="min-h-[900px] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">{baseline.fullName || "Candidate Name"}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {[baseline.location, baseline.phone, baseline.email, baseline.linkedin, baseline.github].filter(Boolean).join(" | ")}
        </p>
      </div>

      <div className="mt-6 space-y-6 text-sm leading-6 text-slate-800">
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Target Headline</h2>
          <p className="text-lg font-semibold text-slate-900">{resume.headline}</p>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Professional Summary</h2>
          <p>{resume.summary}</p>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Core Skills</h2>
          <p>{resume.skills.join(" | ")}</p>
        </section>

        {!!resume.certifications.length && (
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Certifications</h2>
            <ul className="list-disc space-y-1 pl-5">
              {resume.certifications.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Professional Experience</h2>
          <div className="space-y-5">
            {resume.experience.map((item, idx) => (
              <div key={`${item.company}-${idx}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.startDate} - {item.endDate}</p>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.company}{item.location ? ` • ${item.location}` : ""}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Selected Projects</h2>
          <div className="space-y-5">
            {resume.projects.map((project) => (
              <div key={project.name}>
                <p className="font-semibold text-slate-900">{project.name}</p>
                <p>{project.summary}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <p className="mt-2 text-xs text-slate-500">Environment: {project.environment.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Education</h2>
          <ul className="space-y-2">
            {resume.education.map((edu, idx) => (
              <li key={`${edu.school}-${idx}`}>{[edu.degree, edu.school, edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ""].filter(Boolean).join(" | ")}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Learning Notes</h2>
          <ul className="list-disc space-y-1 pl-5">
            {resume.notesForLearner.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
