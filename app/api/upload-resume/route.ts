import { NextResponse } from "next/server";
import { getOpenAIClient, getModelName } from "@/lib/openai";
import { extractResumeText } from "@/lib/resume-parser";
import { baselineResumeSchema } from "@/lib/schemas";
import { baselineExtractionPrompt } from "@/lib/prompts";
import { buildSavedResumeMeta, saveResumeFile, saveResumeMetadata } from "@/lib/storage";
import type { BaselineResume } from "@/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No resume file found." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const rawText = await extractResumeText(file.name, bytes);

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: getModelName(),
      input: baselineExtractionPrompt(rawText),
      text: {
        format: {
          type: "json_schema",
          name: baselineResumeSchema.name,
          schema: baselineResumeSchema.schema,
          strict: baselineResumeSchema.strict
        }
      }
    });

    const parsed = JSON.parse(response.output_text) as BaselineResume;
    const saved = await saveResumeFile(file.name, bytes);
    const meta = buildSavedResumeMeta({ id: saved.id, fileName: file.name, baseline: parsed });
    await saveResumeMetadata(meta);

    return NextResponse.json(meta);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to upload and parse resume." }, { status: 500 });
  }
}
