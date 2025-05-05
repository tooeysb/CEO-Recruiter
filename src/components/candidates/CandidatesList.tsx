import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Candidate } from '../../types/database.types';
import CandidateCard from './CandidateCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface CandidatesListProps {
  candidates: Candidate[];
  onAddCandidate: () => void;
}

const CandidatesList: React.FC<CandidatesListProps> = ({ candidates, onAddCandidate }) => {
  // Filter candidates are now handled in the parent component (CandidatesListPage)
  // We're using pre-filtered candidates directly
  
  return (
    <div className="space-y-4">      
      {candidates.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No candidates found. Try adjusting your filters or add a new candidate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidatesList;