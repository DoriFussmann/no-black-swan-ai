"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function FeedPage() {
  // File upload state
  const [fileInputs, setFileInputs] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  

  

  const [fileContents, setFileContents] = useState<string[]>([]);
  const [urlContent, setUrlContent] = useState("");

  // AI Analysis results state
  const [aiAnalysisResult, setAiAnalysisResult] = useState<Record<string, any> | null>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  
  // Raw data modal state
  const [showRawDataModal, setShowRawDataModal] = useState(false);
  
  // Business Plan Structure modal state
  const [showBusinessPlanModal, setShowBusinessPlanModal] = useState(false);
  const [isEditingBusinessPlan, setIsEditingBusinessPlan] = useState(false);
  const [showDataPromptModal, setShowDataPromptModal] = useState(false);
  const [isEditingDataPrompt, setIsEditingDataPrompt] = useState(false);
  const [showCompletePromptModal, setShowCompletePromptModal] = useState(false);
  const [showAIResultsModal, setShowAIResultsModal] = useState(false);
  const [editingBusinessPlanText, setEditingBusinessPlanText] = useState('');
  const [editingDataPromptText, setEditingDataPromptText] = useState('');
  const [dataPromptContent, setDataPromptContent] = useState('');
  const [dataAnalysisContent, setDataAnalysisContent] = useState({
    phase1FlowSpec: '',
    challengeImprovements: '',
    readyToPasteBuildPrompt: ''
  });
  const [businessPlanContent, setBusinessPlanContent] = useState({
    executiveSummary: {
      subtopics: [],
      questions: []
    },
    businessOverview: {
      subtopics: [],
      questions: []
    },
    marketAnalysis: {
      subtopics: [],
      questions: []
    },
    productsServices: {
      subtopics: [],
      questions: []
    },
    businessModel: {
      subtopics: [],
      questions: []
    },
    gtm: {
      subtopics: [],
      questions: []
    },
    executionPlan: {
      subtopics: [],
      questions: []
    },
    team: {
      subtopics: [],
      questions: []
    },
    financialPlan: {
      subtopics: [],
      questions: []
    },
    riskAnalysis: {
      subtopics: [],
      questions: []
    }
  });

  // Phase 1 Flow Spec (Refined) - Documentation
  /*
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
  */

  // Load existing data from localStorage on component mount
  useEffect(() => {
    const loadExistingData = () => {
      try {
        const savedUrlInput = localStorage.getItem('urlInput');
        const savedTextInput = localStorage.getItem('textInput');
        const savedFileContents = localStorage.getItem('fileContents');
        const savedUrlContent = localStorage.getItem('urlContent');
        
        if (savedUrlInput) setUrlInput(savedUrlInput);
        if (savedTextInput) setTextInput(savedTextInput);
        if (savedFileContents) setFileContents(JSON.parse(savedFileContents));
        if (savedUrlContent) setUrlContent(savedUrlContent);

        // Load AI analysis results
        const analysisResult = localStorage.getItem('aiAnalysisResult');
        if (analysisResult && analysisResult !== 'null' && analysisResult !== 'undefined') {
          const parsed = JSON.parse(analysisResult);
          setAiAnalysisResult(parsed);
          setHasAnalysis(true);
        }

        // Load saved business plan content
        const savedBusinessPlanContent = localStorage.getItem('businessPlanContent');
        if (savedBusinessPlanContent && savedBusinessPlanContent !== 'null' && savedBusinessPlanContent !== 'undefined') {
          const parsed = JSON.parse(savedBusinessPlanContent);
          setBusinessPlanContent(parsed);
        }

        // Load saved data analysis content
        const savedDataAnalysisContent = localStorage.getItem('dataAnalysisContent');
        if (savedDataAnalysisContent && savedDataAnalysisContent !== 'null' && savedDataAnalysisContent !== 'undefined') {
          const parsed = JSON.parse(savedDataAnalysisContent);
          setDataAnalysisContent(parsed);
        }


      } catch (error) {
        console.error('Error loading existing data:', error);
      }
    };

    loadExistingData();

    // Listen for storage changes to update AI analysis results
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aiAnalysisResult') {
        try {
          if (e.newValue && e.newValue !== 'null' && e.newValue !== 'undefined') {
            const parsed = JSON.parse(e.newValue);
            setAiAnalysisResult(parsed);
            setHasAnalysis(true);
          } else {
            setAiAnalysisResult(null);
            setHasAnalysis(false);
          }
        } catch (error) {
          console.error('Error parsing AI analysis result:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load business plan content when modal opens
  useEffect(() => {
    if (showBusinessPlanModal) {
      const savedBusinessPlanContent = localStorage.getItem('businessPlanContent');
      if (savedBusinessPlanContent && savedBusinessPlanContent !== 'null' && savedBusinessPlanContent !== 'undefined') {
        try {
          const parsed = JSON.parse(savedBusinessPlanContent);
          setBusinessPlanContent(parsed);
        } catch (error) {
          console.error('Error loading business plan content:', error);
        }
      }
    }
  }, [showBusinessPlanModal]);



  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFileInputs(prev => [...prev, ...files]);
      
      // Read file contents
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const fileContent = 'File: ' + file.name + '\n\n' + content;
          setFileContents(prev => [...prev, fileContent]);
          
          // Save to localStorage for User Content page
          const existingContents = JSON.parse(localStorage.getItem('fileContents') || '[]');
          localStorage.setItem('fileContents', JSON.stringify([...existingContents, fileContent]));
        };
        reader.readAsText(file);
      });
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  // Remove individual file
  const removeFile = (index: number) => {
    setFileInputs(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all data
  const clearAllData = () => {
    setFileInputs([]);
    setUrlInput("");
    setTextInput("");
    setFileContents([]);
    setUrlContent("");
    setAiAnalysisResult(null);
    setHasAnalysis(false);
    
    // Clear localStorage
    localStorage.removeItem('fileContents');
    localStorage.removeItem('urlInput');
    localStorage.removeItem('urlContent');
    localStorage.removeItem('textInput');
    localStorage.removeItem('aiAnalysisResult');
    localStorage.removeItem('userRawData');
  };

  // Handle Process Data button click
  const handleProcessData = () => {
    // Collect all data from all sources
    const allUserData = {
      files: fileContents,
      url: urlInput,
      urlContent: urlContent,
      text: textInput,
      timestamp: new Date().toISOString()
    };

    // Store combined raw data in localStorage
    localStorage.setItem('userRawData', JSON.stringify(allUserData));
    
    // Also store individual components for backward compatibility
    if (fileContents.length > 0) {
      localStorage.setItem('fileContents', JSON.stringify(fileContents));
    }
    if (urlInput) {
      localStorage.setItem('urlInput', urlInput);
    }
    if (urlContent) {
      localStorage.setItem('urlContent', urlContent);
    }
    if (textInput) {
      localStorage.setItem('textInput', textInput);
    }
  };

  // Handle Data button click
  const handleDataButtonClick = () => {
    setShowRawDataModal(true);
  };

  // Handle Business Plan Structure button click
  const handleBusinessPlanStructureClick = () => {
    setShowBusinessPlanModal(true);
  };

  // Handle Data Prompt button click
  const handleDataPromptClick = () => {
    setShowDataPromptModal(true);
  };

  const handleCompletePromptClick = () => {
    setShowCompletePromptModal(true);
  };

  const handleAIResultsClick = () => {
    setShowAIResultsModal(true);
  };

  // Handle edit business plan
  const handleEditBusinessPlan = () => {
    setIsEditingBusinessPlan(true);
    setEditingBusinessPlanText(generateFullBusinessPlanText());
  };

  // Handle save business plan
  const handleSaveBusinessPlan = () => {
    console.log('Saving business plan text:', editingBusinessPlanText);
    
    // Completely replace all business plan content with the edited text
    // This ensures no "leftovers" from the previous structure
    const completelyNewContent = {
      executiveSummary: { subtopics: [editingBusinessPlanText], questions: [] },
      businessOverview: { subtopics: [], questions: [] },
      marketAnalysis: { subtopics: [], questions: [] },
      productsServices: { subtopics: [], questions: [] },
      businessModel: { subtopics: [], questions: [] },
      gtm: { subtopics: [], questions: [] },
      executionPlan: { subtopics: [], questions: [] },
      team: { subtopics: [], questions: [] },
      financialPlan: { subtopics: [], questions: [] },
      riskAnalysis: { subtopics: [], questions: [] }
    };
    
    // Update the state completely
    setBusinessPlanContent(completelyNewContent);
    
    // Save to localStorage
    localStorage.setItem('businessPlanContent', JSON.stringify(completelyNewContent));
    console.log('Business plan content completely replaced with edited text');
    
    setIsEditingBusinessPlan(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingBusinessPlan(false);
    setEditingBusinessPlanText('');
  };



  // Handle update business plan content
  const updateBusinessPlanContent = (section: string, type: 'subtopics' | 'questions', index: number, value: string) => {
    setBusinessPlanContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [type]: prev[section as keyof typeof prev][type].map((item: string, i: number) => 
          i === index ? value : item
        )
      }
    }));
  };

  // Helper function to render editable content
  const renderEditableContent = (section: string, type: 'subtopics' | 'questions', items: string[]) => {
    if (isEditingBusinessPlan) {
      return (
        <textarea
          value={items.join('\n')}
          onChange={(e) => {
            const newItems = e.target.value.split('\n').filter(item => item.trim() !== '');
            setBusinessPlanContent(prev => ({
              ...prev,
              [section]: {
                ...prev[section as keyof typeof prev],
                [type]: newItems
              }
            }));
          }}
          className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
      );
    } else {
      return (
        <div className="text-sm text-gray-700 space-y-1">
          {items.map((item, index) => (
            <div key={index}>• {item}</div>
          ))}
        </div>
      );
    }
  };

  // Generate full business plan text for editing
  const generateFullBusinessPlanText = () => {
    // Check if all sections are empty
    const allSections = [
      businessPlanContent.executiveSummary,
      businessPlanContent.businessOverview,
      businessPlanContent.marketAnalysis,
      businessPlanContent.productsServices,
      businessPlanContent.businessModel,
      businessPlanContent.gtm,
      businessPlanContent.executionPlan,
      businessPlanContent.team,
      businessPlanContent.financialPlan,
      businessPlanContent.riskAnalysis
    ];
    
    const hasAnyContent = allSections.some(section => 
      section.subtopics.length > 0 || section.questions.length > 0
    );
    
    // If no content exists, return empty string
    if (!hasAnyContent) {
      return '';
    }
    
    let fullText = '';
    
    // Executive Summary
    fullText += '1. Executive Summary\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.executiveSummary.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.executiveSummary.questions.join('\n') + '\n\n\n';
    
    // Business Overview
    fullText += '2. Business Overview\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.businessOverview.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.businessOverview.questions.join('\n') + '\n\n\n';
    
    // Market Analysis
    fullText += '3. Market Analysis\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.marketAnalysis.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.marketAnalysis.questions.join('\n') + '\n\n\n';
    
    // Products & Services
    fullText += '4. Products & Services\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.productsServices.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.productsServices.questions.join('\n') + '\n\n\n';
    
    // Business Model
    fullText += '5. Business Model\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.businessModel.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.businessModel.questions.join('\n') + '\n\n\n';
    
    // GTM
    fullText += '6. GTM\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.gtm.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.gtm.questions.join('\n') + '\n\n\n';
    
    // Execution Plan
    fullText += '7. Execution Plan\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.executionPlan.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.executionPlan.questions.join('\n') + '\n\n\n';
    
    // Team
    fullText += '8. Team\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.team.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.team.questions.join('\n') + '\n\n\n';
    
    // Financial Plan
    fullText += '9. Financial Plan\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.financialPlan.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.financialPlan.questions.join('\n') + '\n\n\n';
    
    // Risk Analysis
    fullText += '10. Risk Analysis\n\n';
    fullText += 'Sub Topics:\n';
    fullText += businessPlanContent.riskAnalysis.subtopics.join('\n') + '\n\n';
    fullText += 'Key Questions:\n';
    fullText += businessPlanContent.riskAnalysis.questions.join('\n') + '\n\n';
    
    return fullText;
  };

  // Parse business plan text back into structured data
  const parseBusinessPlanText = (text: string) => {
    // Only parse if we have enough content to work with
    if (!text || text.length < 100) return;
    
    // Split by section headers more reliably
    const sectionRegex = /\d+\.\s+[^\n]+/g;
    const sections = text.split(sectionRegex).filter(section => section.trim() !== '');
    
    if (sections.length >= 10) {
      const parseSection = (sectionText: string) => {
        const lines = sectionText.split('\n').filter(line => line.trim() !== '');
        let subtopics: string[] = [];
        let questions: string[] = [];
        let currentSection = '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.includes('Sub Topics:')) {
            currentSection = 'subtopics';
          } else if (trimmedLine.includes('Key Questions:')) {
            currentSection = 'questions';
          } else if (trimmedLine !== '' && currentSection === 'subtopics') {
            subtopics.push(trimmedLine);
          } else if (trimmedLine !== '' && currentSection === 'questions') {
            questions.push(trimmedLine);
          }
        }
        
        return { subtopics, questions };
      };
      
      try {
        const newContent = {
          executiveSummary: parseSection(sections[0]),
          businessOverview: parseSection(sections[1]),
          marketAnalysis: parseSection(sections[2]),
          productsServices: parseSection(sections[3]),
          businessModel: parseSection(sections[4]),
          gtm: parseSection(sections[5]),
          executionPlan: parseSection(sections[6]),
          team: parseSection(sections[7]),
          financialPlan: parseSection(sections[8]),
          riskAnalysis: parseSection(sections[9])
        };
        
        setBusinessPlanContent(newContent);
      } catch (error) {
        console.error('Error parsing business plan text:', error);
      }
    }
  };

  // Parse business plan text and return the structured data
  const parseBusinessPlanTextAndReturn = (text: string) => {
    console.log('Parsing text:', text.substring(0, 200) + '...');
    
    // Only parse if we have some content
    if (!text || text.trim() === '') {
      console.log('Text is empty, returning null');
      return null;
    }
    
    // Split by section headers more reliably
    const sectionRegex = /\d+\.\s+[^\n]+/g;
    const sections = text.split(sectionRegex).filter(section => section.trim() !== '');
    console.log('Found sections:', sections.length);
    
    if (sections.length >= 10) {
      const parseSection = (sectionText: string) => {
        const lines = sectionText.split('\n').filter(line => line.trim() !== '');
        let subtopics: string[] = [];
        let questions: string[] = [];
        let currentSection = '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.includes('Sub Topics:')) {
            currentSection = 'subtopics';
          } else if (trimmedLine.includes('Key Questions:')) {
            currentSection = 'questions';
          } else if (trimmedLine !== '' && currentSection === 'subtopics') {
            subtopics.push(trimmedLine);
          } else if (trimmedLine !== '' && currentSection === 'questions') {
            questions.push(trimmedLine);
          }
        }
        
        return { subtopics, questions };
      };
      
      try {
        const newContent = {
          executiveSummary: parseSection(sections[0]),
          businessOverview: parseSection(sections[1]),
          marketAnalysis: parseSection(sections[2]),
          productsServices: parseSection(sections[3]),
          businessModel: parseSection(sections[4]),
          gtm: parseSection(sections[5]),
          executionPlan: parseSection(sections[6]),
          team: parseSection(sections[7]),
          financialPlan: parseSection(sections[8]),
          riskAnalysis: parseSection(sections[9])
        };
        
        return newContent;
      } catch (error) {
        console.error('Error parsing business plan text:', error);
        return null;
      }
    }
    return null;
  };

  // Generate full data analysis text for editing
  const generateFullDataAnalysisText = () => {
    let fullText = '';
    
    // Phase 1 Flow Spec
    fullText += 'Phase 1 — Flow Spec (Refined)\n\n';
    fullText += dataAnalysisContent.phase1FlowSpec + '\n\n\n';
    
    // Challenge Improvements
    fullText += 'Challenge Improvements (Guardrails)\n\n';
    fullText += dataAnalysisContent.challengeImprovements + '\n\n\n';
    
    // Ready to Paste Build Prompt
    fullText += 'Ready-to-Paste Build Prompt (Cursor/Claude)\n\n';
    fullText += dataAnalysisContent.readyToPasteBuildPrompt + '\n\n';
    
    return fullText;
  };

  // Parse data analysis text back into structured data
  const parseDataAnalysisText = (text: string) => {
    const sections = text.split(/(?:Phase 1 — Flow Spec \(Refined\)|Challenge Improvements \(Guardrails\)|Ready-to-Paste Build Prompt \(Cursor\/Claude\))/);
    
    if (sections.length >= 4) {
      const newContent = {
        phase1FlowSpec: sections[1]?.trim() || '',
        challengeImprovements: sections[2]?.trim() || '',
        readyToPasteBuildPrompt: sections[3]?.trim() || ''
      };
      
      setDataAnalysisContent(newContent);
    }
  };

  // Generate complete prompt text combining all content
  const generateCompletePromptText = () => {
    let completeText = '';
    
    // Data Prompt Content
    completeText += '=== PROMPT ===\n\n';
    completeText += dataPromptContent;
    completeText += '\n\n\n';
    
    // Business Plan Structure Content
    completeText += '=== BUSINESS PLAN STRUCTURE ===\n\n';
    completeText += editingBusinessPlanText || '';
    completeText += '\n\n\n';
    
    // User Raw Data Content
    completeText += '=== RAW DATA ===\n\n';
    
    // File contents
    if (fileContents.length > 0) {
      completeText += '--- FILE CONTENTS ---\n';
      fileContents.forEach((content, index) => {
        completeText += 'File ' + (index + 1) + ':\n' + content + '\n\n';
      });
    }
    
    // URL content
    if (urlContent) {
      completeText += '--- URL CONTENT ---\n';
      completeText += 'URL: ' + urlInput + '\n';
      completeText += 'Content: ' + urlContent + '\n\n';
    }
    
    // Text input
    if (textInput) {
      completeText += '--- TEXT INPUT ---\n';
      completeText += textInput + '\n\n';
    }
    
    // If no user data, show message
    if (fileContents.length === 0 && !urlContent && !textInput) {
      completeText += 'No user data available.\n';
    }
    
    return completeText;
  };



  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className={'text-3xl text-gray-900 ' + inter.className}>Feed</h1>
                  <p className={'text-gray-600 ' + inter.className}>Fresh start for business intelligence and insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className={'inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 ' + inter.className}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - User Inputs (25% width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className={'text-lg text-gray-900 mb-6 ' + inter.className}>Data Sources Feed</h2>
                
                {/* Upload Files */}
                <div className="mb-6">
                  <label className={'block text-sm text-gray-700 mb-2 ' + inter.className}>
                    Upload Files
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.csv"
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={'border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer block ' + (
                      fileInputs.length > 0 
                        ? 'border-green-400 bg-green-50 hover:border-green-500' 
                        : 'border-gray-300 hover:border-blue-400'
                    )}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className={'text-sm text-gray-600 ' + inter.className}>
                      Click to upload or drag and drop
                    </p>
                    <p className={'text-xs text-gray-500 mt-1 ' + inter.className}>PDF, DOC, TXT, CSV (max 10MB each)</p>
                    {fileInputs.length > 0 && (
                      <p className={'text-xs text-green-600 mt-1 ' + inter.className}>
                        {fileInputs.length} file{fileInputs.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </label>
                  
                  {/* File List */}
                  {fileInputs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className={'text-xs text-gray-600 ' + inter.className}>Uploaded files:</p>
                      {fileInputs.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className={'text-sm text-gray-700 ' + inter.className}>{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove file"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Link */}
                <div className="mb-6">
                  <label className={'block text-sm text-gray-700 mb-2 ' + inter.className}>
                    Add Link
                  </label>
                  <input
                    type="url"
                    placeholder="Enter URL..."
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      localStorage.setItem('urlInput', e.target.value);
                    }}
                    className={'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ' + inter.className}
                  />
                </div>

                {/* Add Text */}
                <div className="mb-6">
                  <label className={'block text-sm text-gray-700 mb-2 ' + inter.className}>
                    Add Text
                  </label>
                  <textarea
                    placeholder="Enter or paste text content..."
                    rows={4}
                    value={textInput}
                    onChange={(e) => {
                      setTextInput(e.target.value);
                      localStorage.setItem('textInput', e.target.value);
                    }}
                    className={'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm ' + inter.className}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-3">
                    {/* Clear Data Button */}
                    <button 
                      onClick={clearAllData}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal flex items-center justify-center hover:bg-gray-600 hover:shadow-lg transform hover:scale-105"
                    >
                      Clear
                    </button>
                    
                    {/* Process Data Button */}
                    <button 
                      onClick={handleProcessData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal flex items-center justify-center hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                    >
                      Process
                    </button>
                    
                    {/* Raw Data Button */}
                    <button 
                      onClick={handleDataButtonClick}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal hover:bg-orange-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                    >
                      Data
                    </button>
                  </div>
                </div>

                {/* Business Plan Structure Button */}
                <div className="mt-4">
                    <button 
                    onClick={handleBusinessPlanStructureClick}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal hover:bg-green-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                    >
                    Business Plan Structure
                    </button>
                </div>

                {/* Data Prompt Button */}
                <div className="mt-4">
                    <button 
                    onClick={handleDataPromptClick}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                    >
                    Data Prompt
                    </button>
                </div>



                {/* Complete Prompt Button */}
                <div className="mt-4">
                    <button 
                    onClick={handleCompletePromptClick}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal hover:bg-orange-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                    >
                    Complete Prompt
                    </button>
                </div>

                {/* AI Button */}
                <div className="mt-4">
                  <Link href="/analyze-data">
                    <button 
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                    >
                      AI
                    </button>
                  </Link>
                </div>

                {/* AI Results Viewer Button */}
                <div className="mt-4">
                  <button 
                    onClick={handleAIResultsClick}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md transition-all duration-200 text-sm font-normal hover:bg-teal-700 hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                  >
                    View AI Results
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Data Status (75% width) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className={'text-lg text-gray-900 mb-6 ' + inter.className}>Data Status</h2>

                {/* AI Analysis Status */}
                {hasAnalysis && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className={'text-green-800 font-semibold ' + inter.className}>
                        AI Analysis Results Available
                      </span>
                    </div>
                    <p className={'text-green-700 text-sm mt-1 ' + inter.className}>
                      Progress bars below show AI analysis completion for each topic. Overall progress: {aiAnalysisResult?.progress?.overall || 0}%
                    </p>
                  </div>
                )}

                {/* Data Status Components */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {[
                    { name: 'Executive Summary', href: '/executive-summary', key: 'executive-summary' },
                    { name: 'Business Overview', href: '/business-overview-data', key: 'business-overview' },
                    { name: 'Market Analysis', href: '/market-analysis', key: 'market-analysis' },
                    { name: 'Products & Services', href: '/products-services', key: 'products-services' },
                    { name: 'Business Model', href: '/business-model', key: 'business-model' },
                    { name: 'GTM', href: '/gtm', key: 'gtm' },
                    { name: 'Execution Plan', href: '/execution-plan', key: 'execution-plan' },
                    { name: 'Team', href: '/team', key: 'team' },
                    { name: 'Financial Plan', href: '/financial-plan', key: 'financial-plan' },
                    { name: 'Risk Analysis', href: '/risk-analysis', key: 'risk-analysis' }
                  ].map((topic) => {
                    // Calculate progress percentages based on AI analysis results
                    const topicProgress = hasAnalysis && aiAnalysisResult?.progress?.byTopic?.[topic.key] || 0;
                    
                    // Calculate individual progress bars
                    const userContentProgress = hasAnalysis ? Math.min(100, topicProgress * 0.4) : 0; // 40% of topic progress
                    const aiGeneratedProgress = hasAnalysis ? Math.min(100, topicProgress * 0.6) : 0; // 60% of topic progress
                    const aiOptimizedProgress = hasAnalysis ? Math.min(100, topicProgress * 0.8) : 0; // 80% of topic progress
                    
                    return (
                      <div key={topic.name} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <Link href={topic.href} className="block">
                          <h3 className={'text-sm text-gray-900 mb-3 ' + inter.className}>{topic.name}</h3>
                          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                                                          <p className={'text-xs text-blue-600 ' + inter.className}>Click to view details →</p>
                          </div>
                          
                          {/* Progress Bars */}
                          <div className="space-y-3">
                            {/* Completed Progress */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className={'text-gray-700 ' + inter.className}>Completed</span>
                                <span className={'text-gray-700 ' + inter.className}>{topicProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gray-600 h-2 rounded-full transition-all duration-500" style={{ width: topicProgress + '%' }}></div>
                              </div>
                            </div>
                            
                            {/* Combined Progress Bars */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="space-y-2">
                                {/* User Content Progress */}
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className={'text-blue-700 ' + inter.className}>User Content Completed</span>
                                    <span className={'text-blue-700 ' + inter.className}>{Math.round(userContentProgress)}%</span>
                                  </div>
                                  <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: userContentProgress + '%' }}></div>
                                  </div>
                                </div>
                                
                                {/* AI Generated Progress */}
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className={'text-blue-700 ' + inter.className}>AI Generated Completed</span>
                                    <span className={'text-blue-700 ' + inter.className}>{Math.round(aiGeneratedProgress)}%</span>
                                  </div>
                                  <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: aiGeneratedProgress + '%' }}></div>
                                  </div>
                                </div>
                                
                                {/* AI Optimized Progress */}
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className={'text-blue-700 ' + inter.className}>AI Optimized Completed</span>
                                    <span className={'text-blue-700 ' + inter.className}>{Math.round(aiOptimizedProgress)}%</span>
                                  </div>
                                  <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: aiOptimizedProgress + '%' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
         
      {/* Raw Data Modal */}
      {showRawDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                              <h2 className={'text-2xl text-gray-900 ' + inter.className}>User Provided Content</h2>
              <button
                onClick={() => setShowRawDataModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Files Section */}
                {fileContents.length > 0 && (
                  <div>
                    <h3 className={'text-lg text-gray-900 mb-3 ' + inter.className}>📁 Uploaded Files</h3>
                    <div className="space-y-4">
                      {fileContents.map((content, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <pre className={'text-sm text-gray-700 whitespace-pre-wrap ' + inter.className}>
                            {content}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* URL Section */}
                {urlInput && (
                  <div>
                    <h3 className={'text-lg text-gray-900 mb-3 ' + inter.className}>🔗 URL Content</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="mb-2">
                                                  <span className={'text-sm font-medium text-gray-600 ' + inter.className}>URL:</span>
                                                  <span className={'text-sm text-blue-600 ml-2 ' + inter.className}>{urlInput}</span>
                      </div>
                                              <div className={'text-sm text-gray-700 ' + inter.className}>
                        {urlContent || "Content from URL would be displayed here..."}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Text Input Section */}
                {textInput && (
                  <div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                              <pre className={'text-sm text-gray-700 whitespace-pre-wrap ' + inter.className}>
                        {textInput}
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* No Data Message */}
                {fileContents.length === 0 && !urlInput && !textInput && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className={'text-gray-500 ' + inter.className}>No user content provided yet</p>
                  </div>
                )}
              </div>
            </div>
               
            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRawDataModal(false)}
                className={'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ' + inter.className}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Plan Structure Modal */}
      {showBusinessPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className={'text-2xl text-gray-900 ' + inter.className}>Business Plan Structure</h2>
              <div className="flex items-center space-x-3">
                {!isEditingBusinessPlan ? (
                  <button
                    onClick={() => setIsEditingBusinessPlan(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        // Save the edited text to business plan content
                        const newContent = {
                          executiveSummary: { subtopics: [editingBusinessPlanText], questions: [] },
                          businessOverview: { subtopics: [], questions: [] },
                          marketAnalysis: { subtopics: [], questions: [] },
                          productsServices: { subtopics: [], questions: [] },
                          businessModel: { subtopics: [], questions: [] },
                          gtm: { subtopics: [], questions: [] },
                          executionPlan: { subtopics: [], questions: [] },
                          team: { subtopics: [], questions: [] },
                          financialPlan: { subtopics: [], questions: [] },
                          riskAnalysis: { subtopics: [], questions: [] }
                        };
                        setBusinessPlanContent(newContent);
                        localStorage.setItem('businessPlanContent', JSON.stringify(newContent));
                        setIsEditingBusinessPlan(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingBusinessPlan(false);
                        setEditingBusinessPlanText('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowBusinessPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {isEditingBusinessPlan ? (
                  <textarea
                    value={editingBusinessPlanText}
                    onChange={(e) => setEditingBusinessPlanText(e.target.value)}
                    className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[600px]"
                    placeholder="Enter your business plan structure content here..."
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {businessPlanContent.executiveSummary.subtopics.length > 0 ? (
                      <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono text-left">
                        {businessPlanContent.executiveSummary.subtopics[0]}
                      </div>
                    ) : (
                      "Content area is empty"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Prompt Modal */}
      {showDataPromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className={'text-2xl text-gray-900 ' + inter.className}>Data Prompt</h2>
              <div className="flex items-center space-x-3">
                {!isEditingDataPrompt ? (
                  <button
                    onClick={() => setIsEditingDataPrompt(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        // Save the edited text to data prompt content
                        setDataPromptContent(editingDataPromptText);
                        localStorage.setItem('dataPromptContent', editingDataPromptText);
                        setIsEditingDataPrompt(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDataPrompt(false);
                        setEditingDataPromptText('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowDataPromptModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {isEditingDataPrompt ? (
                  <textarea
                    value={editingDataPromptText}
                    onChange={(e) => setEditingDataPromptText(e.target.value)}
                    className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[600px]"
                    placeholder="Enter your data prompt content here..."
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {dataPromptContent ? (
                      <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono text-left">
                        {dataPromptContent}
                      </div>
                    ) : (
                      "Content area is empty"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Complete Prompt Modal */}
      {showCompletePromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className={'text-2xl text-gray-900 ' + inter.className}>Complete Prompt</h2>
              <button
                onClick={() => setShowCompletePromptModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <textarea
                  value={generateCompletePromptText()}
                  readOnly
                  className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 min-h-[600px] font-mono resize-none"
                />
              </div>
            </div>
               
            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCompletePromptModal(false)}
                className={'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ' + inter.className}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Results Modal */}
      {showAIResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className={'text-2xl text-gray-900 ' + inter.className}>AI Analysis Results</h2>
              <button
                onClick={() => setShowAIResultsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {!hasAnalysis ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className={'text-xl font-semibold text-gray-900 mb-2 ' + inter.className}>
                    No AI Analysis Results Available
                  </h3>
                  <p className={'text-gray-600 mb-6 ' + inter.className}>
                    Run AI analysis on the Analyze Data page to see results here.
                  </p>
                  <Link 
                    href="/analyze-data"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Go to Analyze Data
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Progress Summary */}
                  {aiAnalysisResult?.progress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className={'text-xl font-bold text-blue-900 mb-4 ' + inter.className}>
                        📊 Progress Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">{aiAnalysisResult.progress.overall}%</div>
                          <div className="text-sm text-blue-700">Overall Progress</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">{Object.keys(aiAnalysisResult.progress.byTopic || {}).length}</div>
                          <div className="text-sm text-blue-700">Topics Analyzed</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Results by Topic */}
                  {aiAnalysisResult?.analysis && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className={'text-xl font-bold text-green-900 mb-4 ' + inter.className}>
                        📋 Analysis Results by Topic
                      </h3>
                      <div className="space-y-6">
                        {Object.entries(aiAnalysisResult.analysis).map(([topicKey, topicData]: [string, any]) => (
                          <div key={topicKey} className="bg-white rounded-lg p-4 border border-green-200">
                            <h4 className={'text-lg font-semibold text-green-800 mb-3 ' + inter.className}>
                              {topicKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            {topicData.subtopics && (
                              <div className="space-y-3">
                                {Object.entries(topicData.subtopics).map(([subtopicKey, content]: [string, any]) => (
                                  <div key={subtopicKey} className="bg-gray-50 rounded-lg p-3 border">
                                    <h5 className={'text-sm font-semibold text-gray-700 mb-2 ' + inter.className}>
                                      {subtopicKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h5>
                                    <div className={'text-sm text-gray-600 ' + inter.className}>
                                      {content || "No content available"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unassigned Content */}
                  {aiAnalysisResult?.unassigned && aiAnalysisResult.unassigned.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className={'text-xl font-bold text-yellow-900 mb-4 ' + inter.className}>
                        ⚠️ Unassigned Content ({aiAnalysisResult.unassigned.length} items)
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysisResult.unassigned.map((item: any, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                            <div className={'text-sm text-gray-700 mb-2 ' + inter.className}>
                              <strong>Content:</strong> {item.content}
                            </div>
                            <div className={'text-xs text-gray-500 ' + inter.className}>
                              <strong>Reason:</strong> {item.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw JSON Data */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className={'text-xl font-bold text-gray-900 mb-4 ' + inter.className}>
                      🔧 Raw JSON Data
                    </h3>
                    <p className={'text-gray-600 mb-4 ' + inter.className}>
                      Complete raw data from OpenAI API response:
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className={'text-sm text-gray-700 whitespace-pre-wrap font-mono ' + inter.className}>
                        {JSON.stringify(aiAnalysisResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
               
            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAIResultsModal(false)}
                className={'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ' + inter.className}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
