import React, { useState, useEffect } from 'react';
import { Users, Plus, List, Map as MapIcon } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import CandidatesList from '../components/candidates/CandidatesList';
import CandidatesMap from '../components/candidates/CandidatesMap';
import Pipeline from '../components/candidates/Pipeline';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CandidateForm from '../components/candidates/CandidateForm';
import { supabase } from '../lib/supabase';
import { Candidate } from '../types/database.types';

const CandidatesListPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'pipeline' | 'map'>('list');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    fetchCandidates();
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
  
  return (
    <div>
      <PageHeader
        title="Candidates"
        description="Browse and manage all candidates in your pipeline"
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline'} 
                onClick={() => setViewMode('list')}
                size="sm"
                className="flex-1 sm:flex-none"
                leftIcon={<List size={16} />}
              >
                List
              </Button>
              <Button 
                variant={viewMode === 'pipeline' ? 'primary' : 'outline'} 
                onClick={() => setViewMode('pipeline')}
                size="sm"
                className="flex-1 sm:flex-none"
                leftIcon={<Users size={16} />}
              >
                Pipeline
              </Button>
              <Button 
                variant={viewMode === 'map' ? 'primary' : 'outline'} 
                onClick={() => setViewMode('map')}
                size="sm"
                className="flex-1 sm:flex-none"
                leftIcon={<MapIcon size={16} />}
              >
                Map
              </Button>
            </div>
            <Button 
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleAddCandidate}
              size="sm"
              className="w-full sm:w-auto"
            >
              Add Candidate
            </Button>
          </div>
        }
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading candidates...</span>
          </div>
        ) : viewMode === 'list' ? (
          <CandidatesList candidates={candidates} onAddCandidate={handleAddCandidate} />
        ) : viewMode === 'pipeline' ? (
          <Pipeline candidates={candidates} onStatusChange={handleStatusChange} />
        ) : (
          <CandidatesMap candidates={candidates} />
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