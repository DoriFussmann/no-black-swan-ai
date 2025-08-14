"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function DebugLocalStoragePage() {
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    const loadAllLocalStorage = () => {
      const data: any = {};
      
      // Check all relevant localStorage keys
      const keys = [
        'fileContents',
        'urlInput', 
        'urlContent',
        'textInput',
        'aiAnalysisResult'
      ];

      keys.forEach(key => {
        const value = localStorage.getItem(key);
        data[key] = value;
      });

      setLocalStorageData(data);
    };

    loadAllLocalStorage();
  }, []);

  const addTestData = () => {
    const testResult = {
      analysis: {
        'executive-summary': {
          subtopics: {
            'brief-company-overview': 'This is a test company overview from AI analysis.',
            'market-opportunity': 'Test market opportunity analysis.',
            'product-service-summary': 'Test product summary from AI.'
          }
        },
        'business-overview': {
          subtopics: {
            'company-description': 'Test company description from AI.',
            'mission-vision': 'Test mission and vision statement.'
          }
        }
      },
      progress: {
        overall: 85,
        byTopic: {
          'executive-summary': 90,
          'business-overview': 80
        }
      },
      unassigned: [
        {
          content: 'Some test content that could not be mapped',
          reason: 'Test reason for unassigned content'
        }
      ]
    };

    localStorage.setItem('aiAnalysisResult', JSON.stringify(testResult));
    
    // Reload the data
    const data: any = {};
    const keys = ['fileContents', 'urlInput', 'urlContent', 'textInput', 'aiAnalysisResult'];
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      data[key] = value;
    });
    setLocalStorageData(data);
  };

  const clearAllData = () => {
    localStorage.removeItem('fileContents');
    localStorage.removeItem('urlInput');
    localStorage.removeItem('urlContent');
    localStorage.removeItem('textInput');
    localStorage.removeItem('aiAnalysisResult');
    
    setLocalStorageData({});
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
                  localStorage Debug Page
                </h1>
                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                  Check what's stored in localStorage and test AI results
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
                localStorage Contents
              </h2>
              
              {/* Action Buttons */}
              <div className="mb-8 flex space-x-4">
                <button
                  onClick={addTestData}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Add Test AI Data
                </button>
                <button
                  onClick={clearAllData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Clear All Data
                </button>
              </div>

              {/* localStorage Data Display */}
              <div className="space-y-6">
                {Object.entries(localStorageData).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${inter.className}`}>
                      {key}
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto">
                      <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-mono ${inter.className}`}>
                        {value ? (key === 'aiAnalysisResult' ? JSON.stringify(JSON.parse(value as string), null, 2) : value) : 'null/undefined'}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${inter.className}`}>
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/feed">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Go to Feed
                    </button>
                  </Link>
                  <Link href="/analyze-data">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                      Go to Analyze Data
                    </button>
                  </Link>
                  <Link href="/ai-results-viewer">
                    <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200">
                      Go to AI Results Viewer
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
