import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  SendHorizonal,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import claudeService from '../lib/claude-service';
import { Candidate, Employment, Education, CandidateNote, CandidateEmail, CallTranscript, Endorser, Detractor, CandidateBoardMembership, CeoGlassdoorSummary, GlassdoorReview } from '../types/database.types';

// Default prompt template as fallback
const DEFAULT_PROMPT = `Please analyze this CEO candidate profile and provide a comprehensive summary of their experience, skills, and potential fit for executive roles. Consider the following aspects:
- Overall career trajectory and progression
- Leadership experience and style based on their history
- Key strengths and potential areas for development
- Industry expertise and transferable skills
- Educational background and its relevance
- Cultural fit indicators based on their values (hungry/humble/smart attributes)
- Any red flags or areas that require further investigation

Provide a balanced assessment that highlights both strengths and potential concerns.`;

const CandidateSummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [employments, setEmployments] = useState<Employment[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [emails, setEmails] = useState<CandidateEmail[]>([]);
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [endorsers, setEndorsers] = useState<Endorser[]>([]);
  const [detractors, setDetractors] = useState<Detractor[]>([]);
  const [boardMemberships, setBoardMemberships] = useState<CandidateBoardMembership[]>([]);
  const [ceoGlassdoorSummary, setCeoGlassdoorSummary] = useState<CeoGlassdoorSummary | null>(null);
  const [glassdoorReviews, setGlassdoorReviews] = useState<GlassdoorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch default prompt template when component loads
  useEffect(() => {
    const fetchDefaultPrompt = async () => {
      try {
        const { data, error } = await supabase
          .from('prompt_templates')
          .select('*')
          .eq('is_default', true)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching default prompt template:', error);
          return;
        }
        
        if (data && data.content) {
          console.log('Using default prompt template:', data.name);
          setPrompt(data.content);
        } else {
          console.log('No default prompt template found, using fallback');
        }
      } catch (err) {
        console.error('Exception fetching default prompt:', err);
      }
    };
    
    fetchDefaultPrompt();
  }, []);
  
  useEffect(() => {
    fetchCandidateData();
  }, [id]);
  
  const fetchCandidateData = async () => {
    if (!id) return;
    
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
      
      // Fetch education history
      const { data: educationsData, error: educationsError } = await supabase
        .from('educations')
        .select('*')
        .eq('candidate_id', id)
        .order('created_at', { ascending: false });
        
      if (educationsError) throw educationsError;
      setEducations(educationsData || []);
      
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
      
      // Fetch endorsers
      const { data: endorsersData, error: endorsersError } = await supabase
        .from('endorsers')
        .select('*')
        .eq('candidate_id', id);
        
      if (endorsersError) throw endorsersError;
      setEndorsers(endorsersData || []);
      
      // Fetch detractors
      const { data: detractorsData, error: detractorsError } = await supabase
        .from('detractors')
        .select('*')
        .eq('candidate_id', id);
        
      if (detractorsError) throw detractorsError;
      setDetractors(detractorsData || []);
      
      // Fetch board memberships
      const { data: boardData, error: boardError } = await supabase
        .from('candidate_board_memberships')
        .select('*')
        .eq('candidate_id', id)
        .order('start_year', { ascending: false });
        
      if (boardError) throw boardError;
      setBoardMemberships(boardData || []);
      
      // Fetch CEO Glassdoor summary if employment data exists
      if (employmentsData && employmentsData.length > 0) {
        // Try to find the most recent employment with a Glassdoor summary
        for (const employment of employmentsData) {
          const { data: summaryData, error: summaryError } = await supabase
            .from('ceo_glassdoor_summary')
            .select('*')
            .eq('employment_id', employment.id)
            .maybeSingle();

          if (summaryError) {
            console.error(`Error fetching summary for employment ID ${employment.id}:`, summaryError);
            continue;
          }

          if (summaryData) {
            setCeoGlassdoorSummary(summaryData);
            break;
          }
        }
      }
      
      // Fetch Glassdoor reviews for candidate or their employments
      try {
        // First try to get reviews linked directly to the candidate
        let { data: candidateReviews, error: candidateReviewsError } = await supabase
          .from('glassdoor_reviews')
          .select('*')
          .eq('candidate_id', id);
          
        if (candidateReviewsError) {
          console.error('Error fetching candidate Glassdoor reviews:', candidateReviewsError);
          candidateReviews = [];
        }
        
        // Then get reviews linked to any of the candidate's employments
        const employmentIds = employmentsData?.map(e => e.id) || [];
        
        if (employmentIds.length > 0) {
          const { data: employmentReviews, error: employmentReviewsError } = await supabase
            .from('glassdoor_reviews')
            .select('*')
            .in('employment_id', employmentIds);
            
          if (employmentReviewsError) {
            console.error('Error fetching employment Glassdoor reviews:', employmentReviewsError);
          } else if (employmentReviews) {
            // Combine both sets of reviews and remove duplicates
            const allReviews = [...(candidateReviews || []), ...(employmentReviews || [])];
            const uniqueReviews = Array.from(new Map(allReviews.map(review => [review.id, review])).values());
            setGlassdoorReviews(uniqueReviews);
          }
        } else {
          setGlassdoorReviews(candidateReviews || []);
        }
      } catch (reviewsError) {
        console.error('Error processing Glassdoor reviews:', reviewsError);
      }
      
    } catch (error) {
      console.error('Error fetching candidate data:', error);
      setError('Failed to load candidate data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateCandidateProfile = () => {
    // Format the candidate data as text
    let profileText = '';
    
    if (candidate) {
      profileText += `CEO PROFILE\n`;
      profileText += `-------------------\n`;
      profileText += `Name: ${candidate.name}\n`;
      profileText += `Current Title: ${candidate.current_title || 'N/A'}\n`;
      profileText += `Current Employer: ${candidate.current_employer || 'N/A'}\n`;
      profileText += `Location: ${candidate.location || 'N/A'}\n`;
      profileText += `Industry: ${candidate.employer_industry || 'N/A'}\n`;
      
      if (candidate.employer_stock_symbol) {
        profileText += `Stock Symbol: ${candidate.employer_stock_symbol}\n`;
      }
      
      if (candidate.employer_revenue_usd) {
        profileText += `Company Revenue: $${(candidate.employer_revenue_usd / 1000000000).toFixed(1)}B\n`;
      }
      
      // Contact Links
      profileText += `\nCONTACT INFORMATION\n`;
      profileText += `-------------------\n`;
      if (candidate.linkedin_url) {
        profileText += `LinkedIn: ${candidate.linkedin_url}\n`;
      }
      if (candidate.x_com_url) {
        profileText += `X/Twitter: ${candidate.x_com_url}\n`;
      }
      if (candidate.glassdoor_url) {
        profileText += `Glassdoor: ${candidate.glassdoor_url}\n`;
      }
      
      // Personal attributes
      profileText += `\nPERSONAL ATTRIBUTES\n`;
      profileText += `-------------------\n`;
      profileText += `Hungry: ${candidate.hungry ? 'Yes' : 'No'}\n`;
      if (candidate.hungry_examples) {
        profileText += `Hungry Examples: ${candidate.hungry_examples}\n`;
      }
      
      profileText += `Humble: ${candidate.humble ? 'Yes' : 'No'}\n`;
      if (candidate.humble_examples) {
        profileText += `Humble Examples: ${candidate.humble_examples}\n`;
      }
      
      profileText += `Smart: ${candidate.smart ? 'Yes' : 'No'}\n`;
      if (candidate.smart_examples) {
        profileText += `Smart Examples: ${candidate.smart_examples}\n`;
      }
      
      profileText += `Previous CEO Experience: ${candidate.previous_ceo_experience ? 'Yes' : 'No'}\n`;
      profileText += `Executive Staff Experience: ${candidate.exec_staff ? 'Yes' : 'No'}\n`;
      profileText += `Global Experience: ${candidate.global_experience ? 'Yes' : 'No'}\n`;
      if (candidate.global_experience_details) {
        profileText += `Global Experience Details: ${candidate.global_experience_details}\n`;
      }
      
      // Employment history
      if (employments.length > 0) {
        profileText += `\nEMPLOYMENT HISTORY\n`;
        profileText += `-------------------\n`;
        
        employments.forEach(job => {
          profileText += `Company: ${job.employer_name}\n`;
          profileText += `Title: ${job.title}\n`;
          profileText += `Period: ${job.start_year || 'N/A'} - ${job.end_year || 'Present'}\n`;
          
          if (job.description) {
            profileText += `Description: ${job.description}\n`;
          }
          
          if (job.glassdoor_url) {
            profileText += `Glassdoor: ${job.glassdoor_url}\n`;
          }
          
          profileText += `\n`;
        });
      }
      
      // CEO Glassdoor Summary
      if (ceoGlassdoorSummary) {
        profileText += `\nCEO GLASSDOOR SUMMARY\n`;
        profileText += `-------------------\n`;
        profileText += `Overall Rating: ${ceoGlassdoorSummary.overall_rating}/5\n`;
        profileText += `Total Reviews: ${ceoGlassdoorSummary.total_reviews}\n`;
        profileText += `CEO Approval Rate: ${ceoGlassdoorSummary.ceo_approval_rate}%\n`;
        profileText += `Recommendation Rate: ${ceoGlassdoorSummary.recommendation_rate}%\n`;
        profileText += `Business Outlook Positive: ${ceoGlassdoorSummary.business_outlook_positive}%\n`;
        
        profileText += `Culture and Values: ${ceoGlassdoorSummary.culture_and_values}/5\n`;
        profileText += `Diversity & Inclusion: ${ceoGlassdoorSummary.diversity_equity_inclusion}/5\n`;
        profileText += `Work-Life Balance: ${ceoGlassdoorSummary.work_life_balance}/5\n`;
        profileText += `Senior Management: ${ceoGlassdoorSummary.senior_management}/5\n`;
        profileText += `Compensation and Benefits: ${ceoGlassdoorSummary.compensation_and_benefits}/5\n`;
        profileText += `Career Opportunities: ${ceoGlassdoorSummary.career_opportunities}/5\n`;
        
        profileText += `\nRating Distribution:\n`;
        profileText += `5 Stars: ${ceoGlassdoorSummary.five_star_percentage}%\n`;
        profileText += `4 Stars: ${ceoGlassdoorSummary.four_star_percentage}%\n`;
        profileText += `3 Stars: ${ceoGlassdoorSummary.three_star_percentage}%\n`;
        profileText += `2 Stars: ${ceoGlassdoorSummary.two_star_percentage}%\n`;
        profileText += `1 Star: ${ceoGlassdoorSummary.one_star_percentage}%\n`;
      }
      
      // Glassdoor Reviews
      if (glassdoorReviews && glassdoorReviews.length > 0) {
        profileText += `\nGLASSDOOR REVIEWS (${glassdoorReviews.length})\n`;
        profileText += `-------------------\n`;
        
        glassdoorReviews.forEach((review, index) => {
          profileText += `Review #${index + 1}:\n`;
          profileText += `Rating: ${review.review_rating}/5\n`;
          profileText += `Date: ${new Date(review.review_date).toLocaleDateString()}\n`;
          profileText += `Title: ${review.review_title || 'N/A'}\n`;
          
          if (review.role) {
            profileText += `Employee Role: ${review.role}\n`;
          }
          
          if (review.location) {
            profileText += `Location: ${review.location}\n`;
          }
          
          if (review.pros) {
            profileText += `Pros: ${review.pros}\n`;
          }
          
          if (review.cons) {
            profileText += `Cons: ${review.cons}\n`;
          }
          
          if (review.helpful_count) {
            profileText += `Marked Helpful: ${review.helpful_count} times\n`;
          }
          
          profileText += `\n`;
        });
      }
      
      // Board Memberships
      if (boardMemberships && boardMemberships.length > 0) {
        profileText += `\nBOARD MEMBERSHIPS\n`;
        profileText += `-------------------\n`;
        
        boardMemberships.forEach(board => {
          profileText += `Organization: ${board.organization_name}\n`;
          profileText += `Role: ${board.role}\n`;
          profileText += `Period: ${board.start_year} - ${board.end_year || 'Present'}\n\n`;
        });
      }
      
      // Education history
      if (educations.length > 0) {
        profileText += `\nEDUCATION\n`;
        profileText += `-------------------\n`;
        
        educations.forEach(edu => {
          profileText += `Institution: ${edu.institution}\n`;
          profileText += `Degree: ${edu.degree || 'N/A'}\n`;
          
          if (edu.field_of_study) {
            profileText += `Field of Study: ${edu.field_of_study}\n`;
          }
          
          profileText += `\n`;
        });
      }
      
      // Endorsers
      if (endorsers && endorsers.length > 0) {
        profileText += `\nENDORSERS\n`;
        profileText += `-------------------\n`;
        
        endorsers.forEach(endorser => {
          profileText += `Name: ${endorser.name}\n`;
          if (endorser.description) {
            profileText += `Description: ${endorser.description}\n`;
          }
          profileText += `\n`;
        });
      }
      
      // Detractors
      if (detractors && detractors.length > 0) {
        profileText += `\nDETRACTORS\n`;
        profileText += `-------------------\n`;
        
        detractors.forEach(detractor => {
          profileText += `Name: ${detractor.name}\n`;
          if (detractor.description) {
            profileText += `Description: ${detractor.description}\n`;
          }
          profileText += `\n`;
        });
      }
      
      // Notes
      if (notes.length > 0) {
        profileText += `\nNOTES\n`;
        profileText += `-------------------\n`;
        
        notes.forEach(note => {
          profileText += `Date: ${new Date(note.created_at).toLocaleDateString()}\n`;
          profileText += `Author: ${note.author || 'Unknown'}\n`;
          profileText += `Content: ${note.note_content}\n\n`;
        });
      }
      
      // Email Communications
      if (emails.length > 0) {
        profileText += `\nEMAIL COMMUNICATIONS\n`;
        profileText += `-------------------\n`;
        
        emails.forEach(email => {
          profileText += `Date: ${new Date(email.sent_at).toLocaleDateString()}\n`;
          profileText += `From: ${email.sender}\n`;
          profileText += `To: ${email.recipient}\n`;
          profileText += `Subject: ${email.subject || 'No Subject'}\n`;
          
          if (email.body) {
            profileText += `Body: ${email.body.substring(0, 150)}${email.body.length > 150 ? '...' : ''}\n`;
          }
          
          profileText += `\n`;
        });
      }
      
      // Call Transcripts
      if (transcripts.length > 0) {
        profileText += `\nCALL TRANSCRIPTS\n`;
        profileText += `-------------------\n`;
        
        transcripts.forEach(transcript => {
          profileText += `Date: ${new Date(transcript.call_date).toLocaleDateString()}\n`;
          profileText += `Transcript: ${transcript.transcript_content.substring(0, 200)}${transcript.transcript_content.length > 200 ? '...' : ''}\n\n`;
        });
      }
      
      // General notes from candidate profile
      if (candidate.notes) {
        profileText += `\nADDITIONAL NOTES\n`;
        profileText += `-------------------\n`;
        profileText += `${candidate.notes}\n`;
      }
      
      // Additional information about profile data completeness
      profileText += `\n\nPROFILE COMPLETENESS SUMMARY\n`;
      profileText += `-------------------\n`;
      profileText += `Employment History: ${employments.length} records\n`;
      profileText += `Education History: ${educations.length} records\n`;
      profileText += `Notes: ${notes.length} records\n`;
      profileText += `Email Communications: ${emails.length} records\n`;
      profileText += `Call Transcripts: ${transcripts.length} records\n`;
      profileText += `Endorsers: ${endorsers.length} records\n`;
      profileText += `Detractors: ${detractors.length} records\n`;
      profileText += `Board Memberships: ${boardMemberships.length} records\n`;
      profileText += `Glassdoor Reviews: ${glassdoorReviews.length} records\n`;
      profileText += `Has CEO Glassdoor Summary: ${ceoGlassdoorSummary ? 'Yes' : 'No'}\n`;
    }
    
    return profileText;
  };
  
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const candidateProfile = generateCandidateProfile();
      
      console.log("Candidate profile data prepared:", candidateProfile.length, "characters");
      
      // Use Claude service to analyze the candidate profile
      try {
        const generatedSummary = await claudeService.analyzeCandidateProfile(prompt, candidateProfile);
        setSummary(generatedSummary);
        setIsGenerating(false);
      } catch (apiError: any) {
        console.error('Claude API error:', apiError);
        
        // Display helpful error messages based on error type
        if (apiError.message.includes('API key')) {
          setError(`Claude API key is missing or invalid. Please add a valid VITE_CLAUDE_API_KEY to your .env file and restart the server.`);
        } else if (apiError.message.includes('Failed to connect')) {
          setError(`Failed to connect to Claude API. Please check your internet connection and verify your API key is valid.`);
        } else {
          setError(`Claude API error: ${apiError.message}`);
        }
        
        setIsGenerating(false);
        
        // Fallback to placeholder for development/demo purposes
        // Remove this in production
        setTimeout(() => {
          console.warn("Using placeholder summary due to API error");
          const placeholderSummary = `# Executive Summary for ${candidate?.name}

## Career Trajectory
${candidate?.name} has demonstrated progressive leadership growth throughout their career, culminating in their current role as ${candidate?.current_title} at ${candidate?.current_employer}. Their experience spans across multiple organizations with increasing levels of responsibility.

## Leadership Experience
With ${candidate?.previous_ceo_experience ? 'previous CEO experience' : 'executive-level experience'}, they have shown capability in strategic decision-making and organizational leadership. ${candidate?.exec_staff ? 'Their executive staff experience indicates comfort working at the highest levels of organizational leadership.' : ''}

## Key Strengths
* ${candidate?.hungry ? 'Demonstrates strong drive and ambition (Hungry)' : ''}
* ${candidate?.humble ? 'Shows humility and team-orientation (Humble)' : ''}
* ${candidate?.smart ? 'Exhibits strategic intelligence and problem-solving abilities (Smart)' : ''}
* ${candidate?.global_experience ? 'Brings valuable global perspective and international business acumen' : 'Limited global experience may require development in international contexts'}

## Educational Background
${educations.length > 0 ? `Holds educational credentials from ${educations[0].institution}, which provides a solid foundation in ${educations[0].field_of_study || 'their field'}.` : 'Educational information requires further investigation.'}

## Endorsements and References
${endorsers.length > 0 ? `Has ${endorsers.length} documented endorsers, indicating strong professional relationships.` : 'Limited endorsement information available.'}
${detractors.length > 0 ? `There are ${detractors.length} documented detractors that should be considered.` : 'No documented detractors in the system.'}

## Glassdoor Insights
${ceoGlassdoorSummary ? `Glassdoor data shows a CEO approval rating of ${ceoGlassdoorSummary.ceo_approval_rate}% and overall company rating of ${ceoGlassdoorSummary.overall_rating}/5.` : 'No Glassdoor CEO ratings available.'}

## Potential Areas for Development
* Further assessment of industry-specific knowledge in relation to target roles
* Additional verification of leadership outcomes and organizational impact

## Recommendation
Based on the available information, ${candidate?.name} appears to be a ${candidate?.hungry && candidate?.humble && candidate?.smart ? 'strong' : 'potential'} candidate for executive consideration. ${candidate?.previous_ceo_experience ? 'Their CEO experience is particularly valuable for leadership roles.' : 'Further evaluation of leadership capabilities would be beneficial.'} I recommend proceeding with in-depth reference checks and focused interviews on strategic leadership experiences.`;
          
          setSummary(placeholderSummary);
          setIsGenerating(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      setError(`Failed to generate summary: ${error.message}`);
      setIsGenerating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading candidate data...</span>
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Candidate Not Found</h2>
        <p className="text-gray-600 mb-4">The candidate you're looking for doesn't exist or has been removed.</p>
        <Link to="/candidates" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft size={16} className="mr-1" /> Back to Candidates List
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Navigation buttons */}
      <div className="flex mb-6 border-b pb-3">
        <div className="flex w-full max-w-4xl mx-auto">
          <Link 
            to={`/candidates/${id}`}
            className="flex-1 py-2 px-4 text-center font-medium rounded-l-md bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            CEO Profile
          </Link>
          <Link
            to={`/candidates/${id}/summary`}
            className="flex-1 py-2 px-4 text-center font-medium rounded-r-md bg-blue-600 text-white"
          >
            CEO Summary (LLM)
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{candidate.name} - AI Summary</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Prompt</h2>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md min-h-[150px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt for the LLM..."
            />
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="flex items-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {summary && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Generated Summary</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Copy to clipboard
                  navigator.clipboard.writeText(summary);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {/* Display markdown-formatted text */}
                <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidateSummary; 