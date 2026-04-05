import { NextResponse } from "next/server";
import { getOpenAIClient, getModelName } from "@/lib/openai";
import { benchmarkResumePrompt } from "@/lib/prompts";
import { benchmarkResumeSchema } from "@/lib/schemas";
import { getSavedResume } from "@/lib/storage";
import type { BaselineResume, ResumeOutput } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jobDescription = body.jobDescription as string;
    const resumeId = body.resumeId as string | undefined;
    const inlineBaseline = body.baseline as BaselineResume | undefined;

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    let baseline = inlineBaseline;
    if (!baseline && resumeId) {
      const saved = await getSavedResume(resumeId);
      baseline = saved?.baseline;
    }

    if (!baseline) {
      return NextResponse.json({ error: "A baseline resume is required." }, { status: 400 });
    }

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: getModelName(),
      input: benchmarkResumePrompt(jobDescription, baseline),
      text: {
        format: {
          type: "json_schema",
          name: benchmarkResumeSchema.name,
          schema: benchmarkResumeSchema.schema,
          strict: benchmarkResumeSchema.strict
        }
      }
    });

    const resume = JSON.parse(response.output_text) as ResumeOutput;
    return NextResponse.json({ baseline, resume });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to generate benchmark resume." }, { status: 500 });
  }
}
