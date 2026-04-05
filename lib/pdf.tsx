import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { BaselineResume, ResumeOutput } from "@/types";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, lineHeight: 1.4, fontFamily: "Helvetica" },
  name: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 9, marginBottom: 10 },
  title: { fontSize: 12, fontWeight: 700, marginBottom: 6 },
  section: { marginTop: 10, marginBottom: 4, fontSize: 11, fontWeight: 700 },
  itemHeader: { fontSize: 10, fontWeight: 700, marginTop: 6 },
  bullet: { marginLeft: 10, marginTop: 2 },
  small: { fontSize: 9 }
});

function ResumePdf({ resume, baseline }: { resume: ResumeOutput; baseline: BaselineResume }) {
  const meta = [baseline.location, baseline.phone, baseline.email, baseline.linkedin, baseline.github].filter(Boolean).join(" | ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{baseline.fullName || "Candidate Name"}</Text>
        <Text style={styles.meta}>{meta}</Text>
        <Text style={styles.title}>{resume.headline}</Text>

        <Text style={styles.section}>SUMMARY</Text>
        <Text>{resume.summary}</Text>

        <Text style={styles.section}>CORE SKILLS</Text>
        <Text>{resume.skills.join(" | ")}</Text>

        {!!resume.certifications.length && (
          <>
            <Text style={styles.section}>CERTIFICATIONS</Text>
            {resume.certifications.map((item) => (
              <Text key={item} style={styles.bullet}>• {item}</Text>
            ))}
          </>
        )}

        <Text style={styles.section}>PROFESSIONAL EXPERIENCE</Text>
        {resume.experience.map((item, index) => (
          <View key={`${item.company}-${index}`}>
            <Text style={styles.itemHeader}>{item.title} | {item.company}</Text>
            <Text style={styles.small}>{item.startDate} - {item.endDate}{item.location ? ` | ${item.location}` : ""}</Text>
            {item.bullets.map((bullet) => (
              <Text key={bullet} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.section}>SELECTED PROJECTS</Text>
        {resume.projects.map((project) => (
          <View key={project.name}>
            <Text style={styles.itemHeader}>{project.name}</Text>
            <Text>{project.summary}</Text>
            {project.bullets.map((bullet) => (
              <Text key={bullet} style={styles.bullet}>• {bullet}</Text>
            ))}
            <Text style={styles.small}>Environment: {project.environment.join(", ")}</Text>
          </View>
        ))}

        <Text style={styles.section}>EDUCATION</Text>
        {resume.education.map((item, index) => (
          <Text key={`${item.school}-${index}`}>{[item.degree, item.school, item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : ""].filter(Boolean).join(" | ")}</Text>
        ))}

        <Text style={styles.section}>LEARNING NOTES</Text>
        {resume.notesForLearner.map((note) => (
          <Text key={note} style={styles.bullet}>• {note}</Text>
        ))}
      </Page>
    </Document>
  );
}

export async function buildPdfBuffer(resume: ResumeOutput, baseline: BaselineResume) {
  const instance = pdf(<ResumePdf resume={resume} baseline={baseline} />);
  const buffer = await instance.toBuffer();
  return Buffer.from(buffer);
}
