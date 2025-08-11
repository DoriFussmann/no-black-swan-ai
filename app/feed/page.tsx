"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { useState, useEffect } from "react";

export default function FeedPage() {
  // Progress tracking state for each topic
  const [topicProgress, setTopicProgress] = useState({
    executiveSummary: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    businessOverview: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    marketAnalysis: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    productsServices: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    businessModel: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    gtmStrategy: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    operations: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    management: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    financialPlan: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
    riskAnalysis: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 }
  });

  // Data input states
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompanyPrompt, setShowCompanyPrompt] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('businessPlanProgress');
    const savedCompany = localStorage.getItem('currentCompany');
    
    if (savedProgress) {
      setTopicProgress(JSON.parse(savedProgress));
    }
    
    if (savedCompany) {
      setCompanyName(savedCompany);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('businessPlanProgress', JSON.stringify(topicProgress));
  }, [topicProgress]);

  // Save company name to localStorage
  useEffect(() => {
    if (companyName) {
      localStorage.setItem('currentCompany', companyName);
    }
  }, [companyName]);

  // Clear all data function
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('businessPlanProgress');
      localStorage.removeItem('currentCompany');
      localStorage.removeItem('businessPlanData');
      setTopicProgress({
        executiveSummary: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        businessOverview: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        marketAnalysis: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        productsServices: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        businessModel: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        gtmStrategy: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        operations: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        management: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        financialPlan: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 },
        riskAnalysis: { total: 0, userShared: 0, aiModified: 0, userConfirmed: 0 }
      });
      setCompanyName("");
      setFileInput(null);
      setUrlInput("");
      setTextInput("");
    }
  };

  // Enhanced content analysis function to determine which questions are answered
  const processDataFeed = (text: string) => {
    const questionsAnswered = {
      executiveSummary: 0,
      businessOverview: 0,
      marketAnalysis: 0,
      productsServices: 0,
      businessModel: 0,
      gtmStrategy: 0,
      operations: 0,
      management: 0,
      financialPlan: 0,
      riskAnalysis: 0
    };

    const textLower = text.toLowerCase();

    // Helper function to check for multiple keywords in context
    const hasContext = (sentence: string, keywords: string[], requiredCount: number = 1) => {
      const found = keywords.filter(keyword => sentence.includes(keyword));
      return found.length >= requiredCount;
    };

    // Helper function to check for financial patterns
    const hasFinancialData = (text: string) => {
      const moneyPatterns = /\$[\d,]+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:million|billion|k|m|b)|[\d,]+(?:\.\d{2})?\s*(?:dollars?|usd)/gi;
      const percentagePatterns = /\d+(?:\.\d+)?%/g;
      const datePatterns = /(?:20\d{2}|19\d{2})|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi;
      
      return moneyPatterns.test(text) || percentagePatterns.test(text) || datePatterns.test(text);
    };

    // Executive Summary Analysis (6 questions)
    let executiveSummaryScore = 0;
    
    // Company/Business identification
    if (hasContext(textLower, ['company', 'business', 'startup', 'enterprise', 'organization', 'corporation', 'inc', 'llc', 'ltd'])) {
      executiveSummaryScore++;
    }
    
    // Problem/Solution identification
    if (hasContext(textLower, ['problem', 'challenge', 'issue', 'pain point', 'need', 'gap']) && 
        hasContext(textLower, ['solution', 'solve', 'address', 'resolve', 'fix', 'answer'])) {
      executiveSummaryScore++;
    }
    
    // Market opportunity
    if (hasContext(textLower, ['market', 'opportunity', 'size', 'potential', 'demand', 'need']) && 
        hasFinancialData(text)) {
      executiveSummaryScore++;
    }
    
    // Milestones/Achievements
    if (hasContext(textLower, ['milestone', 'achievement', 'progress', 'launch', 'release', 'beta', 'mvp', 'prototype'])) {
      executiveSummaryScore++;
    }
    
    // Financial highlights
    if (hasContext(textLower, ['revenue', 'sales', 'profit', 'financial', 'earnings', 'income']) && 
        hasFinancialData(text)) {
      executiveSummaryScore++;
    }
    
    // Funding/Investment
    if (hasContext(textLower, ['funding', 'investment', 'capital', 'raise', 'series', 'round', 'investor'])) {
      executiveSummaryScore++;
    }
    
    questionsAnswered.executiveSummary = Math.min(executiveSummaryScore, 6);

    // Business Overview Analysis (6 questions)
    let businessOverviewScore = 0;
    
    // Legal structure
    if (hasContext(textLower, ['legal', 'incorporation', 'structure', 'entity', 'llc', 'inc', 'corporation', 'partnership'])) {
      businessOverviewScore++;
    }
    
    // Company history
    if (hasContext(textLower, ['history', 'evolution', 'founded', 'established', 'started', 'began', 'created'])) {
      businessOverviewScore++;
    }
    
    // Mission/Vision
    if (hasContext(textLower, ['mission', 'vision', 'purpose', 'goal', 'objective', 'aim', 'aspiration'])) {
      businessOverviewScore++;
    }
    
    // Competitive advantage
    if (hasContext(textLower, ['unique', 'different', 'advantage', 'competitive', 'distinctive', 'proprietary', 'patent'])) {
      businessOverviewScore++;
    }
    
    // Market timing
    if (hasContext(textLower, ['timing', 'moment', 'now', 'trend', 'wave', 'timing', 'opportunity'])) {
      businessOverviewScore++;
    }
    
    // Goals/Objectives
    if (hasContext(textLower, ['goal', 'objective', 'target', 'aim', 'plan', 'strategy', 'roadmap'])) {
      businessOverviewScore++;
    }
    
    questionsAnswered.businessOverview = Math.min(businessOverviewScore, 6);

    // Market Analysis Analysis (6 questions)
    let marketAnalysisScore = 0;
    
    // Industry/Sector
    if (hasContext(textLower, ['industry', 'sector', 'market', 'vertical', 'domain', 'field'])) {
      marketAnalysisScore++;
    }
    
    // Market segments
    if (hasContext(textLower, ['segment', 'geography', 'region', 'demographic', 'audience', 'customer type'])) {
      marketAnalysisScore++;
    }
    
    // Market size (TAM/SAM/SOM)
    if (hasContext(textLower, ['tam', 'sam', 'som', 'total addressable market', 'serviceable market', 'obtainable market']) && 
        hasFinancialData(text)) {
      marketAnalysisScore++;
    }
    
    // Market growth
    if (hasContext(textLower, ['growth', 'trend', 'projection', 'forecast', 'expansion', 'increase']) && 
        hasFinancialData(text)) {
      marketAnalysisScore++;
    }
    
    // Competition
    if (hasContext(textLower, ['competitor', 'competition', 'rival', 'alternative', 'substitute', 'player'])) {
      marketAnalysisScore++;
    }
    
    // Regulations
    if (hasContext(textLower, ['regulation', 'compliance', 'standard', 'requirement', 'policy', 'law'])) {
      marketAnalysisScore++;
    }
    
    questionsAnswered.marketAnalysis = Math.min(marketAnalysisScore, 6);

    // Products & Services Analysis (5 questions)
    let productsServicesScore = 0;
    
    // Product/Service description
    if (hasContext(textLower, ['product', 'service', 'offering', 'solution', 'platform', 'application', 'software'])) {
      productsServicesScore++;
    }
    
    // Features/Functionality
    if (hasContext(textLower, ['feature', 'functionality', 'capability', 'tool', 'component', 'module'])) {
      productsServicesScore++;
    }
    
    // IP/Patents
    if (hasContext(textLower, ['patent', 'trademark', 'intellectual property', 'ip', 'proprietary', 'exclusive'])) {
      productsServicesScore++;
    }
    
    // Pricing
    if (hasContext(textLower, ['pricing', 'cost', 'price', 'fee', 'subscription', 'license']) && 
        hasFinancialData(text)) {
      productsServicesScore++;
    }
    
    // Customer benefits
    if (hasContext(textLower, ['customer', 'user', 'client', 'benefit', 'value', 'advantage', 'improvement'])) {
      productsServicesScore++;
    }
    
    questionsAnswered.productsServices = Math.min(productsServicesScore, 5);

    // Business Model Analysis (4 questions)
    let businessModelScore = 0;
    
    // Revenue streams
    if (hasContext(textLower, ['revenue', 'monetization', 'income', 'stream', 'source', 'model']) && 
        hasFinancialData(text)) {
      businessModelScore++;
    }
    
    // Unit economics
    if (hasContext(textLower, ['cac', 'ltv', 'unit economics', 'customer acquisition cost', 'lifetime value', 'margin'])) {
      businessModelScore++;
    }
    
    // Scalability
    if (hasContext(textLower, ['scale', 'leverage', 'efficiency', 'automation', 'technology', 'platform'])) {
      businessModelScore++;
    }
    
    // Partnerships/Channels
    if (hasContext(textLower, ['partnership', 'channel', 'distribution', 'reseller', 'affiliate', 'ecosystem'])) {
      businessModelScore++;
    }
    
    questionsAnswered.businessModel = Math.min(businessModelScore, 4);

    // GTM Strategy Analysis (4 questions)
    let gtmStrategyScore = 0;
    
    // Target market
    if (hasContext(textLower, ['target', 'customer', 'audience', 'segment', 'demographic', 'persona'])) {
      gtmStrategyScore++;
    }
    
    // Marketing strategy
    if (hasContext(textLower, ['marketing', 'advertising', 'promotion', 'campaign', 'brand', 'awareness'])) {
      gtmStrategyScore++;
    }
    
    // Sales strategy
    if (hasContext(textLower, ['sales', 'selling', 'conversion', 'pipeline', 'funnel', 'lead'])) {
      gtmStrategyScore++;
    }
    
    // Customer retention
    if (hasContext(textLower, ['retention', 'loyalty', 'churn', 'engagement', 'satisfaction', 'support'])) {
      gtmStrategyScore++;
    }
    
    questionsAnswered.gtmStrategy = Math.min(gtmStrategyScore, 4);

    // Operations Analysis (4 questions)
    let operationsScore = 0;
    
    // Operational processes
    if (hasContext(textLower, ['operation', 'delivery', 'execution', 'process', 'workflow', 'procedure'])) {
      operationsScore++;
    }
    
    // Facilities/Locations
    if (hasContext(textLower, ['facility', 'location', 'office', 'warehouse', 'headquarters', 'premises'])) {
      operationsScore++;
    }
    
    // Technology/Infrastructure
    if (hasContext(textLower, ['technology', 'infrastructure', 'system', 'platform', 'software', 'hardware'])) {
      operationsScore++;
    }
    
    // Supply chain/Logistics
    if (hasContext(textLower, ['supply', 'logistics', 'distribution', 'inventory', 'procurement', 'vendor'])) {
      operationsScore++;
    }
    
    questionsAnswered.operations = Math.min(operationsScore, 4);

    // Management Analysis (4 questions)
    let managementScore = 0;
    
    // Team/Leadership
    if (hasContext(textLower, ['team', 'leadership', 'management', 'executive', 'founder', 'ceo', 'cto'])) {
      managementScore++;
    }
    
    // Advisors/Board
    if (hasContext(textLower, ['advisor', 'board', 'director', 'mentor', 'consultant', 'expert'])) {
      managementScore++;
    }
    
    // Hiring/Recruitment
    if (hasContext(textLower, ['hiring', 'recruitment', 'staff', 'employee', 'talent', 'position', 'role'])) {
      managementScore++;
    }
    
    // Culture/Values
    if (hasContext(textLower, ['culture', 'value', 'principle', 'ethos', 'environment', 'workplace'])) {
      managementScore++;
    }
    
    questionsAnswered.management = Math.min(managementScore, 4);

    // Financial Plan Analysis (4 questions)
    let financialPlanScore = 0;
    
    // Revenue projections
    if (hasContext(textLower, ['financial', 'revenue', 'profit', 'earnings', 'income', 'projection']) && 
        hasFinancialData(text)) {
      financialPlanScore++;
    }
    
    // Expenses/Costs
    if (hasContext(textLower, ['expense', 'cost', 'budget', 'spending', 'investment', 'outlay']) && 
        hasFinancialData(text)) {
      financialPlanScore++;
    }
    
    // Cash flow/Funding
    if (hasContext(textLower, ['cash flow', 'liquidity', 'funding', 'capital', 'financing', 'cash']) && 
        hasFinancialData(text)) {
      financialPlanScore++;
    }
    
    // Financial projections
    if (hasContext(textLower, ['projection', 'forecast', 'planning', 'estimate', 'budget', 'plan']) && 
        hasFinancialData(text)) {
      financialPlanScore++;
    }
    
    questionsAnswered.financialPlan = Math.min(financialPlanScore, 4);

    // Risk Analysis Analysis (3 questions)
    let riskAnalysisScore = 0;
    
    // Risk identification
    if (hasContext(textLower, ['risk', 'threat', 'vulnerability', 'challenge', 'obstacle', 'barrier'])) {
      riskAnalysisScore++;
    }
    
    // Risk mitigation
    if (hasContext(textLower, ['mitigation', 'strategy', 'plan', 'prevention', 'protection', 'safeguard'])) {
      riskAnalysisScore++;
    }
    
    // Risk monitoring
    if (hasContext(textLower, ['monitoring', 'warning', 'alert', 'tracking', 'surveillance', 'oversight'])) {
      riskAnalysisScore++;
    }
    
    questionsAnswered.riskAnalysis = Math.min(riskAnalysisScore, 3);

    return questionsAnswered;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  // Process data feed
  const handleFeedToData = async () => {
    if (!fileInput && !urlInput && !textInput.trim()) {
      alert('Please provide some data to process');
      return;
    }

    setIsProcessing(true);

    try {
      let dataText = "";

      // Extract text from different sources
      if (fileInput) {
        // Simulate file reading with more realistic content based on file type
        const fileExtension = fileInput.name.split('.').pop()?.toLowerCase();
        if (fileExtension === 'pdf') {
          dataText = `PDF Document: ${fileInput.name} - This document contains business information including company overview, market analysis, financial projections, and strategic planning data. The company operates in the technology sector with a focus on innovative solutions and has established partnerships with key industry players.`;
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
          dataText = `Word Document: ${fileInput.name} - Business plan document with comprehensive details about products, services, market opportunities, competitive analysis, and financial forecasts.`;
        } else if (fileExtension === 'txt') {
          dataText = `Text File: ${fileInput.name} - Business data and information extracted from the uploaded text document.`;
        } else if (fileExtension === 'csv') {
          dataText = `CSV File: ${fileInput.name} - Financial and operational data in structured format including revenue figures, customer metrics, and performance indicators.`;
        } else {
          dataText = `File: ${fileInput.name} - Business document containing relevant information for analysis.`;
        }
      }
      
      if (urlInput) {
        dataText += ` URL: ${urlInput} - Content from the provided URL.`;
      }
      
      if (textInput.trim()) {
        dataText += ` Text: ${textInput}`;
      }

      // Extract company name from data or prompt user
      let detectedCompany = companyName;
      if (!detectedCompany) {
        // Simple company name detection
        const companyKeywords = ['company', 'corporation', 'inc', 'llc', 'ltd', 'startup', 'business'];
        const words = dataText.split(' ');
        for (let i = 0; i < words.length - 1; i++) {
          if (companyKeywords.some(keyword => words[i].toLowerCase().includes(keyword))) {
            detectedCompany = words[i + 1];
            break;
          }
        }
      }

      if (!detectedCompany) {
        setShowCompanyPrompt(true);
        setIsProcessing(false);
        return;
      }

      setCompanyName(detectedCompany);

      // Process the data to determine which questions are answered
      const questionsAnswered = processDataFeed(dataText);

      // Calculate new progress percentages (assuming 6 questions per topic for now)
      const questionsPerTopic = 6;
      
      setTopicProgress(prev => {
        const newProgress = { ...prev };
        Object.keys(questionsAnswered).forEach(topic => {
          const topicKey = topic as keyof typeof newProgress;
          const answeredCount = questionsAnswered[topic as keyof typeof questionsAnswered];
          const newUserShared = Math.min(100, (answeredCount / questionsPerTopic) * 100);
          
          newProgress[topicKey] = {
            ...newProgress[topicKey],
            userShared: Math.max(newProgress[topicKey].userShared, newUserShared)
          };
        });
        return newProgress;
      });

              // Store the processed data
        const existingData = localStorage.getItem('businessPlanData');
        const dataToStore = {
          companyName: detectedCompany,
          timestamp: new Date().toISOString(),
          dataText: dataText,
          questionsAnswered: questionsAnswered
        };

        if (existingData) {
          try {
            const parsedData = JSON.parse(existingData);
            // Ensure parsedData is an array
            const dataArray = Array.isArray(parsedData) ? parsedData : [];
            dataArray.push(dataToStore);
            localStorage.setItem('businessPlanData', JSON.stringify(dataArray));
                  } catch {
          // If parsing fails, start fresh with the new data
          localStorage.setItem('businessPlanData', JSON.stringify([dataToStore]));
        }
        } else {
          localStorage.setItem('businessPlanData', JSON.stringify([dataToStore]));
        }

      // Clear inputs
      setFileInput(null);
      setUrlInput("");
      setTextInput("");

    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle company name prompt
  const handleCompanyNameSubmit = () => {
    if (companyName.trim()) {
      setShowCompanyPrompt(false);
      handleFeedToData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
                  <p className="text-gray-600">Real-time business intelligence and insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={clearAllData}
                  className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All Data
                </button>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Sources Feed</h2>
                
                {/* Upload File */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer block ${
                      fileInput 
                        ? 'border-green-400 bg-green-50 hover:border-green-500' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {fileInput ? (
                      <>
                        <svg className="w-8 h-8 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-green-700 font-medium">
                          {fileInput.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">File selected - ready to process</p>
                      </>
                    ) : (
                      <>
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, TXT, CSV (max 10MB)</p>
                      </>
                    )}
                  </label>
                  {fileInput && (
                    <button
                      onClick={() => setFileInput(null)}
                      className="mt-2 w-full px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      Remove File
                    </button>
                  )}
                </div>

                {/* Add Link */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Link
                  </label>
                  <input
                    type="url"
                    placeholder="Enter URL..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Add Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Text
                  </label>
                  <textarea
                    placeholder="Enter or paste text content..."
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Feed to Data Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button 
                    onClick={handleFeedToData}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Feed to Data"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Data Status (75% width) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Status</h2>
                
                {/* Business Plan Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Executive Summary */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Executive Summary</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.executiveSummary.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.executiveSummary.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.executiveSummary.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.executiveSummary.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Overview */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Business Overview</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.businessOverview.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.businessOverview.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.businessOverview.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.businessOverview.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Market Analysis</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products & Services */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Products & Services</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.productsServices.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.productsServices.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.productsServices.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.productsServices.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Model */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Business Model</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.businessModel.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.businessModel.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.businessModel.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.businessModel.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GTM Strategy */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Go-to-Market Strategy</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Execution Plan */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Execution Plan</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.operations.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.operations.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.operations.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.operations.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Team</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.management.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.management.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.management.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.management.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Plan */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Financial Plan</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.financialPlan.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.financialPlan.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.financialPlan.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.financialPlan.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Analysis */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Risk Analysis</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.total.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Shared</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.userShared.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.userShared}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Modified</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.aiModified.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.aiModified}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.userConfirmed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Company Name Prompt Modal */}
      {showCompanyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Name Required</h3>
            <p className="text-gray-600 mb-4">Please provide the company name for this data feed:</p>
            <input
              type="text"
              placeholder="Enter company name..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCompanyPrompt(false);
                  setIsProcessing(false);
                  setCompanyName("");
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompanyNameSubmit}
                disabled={!companyName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
