"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { useState } from "react";

export default function FeedPage() {
  // Progress tracking state for each topic
  const [topicProgress, setTopicProgress] = useState({
    executiveSummary: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    businessOverview: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    marketAnalysis: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    productsServices: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    businessModel: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    gtmStrategy: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    operations: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    management: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    financialPlan: { total: 0, aiCompleted: 0, userConfirmed: 0 },
    riskAnalysis: { total: 0, aiCompleted: 0, userConfirmed: 0 }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
                  <p className="text-gray-600">Real-time business intelligence and insights</p>
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
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - User Inputs (25% width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Sources Feed</h2>
                
                {/* Upload File */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, TXT, CSV (max 10MB)</p>
                  </div>
                </div>

                {/* Add Link */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Link
                  </label>
                  <input
                    type="url"
                    placeholder="Enter URL..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Add Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Text
                  </label>
                  <textarea
                    placeholder="Enter or paste text content..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Feed to Data Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Feed to Data
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Data Status (75% width) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Status</h2>
                
                {/* Business Plan Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Executive Summary */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Executive Summary</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.executiveSummary.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.executiveSummary.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.executiveSummary.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.executiveSummary.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Overview */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Business Overview</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.businessOverview.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.businessOverview.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.businessOverview.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessOverview.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Market Analysis</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.marketAnalysis.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.marketAnalysis.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products & Services */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Products & Services</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.productsServices.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.productsServices.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.productsServices.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.productsServices.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Model & Revenue Streams */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Business Model & Revenue Streams</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.businessModel.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.businessModel.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.businessModel.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.businessModel.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GTM Strategy */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Go-to-Market Strategy</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.gtmStrategy.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.gtmStrategy.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operations & Execution Plan */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Operations & Execution Plan</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.operations.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.operations.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.operations.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.operations.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Management & Organization */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Management & Organization</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.management.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.management.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.management.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.management.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Plan & Projections */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Financial Plan & Projections</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.financialPlan.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.financialPlan.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.financialPlan.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.financialPlan.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Analysis & Mitigation */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Risk Analysis & Mitigation</h3>
                    
                    {/* Progress Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-auto">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.total}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.total}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">AI-Generated</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.aiCompleted}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.aiCompleted}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">User-Confirmed</span>
                          <span className="font-medium">{topicProgress.riskAnalysis.userConfirmed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${topicProgress.riskAnalysis.userConfirmed}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
