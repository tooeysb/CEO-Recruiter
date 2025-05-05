const fs = require('fs');
const path = require('path');
const https = require('https');

// Get API key
let apiKey = '';

// Try to load from environment
if (process.env.VITE_CLAUDE_API_KEY) {
  apiKey = process.env.VITE_CLAUDE_API_KEY;
  console.log('Using API key from environment variable');
} else {
  // Try to load from .env file
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const match = envFile.match(/VITE_CLAUDE_API_KEY=([^\s]+)/);
    if (match && match[1]) {
      apiKey = match[1];
      console.log('Using API key from .env file');
    }
  } catch (err) {
    console.error('Error reading .env file:', err.message);
  }
}

if (!apiKey) {
  console.error('No Claude API key found. Please set VITE_CLAUDE_API_KEY in your .env file');
  process.exit(1);
}

// Test request to Claude API
const data = JSON.stringify({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 500,
  temperature: 0.7,
  messages: [
    {
      role: 'user',
      content: 'Hello, Claude. Can you respond with a short test message?'
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
    'Content-Length': data.length
  }
};

console.log('Sending test request to Claude API...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const parsed = JSON.parse(responseData);
        console.log('API response received successfully!');
        console.log('Model used:', parsed.model);
        console.log('Response content:', parsed.content[0].text);
      } catch (e) {
        console.error('Error parsing response:', e);
        console.log('Raw response:', responseData);
      }
    } else {
      console.error('Error response from API:');
      console.log(responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Error sending request:', e.message);
});

req.write(data);
req.end();

console.log('Request sent, waiting for response...'); 