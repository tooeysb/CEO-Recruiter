import React, { useState } from 'react';
import { Candidate } from '../../types/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

type PartialCandidate = Partial<Candidate>;

interface CandidateFormProps {
  initialValues?: PartialCandidate;
  onSubmit: (candidate: PartialCandidate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'Calibration', label: 'Calibration' },
  { value: 'Sourced', label: 'Sourced' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Disqualified', label: 'Disqualified' },
];

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Education', label: 'Education' },
  { value: 'Government', label: 'Government' },
  { value: 'Other', label: 'Other' },
];

const CandidateForm: React.FC<CandidateFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState<PartialCandidate>({
    name: '',
    location: '',
    current_title: '',
    current_employer: '',
    employer_stock_symbol: '',
    employer_revenue_usd: null,
    employer_industry: '',
    linkedin_url: '',
    x_com_url: '',
    glassdoor_url: '',
    notes: '',
    update_status: 'Calibration',
    disqualified: false,
    dq_reason: '',
    hungry: false,
    hungry_examples: '',
    humble: false,
    humble_examples: '',
    smart: false,
    smart_examples: '',
    previous_ceo_experience: false,
    exec_staff: false,
    global_experience: false,
    global_experience_details: '',
    ...initialValues,
  });
  
  // Handle special case for initialization of older data
  if (formValues.update_status === 'Calibration profile') {
    formValues.update_status = 'Calibration';
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormValues((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'employer_revenue_usd' && value !== '') {
      setFormValues((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormValues((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formValues);
    } catch (error) {
      console.error('Error submitting candidate form:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add candidate's personal and professional details
          </p>
        </div>
        
        <Input 
          label="Full Name" 
          name="name" 
          value={formValues.name || ''} 
          onChange={handleChange} 
          required 
        />
        
        <Input 
          label="Location" 
          name="location" 
          value={formValues.location || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="Current Title" 
          name="current_title" 
          value={formValues.current_title || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="Current Employer" 
          name="current_employer" 
          value={formValues.current_employer || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="Employer Stock Symbol" 
          name="employer_stock_symbol" 
          value={formValues.employer_stock_symbol || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="Employer Revenue (USD)" 
          name="employer_revenue_usd" 
          type="number" 
          value={formValues.employer_revenue_usd || ''} 
          onChange={handleChange} 
        />
        
        <Select 
          label="Employer Industry" 
          name="employer_industry" 
          options={industryOptions} 
          value={formValues.employer_industry || ''} 
          onChange={(value) => handleSelectChange('employer_industry', value)} 
        />
        
        <Select 
          label="Status" 
          name="update_status" 
          options={statusOptions} 
          value={formValues.update_status || 'Calibration'} 
          onChange={(value) => handleSelectChange('update_status', value)} 
        />
        
        <Input 
          label="LinkedIn URL" 
          name="linkedin_url" 
          value={formValues.linkedin_url || ''} 
          onChange={handleChange} 
        />
        
        <Input 
          label="X.com URL" 
          name="x_com_url" 
          value={formValues.x_com_url || ''} 
          onChange={handleChange} 
        />

        <Input 
          label="Glassdoor URL" 
          name="glassdoor_url" 
          value={formValues.glassdoor_url || ''} 
          onChange={handleChange} 
        />
        
        <div className="md:col-span-2">
          <Textarea 
            label="Notes" 
            name="notes" 
            value={formValues.notes || ''} 
            onChange={handleChange} 
            rows={4} 
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Disqualification Status</h3>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                id="disqualified"
                name="disqualified"
                type="checkbox"
                checked={formValues.disqualified || false}
                onChange={(e) => handleCheckboxChange('disqualified', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="disqualified" className="ml-2 block text-sm text-gray-700">
                Disqualified
              </label>
            </div>
          </div>
          
          {formValues.disqualified && (
            <div className="md:col-span-2">
              <Textarea
                label="Disqualification Reason"
                name="dq_reason"
                value={formValues.dq_reason || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Candidate Attributes</h3>
          </div>
          
          <div>
            <div className="mb-2 flex items-center">
              <input
                id="hungry"
                name="hungry"
                type="checkbox"
                checked={formValues.hungry || false}
                onChange={(e) => handleCheckboxChange('hungry', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hungry" className="ml-2 block text-sm text-gray-700">
                Hungry
              </label>
            </div>
            {formValues.hungry && (
              <Textarea
                name="hungry_examples"
                value={formValues.hungry_examples || ''}
                onChange={handleChange}
                placeholder="Examples of 'hungry'"
                rows={3}
              />
            )}
          </div>
          
          <div>
            <div className="mb-2 flex items-center">
              <input
                id="humble"
                name="humble"
                type="checkbox"
                checked={formValues.humble || false}
                onChange={(e) => handleCheckboxChange('humble', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="humble" className="ml-2 block text-sm text-gray-700">
                Humble
              </label>
            </div>
            {formValues.humble && (
              <Textarea
                name="humble_examples"
                value={formValues.humble_examples || ''}
                onChange={handleChange}
                placeholder="Examples of 'humble'"
                rows={3}
              />
            )}
          </div>
          
          <div>
            <div className="mb-2 flex items-center">
              <input
                id="smart"
                name="smart"
                type="checkbox"
                checked={formValues.smart || false}
                onChange={(e) => handleCheckboxChange('smart', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smart" className="ml-2 block text-sm text-gray-700">
                Smart
              </label>
            </div>
            {formValues.smart && (
              <Textarea
                name="smart_examples"
                value={formValues.smart_examples || ''}
                onChange={handleChange}
                placeholder="Examples of 'smart'"
                rows={3}
              />
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="previous_ceo_experience"
                name="previous_ceo_experience"
                type="checkbox"
                checked={formValues.previous_ceo_experience || false}
                onChange={(e) => handleCheckboxChange('previous_ceo_experience', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="previous_ceo_experience" className="ml-2 block text-sm text-gray-700">
                Previous CEO Experience
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="exec_staff"
                name="exec_staff"
                type="checkbox"
                checked={formValues.exec_staff || false}
                onChange={(e) => handleCheckboxChange('exec_staff', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="exec_staff" className="ml-2 block text-sm text-gray-700">
                Executive Staff
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="global_experience"
                name="global_experience"
                type="checkbox"
                checked={formValues.global_experience || false}
                onChange={(e) => handleCheckboxChange('global_experience', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="global_experience" className="ml-2 block text-sm text-gray-700">
                Global Experience
              </label>
            </div>
            
            {formValues.global_experience && (
              <Textarea
                name="global_experience_details"
                value={formValues.global_experience_details || ''}
                onChange={handleChange}
                placeholder="Details about global experience"
                rows={3}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues.id ? 'Update Candidate' : 'Add Candidate'}
        </Button>
      </div>
    </form>
  );
};

export default CandidateForm;