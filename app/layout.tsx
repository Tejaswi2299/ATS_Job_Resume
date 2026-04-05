import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benchmark Resume Studio",
  description: "Paste a job description, upload or reuse a base resume, and generate a benchmark ATS resume."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
