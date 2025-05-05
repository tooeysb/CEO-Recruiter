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
          <div className="w-full">
            <div className="border-b border-gray-200 pb-2 flex">
              <div className="py-2 px-4 text-sm font-semibold text-gray-600 w-1/3">Candidate ID:</div>
              <div className="py-2 px-4 text-sm text-gray-800 font-mono w-2/3">{candidateId}</div>
            </div>
              
            {employmentIds && employmentIds.length > 0 && (
              <div className="flex pt-2">
                <div className="py-2 px-4 text-sm font-semibold text-gray-600 w-1/3 align-top">Employment IDs:</div>
                <div className="py-2 px-4 w-2/3">
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
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>These IDs can be used for database reference and troubleshooting purposes.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateIdDisplay; 