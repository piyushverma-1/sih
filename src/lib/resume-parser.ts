import { SKILLS } from "./sample-data";
import type {
  Domain,
  EducationEntry,
  ExperienceEntry,
  ParsedResume,
  ProjectEntry,
} from "./types";

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(?:\+?\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/;
const LINK_RE = /\b(?:https?:\/\/|www\.)[^\s,;)]+|\b(?:github|linkedin|behance|dribbble|figma)\.com\/[^\s,;)]+/gi;
const BULLET_RE = /^[\s\u2022\-\*\u25E6\u25AA\u25CF\u00B7]+/;
const SECTION_HEADERS = [
  "education",
  "experience",
  "work experience",
  "professional experience",
  "projects",
  "personal projects",
  "skills",
  "technical skills",
  "certifications",
  "achievements",
  "summary",
  "profile",
  "objective",
  "contact",
];

const KNOWN_VERBS = [
  "built",
  "designed",
  "developed",
  "implemented",
  "led",
  "created",
  "optimized",
  "reduced",
  "increased",
  "shipped",
  "launched",
  "automated",
  "architected",
  "mentored",
  "refactored",
  "deployed",
  "integrated",
  "migrated",
];

export interface ParseOptions {
  filename?: string;
}

export async function parseResume(
  source: File | string | Buffer,
  options: ParseOptions = {}
): Promise<ParsedResume> {
  const buffer = await toBuffer(source);
  const text = await extractText(buffer, options.filename);
  return parseText(text);
}

export function parseResumeFromText(text: string): ParsedResume {
  return parseText(text);
}

function parseText(rawText: string): ParsedResume {
  const text = rawText.replace(/\r/g, "").trim();
  const lower = text.toLowerCase();

  const email = lower.match(EMAIL_RE)?.[0];
  const phoneMatch = text.match(PHONE_RE)?.[0];
  const phone = phoneMatch?.trim();

  const links = Array.from(
    new Set((text.match(LINK_RE) ?? []).map((l) => l.replace(/[),.;]+$/, "")))
  );

  const name = guessName(text);

  const sections = splitSections(text);
  const education = parseEducation(sections.education ?? "");
  const experience = parseExperience(sections.experience ?? "");
  const projects = parseProjects(sections.projects ?? "");

  const skillsSection =
    sections.skills ?? sections["technical skills"] ?? extractSkillsSection(text);
  const rawSkills = parseSkillLines(skillsSection);

  const detected = detectSkills(rawSkills, text);
  const detectedSkillIds = detected.ids;
  const detectedDomains = detected.domains;

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const yearsOfExperience = estimateYears(sections.experience ?? text);

  return {
    name,
    email,
    phone,
    links,
    education,
    experience,
    projects,
    rawSkills,
    detectedSkillIds,
    detectedDomains,
    yearsOfExperience,
    wordCount,
    text,
  };
}

function splitSections(text: string): Record<string, string> {
  const lines = text.split(/\n+/);
  const headers = new Set<string>(SECTION_HEADERS);
  const out: Record<string, string> = {};
  let current = "header";
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length) out[current] = buffer.join("\n");
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const norm = line
      .toLowerCase()
      .replace(/[:\s]+$/g, "")
      .replace(/^[\s\-:]+/, "");
    if (headers.has(norm) && line.length < 40) {
      flush();
      current = norm;
    } else {
      buffer.push(line);
    }
  }
  flush();
  return out;
}

function parseEducation(section: string): EducationEntry[] {
  if (!section) return [];
  const entries: EducationEntry[] = [];
  const blocks = section.split(/\n\s*\n/).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const yearMatch = block.match(/(\d{4})\s*[-–to]+\s*(\d{4}|present|current)/i);
    const institution = lines[0];
    const degreeLine = lines.slice(1).join(" ");
    const degreeMatch =
      degreeLine.match(
        /(b\.?\s?tech|m\.?\s?tech|b\.?\s?e\.?|b\.?\s?sc|m\.?\s?sc|bca|mca|mba|bba|bachelor|master|diploma)/i
      )?.[0] ?? undefined;
    const fieldMatch = degreeLine.match(/in\s+([A-Za-z][A-Za-z &/-]+)/i)?.[1]?.trim();
    entries.push({
      institution,
      degree: degreeMatch,
      field: fieldMatch,
      startYear: yearMatch ? Number(yearMatch[1]) : undefined,
      endYear: yearMatch && /\d{4}/.test(yearMatch[2]) ? Number(yearMatch[2]) : undefined,
    });
  }
  return entries;
}

function parseExperience(section: string): ExperienceEntry[] {
  if (!section) return [];
  const entries: ExperienceEntry[] = [];
  const blocks = section.split(/\n\s*\n/).filter(Boolean);
  for (const block of blocks) {
    const lines = block
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;
    const headerLine = lines[0].replace(BULLET_RE, "").trim();
    const durationMatch = headerLine.match(
      /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4})\s*[-–to]+\s*(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4}|present|current)/i
    );
    const parts = headerLine.split(/[,\-–—\|]/).map((p) => p.trim()).filter(Boolean);
    const role = durationMatch ? headerLine.replace(durationMatch[0], "").trim() : headerLine;
    const company = parts[0] !== role && parts.length > 1 ? parts[parts.length - 1] : undefined;
    const bullets = lines
      .slice(1)
      .map((l) => l.replace(BULLET_RE, "").trim())
      .filter(Boolean);
    entries.push({
      company: company ?? role ?? "Experience",
      role,
      duration: durationMatch?.[0],
      bullets,
    });
  }
  return entries;
}

function parseProjects(section: string): ProjectEntry[] {
  if (!section) return [];
  const entries: ProjectEntry[] = [];
  const blocks = section.split(/\n\s*\n/).filter(Boolean);
  for (const block of blocks) {
    const lines = block
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;
    const nameLine = lines[0].replace(BULLET_RE, "").trim();
    const descriptionLines = lines.slice(1);
    const techSet = new Set<string>();
    for (const line of descriptionLines) {
      const m = line.match(/tech(?:nologies|stack)?[:\-\s]+(.+)/i);
      if (m) {
        m[1]
          .split(/[,\|]/)
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => techSet.add(t));
      }
    }
    const techMatches = descriptionLines.join(" ");
    SKILLS.forEach((s) => {
      const re = new RegExp(`\\b${escapeRegExp(s.name)}\\b`, "i");
      if (re.test(techMatches)) techSet.add(s.name);
    });
    entries.push({
      name: nameLine.replace(/\s*[-–—:\|].*$/, "").trim() || nameLine,
      description: descriptionLines.join(" "),
      tech: Array.from(techSet),
    });
  }
  return entries;
}

function parseSkillLines(section: string): string[] {
  if (!section) return [];
  const out = new Set<string>();
  const lines = section.split(/\n/);
  for (const line of lines) {
    const cleaned = line.replace(BULLET_RE, "").trim();
    if (!cleaned) continue;
    cleaned
      .split(/[,\|•·\/]|\sand\s|\s&\s/gi)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p) => out.add(p));
  }
  return Array.from(out);
}

function extractSkillsSection(text: string): string {
  const lines = text.split(/\n/);
  const start = lines.findIndex((l) => /^skills\b/i.test(l.trim()));
  if (start < 0) return "";
  return lines.slice(start + 1, start + 16).join("\n");
}

function detectSkills(
  rawSkills: string[],
  fullText: string
): { ids: string[]; domains: Domain[] } {
  const haystack = `${fullText}\n${rawSkills.join("\n")}`.toLowerCase();
  const ids = new Set<string>();
  for (const skill of SKILLS) {
    const needles = [skill.name.toLowerCase(), ...(skill.aliases ?? []).map((a) => a.toLowerCase())];
    if (needles.some((n) => haystack.includes(n))) {
      ids.add(skill.id);
    }
  }
  const domains = new Set<Domain>();
  for (const id of ids) {
    const skill = SKILLS.find((s) => s.id === id);
    if (skill) domains.add(skill.domain);
  }
  return { ids: Array.from(ids), domains: Array.from(domains) };
}

