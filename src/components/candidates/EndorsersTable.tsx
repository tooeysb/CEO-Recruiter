import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Endorser } from '../../types/database.types';
import Card from '../ui/Card';
import { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import EndorserForm from './EndorserForm';
import { supabase } from '../../lib/supabase';

interface EndorsersTableProps {
  candidateId: string;
  endorsers: Endorser[];
  onDataChange: () => void;
}

const EndorsersTable: React.FC<EndorsersTableProps> = ({ 
  candidateId, 
  endorsers: initialEndorsers, 
  onDataChange 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [currentEndorser, setCurrentEndorser] = useState<Partial<Endorser>>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [localEndorsers, setLocalEndorsers] = useState<Endorser[]>(initialEndorsers);
  
  // Update local state when props change
  React.useEffect(() => {
    setLocalEndorsers(initialEndorsers);
  }, [initialEndorsers]);

  const handleAdd = () => {
    setCurrentEndorser({ candidate_id: candidateId });
    setShowForm(true);
  };
  
  const handleEdit = (endorser: Endorser) => {
    setCurrentEndorser(endorser);
    setShowForm(true);
  };
  
  const handleDelete = async (id: string) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this endorser?")) {
      return;
    }
    
    setIsDeleting(id);
    
    // Optimistic UI update
    setLocalEndorsers(prev => prev.filter(endorser => endorser.id !== id));
    
    try {
      const { error } = await supabase
        .from('endorsers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting endorser:', error);
        alert('Failed to delete endorser. Refreshing data...');
        // Revert on error by fetching fresh data
        onDataChange();
        return;
      }
      
      console.log("Delete successful");
      // No need to call onDataChange() as we've already updated the UI
    } catch (error) {
      console.error('Error deleting endorser:', error);
      alert('Failed to delete endorser. Refreshing data...');
      // Revert on error by fetching fresh data
      onDataChange();
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleSave = async (data: Partial<Endorser>) => {
    try {
      const { error, data: newData } = await supabase
        .from('endorsers')
        .upsert({
          ...data,
          candidate_id: candidateId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving endorser:', error);
        alert('Failed to save endorser. Please try again.');
        return;
      }
      
      // Update local state
      if (data.id) {
        // Edit existing item
        setLocalEndorsers(prev => 
          prev.map(item => item.id === data.id ? newData : item)
        );
      } else {
        // Add new item
        setLocalEndorsers(prev => [...prev, newData]);
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Error saving endorser:', error);
      alert('Failed to save endorser. Please try again.');
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setCurrentEndorser({});
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Endorsers</h2>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Endorser
          </Button>
        </CardHeader>
        <CardContent>
          {localEndorsers.length > 0 ? (
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
                  {localEndorsers.map((endorser) => (
                    <tr key={endorser.id} className={isDeleting === endorser.id ? 'opacity-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {endorser.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {endorser.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(endorser)} disabled={isDeleting === endorser.id}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(endorser.id)}
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
              title="No endorsers"
              description="No endorsers have been added for this candidate. Add an endorser to get started."
            />
          )}
        </CardContent>
      </Card>
      
      {showForm && (
        <EndorserForm
          endorser={currentEndorser}
          candidateId={candidateId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default EndorsersTable; 