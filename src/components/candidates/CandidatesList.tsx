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
  const [search, setSearch] = useState('');
  const [showDisqualified, setShowDisqualified] = useState(false);
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('');
  
  // Get unique industries from candidates
  const industries = [...new Set(candidates.map(c => c.employer_industry).filter(Boolean))];
  
  // Get unique statuses from candidates
  const statuses = [...new Set(candidates.map(c => c.update_status))];
  
  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    // Filter by search term
    const searchMatch = 
      search === '' || 
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      (candidate.current_title && candidate.current_title.toLowerCase().includes(search.toLowerCase())) ||
      (candidate.current_employer && candidate.current_employer.toLowerCase().includes(search.toLowerCase())) ||
      (candidate.employer_industry && candidate.employer_industry.toLowerCase().includes(search.toLowerCase()));
      
    // Filter by disqualified status
    const disqualifiedMatch = showDisqualified || !candidate.disqualified;
    
    // Filter by industry
    const industryMatch = industry === '' || candidate.employer_industry === industry;
    
    // Filter by status
    const statusMatch = status === '' || candidate.update_status === status;
    
    return searchMatch && disqualifiedMatch && industryMatch && statusMatch;
  });
  
  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
          
          <Select
            options={[
              { value: '', label: 'All Industries' },
              ...industries.map(i => ({ value: i || '', label: i || 'Unknown' }))
            ]}
            value={industry}
            onChange={setIndustry}
          />
          
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              ...statuses.map(s => ({ value: s, label: s }))
            ]}
            value={status}
            onChange={setStatus}
          />
          
          <div className="flex items-center space-x-4 md:col-span-3">
            <div className="flex items-center">
              <input
                id="show-disqualified"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={showDisqualified}
                onChange={(e) => setShowDisqualified(e.target.checked)}
              />
              <label htmlFor="show-disqualified" className="ml-2 block text-sm text-gray-700">
                Show disqualified candidates
              </label>
            </div>
          </div>
          
          <div className="md:text-right">
            <Button
              variant="primary"
              leftIcon={<Plus size={18} />}
              onClick={onAddCandidate}
            >
              Add Candidate
            </Button>
          </div>
        </div>
      </div>
      
      {filteredCandidates.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No candidates found. Try adjusting your filters or add a new candidate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidatesList;