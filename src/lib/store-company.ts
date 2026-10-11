"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ApplicationRecord,
  ApplicationStage,
  CampusDrive,
  Challenge,
  CollaborationProposal,
  CollaborationStatus,
  CompanyProfile,
  DocumentRecord,
  Interview,
  InterviewFeedback,
  InterviewStatus,
  LearningProgram,
  LiveProject,
  Mentor,
  MentorStatus,
  MentorshipRequest,
  Notification,
  Offer,
  Opportunity,
  OpportunityStatus,
  ProjectStage,
  Recruiter,
} from "@/types/company";

const emptyProfile: CompanyProfile = {
  id: "demo-company",
  name: "Acme Technologies",
  email: "hr@acmetech.example",
  description: "Acme builds SaaS products for logistics and supply-chain automation.",
  industry: "Technology",
  companyType: "Product",
  foundedYear: 2014,
  size: "201-500",
  headquarters: "Bengaluru, India",
  locations: ["Bengaluru", "Hyderabad", "Remote"],
  website: "https://acmetech.example",
  linkedin: "https://linkedin.com/company/acmetech",
  hiringDomains: ["Web", "Data", "Cloud", "DevOps"],
  jobRoles: ["Full-Stack Developer", "Data Engineer", "SRE"],
  preferredDegrees: ["B.Tech", "B.Sc", "MCA"],
  preferredBranches: ["CSE", "IT", "ECE"],
  minCgpa: 6.5,
  backlogPolicy: "No active backlogs",
  experienceRequirement: "0-2 years for interns",
  preferredTechnicalSkills: ["react", "node", "sql", "python", "aws"],
  preferredSoftSkills: ["Communication", "Problem Solving", "Stakeholder Management"],
  hiringLocations: ["Bengaluru", "Hyderabad", "Remote"],
  workMode: "Hybrid",
  contactName: "Priya Nair",
  contactEmail: "priya.nair@acmetech.example",
  contactPhone: "+91 98765 43210",
  status: "VERIFIED",
  verifiedAt: "2026-01-15T00:00:00.000Z",
  reputation: {
    responseRate: 92,
    completionRate: 88,
    offerConversion: 76,
    hiringTurnaroundDays: 18,
  },
  logoColor: "#3a5dff",
  createdAt: "2026-01-10T00:00:00.000Z",
};

const initialOpportunities: Opportunity[] = [
  {
    id: "co-1",
    companyId: "demo-company",
    postingType: "INTERNSHIP",
    title: "Full-Stack Intern",
    department: "Engineering",
    description: "Ship features across the Next.js stack and internal tooling.",
    duration: "6 months",
    location: "Bengaluru (Hybrid)",
    workMode: "Hybrid",
    stipend: "₹20,000 / month",
    openings: 4,
    degree: ["B.Tech", "MCA"],
    branch: ["CSE", "IT"],
    gradYear: [2026, 2027, 2028],
    minCgpa: 6.5,
    backlogPolicy: "No active backlogs",
    experience: "Internship or academic project exposure",
    requiredSkills: ["next", "react", "ts", "node", "sql", "rest"],
    preferredSkills: ["tailwind", "docker"],
    softSkills: ["Communication", "Problem Solving"],
    applicationDeadline: "2026-10-31",
    shortlistQuota: 12,
    selectionProcess: "Resume screening → Technical interview → HR round",
    interviewType: "Online",
    interviewStages: ["Technical", "HR"],
    status: "PUBLISHED",
    applicants: [],
    shortlisted: [],
    qualityScore: 88,
    qualityFixes: [],
    createdAt: "2026-08-21T00:00:00.000Z",
    updatedAt: "2026-08-21T00:00:00.000Z",
    publishedAt: "2026-08-21T00:00:00.000Z",
  },
  {
    id: "co-2",
    companyId: "demo-company",
    postingType: "PLACEMENT",
    title: "Data Engineer",
    department: "Data",
    description: "Build pipelines and warehouse models for analytics products.",
    duration: "Full-time",
    location: "Hyderabad",
    workMode: "On-site",
    stipend: "₹12,00,000 / year",
    openings: 2,
    degree: ["B.Tech", "M.Tech"],
    branch: ["CSE", "IT", "ECE"],
    gradYear: [2026],
    minCgpa: 7.0,
    backlogPolicy: "No active backlogs",
    experience: "6 months internship preferred",
    requiredSkills: ["python", "sql", "pandas", "stats"],
    preferredSkills: ["ml", "tableau"],
    softSkills: ["Communication", "Stakeholder Management"],
    applicationDeadline: "2026-09-30",
    shortlistQuota: 20,
    selectionProcess: "Resume screening → Assessment → Technical interview → HR round",
    interviewType: "Online + On-site",
    interviewStages: ["Assessment", "Technical", "HR"],
    status: "PUBLISHED",
    applicants: [],
    shortlisted: [],
    qualityScore: 76,
    qualityFixes: ["Add salary range details"],
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
  },
];