function guessName(text: string): string | undefined {
  const firstLine = text.split(/\n/).find((l) => l.trim().length > 0)?.trim();
  if (!firstLine) return undefined;
  if (firstLine.length > 60) return undefined;
  if (EMAIL_RE.test(firstLine)) return undefined;
  const words = firstLine.split(/\s+/);
  if (words.length < 2 || words.length > 5) return undefined;
  if (!/^[A-Z][a-zA-Z'.-]+(?:\s+[A-Z][a-zA-Z'.-]+)+$/.test(firstLine)) return undefined;
  return firstLine;
}

function estimateYears(experienceText: string): number {
  if (!experienceText) return 0;
  const matches = Array.from(
    experienceText.matchAll(/(\d{4})\s*[-–to]+\s*(\d{4}|present|current)/gi)
  );
  if (!matches.length) return 0;
  const now = new Date().getFullYear();
  let total = 0;
  for (const m of matches) {
    const start = Number(m[1]);
    const endRaw = m[2];
    const end = /present|current/i.test(endRaw) ? now : Number(endRaw);
    if (end >= start) total += end - start;
  }
  return Math.min(total, 15);
}

async function toBuffer(source: File | string | Buffer): Promise<Buffer> {
  if (typeof Buffer.isBuffer === "function" && Buffer.isBuffer(source)) return source;
  if (typeof source === "string") return Buffer.from(source, "utf8");
  if (typeof File !== "undefined" && source instanceof File) {
    const arrayBuffer = await source.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  throw new Error("Unsupported resume source");
}

async function extractText(buffer: Buffer, filename?: string): Promise<string> {
  const ext = (filename ?? "").toLowerCase();
  if (ext.endsWith(".pdf") || buffer.slice(0, 5).toString("ascii") === "%PDF-") {
    return extractFromPdf(buffer);
  }
  if (ext.endsWith(".docx") || (buffer[0] === 0x50 && buffer[1] === 0x4b)) {
    return extractFromDocx(buffer);
  }
  return buffer.toString("utf8");
}

function extractFromPdf(buffer: Buffer): string {
  const ascii = buffer.toString("binary");
  const textChunks: string[] = [];
  const re = /\(([^()\\]{2,200})\)\s*Tj/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(ascii))) {
    textChunks.push(decodePdfString(m[1]));
  }
  if (textChunks.length) return textChunks.join("\n");
  const utf = buffer.toString("utf8");
  return utf.replace(/[^\x20-\x7E\n\t]/g, " ").replace(/\s{3,}/g, "\n");
}

function decodePdfString(raw: string): string {
  return raw
    .replace(/\\([0-3][0-7]{2})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')');
}

function extractFromDocx(buffer: Buffer): string {
  try {
    const text = buffer.toString("utf8");
    const xmlMatches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) ?? [];
    const lines = xmlMatches.map((x) => x.replace(/<[^>]+>/g, ""));
    const joined = lines.join(" ");
    if (joined.trim()) return joined;
  } catch {
    // fall through
  }
  return buffer.toString("utf8").replace(/[^\x20-\x7E\n\t]/g, " ");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function hasImpact(resume: ParsedResume): boolean {
  const text = `${resume.experience.map((e) => e.bullets.join("\n")).join("\n")}\n${resume.projects.map((p) => p.description).join("\n")}`;
  return KNOWN_VERBS.some((v) => new RegExp(`\\b${v}\\b`, "i").test(text));
}

export function countImpactMetrics(resume: ParsedResume): number {
  const text = `${resume.experience.map((e) => e.bullets.join("\n")).join("\n")}\n${resume.projects.map((p) => p.description).join("\n")}`;
  const re = /(\d+(?:\.\d+)?\s*(?:%|x|ms|s|sec|seconds|minutes|hrs|hours|days|users|customers|requests|rps|qps|m\b|k\b)?)/gi;
  const matches = text.match(re) ?? [];
  return matches.length;
}