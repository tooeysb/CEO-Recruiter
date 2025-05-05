import React, { useState, useEffect } from 'react';
import { Users, Plus, List, Map as MapIcon, ChevronDown, Search } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import CandidatesList from '../components/candidates/CandidatesList';
import CandidatesMap from '../components/candidates/CandidatesMap';
import Pipeline from '../components/candidates/Pipeline';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CandidateForm from '../components/candidates/CandidateForm';
import { supabase } from '../lib/supabase';
import { Candidate } from '../types/database.types';

// Define the ordered statuses list
const orderedStatuses = [
  'Calibration',
  'Sourced',
  'Contacted',
  'Interview',
  'Offer',
  'Disqualified'
];

const CandidatesListPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>(orderedStatuses); // Initialize with all predefined statuses
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'pipeline' | 'map'>('list');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDisqualified, setShowDisqualified] = useState<boolean>(false);
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    fetchCandidates();
    fetchIndustries();
  }, []);
  
  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      // Fetch unique employer_industry values directly from the database
      const { data, error } = await supabase
        .from('candidates')
        .select('employer_industry')
        .not('employer_industry', 'is', null);
        
      if (error) throw error;
      
      // Extract unique industries
      const uniqueIndustries = [...new Set(data.map(c => c.employer_industry))].filter(Boolean).sort();
      setIndustries(uniqueIndustries);
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };
  
  const handleAddCandidate = () => {
    setShowAddModal(true);
  };
  
  const handleSubmitCandidate = async (candidateData: Partial<Candidate>) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to local state
      setCandidates([data, ...candidates]);
      
      // If this adds a new industry, refresh the industries list
      if (data.employer_industry && !industries.includes(data.employer_industry)) {
        fetchIndustries();
      }
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ update_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', candidateId);
        
      if (error) throw error;
      
      // Update local state
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, update_status: newStatus, updated_at: new Date().toISOString() }
            : candidate
        )
      );
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Search term filter
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Disqualified filter
    if (!showDisqualified && candidate.disqualified) return false;
    // Industry filter
    if (industryFilter && candidate.employer_industry !== industryFilter) return false;
    // Status filter
    if (statusFilter && candidate.update_status !== statusFilter) return false;
    return true;
  });
  
  return (
    <div>
      <PageHeader
        title="Candidates"
        description=""
      />
      
      <div className="border-b border-gray-200">
        {/* View Mode Buttons and Add Candidate Button */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'outline'} 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-gray-700 border-gray-300'} rounded-lg`}
            >
              <List size={18} className="mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'pipeline' ? 'primary' : 'outline'} 
              onClick={() => setViewMode('pipeline')}
              className={`px-4 py-2 ${viewMode === 'pipeline' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-gray-700 border-gray-300'} rounded-lg`}
            >
              <Users size={18} className="mr-2" />
              Pipeline
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'primary' : 'outline'} 
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 ${viewMode === 'map' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-gray-700 border-gray-300'} rounded-lg`}
            >
              <MapIcon size={18} className="mr-2" />
              Map
            </Button>
          </div>
          
          <Button 
            variant="primary"
            onClick={handleAddCandidate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            <Plus size={18} className="mr-2" />
            Add Candidate
          </Button>
        </div>

        {/* Filters Row */}
        <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
          {/* Search and Dropdown Filters - all on one row */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Industries Dropdown */}
            <div className="relative w-60">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                value={industryFilter || ''}
                onChange={(e) => setIndustryFilter(e.target.value || null)}
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Statuses Dropdown - Always show all predefined statuses */}
            <div className="relative w-60">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">All Statuses</option>
                {orderedStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Show Disqualified Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showDisqualified"
              checked={showDisqualified}
              onChange={() => setShowDisqualified(!showDisqualified)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showDisqualified" className="ml-2 block text-sm text-gray-900">
              Show disqualified candidates
            </label>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading candidates...</span>
          </div>
        ) : viewMode === 'list' ? (
          <CandidatesList candidates={filteredCandidates} onAddCandidate={handleAddCandidate} />
        ) : viewMode === 'pipeline' ? (
          <Pipeline candidates={filteredCandidates} onStatusChange={handleStatusChange} />
        ) : (
          <CandidatesMap candidates={filteredCandidates} />
        )}
      </div>
      
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Candidate"
        size="lg"
      >
        <CandidateForm
          onSubmit={handleSubmitCandidate}
          onCancel={() => setShowAddModal(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default CandidatesListPage;