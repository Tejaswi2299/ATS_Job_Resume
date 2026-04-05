import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import type { ResumeOutput, BaselineResume } from "@/types";

export function renderResumeMarkdown(resume: ResumeOutput, baseline: BaselineResume) {
  const lines: string[] = [];
  lines.push(baseline.fullName || "Candidate Name");
  lines.push([baseline.location, baseline.phone, baseline.email, baseline.linkedin, baseline.github].filter(Boolean).join(" | "));
  lines.push("");
  lines.push(resume.headline.toUpperCase());
  lines.push("");
  lines.push("SUMMARY");
  lines.push(resume.summary);
  lines.push("");
  lines.push("CORE SKILLS");
  lines.push(resume.skills.join(" | "));
  lines.push("");
  if (resume.certifications.length) {
    lines.push("CERTIFICATIONS");
    resume.certifications.forEach((c) => lines.push(`- ${c}`));
    lines.push("");
  }
  lines.push("PROFESSIONAL EXPERIENCE");
  resume.experience.forEach((item) => {
    lines.push(`${item.title} | ${item.company}${item.location ? ` | ${item.location}` : ""}`);
    lines.push(`${item.startDate} - ${item.endDate}`);
    item.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
    lines.push("");
  });
  lines.push("SELECTED PROJECTS");
  resume.projects.forEach((project) => {
    lines.push(`${project.name}`);
    lines.push(project.summary);
    project.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
    lines.push(`Environment: ${project.environment.join(", ")}`);
    lines.push("");
  });
  lines.push("EDUCATION");
  resume.education.forEach((item) => {
    lines.push([item.degree, item.school, item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : ""].filter(Boolean).join(" | "));
  });
  lines.push("");
  lines.push("LEARNING NOTES");
  resume.notesForLearner.forEach((note) => lines.push(`- ${note}`));
  return lines.join("\n");
}

function boldLine(text: string) {
  return new Paragraph({ children: [new TextRun({ text, bold: true })] });
}

export async function buildDocxBuffer(resume: ResumeOutput, baseline: BaselineResume) {
  const paragraphs: Paragraph[] = [];

  const addGap = () => paragraphs.push(new Paragraph({ text: "" }));
  const addSection = (title: string) => {
    paragraphs.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 }
      })
    );
  };

  paragraphs.push(new Paragraph({ text: baseline.fullName || "Candidate Name", heading: HeadingLevel.TITLE }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun([
          baseline.location,
          baseline.phone,
          baseline.email,
          baseline.linkedin,
          baseline.github
        ].filter(Boolean).join(" | "))
      ]
    })
  );
  addGap();
  paragraphs.push(new Paragraph({ text: resume.headline, heading: HeadingLevel.HEADING_1 }));
  addSection("Summary");
  paragraphs.push(new Paragraph(resume.summary));
  addSection("Core Skills");
  paragraphs.push(new Paragraph(resume.skills.join(" | ")));

  if (resume.certifications.length) {
    addSection("Certifications");
    resume.certifications.forEach((c) => paragraphs.push(new Paragraph({ text: c, bullet: { level: 0 } })));
  }

  addSection("Professional Experience");
  resume.experience.forEach((item) => {
    paragraphs.push(boldLine(`${item.title} | ${item.company}`));
    paragraphs.push(new Paragraph(`${item.startDate} - ${item.endDate}${item.location ? ` | ${item.location}` : ""}`));
    item.bullets.forEach((bullet) => paragraphs.push(new Paragraph({ text: bullet, bullet: { level: 0 } })));
    addGap();
  });

  addSection("Selected Projects");
  resume.projects.forEach((project) => {
    paragraphs.push(boldLine(project.name));
    paragraphs.push(new Paragraph(project.summary));
    project.bullets.forEach((bullet) => paragraphs.push(new Paragraph({ text: bullet, bullet: { level: 0 } })));
    paragraphs.push(new Paragraph(`Environment: ${project.environment.join(", ")}`));
    addGap();
  });

  addSection("Education");
  resume.education.forEach((item) => {
    paragraphs.push(new Paragraph([item.degree, item.school, item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : ""].filter(Boolean).join(" | ")));
  });

  addSection("Learning Notes");
  resume.notesForLearner.forEach((note) => paragraphs.push(new Paragraph({ text: note, bullet: { level: 0 } })));

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }]
  });

  return Packer.toBuffer(doc);
}
