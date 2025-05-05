# Setting Up Claude in Procore's CEOBlueprint

This guide explains how to set up and use Anthropic's Claude API in the Procore's CEOBlueprint application for analyzing CEO candidate profiles.

## Prerequisites

1. An Anthropic API key - obtain this from [Anthropic's website](https://www.anthropic.com/)
2. Node.js environment with access to environment variables

## Setup Steps

### 1. Set up your API Key

You need to configure your Claude API key as an environment variable. There are several ways to do this:

**Option A: Environment variable in your system**
```bash
export CLAUDE_API_KEY=your_api_key_here
```

**Option B: Create a .env file in your project root**
```
CLAUDE_API_KEY=your_api_key_here
```

**Option C: Set it in your deployment platform**
If you're using services like Vercel, Netlify, etc., add the environment variable in their settings.

### 2. Configure the Model (Optional)

By default, the application uses Claude 3 Opus (claude-3-opus-20240229). You can change this to Claude 3 Sonnet for a better price/performance ratio:

```
CLAUDE_MODEL=claude-3-sonnet-20240229
```

## Testing the Integration

1. Navigate to a CEO candidate profile in Procore's CEOBlueprint
2. Click on the "Candidate Summary (LLM)" tab
3. The default prompt should be pre-filled
4. Click "Generate Summary" to test the Claude integration

If you see an error about the API key, double-check that your environment variable is set up correctly.

## Understanding the Code Structure

- `src/lib/claude-config.ts` - Contains Claude configuration settings
- `src/lib/claude-service.ts` - Service for making Claude API calls
- `src/pages/CandidateSummary.tsx` - Component that uses the Claude service

## Customizing the Prompt

You can edit the prompt in the textarea on the Candidate Summary page. The default prompt is designed to generate a comprehensive analysis of executive CEO candidates, but you can customize it for your specific needs.

## Troubleshooting

- **API Key Issues**: Make sure your API key is set correctly
- **Rate Limiting**: Claude may have rate limits, check Anthropic's documentation for details
- **Token Limits**: If the CEO candidate profile is very large, it may exceed token limits. You might need to truncate certain sections in the `generateCandidateProfile` function

## Getting Help

For Claude-specific issues, refer to [Anthropic's documentation](https://docs.anthropic.com/). 