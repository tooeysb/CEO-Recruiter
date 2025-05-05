import React, { useState } from 'react';
import { CallTranscript } from '../../types/database.types';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import { CalendarIcon } from 'lucide-react';

type PartialTranscript = Partial<CallTranscript>;

interface CallTranscriptFormProps {
  candidateId: string;
  initialData?: CallTranscript;
  onSubmit: (transcript: PartialTranscript) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CallTranscriptForm: React.FC<CallTranscriptFormProps> = ({
  candidateId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialTranscript>({
    id: initialData?.id,
    candidate_id: candidateId,
    transcript_content: initialData?.transcript_content || '',
    call_date: initialData?.call_date || new Date().toISOString().split('T')[0],
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formValues);
      // Form will be closed after submission
    } catch (error) {
      console.error('Error submitting call transcript:', error);
    }
  };
  
  const isEditMode = Boolean(initialData?.id);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Call Date
        </label>
        <div className="relative">
          <input
            type="date"
            name="call_date"
            value={formValues.call_date}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <Textarea
        label="Transcript Content"
        name="transcript_content"
        value={formValues.transcript_content || ''}
        onChange={handleChange}
        placeholder="Add the call transcript content here..."
        rows={8}
        required
      />
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? 'Update Transcript' : 'Add Transcript'}
        </Button>
      </div>
    </form>
  );
};

export default CallTranscriptForm; 