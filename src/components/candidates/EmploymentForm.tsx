import React, { useState } from 'react';
import { Employment } from '../../types/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

type PartialEmployment = Partial<Employment>;

interface EmploymentFormProps {
  candidateId: string;
  initialValues?: PartialEmployment;
  onSubmit: (employment: PartialEmployment) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EmploymentForm: React.FC<EmploymentFormProps> = ({
  candidateId,
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialEmployment>({
    candidate_id: candidateId,
    employer_name: '',
    title: '',
    start_year: null,
    end_year: null,
    description: '',
    verified: false,
    ...initialValues,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormValues((prev) => ({ ...prev, [name]: checked }));
    } else if ((name === 'start_year' || name === 'end_year') && value !== '') {
      setFormValues((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formValues);
    } catch (error) {
      console.error('Error submitting employment form:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Employment Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add candidate's work experience
          </p>
        </div>
        
        <div className="md:col-span-2">
          <Input 
            label="Employer Name" 
            name="employer_name" 
            value={formValues.employer_name || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="md:col-span-2">
          <Input 
            label="Title" 
            name="title" 
            value={formValues.title || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <Input 
          label="Start Year" 
          name="start_year" 
          type="number" 
          value={formValues.start_year || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="End Year" 
          name="end_year" 
          type="number" 
          value={formValues.end_year || ''} 
          onChange={handleChange} 
        />
        
        <div className="md:col-span-2">
          <Textarea 
            label="Description" 
            name="description" 
            value={formValues.description || ''} 
            onChange={handleChange} 
            rows={4} 
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              id="verified"
              name="verified"
              type="checkbox"
              checked={formValues.verified || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
              Verified Employment
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues.id ? 'Update Employment' : 'Add Employment'}
        </Button>
      </div>
    </form>
  );
};

export default EmploymentForm;