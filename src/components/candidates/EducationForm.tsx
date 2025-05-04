import React, { useState } from 'react';
import { Education } from '../../types/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

type PartialEducation = Partial<Education>;

interface EducationFormProps {
  candidateId: string;
  initialValues?: PartialEducation;
  onSubmit: (education: PartialEducation) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EducationForm: React.FC<EducationFormProps> = ({
  candidateId,
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialEducation>({
    candidate_id: candidateId,
    institution: '',
    degree: '',
    field_of_study: '',
    ...initialValues,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formValues);
    } catch (error) {
      console.error('Error submitting education form:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Education Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add candidate's educational background
          </p>
        </div>
        
        <div className="md:col-span-2">
          <Input 
            label="Institution" 
            name="institution" 
            value={formValues.institution || ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <Input 
          label="Degree" 
          name="degree" 
          value={formValues.degree || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="Field of Study" 
          name="field_of_study" 
          value={formValues.field_of_study || ''} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues.id ? 'Update Education' : 'Add Education'}
        </Button>
      </div>
    </form>
  );
};

export default EducationForm;