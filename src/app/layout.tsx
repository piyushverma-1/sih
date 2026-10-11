import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InternSetu — Smart Internship & Job Readiness Platform",
  description:
    "Upload your resume, see your ATS score, identify skill gaps, and validate skills through an adaptive assessment."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <header className="flex items-center justify-between mb-8">
            <a href="/" className="flex items-center gap-2 group">
              <span className="size-9 rounded-xl bg-brand-600 grid place-items-center text-white font-black shadow-glow">
                S
              </span>
              <span className="text-lg font-semibold tracking-tight">InternSetu</span>
            </a>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <a className="px-3 py-1.5 rounded-lg hover:bg-white/70" href="/auth/login">Student</a>
              <a className="px-3 py-1.5 rounded-lg hover:bg-white/70" href="/auth/company-login">Industry</a>
            </nav>
          </header>
          {children}
          <footer className="mt-16 text-center text-xs text-ink-400">
            Built for Smart India Hackathon • InternSetu prototype
          </footer>
        </div>
      </body>
    </html>
  );
}