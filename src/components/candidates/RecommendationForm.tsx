import React, { useState, useEffect } from 'react';
import { CandidateRecommendation, RecommendationSource } from '../../types/database.types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { supabase } from '../../lib/supabase';

interface RecommendationFormProps {
  candidateId: string;
  onSubmit: (recommendation: Partial<CandidateRecommendation>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RecommendationForm: React.FC<RecommendationFormProps> = ({
  candidateId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [sources, setSources] = useState<RecommendationSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isLoadingSources, setIsLoadingSources] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchSources = async () => {
      setIsLoadingSources(true);
      try {
        const { data, error } = await supabase
          .from('recommendation_sources')
          .select('*')
          .order('source_name');
          
        if (error) throw error;
        setSources(data || []);
      } catch (error) {
        console.error('Error fetching recommendation sources:', error);
      } finally {
        setIsLoadingSources(false);
      }
    };
    
    fetchSources();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSource) return;
    
    try {
      await onSubmit({
        candidate_id: candidateId,
        source_id: selectedSource,
      });
      setSelectedSource('');
    } catch (error) {
      console.error('Error submitting recommendation:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Recommendation Source"
        options={[
          { value: '', label: 'Select a source' },
          ...sources.map(source => ({
            value: source.id,
            label: source.source_name,
          })),
        ]}
        value={selectedSource}
        onChange={setSelectedSource}
        disabled={isLoadingSources}
        hint={isLoadingSources ? 'Loading sources...' : ''}
        required
      />
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading || isLoadingSources}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading} 
          disabled={!selectedSource || isLoadingSources}
        >
          Add Recommendation
        </Button>
      </div>
    </form>
  );
};

export default RecommendationForm;