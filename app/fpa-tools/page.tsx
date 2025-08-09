import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function FpaTools() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">FP&A Tools</h1>
                <p className="text-gray-300">Advanced financial planning and analysis tools</p>
              </div>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              FP&A <span className="text-purple-400">Tools</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced financial planning and analysis tools with automated reporting, KPI tracking, and predictive analytics.
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-700/50 text-center">
            <div className="w-24 h-24 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We&apos;re building the most comprehensive FP&A tools powered by AI. 
              This suite will include automated reporting, KPI tracking, predictive analytics, and advanced financial planning capabilities.
            </p>
            <Link 
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>


    </div>
  );
}

