import { Plan, Snippet, Topic, Allocation } from '../schemas';
import { BUSINESS_PLAN_TOPICS, CONFIG } from '../utils/constants';
import { professionalizeSnippet, professionalizeSnippets } from '../edit/professionalizer';

export interface PlanBuilderResult {
  plan: Plan;
  progress: {
    overallPct: number;
    byTopic: Record<Topic, number>;
    details: Record<Topic, {
      answeredQuestions: number;
      totalQuestions: number;
      confidence: number;
    }>;
  };
}

export function buildPlan(
  allocations: Allocation[],
  unassigned: Array<{
    chunkId: string;
    sourceId: string;
    excerpt: string;
    suggestedTopic?: Topic;
    reason: string;
  }>,
  companyName?: string,
  chunks?: Map<string, { text: string; sourceId: string; startOffset: number; endOffset: number }>
): PlanBuilderResult {
  // Initialize plan structure
  const plan: Plan = {
    version: new Date().toISOString(),
    companyName,
    topics: {} as Plan['topics'],
    unassigned: [],
    metadata: {
      totalSources: 0,
      totalChunks: allocations.length + unassigned.length,
      mappedChunks: allocations.length,
      unassignedChunks: unassigned.length,
      lastUpdated: new Date().toISOString()
    }
  };

  // Initialize topics structure
  for (const topic of Object.keys(BUSINESS_PLAN_TOPICS) as Topic[]) {
    plan.topics[topic] = {
      subtopics: {}
    };
    
    const topicData = BUSINESS_PLAN_TOPICS[topic];
    for (const [subtopicKey, subtopicData] of Object.entries(topicData.subtopics)) {
      plan.topics[topic].subtopics[subtopicKey] = {
        questions: {}
      };
      
      for (const question of subtopicData.questions) {
        plan.topics[topic].subtopics[subtopicKey].questions[question] = [];
      }
    }
  }

  // Group allocations by topic and question
  const allocationsByQuestion = new Map<string, Allocation[]>();
  
  for (const allocation of allocations) {
    if (allocation.topic === 'unassigned') continue;
    
    const questionKey = allocation.question || 'general';
    const fullKey = `${allocation.topic}:${allocation.subtopic || 'general'}:${questionKey}`;
    
    if (!allocationsByQuestion.has(fullKey)) {
      allocationsByQuestion.set(fullKey, []);
    }
    allocationsByQuestion.get(fullKey)!.push(allocation);
  }

  // Create snippets from allocations
  const snippets: Snippet[] = [];
  
  for (const [key, questionAllocations] of allocationsByQuestion) {
    const [topic, subtopic, question] = key.split(':');
    const topicTyped = topic as Topic;
    
    // Sort allocations by confidence (highest first)
    const sortedAllocations = questionAllocations.sort((a, b) => b.confidence - a.confidence);
    
    // Take the best allocation for this question
    const bestAllocation = sortedAllocations[0];
    
    // Get the chunk text
    const chunkText = chunks?.get(bestAllocation.chunkId)?.text || '';
    
    // Create snippet
    const snippet: Snippet = {
      chunkId: bestAllocation.chunkId,
      sourceId: bestAllocation.sourceId,
      topic: topicTyped,
      subtopic: subtopic !== 'general' ? subtopic : undefined,
      question: question !== 'general' ? question : undefined,
      originalText: chunkText,
      editedText: undefined,
      editFlag: 'original',
      confidence: bestAllocation.confidence,
      provenance: {
        sourceId: bestAllocation.sourceId,
        chunkId: bestAllocation.chunkId,
        startOffset: bestAllocation.startOffset,
        endOffset: bestAllocation.endOffset
      }
    };
    
    snippets.push(snippet);
    
    // Add to plan structure
    if (question !== 'general' && subtopic !== 'general') {
      plan.topics[topicTyped].subtopics[subtopic].questions[question].push(snippet);
    }
  }

  // Professionalize snippets
  const professionalizedSnippets = professionalizeSnippets(snippets);
  
  // Update snippets in plan with professionalized versions
  for (const snippet of professionalizedSnippets) {
    if (snippet.question && snippet.subtopic) {
      const existingSnippets = plan.topics[snippet.topic].subtopics[snippet.subtopic].questions[snippet.question];
      const existingIndex = existingSnippets.findIndex((s: Snippet) => s.chunkId === snippet.chunkId);
      if (existingIndex >= 0) {
        existingSnippets[existingIndex] = snippet;
      }
    }
  }

  // Add unassigned items
  plan.unassigned = unassigned.map(item => ({
    chunkId: item.chunkId,
    sourceId: item.sourceId,
    excerpt: item.excerpt,
    suggestedTopic: item.suggestedTopic,
    reason: item.reason
  }));

  // Calculate progress
  const progress = calculateProgress(plan);

  return { plan, progress };
}

