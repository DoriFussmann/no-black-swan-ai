import { useState, useCallback } from 'react';

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface UseAIOptions {
  onSuccess?: (response: AIResponse) => void;
  onError?: (error: string) => void;
}

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = useCallback(async (
    prompt: string,
    context?: string,
    type?: string
  ): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      const result: AIResponse = {
        success: true,
        content: data.content,
        usage: data.usage,
      };

      options.onSuccess?.(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateResponse,
    isLoading,
    error,
    clearError,
  };
}

// Specialized hooks for different business plan sections
export function useBusinessAI() {
  const ai = useAI();

  const generateExecutiveSummary = useCallback(async (businessInfo: string) => {
    return ai.generateResponse(
      `Create an executive summary based on this business information: ${businessInfo}`,
      'You are a business consultant helping to create an executive summary. Create a concise and compelling executive summary that includes company overview, market opportunity, business model, key competitive advantages, financial highlights, and funding requirements.',
      'Business Consultant'
    );
  }, [ai]);

  const generateMarketAnalysis = useCallback(async (marketInfo: string) => {
    return ai.generateResponse(
      `Analyze the market based on this information: ${marketInfo}`,
      'You are a market research expert. Analyze the provided information and create a comprehensive market analysis that includes market size and growth potential, target customer segments, competitive landscape, market trends and drivers, and regulatory considerations.',
      'Market Research Expert'
    );
  }, [ai]);

  const generateBusinessModel = useCallback(async (businessInfo: string) => {
    return ai.generateResponse(
      `Develop a business model analysis based on this information: ${businessInfo}`,
      'You are a business model strategist. Based on the provided information, develop a detailed business model analysis that includes revenue streams and pricing strategy, cost structure and unit economics, key partnerships and resources, value proposition, and scalability factors.',
      'Business Model Strategist'
    );
  }, [ai]);

  const generateFinancialProjections = useCallback(async (financialInfo: string) => {
    return ai.generateResponse(
      `Create financial projections based on this information: ${financialInfo}`,
      'You are a financial analyst. Based on the provided business information, create realistic financial projections that include revenue forecasts (3-5 years), cost structure analysis, profitability projections, cash flow analysis, and key financial metrics. Use conservative estimates and explain your assumptions.',
      'Financial Analyst'
    );
  }, [ai]);

  return {
    ...ai,
    generateExecutiveSummary,
    generateMarketAnalysis,
    generateBusinessModel,
    generateFinancialProjections,
  };
}
