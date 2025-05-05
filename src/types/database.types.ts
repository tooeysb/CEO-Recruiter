export type Candidate = {
  id: string;
  name: string;
  location: string | null;
  current_title: string | null;
  current_employer: string | null;
  employer_stock_symbol: string | null;
  employer_revenue_usd: number | null;
  employer_industry: string | null;
  linkedin_url: string | null;
  x_com_url: string | null;
  glassdoor_url: string | null;
  notes: string | null;
  update_status: string;
  disqualified: boolean;
  dq_reason: string | null;
  hungry: boolean;
  hungry_examples: string | null;
  humble: boolean;
  humble_examples: string | null;
  smart: boolean;
  smart_examples: string | null;
  previous_ceo_experience: boolean;
  exec_staff: boolean;
  global_experience: boolean;
  global_experience_details: string | null;
  created_at: string;
  updated_at: string;
};

export type Employment = {
  id: string;
  candidate_id: string;
  employer_name: string;
  title: string;
  start_year: number | null;
  end_year: number | null;
  description: string | null;
  verified: boolean;
  glassdoor_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: string;
  candidate_id: string;
  degree: string | null;
  field_of_study: string | null;
  institution: string;
  created_at: string;
  updated_at: string;
};

export type EngagementDetails = {
  id: string;
  client_company: string;
  report_title: string;
  report_date: string;
  confidentiality_notice: string | null;
  created_at: string;
  updated_at: string;
};

export type EngagementTeam = {
  id: string;
  engagement_id: string;
  name: string;
  role: string;
  email: string | null;
  mobile_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateNote = {
  id: string;
  candidate_id: string;
  note_content: string;
  author: string | null;
  created_at: string;
  updated_at: string;
};

export type RecommendationSource = {
  id: string;
  source_name: string;
  created_at: string;
  updated_at: string;
};

export type CandidateRecommendation = {
  id: string;
  candidate_id: string;
  source_id: string;
  created_at: string;
  updated_at: string;
  source?: RecommendationSource;
};

export type CandidateEmail = {
  id: string;
  candidate_id: string;
  sender: string;
  recipient: string;
  subject: string | null;
  body: string | null;
  sent_at: string;
  created_at: string;
  updated_at: string;
};

export type Endorser = {
  id: string;
  candidate_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Detractor = {
  id: string;
  candidate_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CallTranscript = {
  id: string;
  candidate_id: string;
  transcript_content: string;
  call_date: string;
  created_at: string;
  updated_at: string;
};

export type Meeting = {
  id: string;
  candidate_id: string;
  meeting_date: string;
  meeting_time: string | null;
  location: string | null;
  is_virtual: boolean;
  meeting_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CeoReview = {
  review_id: string;
  employment_id: string;
  review_title: string;
  rating: number;
  review_date: string;
  reviewer_role: string | null;
  employment_status: string | null;
  location: string | null;
  recommend: boolean | null;
  ceo_approval: boolean | null;
  business_outlook: string | null;
  pros: string | null;
  cons: string | null;
  advice_to_management: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateBoardMembership = {
  candidate_id: string;
  organization_name: string;
  role: string;
  start_year: number;
  end_year: number | null;
};

export type CandidateSkill = {
  candidate_id: string;
  skill_name: string;
};

export type CandidateInterest = {
  candidate_id: string;
  interest_name: string;
};

export type CeoGlassdoorSummary = {
  summary_id: string;
  employment_id: string;
  overall_rating: number;
  total_reviews: number;
  recommendation_rate: number;
  ceo_name: string;
  ceo_approval_rate: number;
  business_outlook_positive: number;
  culture_and_values: number;
  diversity_equity_inclusion: number;
  work_life_balance: number;
  senior_management: number;
  compensation_and_benefits: number;
  career_opportunities: number;
  five_star_percentage: number;
  four_star_percentage: number;
  three_star_percentage: number;
  two_star_percentage: number;
  one_star_percentage: number;
  created_at: string;
  updated_at: string;
};

export interface GlassdoorReview {
  id: string;
  candidate_id: string;
  employment_id: string;
  review_rating: number;
  review_date: string;
  review_title: string;
  pros: string | null;
  cons: string | null;
  role: string | null;
  location: string | null;
  helpful_count: number;
  review_link: string;
  created_at: string;
  updated_at: string;
}