import { NextResponse } from "next/server";
import { listSavedResumes } from "@/lib/storage";

export async function GET() {
  const resumes = await listSavedResumes();
  return NextResponse.json(resumes);
}
