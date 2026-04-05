import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import path from "path";

export async function extractResumeText(fileName: string, bytes: Buffer): Promise<string> {
  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".pdf") {
    const result = await pdfParse(bytes);
    return result.text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer: bytes });
    return result.value;
  }

  if (ext === ".txt") {
    return bytes.toString("utf-8");
  }

  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT resume.");
}
