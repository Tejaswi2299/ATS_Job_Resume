import { NextResponse } from "next/server";
import { buildDocxBuffer } from "@/lib/render";
import type { BaselineResume, ResumeOutput } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { baseline: BaselineResume; resume: ResumeOutput };
  const buffer = await buildDocxBuffer(body.resume, body.baseline);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="benchmark-resume.docx"'
    }
  });
}
