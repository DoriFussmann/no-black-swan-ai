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

export default function BusinessPlanComposer() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "business-overview",
      title: "Business Overview",
      progress: 0,
      summary: ""
    },
    {
      id: "market-summary",
      title: "Market Summary",
      progress: 0,
      summary: ""
    },
    {
      id: "products-services",
      title: "Products & Services",
      progress: 0,
      summary: ""
    },
    {
      id: "gtm-strategy",
      title: "Go-To-Market (GTM) Strategy",
      progress: 0,
      summary: ""
    },
    {
      id: "client-overview",
      title: "Client Overview",
      progress: 0,
      summary: ""
    }
  ]);

  // Sample questions for each topic with state management
  const [topicQuestions, setTopicQuestions] = useState<TopicQuestions>({
    "business-overview": [
      {
        id: "company-name",
        text: "What is your company name?",
        example: "Example: TechFlow Solutions Inc.",
        answer: ""
      },
      {
        id: "business-model",
        text: "Describe your business model in one sentence.",
        example: "Example: We provide SaaS solutions to small businesses with a monthly subscription model.",
        answer: ""
      },
      {
        id: "mission",
        text: "What is your company's mission statement?",
        example: "Example: To empower small businesses with affordable, easy-to-use technology solutions.",
        answer: ""
      }
    ],
    "market-summary": [
      {
        id: "target-market",
        text: "Who is your target market?",
        example: "Example: Small to medium-sized businesses (10-500 employees) in the technology sector.",
        answer: ""
      },
      {
        id: "market-size",
        text: "What is the estimated market size for your product/service?",
        example: "Example: The global SaaS market is valued at $195 billion with 20% annual growth.",
        answer: ""
      }
    ],
    "products-services": [
      {
        id: "main-product",
        text: "What is your main product or service?",
        example: "Example: Cloud-based project management software with team collaboration features.",
        answer: ""
      },
      {
        id: "unique-value",
        text: "What makes your product/service unique?",
        example: "Example: Our AI-powered automation reduces manual work by 70% compared to competitors.",
        answer: ""
      }
    ],
    "gtm-strategy": [
      {
        id: "marketing-channels",
        text: "What marketing channels will you use to reach customers?",
        example: "Example: Digital marketing, content marketing, social media, and partnerships.",
        answer: ""
      },
      {
        id: "pricing-strategy",
        text: "What is your pricing strategy?",
        example: "Example: Freemium model with premium tiers starting at $29/month.",
        answer: ""
      }
    ],
    "client-overview": [
      {
        id: "customer-segments",
        text: "What are your main customer segments?",
        example: "Example: Startup founders, small business owners, and remote teams.",
        answer: ""
      },
      {
        id: "customer-journey",
        text: "How do customers typically discover and purchase your product?",
        example: "Example: Customers discover us through social media, try our free version, then upgrade.",
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
        localStorage.setItem('businessPlanData', JSON.stringify({
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
    const savedData = localStorage.getItem('businessPlanData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTopics(data.topics || topics);
        setTopicQuestions(data.topicQuestions || topicQuestions);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [topics, topicQuestions]);

  const renderProgressDonut = (progress: number, size: "sm" | "md" = "md") => {
    const radius = size === "sm" ? 12 : 16;
    const strokeWidth = size === "sm" ? 2 : 3;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative">
        <svg className="transform -rotate-90" width={size === "sm" ? 28 : 36} height={size === "sm" ? 28 : 36}>
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
      case "business-overview":
        const companyName = questions.find(q => q.id === "company-name")?.answer || "Your Company";
        const businessModel = questions.find(q => q.id === "business-model")?.answer || "your business model";
        const mission = questions.find(q => q.id === "mission")?.answer || "your mission";
        return `${companyName} operates using ${businessModel}. Our mission is ${mission}.`;
      
      case "market-summary":
        const targetMarket = questions.find(q => q.id === "target-market")?.answer || "your target market";
        const marketSize = questions.find(q => q.id === "market-size")?.answer || "significant market opportunity";
        return `Our target market consists of ${targetMarket}. The market size represents ${marketSize}.`;
      
      case "products-services":
        const mainProduct = questions.find(q => q.id === "main-product")?.answer || "our main product";
        const uniqueValue = questions.find(q => q.id === "unique-value")?.answer || "our unique value proposition";
        return `Our main product is ${mainProduct}. What makes us unique is ${uniqueValue}.`;
      
      case "gtm-strategy":
        const marketingChannels = questions.find(q => q.id === "marketing-channels")?.answer || "various marketing channels";
        const pricingStrategy = questions.find(q => q.id === "pricing-strategy")?.answer || "competitive pricing";
        return `We will reach customers through ${marketingChannels}. Our pricing strategy is ${pricingStrategy}.`;
      
      case "client-overview":
        const customerSegments = questions.find(q => q.id === "customer-segments")?.answer || "diverse customer segments";
        const customerJourney = questions.find(q => q.id === "customer-journey")?.answer || "our customer journey";
        return `Our main customer segments are ${customerSegments}. Customers typically ${customerJourney}.`;
      
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

  const handleReturnToHome = () => {
    // Autosave before navigating
    setIsSaving(true);
    localStorage.setItem('businessPlanData', JSON.stringify({
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
        {
          id: "business-overview",
          title: "Business Overview",
          progress: 0,
          summary: ""
        },
        {
          id: "market-summary",
          title: "Market Summary",
          progress: 0,
          summary: ""
        },
        {
          id: "products-services",
          title: "Products & Services",
          progress: 0,
          summary: ""
        },
        {
          id: "gtm-strategy",
          title: "Go-To-Market (GTM) Strategy",
          progress: 0,
          summary: ""
        },
        {
          id: "client-overview",
          title: "Client Overview",
          progress: 0,
          summary: ""
        }
      ]);

      // Reset topic questions to initial state
      setTopicQuestions({
        "business-overview": [
          {
            id: "company-name",
            text: "What is your company name?",
            example: "Example: TechFlow Solutions Inc.",
            answer: ""
          },
          {
            id: "business-model",
            text: "Describe your business model in one sentence.",
            example: "Example: We provide SaaS solutions to small businesses with a monthly subscription model.",
            answer: ""
          },
          {
            id: "mission",
            text: "What is your company's mission statement?",
            example: "Example: To empower small businesses with affordable, easy-to-use technology solutions.",
            answer: ""
          }
        ],
        "market-summary": [
          {
            id: "target-market",
            text: "Who is your target market?",
            example: "Example: Small to medium-sized businesses (10-500 employees) in the technology sector.",
            answer: ""
          },
          {
            id: "market-size",
            text: "What is the estimated market size for your product/service?",
            example: "Example: The global SaaS market is valued at $195 billion with 20% annual growth.",
            answer: ""
          }
        ],
        "products-services": [
          {
            id: "main-product",
            text: "What is your main product or service?",
            example: "Example: Cloud-based project management software with team collaboration features.",
            answer: ""
          },
          {
            id: "unique-value",
            text: "What makes your product/service unique?",
            example: "Example: Our AI-powered automation reduces manual work by 70% compared to competitors.",
            answer: ""
          }
        ],
        "gtm-strategy": [
          {
            id: "marketing-channels",
            text: "What marketing channels will you use to reach customers?",
            example: "Example: Digital marketing, content marketing, social media, and partnerships.",
            answer: ""
          },
          {
            id: "pricing-strategy",
            text: "What is your pricing strategy?",
            example: "Example: Freemium model with premium tiers starting at $29/month.",
            answer: ""
          }
        ],
        "client-overview": [
          {
            id: "customer-segments",
            text: "What are your main customer segments?",
            example: "Example: Startup founders, small business owners, and remote teams.",
            answer: ""
          },
          {
            id: "customer-journey",
            text: "How do customers typically discover and purchase your product?",
            example: "Example: Customers discover us through social media, try our free version, then upgrade.",
            answer: ""
          }
        ]
      });

      // Clear localStorage
      localStorage.removeItem("businessPlanData");
      
      alert("All data has been reset successfully!");
    }
  };

  const handleShowBusinessPlanSummary = () => {
    setShowSummary(true);
  };

  const handleBackToCompiler = () => {
    setShowSummary(false);
  };

  const renderChatInterface = () => {
    if (!selectedTopic) {
      return (
        <div className="text-center text-gray-500">
          <p>Select a topic to begin building your business plan</p>
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
            <p className="text-sm text-blue-700">{currentQuestion.example}</p>
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
              Use Default
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Press Ctrl+Enter to submit
          </p>
        </div>
      </div>
    );
  };

  // Business Plan Summary Screen
  if (showSummary) {
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToCompiler}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Back to Compiler
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

        {/* Business Plan Summary Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Business Plan Summary
            </h1>
            <p className="text-xl text-gray-600">
              Your comprehensive business plan generated from your responses
            </p>
          </div>

          <div className="space-y-8">
            {topics.map((topic, index) => (
              <BusinessPlanSection
                key={topic.id}
                topic={topic}
                index={index}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center space-x-4">
            <button
              onClick={handleBackToCompiler}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Edit Business Plan
            </button>
            <button
              onClick={handleReturnToHome}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
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
                <span className="text-2xl font-bold text-gray-900">NBS AI Platform</span>
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
        {/* Left Column - Chat Zone (50% width) */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Business Plan Compiler</h2>
                  <p className="text-gray-600 mt-2">Answer questions to build your business plan</p>
                </div>
                <div className="flex items-center space-x-3">
                  {isSaving && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-2"></div>
                      Saving...
                    </div>
                  )}
                  <button
                    onClick={() => {
                      // Fill all questions with default examples
                      const updatedQuestions = { ...topicQuestions };
                      Object.keys(updatedQuestions).forEach(topicId => {
                        updatedQuestions[topicId].forEach(question => {
                          question.answer = question.example.replace("Example: ", "");
                        });
                      });
                      setTopicQuestions(updatedQuestions);
                      
                      // Update all topics to 100% progress
                      setTopics(prevTopics => 
                        prevTopics.map(topic => ({
                          ...topic,
                          progress: 100,
                          summary: generateTopicSummary(topic.id)
                        }))
                      );
                      
                      alert("Default data has been loaded successfully!");
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium mr-2"
                  >
                    Default
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium mr-2"
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
            
            {/* Chat Area */}
            <div className="flex-1 p-6">
              <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200 overflow-y-auto">
                {renderChatInterface()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Topics and Summary (50% width) */}
        <div className="w-full lg:w-1/2 bg-white">
          <div className="h-full flex flex-col">
            {/* Topics Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Topics</h3>
                  <p className="text-gray-600 mt-1">Complete each section to build your plan</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  {renderProgressDonut(overallProgress, "sm")}
                </div>
              </div>
            </div>
            
            {/* Topics List */}
            <div className="flex-1 p-6">
              <div className="space-y-3">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelection(topic.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedTopic === topic.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
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
              
              {/* Business Plan Summary Button */}
              {allTopicsComplete && (
                <div className="mt-6">
                  <button
                    onClick={handleShowBusinessPlanSummary}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
                  >
                    Show Business Plan Summary
                  </button>
                </div>
              )}
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

// Business Plan Section Component with Typing Animation
function BusinessPlanSection({ topic, index }: { topic: Topic; index: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (topic.summary) {
      setIsTyping(true);
      let currentIndex = 0;
      const text = topic.summary;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30); // Adjust speed as needed

      return () => clearInterval(typingInterval);
    }
  }, [topic.summary]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {index + 1}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{topic.title}</h3>
          <p className="text-gray-600">Professional summary of your {topic.title.toLowerCase()}</p>
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <div className="text-gray-700 leading-relaxed">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-6 bg-blue-600 ml-1 animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
}

