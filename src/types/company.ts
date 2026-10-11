export type CompanyStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
export type OpportunityType = "INTERNSHIP" | "PLACEMENT" | "APPRENTICESHIP" | "LIVE_PROJECT" | "FREELANCE" | "INDUSTRIAL_TRAINING";
export type OpportunityStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED" | "ARCHIVED";
export type ApplicationStage = "Applied" | "AI_Screened" | "Eligible" | "Shortlisted" | "Assessment" | "Interview" | "Selected" | "Offer" | "Joined" | "Rejected";
export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
export type MentorStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED";
export type CollaborationStatus = "REQUESTED" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
export type ProjectStage = "Proposal" | "Prototype" | "Testing" | "Final" | "Completed";
export type DriveStage = "Registered" | "Eligible" | "Shortlisted" | "Interviewed" | "Selected" | "Joined";

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  description: string;
  industry: string;
  companyType: string;
  foundedYear: number;
  size: string;
  headquarters: string;
  locations: string[];
  website: string;
  linkedin: string;
  hiringDomains: string[];
  jobRoles: string[];
  preferredDegrees: string[];
  preferredBranches: string[];
  minCgpa: number;
  backlogPolicy: string;
  experienceRequirement: string;
  preferredTechnicalSkills: string[];
  preferredSoftSkills: string[];
  hiringLocations: string[];
  workMode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: CompanyStatus;
  verifiedAt?: string;
  reputation: {
    responseRate: number;
    completionRate: number;
    offerConversion: number;
    hiringTurnaroundDays: number;
  };
  logoColor: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  companyId: string;
  postingType: OpportunityType;
  title: string;
  department: string;
  description: string;
  duration: string;
  location: string;
  workMode: string;
  stipend: string;
  openings: number;
  degree: string[];
  branch: string[];
  gradYear: number[];
  minCgpa: number;
  backlogPolicy: string;
  experience: string;
  requiredSkills: string[];
  preferredSkills: string[];
  softSkills: string[];
  applicationDeadline: string;
  shortlistQuota: number;
  selectionProcess: string;
  interviewType: string;
  interviewStages: string[];
  status: OpportunityStatus;
  applicants: string[];
  shortlisted: string[];
  qualityScore: number;
  qualityFixes: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  stage: ApplicationStage;
  matchPercentage: number;
  atsScore: number;
  cgpa: number;
  degree: string;
  branch: string;
  gradYear: number;
  skills: string[];
  verifiedSkills: string[];
  assessmentScore: number;
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
  history: Array<{ stage: ApplicationStage; at: string }>;
}

export interface Interview {
  id: string;
  applicationId: string;
  opportunityId: string;
  candidateName: string;
  interviewerName: string;
  date: string;
  time: string;
  type: "ONLINE" | "OFFLINE" | "OTHER";
  meetingLink?: string;
  round: number;
  totalRounds: number;
  status: InterviewStatus;
  feedback?: InterviewFeedback;
  notes: string;
}

export interface InterviewFeedback {
  technicalKnowledge: number;
  communication: number;
  problemSolving: number;
  domainKnowledge: number;
  cultureFit: number;
  overall: number;
  strengths: string;
  weaknesses: string;
  comments: string;
  recommendation: "REJECT" | "HOLD" | "RECOMMEND";
}

export interface Offer {
  id: string;
  applicationId: string;
  opportunityId: string;
  candidateName: string;
  role: string;
  joiningDate: string;
  stipend: string;
  location: string;
  status: "OFFERED" | "ACCEPTED" | "DECLINED" | "JOINED";
  offerLetterUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgram {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type: "course" | "certification" | "workshop" | "bootcamp" | "training" | "mentorship";
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  deliveryMode: string;
  prerequisites: string[];
  hasCertificate: boolean;
  skills: string[];
  slots: number;
  enrolled: string[];
  createdAt: string;
}

export interface Mentor {
  id: string;
  companyId: string;
  name: string;
  designation: string;
  expertise: string[];
  experienceYears: number;
  bio: string;
  slots: number;
  available: boolean;
  mentorshipRequests: MentorshipRequest[];
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  status: MentorStatus;
  message: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface CollaborationProposal {
  id: string;
  companyId: string;
  institutionId: string;
  institutionName: string;
  type: "guest_lecture" | "workshop" | "industry_visit" | "live_project" | "research" | "consultancy" | "fdp" | "faculty_internship";
  title: string;
  description: string;
  status: CollaborationStatus;
  proposedAt: string;
  respondedAt?: string;
  completedAt?: string;
  outcome?: string;
}

export interface LiveProject {
  id: string;
  companyId: string;
  title: string;
  description: string;
  durationWeeks: number;
  teamSize: number;
  requiredSkills: string[];
  deliverables: string[];
  milestones: Array<{ name: string; due: string }>;
  stage: ProjectStage;
  submissions: Array<{ id: string; teamName: string; submittedAt: string }>;
  createdAt: string;
}

export interface Challenge {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type: "hackathon" | "coding" | "design" | "case" | "innovation";
  startDate: string;
  endDate: string;
  skills: string[];
  participants: string[];
  teams: Array<{ id: string; name: string; members: string[] }>;
  submissions: Array<{ id: string; teamId: string; submittedAt: string }>;
  winners?: string[];
  createdAt: string;
}

export interface CampusDrive {
  id: string;
  companyId: string;
  institutionId: string;
  institutionName: string;
  opportunityId: string;
  title: string;
  date: string;
  eligibility: {
    degree: string[];
    branch: string[];
    gradYear: number[];
    minCgpa: number;
    skills: string[];
  };
  registrations: string[];
  stages: Array<{ name: string; date?: string }>;
  createdAt: string;
}

export interface Recruiter {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: "ADMIN" | "HR_MANAGER" | "RECRUITER" | "INTERVIEWER" | "HIRING_MANAGER" | "MENTOR" | "VIEWER";
  assignedOpportunities: string[];
  assignedPools: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  companyId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  companyId: string;
  title: string;
  type: string;
  url: string;
  accessRoles: string[];
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export interface SkillDemand {
  skill: string;
  count: number;
  percentage: number;
}

export interface RecruitmentAnalytics {
  totalApplications: number;
  eligibleCandidates: number;
  shortlistedCandidates: number;
  interviews: number;
  selections: number;
  offers: number;
  joined: number;
  applicationToShortlistRatio: number;
  shortlistToInterviewRatio: number;
  interviewToSelectionRatio: number;
  selectionRate: number;
  avgTimeToHire: number;
  avgApplicantsPerOpportunity: number;
}

export interface OpportunityPerformance {
  opportunityId: string;
  title: string;
  applications: number;
  eligible: number;
  shortlisted: number;
  interviewConversion: number;
  selectionConversion: number;
}

export interface TalentAvailability {
  bySkill: Record<string, number>;
  byLocation: Record<string, number>;
  byDegree: Record<string, number>;
  byBranch: Record<string, number>;
  byExperience: Record<string, number>;
}