const initialApplications: ApplicationRecord[] = [
  {
    id: "app_c1",
    opportunityId: "co-1",
    studentId: "demo-student",
    studentName: "Demo Student",
    studentEmail: "demo@skillbridge.local",
    stage: "Applied",
    matchPercentage: 92,
    atsScore: 78,
    cgpa: 8.4,
    degree: "B.Tech",
    branch: "CSE",
    gradYear: 2027,
    skills: ["react", "ts", "sql", "node"],
    verifiedSkills: ["react", "ts"],
    assessmentScore: 84,
    appliedAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
    history: [{ stage: "Applied", at: "2026-08-22T00:00:00.000Z" }],
  },
];

const initialInterviews: Interview[] = [
  {
    id: "int_1",
    applicationId: "app_c1",
    opportunityId: "co-1",
    candidateName: "Demo Student",
    interviewerName: "Rahul V.",
    date: "2026-09-02",
    time: "11:00",
    type: "ONLINE",
    meetingLink: "https://meet.example/room/123",
    round: 1,
    totalRounds: 2,
    status: "SCHEDULED",
    notes: "Focus on React and system design basics.",
  }
];

const initialLearning: LearningProgram[] = [
  {
    id: "lp_1",
    companyId: "demo-company",
    title: "Full-Stack Accelerator",
    description: "Fast-track program covering React, TypeScript, Node and SQL.",
    type: "bootcamp",
    duration: "4 weeks",
    level: "Intermediate",
    deliveryMode: "Online",
    prerequisites: ["HTML", "CSS", "JavaScript"],
    hasCertificate: true,
    skills: ["react", "ts", "node", "sql"],
    slots: 50,
    enrolled: ["demo-student"],
    createdAt: "2026-08-01T00:00:00.000Z",
  }
];

const initialMentors: Mentor[] = [
  {
    id: "m_1",
    companyId: "demo-company",
    name: "Rahul V.",
    designation: "Senior Engineer",
    expertise: ["react", "node", "system-design"],
    experienceYears: 8,
    bio: "Focuses on frontend architecture and mentorship.",
    slots: 2,
    available: true,
    mentorshipRequests: [],
  }
];

const initialCollaborations: CollaborationProposal[] = [
  {
    id: "col_1",
    companyId: "demo-company",
    institutionId: "demo-inst",
    institutionName: "IIT Roorkee",
    type: "guest_lecture",
    title: "Modern Frontend Engineering",
    description: "Guest lecture on scalable React apps and design systems.",
    status: "APPROVED",
    proposedAt: "2026-07-10T00:00:00.000Z",
    respondedAt: "2026-07-12T00:00:00.000Z",
  }
];

const initialProjects: LiveProject[] = [
  {
    id: "proj_1",
    companyId: "demo-company",
    title: "Logistics Tracking Dashboard",
    description: "Real-time shipment visibility for operations teams.",
    durationWeeks: 8,
    teamSize: 4,
    requiredSkills: ["react", "node", "sql", "rest"],
    deliverables: ["Prototype", "Production deploy", "Documentation"],
    milestones: [
      { name: "Proposal", due: "2026-09-05" },
      { name: "Prototype", due: "2026-09-20" },
      { name: "Testing", due: "2026-10-10" },
    ],
    stage: "Proposal",
    submissions: [],
    createdAt: "2026-08-25T00:00:00.000Z",
  }
];

