import type { Internship, ParsedResume } from "./types";
import { INTERNSHIPS, SKILLS } from "./sample-data";

const STOPWORDS = new Set([
  "a", "an", "and", "or", "the", "of", "for", "to", "in", "on", "with", "at",
  "by", "from", "as", "is", "are", "be", "this", "that", "it", "you", "your",
  "we", "us", "our", "they", "their", "i", "me", "my", "will", "would", "can",
  "could", "should", "have", "has", "had", "do", "does", "did", "if", "else",
  "than", "then", "so", "but", "not", "no", "yes", "into", "out", "up", "down",
  "over", "under", "more", "most", "less", "least", "any", "some", "all",
  "such", "only", "own", "same", "too", "very", "just", "about", "between"
]);

export interface SemanticSearchHit {
  internship: Internship;
  score: number;
  matchedSkills: string[];
  matchedTerms: string[];
  explanation: string;
}

interface Document {
  id: string;
  tokens: string[];
  docFreq: number;
}

const TOKEN_RE = /[a-z0-9+#.]+/g;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .match(TOKEN_RE)
    ?.filter((t) => t.length > 1 && !STOPWORDS.has(t)) ?? [];
}

function expandResumeTokens(resume: ParsedResume): string[] {
  const base = tokenize(
    [
      resume.text,
      resume.rawSkills.join(" "),
      resume.experience.map((e) => `${e.role ?? ""} ${e.company} ${e.bullets.join(" ")}`).join(" "),
      resume.projects.map((p) => `${p.name} ${p.description} ${p.tech.join(" ")}`).join(" "),
    ].join("\n")
  );
  const expanded = new Set(base);
  for (const id of resume.detectedSkillIds) {
    const skill = SKILLS.find((s) => s.id === id);
    if (!skill) continue;
    tokenize(`${skill.name} ${(skill.aliases ?? []).join(" ")}`).forEach((t) =>
      expanded.add(t)
    );
  }
  return Array.from(expanded);
}

function buildCorpus(): Map<string, Document> {
  const docs = new Map<string, Document>();
  for (const i of INTERNSHIPS) {
    const skillText = i.requiredSkillIds
      .map((id) => SKILLS.find((s) => s.id === id)?.name ?? id)
      .join(" ");
    const tokens = tokenize(
      `${i.title} ${i.company} ${i.description} ${i.location} ${i.domain} ${skillText}`
    );
    docs.set(i.id, { id: i.id, tokens, docFreq: 0 });
  }
  const df = new Map<string, number>();
  for (const doc of docs.values()) {
    const seen = new Set(doc.tokens);
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  }
  for (const doc of docs.values()) {
    for (const t of new Set(doc.tokens)) doc.docFreq = df.get(t) ?? 0;
  }
  return docs;
}

const CORPUS = buildCorpus();

export function semanticSearch(
  resume: ParsedResume,
  options: { limit?: number; domains?: string[]; minScore?: number } = {}
): SemanticSearchHit[] {
  const { limit = 5, domains, minScore = 5 } = options;
  const queryTokens = expandResumeTokens(resume);
  const totalDocs = CORPUS.size;

  const hits: SemanticSearchHit[] = [];
  for (const doc of CORPUS.values()) {
    if (domains && domains.length && !domains.includes(doc.id)) {
      const internship = INTERNSHIPS.find((i) => i.id === doc.id);
      if (internship && !domains.includes(internship.domain)) continue;
    }
    const score = scoreDocument(queryTokens, doc.tokens, totalDocs);
    if (score < minScore) continue;
    const internship = INTERNSHIPS.find((i) => i.id === doc.id)!;
    const matchedTerms = topMatches(queryTokens, doc.tokens, totalDocs, 6);
    const matchedSkills = internship.requiredSkillIds
      .map((id) => SKILLS.find((s) => s.id === id)?.name ?? id)
      .filter((name) =>
        queryTokens.includes(name.toLowerCase().split(/\s+/)[0])
      );
    hits.push({
      internship,
      score: Math.round(score * 10) / 10,
      matchedSkills,
      matchedTerms,
      explanation: explanationFor(internship, matchedTerms, matchedSkills),
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

function scoreDocument(
  query: string[],
  docTokens: string[],
  totalDocs: number
): number {
  if (!docTokens.length) return 0;
  const docLen = docTokens.length;
  const docCounts = new Map<string, number>();
  for (const t of docTokens) docCounts.set(t, (docCounts.get(t) ?? 0) + 1);

  let score = 0;
  for (const term of new Set(query)) {
    const tf = docCounts.get(term) ?? 0;
    if (tf === 0) continue;
    const idf = Math.log(1 + totalDocs / (1 + 1));
    score += idf * (1 + Math.log(tf));
  }
  return score / Math.sqrt(docLen);
}

function topMatches(
  query: string[],
  docTokens: string[],
  totalDocs: number,
  n: number
): string[] {
  const docCounts = new Map<string, number>();
  for (const t of docTokens) docCounts.set(t, (docCounts.get(t) ?? 0) + 1);
  const scored: Array<{ token: string; score: number }> = [];
  for (const term of new Set(query)) {
    const tf = docCounts.get(term) ?? 0;
    if (tf === 0) continue;
    const idf = Math.log(1 + totalDocs / (1 + 1));
    scored.push({ token: term, score: idf * (1 + Math.log(tf)) });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((s) => s.token);
}

function explanationFor(
  internship: Internship,
  terms: string[],
  matchedSkills: string[]
): string {
  const parts: string[] = [];
  if (matchedSkills.length) {
    parts.push(`matches your skills: ${matchedSkills.slice(0, 3).join(", ")}`);
  }
  if (terms.length) {
    parts.push(`shared context: ${terms.slice(0, 4).join(", ")}`);
  }
  if (!parts.length) {
    parts.push(`closest fit in the ${internship.domain} domain`);
  }
  return parts.join("; ");
}

export function quickSearchInternships(query: string, limit = 5): Internship[] {
  const tokens = tokenize(query);
  if (!tokens.length) return INTERNSHIPS.slice(0, limit);
  return INTERNSHIPS
    .map((i) => {
      const hay = `${i.title} ${i.company} ${i.description}`.toLowerCase();
      let hits = 0;
      for (const t of tokens) if (hay.includes(t)) hits++;
      return { internship: i, hits };
    })
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map((r) => r.internship);
}