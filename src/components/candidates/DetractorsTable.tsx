import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Detractor } from '../../types/database.types';
import Card from '../ui/Card';
import { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface DetractorsTableProps {
  candidateId: string;
  detractors: Detractor[];
  onDataChange: () => void;
}

const DetractorsTable: React.FC<DetractorsTableProps> = ({
  candidateId,
  detractors: initialDetractors,
  onDataChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [currentDetractor, setCurrentDetractor] = useState<Partial<Detractor>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [localDetractors, setLocalDetractors] = useState<Detractor[]>(initialDetractors);
  
  // Update local state when props change
  React.useEffect(() => {
    setLocalDetractors(initialDetractors);
  }, [initialDetractors]);
  
  const handleAdd = () => {
    setCurrentDetractor({ candidate_id: candidateId });
    setShowForm(true);
  };
  
  const handleEdit = (detractor: Detractor) => {
    setCurrentDetractor(detractor);
    setShowForm(true);
  };
  
  const handleDelete = async (id: string) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this detractor?")) {
      return;
    }
    
    setIsDeleting(id);
    
    // Optimistic UI update
    setLocalDetractors(prev => prev.filter(detractor => detractor.id !== id));
    
    try {
      const { error } = await supabase
        .from('detractors')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting detractor:', error);
        alert('Failed to delete detractor. Refreshing data...');
        // Revert on error by fetching fresh data
        onDataChange();
        return;
      }
      
      console.log("Delete successful");
      // No need to call onDataChange() as we've already updated the UI
    } catch (error) {
      console.error('Error deleting detractor:', error);
      alert('Failed to delete detractor. Refreshing data...');
      // Revert on error by fetching fresh data
      onDataChange();
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleSave = async (data: Partial<Detractor>) => {
    setIsLoading(true);
    try {
      const { error, data: newData } = await supabase
        .from('detractors')
        .upsert({
          ...data,
          candidate_id: candidateId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving detractor:', error);
        alert('Failed to save detractor. Please try again.');
        return;
      }
      
      // Update local state
      if (data.id) {
        // Edit existing item
        setLocalDetractors(prev => 
          prev.map(item => item.id === data.id ? newData : item)
        );
      } else {
        // Add new item
        setLocalDetractors(prev => [...prev, newData]);
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Error saving detractor:', error);
      alert('Failed to save detractor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setCurrentDetractor({});
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Detractors</h2>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Detractor
          </Button>
        </CardHeader>
        <CardContent>
          {localDetractors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {localDetractors.map((detractor) => (
                    <tr key={detractor.id} className={isDeleting === detractor.id ? 'opacity-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {detractor.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {detractor.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(detractor)}
                          disabled={isDeleting === detractor.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(detractor.id)}
                          disabled={isDeleting !== null}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Plus}
              title="No detractors"
              description="No detractors have been added for this candidate. Add a detractor to get started."
            />
          )}
        </CardContent>
      </Card>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                {currentDetractor.id ? 'Edit Detractor' : 'Add Detractor'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentDetractor.name || ''}
                  onChange={(e) => setCurrentDetractor({...currentDetractor, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter detractor's name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={currentDetractor.description || ''}
                  onChange={(e) => setCurrentDetractor({...currentDetractor, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter description or relationship with candidate"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={() => handleSave(currentDetractor)}
                  disabled={!currentDetractor.name || isLoading}
                  isLoading={isLoading}
                >
                  {currentDetractor.id ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetractorsTable; 