const initialChallenges: Challenge[] = [
  {
    id: "ch_1",
    companyId: "demo-company",
    title: "Hack the Supply Chain",
    description: "Design a tracking experience for high-volume logistics.",
    type: "hackathon",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    skills: ["react", "node", "sql"],
    participants: [],
    teams: [],
    submissions: [],
    createdAt: "2026-08-20T00:00:00.000Z",
  }
];

const initialDrives: CampusDrive[] = [
  {
    id: "drive_1",
    companyId: "demo-company",
    institutionId: "demo-inst",
    institutionName: "IIT Roorkee",
    opportunityId: "co-1",
    title: "Acme Full-Stack Campus Drive",
    date: "2026-10-10",
    eligibility: {
      degree: ["B.Tech"],
      branch: ["CSE", "IT"],
      gradYear: [2027],
      minCgpa: 7.0,
      skills: ["react", "node", "sql"],
    },
    registrations: [],
    stages: [
      { name: "Registered" },
      { name: "Eligible" },
      { name: "Shortlisted" },
      { name: "Interviewed" },
      { name: "Selected" },
    ],
    createdAt: "2026-08-22T00:00:00.000Z",
  }
];

const initialRecruiters: Recruiter[] = [
  {
    id: "rec_1",
    companyId: "demo-company",
    name: "Priya Nair",
    email: "priya.nair@acmetech.example",
    role: "ADMIN",
    assignedOpportunities: ["co-1", "co-2"],
    assignedPools: [],
    createdAt: "2026-01-10T00:00:00.000Z",
  }
];

const initialNotifications: Notification[] = [
  {
    id: "notif_1",
    companyId: "demo-company",
    type: "application",
    title: "New application",
    message: "Demo Student applied for Full-Stack Intern.",
    read: false,
    link: "/company/applications?opportunity=co-1",
    createdAt: "2026-08-22T00:00:00.000Z",
  }
];

const initialDocuments: DocumentRecord[] = [
  {
    id: "doc_1",
    companyId: "demo-company",
    title: "Offer Letter Template",
    type: "offer_letter",
    url: "https://docs.example/offer-letter",
    accessRoles: ["ADMIN", "HR_MANAGER"],
    uploadedBy: "rec_1",
    uploadedAt: "2026-01-20T00:00:00.000Z",
    version: 1,
  }
];

export interface CompanyState {
  profile: CompanyProfile;
  opportunities: Opportunity[];
  applications: ApplicationRecord[];
  interviews: Interview[];
  offers: Offer[];
  learningPrograms: LearningProgram[];
  mentors: Mentor[];
  collaborationProposals: CollaborationProposal[];
  liveProjects: LiveProject[];
  challenges: Challenge[];
  campusDrives: CampusDrive[];
  recruiters: Recruiter[];
  notifications: Notification[];
  documents: DocumentRecord[];
}

const initialState: CompanyState = {
  profile: emptyProfile,
  opportunities: initialOpportunities,
  applications: initialApplications,
  interviews: initialInterviews,
  offers: [],
  learningPrograms: initialLearning,
  mentors: initialMentors,
  collaborationProposals: initialCollaborations,
  liveProjects: initialProjects,
  challenges: initialChallenges,
  campusDrives: initialDrives,
  recruiters: initialRecruiters,
  notifications: initialNotifications,
  documents: initialDocuments,
};

