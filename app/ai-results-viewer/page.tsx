"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function AIResultsViewerPage() {
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const loadAnalysisResults = () => {
      try {
        const analysisResult = localStorage.getItem('aiAnalysisResult');
        if (analysisResult && analysisResult !== 'null' && analysisResult !== 'undefined') {
          const parsed = JSON.parse(analysisResult);
          setAiAnalysisResult(parsed);
          setHasAnalysis(true);
        }
      } catch (error) {
        console.error('Error loading AI analysis:', error);
      }
    };

    loadAnalysisResults();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold text-gray-900 ${inter.className}`}>
                  AI Analysis Results Viewer
                </h1>
                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                  Complete OpenAI analysis results from localStorage
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
                OpenAI Analysis Results
              </h2>
              
              {!hasAnalysis ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${inter.className}`}>
                    No AI Analysis Results Available
                  </h3>
                  <p className={`text-gray-600 mb-6 ${inter.className}`}>
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
                  {aiAnalysisResult.progress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-blue-900 mb-4 ${inter.className}`}>
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
                  {aiAnalysisResult.analysis && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-green-900 mb-4 ${inter.className}`}>
                        📋 Analysis Results by Topic
                      </h3>
                      <div className="space-y-6">
                        {Object.entries(aiAnalysisResult.analysis).map(([topicKey, topicData]: [string, any]) => (
                          <div key={topicKey} className="bg-white rounded-lg p-4 border border-green-200">
                            <h4 className={`text-lg font-semibold text-green-800 mb-3 ${inter.className}`}>
                              {topicKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            {topicData.subtopics && (
                              <div className="space-y-3">
                                {Object.entries(topicData.subtopics).map(([subtopicKey, content]: [string, any]) => (
                                  <div key={subtopicKey} className="bg-gray-50 rounded-lg p-3 border">
                                    <h5 className={`text-sm font-semibold text-gray-700 mb-2 ${inter.className}`}>
                                      {subtopicKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h5>
                                    <div className={`text-sm text-gray-600 ${inter.className}`}>
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
                  {aiAnalysisResult.unassigned && aiAnalysisResult.unassigned.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-yellow-900 mb-4 ${inter.className}`}>
                        ⚠️ Unassigned Content ({aiAnalysisResult.unassigned.length} items)
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysisResult.unassigned.map((item: any, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                            <div className={`text-sm text-gray-700 mb-2 ${inter.className}`}>
                              <strong>Content:</strong> {item.content}
                            </div>
                            <div className={`text-xs text-gray-500 ${inter.className}`}>
                              <strong>Reason:</strong> {item.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw JSON Data */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className={`text-xl font-bold text-gray-900 mb-4 ${inter.className}`}>
                      🔧 Raw JSON Data
                    </h3>
                    <p className={`text-gray-600 mb-4 ${inter.className}`}>
                      Complete raw data from OpenAI API response:
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-mono ${inter.className}`}>
                        {JSON.stringify(aiAnalysisResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
