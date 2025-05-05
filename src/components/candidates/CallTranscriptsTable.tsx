import React, { useState } from 'react';
import { Edit2, Trash2, Plus, MessageSquare } from 'lucide-react';
import { CallTranscript } from '../../types/database.types';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import CallTranscriptForm from './CallTranscriptForm';
import { supabase } from '../../lib/supabase';
import EmptyState from '../ui/EmptyState';
import { format } from 'date-fns';

interface CallTranscriptsTableProps {
  candidateId: string;
  transcripts: CallTranscript[];
  onDataChange: () => void;
}

const CallTranscriptsTable: React.FC<CallTranscriptsTableProps> = ({
  candidateId,
  transcripts,
  onDataChange,
}) => {
  const [isAddingTranscript, setIsAddingTranscript] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTranscript, setEditingTranscript] = useState<CallTranscript | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setIsAddingTranscript(true);
    setIsEditing(false);
    setEditingTranscript(null);
  };

  const handleEdit = (transcript: CallTranscript) => {
    setEditingTranscript(transcript);
    setIsEditing(true);
    setIsAddingTranscript(false);
  };

  const handleCancel = () => {
    setIsAddingTranscript(false);
    setIsEditing(false);
    setEditingTranscript(null);
  };

  const handleSubmit = async (transcriptData: Partial<CallTranscript>) => {
    setIsLoading(true);
    try {
      if (isEditing && editingTranscript) {
        // Update existing transcript
        const { error } = await supabase
          .from('call_transcripts')
          .update({
            transcript_content: transcriptData.transcript_content,
            call_date: transcriptData.call_date,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTranscript.id);

        if (error) throw error;
      } else {
        // Create new transcript
        const { error } = await supabase
          .from('call_transcripts')
          .insert({
            candidate_id: candidateId,
            transcript_content: transcriptData.transcript_content,
            call_date: transcriptData.call_date,
          });

        if (error) throw error;
      }

      // Reset form state
      setIsAddingTranscript(false);
      setIsEditing(false);
      setEditingTranscript(null);
      
      // Refresh data
      onDataChange();
    } catch (error) {
      console.error('Error saving call transcript:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('call_transcripts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data
      onDataChange();
    } catch (error) {
      console.error('Error deleting call transcript:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Call Transcripts</h2>
        {!isAddingTranscript && !isEditing && (
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingTranscript || isEditing ? (
          <CallTranscriptForm
            candidateId={candidateId}
            initialData={editingTranscript || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        ) : transcripts.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No transcripts"
            description="No call transcripts have been recorded for this candidate."
          />
        ) : (
          <div className="space-y-4">
            {transcripts.map((transcript) => (
              <div key={transcript.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="font-medium">{formatDate(transcript.call_date)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(transcript)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(transcript.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{transcript.transcript_content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallTranscriptsTable; 