export type CompanyActions = {
  updateProfile: (patch: Partial<CompanyProfile>) => void;
  upsertOpportunity: (opp: Opportunity) => void;
  updateOpportunity: (id: string, patch: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  setOpportunityStatus: (id: string, status: OpportunityStatus) => void;
  upsertApplication: (app: ApplicationRecord) => void;
  updateApplicationStage: (id: string, stage: ApplicationStage) => void;
  upsertInterview: (interview: Interview) => void;
  updateInterviewStatus: (id: string, status: InterviewStatus) => void;
  saveInterviewFeedback: (id: string, feedback: InterviewFeedback) => void;
  createOffer: (offer: Offer) => void;
  updateOfferStatus: (id: string, status: Offer["status"]) => void;
  upsertLearningProgram: (program: LearningProgram) => void;
  upsertMentor: (mentor: Mentor) => void;
  requestMentorship: (mentorId: string, request: MentorshipRequest) => void;
  updateMentorshipStatus: (mentorId: string, requestId: string, status: MentorStatus) => void;
  upsertCollaboration: (proposal: CollaborationProposal) => void;
  updateCollaborationStatus: (id: string, status: CollaborationStatus) => void;
  upsertLiveProject: (project: LiveProject) => void;
  updateProjectStage: (id: string, stage: ProjectStage) => void;
  submitProject: (projectId: string, submission: { id: string; teamName: string }) => void;
  upsertChallenge: (challenge: Challenge) => void;
  joinChallenge: (challengeId: string, participantId: string) => void;
  createTeam: (challengeId: string, team: Challenge["teams"][number]) => void;
  submitChallenge: (challengeId: string, teamId: string) => void;
  upsertCampusDrive: (drive: CampusDrive) => void;
  upsertRecruiter: (recruiter: Recruiter) => void;
  removeRecruiter: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  upsertDocument: (doc: DocumentRecord) => void;
  removeDocument: (id: string) => void;
  reset: () => void;
};

export const useCompanyStore = create<CompanyState & CompanyActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
      upsertOpportunity: (opp) =>
        set((s) => ({
          opportunities: s.opportunities.some((o) => o.id === opp.id)
            ? s.opportunities.map((o) => (o.id === opp.id ? opp : o))
            : [...s.opportunities, opp],
        })),
      updateOpportunity: (id, patch) =>
        set((s) => ({
          opportunities: s.opportunities.map((o) =>
            o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o
          ),
        })),
      deleteOpportunity: (id) =>
        set((s) => ({
          opportunities: s.opportunities.filter((o) => o.id !== id),
        })),
      setOpportunityStatus: (id, status) =>
        set((s) => ({
          opportunities: s.opportunities.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  updatedAt: new Date().toISOString(),
                  publishedAt: status === "PUBLISHED" ? new Date().toISOString() : o.publishedAt,
                }
              : o
          ),
        })),
      upsertApplication: (app) =>
        set((s) => ({
          applications: s.applications.some((a) => a.id === app.id)
            ? s.applications.map((a) => (a.id === app.id ? app : a))
            : [...s.applications, app],
        })),
      updateApplicationStage: (id, stage) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  stage,
                  updatedAt: new Date().toISOString(),
                  history: [...a.history, { stage, at: new Date().toISOString() }],
                }
              : a
          ),
        })),
      upsertInterview: (interview) =>
        set((s) => ({
          interviews: s.interviews.some((i) => i.id === interview.id)
            ? s.interviews.map((i) => (i.id === interview.id ? interview : i))
            : [...s.interviews, interview],
        })),
      updateInterviewStatus: (id, status) =>
        set((s) => ({
          interviews: s.interviews.map((i) => (i.id === id ? { ...i, status } : i)),
        })),
      saveInterviewFeedback: (id, feedback) =>
        set((s) => ({
          interviews: s.interviews.map((i) =>
            i.id === id ? { ...i, feedback, status: "COMPLETED" } : i
          ),
        })),
      createOffer: (offer) =>
        set((s) => ({
          offers: [...s.offers, offer],
        })),
      updateOfferStatus: (id, status) =>
        set((s) => ({
          offers: s.offers.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)),
        })),
      upsertLearningProgram: (program) =>
        set((s) => ({
          learningPrograms: s.learningPrograms.some((p) => p.id === program.id)
            ? s.learningPrograms.map((p) => (p.id === program.id ? program : p))
            : [...s.learningPrograms, program],
        })),
      upsertMentor: (mentor) =>
        set((s) => ({
          mentors: s.mentors.some((m) => m.id === mentor.id)
            ? s.mentors.map((m) => (m.id === mentor.id ? mentor : m))
            : [...s.mentors, mentor],
        })),
      requestMentorship: (mentorId, request) =>
        set((s) => ({
          mentors: s.mentors.map((m) =>
            m.id === mentorId
              ? { ...m, mentorshipRequests: [...m.mentorshipRequests, request] }
              : m
          ),
        })),
      updateMentorshipStatus: (mentorId, requestId, status) =>
        set((s) => ({
          mentors: s.mentors.map((m) =>
            m.id === mentorId
              ? {
                  ...m,
                  mentorshipRequests: m.mentorshipRequests.map((r) =>
                    r.id === requestId
                      ? { ...r, status, respondedAt: new Date().toISOString() }
                      : r
                  ),
                }
              : m
          ),
        })),
      upsertCollaboration: (proposal) =>
        set((s) => ({
          collaborationProposals: s.collaborationProposals.some((p) => p.id === proposal.id)
            ? s.collaborationProposals.map((p) => (p.id === proposal.id ? proposal : p))
            : [...s.collaborationProposals, proposal],
        })),
      updateCollaborationStatus: (id, status) =>
        set((s) => ({
          collaborationProposals: s.collaborationProposals.map((p) =>
            p.id === id ? { ...p, status, respondedAt: new Date().toISOString() } : p
          ),
        })),
      upsertLiveProject: (project) =>
        set((s) => ({
          liveProjects: s.liveProjects.some((p) => p.id === project.id)
            ? s.liveProjects.map((p) => (p.id === project.id ? project : p))
            : [...s.liveProjects, project],
        })),
      updateProjectStage: (id, stage) =>
        set((s) => ({
          liveProjects: s.liveProjects.map((p) => (p.id === id ? { ...p, stage } : p)),
        })),
      submitProject: (projectId, submission) =>
        set((s) => ({
          liveProjects: s.liveProjects.map((p) =>
            p.id === projectId
              ? { ...p, submissions: [...p.submissions, { ...submission, submittedAt: new Date().toISOString() }] }
              : p
          ),
        })),
      upsertChallenge: (challenge) =>
        set((s) => ({
          challenges: s.challenges.some((c) => c.id === challenge.id)
            ? s.challenges.map((c) => (c.id === challenge.id ? challenge : c))
            : [...s.challenges, challenge],
        })),
      joinChallenge: (challengeId, participantId) =>
        set((s) => ({
          challenges: s.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, participants: [...c.participants, participantId] }
              : c
          ),
        })),
      createTeam: (challengeId, team) =>
        set((s) => ({
          challenges: s.challenges.map((c) =>
            c.id === challengeId ? { ...c, teams: [...c.teams, team] } : c
          ),
        })),
      submitChallenge: (challengeId, teamId) =>
        set((s) => ({
          challenges: s.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, submissions: [...c.submissions, { id: `sub_${Date.now()}`, teamId, submittedAt: new Date().toISOString() }] }
              : c
          ),
        })),
      upsertCampusDrive: (drive) =>
        set((s) => ({
          campusDrives: s.campusDrives.some((d) => d.id === drive.id)
            ? s.campusDrives.map((d) => (d.id === drive.id ? drive : d))
            : [...s.campusDrives, drive],
        })),
      upsertRecruiter: (recruiter) =>
        set((s) => ({
          recruiters: s.recruiters.some((r) => r.id === recruiter.id)
            ? s.recruiters.map((r) => (r.id === recruiter.id ? recruiter : r))
            : [...s.recruiters, recruiter],
        })),
      removeRecruiter: (id) =>
        set((s) => ({
          recruiters: s.recruiters.filter((r) => r.id !== id),
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      upsertDocument: (doc) =>
        set((s) => ({
          documents: s.documents.some((d) => d.id === doc.id)
            ? s.documents.map((d) => (d.id === doc.id ? doc : d))
            : [...s.documents, doc],
        })),
      removeDocument: (id) =>
        set((s) => ({
          documents: s.documents.filter((d) => d.id !== id),
        })),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "internsetu-company",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
