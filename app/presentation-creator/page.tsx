"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Topic {
  id: string;
  title: string;
  progress: number;
  summary: string;
}

interface Question {
  id: string;
  text: string;
  example: string;
  answer: string;
}

interface TopicQuestions {
  [key: string]: Question[];
}

export default function PresentationCreator() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hasLoadedFromBP, setHasLoadedFromBP] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([
    { id: "company-purpose", title: "Company Purpose", progress: 0, summary: "" },
    { id: "problem", title: "Problem", progress: 0, summary: "" },
    { id: "solution", title: "Solution", progress: 0, summary: "" },
    { id: "why-now", title: "Why Now", progress: 0, summary: "" },
    { id: "market-size", title: "Market Size", progress: 0, summary: "" },
    { id: "competition", title: "Competition", progress: 0, summary: "" },
    { id: "product", title: "Product", progress: 0, summary: "" },
    { id: "business-model", title: "Business Model", progress: 0, summary: "" },
    { id: "team", title: "Team", progress: 0, summary: "" },
    { id: "financials", title: "Financials", progress: 0, summary: "" }
  ]);

  // Sample questions for each topic
  const [topicQuestions, setTopicQuestions] = useState<TopicQuestions>({
    "company-purpose": [
      {
        id: "company-name",
        text: "What is your company name?",
        example: "Example: TechFlow Solutions Inc.",
        answer: ""
      },
      {
        id: "mission",
        text: "What is your company's mission statement?",
        example: "Example: To empower small businesses with affordable, easy-to-use technology solutions.",
        answer: ""
      },
      {
        id: "vision",
        text: "What is your company's vision for the future?",
        example: "Example: To become the leading platform for small business digital transformation.",
        answer: ""
      }
    ],
    "problem": [
      {
        id: "problem-description",
        text: "What problem does your product/service solve?",
        example: "Example: Small businesses struggle to manage their projects efficiently due to complex and expensive tools.",
        answer: ""
      },
      {
        id: "pain-points",
        text: "What are the main pain points your customers face?",
        example: "Example: High costs, steep learning curves, and lack of integration with existing tools.",
        answer: ""
      }
    ],
    "solution": [
      {
        id: "solution-description",
        text: "How does your product/service solve the problem?",
        example: "Example: We provide an intuitive, affordable project management platform designed specifically for small businesses.",
        answer: ""
      },
      {
        id: "unique-approach",
        text: "What makes your solution unique?",
        example: "Example: Our AI-powered automation reduces manual work by 70% compared to competitors.",
        answer: ""
      }
    ],
    "why-now": [
      {
        id: "timing",
        text: "Why is now the right time for your solution?",
        example: "Example: The remote work trend has created unprecedented demand for simple, effective collaboration tools.",
        answer: ""
      },
      {
        id: "market-trends",
        text: "What market trends support your timing?",
        example: "Example: 73% of companies plan to maintain remote work policies, driving demand for better tools.",
        answer: ""
      }
    ],
    "market-size": [
      {
        id: "target-market",
        text: "Who is your target market?",
        example: "Example: Small to medium-sized businesses (10-500 employees) in the technology sector.",
        answer: ""
      },
      {
        id: "market-value",
        text: "What is the estimated market size?",
        example: "Example: The global SaaS market is valued at $195 billion with 20% annual growth.",
        answer: ""
      }
    ],
    "competition": [
      {
        id: "competitors",
        text: "Who are your main competitors?",
        example: "Example: Asana, Trello, and Monday.com are our primary competitors.",
        answer: ""
      },
      {
        id: "competitive-advantage",
        text: "What is your competitive advantage?",
        example: "Example: We offer 50% lower pricing with superior AI features and better customer support.",
        answer: ""
      }
    ],
    "product": [
      {
        id: "product-description",
        text: "What is your main product or service?",
        example: "Example: Cloud-based project management software with team collaboration features.",
        answer: ""
      },
      {
        id: "key-features",
        text: "What are the key features of your product?",
        example: "Example: Real-time collaboration, AI task prioritization, and seamless integrations.",
        answer: ""
      }
    ],
    "business-model": [
      {
        id: "revenue-model",
        text: "How do you make money?",
        example: "Example: Freemium model with premium tiers starting at $29/month per user.",
        answer: ""
      },
      {
        id: "pricing-strategy",
        text: "What is your pricing strategy?",
        example: "Example: We offer a free tier for up to 5 users, with paid plans starting at $29/month.",
        answer: ""
      }
    ],
    "team": [
      {
        id: "team-overview",
        text: "Who are the key members of your team?",
        example: "Example: Our CEO has 15 years in SaaS, CTO from Google, and CMO from HubSpot.",
        answer: ""
      },
      {
        id: "team-expertise",
        text: "What expertise does your team bring?",
        example: "Example: Combined 50+ years in software development, marketing, and business development.",
        answer: ""
      }
    ],
    "financials": [
      {
        id: "revenue-projection",
        text: "What are your revenue projections?",
        example: "Example: We project $2M ARR in year 1, growing to $10M by year 3.",
        answer: ""
      },
      {
        id: "funding-needs",
        text: "How much funding are you seeking?",
        example: "Example: We're raising $5M Series A to scale our team and accelerate product development.",
        answer: ""
      }
    ]
  });

  const overallProgress = Math.round(topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length);
  const allTopicsComplete = topics.every(topic => topic.progress === 100);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('presentationData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTopics(data.topics || topics);
        setTopicQuestions(data.topicQuestions || topicQuestions);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Autosave functionality
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('presentationData', JSON.stringify({
        topics,
        topicQuestions
      }));
    };

    // Autosave every 30 seconds
    const interval = setInterval(saveData, 30000);
    return () => clearInterval(interval);
  }, [topics, topicQuestions]);

  // Keyboard navigation for slideshow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSummary) return;
      
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        handleBackToCreator();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSummary, currentSlideIndex]);

  const renderProgressDonut = (progress: number, size: "sm" | "md" = "md") => {
    const radius = size === "sm" ? 12 : 16;
    const strokeWidth = size === "sm" ? 2 : 3;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <svg className="transform -rotate-90" width={size === "sm" ? 28 : 36} height={size === "sm" ? 28 : 36} aria-hidden="true">
          {/* Background circle */}
          <circle
            cx={size === "sm" ? 14 : 18}
            cy={size === "sm" ? 14 : 18}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size === "sm" ? 14 : 18}
            cy={size === "sm" ? 14 : 18}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-600 transition-all duration-300"
            style={{ strokeLinecap: 'round' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-medium ${size === "sm" ? "text-xs" : "text-sm"}`}>
            {progress}%
          </span>
        </div>
      </div>
    );
  };

  const handleTopicSelection = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
    setIsEditing(false);
  };

  const getSelectedTopicSummary = () => {
    if (!selectedTopic) return "";
    const topic = topics.find(t => t.id === selectedTopic);
    return topic?.summary || "";
  };

  const getCurrentQuestion = () => {
    if (!selectedTopic || !topicQuestions[selectedTopic]) return null;
    return topicQuestions[selectedTopic][currentQuestionIndex];
  };

  const handleAnswerChange = (answer: string) => {
    if (!selectedTopic || !topicQuestions[selectedTopic]) return;
    
    const updatedQuestions = { ...topicQuestions };
    updatedQuestions[selectedTopic][currentQuestionIndex].answer = answer;
    setTopicQuestions(updatedQuestions);
  };

  const generateTopicSummary = (topicId: string) => {
    const questions = topicQuestions[topicId];
    if (!questions) return "";

    const answeredQuestions = questions.filter(q => q.answer.trim());
    if (answeredQuestions.length === 0) return "";

    // Generate a professional summary based on the topic
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return "";

    switch (topicId) {
      case "company-purpose":
        const companyName = questions.find(q => q.id === "company-name")?.answer || "Your Company";
        const mission = questions.find(q => q.id === "mission")?.answer || "your mission";
        const vision = questions.find(q => q.id === "vision")?.answer || "your vision";
        return `${companyName} is dedicated to ${mission}. Our vision is ${vision}.`;
      
      case "problem":
        const problemDesc = questions.find(q => q.id === "problem-description")?.answer || "the problem";
        const painPoints = questions.find(q => q.id === "pain-points")?.answer || "pain points";
        return `The problem we solve is ${problemDesc}. Key pain points include ${painPoints}.`;
      
      case "solution":
        const solutionDesc = questions.find(q => q.id === "solution-description")?.answer || "our solution";
        const uniqueApproach = questions.find(q => q.id === "unique-approach")?.answer || "our unique approach";
        return `Our solution ${solutionDesc}. What makes us unique is ${uniqueApproach}.`;
      
      case "why-now":
        const timing = questions.find(q => q.id === "timing")?.answer || "the timing";
        const marketTrends = questions.find(q => q.id === "market-trends")?.answer || "market trends";
        return `Now is the right time because ${timing}. Market trends show ${marketTrends}.`;
      
      case "market-size":
        const targetMarket = questions.find(q => q.id === "target-market")?.answer || "your target market";
        const marketValue = questions.find(q => q.id === "market-value")?.answer || "significant market opportunity";
        return `Our target market consists of ${targetMarket}. The market size represents ${marketValue}.`;
      
      case "competition":
        const competitors = questions.find(q => q.id === "competitors")?.answer || "competitors";
        const competitiveAdvantage = questions.find(q => q.id === "competitive-advantage")?.answer || "our competitive advantage";
        return `Our main competitors are ${competitors}. Our competitive advantage is ${competitiveAdvantage}.`;
      
      case "product":
        const productDesc = questions.find(q => q.id === "product-description")?.answer || "our product";
        const keyFeatures = questions.find(q => q.id === "key-features")?.answer || "key features";
        return `Our main product is ${productDesc}. Key features include ${keyFeatures}.`;
      
      case "business-model":
        const revenueModel = questions.find(q => q.id === "revenue-model")?.answer || "our revenue model";
        const pricingStrategy = questions.find(q => q.id === "pricing-strategy")?.answer || "our pricing strategy";
        return `We make money through ${revenueModel}. Our pricing strategy is ${pricingStrategy}.`;
      
      case "team":
        const teamOverview = questions.find(q => q.id === "team-overview")?.answer || "our team";
        const teamExpertise = questions.find(q => q.id === "team-expertise")?.answer || "our expertise";
        return `Our key team members include ${teamOverview}. Our expertise includes ${teamExpertise}.`;
      
      case "financials":
        const revenueProjection = questions.find(q => q.id === "revenue-projection")?.answer || "our revenue projections";
        const fundingNeeds = questions.find(q => q.id === "funding-needs")?.answer || "our funding needs";
        return `Our revenue projections show ${revenueProjection}. We are seeking ${fundingNeeds}.`;
      
      default:
        return "Summary generated based on your responses.";
    }
  };

  const updateTopicProgress = (topicId: string) => {
    const questions = topicQuestions[topicId];
    if (!questions) return;

    const answeredQuestions = questions.filter(q => q.answer.trim());
    const progress = Math.round((answeredQuestions.length / questions.length) * 100);

    setTopics(prevTopics => 
      prevTopics.map(topic => 
        topic.id === topicId 
          ? { ...topic, progress, summary: progress === 100 ? generateTopicSummary(topicId) : topic.summary }
          : topic
      )
    );
  };

  const handleSubmit = async () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    setIsSubmitting(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Update progress for the current topic
      updateTopicProgress(selectedTopic!);
      
      // Move to next question or complete topic
      if (currentQuestionIndex < topicQuestions[selectedTopic!].length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Topic completed
        setCurrentQuestionIndex(0);
        setSelectedTopic(null);
        setIsEditing(false);
      }
    }, 1500);
  };

  const handleUseDefault = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    handleAnswerChange(currentQuestion.example.replace("Example: ", ""));
    handleSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEditTopic = () => {
    if (!selectedTopic) return;
    setIsEditing(true);
    setCurrentQuestionIndex(0);
  };

  const handleShowPresentationSummary = () => {
    setShowSummary(true);
    setCurrentSlideIndex(0);
  };

  const handleBackToCreator = () => {
    setShowSummary(false);
  };

  const handleNextSlide = () => {
    const completedTopics = topics.filter(topic => topic.progress === 100);
    if (currentSlideIndex < completedTopics.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    alert("PDF export functionality coming soon!");
  };

  const handleExportPPT = () => {
    // TODO: Implement PPT export functionality
    alert("PowerPoint export functionality coming soon!");
  };

  const handleSendEmail = () => {
    // TODO: Implement email functionality
    alert("Email functionality coming soon!");
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      // Reset all topics to initial state
      setTopics([
        { id: "company-purpose", title: "Company Purpose", progress: 0, summary: "" },
        { id: "problem", title: "Problem", progress: 0, summary: "" },
        { id: "solution", title: "Solution", progress: 0, summary: "" },
        { id: "why-now", title: "Why Now", progress: 0, summary: "" },
        { id: "market-size", title: "Market Size", progress: 0, summary: "" },
        { id: "competition", title: "Competition", progress: 0, summary: "" },
        { id: "product", title: "Product", progress: 0, summary: "" },
        { id: "business-model", title: "Business Model", progress: 0, summary: "" },
        { id: "team", title: "Team", progress: 0, summary: "" },
        { id: "financials", title: "Financials", progress: 0, summary: "" }
      ]);

      // Reset all questions to empty answers
      const resetQuestions = { ...topicQuestions };
      Object.keys(resetQuestions).forEach(topicId => {
        resetQuestions[topicId] = resetQuestions[topicId].map(question => ({
          ...question,
          answer: ""
        }));
      });
      setTopicQuestions(resetQuestions);

      // Reset UI state
      setSelectedTopic(null);
      setCurrentQuestionIndex(0);
      setIsEditing(false);
      setShowSummary(false);
      setCurrentSlideIndex(0);
      setHasLoadedFromBP(false);

      // Clear localStorage
      localStorage.removeItem('presentationData');
    }
  };

  const handleLoadDefaults = () => {
    if (window.confirm("Load default example data? This will replace your current answers.")) {
      // Load default answers for all questions
      const defaultQuestions = { ...topicQuestions };
      Object.keys(defaultQuestions).forEach(topicId => {
        defaultQuestions[topicId] = defaultQuestions[topicId].map(question => ({
          ...question,
          answer: question.example.replace("Example: ", "")
        }));
      });
      setTopicQuestions(defaultQuestions);

      // Update all topics to 100% progress with summaries
      const updatedTopics = topics.map(topic => ({
        ...topic,
        progress: 100,
        summary: generateTopicSummary(topic.id)
      }));
      setTopics(updatedTopics);

      // Reset UI state
      setSelectedTopic(null);
      setCurrentQuestionIndex(0);
      setIsEditing(false);
      setShowSummary(false);
      setCurrentSlideIndex(0);
    }
  };

  const handleGetFromBP = () => {
    // Check if business plan data exists
    const bpData = localStorage.getItem('businessPlanData');
    if (!bpData) {
      alert("No business plan data found. Please complete the Business Plan Compiler first.");
      return;
    }

    try {
      const bp = JSON.parse(bpData);
      
      // Map business plan data to presentation questions
      const bpQuestions = { ...topicQuestions };
      
      // Company Purpose mapping
      if (bp.companyName) {
        const companyNameQuestion = bpQuestions["company-purpose"].find(q => q.id === "company-name");
        if (companyNameQuestion) companyNameQuestion.answer = bp.companyName;
      }
      if (bp.mission) {
        const missionQuestion = bpQuestions["company-purpose"].find(q => q.id === "mission");
        if (missionQuestion) missionQuestion.answer = bp.mission;
      }
      if (bp.vision) {
        const visionQuestion = bpQuestions["company-purpose"].find(q => q.id === "vision");
        if (visionQuestion) visionQuestion.answer = bp.vision;
      }

      // Problem mapping
      if (bp.problem) {
        const problemQuestion = bpQuestions["problem"].find(q => q.id === "problem-description");
        if (problemQuestion) problemQuestion.answer = bp.problem;
      }
      if (bp.painPoints) {
        const painPointsQuestion = bpQuestions["problem"].find(q => q.id === "pain-points");
        if (painPointsQuestion) painPointsQuestion.answer = bp.painPoints;
      }

      // Solution mapping
      if (bp.solution) {
        const solutionQuestion = bpQuestions["solution"].find(q => q.id === "solution-description");
        if (solutionQuestion) solutionQuestion.answer = bp.solution;
      }
      if (bp.uniqueValue) {
        const uniqueQuestion = bpQuestions["solution"].find(q => q.id === "unique-approach");
        if (uniqueQuestion) uniqueQuestion.answer = bp.uniqueValue;
      }

      // Why Now mapping
      if (bp.timing) {
        const timingQuestion = bpQuestions["why-now"].find(q => q.id === "timing");
        if (timingQuestion) timingQuestion.answer = bp.timing;
      }
      if (bp.marketTrends) {
        const trendsQuestion = bpQuestions["why-now"].find(q => q.id === "market-trends");
        if (trendsQuestion) trendsQuestion.answer = bp.marketTrends;
      }

      // Market Size mapping
      if (bp.targetMarket) {
        const targetQuestion = bpQuestions["market-size"].find(q => q.id === "target-market");
        if (targetQuestion) targetQuestion.answer = bp.targetMarket;
      }
      if (bp.marketSize) {
        const sizeQuestion = bpQuestions["market-size"].find(q => q.id === "market-value");
        if (sizeQuestion) sizeQuestion.answer = bp.marketSize;
      }

      // Competition mapping
      if (bp.competitors) {
        const competitorsQuestion = bpQuestions["competition"].find(q => q.id === "competitors");
        if (competitorsQuestion) competitorsQuestion.answer = bp.competitors;
      }
      if (bp.competitiveAdvantage) {
        const advantageQuestion = bpQuestions["competition"].find(q => q.id === "competitive-advantage");
        if (advantageQuestion) advantageQuestion.answer = bp.competitiveAdvantage;
      }

      // Product mapping
      if (bp.product) {
        const productQuestion = bpQuestions["product"].find(q => q.id === "product-description");
        if (productQuestion) productQuestion.answer = bp.product;
      }
      if (bp.features) {
        const featuresQuestion = bpQuestions["product"].find(q => q.id === "key-features");
        if (featuresQuestion) featuresQuestion.answer = bp.features;
      }

      // Business Model mapping
      if (bp.revenueModel) {
        const revenueQuestion = bpQuestions["business-model"].find(q => q.id === "revenue-model");
        if (revenueQuestion) revenueQuestion.answer = bp.revenueModel;
      }
      if (bp.pricing) {
        const pricingQuestion = bpQuestions["business-model"].find(q => q.id === "pricing-strategy");
        if (pricingQuestion) pricingQuestion.answer = bp.pricing;
      }

      // Team mapping
      if (bp.team) {
        const teamQuestion = bpQuestions["team"].find(q => q.id === "team-overview");
        if (teamQuestion) teamQuestion.answer = bp.team;
      }
      if (bp.expertise) {
        const expertiseQuestion = bpQuestions["team"].find(q => q.id === "team-expertise");
        if (expertiseQuestion) expertiseQuestion.answer = bp.expertise;
      }

      // Financials mapping
      if (bp.revenueProjections) {
        const revenueQuestion = bpQuestions["financials"].find(q => q.id === "revenue-projection");
        if (revenueQuestion) revenueQuestion.answer = bp.revenueProjections;
      }
      if (bp.fundingNeeds) {
        const fundingQuestion = bpQuestions["financials"].find(q => q.id === "funding-needs");
        if (fundingQuestion) fundingQuestion.answer = bp.fundingNeeds;
      }

      setTopicQuestions(bpQuestions);

      // Update all topics to 100% progress with summaries
      const updatedTopics = topics.map(topic => ({
        ...topic,
        progress: 100,
        summary: generateTopicSummary(topic.id)
      }));
      setTopics(updatedTopics);

      // Mark as loaded from BP
      setHasLoadedFromBP(true);

      // Reset UI state
      setSelectedTopic(null);
      setCurrentQuestionIndex(0);
      setIsEditing(false);
      setShowSummary(false);
      setCurrentSlideIndex(0);

      alert("Successfully loaded data from Business Plan!");
    } catch (error) {
      console.error('Error loading business plan data:', error);
      alert("Error loading business plan data. Please try again.");
    }
  };

  const renderChatInterface = () => {
    if (!selectedTopic) {
      return (
        <div className="text-center text-gray-500" role="status" aria-live="polite">
          <p>Select a topic to begin building your presentation</p>
        </div>
      );
    }

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    return (
      <div className="space-y-6">
        {/* Question */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isEditing ? "Editing: " : ""}Question {currentQuestionIndex + 1} of {topicQuestions[selectedTopic].length}
          </h3>
          <p className="text-gray-700 mb-4">{currentQuestion.text}</p>
          
          {/* Example */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4" role="note" aria-label="Example answer">
            <p className="text-sm text-blue-800 font-medium">Example:</p>
            <p className="text-sm text-blue-700">{currentQuestion.example}</p>
          </div>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <label htmlFor="answer-input" className="sr-only">
            Type your answer here
          </label>
          <textarea
            id="answer-input"
            value={currentQuestion.answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            aria-describedby="submit-hint"
          />
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentQuestion.answer.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label={isSubmitting ? "Processing your answer" : "Submit your answer"}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                  Processing...
                </div>
              ) : (
                "Submit"
              )}
            </button>
            
            <button
              onClick={handleUseDefault}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Use default example answer"
            >
              Proceed with default
            </button>
          </div>
          
          <p id="submit-hint" className="text-xs text-gray-500 text-center">
            Press Ctrl+Enter to submit
          </p>
        </div>
      </div>
    );
  };

  const renderSlidePreview = () => {
    if (!selectedTopic) {
      return (
        <div className="text-gray-500 text-center" role="status" aria-live="polite">
          <p>Select a topic to view its slide preview</p>
        </div>
      );
    }

    const topic = topics.find(t => t.id === selectedTopic);
    const summary = getSelectedTopicSummary();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-gray-900">
            {topic?.title}
          </h5>
          {topic?.progress === 100 && (
            <button 
              onClick={handleEditTopic}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              aria-label={`Edit ${topic.title} content`}
            >
              Edit
            </button>
          )}
        </div>
        
        {/* Slide Preview */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Slide Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h3 className="text-white font-bold text-lg">{topic?.title}</h3>
          </div>
          
          {/* Slide Content */}
          <div className="p-6">
            {summary ? (
              <div className="space-y-4">
                <div className="text-gray-700 leading-relaxed">
                  {summary}
                </div>
                
                {/* Progress indicator */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={topic?.progress || 0} aria-valuemin={0} aria-valuemax={100}>
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${topic?.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{topic?.progress || 0}% complete</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm">No content available yet</p>
                <p className="text-xs text-gray-400 mt-1">Complete this topic to generate slide content</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Slide Actions */}
        {summary && (
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
              Preview Full Slide
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
              Customize Design
            </button>
          </div>
        )}
      </div>
    );
  };

  // Full Presentation Summary Screen
  if (showSummary) {
    const completedTopics = topics.filter(topic => topic.progress === 100);
    const currentSlide = completedTopics[currentSlideIndex];

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-4">
                  <Image
                    src="/next.svg"
                    alt="Next.js logo"
                    width={120}
                    height={25}
                    className="dark:invert"
                    priority
                  />
                  <span className="text-2xl font-bold text-white">NBS AI Platform</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToCreator}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                  aria-label="Return to presentation creator"
                >
                  Back to Creator
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  aria-label="Go to home page"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Slideshow */}
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-4xl mx-auto px-6">
            {/* Slide Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Previous slide"
              >
                Previous
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Slide {currentSlideIndex + 1} of {completedTopics.length}</h2>
                <p className="text-gray-300">{currentSlide?.title}</p>
              </div>
              
              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === completedTopics.length - 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Next slide"
              >
                Next
              </button>
            </div>

            {/* Current Slide */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Slide Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h1 className="text-white font-bold text-3xl">{currentSlide?.title}</h1>
              </div>
              
              {/* Slide Content */}
              <div className="p-8">
                <div className="text-gray-800 text-lg leading-relaxed">
                  {currentSlide?.summary || "No content available"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleExportPDF}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                aria-label="Export presentation to PDF"
              >
                Export to PDF
              </button>
              <button
                onClick={handleExportPPT}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                aria-label="Export presentation to PowerPoint"
              >
                Export to PPT
              </button>
              <button
                onClick={handleSendEmail}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                aria-label="Send presentation via email"
              >
                Send via Email
              </button>
              <button
                onClick={handleBackToCreator}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                aria-label="Edit presentation"
              >
                Edit
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                aria-label="Go to home page"
              >
                Home
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800/50 border-t border-gray-700/50 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Image
                  src="/next.svg"
                  alt="Next.js logo"
                  width={100}
                  height={20}
                  className="dark:invert"
                />
                <span className="text-gray-300">© 2024 NBS AI Platform. All rights reserved.</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <Image
                  src="/next.svg"
                  alt="Next.js logo"
                  width={120}
                  height={25}
                  priority
                />
                <span className="text-2xl font-bold text-gray-900">NBS AI Platform</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                Home
              </Link>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 flex max-w-[1200px] mx-auto">
        {/* Left Column - Chat Zone (50% width) */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Presentation Creator</h2>
                <p className="text-gray-600 mt-2">Interactive chat to build your pitch deck</p>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                    aria-label="Go to home page"
                  >
                    Home
                  </button>
                  <button
                    onClick={handleResetAll}
                    disabled={hasLoadedFromBP}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                    aria-label="Reset all progress"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={handleLoadDefaults}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium"
                    aria-label="Load default examples"
                  >
                    Load Defaults
                  </button>
                  <button
                    onClick={handleGetFromBP}
                    disabled={hasLoadedFromBP}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      hasLoadedFromBP 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                    aria-label={hasLoadedFromBP ? "Already loaded from Business Plan" : "Load from Business Plan"}
                  >
                    {hasLoadedFromBP ? "Loaded from BP" : "Get from BP"}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 p-6">
              <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200 overflow-y-auto">
                {renderChatInterface()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Topics (50% width) */}
        <div className="w-full lg:w-1/2 bg-white">
          <div className="h-full flex flex-col">
            {/* Topics Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pitch Deck Topics</h3>
                  <p className="text-gray-600 mt-1">Complete each section to build your presentation</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  {renderProgressDonut(overallProgress, "sm")}
                </div>
              </div>
            </div>
            
            {/* Topics List */}
            <div className="flex-1 p-6">
              <div className="space-y-3" role="list" aria-label="Presentation topics">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelection(topic.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedTopic === topic.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-pressed={selectedTopic === topic.id}
                    aria-label={`${topic.title}, ${topic.progress}% complete`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {renderProgressDonut(topic.progress, "sm")}
                        </div>
                        <span className="font-medium text-gray-900">{topic.title}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {topic.progress}% complete
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary of Presentation Button */}
              {allTopicsComplete && (
                <div className="mt-6">
                  <button
                    onClick={handleShowPresentationSummary}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
                    aria-label="View complete presentation summary"
                  >
                    Summary of Presentation
                  </button>
                </div>
              )}
            </div>

            {/* Summary Area */}
            <div className="p-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Slide Preview</h4>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[200px]">
                {renderSlidePreview()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={20}
              />
              <span className="text-gray-600">© 2024 NBS AI Platform. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