function calculateProgress(plan: Plan): PlanBuilderResult['progress'] {
  const byTopic: Record<Topic, number> = {} as Record<Topic, number>;
  const details: Record<Topic, {
    answeredQuestions: number;
    totalQuestions: number;
    confidence: number;
  }> = {} as Record<Topic, any>;

  let totalAnswered = 0;
  let totalQuestions = 0;
  let totalConfidence = 0;

  // Calculate progress for each topic
  for (const [topicKey, topicData] of Object.entries(BUSINESS_PLAN_TOPICS)) {
    const topic = topicKey as Topic;
    let topicAnswered = 0;
    let topicTotal = 0;
    let topicConfidence = 0;
    let topicConfidenceCount = 0;

    // Count questions and answered questions for this topic
    for (const [subtopicKey, subtopicData] of Object.entries(topicData.subtopics)) {
      for (const question of subtopicData.questions) {
        topicTotal++;
        totalQuestions++;

        // Check if this question has content in the plan
        const snippets = plan.topics[topic]?.subtopics[subtopicKey]?.questions[question] || [];
        
        if (snippets.length > 0) {
          // Check if the content meets the criteria for being "answered"
          const bestSnippet = snippets[0]; // Take the highest confidence snippet
          const isAnswered = bestSnippet.confidence > 0.5; // Simple confidence threshold

          if (isAnswered) {
            topicAnswered++;
            totalAnswered++;
            topicConfidence += bestSnippet.confidence;
            topicConfidenceCount++;
            totalConfidence += bestSnippet.confidence;
          }
        }
      }
    }

    // Calculate topic percentage
    byTopic[topic] = topicTotal > 0 ? (topicAnswered / topicTotal) * 100 : 0;
    
    details[topic] = {
      answeredQuestions: topicAnswered,
      totalQuestions: topicTotal,
      confidence: topicConfidenceCount > 0 ? topicConfidence / topicConfidenceCount : 0
    };
  }

  // Calculate overall percentage
  const overallPct = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;

  return {
    overallPct,
    byTopic,
    details
  };
}

// Helper function to merge multiple plans
export function mergePlans(plans: Plan[]): Plan {
  if (plans.length === 0) {
    throw new Error('Cannot merge empty plan array');
  }

  if (plans.length === 1) {
    return plans[0];
  }

  const mergedPlan: Plan = {
    version: new Date().toISOString(),
    companyName: plans[0].companyName,
    topics: {} as Plan['topics'],
    unassigned: [],
    metadata: {
      totalSources: 0,
      totalChunks: 0,
      mappedChunks: 0,
      unassignedChunks: 0,
      lastUpdated: new Date().toISOString()
    }
  };

  // Initialize merged topics structure
  for (const topic of Object.keys(BUSINESS_PLAN_TOPICS) as Topic[]) {
    mergedPlan.topics[topic] = {
      subtopics: {}
    };
    
    const topicData = BUSINESS_PLAN_TOPICS[topic];
    for (const [subtopicKey, subtopicData] of Object.entries(topicData.subtopics)) {
      mergedPlan.topics[topic].subtopics[subtopicKey] = {
        questions: {}
      };
      
      for (const question of subtopicData.questions) {
        mergedPlan.topics[topic].subtopics[subtopicKey].questions[question] = [];
      }
    }
  }

  // Merge snippets from all plans
  for (const plan of plans) {
    // Merge topics
    for (const [topicKey, topicData] of Object.entries(plan.topics)) {
      const topic = topicKey as Topic;
      
          for (const [subtopicKey, subtopicData] of Object.entries((topicData as any).subtopics)) {
      for (const [questionKey, snippets] of Object.entries((subtopicData as any).questions)) {
          // Add snippets, avoiding duplicates by chunkId
          const existingSnippets = mergedPlan.topics[topic].subtopics[subtopicKey].questions[questionKey];
          const existingChunkIds = new Set(existingSnippets.map((s: Snippet) => s.chunkId));
          
          for (const snippet of snippets as Snippet[]) {
            if (!existingChunkIds.has(snippet.chunkId)) {
              existingSnippets.push(snippet);
              existingChunkIds.add(snippet.chunkId);
            }
          }
        }
      }
    }

    // Merge unassigned items
    for (const unassignedItem of plan.unassigned) {
      const exists = mergedPlan.unassigned.some((item: any) => item.chunkId === unassignedItem.chunkId);
      if (!exists) {
        mergedPlan.unassigned.push(unassignedItem);
      }
    }

    // Update metadata
    mergedPlan.metadata.totalSources += plan.metadata.totalSources;
    mergedPlan.metadata.totalChunks += plan.metadata.totalChunks;
    mergedPlan.metadata.mappedChunks += plan.metadata.mappedChunks;
    mergedPlan.metadata.unassignedChunks += plan.metadata.unassignedChunks;
  }

  return mergedPlan;
}

// Helper function to get plan summary
export function getPlanSummary(plan: Plan): {
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  topicsWithContent: Topic[];
  topicsNeedingContent: Topic[];
} {
  let totalQuestions = 0;
  let answeredQuestions = 0;
  const topicsWithContent: Topic[] = [];
  const topicsNeedingContent: Topic[] = [];

  for (const [topicKey, topicData] of Object.entries(BUSINESS_PLAN_TOPICS)) {
    const topic = topicKey as Topic;
    let topicHasContent = false;

    for (const [subtopicKey, subtopicData] of Object.entries(topicData.subtopics)) {
      for (const question of subtopicData.questions) {
        totalQuestions++;
        
        const snippets = plan.topics[topic]?.subtopics[subtopicKey]?.questions[question] || [];
        if (snippets.length > 0) {
          answeredQuestions++;
          topicHasContent = true;
        }
      }
    }

    if (topicHasContent) {
      topicsWithContent.push(topic);
    } else {
      topicsNeedingContent.push(topic);
    }
  }

  return {
    totalQuestions,
    answeredQuestions,
    completionRate: totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
    topicsWithContent,
    topicsNeedingContent
  };
}
