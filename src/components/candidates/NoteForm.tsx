import React, { useState } from 'react';
import { CandidateNote } from '../../types/database.types';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';

type PartialNote = Partial<CandidateNote>;

interface NoteFormProps {
  candidateId: string;
  onSubmit: (note: PartialNote) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({
  candidateId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialNote>({
    candidate_id: candidateId,
    note_content: '',
    author: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formValues);
      // Reset form after submission
      setFormValues({
        candidate_id: candidateId,
        note_content: '',
        author: formValues.author, // Keep the author for convenience
      });
    } catch (error) {
      console.error('Error submitting note:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Note Content"
        name="note_content"
        value={formValues.note_content || ''}
        onChange={handleChange}
        placeholder="Add your note here..."
        rows={3}
        required
      />
      
      <Input
        label="Author"
        name="author"
        value={formValues.author || ''}
        onChange={handleChange}
        placeholder="Your name"
      />
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Add Note
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;