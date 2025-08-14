"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function AnalyzeDataPage() {
  // State for analysis process
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for user content and prompts
  const [userContent, setUserContent] = useState<{
    files: Array<{ name: string; content: string }>;
    url: { address: string; content: string };
    text: string;
  }>({
    files: [],
    url: { address: '', content: '' },
    text: ''
  });

  const [dataAnalysisPrompt, setDataAnalysisPrompt] = useState('');
  const [businessPlanStructure, setBusinessPlanStructure] = useState<any>(null);

  // Load user content and prompts from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Load user content
        const fileContents = localStorage.getItem('fileContents');
        const files = fileContents ? JSON.parse(fileContents) : [];
        const urlInput = localStorage.getItem('urlInput') || '';
        const urlContent = localStorage.getItem('urlContent') || '';
        const textInput = localStorage.getItem('textInput') || '';
        
        setUserContent({
          files: files.map((content: string, index: number) => ({
            name: `File ${index + 1}`,
            content: content
          })),
          url: { address: urlInput, content: urlContent },
          text: textInput
        });

        // Load data analysis prompt (from the data analysis prompt page content)
        const promptContent = `Business Plan Builder – Data Handling Prompt (MVP)

Use this document directly with Cursor/Claude. It includes the refined flow spec and a ready-to-paste build prompt.

Phase 1 — Flow Spec (Refined)

1) Goal / Output
• Create a structured, professionalized Business Plan dataset by parsing user-provided content and mapping it into the 10 topics → subtopics → key questions framework.
• Output artifacts:
  • plan.json (canonical structured data), including provenance and "user‑provided" tags.
  • Render-ready snippets per topic/subtopic for the UI boxes.
  • Progress metrics (overall % and per-topic %).
• Consumer: the Business Plan UI (topic/subtopic pages + main progress bar).

2) Inputs
• Sources: File upload (PDF/DOCX/TXT/MD — MVP at least PDF/TXT), free text paste, URL (depth=0 single page) with readable extraction.
• Field shape (conceptual): sourceId • type(file|text|url) • mime • filename/url • rawText • language? with origin:"user-provided" on all content.
• PII/PHI: possible → mask emails/phones in logs; never log raw payloads.

3) Transformations
• Ingestion: extract text (PDF/DOCX/HTML→readable), normalize whitespace, standardize quotes, keep paragraph boundaries.
• Segmentation: chunk text into semantically coherent blocks (~500–1200 chars).
• Allocation: map chunks to topics/subtopics/questions via deterministic rules/keywords first, then LLM fallback for ambiguity only.
• Professionalization: grammar/style pass must not introduce new facts; preserve numbers, named entities, dates.
• Summarization: concise rewrite per subtopic using only source text; keep traceability to original chunk IDs.
• Provenance: store sourceId, chunkId, and character offsets for every mapped snippet.
• Idempotency: re‑ingesting the same source reuses its contentHash and updates mappings non‑destructively (version++).

4) Validation
• Syntactic: inputs exist, text length > minimal threshold; URLs fetchable; PDFs decodable.
• Semantic: cross-field checks where relevant; numbers preserved post‑edit.
• Business rules: no new claims not present in source; uncertain mapping → "Unassigned" with reason.
• Failure modes: reject unreadable sources; warn & keep in "Unassigned" if mapping confidence < threshold.

5) Storage (MVP)
• Local JSON store:
  • /data/plan.json (current merged plan)
  • /data/sources/<sourceId>.json (extracted text + chunks + hash)
  • /data/versions/<timestamp>.json (snapshots)
• Keys/uniqueness: sourceId = sha256(filename|url|text), version = ISO timestamp.
• Audit: change log of mappings and edits.

6) APIs / Boundaries (MVP)
• POST /ingest (file/text/url) → sourceId.
• POST /map (sourceId) → updated plan.json.
• GET /plan → current structured plan.
• GET /progress → {overallPct, byTopic}.
• GET /unassigned → list of chunks + reasons.
• Auth: none (local dev). Timeouts/Retries for URL fetch.

7) Privacy & Security
• Don't log raw content. Redact PII in logs (hash emails/phones).
• Keep raw text only in local JSON, not in console logs.
• Secrets (if any): .env (not committed).

8) Observability
• Structured logs: {event, sourceId, counts, durations, errors[], piiRedacted:true}.
• Metrics: tokens processed, chunks mapped, % unassigned, mean mapping confidence.

9) Test Cases
Happy paths:
1. Clean PDF with clearly labeled sections → 90%+ mapped, progress computed.
2. Free text describing Problem, Market, Competition → correctly split & mapped.
3. URL with readable article → allocation across Why Now + Market.

Edge cases:
1. Very long document (>100k chars) → chunking and streaming mapping works.
2. Mixed languages (EN/DE) → detect language per chunk; map English; flag non-EN.
3. Duplicated upload → idempotent (no duplicate records; version++ only if content changed).

Failure cases:
1. Image-only PDF (no text) → 400 with UNREADABLE_PDF.
2. URL behind auth / 403 → 400 with FETCH_FAILED, nothing persisted.`;

        setDataAnalysisPrompt(promptContent);

        // Load business plan structure (from the business plan structure page content)
        const structureContent = {
          'executive-summary': {
            subtopics: `• Brief company overview
• Market opportunity
• Product/service summary
• Business model
• Key milestones
• Financial snapshot
• Funding ask`,
            questions: `• What is the one-sentence description of the business?
• What problem do you solve and for whom?
• What is the size of the opportunity?
• What are the most important milestones to date?
• What is the financial headline (revenue, growth, profitability)?
• How much funding are you seeking, and for what purpose?`
          },
          'business-overview': {
            subtopics: `• Company Description
• Mission & Vision
• Value Proposition
• Why Now
• Current Stage & Milestones Achieved
• Strategic Objectives`,
            questions: `• What is the legal structure, location, and date of incorporation?
• What's the history and evolution of the company?
• What is the company's mission statement?
• What is the long-term vision?
• What core problem do you solve and why is your solution unique?
• Why is now the right time for this business?
• What are your top 3–5 goals for the next 12–36 months?`
          },
          'market-analysis': {
            subtopics: `• Market Definition
• Market Size & Growth
• Market Trends & Drivers
• Competitive Landscape
• Comparable Companies & Benchmarks
• Regulatory & Industry Considerations`,
            questions: `• What industry are you in and what are its boundaries?
• What segments and geographies do you serve?
• What is your TAM, SAM, and SOM?
• What are the historic and projected growth rates?
• What macro trends and customer behaviors shape demand?
• Who are your direct and indirect competitors?
• What are your competitive advantages and weaknesses?
• What similar companies exist and what are their benchmarks?
• What regulations or standards impact your business?`
          },
          'products-services': {
            subtopics: `• Overview of Offerings
• Problem–Solution Fit
• Unique Selling Points (USPs)
• Development Status & Roadmap
• Intellectual Property & Proprietary Assets
• Pricing & Packaging
• Customer Experience & Support`,
            questions: `• What are your main products/services and features?
• How do you solve your customers' problems?
• What makes you different from competitors?
• What stage are your offerings in and what's next?
• What patents, trademarks, or trade secrets do you own?
• How do you price your offerings and why?
• How do customers interact with your product/service and what support do you provide?`
          },
          'business-model': {
            subtopics: `• Core Revenue Model
• Secondary Revenue Streams
• Monetization Strategy
• Unit Economics
• Revenue Drivers
• Scalability & Leverage
• Partnerships & Channels`,
            questions: `• How do you make money and why is this model suited to your market?
• Do you have add-on revenue sources?
• How do you design pricing to maximize revenue?
• What is your CAC, LTV, and contribution margin?
• What are the main levers for revenue growth?
• How does your cost structure change as you scale?
• Do you have revenue-sharing or distribution agreements?`
          },
          'gtm': {
            subtopics: `• Target Customer Segments
• Positioning & Messaging
• Marketing Strategy
• Sales Strategy
• Customer Acquisition Channels
• Partnerships & Strategic Alliances
• Retention & Expansion Strategy
• KPIs & Tracking`,
            questions: `• Who are your ideal customers?
• How do you communicate your value proposition?
• Which channels do you use for awareness and demand generation?
• What is your sales model and process?
• Which channels drive the most conversions?
• Who are your key GTM partners?
• How do you keep and grow customers?
• What metrics measure GTM success?`
          },
          'execution-plan': {
            subtopics: `• Operating Model
• Location & Facilities
• Technology & Infrastructure
• Supply Chain & Logistics
• Key Processes & Quality Control
• Execution Roadmap
• KPIs & Operational Metrics`,
            questions: `• How do you deliver your product/service?
• Where do you operate from?
• What tools, platforms, and systems do you use?
• How do you source, produce, and distribute?
• How do you ensure consistent quality?
• What are your operational milestones?
• How do you measure operational performance?`
          },
          'team': {
            subtopics: `• Organizational Structure
• Leadership Team
• Advisors & Board Members
• Hiring Plan
• Culture & Values
• Governance & Decision-Making`,
            questions: `• What is your org chart?
• Who are the key leaders, and what are their backgrounds?
• Who advises or governs the company?
• What roles do you need to fill and when?
• What principles guide your company?
• How are major decisions made?`
          },
          'financial-plan': {
            subtopics: `• Historical Financials
• Revenue Projections
• Expense Projections
• Profitability & Break-Even Analysis
• Cash Flow Forecast
• Capital Requirements & Use of Funds
• Key Financial Ratios & Metrics
• Scenario Analysis`,
            questions: `• What are your past P&L, balance sheet, and cash flow results?
• How will revenue grow by product, region, and channel?
• How will costs evolve?
• When will you become profitable?
• How will cash move over time?
• How much funding do you need and for what?
• What are your key performance metrics?
• What are your base, upside, and downside cases?`
          },
          'risk-analysis': {
            subtopics: `• Market Risks
• Operational Risks
• Financial Risks
• Regulatory & Legal Risks
• Technology Risks
• Mitigation Strategies
• Monitoring & Early Warning Systems`,
            questions: `• What could change in demand or competition?
• What could disrupt delivery or operations?
• What could cause funding or cost issues?
• What compliance or legal issues could arise?
• What are your tech vulnerabilities?
• How will you address these risks?
• How will you detect risks early?`
          }
        };

        setBusinessPlanStructure(structureContent);

      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load user content and prompts');
      }
    };

    loadData();
  }, []);

  // Check if there's any content to analyze
  const hasContent = userContent.files.length > 0 || userContent.url.address || userContent.text;

  // Function to analyze data with AI
  const analyzeDataWithAI = async () => {
    if (!hasContent) {
      setError('No content available to analyze. Please upload files, add URLs, or enter text first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress('Preparing data for analysis...');

    try {
      // Prepare the data for analysis
      const allContent = [
        ...userContent.files.map(file => `File: ${file.name}\n${file.content}`),
        userContent.url.address ? `URL: ${userContent.url.address}\n${userContent.url.content}` : '',
        userContent.text ? `Text Input:\n${userContent.text}` : ''
      ].filter(content => content.trim()).join('\n\n---\n\n');

      setAnalysisProgress('Sending data to OpenAI for analysis...');

      // Create the analysis prompt
      const analysisPrompt = `${dataAnalysisPrompt}

BUSINESS PLAN STRUCTURE REFERENCE:
${JSON.stringify(businessPlanStructure, null, 2)}

USER CONTENT TO ANALYZE:
${allContent}

Please analyze the above user content according to the business plan structure framework. Map the content to the appropriate topics, subtopics, and key questions. Return your analysis in the following JSON format:

{
  "analysis": {
    "executive-summary": {
      "subtopics": {
        "brief-company-overview": "extracted content...",
        "market-opportunity": "extracted content...",
        "product-service-summary": "extracted content...",
        "business-model": "extracted content...",
        "key-milestones": "extracted content...",
        "financial-snapshot": "extracted content...",
        "funding-ask": "extracted content..."
      }
    },
    "business-overview": {
      "subtopics": {
        "company-description": "extracted content...",
        "mission-vision": "extracted content...",
        "value-proposition": "extracted content...",
        "why-now": "extracted content...",
        "current-stage-milestones": "extracted content...",
        "strategic-objectives": "extracted content..."
      }
    },
    // ... continue for all 10 topics
  },
  "progress": {
    "overall": 75,
    "byTopic": {
      "executive-summary": 80,
      "business-overview": 70,
      // ... continue for all topics
    }
  },
  "unassigned": [
    {
      "content": "content that couldn't be mapped",
      "reason": "explanation why"
    }
  ]
}

Only return valid JSON. Do not include any explanatory text outside the JSON structure.`;

      setAnalysisProgress('Waiting for AI response...');

      // Send to OpenAI API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: analysisPrompt,
          context: 'business-plan-analysis',
          type: 'analysis'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      setAnalysisProgress('Processing AI response...');
      
      // Parse and validate the response
      let parsedResult;
      try {
        parsedResult = typeof result.response === 'string' ? JSON.parse(result.response) : result.response;
      } catch (parseError) {
        throw new Error('Invalid JSON response from AI');
      }

      setAnalysisResult(parsedResult);
      
      // Save results to localStorage for topic pages
      localStorage.setItem('aiAnalysisResult', JSON.stringify(parsedResult));
      
      setAnalysisProgress('Analysis complete!');

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold text-gray-900 ${inter.className}`}>
                  Analyze Data with AI
                </h1>
                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                  AI-powered analysis of your business data
                </p>
              </div>
              <Link 
                href="/feed"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Feed</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className={`text-2xl font-bold text-gray-900 mb-8 ${inter.className}`}>
                AI Data Analysis
              </h2>
              
              {!hasContent ? (
                /* No Content Message */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${inter.className}`}>
                    No Data Available for Analysis
                  </h3>
                  <p className={`text-gray-600 mb-6 ${inter.className}`}>
                    Upload files, add URLs, or enter text on the data feed page to analyze with AI.
                  </p>
                  <Link 
                    href="/feed"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Go to Data Feed
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Content Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className={`text-xl font-bold text-blue-900 mb-4 ${inter.className}`}>
                      📊 Content Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{userContent.files.length}</div>
                        <div className="text-sm text-blue-700">Files Uploaded</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{userContent.url.address ? '1' : '0'}</div>
                        <div className="text-sm text-blue-700">URLs Added</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{userContent.text ? '1' : '0'}</div>
                        <div className="text-sm text-blue-700">Text Inputs</div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Button */}
                  <div className="text-center">
                    <button
                      onClick={analyzeDataWithAI}
                      disabled={isAnalyzing}
                      className={`px-8 py-4 bg-indigo-600 text-white rounded-lg shadow-md transition-all duration-200 text-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto ${
                        isAnalyzing ? 'bg-indigo-500 cursor-not-allowed' : ''
                      } ${inter.className}`}
                    >
                      {isAnalyzing ? (
                        <>
                          <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>Start AI Analysis</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress Display */}
                  {isAnalyzing && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className={`text-lg font-semibold text-yellow-900 mb-2 ${inter.className}`}>
                        🔄 Analysis in Progress
                      </h3>
                      <p className={`text-yellow-700 ${inter.className}`}>{analysisProgress}</p>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className={`text-lg font-semibold text-red-900 mb-2 ${inter.className}`}>
                        ❌ Analysis Error
                      </h3>
                      <p className={`text-red-700 ${inter.className}`}>{error}</p>
                    </div>
                  )}

                  {/* Results Display */}
                  {analysisResult && !isAnalyzing && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-green-900 mb-4 ${inter.className}`}>
                        ✅ Analysis Complete
                      </h3>
                      
                      {/* Progress Summary */}
                      {analysisResult.progress && (
                        <div className="mb-6">
                          <h4 className={`text-lg font-semibold text-green-800 mb-3 ${inter.className}`}>
                            Overall Progress: {analysisResult.progress.overall}%
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {Object.entries(analysisResult.progress.byTopic || {}).map(([topic, percentage]) => (
                              <div key={topic} className="bg-white rounded-lg p-3 border border-green-200">
                                <div className="text-lg font-bold text-green-600">{percentage}%</div>
                                <div className="text-xs text-green-700 capitalize">{topic.replace('-', ' ')}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Unassigned Content */}
                      {analysisResult.unassigned && analysisResult.unassigned.length > 0 && (
                        <div className="mb-6">
                          <h4 className={`text-lg font-semibold text-green-800 mb-3 ${inter.className}`}>
                            Unassigned Content ({analysisResult.unassigned.length} items)
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-green-200 max-h-48 overflow-y-auto">
                            {analysisResult.unassigned.map((item: any, index: number) => (
                              <div key={index} className="mb-3 p-3 bg-gray-50 rounded border">
                                <div className="text-sm text-gray-700 mb-1">{item.content}</div>
                                <div className="text-xs text-gray-500">Reason: {item.reason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Navigation to Topic Pages */}
                      <div className="mt-6">
                        <h4 className={`text-lg font-semibold text-green-800 mb-3 ${inter.className}`}>
                          View Analysis Results
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { name: 'Executive Summary', href: '/executive-summary' },
                            { name: 'Business Overview', href: '/business-overview-data' },
                            { name: 'Market Analysis', href: '/market-analysis' },
                            { name: 'Products & Services', href: '/products-services' },
                            { name: 'Business Model', href: '/business-model' },
                            { name: 'GTM', href: '/gtm' },
                            { name: 'Execution Plan', href: '/execution-plan' },
                            { name: 'Team', href: '/team' },
                            { name: 'Financial Plan', href: '/financial-plan' },
                            { name: 'Risk Analysis', href: '/risk-analysis' }
                          ].map((topic) => (
                            <Link key={topic.name} href={topic.href}>
                              <button className="w-full bg-green-600 text-white rounded-lg p-3 hover:bg-green-700 transition-colors duration-200 text-sm">
                                {topic.name}
                              </button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw API Response Display */}
                  {analysisResult && !isAnalyzing && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                      <h3 className={`text-xl font-bold text-gray-900 mb-4 ${inter.className}`}>
                        📋 Raw API Response
                      </h3>
                      <p className={`text-gray-600 mb-4 ${inter.className}`}>
                        Complete analyzed and mapped data from OpenAI API:
                      </p>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-mono ${inter.className}`}>
                          {JSON.stringify(analysisResult, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
