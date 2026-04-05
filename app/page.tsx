"use client";

import { useEffect, useMemo, useState } from "react";
import { ResumePreview } from "@/components/ResumePreview";
import { SectionCard } from "@/components/SectionCard";
import type { BaselineResume, ResumeOutput, SavedResumeMeta } from "@/types";

export default function Page() {
  const [jobDescription, setJobDescription] = useState("");
  const [savedResumes, setSavedResumes] = useState<SavedResumeMeta[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<BaselineResume | null>(null);
  const [generated, setGenerated] = useState<ResumeOutput | null>(null);

  async function loadResumes() {
    const response = await fetch("/api/resumes");
    const data = (await response.json()) as SavedResumeMeta[];
    setSavedResumes(data);
    if (!selectedResumeId && data.length) {
      setSelectedResumeId(data[0].id);
      setBaseline(data[0].baseline);
    }
  }

  useEffect(() => {
    void loadResumes();
  }, []);

  const selectedResume = useMemo(
    () => savedResumes.find((item) => item.id === selectedResumeId) ?? null,
    [savedResumes, selectedResumeId]
  );

  useEffect(() => {
    if (selectedResume) setBaseline(selectedResume.baseline);
  }, [selectedResume]);

  async function handleUpload(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const response = await fetch("/api/upload-resume", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      await loadResumes();
      setSelectedResumeId(data.id);
      setBaseline(data.baseline);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setGenerated(null);

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeId: selectedResumeId,
          baseline
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setBaseline(data.baseline);
      setGenerated(data.resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  async function exportFile(kind: "pdf" | "docx") {
    if (!baseline || !generated) return;
    const response = await fetch(`/api/export/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseline, resume: generated })
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = kind === "pdf" ? "benchmark-resume.pdf" : "benchmark-resume.docx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Benchmark Resume Studio</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Paste the job description. Reuse or upload a resume. Generate the benchmark ATS resume.</h1>
          <p className="max-w-4xl text-slate-600">
            This app uses the source resume only for identity, employer timeline, and education anchors. The generated content is an ideal target profile for learning what the recruiter-selected resume would look like.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <SectionCard title="1. Job description">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[340px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6"
                placeholder="Paste the full job description here..."
              />
            </SectionCard>

            <SectionCard title="2. Base resume selection">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Use a previously uploaded resume</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
                  >
                    <option value="">Select a saved resume</option>
                    {savedResumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.fileName} • {new Date(resume.uploadedAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Or upload a new resume</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file);
                    }}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
                  />
                </div>
              </div>

              {baseline && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Timeline anchor preview</p>
                  <p className="mt-2">{baseline.fullName} {baseline.email ? `• ${baseline.email}` : ""}</p>
                  <p className="mt-1 text-xs text-slate-500">Employers kept from source resume:</p>
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {baseline.employmentTimeline.map((job) => (
                      <li key={`${job.company}-${job.startDate}`}>{job.company} — {job.startDate} to {job.endDate}</li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionCard>

            <SectionCard title="3. Generate and export">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => void handleGenerate()}
                  disabled={!jobDescription.trim() || (!selectedResumeId && !baseline) || isGenerating}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isGenerating ? "Generating benchmark resume..." : "Generate benchmark resume"}
                </button>
                <button
                  onClick={() => void exportFile("docx")}
                  disabled={!generated}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Download DOCX
                </button>
                <button
                  onClick={() => void exportFile("pdf")}
                  disabled={!generated}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Download PDF
                </button>
              </div>

              {isUploading && <p className="mt-3 text-sm text-slate-600">Uploading and extracting the timeline from the resume...</p>}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Live preview">
              {baseline && generated ? (
                <ResumePreview baseline={baseline} resume={generated} />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                  Your benchmark resume preview will appear here after generation.
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
