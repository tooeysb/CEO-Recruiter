import { useEffect, useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { supabase } from '../../lib/supabase';
import { Star, User } from 'lucide-react';
import CeoGlassdoorSummaryComponent from './CeoGlassdoorSummary';
import { CeoGlassdoorSummary as CeoGlassdoorSummaryType } from '../../types/database.types';

interface StandaloneCeoGlassdoorSummaryProps {
  candidateId: string;
  employmentIds: string[];
}

const StandaloneCeoGlassdoorSummary = ({ candidateId, employmentIds }: StandaloneCeoGlassdoorSummaryProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CeoGlassdoorSummaryType | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      
      if (!employmentIds.length) {
        setError('No employment IDs available');
        setLoading(false);
        return;
      }
      
      try {
        // Try direct query with the first employment ID
        const { data: directData, error: directError } = await supabase
          .from('ceo_glassdoor_summary')
          .select('*')
          .eq('employment_id', employmentIds[0])
          .maybeSingle();
        
        if (directData) {
          setSummary(directData);
          setLoading(false);
          return;
        }
        
        // If no direct match, try with other employment IDs
        for (const empId of employmentIds.slice(1)) {
          const { data: otherMatch, error: otherError } = await supabase
            .from('ceo_glassdoor_summary')
            .select('*')
            .eq('employment_id', empId)
            .maybeSingle();
          
          if (otherMatch) {
            setSummary(otherMatch);
            setLoading(false);
            return;
          }
        }
        
        // If no match found, check if valid employment exists
        if (employmentIds.length > 0) {
          const firstEmploymentId = employmentIds[0];
          
          const { data: employment, error: empError } = await supabase
            .from('employments')
            .select('*')
            .eq('id', firstEmploymentId)
            .maybeSingle();
          
          if (empError) {
            console.error("Error checking employment: " + firstEmploymentId, empError);
            setError("Error validating employment record.");
          } else if (employment) {
            console.log("Employment record found but no Glassdoor summary available.");
            setError('No Glassdoor summary available for this candidate.');
          } else {
            console.log("No employment record found for ID: " + firstEmploymentId);
            setError('Employment record not found.');
          }
        } else {
          setError('No matching CEO Glassdoor summary found');
        }
      } catch (err) {
        setError('Error fetching CEO Glassdoor summary.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [candidateId, employmentIds, refreshCounter]);
  
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-lg font-medium text-gray-900">CEO Glassdoor Summary</h2>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading && (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
            <span className="text-gray-600">Loading summary...</span>
          </div>
        )}
        
        {!loading && error && (
          <div className="p-4 bg-red-50 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {!loading && summary && (
          <div className="p-4">
            <CeoGlassdoorSummaryComponent summary={summary} />
          </div>
        )}
        
        {!loading && !error && !summary && (
          <div className="p-4">
            <EmptyState
              icon={Star}
              title="No Glassdoor summary"
              description="No CEO Glassdoor data available"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandaloneCeoGlassdoorSummary; 