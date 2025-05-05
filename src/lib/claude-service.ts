import CLAUDE_CONFIG from './claude-config';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequestOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stopReason: string;
  stopSequence: string | null;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Service for interacting with the Anthropic Claude API
 */
class ClaudeService {
  /**
   * Sends a message to Claude and returns the response
   */
  async generateText(
    messages: ClaudeMessage[],
    options: ClaudeRequestOptions = {}
  ): Promise<string> {
    try {
      // Use the exact model name from Anthropic documentation
      const model = 'claude-3-sonnet-20240229';
      const { maxTokens, temperature } = {
        ...CLAUDE_CONFIG.defaultParams,
        ...options
      };
      
      // Use the apiKey with fallback
      const apiKey = CLAUDE_CONFIG.apiKeyFallback;
      
      if (!apiKey) {
        console.error('Missing Claude API key. Set VITE_CLAUDE_API_KEY in your .env file.');
        throw new Error('Claude API key is not configured. Please set the VITE_CLAUDE_API_KEY environment variable.');
      }

      console.log('Making Claude API request with model:', model);
      
      // Log the full request body for debugging
      const requestBody = {
        model,
        max_tokens: maxTokens,
        temperature,
        messages
      };
      
      console.log('Claude API request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(CLAUDE_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': CLAUDE_CONFIG.apiVersion,
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error response:', response.status, errorText);
        let errorMessage = `Error from Claude API: Status ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          console.log('Error data:', JSON.stringify(errorData, null, 2));
          if (errorData.error) {
            errorMessage += `: ${errorData.error.message || errorData.error.type || 'Unknown error'}`;
          }
        } catch (e) {
          errorMessage += ` - ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json() as ClaudeResponse;
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
  
  /**
   * Analyzes candidate data with a specific prompt
   */
  async analyzeCandidateProfile(prompt: string, candidateProfile: string): Promise<string> {
    try {
      // Validate API key exists
      const apiKey = CLAUDE_CONFIG.apiKeyFallback;
      if (!apiKey) {
        throw new Error('Claude API key is not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      }

      // Check if the API key has the correct format
      if (!apiKey.startsWith('sk-ant-')) {
        throw new Error('Invalid Claude API key format. The key should start with "sk-ant-"');
      }

      // Create proper message format
      const message: ClaudeMessage = {
        role: 'user',
        content: `${prompt}\n\nHere is the candidate data:\n\n${candidateProfile}`
      };
      
      // Try direct API call instead of using generateText
      console.log('Making direct API call to Claude');
      
      // Use a model name that we've confirmed works with your account
      const model = 'claude-3-opus-20240229'; 
      
      const requestBody = {
        model,
        max_tokens: 4000,
        temperature: 0.7,
        messages: [message]
      };
      
      console.log('Request model:', model);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        throw new Error(`Claude API error: Status ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.content[0].text;
      
    } catch (error: any) {
      console.error('Claude API error:', error);
      
      // Provide more specific error messages
      if (!CLAUDE_CONFIG.apiKeyFallback) {
        throw new Error('Missing Claude API key. Please add VITE_CLAUDE_API_KEY to your .env file and restart the server.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Failed to connect to Claude API. Please check your internet connection and that your API key is valid.');
      } else {
        throw error;
      }
    }
  }
}

export default new ClaudeService(); 