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
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSlide, setIsGeneratingSlide] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([
    { id: "cover", title: "Cover", progress: 0, summary: "" },
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
    "cover": [
      {
        id: "company-name",
        text: "What is your company name?",
        example: "Example: TechFlow Solutions Inc.",
        answer: ""
      },
      {
        id: "tagline",
        text: "What is your company's tagline or mission statement?",
        example: "Example: Empowering businesses through innovative technology solutions.",
        answer: ""
      }
    ],
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

  // Autosave functionality
  useEffect(() => {
    const saveData = () => {
      setIsSaving(true);
      // Simulate autosave
      setTimeout(() => {
        localStorage.setItem('presentationData', JSON.stringify({
          topics,
          topicQuestions
        }));
        setIsSaving(false);
      }, 500);
    };

    // Autosave every 30 seconds
    const interval = setInterval(saveData, 30000);
    return () => clearInterval(interval);
  }, [topics, topicQuestions]);

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
    const radius = size === "sm" ? 16 : 18;
    const strokeWidth = size === "sm" ? 4 : 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative">
        <svg className="transform -rotate-90" width={size === "sm" ? 36 : 44} height={size === "sm" ? 36 : 44}>
          {/* Background circle */}
          <circle
            cx={size === "sm" ? 18 : 22}
            cy={size === "sm" ? 18 : 22}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size === "sm" ? 18 : 22}
            cy={size === "sm" ? 18 : 22}
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
          <span className={`font-medium ${size === "sm" ? "text-[10px]" : "text-xs"}`}>
            {progress}%
          </span>
        </div>
      </div>
    );
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
      case "cover":
        const coverCompanyName = questions.find(q => q.id === "company-name")?.answer || "Your Company";
        const tagline = questions.find(q => q.id === "tagline")?.answer || "your innovative solution";
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        return `${coverCompanyName}\n${tagline}\nInvestor Presentation\n${month} ${year}`;
      
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
    setIsGeneratingSlide(true);
    
    // Simulate processing time with slide generation
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Update progress for the current topic
      updateTopicProgress(selectedTopic!);
      
      // Show slide generation animation for 2 seconds
      setTimeout(() => {
        setIsGeneratingSlide(false);
      }, 2000);
      
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
    if (!currentQuestion || !selectedTopic) return;

    // Get the example answer without "Example: " prefix
    const exampleAnswer = currentQuestion.example.replace("Example: ", "");
    
    // Create a new copy of topicQuestions and update the current answer
    const newTopicQuestions = { ...topicQuestions };
    newTopicQuestions[selectedTopic][currentQuestionIndex].answer = exampleAnswer;
    
    // Update the topicQuestions state
    setTopicQuestions(newTopicQuestions);
    
    // Calculate progress for this topic
    const topicQuestionsForThisTopic = newTopicQuestions[selectedTopic];
    const answeredCount = topicQuestionsForThisTopic.filter(q => q.answer.trim()).length;
    const totalCount = topicQuestionsForThisTopic.length;
    const newProgress = Math.round((answeredCount / totalCount) * 100);
    
    // Update the topics state with new progress
    setTopics(prevTopics => 
      prevTopics.map(topic => 
        topic.id === selectedTopic 
          ? { 
              ...topic, 
              progress: newProgress,
              summary: newProgress === 100 ? generateTopicSummary(selectedTopic) : topic.summary
            }
          : topic
      )
    );
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < topicQuestionsForThisTopic.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Topic completed
        setCurrentQuestionIndex(0);
        setSelectedTopic(null);
        setIsEditing(false);
      }
    }, 300);
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

  const handleTopicSelection = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
    setIsEditing(false);
  };

  const handleEditButtonClick = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    setSelectedTopic(topicId);
    setIsEditing(true);
    setCurrentQuestionIndex(0);
  };

  const handleReturnToHome = () => {
    // Autosave before navigating
    setIsSaving(true);
    localStorage.setItem('presentationData', JSON.stringify({
      topics,
      topicQuestions
    }));
    setIsSaving(false);
    // Navigate to home
    window.location.href = '/';
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      // Clear all state
      setSelectedTopic(null);
      setCurrentQuestionIndex(0);
      setIsSubmitting(false);
      setIsEditing(false);
      setShowSummary(false);
      setIsSaving(false);
      
      // Reset topics to initial state
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

      // Reset topic questions to initial state
      const resetQuestions = { ...topicQuestions };
      Object.keys(resetQuestions).forEach(topicId => {
        resetQuestions[topicId] = resetQuestions[topicId].map(question => ({
          ...question,
          answer: ""
        }));
      });
      setTopicQuestions(resetQuestions);

      // Clear localStorage
      localStorage.removeItem("presentationData");
      
      alert("All data has been reset successfully!");
    }
  };

  const handleShowPresentationSummary = () => {
    setShowSummary(true);
    setCurrentSlideIndex(0);
  };

  const handleBackToCreator = () => {
    setShowSummary(false);
  };

  const handleNextSlide = () => {
    const coverSlide = topics.find(t => t.id === "cover");
    const completedTopics = topics.filter(topic => topic.id !== "cover" && topic.progress === 100);
    const allSlides = [coverSlide, ...completedTopics].filter(Boolean);
    if (currentSlideIndex < allSlides.length - 1) {
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

  const getSlideIcon = (slideId?: string) => {
    if (!slideId) return null;
    
    const iconClasses = "w-8 h-8 text-white";
    
    switch (slideId) {
      case "cover":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "company-purpose":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "problem":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "solution":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "why-now":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "market-size":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "competition":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case "product":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case "business-model":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case "team":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case "financials":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const formatSlideContent = (slideId: string, content: string) => {
    if (!slideId || !content) return <p>{content}</p>;
    
    // Split content into sentences for better formatting
    const sentences = content.split('. ').filter(s => s.trim());
    
    switch (slideId) {
      case "cover":
        const lines = content.split('\n');
        return (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{lines[0]}</h1>
              <p className="text-xl text-gray-600 italic">{lines[1]}</p>
            </div>
            <div className="pt-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{lines[2]}</h2>
              <p className="text-lg text-gray-500">{lines[3]}</p>
            </div>
          </div>
        );
      
      case "company-purpose":
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-xl text-gray-900 mb-2">Company Overview</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{sentences[0]}</p>
              </div>
            </div>
            {sentences[1] && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">Vision & Mission</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{sentences[1]}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case "problem":
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-red-800 mb-2">The Problem</h3>
              <p className="text-red-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-orange-800 mb-2">Key Pain Points</h3>
                <p className="text-orange-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "solution":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-green-800 mb-2">Our Solution</h3>
              <p className="text-green-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-blue-800 mb-2">Unique Value</h3>
                <p className="text-blue-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "why-now":
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-purple-800 mb-2">Perfect Timing</h3>
              <p className="text-purple-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-indigo-800 mb-2">Market Trends</h3>
                <p className="text-indigo-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "market-size":
        return (
          <div className="space-y-4">
            <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-teal-800 mb-2">Target Market</h3>
              <p className="text-teal-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-cyan-800 mb-2">Market Opportunity</h3>
                <p className="text-cyan-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "competition":
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-yellow-800 mb-2">Competitive Landscape</h3>
              <p className="text-yellow-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-amber-800 mb-2">Our Advantage</h3>
                <p className="text-amber-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "product":
        return (
          <div className="space-y-4">
            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-emerald-800 mb-2">Product Overview</h3>
              <p className="text-emerald-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-lime-50 border-l-4 border-lime-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-lime-800 mb-2">Key Features</h3>
                <p className="text-lime-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "business-model":
        return (
          <div className="space-y-4">
            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-pink-800 mb-2">Revenue Model</h3>
              <p className="text-pink-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-rose-800 mb-2">Pricing Strategy</h3>
                <p className="text-rose-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "team":
        return (
          <div className="space-y-4">
            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-violet-800 mb-2">Team Overview</h3>
              <p className="text-violet-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-fuchsia-50 border-l-4 border-fuchsia-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-fuchsia-800 mb-2">Expertise</h3>
                <p className="text-fuchsia-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      case "financials":
        return (
          <div className="space-y-4">
            <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-xl text-slate-800 mb-2">Revenue Projections</h3>
              <p className="text-slate-700 leading-relaxed text-lg">{sentences[0]}</p>
            </div>
            {sentences[1] && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Funding Needs</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{sentences[1]}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return <p className="text-gray-700 leading-relaxed">{content}</p>;
    }
  };

  const renderSlidePreview = () => {
    if (!selectedTopic) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Select a topic to see slide preview</p>
            <p className="text-sm">Your slide will appear here as you answer questions</p>
          </div>
        </div>
      );
    }

    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic) return null;

    if (isGeneratingSlide) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="relative">
              {/* Animated slide generation */}
              <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                <div className="absolute top-2 left-2 w-8 h-1 bg-white/30 rounded"></div>
                <div className="absolute top-6 left-2 w-16 h-1 bg-white/50 rounded"></div>
                <div className="absolute top-10 left-2 w-12 h-1 bg-white/40 rounded"></div>
                <div className="absolute top-14 left-2 w-20 h-1 bg-white/60 rounded"></div>
              </div>
              
              {/* Loading animation */}
              <div className="flex justify-center space-x-1 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700">Generating slide...</p>
            <p className="text-sm text-gray-500">Creating beautiful presentation content</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Slide Preview */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Slide Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-white font-bold text-xl">{topic.title}</h2>
          </div>
          
          {/* Slide Content */}
          <div className="p-6 flex-1">
            <div className="text-gray-800 text-base leading-relaxed">
              {topic.summary || (
                <div className="text-gray-500 text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm">Complete the questions to generate slide content</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Slide Info */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Live Preview</span>
          </div>
        </div>
      </div>
    );
  };

  const renderChatInterface = () => {
    if (!selectedTopic) {
      return (
        <div className="text-center text-gray-500">
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
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 font-medium">Example:</p>
            <p className="text-sm text-blue-700">{currentQuestion.example.replace("Example: ", "")}</p>
          </div>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <textarea
            value={currentQuestion.answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentQuestion.answer.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
            >
              Use Example
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Press Ctrl+Enter to submit
          </p>
        </div>
      </div>
    );
  };

  // Full Presentation Summary Screen
  if (showSummary) {
    // Always include cover slide, plus all completed topics
    const coverSlide = topics.find(t => t.id === "cover");
    const completedTopics = topics.filter(topic => topic.id !== "cover" && topic.progress === 100);
    const allSlides = [coverSlide, ...completedTopics].filter(Boolean);
    const currentSlide = allSlides[currentSlideIndex];
    
    console.log('Cover slide:', coverSlide);
    console.log('Completed topics:', completedTopics);
    console.log('All slides:', allSlides);
    console.log('Current slide index:', currentSlideIndex);
    console.log('Current slide:', currentSlide);

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
                  <span className="text-2xl font-bold text-gray-900">Presentation Creator</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToCreator}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Back to Creator
                </button>
                <button
                  onClick={handleReturnToHome}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
                      {/* Slide Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Slide {currentSlideIndex + 1} of {allSlides.length}</h2>
                <p className="text-gray-600">{currentSlide?.title}</p>
              </div>
              
              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === allSlides.length - 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>

          {/* Current Slide - 16:9 Aspect Ratio */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Slide Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
                  <h1 className="text-white font-bold text-3xl">{currentSlide?.title}</h1>
                  <div className="flex items-center space-x-2">
                    {getSlideIcon(currentSlide?.id)}
                  </div>
                </div>
                
                {/* Slide Content */}
                <div className="p-8 h-full flex flex-col justify-center">
                  <div className="text-gray-800 text-base leading-relaxed">
                    {currentSlide?.summary ? (
                      <div className="space-y-4">
                        {formatSlideContent(currentSlide.id, currentSlide.summary)}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">Complete the questions to generate slide content</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

                      {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleBackToCreator}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Back to Creator
              </button>
              <button
                onClick={handleExportPDF}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Export to PDF
              </button>
              <button
                onClick={handleExportPPT}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
              >
                Export to PPT
              </button>
              <button
                onClick={handleSendEmail}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Send via Email
              </button>
              <button
                onClick={handleReturnToHome}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Home
              </button>
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
                <span className="text-2xl font-bold text-gray-900">Presentation Creator</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
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
        {/* Left Column - Chat Zone and Slide Preview (50% width) */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 h-32 flex flex-col justify-center">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Questions & Answers</h2>
                </div>
                
                {/* Action Buttons - Right Side */}
                <div className="flex items-center space-x-2">
                  {isSaving && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-2"></div>
                      Saving...
                    </div>
                  )}
                  <button
                    onClick={() => {
                      // Check if business plan data exists
                      const bpData = localStorage.getItem('businessPlanData');
                      console.log('BP Data found:', bpData ? 'Yes' : 'No');
                      console.log('BP Data content:', bpData);
                      
                      if (!bpData) {
                        alert("No business plan data found. Please complete the Business Plan Compiler first.");
                        return;
                      }

                      try {
                        const bp = JSON.parse(bpData);
                        console.log('Parsed BP data:', bp);
                        console.log('BP topics:', bp.topics);
                        console.log('BP topicQuestions:', bp.topicQuestions);
                        
                        // Map business plan data to presentation questions
                        const bpQuestions = { ...topicQuestions };
                        
                        // Track if any data was actually found and processed
                        let dataFound = false;
                        
                        // Cover slide mapping - pull from business-overview questions
                        const businessOverviewQuestions = bp.topicQuestions?.["business-overview"];
                        console.log('Business Overview questions found:', businessOverviewQuestions);
                        if (businessOverviewQuestions) {
                          const companyNameAnswer = businessOverviewQuestions.find((q: any) => q.id === "company-name")?.answer;
                          const businessModelAnswer = businessOverviewQuestions.find((q: any) => q.id === "business-model")?.answer;
                          const missionAnswer = businessOverviewQuestions.find((q: any) => q.id === "mission")?.answer;
                          
                          // Populate cover slide
                          if (companyNameAnswer && companyNameAnswer.trim()) {
                            console.log('Setting cover company name with answer:', companyNameAnswer);
                            const coverCompanyNameQuestion = bpQuestions["cover"].find((q: any) => q.id === "company-name");
                            if (coverCompanyNameQuestion) coverCompanyNameQuestion.answer = companyNameAnswer;
                            dataFound = true;
                          }
                          
                          if (missionAnswer && missionAnswer.trim()) {
                            console.log('Setting cover tagline with mission answer:', missionAnswer);
                            const coverTaglineQuestion = bpQuestions["cover"].find((q: any) => q.id === "tagline");
                            if (coverTaglineQuestion) coverTaglineQuestion.answer = missionAnswer;
                            dataFound = true;
                          }
                        }

                        // Company Purpose mapping - pull from business-overview questions
                        if (businessOverviewQuestions) {
                          const companyNameAnswer = businessOverviewQuestions.find((q: any) => q.id === "company-name")?.answer;
                          const businessModelAnswer = businessOverviewQuestions.find((q: any) => q.id === "business-model")?.answer;
                          const missionAnswer = businessOverviewQuestions.find((q: any) => q.id === "mission")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (companyNameAnswer && companyNameAnswer.trim()) {
                            console.log('Setting company name with answer:', companyNameAnswer);
                            const companyNameQuestion = bpQuestions["company-purpose"].find((q: any) => q.id === "company-name");
                            if (companyNameQuestion) companyNameQuestion.answer = companyNameAnswer;
                            dataFound = true;
                          }
                          
                          if (missionAnswer && missionAnswer.trim()) {
                            console.log('Setting mission with answer:', missionAnswer);
                            const missionQuestion = bpQuestions["company-purpose"].find((q: any) => q.id === "mission");
                            if (missionQuestion) missionQuestion.answer = missionAnswer;
                            dataFound = true;
                          }
                          
                          if (businessModelAnswer && businessModelAnswer.trim()) {
                            console.log('Setting vision with business model answer:', businessModelAnswer);
                            const visionQuestion = bpQuestions["company-purpose"].find((q: any) => q.id === "vision");
                            if (visionQuestion) visionQuestion.answer = businessModelAnswer;
                            dataFound = true;
                          }
                        }

                        // Problem mapping - pull from market-summary questions
                        const marketSummaryQuestions = bp.topicQuestions?.["market-summary"];
                        console.log('Market Summary questions found:', marketSummaryQuestions);
                        if (marketSummaryQuestions) {
                          const targetMarketAnswer = marketSummaryQuestions.find((q: any) => q.id === "target-market")?.answer;
                          const marketSizeAnswer = marketSummaryQuestions.find((q: any) => q.id === "market-size")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (targetMarketAnswer && targetMarketAnswer.trim()) {
                            console.log('Setting problem description with target market answer:', targetMarketAnswer);
                            const problemQuestion = bpQuestions["problem"].find((q: any) => q.id === "problem-description");
                            if (problemQuestion) problemQuestion.answer = targetMarketAnswer;
                            dataFound = true;
                          }
                          
                          if (marketSizeAnswer && marketSizeAnswer.trim()) {
                            console.log('Setting pain points with market size answer:', marketSizeAnswer);
                            const painPointsQuestion = bpQuestions["problem"].find((q: any) => q.id === "pain-points");
                            if (painPointsQuestion) painPointsQuestion.answer = marketSizeAnswer;
                            dataFound = true;
                          }
                        }

                        // Solution mapping - pull from products-services questions
                        const productsServicesQuestions = bp.topicQuestions?.["products-services"];
                        console.log('Products Services questions found:', productsServicesQuestions);
                        if (productsServicesQuestions) {
                          const mainProductAnswer = productsServicesQuestions.find((q: any) => q.id === "main-product")?.answer;
                          const uniqueValueAnswer = productsServicesQuestions.find((q: any) => q.id === "unique-value")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (mainProductAnswer && mainProductAnswer.trim()) {
                            console.log('Setting solution description with main product answer:', mainProductAnswer);
                            const solutionQuestion = bpQuestions["solution"].find((q: any) => q.id === "solution-description");
                            if (solutionQuestion) solutionQuestion.answer = mainProductAnswer;
                            dataFound = true;
                          }
                          
                          if (uniqueValueAnswer && uniqueValueAnswer.trim()) {
                            console.log('Setting unique approach with unique value answer:', uniqueValueAnswer);
                            const uniqueQuestion = bpQuestions["solution"].find((q: any) => q.id === "unique-approach");
                            if (uniqueQuestion) uniqueQuestion.answer = uniqueValueAnswer;
                            dataFound = true;
                          }
                        }

                        // Why Now mapping - pull from gtm-strategy questions
                        const gtmStrategyQuestions = bp.topicQuestions?.["gtm-strategy"];
                        console.log('GTM Strategy questions found:', gtmStrategyQuestions);
                        if (gtmStrategyQuestions) {
                          const marketingChannelsAnswer = gtmStrategyQuestions.find((q: any) => q.id === "marketing-channels")?.answer;
                          const pricingStrategyAnswer = gtmStrategyQuestions.find((q: any) => q.id === "pricing-strategy")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (marketingChannelsAnswer && marketingChannelsAnswer.trim()) {
                            console.log('Setting timing with marketing channels answer:', marketingChannelsAnswer);
                            const timingQuestion = bpQuestions["why-now"].find((q: any) => q.id === "timing");
                            if (timingQuestion) timingQuestion.answer = marketingChannelsAnswer;
                            dataFound = true;
                          }
                          
                          if (pricingStrategyAnswer && pricingStrategyAnswer.trim()) {
                            console.log('Setting market trends with pricing strategy answer:', pricingStrategyAnswer);
                            const trendsQuestion = bpQuestions["why-now"].find((q: any) => q.id === "market-trends");
                            if (trendsQuestion) trendsQuestion.answer = pricingStrategyAnswer;
                            dataFound = true;
                          }
                        }

                        // Market Size mapping - pull from market-summary questions
                        if (marketSummaryQuestions) {
                          const targetMarketAnswer = marketSummaryQuestions.find((q: any) => q.id === "target-market")?.answer;
                          const marketSizeAnswer = marketSummaryQuestions.find((q: any) => q.id === "market-size")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (targetMarketAnswer && targetMarketAnswer.trim()) {
                            console.log('Setting target market with answer:', targetMarketAnswer);
                            const targetQuestion = bpQuestions["market-size"].find((q: any) => q.id === "target-market");
                            if (targetQuestion) targetQuestion.answer = targetMarketAnswer;
                            dataFound = true;
                          }
                          
                          if (marketSizeAnswer && marketSizeAnswer.trim()) {
                            console.log('Setting market value with answer:', marketSizeAnswer);
                            const sizeQuestion = bpQuestions["market-size"].find((q: any) => q.id === "market-value");
                            if (sizeQuestion) sizeQuestion.answer = marketSizeAnswer;
                            dataFound = true;
                          }
                        }

                        // Competition mapping - pull from products-services questions
                        if (productsServicesQuestions) {
                          const productDescAnswer = productsServicesQuestions.find((q: any) => q.id === "product-description")?.answer;
                          const serviceDescAnswer = productsServicesQuestions.find((q: any) => q.id === "service-description")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (productDescAnswer && productDescAnswer.trim()) {
                            console.log('Setting competitors with product answer:', productDescAnswer);
                            const competitorsQuestion = bpQuestions["competition"].find((q: any) => q.id === "competitors");
                            if (competitorsQuestion) competitorsQuestion.answer = productDescAnswer;
                            dataFound = true;
                          }
                          
                          if (serviceDescAnswer && serviceDescAnswer.trim()) {
                            console.log('Setting competitive advantage with service answer:', serviceDescAnswer);
                            const advantageQuestion = bpQuestions["competition"].find((q: any) => q.id === "competitive-advantage");
                            if (advantageQuestion) advantageQuestion.answer = serviceDescAnswer;
                            dataFound = true;
                          }
                        }

                        // Product mapping - pull from products-services questions
                        if (productsServicesQuestions) {
                          const mainProductAnswer = productsServicesQuestions.find((q: any) => q.id === "main-product")?.answer;
                          const uniqueValueAnswer = productsServicesQuestions.find((q: any) => q.id === "unique-value")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (mainProductAnswer && mainProductAnswer.trim()) {
                            console.log('Setting product description with main product answer:', mainProductAnswer);
                            const productQuestion = bpQuestions["product"].find((q: any) => q.id === "product-description");
                            if (productQuestion) productQuestion.answer = mainProductAnswer;
                            dataFound = true;
                          }
                          
                          if (uniqueValueAnswer && uniqueValueAnswer.trim()) {
                            console.log('Setting key features with unique value answer:', uniqueValueAnswer);
                            const featuresQuestion = bpQuestions["product"].find((q: any) => q.id === "key-features");
                            if (featuresQuestion) featuresQuestion.answer = uniqueValueAnswer;
                            dataFound = true;
                          }
                        }

                        // Business Model mapping - pull from gtm-strategy questions
                        if (gtmStrategyQuestions) {
                          const marketingChannelsAnswer = gtmStrategyQuestions.find((q: any) => q.id === "marketing-channels")?.answer;
                          const pricingStrategyAnswer = gtmStrategyQuestions.find((q: any) => q.id === "pricing-strategy")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (marketingChannelsAnswer && marketingChannelsAnswer.trim()) {
                            console.log('Setting revenue model with marketing channels answer:', marketingChannelsAnswer);
                            const revenueQuestion = bpQuestions["business-model"].find((q: any) => q.id === "revenue-model");
                            if (revenueQuestion) revenueQuestion.answer = marketingChannelsAnswer;
                            dataFound = true;
                          }
                          
                          if (pricingStrategyAnswer && pricingStrategyAnswer.trim()) {
                            console.log('Setting pricing strategy with pricing strategy answer:', pricingStrategyAnswer);
                            const pricingQuestion = bpQuestions["business-model"].find((q: any) => q.id === "pricing-strategy");
                            if (pricingQuestion) pricingQuestion.answer = pricingStrategyAnswer;
                            dataFound = true;
                          }
                        }

                        // Team mapping - pull from client-overview questions
                        const clientOverviewQuestions = bp.topicQuestions?.["client-overview"];
                        console.log('Client Overview questions found:', clientOverviewQuestions);
                        if (clientOverviewQuestions) {
                          const customerSegmentsAnswer = clientOverviewQuestions.find((q: any) => q.id === "customer-segments")?.answer;
                          const customerJourneyAnswer = clientOverviewQuestions.find((q: any) => q.id === "customer-journey")?.answer;
                          
                          // Only populate if we have meaningful answers
                          if (customerSegmentsAnswer && customerSegmentsAnswer.trim()) {
                            console.log('Setting team overview with customer segments answer:', customerSegmentsAnswer);
                            const teamQuestion = bpQuestions["team"].find((q: any) => q.id === "team-overview");
                            if (teamQuestion) teamQuestion.answer = customerSegmentsAnswer;
                            dataFound = true;
                          }
                          
                          if (customerJourneyAnswer && customerJourneyAnswer.trim()) {
                            console.log('Setting team expertise with customer journey answer:', customerJourneyAnswer);
                            const expertiseQuestion = bpQuestions["team"].find((q: any) => q.id === "team-expertise");
                            if (expertiseQuestion) expertiseQuestion.answer = customerJourneyAnswer;
                            dataFound = true;
                          }
                        }

                        // Financials mapping - use any available meaningful data
                        const allBPQuestions = bp.topicQuestions;
                        if (allBPQuestions) {
                          // Find any meaningful answer from any topic
                          let financialData = "";
                          for (const topicKey in allBPQuestions) {
                            const questions = allBPQuestions[topicKey];
                            for (const question of questions) {
                              if (question.answer && question.answer.trim()) {
                                financialData = question.answer;
                                break;
                              }
                            }
                            if (financialData) break;
                          }
                          
                          if (financialData && financialData.trim()) {
                            console.log('Setting financials with available data:', financialData);
                            const revenueQuestion = bpQuestions["financials"].find((q: any) => q.id === "revenue-projection");
                            if (revenueQuestion) revenueQuestion.answer = financialData;
                            
                            const fundingQuestion = bpQuestions["financials"].find((q: any) => q.id === "funding-needs");
                            if (fundingQuestion) fundingQuestion.answer = financialData;
                            
                            dataFound = true;
                          }
                        }

                        console.log('Updated bpQuestions:', bpQuestions);
                        console.log('Data found and processed:', dataFound);

                        // Update all topics with new progress and summaries
                        const updatedTopics = topics.map(topic => {
                          const topicQuestionsForThisTopic = bpQuestions[topic.id];
                          const answeredCount = topicQuestionsForThisTopic.filter(q => q.answer.trim()).length;
                          const totalCount = topicQuestionsForThisTopic.length;
                          let newProgress = Math.round((answeredCount / totalCount) * 100);
                          
                          // Always mark cover slide as completed if we have any data
                          if (topic.id === "cover" && answeredCount > 0) {
                            newProgress = 100;
                          }
                          
                          console.log(`Topic ${topic.id}: ${answeredCount}/${totalCount} = ${newProgress}%`);
                          
                          // Generate summary using the updated questions data
                          let newSummary = "";
                          if (newProgress === 100) {
                            const questions = bpQuestions[topic.id];
                            const answeredQuestions = questions.filter(q => q.answer.trim());
                            if (answeredQuestions.length > 0) {
                              switch (topic.id) {
                                case "cover":
                                  const coverCompanyName = questions.find(q => q.id === "company-name")?.answer || "Your Company";
                                  const tagline = questions.find(q => q.id === "tagline")?.answer || "your innovative solution";
                                  const currentDate = new Date();
                                  const month = currentDate.toLocaleString('default', { month: 'long' });
                                  const year = currentDate.getFullYear();
                                  newSummary = `${coverCompanyName}\n${tagline}\nInvestor Presentation\n${month} ${year}`;
                                  break;
                                case "company-purpose":
                                  const companyName = questions.find(q => q.id === "company-name")?.answer || "Your Company";
                                  const mission = questions.find(q => q.id === "mission")?.answer || "your mission";
                                  const vision = questions.find(q => q.id === "vision")?.answer || "your vision";
                                  newSummary = `${companyName} is dedicated to ${mission}. Our vision is ${vision}.`;
                                  break;
                                case "problem":
                                  const problemDesc = questions.find(q => q.id === "problem-description")?.answer || "the problem";
                                  const painPoints = questions.find(q => q.id === "pain-points")?.answer || "pain points";
                                  newSummary = `The problem we solve is ${problemDesc}. Key pain points include ${painPoints}.`;
                                  break;
                                case "solution":
                                  const solutionDesc = questions.find(q => q.id === "solution-description")?.answer || "our solution";
                                  const uniqueApproach = questions.find(q => q.id === "unique-approach")?.answer || "our unique approach";
                                  newSummary = `Our solution ${solutionDesc}. What makes us unique is ${uniqueApproach}.`;
                                  break;
                                case "why-now":
                                  const timing = questions.find(q => q.id === "timing")?.answer || "the timing";
                                  const marketTrends = questions.find(q => q.id === "market-trends")?.answer || "market trends";
                                  newSummary = `Now is the right time because ${timing}. Market trends show ${marketTrends}.`;
                                  break;
                                case "market-size":
                                  const targetMarket = questions.find(q => q.id === "target-market")?.answer || "your target market";
                                  const marketValue = questions.find(q => q.id === "market-value")?.answer || "significant market opportunity";
                                  newSummary = `Our target market consists of ${targetMarket}. The market size represents ${marketValue}.`;
                                  break;
                                case "competition":
                                  const competitors = questions.find(q => q.id === "competitors")?.answer || "competitors";
                                  const competitiveAdvantage = questions.find(q => q.id === "competitive-advantage")?.answer || "our competitive advantage";
                                  newSummary = `Our main competitors are ${competitors}. Our competitive advantage is ${competitiveAdvantage}.`;
                                  break;
                                case "product":
                                  const productDesc = questions.find(q => q.id === "product-description")?.answer || "our product";
                                  const keyFeatures = questions.find(q => q.id === "key-features")?.answer || "key features";
                                  newSummary = `Our main product is ${productDesc}. Key features include ${keyFeatures}.`;
                                  break;
                                case "business-model":
                                  const revenueModel = questions.find(q => q.id === "revenue-model")?.answer || "our revenue model";
                                  const pricingStrategy = questions.find(q => q.id === "pricing-strategy")?.answer || "our pricing strategy";
                                  newSummary = `We make money through ${revenueModel}. Our pricing strategy is ${pricingStrategy}.`;
                                  break;
                                case "team":
                                  const teamOverview = questions.find(q => q.id === "team-overview")?.answer || "our team";
                                  const teamExpertise = questions.find(q => q.id === "team-expertise")?.answer || "our expertise";
                                  newSummary = `Our key team members include ${teamOverview}. Our expertise includes ${teamExpertise}.`;
                                  break;
                                case "financials":
                                  const revenueProjection = questions.find(q => q.id === "revenue-projection")?.answer || "our revenue projections";
                                  const fundingNeeds = questions.find(q => q.id === "funding-needs")?.answer || "our funding needs";
                                  newSummary = `Our revenue projections show ${revenueProjection}. We are seeking ${fundingNeeds}.`;
                                  break;
                                default:
                                  newSummary = "Summary generated based on your responses.";
                              }
                            }
                          }
                          
                          return {
                            ...topic,
                            progress: newProgress,
                            summary: newSummary
                          };
                        });
                        
                        console.log('Updated topics:', updatedTopics);
                        
                        // Update both states together to ensure consistency
                        setTopicQuestions(bpQuestions);
                        setTopics(updatedTopics);

                        // Mark as loaded from BP
                        setHasLoadedFromBP(true);

                        // Reset UI state
                        setSelectedTopic(null);
                        setCurrentQuestionIndex(0);
                        setIsEditing(false);
                        setShowSummary(false);
                        setCurrentSlideIndex(0);

                        alert("Successfully pulled data from Business Plan!");
                      } catch (error) {
                        console.error('Error loading business plan data:', error);
                        alert("Error loading business plan data. Please try again.");
                      }
                    }}
                    disabled={hasLoadedFromBP}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      hasLoadedFromBP 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                  >
                    {hasLoadedFromBP ? "BP Loaded" : "BP Pull"}
                  </button>
                  <button
                    onClick={() => {
                      // Create a new copy of topicQuestions and fill all with examples
                      const newTopicQuestions = { ...topicQuestions };
                      Object.keys(newTopicQuestions).forEach(topicId => {
                        newTopicQuestions[topicId].forEach(question => {
                          question.answer = question.example.replace("Example: ", "");
                        });
                      });
                      
                      // Update the topicQuestions state
                      setTopicQuestions(newTopicQuestions);
                      
                      // Update all topics with new progress and summaries
                      setTopics(prevTopics => 
                        prevTopics.map(topic => {
                          const topicQuestionsForThisTopic = newTopicQuestions[topic.id];
                          const answeredCount = topicQuestionsForThisTopic.filter(q => q.answer.trim()).length;
                          const totalCount = topicQuestionsForThisTopic.length;
                          let newProgress = Math.round((answeredCount / totalCount) * 100);
                          
                          // Always mark cover slide as completed if we have any data
                          if (topic.id === "cover" && answeredCount > 0) {
                            newProgress = 100;
                          }
                          
                          return {
                            ...topic,
                            progress: newProgress,
                            summary: newProgress === 100 ? generateTopicSummary(topic.id) : topic.summary
                          };
                        })
                      );
                      
                      alert("Default data has been loaded successfully!");
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Default
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleReturnToHome}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Home
                  </button>
                </div>
              </div>
            </div>
            
            {/* Split Layout: Chat Interface (Upper 50%) and Slide Preview (Lower 50%) */}
            <div className="flex-1 flex flex-col">
              {/* Chat Area - Upper 50% */}
              <div className="h-1/2 p-6 border-b border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200 overflow-y-auto">
                  {renderChatInterface()}
                </div>
              </div>
              
              {/* Slide Preview Area - Lower 50% */}
              <div className="h-1/2 p-6">
                <div className="h-full">
                  {renderSlidePreview()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Topics and Summary (50% width) */}
        <div className="w-full lg:w-1/2 bg-white">
          <div className="h-full flex flex-col">
            {/* Topics Header */}
            <div className="p-6 border-b border-gray-200 h-32 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Core Slides</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShowPresentationSummary}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Show Presentation
                  </button>
                  <div className="flex items-center">
                    {renderProgressDonut(overallProgress, "sm")}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Topics List */}
            <div className="flex-1 p-6">
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTopicSelection(topic.id)}
                      className={`
                        group rounded-xl border bg-white hover:bg-muted/40 transition-all duration-200
                        p-4
                        w-[70%]
                        h-12
                        ${selectedTopic === topic.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex items-center h-full">
                        <div className="font-medium text-gray-900">{topic.title}</div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditButtonClick(e, topic.id);
                      }}
                      className="w-[20%] px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium h-12"
                    >
                      Edit
                    </button>
                    <div className="w-[10%] flex items-center justify-center">
                      {renderProgressDonut(topic.progress, "sm")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Summary Area */}
            <div className="p-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Summary</h4>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[120px]">
                {selectedTopic ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">
                        {topics.find(t => t.id === selectedTopic)?.title}
                      </h5>
                      {topics.find(t => t.id === selectedTopic)?.progress === 100 && (
                        <button 
                          onClick={handleEditTopic}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {getSelectedTopicSummary() || "No summary available yet. Complete this topic to generate a summary."}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center">
                    <p>Select a topic to view its summary</p>
                  </div>
                )}
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

