import { useEffect, useState } from 'react';
import { supabase, testSupabaseConnection } from './lib/supabase';

const SupabaseTest = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState({
    url: import.meta.env.VITE_SUPABASE_URL ? 'Defined' : 'Missing',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Defined' : 'Missing'
  });
  
  useEffect(() => {
    const runTest = async () => {
      try {
        console.log('Running Supabase connection test...');
        const result = await testSupabaseConnection();
        setTestResults(result);
        
        // Direct table query test
        try {
          const { data, error } = await supabase
            .from('glassdoor_reviews')
            .select('*')
            .limit(1);
            
          console.log('Direct query test:', { data, error });
          
          if (error) {
            setError(`Direct query error: ${error.message}`);
          }
        } catch (directErr) {
          console.error('Direct query exception:', directErr);
          setError(`Direct query exception: ${directErr}`);
        }
      } catch (err) {
        console.error('Test error:', err);
        setError(`Test error: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    
    runTest();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <div>VITE_SUPABASE_URL: <span className={envVars.url === 'Missing' ? 'text-red-500' : 'text-green-500'}>{envVars.url}</span></div>
        <div>VITE_SUPABASE_ANON_KEY: <span className={envVars.key === 'Missing' ? 'text-red-500' : 'text-green-500'}>{envVars.key}</span></div>
      </div>
      
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
          <span>Running connection test...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(testResults, null, 2)}
          </pre>
          
          <div className="mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setLoading(true);
                setError(null);
                testSupabaseConnection().then(result => {
                  setTestResults(result);
                  setLoading(false);
                }).catch(err => {
                  setError(`Retest error: ${err}`);
                  setLoading(false);
                });
              }}
            >
              Run Test Again
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <p className="text-sm text-gray-600">Check the browser console for more detailed logs.</p>
      </div>
    </div>
  );
};

export default SupabaseTest; 