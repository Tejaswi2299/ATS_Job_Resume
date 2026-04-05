import { NextResponse } from "next/server";
import { getSavedResume } from "@/lib/storage";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.resumeId) {
    return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
  }

  const saved = await getSavedResume(body.resumeId);
  if (!saved) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json(saved.baseline);
}
