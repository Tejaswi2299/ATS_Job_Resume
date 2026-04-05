import { NextResponse } from "next/server";
import { buildPdfBuffer } from "@/lib/pdf";
import type { BaselineResume, ResumeOutput } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { baseline: BaselineResume; resume: ResumeOutput };
  const buffer = await buildPdfBuffer(body.resume, body.baseline);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="benchmark-resume.pdf"'
    }
  });
}
