export interface EducationInfo {
  degree: string;
  program: string;
  specialization: string;
  institution: string;
  status: string;
  summary: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  category: 'input' | 'software' | 'analysis' | 'output';
  status: 'implemented' | 'partially-implemented' | 'planned';
  details: string;
}

export interface Project {
  id: string;
  title: string;
  codeName: string;
  tagline: string;
  problem: string;
  description: string;
  architectureFlow?: string;
  architectureNodes?: ArchitectureNode[];
  architectureDetails?: {
    pipelineTitle: string;
    pipelineSummary: string;
    stageExplanation: { stage: string; desc: string; status: 'implemented' | 'partially-implemented' | 'planned' }[];
  };
  keyDecisions?: string[];
  challengesLearned?: string;
  myContribution?: string;
  collaborators?: string;
  implementedFeatures: string[];
  plannedFeatures?: string[];
  cardHighlights?: string[];
  techStack: string[];
  status: string;
  githubUrl?: string;
  demoUrl?: string;
  pendingConfirmation?: boolean;
}

export interface ExperienceItem {
  id: string;
  index: string;
  period: string;
  role: string;
  company: string;
  roleType: string;
  location: string;
  status?: string;
  summary: string;
  responsibilities: string[];
  technicalAreas: string[];
  stack: string[];
  pendingConfirmation?: boolean;
}

export interface SkillItem {
  skill: string;
  proficiency: string;
  linkUrl?: string;
  isExternal?: boolean;
}

export interface SkillCategory {
  id: string;
  code: string;
  categoryName: string;
  items: SkillItem[];
}

export interface CourseLearningItem {
  title: string;
  issuer: string;
  description: string;
  tag?: string;
}

export interface PersonalInfo {
  name: string;
  handle: string;
  role: string;
  headline: string;
  location: string;
  status: string;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
  resumeUrl?: string;
  bio: string;
  education: EducationInfo;
  engineeringPhilosophy: {
    rule: string;
    desc: string;
  }[];
}
