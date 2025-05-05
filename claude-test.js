// Simple script to test Claude API
const fs = require('fs');
const https = require('https');

// Try to load API key from .env file
let apiKey = '';
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/VITE_CLAUDE_API_KEY=([^\s]+)/);
  if (match && match[1]) {
    apiKey = match[1];
    console.log('Using API key from .env file');
  }
} catch (err) {
  console.error('Error reading .env file:', err.message);
}

if (!apiKey) {
  console.error('No Claude API key found. Please set VITE_CLAUDE_API_KEY in your .env file');
  process.exit(1);
}

// Test the model name directly with Claude API
async function testClaudeModel() {
  // Try different model names
  const models = [
    'claude-3-sonnet-20240229',
    'claude-3-sonnet',
    'claude-3-haiku-20240307',
    'claude-3-opus-20240229',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-1.2'
  ];
  
  console.log('Testing Claude API with different model names...');
  
  for (const model of models) {
    console.log(`\nTesting model: ${model}`);
    
    const data = JSON.stringify({
      model,
      max_tokens: 50,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: 'Hello, please respond with a very short test message.'
        }
      ]
    });
    
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      }
    };
    
    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let responseData = '';
          
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: responseData
            });
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.write(data);
        req.end();
      });
      
      console.log(`Status code: ${response.statusCode}`);
      
      if (response.statusCode === 200) {
        console.log('✅ SUCCESS! Model name is valid');
        try {
          const parsedResponse = JSON.parse(response.body);
          console.log('Response:', parsedResponse.content[0].text.substring(0, 50) + '...');
        } catch (e) {
          console.log('Error parsing response:', e);
        }
      } else {
        console.log('❌ ERROR');
        try {
          const errorData = JSON.parse(response.body);
          console.log('Error response:', errorData);
        } catch (e) {
          console.log('Raw error response:', response.body);
        }
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }
}

testClaudeModel(); 