import type { CandidateProfile } from "./types";

const API_BASE = "/api/profile";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function loadProfile(): Promise<CandidateProfile> {
  return jsonFetch<CandidateProfile>(API_BASE);
}

export function saveProfile(patch: Partial<CandidateProfile>): Promise<CandidateProfile> {
  return jsonFetch<CandidateProfile>(API_BASE, {
    method: "POST",
    body: JSON.stringify({ patch }),
  });
}

export function resetProfile(): Promise<CandidateProfile> {
  return jsonFetch<CandidateProfile>(API_BASE, { method: "DELETE" });
}