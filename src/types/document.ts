import type { Database } from '@/types/database';

export type Document = Database['public']['Tables']['documents']['Row'] & { content?: string, type?: string, analysis?: any };

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  type: AnalysisType;
  result: SimplificationResult | RiskAnalysisResult | SummaryResult | ClauseResult | LawyerPrepResult | EntityResult;
  createdAt: string;
}

export type AnalysisType = 'simplify' | 'risk' | 'summary' | 'clauses' | 'prepare' | 'entities';

export interface SimplificationResult {
  sections: {
    original: string;
    simplified: string;
    difficulty: 'easy' | 'moderate' | 'complex';
  }[];
  overallReadability: string;
}

export interface RiskAnalysisResult {
  overallRiskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  risks: {
    clause: string;
    riskLevel: 'low' | 'medium' | 'high';
    explanation: string;
    recommendation: string;
    location: string;
  }[];
  obligations: {
    description: string;
    party: string;
    deadline?: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface SummaryResult {
  executiveSummary: string;
  keyPoints: string[];
  parties: string[];
  effectiveDate?: string;
  expirationDate?: string;
  keyDates: { date: string; description: string }[];
  actionItems: { item: string; priority: 'low' | 'medium' | 'high'; deadline?: string }[];
}

export interface ClauseResult {
  clauses: {
    type: string;
    content: string;
    importance: 'critical' | 'important' | 'standard';
    explanation: string;
  }[];
}

export interface LawyerPrepResult {
  questionsToAsk: string[];
  areasNeedingReview: { area: string; reason: string }[];
  documentsToGather: string[];
  preparationNotes: string;
}

export interface EntityResult {
  entities: {
    text: string;
    type: 'person' | 'organization' | 'date' | 'money' | 'location' | 'legal_term';
    context: string;
  }[];
}

export interface ComparisonResult {
  summary: string;
  differences: {
    category: string;
    documentA: string;
    documentB: string;
    significance: 'critical' | 'important' | 'minor';
    recommendation: string;
  }[];
  onlyInA: string[];
  onlyInB: string[];
  favorability: {
    documentA: string;
    documentB: string;
    recommendation: string;
  };
}
