import OpenAI from 'openai';

// AI Configuration
export const AI_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  TOP_P: 1,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
} as const;

// Initialize OpenAI client
export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please check your .env.local file.');
  }

  return new OpenAI({
    apiKey: apiKey,
  });
}

// Utility function for making AI calls
export async function generateAIResponse(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
) {
  const client = createOpenAIClient();
  
  try {
    const response = await client.chat.completions.create({
      model: options?.model || AI_CONFIG.MODEL,
      messages,
      max_tokens: options?.maxTokens || AI_CONFIG.MAX_TOKENS,
      temperature: options?.temperature || AI_CONFIG.TEMPERATURE,
      top_p: AI_CONFIG.TOP_P,
      frequency_penalty: AI_CONFIG.FREQUENCY_PENALTY,
      presence_penalty: AI_CONFIG.PRESENCE_PENALTY,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Predefined prompts for different business plan sections
export const BUSINESS_PROMPTS = {
  EXECUTIVE_SUMMARY: `You are a business consultant helping to create an executive summary. 
  Based on the provided information, create a concise and compelling executive summary that includes:
  - Company overview
  - Market opportunity
  - Business model
  - Key competitive advantages
  - Financial highlights
  - Funding requirements
  
  Keep it professional, clear, and engaging.`,

  MARKET_ANALYSIS: `You are a market research expert. 
  Analyze the provided information and create a comprehensive market analysis that includes:
  - Market size and growth potential
  - Target customer segments
  - Competitive landscape
  - Market trends and drivers
  - Regulatory considerations
  
  Provide data-driven insights and clear recommendations.`,

  BUSINESS_MODEL: `You are a business model strategist. 
  Based on the provided information, develop a detailed business model analysis that includes:
  - Revenue streams and pricing strategy
  - Cost structure and unit economics
  - Key partnerships and resources
  - Value proposition
  - Scalability factors
  
  Focus on sustainability and growth potential.`,

  FINANCIAL_PROJECTIONS: `You are a financial analyst. 
  Based on the provided business information, create realistic financial projections that include:
  - Revenue forecasts (3-5 years)
  - Cost structure analysis
  - Profitability projections
  - Cash flow analysis
  - Key financial metrics
  
  Use conservative estimates and explain your assumptions.`,
} as const;

// Helper function to create system messages
export function createSystemMessage(role: string, context: string): OpenAI.Chat.Completions.ChatCompletionMessageParam {
  return {
    role: 'system',
    content: `You are ${role}. ${context} Always provide professional, well-structured, and actionable insights.`,
  };
}

// Helper function to create user messages
export function createUserMessage(content: string): OpenAI.Chat.Completions.ChatCompletionMessageParam {
  return {
    role: 'user',
    content,
  };
}
