import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { IncomingMessage } from 'http';

// Add body property to IncomingMessage for typing
interface ExtendedIncomingMessage extends IncomingMessage {
  body?: any;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd());
  
  // Log environment variables for debugging (no actual key values)
  console.log('Environment variables:');
  console.log('- VITE_CLAUDE_API_KEY defined:', !!env.VITE_CLAUDE_API_KEY);
  console.log('- VITE_CLAUDE_MODEL defined:', !!env.VITE_CLAUDE_MODEL);
  console.log('- NODE_ENV:', mode);
  
  // Log the first few characters of the API key for debugging (safely)
  if (env.VITE_CLAUDE_API_KEY) {
    const apiKey = env.VITE_CLAUDE_API_KEY;
    if (apiKey.length > 10) {
      console.log(`API key format: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 3)}`);
    }
  }
  
  // Create a simple log file for API debugging
  const logFile = './claude-api-log.txt';
  try {
    fs.writeFileSync(logFile, `Claude API Log - ${new Date().toISOString()}\n`, { flag: 'w' });
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Make env variables available to the client
      'process.env.VITE_CLAUDE_API_KEY': JSON.stringify(env.VITE_CLAUDE_API_KEY),
      'process.env.VITE_CLAUDE_MODEL': JSON.stringify(env.VITE_CLAUDE_MODEL),
    },
    server: {
      proxy: {
        // Proxy API requests to avoid CORS issues
        '/api/claude': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/claude/, '/v1/messages'),
          secure: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error:', err);
              try {
                fs.appendFileSync(logFile, `ERROR: ${err.message}\n`);
              } catch (logError) {
                console.error('Error writing to log file:', logError);
              }
              
              // Try to send a helpful error response
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }));
              }
            });
            
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              const extendedReq = req as ExtendedIncomingMessage;
              
              // Log request details for debugging
              console.log(`Proxying request to Claude API: ${req.method} ${req.url}`);
              
              // Add required headers
              const apiKey = env.VITE_CLAUDE_API_KEY || '';
              if (apiKey) {
                proxyReq.setHeader('x-api-key', apiKey);
                proxyReq.setHeader('anthropic-version', '2023-06-01');
              }
              
              // If request has a body (POST), log it and make sure it's properly set
              if (req.method === 'POST' && extendedReq.body) {
                try {
                  const bodyStr = JSON.stringify(extendedReq.body);
                  fs.appendFileSync(logFile, `Request body: ${bodyStr}\n`);
                  
                  // Update content-length
                  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyStr));
                  
                  // Write body to request
                  proxyReq.write(bodyStr);
                  proxyReq.end();
                } catch (e) {
                  const error = e as Error;
                  console.error('Error processing request body:', error);
                  fs.appendFileSync(logFile, `Error with body: ${error.message}\n`);
                }
              }
            });
            
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              // Log response details
              try {
                fs.appendFileSync(logFile, `Response: ${proxyRes.statusCode} ${proxyRes.statusMessage}\n`);
                let responseBody = '';
                proxyRes.on('data', chunk => {
                  responseBody += chunk;
                });
                proxyRes.on('end', () => {
                  fs.appendFileSync(logFile, `Response body: ${responseBody}\n`);
                });
              } catch (error) {
                console.error('Error logging response:', error);
              }
            });
          },
        },
      },
    },
  };
});
