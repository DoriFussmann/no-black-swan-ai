import { z } from 'zod';

// Source schemas
export const SourceTypeSchema = z.enum(['file', 'text', 'url']);
export const MimeTypeSchema = z.string().optional();

export const SourceSchema = z.object({
  sourceId: z.string(),
  type: SourceTypeSchema,
  mime: MimeTypeSchema,
  filename: z.string().optional(),
  url: z.string().url().optional(),
  rawText: z.string().min(1),
  language: z.string().default('en'),
  origin: z.literal('user-provided'),
  contentHash: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Chunk schemas
export const ChunkSchema = z.object({
  chunkId: z.string(),
  sourceId: z.string(),
  text: z.string().min(1).max(1400), // Allow shorter texts for testing
  startOffset: z.number(),
  endOffset: z.number(),
  confidence: z.number().min(0).max(1).optional(),
});

// Mapping schemas
export const TopicSchema = z.enum([
  'executiveSummary',
  'businessOverview', 
  'marketAnalysis',
  'productsServices',
  'businessModel',
  'gtmStrategy',
  'operations',
  'management',
  'financialPlan',
  'riskAnalysis',
  'benchmarking',
  'unassigned'
]);

export const AllocationSchema = z.object({
  chunkId: z.string(),
  sourceId: z.string(),
  topic: TopicSchema,
  subtopic: z.string().optional(),
  question: z.string().optional(),
  confidence: z.number().min(0).max(1),
  reason: z.string().optional(),
  startOffset: z.number(),
  endOffset: z.number(),
});

// Professionalization schemas
export const EditFlagSchema = z.enum(['original', 'professionalized', 'rejected']);

export const SnippetSchema = z.object({
  chunkId: z.string(),
  sourceId: z.string(),
  topic: TopicSchema,
  subtopic: z.string().optional(),
  question: z.string().optional(),
  originalText: z.string(),
  editedText: z.string().optional(),
  editFlag: EditFlagSchema,
  confidence: z.number().min(0).max(1),
  provenance: z.object({
    sourceId: z.string(),
    chunkId: z.string(),
    startOffset: z.number(),
    endOffset: z.number(),
  }),
});

// Plan schemas
export const PlanSchema = z.object({
  version: z.string(),
  companyName: z.string().optional(),
  topics: z.record(TopicSchema, z.object({
    subtopics: z.record(z.string(), z.object({
      questions: z.record(z.string(), z.array(SnippetSchema)),
    })),
  })),
  unassigned: z.array(z.object({
    chunkId: z.string(),
    sourceId: z.string(),
    excerpt: z.string(),
    suggestedTopic: TopicSchema.optional(),
    reason: z.string(),
  })),
  metadata: z.object({
    totalSources: z.number(),
    totalChunks: z.number(),
    mappedChunks: z.number(),
    unassignedChunks: z.number(),
    lastUpdated: z.string().datetime(),
  }),
});

// Progress schemas
export const ProgressSchema = z.object({
  overallPct: z.number().min(0).max(100),
  byTopic: z.record(TopicSchema, z.number().min(0).max(100)),
  details: z.record(TopicSchema, z.object({
    answeredQuestions: z.number(),
    totalQuestions: z.number(),
    confidence: z.number().min(0).max(1),
  })),
});

// API schemas
export const IngestRequestSchema = z.object({
  type: SourceTypeSchema,
  payload: z.union([
    z.object({ text: z.string().min(1) }),
    z.object({ file: z.instanceof(File) }),
    z.object({ url: z.string().url() }),
  ]),
});

export const IngestResponseSchema = z.object({
  sourceId: z.string(),
  success: z.boolean(),
  message: z.string(),
});

export const MapRequestSchema = z.object({
  sourceId: z.string(),
});

export const MapResponseSchema = z.object({
  updated: z.boolean(),
  stats: z.object({
    totalChunks: z.number(),
    mappedChunks: z.number(),
    unassignedChunks: z.number(),
    avgConfidence: z.number(),
  }),
});

// Error schemas
export const ErrorCodeSchema = z.enum([
  'UNREADABLE_PDF',
  'FETCH_FAILED', 
  'EMPTY_TEXT',
  'MAP_CONFIDENCE_LOW',
  'INVALID_INPUT',
  'PROCESSING_ERROR'
]);

export const ErrorResponseSchema = z.object({
  error: ErrorCodeSchema,
  message: z.string(),
  details: z.record(z.any()).optional(),
});

// Type exports
export type Source = z.infer<typeof SourceSchema>;
export type Chunk = z.infer<typeof ChunkSchema>;
export type Allocation = z.infer<typeof AllocationSchema>;
export type Snippet = z.infer<typeof SnippetSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type Progress = z.infer<typeof ProgressSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type SourceType = z.infer<typeof SourceTypeSchema>;
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export type EditFlag = z.infer<typeof EditFlagSchema>;
