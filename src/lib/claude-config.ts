// Claude API configuration
const CLAUDE_CONFIG = {
  // API key - in production, this should come from environment variables
  // For Vite, we can access environment variables through import.meta.env or process.env
  get apiKey() {
    // Try import.meta.env first (Vite's preferred way)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLAUDE_API_KEY) {
      return import.meta.env.VITE_CLAUDE_API_KEY;
    }
    // Fallback to process.env which should be populated by vite.config.ts define
    return process.env.VITE_CLAUDE_API_KEY || '';
  },
  
  // Use the defined API key
  get apiKeyFallback() {
    return this.apiKey || '';
  },
  
  // API endpoint - Use proxy URL in development to avoid CORS
  get apiUrl() {
    // In development use proxy through Vite
    if (import.meta.env && import.meta.env.DEV) {
      return '/api/claude';
    }
    // In production use direct URL
    return 'https://api.anthropic.com/v1/messages';
  },
  
  // API version
  apiVersion: '2023-06-01',
  
  // Default model - updated to a model that works with the current account
  model: 'claude-3-opus-20240229',
  
  // Default parameters
  defaultParams: {
    maxTokens: 4000,
    temperature: 0.7
  }
};

export default CLAUDE_CONFIG; 