import React, { useState } from 'react';
import { Endorser } from '../../types/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

type PartialEndorser = Partial<Endorser>;

interface EndorserFormProps {
  candidateId: string;
  initialValues?: PartialEndorser;
  onSubmit: (endorser: PartialEndorser) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EndorserForm: React.FC<EndorserFormProps> = ({
  candidateId,
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialEndorser>({
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
      console.error('Error submitting endorser form:', error);
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
        placeholder="Add details about this endorser..."
        rows={3}
      />
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues.id ? 'Update Endorser' : 'Add Endorser'}
        </Button>
      </div>
    </form>
  );
};

export default EndorserForm;