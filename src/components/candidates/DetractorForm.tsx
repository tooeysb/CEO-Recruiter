import React, { useState } from 'react';
import { Detractor } from '../../types/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

type PartialDetractor = Partial<Detractor>;

interface DetractorFormProps {
  candidateId: string;
  initialValues?: PartialDetractor;
  onSubmit: (detractor: PartialDetractor) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DetractorForm: React.FC<DetractorFormProps> = ({
  candidateId,
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialDetractor>({
    candidate_id: candidateId,
    name: '',
    description: '',
    ...initialValues,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formValues);
    } catch (error) {
      console.error('Error submitting detractor form:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formValues.name || ''}
        onChange={handleChange}
        required
      />
      
      <Textarea
        label="Description"
        name="description"
        value={formValues.description || ''}
        onChange={handleChange}
        placeholder="Add details about this detractor..."
        rows={3}
      />
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues.id ? 'Update Detractor' : 'Add Detractor'}
        </Button>
      </div>
    </form>
  );
};

export default DetractorForm;