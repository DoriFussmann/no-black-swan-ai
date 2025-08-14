import { Topic } from '../schemas';

// Business Plan Topics and Questions Framework
export const BUSINESS_PLAN_TOPICS: Record<Topic, {
  title: string;
  subtopics: Record<string, {
    title: string;
    questions: string[];
  }>;
}> = {
  executiveSummary: {
    title: 'Executive Summary',
    subtopics: {
      overview: {
        title: 'Business Overview',
        questions: [
          'What is the company/business?',
          'What problem does it solve?',
          'What is the market opportunity?',
          'What are the key milestones/achievements?',
          'What are the financial highlights?',
          'What funding/investment is involved?'
        ]
      }
    }
  },
  businessOverview: {
    title: 'Business Overview',
    subtopics: {
      structure: {
        title: 'Company Structure',
        questions: [
          'What is the legal structure?',
          'What is the company history?',
          'What is the mission/vision?',
          'What is the competitive advantage?',
          'Why is this the right time?',
          'What are the goals/objectives?'
        ]
      }
    }
  },
  marketAnalysis: {
    title: 'Market Analysis',
    subtopics: {
      research: {
        title: 'Market Research',
        questions: [
          'What industry/sector is this in?',
          'What are the market segments?',
          'What is the market size (TAM/SAM/SOM)?',
          'What is the market growth rate?',
          'Who are the competitors?',
          'What regulations apply?'
        ]
      }
    }
  },
  productsServices: {
    title: 'Products & Services',
    subtopics: {
      offerings: {
        title: 'Product Offerings',
        questions: [
          'What products/services are offered?',
          'What are the key features/functionality?',
          'What intellectual property/patents exist?',
          'What is the pricing strategy?',
          'What customer benefits are provided?'
        ]
      }
    }
  },
  businessModel: {
    title: 'Business Model',
    subtopics: {
      revenue: {
        title: 'Revenue Model',
        questions: [
          'What are the revenue streams?',
          'What are the unit economics (CAC/LTV)?',
          'How scalable is the business model?',
          'What partnerships/channels are used?'
        ]
      }
    }
  },
  gtmStrategy: {
    title: 'Go-to-Market Strategy',
    subtopics: {
      strategy: {
        title: 'GTM Strategy',
        questions: [
          'Who is the target market?',
          'What is the marketing strategy?',
          'What is the sales strategy?',
          'How is customer retention handled?'
        ]
      }
    }
  },
  operations: {
    title: 'Operations',
    subtopics: {
      execution: {
        title: 'Operational Execution',
        questions: [
          'What are the operational processes?',
          'What facilities/locations are needed?',
          'What technology/infrastructure is required?',
          'What is the supply chain/logistics?'
        ]
      }
    }
  },
  management: {
    title: 'Management',
    subtopics: {
      team: {
        title: 'Team & Leadership',
        questions: [
          'Who is on the leadership team?',
          'Who are the advisors/board members?',
          'What is the hiring/recruitment plan?',
          'What is the company culture/values?'
        ]
      }
    }
  },
  financialPlan: {
    title: 'Financial Plan',
    subtopics: {
      projections: {
        title: 'Financial Projections',
        questions: [
          'What are the revenue projections?',
          'What are the expenses/costs?',
          'What is the cash flow/funding plan?',
          'What are the financial projections?'
        ]
      }
    }
  },
  riskAnalysis: {
    title: 'Risk Analysis',
    subtopics: {
      risks: {
        title: 'Risk Assessment',
        questions: [
          'What are the key risks?',
          'How are risks mitigated?',
          'How are risks monitored?'
        ]
      }
    }
  },
  benchmarking: {
    title: 'Benchmarking',
    subtopics: {
      comparison: {
        title: 'Industry Comparison',
        questions: [
          'What are the industry benchmarks?',
          'How does this compare to competitors?',
          'What are the performance metrics?',
          'What are the best practices?'
        ]
      }
    }
  },
  unassigned: {
    title: 'Unassigned',
    subtopics: {
      unmapped: {
        title: 'Unmapped Content',
        questions: []
      }
    }
  }
};

// Configuration constants
export const CONFIG = {
  CHUNK_SIZE: {
    TARGET: 800,
    MIN: 400,
    MAX: 1400
  },
  CONFIDENCE_THRESHOLD: 0.3,
  MIN_ANSWERED_LENGTH: 120,
  URL_FETCH_TIMEOUT: 8000, // 8 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Question keywords for deterministic mapping
export const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  executiveSummary: [
    'executive summary', 'overview', 'summary', 'company', 'business', 'problem', 'solution',
    'market opportunity', 'milestone', 'achievement', 'financial', 'funding', 'investment'
  ],
  businessOverview: [
    'business overview', 'company', 'structure', 'legal', 'history', 'mission', 'vision',
    'competitive advantage', 'timing', 'goal', 'objective', 'purpose'
  ],
  marketAnalysis: [
    'market', 'industry', 'sector', 'segment', 'tam', 'sam', 'som', 'growth', 'competitor',
    'competition', 'regulation', 'demand', 'size'
  ],
  productsServices: [
    'product', 'service', 'offering', 'feature', 'functionality', 'patent', 'intellectual property',
    'pricing', 'price', 'benefit', 'value'
  ],
  businessModel: [
    'business model', 'revenue', 'monetization', 'unit economics', 'cac', 'ltv', 'scale',
    'partnership', 'channel', 'distribution'
  ],
  gtmStrategy: [
    'go to market', 'gtm', 'target market', 'marketing', 'sales', 'retention', 'customer',
    'strategy', 'campaign'
  ],
  operations: [
    'operation', 'process', 'facility', 'location', 'technology', 'infrastructure',
    'supply chain', 'logistics', 'delivery'
  ],
  management: [
    'team', 'leadership', 'management', 'advisor', 'board', 'hiring', 'recruitment',
    'culture', 'value', 'employee'
  ],
  financialPlan: [
    'financial', 'revenue', 'expense', 'cost', 'cash flow', 'funding', 'projection',
    'budget', 'planning'
  ],
  riskAnalysis: [
    'risk', 'threat', 'vulnerability', 'mitigation', 'monitoring', 'challenge',
    'obstacle', 'barrier'
  ],
  benchmarking: [
    'benchmark', 'comparison', 'competitor', 'performance', 'metric', 'kpi',
    'best practice', 'industry standard'
  ],
  unassigned: []
};

// Error messages
export const ERROR_MESSAGES = {
  UNREADABLE_PDF: 'PDF file could not be read or contains no extractable text',
  FETCH_FAILED: 'Failed to fetch content from URL',
  EMPTY_TEXT: 'No readable text content found',
  MAP_CONFIDENCE_LOW: 'Content mapping confidence below threshold',
  INVALID_INPUT: 'Invalid input provided',
  PROCESSING_ERROR: 'Error during content processing'
} as const;
