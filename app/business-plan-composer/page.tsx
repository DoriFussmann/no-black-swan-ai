"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import Container from "@/components/Container";

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
      const data = {
        topics,
        topicQuestions
      };
      localStorage.setItem("businessPlanData", JSON.stringify(data));
    };

    const interval = setInterval(saveData, 5000); // Save every 5 seconds
    return () => clearInterval(interval);
  }, [topics, topicQuestions]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("businessPlanData");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.topics) setTopics(data.topics);
        if (data.topicQuestions) setTopicQuestions(data.topicQuestions);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);





  const getCurrentQuestion = () => {
    if (!selectedTopic) return null;
    const questions = topicQuestions[selectedTopic];
    return questions ? questions[currentQuestionIndex] : null;
  };

  const handleAnswerChange = (answer: string) => {
    if (!selectedTopic) return;
    
    const newTopicQuestions = { ...topicQuestions };
    newTopicQuestions[selectedTopic][currentQuestionIndex].answer = answer;
    setTopicQuestions(newTopicQuestions);
    
    // Update progress for this topic
    updateTopicProgress(selectedTopic);
  };

  const generateTopicSummary = (topicId: string) => {
    const questions = topicQuestions[topicId];
    if (!questions) return;
    
    const allAnswers = questions.map(q => q.answer).join(" ");
    const summary = processAnswersIntoSummary(topicId, allAnswers, questions);
    
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, summary } : topic
    ));
  };

  const processAnswersIntoSummary = (topicId: string, allAnswers: string, questions: Question[]) => {
    const extractInfo = (questionId: string) => {
      const question = questions.find(q => q.id === questionId);
      return question?.answer || "";
    };

    switch (topicId) {
      case "business-overview":
        return `Company: ${extractInfo("company-name")}. Business Model: ${extractInfo("business-model")}. Mission: ${extractInfo("mission")}`;
      case "market-summary":
        return `Target Market: ${extractInfo("target-market")}. Market Size: ${extractInfo("market-size")}`;
      case "products-services":
        return `Main Product: ${extractInfo("main-product")}. Unique Value: ${extractInfo("unique-value")}`;
      case "gtm-strategy":
        return `Marketing Channels: ${extractInfo("marketing-channels")}. Pricing Strategy: ${extractInfo("pricing-strategy")}`;
      case "client-overview":
        return `Customer Segments: ${extractInfo("customer-segments")}. Customer Journey: ${extractInfo("customer-journey")}`;
      default:
        return allAnswers;
    }
  };

  const updateTopicProgress = (topicId: string) => {
    const questions = topicQuestions[topicId];
    if (!questions) return;
    
    const answeredCount = questions.filter(q => q.answer.trim()).length;
    const totalCount = questions.length;
    const progress = Math.round((answeredCount / totalCount) * 100);
    
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, progress } : topic
    ));
  };

  const handleSubmit = async () => {
    if (!selectedTopic) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate summary for the current topic
      generateTopicSummary(selectedTopic);
      
      // Move to next question or complete topic
      const questions = topicQuestions[selectedTopic];
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Topic completed
        setCurrentQuestionIndex(0);
        setSelectedTopic(null);
      }
      
      // Save data
      const data = { topics, topicQuestions };
      localStorage.setItem("businessPlanData", JSON.stringify(data));
      
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDefault = () => {
    if (!selectedTopic) return;
    
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    const defaultAnswer = currentQuestion.example.replace("Example: ", "");
    handleAnswerChange(defaultAnswer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };



  const handleTopicSelection = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
    setIsEditing(false);
  };





  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      setTopics(prev => prev.map(topic => ({ ...topic, progress: 0, summary: "" })));
      setTopicQuestions(prev => {
        const newQuestions = { ...prev };
        Object.keys(newQuestions).forEach(topicId => {
          newQuestions[topicId] = newQuestions[topicId].map(q => ({ ...q, answer: "" }));
        });
        return newQuestions;
      });
      setSelectedTopic(null);
      setCurrentQuestionIndex(0);
      setShowSummary(false);
      
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
          <Container>
            <div className="py-6">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Back to Compiler
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Summary Content */}
        <main className="py-12">
          <Container>
            <div className="space-y-8">
              {topics.map((topic, index) => (
                <BusinessPlanSection key={topic.id} topic={topic} index={index} />
              ))}
            </div>
          </Container>
        </main>
      </div>
    );
  }

  // Main component return
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Business Plan Composer</h1>
                  <p className="text-gray-600">Build your business plan step by step with AI assistance</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShowBusinessPlanSummary}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  View Summary
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Home
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Business Plan Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Answer questions for each section to build a comprehensive business plan. Your progress is automatically saved.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{overallProgress}%</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleTopicSelection(topic.id)}
                className={`
                  bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 p-6 hover:shadow-lg
                  ${selectedTopic === topic.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{topic.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Interface */}
          {selectedTopic && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {topics.find(t => t.id === selectedTopic)?.title}
              </h3>
              {renderChatInterface()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Back to Home
            </Link>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Reset All Data
            </button>
          </div>
        </Container>
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

