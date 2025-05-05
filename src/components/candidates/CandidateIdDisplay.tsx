import React from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Employment } from '../../types/database.types';

interface CandidateIdDisplayProps {
  candidateId: string;
  employmentIds?: string[];
  employments?: Employment[];
}

/**
 * A standalone component to display candidate and employment IDs
 * This is helpful for debugging and reference purposes
 */
const CandidateIdDisplay: React.FC<CandidateIdDisplayProps> = ({ 
  candidateId,
  employmentIds = [],
  employments = []
}) => {
  // Create a map of employment IDs to company names for easy lookup
  const employmentMap = new Map<string, string>();
  employments.forEach(emp => {
    employmentMap.set(emp.id, emp.employer_name || 'Unknown Company');
  });

  return (
    <Card className="mb-6 lg:col-span-2">
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-700">Reference Information</h2>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <table className="min-w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4 text-sm font-semibold text-gray-600 align-top">Candidate ID:</td>
                <td className="py-2 px-4 text-sm text-gray-800 font-mono">
                  {candidateId}
                </td>
              </tr>
              
              {employmentIds && employmentIds.length > 0 && (
                <tr>
                  <td className="py-2 px-4 text-sm font-semibold text-gray-600 align-top">Employment IDs:</td>
                  <td className="py-2 px-4">
                    <div className="space-y-2">
                      {employmentIds.map((id, index) => {
                        const companyName = employmentMap.get(id) || 'Unknown Company';
                        return (
                          <div key={id} className="text-sm text-gray-800">
                            <span className="font-semibold">{companyName}</span>
                            <span className="mx-1">-</span>
                            <span className="font-mono">{id}</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>These IDs can be used for database reference and troubleshooting purposes.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateIdDisplay; 