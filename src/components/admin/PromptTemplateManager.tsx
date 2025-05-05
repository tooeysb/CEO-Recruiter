import React, { useState, useEffect } from 'react';
import { Save, Edit2, Trash2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const PromptTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTemplates(data || []);
      
      // If we have templates and no current template is selected, select the default one
      if (data && data.length > 0 && !currentTemplate) {
        const defaultTemplate = data.find(t => t.is_default) || data[0];
        setCurrentTemplate(defaultTemplate);
      }
    } catch (err: any) {
      console.error('Error fetching prompt templates:', err);
      setError(`Failed to load prompt templates: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveTemplate = async () => {
    if (!currentTemplate) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .update({
          name: currentTemplate.name,
          content: currentTemplate.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentTemplate.id);
        
      if (error) throw error;
      
      setSuccessMessage('Prompt template saved successfully!');
      setIsEditing(false);
      fetchTemplates(); // Refresh the list
    } catch (err: any) {
      console.error('Error saving prompt template:', err);
      setError(`Failed to save prompt template: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const setDefaultTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // First, set all templates to non-default
      await supabase
        .from('prompt_templates')
        .update({ is_default: false })
        .neq('id', 'placeholder'); // This updates all rows
        
      // Then set the selected one as default
      const { error } = await supabase
        .from('prompt_templates')
        .update({ is_default: true })
        .eq('id', id);
        
      if (error) throw error;
      
      setSuccessMessage('Default prompt template updated!');
      fetchTemplates(); // Refresh the list
    } catch (err: any) {
      console.error('Error setting default template:', err);
      setError(`Failed to set default template: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createNewTemplate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const newTemplate = {
        name: 'New Prompt Template',
        content: 'Please analyze this candidate profile and provide a comprehensive summary.',
        is_default: templates.length === 0, // Make it default if it's the first one
      };
      
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert(newTemplate)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setCurrentTemplate(data[0]);
        setIsEditing(true);
        setSuccessMessage('New prompt template created!');
      }
      
      fetchTemplates(); // Refresh the list
    } catch (err: any) {
      console.error('Error creating new template:', err);
      setError(`Failed to create new template: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteTemplate = async (id: string) => {
    if (templates.length <= 1) {
      setError('Cannot delete the only prompt template. Create a new one first.');
      return;
    }
    
    const templateToDelete = templates.find(t => t.id === id);
    if (templateToDelete?.is_default) {
      setError('Cannot delete the default prompt template. Set another template as default first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSuccessMessage('Prompt template deleted!');
      
      // If the current template was deleted, select another one
      if (currentTemplate?.id === id) {
        const remainingTemplates = templates.filter(t => t.id !== id);
        setCurrentTemplate(remainingTemplates[0] || null);
      }
      
      fetchTemplates(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting template:', err);
      setError(`Failed to delete template: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">CEO Summary Prompts</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={createNewTemplate}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Prompt
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}
        
        {!isLoading && templates.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No prompt templates found. Create one to get started.</p>
          </div>
        )}
        
        {templates.length > 0 && (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Template
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={currentTemplate?.id || ''}
                onChange={(e) => {
                  const selected = templates.find(t => t.id === e.target.value);
                  setCurrentTemplate(selected || null);
                  setIsEditing(false);
                }}
                disabled={isLoading || isEditing}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.is_default ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {currentTemplate && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt Content
                  </label>
                  <textarea
                    rows={8}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={currentTemplate.content}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div>
                    {!currentTemplate.is_default && (
                      <Button
                        variant="outline"
                        onClick={() => setDefaultTemplate(currentTemplate.id)}
                        disabled={isLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Set as Default
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-x-2">
                    {isEditing ? (
                      <Button
                        onClick={saveTemplate}
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Prompt
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => deleteTemplate(currentTemplate.id)}
                      disabled={isLoading || templates.length <= 1 || currentTemplate.is_default}
                    >
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptTemplateManager; 