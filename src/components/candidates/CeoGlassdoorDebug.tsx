import { useEffect, useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { supabase } from '../../lib/supabase';
import { Star } from 'lucide-react';
import CeoGlassdoorSummaryComponent from './CeoGlassdoorSummary';

interface CeoGlassdoorDebugProps {
  candidateId: string;
  employmentIds: string[];
}

const CeoGlassdoorDebug = ({ candidateId, employmentIds }: CeoGlassdoorDebugProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      console.log('CeoGlassdoorDebug - fetchSummary called', { candidateId, employmentIds });
      setLoading(true);
      setError(null);
      
      if (!employmentIds.length) {
        setError('No employment IDs available');
        setLoading(false);
        return;
      }
      
      try {
        // First check if there are any summary records at all
        const { data: allSummaries, error: allError } = await supabase
          .from('ceo_glassdoor_summary')
          .select();
        
        console.log('All CEO Glassdoor Summaries:', allSummaries);
        
        if (allError) {
          console.error('Error fetching all summaries:', allError);
          setError(`Error fetching all summaries: ${allError.message}`);
          setLoading(false);
          return;
        }
        
        // Try to find summaries for any of the employment IDs
        let foundSummary = null;
        
        for (const employmentId of employmentIds) {
          console.log(`Checking summary for employment ID: ${employmentId}`);
          const { data, error } = await supabase
            .from('ceo_glassdoor_summary')
            .select()
            .eq('employment_id', employmentId)
            .maybeSingle();
          
          if (error) {
            console.error(`Error fetching summary for employment ID ${employmentId}:`, error);
            continue;
          }
          
          if (data) {
            console.log(`Found summary for employment ID ${employmentId}:`, data);
            foundSummary = data;
            break;
          }
        }
        
        if (foundSummary) {
          setSummary(foundSummary);
        } else {
          console.log('No CEO Glassdoor summary found for any of the employment IDs');
          setError('No CEO Glassdoor summary found');
        }
      } catch (err) {
        console.error('Exception fetching CEO Glassdoor summary:', err);
        setError(`Exception: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [candidateId, employmentIds, refreshCounter]);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">CEO Glassdoor Summary Debug</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm font-semibold">Debugging Info:</p>
          <div className="text-xs">
            <div className="mb-1">Loading state: <span className={loading ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{loading ? 'true' : 'false'}</span></div>
            <div className="mb-1">Error state: {error ? <span className="text-red-500">{error}</span> : <span className="text-green-600">none</span>}</div>
            <div className="mb-1">Summary found: <span className={summary ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{summary ? 'yes' : 'no'}</span></div>
            <div className="mb-1">Candidate ID: {candidateId}</div>
            <div className="mb-1">Employment IDs: {employmentIds.join(', ') || 'none'}</div>
            <button
              onClick={() => setRefreshCounter(prev => prev + 1)}
              className="mt-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center p-4 mb-4 border-b">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
            <span>Loading CEO Glassdoor summary...</span>
          </div>
        )}
        
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            <p className="text-sm">Error: {error}</p>
          </div>
        )}
        
        {!loading && summary && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Summary Data:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-xs">
              {JSON.stringify(summary, null, 2)}
            </pre>
            
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Rendered Component:</h3>
              <CeoGlassdoorSummaryComponent summary={summary} />
            </div>
          </div>
        )}
        
        {!loading && !error && !summary && (
          <EmptyState
            icon={Star}
            title="No Glassdoor summary"
            description="No Glassdoor summary data is available for this candidate."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CeoGlassdoorDebug; 