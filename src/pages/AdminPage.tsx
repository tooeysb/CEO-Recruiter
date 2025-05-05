import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { supabase } from '../lib/supabase';
import { RecommendationSource, CandidateRecommendation } from '../types/database.types';
import { formatDate } from '../lib/utils';
import PromptTemplateManager from '../components/admin/PromptTemplateManager';

const AdminPage: React.FC = () => {
  const [sources, setSources] = useState<RecommendationSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingSource, setEditingSource] = useState<RecommendationSource | null>(null);
  const [sourceName, setSourceName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sourceUsage, setSourceUsage] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchSources();
    fetchSourceUsage();
  }, []);
  
  const fetchSources = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recommendation_sources')
        .select('*')
        .order('source_name');
        
      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSourceUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('candidate_recommendations')
        .select('source_id, id');
        
      if (error) throw error;
      
      // Count usage for each source
      const usage: Record<string, number> = {};
      data?.forEach((recommendation: { source_id: string; id: string }) => {
        if (recommendation.source_id) {
          usage[recommendation.source_id] = (usage[recommendation.source_id] || 0) + 1;
        }
      });
      
      setSourceUsage(usage);
    } catch (error) {
      console.error('Error fetching source usage:', error);
    }
  };
  
  const handleAddSource = () => {
    setEditingSource(null);
    setSourceName('');
    setError(null);
    setModalOpen(true);
  };
  
  const handleEditSource = (source: RecommendationSource) => {
    setEditingSource(source);
    setSourceName(source.source_name);
    setError(null);
    setModalOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sourceName.trim()) {
      setError('Source name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editingSource) {
        // Update existing source
        const { data, error } = await supabase
          .from('recommendation_sources')
          .update({ source_name: sourceName })
          .eq('id', editingSource.id)
          .select()
          .single();
          
        if (error) throw error;
        
        // Update local state
        setSources(sources.map(s => s.id === editingSource.id ? data : s));
      } else {
        // Check if source with this name already exists
        const { data: existingSource } = await supabase
          .from('recommendation_sources')
          .select('id')
          .eq('source_name', sourceName)
          .maybeSingle();
          
        if (existingSource) {
          setError('A source with this name already exists');
          setIsSubmitting(false);
          return;
        }
        
        // Add new source
        const { data, error } = await supabase
          .from('recommendation_sources')
          .insert([{ source_name: sourceName }])
          .select()
          .single();
          
        if (error) throw error;
        
        // Add to local state
        setSources([...sources, data]);
      }
      
      setModalOpen(false);
    } catch (error: any) {
      console.error('Error saving source:', error);
      setError(error.message || 'An error occurred while saving the source');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteSource = async (source: RecommendationSource) => {
    // Check if the source is in use
    if (sourceUsage[source.id] && sourceUsage[source.id] > 0) {
      alert(`This source is used by ${sourceUsage[source.id]} candidate(s) and cannot be deleted.`);
      return;
    }
    
    if (!confirm(`Are you sure you want to delete the source "${source.source_name}"?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('recommendation_sources')
        .delete()
        .eq('id', source.id);
        
      if (error) throw error;
      
      // Remove from local state
      setSources(sources.filter(s => s.id !== source.id));
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('An error occurred while deleting the source. It may be in use by candidates.');
    }
  };
  
  return (
    <div>
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="mt-2 text-sm text-gray-600">Manage system settings and reference data</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={handleAddSource}
          >
            Add Source
          </Button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* CEO Prompt Templates */}
        <PromptTemplateManager />
        
        {/* Recommendation Sources */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Recommendation Sources</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                <span className="ml-3 text-gray-600">Loading sources...</span>
              </div>
            ) : sources.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No recommendation sources found. Add your first one!</p>
                <div className="mt-4">
                  <Button 
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={handleAddSource}
                  >
                    Add Source
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sources.map((source) => (
                      <tr key={source.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{source.source_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(source.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {sourceUsage[source.id] || 0} candidate(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditSource(source)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSource(source)}
                            className={`text-red-600 hover:text-red-900 ${
                              sourceUsage[source.id] && sourceUsage[source.id] > 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={sourceUsage[source.id] ? sourceUsage[source.id] > 0 : false}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSource ? "Edit Recommendation Source" : "Add Recommendation Source"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Source Name"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="e.g., Heidrick, XN Capital"
            error={error || undefined}
            required
          />
          
          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingSource ? 'Update Source' : 'Add Source'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;