"use client";

import { useState } from "react";
import Link from "next/link";

interface Topic {
  id: string;
  title: string;
  progress: number;
}

export default function PresentationCreator() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topics] = useState<Topic[]>([
    { id: "cover", title: "Cover", progress: 0 },
    { id: "company-purpose", title: "Company Purpose", progress: 0 },
    { id: "problem", title: "Problem", progress: 0 },
    { id: "solution", title: "Solution", progress: 0 },
    { id: "why-now", title: "Why Now", progress: 0 },
    { id: "market-size", title: "Market Size", progress: 0 },
    { id: "competition", title: "Competition", progress: 0 },
    { id: "product", title: "Product", progress: 0 },
    { id: "business-model", title: "Business Model", progress: 0 },
    { id: "team", title: "Team", progress: 0 },
    { id: "financials", title: "Financials", progress: 0 }
  ]);

  const overallProgress = Math.round(topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length);

  const handleTopicSelection = (topicId: string) => {
    setSelectedTopic(topicId);
  };



  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Deck Builder</h1>
                <p className="text-gray-600">AI-powered presentation creation with professional templates</p>
              </div>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Presentation Creator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build your investor presentation step by step. Select topics and answer questions to create compelling slides.
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

        {/* Selected Topic Details */}
        {selectedTopic && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {topics.find(t => t.id === selectedTopic)?.title}
            </h3>
            <p className="text-gray-600 mb-4">
              This feature is coming soon. You&apos;ll be able to answer questions and build slides for this topic.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Coming Soon:</strong> Interactive question interface, slide preview, and export functionality.
              </p>
            </div>
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            disabled
          >
            Create Presentation (Coming Soon)
          </button>
        </div>
      </main>


    </div>
  );
}

