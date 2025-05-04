import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Globe, 
  DollarSign, 
  Briefcase,
  Star,
  Users,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Award,
  Hash,
  Heart,
  GraduationCap,
  FileText,
  UserCheck,
  Handshake,
  Newspaper,
  PhoneCall,
  ClipboardList,
  BookOpen
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { supabase } from '../lib/supabase';
import { CeoGlassdoorSummary } from '../components/candidates/CeoGlassdoorSummary';
import { 
  Candidate, 
  Employment, 
  Education,
  GlassdoorReview,
  CandidateNote,
  CandidateEmail,
  CallTranscript,
  CandidateBoardMembership,
  CandidateRecommendation,
  CandidateSkill,
  CandidateInterest,
  CeoReview,
  CeoGlassdoorSummary as CeoGlassdoorSummaryType
} from '../types/database.types';
import { formatRevenue, formatDate } from '../lib/utils';
import CeoReviews from '../components/candidates/CeoReviews';

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [employments, setEmployments] = useState<Employment[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [reviews, setReviews] = useState<GlassdoorReview[]>([]);
  const [ceoReviews, setCeoReviews] = useState<CeoReview[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [emails, setEmails] = useState<CandidateEmail[]>([]);
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [boardMemberships, setBoardMemberships] = useState<CandidateBoardMembership[]>([]);
  const [recommendations, setRecommendations] = useState<CandidateRecommendation[]>([]);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [interests, setInterests] = useState<CandidateInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ceoGlassdoorSummary, setCeoGlassdoorSummary] = useState<CeoGlassdoorSummaryType | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchCandidateData = async () => {
      setIsLoading(true);
      try {
        // Fetch candidate details
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', id)
          .single();
          
        if (candidateError) throw candidateError;
        setCandidate(candidateData);
        
        // Fetch employment history
        const { data: employmentsData, error: employmentsError } = await supabase
          .from('employments')
          .select('*')
          .eq('candidate_id', id)
          .order('start_year', { ascending: false });
          
        if (employmentsError) throw employmentsError;
        setEmployments(employmentsData || []);

        // Fetch Glassdoor reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('glassdoor_reviews')
          .select('*')
          .eq('candidate_id', id)
          .order('review_date', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
        
        // Fetch education history
        const { data: educationsData, error: educationsError } = await supabase
          .from('educations')
          .select('*')
          .eq('candidate_id', id)
          .order('created_at', { ascending: false });
          
        if (educationsError) throw educationsError;
        setEducations(educationsData || []);

        // Fetch CEO reviews
        const { data: ceoReviewsData, error: ceoReviewsError } = await supabase
          .from('ceo_reviews')
          .select('*')
          .eq('employment_id', employmentsData?.[0]?.id)
          .order('review_date', { ascending: false });

        if (ceoReviewsError) throw ceoReviewsError;
        setCeoReviews(ceoReviewsData || []);

        // Fetch CEO Glassdoor summary
        if (employmentsData?.[0]?.id) {
          const { data: summaryData, error: summaryError } = await supabase
            .from('ceo_glassdoor_summary')
            .select('*')
            .eq('employment_id', employmentsData[0].id)
            .single();

          if (summaryError && summaryError.code !== 'PGRST116') {
            throw summaryError;
          }
          setCeoGlassdoorSummary(summaryData);
        }

        // Fetch notes
        const { data: notesData, error: notesError } = await supabase
          .from('candidate_notes')
          .select('*')
          .eq('candidate_id', id)
          .order('created_at', { ascending: false });

        if (notesError) throw notesError;
        setNotes(notesData || []);

        // Fetch emails
        const { data: emailsData, error: emailsError } = await supabase
          .from('candidate_emails')
          .select('*')
          .eq('candidate_id', id)
          .order('sent_at', { ascending: false });

        if (emailsError) throw emailsError;
        setEmails(emailsData || []);

        // Fetch call transcripts
        const { data: transcriptsData, error: transcriptsError } = await supabase
          .from('call_transcripts')
          .select('*')
          .eq('candidate_id', id)
          .order('call_date', { ascending: false });

        if (transcriptsError) throw transcriptsError;
        setTranscripts(transcriptsData || []);

        // Fetch board memberships
        const { data: boardData, error: boardError } = await supabase
          .from('candidate_board_memberships')
          .select('*')
          .eq('candidate_id', id)
          .order('start_year', { ascending: false });

        if (boardError) throw boardError;
        setBoardMemberships(boardData || []);

        // Fetch recommendations with source details
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from('candidate_recommendations')
          .select('*, source:recommendation_sources(*)')
          .eq('candidate_id', id);

        if (recommendationsError) throw recommendationsError;
        setRecommendations(recommendationsData || []);

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('candidate_skills')
          .select('*')
          .eq('candidate_id', id);

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Fetch interests
        const { data: interestsData, error: interestsError } = await supabase
          .from('candidate_interests')
          .select('*')
          .eq('candidate_id', id);

        if (interestsError) throw interestsError;
        setInterests(interestsData || []);

      } catch (error) {
        console.error('Error fetching candidate data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidateData();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading candidate profile...</span>
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Candidate Not Found</h3>
          <p className="mt-1 text-gray-500">
            The candidate you're looking for doesn't exist or you don't have access.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader
        title={candidate.name}
        description={candidate.current_title || 'No current title'}
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Basic Info */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar name={candidate.name} size="xl" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                    <p className="text-gray-600">{candidate.current_title}</p>
                    {candidate.current_employer && (
                      <p className="text-gray-500">{candidate.current_employer}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidate.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{candidate.location}</span>
                    </div>
                  )}
                  
                  {candidate.employer_industry && (
                    <div className="flex items-center text-gray-600">
                      <Building className="h-5 w-5 mr-2" />
                      <span>{candidate.employer_industry}</span>
                    </div>
                  )}
                  
                  {candidate.employer_stock_symbol && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 mr-2" />
                      <span>{candidate.employer_stock_symbol}</span>
                    </div>
                  )}
                  
                  {candidate.employer_revenue_usd && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span>{formatRevenue(candidate.employer_revenue_usd)} Revenue</span>
                    </div>
                  )}
                </div>
                
                {candidate.notes && (
                  <div className="mt-4">
                    <p className="text-gray-600">{candidate.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.hungry && (
                    <Badge variant="primary">Hungry</Badge>
                  )}
                  {candidate.humble && (
                    <Badge variant="primary">Humble</Badge>
                  )}
                  {candidate.smart && (
                    <Badge variant="primary">Smart</Badge>
                  )}
                  {candidate.previous_ceo_experience && (
                    <Badge variant="secondary">CEO Experience</Badge>
                  )}
                  {candidate.exec_staff && (
                    <Badge variant="secondary">Exec Staff</Badge>
                  )}
                  {candidate.global_experience && (
                    <Badge variant="secondary">Global</Badge>
                  )}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.linkedin_url && (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ExternalLink className="h-4 w-4 mr-1.5" />
                      LinkedIn
                    </a>
                  )}
                  
                  {candidate.x_com_url && (
                    <a
                      href={candidate.x_com_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ExternalLink className="h-4 w-4 mr-1.5" />
                      X.com
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CEO Glassdoor Summary */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">CEO Glassdoor Summary</h2>
              </CardHeader>
              <CardContent>
                {ceoGlassdoorSummary ? (
                  <CeoGlassdoorSummary summary={ceoGlassdoorSummary} />
                ) : (
                  <EmptyState
                    icon={Star}
                    title="No Glassdoor summary"
                    description="No Glassdoor summary data is available for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Skills</h2>
              </CardHeader>
              <CardContent>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill.skill_name} variant="primary">
                        {skill.skill_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Hash}
                    title="No skills listed"
                    description="No skills have been added for this candidate yet."
                  />
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Interests</h2>
              </CardHeader>
              <CardContent>
                {interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest.interest_name} variant="secondary">
                        {interest.interest_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Heart}
                    title="No interests listed"
                    description="No interests have been added for this candidate yet."
                  />
                )}
              </CardContent>
            </Card>

            {/* Board Memberships */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Board Memberships</h2>
              </CardHeader>
              <CardContent>
                {boardMemberships.length > 0 ? (
                  <div className="space-y-4">
                    {boardMemberships.map((membership) => (
                      <div key={`${membership.organization_name}-${membership.role}`} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <h3 className="font-medium text-gray-900">{membership.organization_name}</h3>
                        <p className="text-gray-600">{membership.role}</p>
                        <p className="text-sm text-gray-500">
                          {membership.start_year} - {membership.end_year || 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Handshake}
                    title="No board memberships"
                    description="No board memberships have been recorded for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* CEO Reviews */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">CEO Reviews</h2>
              </CardHeader>
              <CardContent>
                {ceoReviews.length > 0 ? (
                  <CeoReviews reviews={ceoReviews} />
                ) : (
                  <EmptyState
                    icon={Star}
                    title="No CEO reviews"
                    description="No CEO reviews are available for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Call Transcripts */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Call Transcripts</h2>
              </CardHeader>
              <CardContent>
                {transcripts.length > 0 ? (
                  <div className="space-y-6">
                    {transcripts.map((transcript) => (
                      <div key={transcript.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">{formatDate(transcript.call_date)}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-gray-600 whitespace-pre-line">{transcript.transcript_content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={PhoneCall}
                    title="No call transcripts"
                    description="No call transcripts have been recorded for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Emails */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Email Communications</h2>
              </CardHeader>
              <CardContent>
                {emails.length > 0 ? (
                  <div className="space-y-6">
                    {emails.map((email) => (
                      <div key={email.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{email.subject || '(No subject)'}</h3>
                          <p className="text-sm text-gray-500">{formatDate(email.sent_at)}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">From: {email.sender}</p>
                        <p className="text-sm text-gray-600">To: {email.recipient}</p>
                        {email.body && (
                          <div className="mt-2">
                            <p className="text-gray-600 whitespace-pre-line">{email.body}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Mail}
                    title="No email communications"
                    description="No email communications have been recorded for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Recommendations</h2>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.map((recommendation) => (
                      <div key={recommendation.id} className="flex items-center justify-between">
                        <span className="text-gray-600">{recommendation.source?.source_name}</span>
                        <Badge variant="success">Recommended</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={UserCheck}
                    title="No recommendations"
                    description="No recommendations have been recorded for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Notes</h2>
              </CardHeader>
              <CardContent>
                {notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {note.author && `Added by ${note.author}`}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(note.created_at)}</p>
                        </div>
                        <p className="mt-2 text-gray-600">{note.note_content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No notes"
                    description="No notes have been added for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Employment History */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Employment History</h2>
              </CardHeader>
              <CardContent>
                {employments.length > 0 ? (
                  <div className="space-y-6">
                    {employments.map((employment) => (
                      <div key={employment.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <h3 className="font-medium text-gray-900">{employment.title}</h3>
                        <p className="text-gray-600">{employment.employer_name}</p>
                        <p className="text-sm text-gray-500">
                          {employment.start_year} - {employment.end_year || 'Present'}
                        </p>
                        {employment.description && (
                          <p className="mt-2 text-gray-600">{employment.description}</p>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          {employment.verified && (
                            <Badge variant="success">Verified</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Briefcase}
                    title="No employment history"
                    description="No employment history has been recorded for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Education</h2>
              </CardHeader>
              <CardContent>
                {educations.length > 0 ? (
                  <div className="space-y-4">
                    {educations.map((education) => (
                      <div key={education.id}>
                        <h3 className="font-medium text-gray-900">{education.institution}</h3>
                        {education.degree && (
                          <p className="text-gray-600">
                            {education.degree}
                            {education.field_of_study && ` in ${education.field_of_study}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={GraduationCap}
                    title="No education history"
                    description="No education history has been recorded for this candidate."
                  />
                )}
              </CardContent>
            </Card>

            {/* Attributes */}
            {(candidate.hungry_examples || candidate.humble_examples || candidate.smart_examples) && (
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-lg font-medium text-gray-900">Attributes</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.hungry_examples && (
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1.5 text-blue-500" />
                          Hungry
                        </h3>
                        <p className="mt-1 text-gray-600">{candidate.hungry_examples}</p>
                      </div>
                    )}
                    
                    {candidate.humble_examples && (
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1.5 text-blue-500" />
                          Humble
                        </h3>
                        <p className="mt-1 text-gray-600">{candidate.humble_examples}</p>
                      </div>
                    )}
                    
                    {candidate.smart_examples && (
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1.5 text-blue-500" />
                          Smart
                        </h3>
                        <p className="mt-1 text-gray-600">{candidate.smart_examples}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Global Experience */}
            {candidate.global_experience && candidate.global_experience_details && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium text-gray-900">Global Experience</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{candidate.global_experience_details}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;