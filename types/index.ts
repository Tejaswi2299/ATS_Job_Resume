export type EmploymentTimeline = {
  company: string;
  startDate: string;
  endDate: string;
};

export type EducationTimeline = {
  school: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
};

export type BaselineResume = {
  fullName: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  employmentTimeline: EmploymentTimeline[];
  educationTimeline: EducationTimeline[];
};

export type ProjectItem = {
  name: string;
  summary: string;
  bullets: string[];
  environment: string[];
};

export type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ResumeOutput = {
  headline: string;
  summary: string;
  skills: string[];
  certifications: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationTimeline[];
  notesForLearner: string[];
};

export type SavedResumeMeta = {
  id: string;
  fileName: string;
  uploadedAt: string;
  baseline: BaselineResume;
};
