export const baselineResumeSchema = {
  name: "baseline_resume",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["fullName", "employmentTimeline", "educationTimeline"],
    properties: {
      fullName: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      linkedin: { type: "string" },
      github: { type: "string" },
      location: { type: "string" },
      employmentTimeline: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["company", "startDate", "endDate"],
          properties: {
            company: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        }
      },
      educationTimeline: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["school"],
          properties: {
            school: { type: "string" },
            degree: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        }
      }
    }
  },
  strict: true
};

export const benchmarkResumeSchema = {
  name: "benchmark_resume",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "headline",
      "summary",
      "skills",
      "certifications",
      "experience",
      "projects",
      "education",
      "notesForLearner"
    ],
    properties: {
      headline: { type: "string" },
      summary: { type: "string" },
      skills: { type: "array", items: { type: "string" } },
      certifications: { type: "array", items: { type: "string" } },
      experience: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "company", "startDate", "endDate", "bullets"],
          properties: {
            title: { type: "string" },
            company: { type: "string" },
            location: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            bullets: { type: "array", items: { type: "string" } }
          }
        }
      },
      projects: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "summary", "bullets", "environment"],
          properties: {
            name: { type: "string" },
            summary: { type: "string" },
            bullets: { type: "array", items: { type: "string" } },
            environment: { type: "array", items: { type: "string" } }
          }
        }
      },
      education: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["school"],
          properties: {
            school: { type: "string" },
            degree: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        }
      },
      notesForLearner: { type: "array", items: { type: "string" } }
    }
  },
  strict: true
};
