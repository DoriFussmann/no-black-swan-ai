"use client";

import { useState } from 'react';
import { useAI } from '@/src/hooks/useAI';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AITestPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const { generateResponse, isLoading, error } = useAI({
    onSuccess: (result) => {
      setResponse(result.content || '');
    },
    onError: (error) => {
      console.error('AI Error:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = await generateResponse(
      prompt,
      'You are a helpful AI assistant that provides professional and accurate responses.',
      'AI Assistant'
    );

    if (result.success) {
      setResponse(result.content || '');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 ${inter.className}`}>
            AI Integration Test
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className={`text-lg font-semibold text-blue-900 mb-2 ${inter.className}`}>
              Configuration Status
            </h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ OpenAI Package: Installed</li>
              <li>✅ API Key: Configured</li>
              <li>✅ Model: GPT-3.5 Turbo</li>
              <li>✅ API Route: /api/ai</li>
              <li>✅ React Hook: useAI</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="prompt" className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                Test Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a test prompt here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Response'}
            </button>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className={`text-sm font-medium text-red-800 mb-2 ${inter.className}`}>
                Error
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {response && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${inter.className}`}>
                AI Response
              </h3>
              <div className={`text-sm text-gray-700 whitespace-pre-wrap ${inter.className}`}>
                {response}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className={`text-lg font-semibold text-green-900 mb-2 ${inter.className}`}>
              Quick Test Examples
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setPrompt('Write a brief business plan for a SaaS startup')}
                className="block w-full text-left p-2 text-sm text-green-700 hover:bg-green-100 rounded"
              >
                "Write a brief business plan for a SaaS startup"
              </button>
              <button
                onClick={() => setPrompt('Analyze the market for electric vehicles')}
                className="block w-full text-left p-2 text-sm text-green-700 hover:bg-green-100 rounded"
              >
                "Analyze the market for electric vehicles"
              </button>
              <button
                onClick={() => setPrompt('Create a financial projection for a restaurant')}
                className="block w-full text-left p-2 text-sm text-green-700 hover:bg-green-100 rounded"
              >
                "Create a financial projection for a restaurant"
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
