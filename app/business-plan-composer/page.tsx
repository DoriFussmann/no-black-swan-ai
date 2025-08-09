"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";

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
      title: "GTM Strategy",
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

    // Collect all user answers into a comprehensive text block
    const allAnswers = answeredQuestions.map(q => q.answer.trim()).join(" ");
    
    // Generate a professional, coherent summary based on the topic and collected answers
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return "";

    // Process the collected answers to create a professional summary
    return processAnswersIntoSummary(topicId, allAnswers, answeredQuestions);
  };

  const processAnswersIntoSummary = (topicId: string, allAnswers: string, questions: Question[]) => {
    // Extract key information from answers
    const extractInfo = (questionId: string) => {
      const question = questions.find(q => q.id === questionId);
      return question?.answer.trim() || "";
    };

    switch (topicId) {
      case "business-overview":
        const companyName = extractInfo("company-name");
        const businessModel = extractInfo("business-model");
        const mission = extractInfo("mission");
        
        if (!companyName && !businessModel && !mission) {
          return "Please provide information about your company to generate a business overview.";
        }

        // Create a coherent, professional summary
        let summary = "";
        
        if (companyName) {
          summary += `${companyName} `;
        } else {
          summary += "Our company ";
        }
        
        if (businessModel) {
          // Clean up the business model text to avoid awkward concatenations
          let cleanBusinessModel = businessModel.trim();
          
          // Remove common prefixes that might cause awkward concatenations
          if (cleanBusinessModel.toLowerCase().startsWith("we provide ")) {
            cleanBusinessModel = cleanBusinessModel.substring(11); // Remove "We provide "
          }
          if (cleanBusinessModel.toLowerCase().startsWith("we offer ")) {
            cleanBusinessModel = cleanBusinessModel.substring(9); // Remove "We offer "
          }
          if (cleanBusinessModel.toLowerCase().startsWith("we deliver ")) {
            cleanBusinessModel = cleanBusinessModel.substring(11); // Remove "We deliver "
          }
          
          summary += `provides ${cleanBusinessModel}. `;
        } else {
          summary += "provides innovative solutions to meet market needs. ";
        }
        
        if (mission) {
          // Clean up the mission text to avoid awkward concatenations
          let cleanMission = mission.trim();
          
          // Remove common prefixes that might cause awkward concatenations
          if (cleanMission.toLowerCase().startsWith("to ")) {
            cleanMission = cleanMission.substring(3); // Remove "To " prefix
          }
          if (cleanMission.toLowerCase().startsWith("we ")) {
            cleanMission = cleanMission.substring(3); // Remove "We " prefix
          }
          
          summary += `Our mission is to ${cleanMission}. `;
        } else {
          summary += "We are committed to delivering exceptional value to our customers. ";
        }
        
        summary += "We focus on sustainable growth, operational excellence, and market leadership to ensure long-term success.";
        
        return summary;
      
      case "market-summary":
        const targetMarket = extractInfo("target-market");
        const marketSize = extractInfo("market-size");
        
        if (!targetMarket && !marketSize) {
          return "Please provide information about your target market to generate a market summary.";
        }

        let marketSummary = "Our market strategy focuses on ";
        
        if (targetMarket) {
          // Clean up target market text
          let cleanTargetMarket = targetMarket.trim();
          if (cleanTargetMarket.toLowerCase().startsWith("we target ")) {
            cleanTargetMarket = cleanTargetMarket.substring(10);
          }
          if (cleanTargetMarket.toLowerCase().startsWith("our target ")) {
            cleanTargetMarket = cleanTargetMarket.substring(11);
          }
          marketSummary += `${cleanTargetMarket}. `;
        } else {
          marketSummary += "identifying and serving our target customer segments. ";
        }
        
        if (marketSize) {
          // Clean up market size text
          let cleanMarketSize = marketSize.trim();
          if (cleanMarketSize.toLowerCase().startsWith("the market is ")) {
            cleanMarketSize = cleanMarketSize.substring(14);
          }
          if (cleanMarketSize.toLowerCase().startsWith("we estimate ")) {
            cleanMarketSize = cleanMarketSize.substring(12);
          }
          marketSummary += `The market opportunity represents ${cleanMarketSize}. `;
        } else {
          marketSummary += "We have identified significant growth potential in our target markets. ";
        }
        
        marketSummary += "Our comprehensive market analysis supports our strategic initiatives and growth objectives.";
        
        return marketSummary;
      
      case "products-services":
        const mainProduct = extractInfo("main-product");
        const uniqueValue = extractInfo("unique-value");
        
        if (!mainProduct && !uniqueValue) {
          return "Please provide information about your products and services to generate a summary.";
        }

        let productSummary = "Our core offering includes ";
        
        if (mainProduct) {
          // Clean up main product text
          let cleanMainProduct = mainProduct.trim();
          if (cleanMainProduct.toLowerCase().startsWith("we provide ")) {
            cleanMainProduct = cleanMainProduct.substring(11);
          }
          if (cleanMainProduct.toLowerCase().startsWith("we offer ")) {
            cleanMainProduct = cleanMainProduct.substring(9);
          }
          if (cleanMainProduct.toLowerCase().startsWith("our main product is ")) {
            cleanMainProduct = cleanMainProduct.substring(20);
          }
          productSummary += `${cleanMainProduct}. `;
        } else {
          productSummary += "innovative solutions that address market needs. ";
        }
        
        if (uniqueValue) {
          // Clean up unique value text
          let cleanUniqueValue = uniqueValue.trim();
          if (cleanUniqueValue.toLowerCase().startsWith("what sets us apart is ")) {
            cleanUniqueValue = cleanUniqueValue.substring(22);
          }
          if (cleanUniqueValue.toLowerCase().startsWith("our unique value is ")) {
            cleanUniqueValue = cleanUniqueValue.substring(20);
          }
          if (cleanUniqueValue.toLowerCase().startsWith("we differentiate through ")) {
            cleanUniqueValue = cleanUniqueValue.substring(25);
          }
          productSummary += `What sets us apart is ${cleanUniqueValue}. `;
        } else {
          productSummary += "We differentiate ourselves through superior quality and customer service. ";
        }
        
        productSummary += "This positioning enables us to deliver exceptional value while maintaining competitive advantages.";
        
        return productSummary;
      
      case "gtm-strategy":
        const marketingChannels = extractInfo("marketing-channels");
        const pricingStrategy = extractInfo("pricing-strategy");
        
        if (!marketingChannels && !pricingStrategy) {
          return "Please provide information about your go-to-market strategy to generate a summary.";
        }

        let gtmSummary = "Our go-to-market approach utilizes ";
        
        if (marketingChannels) {
          // Clean up marketing channels text
          let cleanMarketingChannels = marketingChannels.trim();
          if (cleanMarketingChannels.toLowerCase().startsWith("we use ")) {
            cleanMarketingChannels = cleanMarketingChannels.substring(7);
          }
          if (cleanMarketingChannels.toLowerCase().startsWith("our channels include ")) {
            cleanMarketingChannels = cleanMarketingChannels.substring(21);
          }
          if (cleanMarketingChannels.toLowerCase().startsWith("we leverage ")) {
            cleanMarketingChannels = cleanMarketingChannels.substring(12);
          }
          gtmSummary += `${cleanMarketingChannels} to reach our target customers. `;
        } else {
          gtmSummary += "multiple channels to maximize market reach and customer acquisition. ";
        }
        
        if (pricingStrategy) {
          // Clean up pricing strategy text
          let cleanPricingStrategy = pricingStrategy.trim();
          if (cleanPricingStrategy.toLowerCase().startsWith("our pricing is ")) {
            cleanPricingStrategy = cleanPricingStrategy.substring(15);
          }
          if (cleanPricingStrategy.toLowerCase().startsWith("we charge ")) {
            cleanPricingStrategy = cleanPricingStrategy.substring(10);
          }
          if (cleanPricingStrategy.toLowerCase().startsWith("our strategy is ")) {
            cleanPricingStrategy = cleanPricingStrategy.substring(16);
          }
          gtmSummary += `Our pricing strategy is ${cleanPricingStrategy}. `;
        } else {
          gtmSummary += "We employ competitive pricing to optimize revenue growth. ";
        }
        
        gtmSummary += "This comprehensive approach enables us to achieve rapid market penetration and sustainable growth.";
        
        return gtmSummary;
      
      case "client-overview":
        const customerSegments = extractInfo("customer-segments");
        const customerJourney = extractInfo("customer-journey");
        
        if (!customerSegments && !customerJourney) {
          return "Please provide information about your customers to generate a client overview.";
        }

        let clientSummary = "Our customer base includes ";
        
        if (customerSegments) {
          // Clean up customer segments text
          let cleanCustomerSegments = customerSegments.trim();
          if (cleanCustomerSegments.toLowerCase().startsWith("our customers are ")) {
            cleanCustomerSegments = cleanCustomerSegments.substring(18);
          }
          if (cleanCustomerSegments.toLowerCase().startsWith("we serve ")) {
            cleanCustomerSegments = cleanCustomerSegments.substring(9);
          }
          if (cleanCustomerSegments.toLowerCase().startsWith("our target customers are ")) {
            cleanCustomerSegments = cleanCustomerSegments.substring(25);
          }
          clientSummary += `${cleanCustomerSegments}. `;
        } else {
          clientSummary += "diverse segments with strong growth potential. ";
        }
        
        if (customerJourney) {
          // Clean up customer journey text
          let cleanCustomerJourney = customerJourney.trim();
          if (cleanCustomerJourney.toLowerCase().startsWith("customers typically ")) {
            cleanCustomerJourney = cleanCustomerJourney.substring(20);
          }
          if (cleanCustomerJourney.toLowerCase().startsWith("the journey involves ")) {
            cleanCustomerJourney = cleanCustomerJourney.substring(20);
          }
          if (cleanCustomerJourney.toLowerCase().startsWith("they discover us through ")) {
            cleanCustomerJourney = cleanCustomerJourney.substring(24);
          }
          clientSummary += `Customers typically ${cleanCustomerJourney}. `;
        } else {
          clientSummary += "We focus on optimizing the customer experience and journey. ";
        }
        
        clientSummary += "Our customer-centric approach ensures high satisfaction and retention rates.";
        
        return clientSummary;
      
      default:
        return "Our comprehensive analysis demonstrates strong market positioning and growth potential.";
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
          ? { 
              ...topic, 
              progress, 
              summary: progress === 100 ? generateTopicSummary(topicId) : topic.summary 
            }
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
          title: "GTM Strategy",
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

  // Business Plan Summary Screen
  if (showSummary) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Business Plan Summary</h1>
                  <p className="text-gray-600">Your comprehensive business plan generated from your responses</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToCompiler}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Back to Compiler
                </button>
                <Link 
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Return to Home
                </Link>
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
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Plan Compiler</h1>
                <p className="text-gray-600">AI-powered business plan creation and management</p>
              </div>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 flex max-w-[1200px] mx-auto">
        {/* Left Column - Chat Zone (50% width) */}
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
                          const newProgress = Math.round((answeredCount / totalCount) * 100);
                          
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
            <div className="p-6 border-b border-gray-200 h-32 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Core Topics</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShowBusinessPlanSummary}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Show Summary
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
              
              {/* Business Plan Summary Button - Removed since it's now in header */}
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

