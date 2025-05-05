import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  BookOpen,
  ChevronLeft,
  Edit2,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/ui/Card';
import { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import CeoGlassdoorSummaryComponent from '../components/candidates/CeoGlassdoorSummary';
import { 
  Candidate, 
  Employment, 
  Education,
  CandidateNote,
  CandidateEmail,
  CallTranscript,
  CandidateBoardMembership,
  CandidateRecommendation,
  CandidateSkill,
  CandidateInterest,
  CeoGlassdoorSummary as CeoGlassdoorSummaryType,
  GlassdoorReview,
  Endorser,
  Detractor,
  Meeting
} from '../types/database.types';
import { formatRevenue, formatDate } from '../lib/utils';
import CeoReviews from '../components/candidates/CeoReviews';
import GlassdoorReviews from '../components/candidates/GlassdoorReviews';
import StandaloneCeoGlassdoorSummary from '../components/candidates/StandaloneCeoGlassdoorSummary';
import CandidateIdDisplay from '../components/candidates/CandidateIdDisplay';
import EndorsersTable from '../components/candidates/EndorsersTable';
import DetractorsTable from '../components/candidates/DetractorsTable';

interface EditableTableProps<T> {
  title: string;
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (value: any) => React.ReactNode;
  }[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  emptyMessage: string;
}

const EditableTable = <T extends { id: string }>({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  emptyMessage
}: EditableTableProps<T>) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key as string}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td key={column.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.render ? column.render(item[column.key]) : String(item[column.key])}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title={`No ${title.toLowerCase()}`}
            description={emptyMessage}
          />
        )}
      </CardContent>
    </Card>
  );
};

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [employments, setEmployments] = useState<Employment[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [emails, setEmails] = useState<CandidateEmail[]>([]);
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [boardMemberships, setBoardMemberships] = useState<CandidateBoardMembership[]>([]);
  const [recommendations, setRecommendations] = useState<CandidateRecommendation[]>([]);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [interests, setInterests] = useState<CandidateInterest[]>([]);
  const [endorsers, setEndorsers] = useState<Endorser[]>([]);
  const [detractors, setDetractors] = useState<Detractor[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ceoGlassdoorSummary, setCeoGlassdoorSummary] = useState<CeoGlassdoorSummaryType | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [glassdoorReviews, setGlassdoorReviews] = useState<any[]>([]);
  const [glassdoorLoading, setGlassdoorLoading] = useState(true);
  const [glassdoorError, setGlassdoorError] = useState<string | null>(null);
  
  // Add a ref to track if component is mounted
  const isMounted = React.useRef(true);
  
  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const fetchCandidateData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setGlassdoorLoading(true);
    setGlassdoorError(null);
    
    // Force a re-render to ensure the loading state is displayed
    setTimeout(() => {
      // Only update state if component is still mounted
      if (isMounted.current) {
        console.log('Forcing re-render for loading state');
        setGlassdoorLoading(true);
      }
    }, 0);
    
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

      // Fetch CEO Glassdoor summary
      if (employmentsData && employmentsData.length > 0) {
        console.log('Fetching CEO Glassdoor summary for employments:', employmentsData.map(e => e.id));
        
        // First check if the table exists and has any data
        const { data: allSummaries, error: allSummariesError } = await supabase
          .from('ceo_glassdoor_summary')
          .select('*');
        
        console.log('All CEO Glassdoor summaries in database:', allSummaries);
        if (allSummariesError) console.error('Error fetching all summaries:', allSummariesError);
        
        // Try to find the most recent employment with a Glassdoor summary
        let foundSummary = false;
        for (const employment of employmentsData) {
          console.log(`Checking for summary for employment ID: ${employment.id}`);
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
            console.log(`Found summary for employment ID ${employment.id}:`, summaryData);
            setCeoGlassdoorSummary(summaryData);
            foundSummary = true;
            break;
          }
        }
        
        if (!foundSummary) {
          console.log('No CEO Glassdoor summary found for any employment');
        }
      } else {
        console.log('No employments found, cannot fetch CEO Glassdoor summary');
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

      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .eq('candidate_id', id)
        .order('meeting_date', { ascending: false });

      if (meetingsError) throw meetingsError;
      setMeetings(meetingsData || []);

      // Debug logs for Glassdoor reviews
      console.log('Fetching Glassdoor reviews for candidate:', id);
      console.log('Candidate data:', candidateData);
      console.log('Employments data:', employmentsData);

      // Fetch Glassdoor reviews - simplify for debugging
      console.log("Simplified Glassdoor reviews fetch - checking both candidate_id and employment_ids");
      
      try {
        // Simple direct query with debugging - directly log everything
        console.log(`Looking for all glassdoor_reviews (limit 20)`);
        const { data: allReviews, error: allError } = await supabase
          .from('glassdoor_reviews')
          .select();
        
        console.log('Glassdoor reviews query result:', { allReviews, allError });
        
        if (allError) {
          console.error('Error fetching all reviews:', allError);
          setGlassdoorError(`Error fetching all reviews: ${allError.message}`);
          if (isMounted.current) {
            setGlassdoorLoading(false);
            console.log('Loading state set to false after error');
          }
          return;
        }
        
        if (allReviews && allReviews.length > 0) {
          console.log(`Found ${allReviews.length} reviews:`, allReviews);
          
          // Directly set the reviews and update loading state
          setGlassdoorReviews(allReviews as any[]);
          console.log('Setting glassdoorLoading to false');
        } else {
          console.log('No Glassdoor reviews found');
          setGlassdoorError('No reviews found in the database.');
        }
        
        // Make absolutely sure we update the loading state
        if (isMounted.current) {
          setGlassdoorLoading(false);
          console.log('Final loading state updated to false');
        }
      } catch (glassdoorFetchError) {
        console.error('Error in Glassdoor reviews fetching:', glassdoorFetchError);
        setGlassdoorError(`General error: ${glassdoorFetchError}`);
        if (isMounted.current) {
          setGlassdoorLoading(false);
          console.log('Loading state set to false after error');
        }
      }
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCandidateData();
    
    // Add a direct check for the glassdoor_reviews table
    const checkGlassdoorTable = async () => {
      try {
        console.log("==== GLASSDOOR REVIEWS DIAGNOSTIC TESTS ====");
        
        // Test 0: Check Supabase connection
        console.log("Test 0: Testing general Supabase connectivity");
        const connTest = await testSupabaseConnection();
        console.log("Connection test result:", connTest);
        
        // Test 1: Check if table exists and count records
        console.log("Test 1: Checking glassdoor_reviews table...");
        const { data: countData, error: countError, count } = await supabase
          .from('glassdoor_reviews')
          .select('*', { count: 'exact' });
          
        if (countError) {
          console.error("❌ Error accessing glassdoor_reviews table:", countError);
        } else {
          console.log(`✅ glassdoor_reviews table exists with ${count} total records`);
          console.log("Sample data:", countData?.slice(0, 3));
        }
        
        // Test 2: Check for specific candidate ID
        console.log(`Test 2: Checking glassdoor_reviews for candidate_id = ${id}`);
        const { data: candidateReviews, error: candidateError } = await supabase
          .from('glassdoor_reviews')
          .select('*')
          .eq('candidate_id', id);
          
        if (candidateError) {
          console.error(`❌ Error fetching reviews by candidate_id = ${id}:`, candidateError);
        } else {
          console.log(`✅ Found ${candidateReviews?.length || 0} reviews with candidate_id = ${id}`);
          if (candidateReviews?.length) {
            console.log("First review:", candidateReviews[0]);
          }
        }
        
        // Test 3: Get employment IDs
        console.log(`Test 3: Getting employment IDs for candidate_id = ${id}`);
        const { data: employmentData, error: employmentError } = await supabase
          .from('employments')
          .select('id')
          .eq('candidate_id', id);
          
        if (employmentError) {
          console.error(`❌ Error fetching employments for candidate_id = ${id}:`, employmentError);
        } else {
          const empIds = employmentData?.map(e => e.id) || [];
          console.log(`✅ Found ${empIds.length} employment IDs:`, empIds);
          
          // Test 4: Check for reviews by employment
          if (empIds.length > 0) {
            console.log(`Test 4: Checking glassdoor_reviews for employment_id IN (${empIds.join(', ')})`);
            const { data: empReviews, error: empReviewsError } = await supabase
              .from('glassdoor_reviews')
              .select('*')
              .in('employment_id', empIds);
              
            if (empReviewsError) {
              console.error(`❌ Error fetching reviews by employment_id:`, empReviewsError);
            } else {
              console.log(`✅ Found ${empReviews?.length || 0} reviews with matching employment_id`);
              if (empReviews?.length) {
                console.log("First review:", empReviews[0]);
              }
            }
          }
        }
        
        // Test 5: Check if candidate ID is a UUID
        try {
          console.log(`Test 5: Validating candidate ID format: ${id}`);
          // Try to parse as UUID
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');
          console.log(`✅ Is candidate ID a valid UUID? ${isValidUUID}`);
        } catch (err) {
          console.error("❌ Error validating UUID format:", err);
        }
        
        console.log("==== END DIAGNOSTIC TESTS ====");
      } catch (err) {
        console.error("Exception in diagnostics:", err);
      }
    };
    
    checkGlassdoorTable();
  }, [id]);
  
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the data
      fetchCandidateData();
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
    }
  };

  const handleSave = async (table: string, data: any) => {
    try {
      const { error } = await supabase
        .from(table)
        .upsert(data);
      
      if (error) throw error;
      
      setIsEditing(false);
      setEditingItem(null);
      // Refresh the data
      fetchCandidateData();
    } catch (error) {
      console.error(`Error saving to ${table}:`, error);
    }
  };

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
    <div>
      <PageHeader
        title={candidate.name}
        description={candidate.current_title || 'No current title'}
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content column - left side */}
          <div className="lg:col-span-2">
            {/* Basic Info */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="grid grid-cols-[90px_1fr] gap-6 items-start">
                    <div className="justify-self-start">
                      <Avatar name={candidate.name} size="xl" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl font-bold text-gray-900 truncate">{candidate.name}</h2>
                      <div className="text-gray-600 line-clamp-2">{candidate.current_title}</div>
                      {candidate.current_employer && (
                        <p className="text-gray-500 truncate">{candidate.current_employer}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Badge variant="default">
                      {candidate.update_status || 'Calibration'}
                    </Badge>
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

            {/* Employment History */}
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Employment History</h2>
                <Button variant="outline" size="sm" onClick={() => {/* TODO: Implement add employment */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                {employments.length > 0 ? (
                  <div className="space-y-4">
                    {employments.map((employment) => (
                      <div key={employment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{employment.employer_name}</h3>
                            <p className="text-sm text-gray-600">{employment.title}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(employment)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete('employments', employment.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {employment.start_year} - {employment.end_year || 'Present'}
                        </div>
                        {employment.description && (
                          <p className="mt-2 text-sm text-gray-600">{employment.description}</p>
                        )}
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
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Education</h2>
                <Button variant="outline" size="sm" onClick={() => {/* TODO: Implement add education */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                {educations.length > 0 ? (
                  <div className="space-y-4">
                    {educations.map((education) => (
                      <div key={education.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{education.institution}</h3>
                            <p className="text-sm text-gray-600">{education.degree}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(education)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete('educations', education.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        {education.field_of_study && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {education.field_of_study}
                          </div>
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
            
            {/* Glassdoor Reviews - Full width for better vertical layout */}
            <div className="mb-6">
              <GlassdoorReviews 
                candidateId={id || ''}
                employmentIds={employments.map(e => e.id) || []} 
              />
            </div>
            
            {/* Reference Information */}
            <div className="mb-6">
              <CandidateIdDisplay 
                candidateId={id || ''}
                employmentIds={employments.map(e => e.id)}
                employments={employments}
              />
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* CEO Glassdoor Summary */}
            <StandaloneCeoGlassdoorSummary
              candidateId={id || ''}
              employmentIds={employments.map(e => e.id) || []}
            />
            
            {/* Notes */}
            <EditableTable
              title="Notes"
              data={notes}
              columns={[
                { key: 'created_at', header: 'Date', render: (date) => formatDate(date) },
                { key: 'note_content', header: 'Content' },
                { key: 'author', header: 'Author' }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('candidate_notes', id)}
              onAdd={() => {/* TODO: Implement add note */}}
              emptyMessage="No notes have been added for this candidate."
            />
            
            {/* Interests */}
            <EditableTable
              title="Interests"
              data={interests.map((interest, index) => ({ ...interest, id: `interest-${index}` }))}
              columns={[
                { key: 'interest_name', header: 'Interest' }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('candidate_interests', id)}
              onAdd={() => {/* TODO: Implement add interest */}}
              emptyMessage="No interests have been added for this candidate yet."
            />

            {/* Board Memberships */}
            <EditableTable
              title="Board Memberships"
              data={boardMemberships.map((membership, index) => ({ ...membership, id: `board-${index}` }))}
              columns={[
                { key: 'organization_name', header: 'Organization' },
                { key: 'role', header: 'Role' },
                { 
                  key: 'start_year', 
                  header: 'Period',
                  render: (item) => `${item.start_year} - ${item.end_year || 'Present'}`
                }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('candidate_board_memberships', id)}
              onAdd={() => {/* TODO: Implement add board membership */}}
              emptyMessage="No board memberships have been recorded for this candidate."
            />
            
            {/* Endorsers */}
            <EndorsersTable
              candidateId={id || ''}
              endorsers={endorsers}
              onDataChange={fetchCandidateData}
            />

            {/* Detractors */}
            <DetractorsTable
              candidateId={id || ''}
              detractors={detractors}
              onDataChange={fetchCandidateData}
            />
            
            {/* Call Transcripts */}
            <EditableTable
              title="Call Transcripts"
              data={transcripts}
              columns={[
                { key: 'call_date', header: 'Date', render: (date) => formatDate(date) },
                { key: 'transcript_content', header: 'Content' }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('call_transcripts', id)}
              onAdd={() => {/* TODO: Implement add transcript */}}
              emptyMessage="No call transcripts have been recorded for this candidate."
            />

            {/* Email Communications */}
            <EditableTable
              title="Email Communications"
              data={emails}
              columns={[
                { key: 'sent_at', header: 'Date', render: (date) => formatDate(date) },
                { key: 'subject', header: 'Subject' },
                { key: 'sender', header: 'From' }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('candidate_emails', id)}
              onAdd={() => {/* TODO: Implement add email */}}
              emptyMessage="No email communications have been recorded for this candidate."
            />

            {/* Recommendations */}
            <EditableTable
              title="Recommendations"
              data={recommendations}
              columns={[
                { key: 'source', header: 'Source', render: (source) => source?.source_name || 'Unknown' },
                { key: 'created_at', header: 'Date', render: (date) => formatDate(date) }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('candidate_recommendations', id)}
              onAdd={() => {/* TODO: Implement add recommendation */}}
              emptyMessage="No recommendations have been recorded for this candidate."
            />
            
            {/* Meetings */}
            <EditableTable
              title="Meetings"
              data={meetings}
              columns={[
                { key: 'meeting_date', header: 'Date', render: (date) => formatDate(date) },
                { key: 'meeting_time', header: 'Time' },
                { key: 'location', header: 'Location' },
                { key: 'is_virtual', header: 'Virtual', render: (isVirtual) => isVirtual ? 'Yes' : 'No' }
              ]}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete('meetings', id)}
              onAdd={() => {/* TODO: Implement add meeting */}}
              emptyMessage="No meetings have been scheduled for this candidate."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;