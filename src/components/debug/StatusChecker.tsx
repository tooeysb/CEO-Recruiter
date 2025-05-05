import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const StatusChecker: React.FC = () => {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatuses = async () => {
      setIsLoading(true);
      try {
        // Get all unique status values
        const { data, error } = await supabase
          .from('candidates')
          .select('update_status');

        if (error) {
          throw error;
        }

        console.log('Raw data:', data);
        
        // Extract unique statuses
        const uniqueStatuses = [...new Set(data.map(c => c.update_status))].filter(Boolean);
        console.log('Unique statuses:', uniqueStatuses);
        
        setStatuses(uniqueStatuses);
      } catch (err) {
        console.error('Error fetching statuses:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatuses();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Status Values in Database</h2>
      
      {isLoading ? (
        <p>Loading statuses...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          <p className="mb-2">Found {statuses.length} unique status values:</p>
          <ul className="list-disc pl-5">
            {statuses.map((status, index) => (
              <li key={index} className="mb-1">
                "{status}"
              </li>
            ))}
          </ul>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              To update all "Calibration profile" statuses to "Calibration", run this SQL statement:
            </p>
            <pre className="mt-2 p-2 bg-gray-100 text-sm overflow-x-auto">
              UPDATE candidates SET update_status = 'Calibration' WHERE update_status = 'Calibration profile';
            </pre>
          </div>

          <div className="mt-4">
            <p className="font-medium">Update Status Test</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={async () => {
                try {
                  const { error } = await supabase
                    .from('candidates')
                    .update({ update_status: 'Calibration' })
                    .eq('update_status', 'Calibration profile');
                  
                  if (error) throw error;
                  
                  alert('Update successful! Refreshing...');
                  window.location.reload();
                } catch (err) {
                  alert(`Error: ${err.message}`);
                }
              }}
            >
              Update "Calibration profile" → "Calibration"
            </button>
          </div>

          <div className="mt-4">
            <p className="font-medium">Add Missing Statuses</p>
            <button 
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={async () => {
                try {
                  // If we need to create sample data with the missing statuses
                  const missingStatuses = ['Sourced', 'Contacted', 'Interview', 'Offer'].filter(
                    s => !statuses.includes(s)
                  );
                  
                  if (missingStatuses.length === 0) {
                    alert('All statuses already exist in the database!');
                    return;
                  }
                  
                  // We'll add sample candidates with the missing statuses
                  const newCandidates = missingStatuses.map(status => ({
                    name: `Sample ${status} Candidate`,
                    update_status: status,
                    disqualified: false,
                    hungry: false,
                    humble: false,
                    smart: false,
                    previous_ceo_experience: false,
                    exec_staff: false,
                    global_experience: false,
                  }));
                  
                  const { error } = await supabase
                    .from('candidates')
                    .insert(newCandidates);
                  
                  if (error) throw error;
                  
                  alert(`Added ${missingStatuses.length} sample candidates with missing statuses! Refreshing...`);
                  window.location.reload();
                } catch (err) {
                  alert(`Error: ${err.message}`);
                }
              }}
            >
              Add Sample Candidates with Missing Statuses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusChecker; 