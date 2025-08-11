"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { useState } from "react";

export default function MapPage() {
  // Progress tracking state for each topic
  const [topicProgress] = useState({
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
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                                 <div>
                   <h1 className="text-3xl font-bold text-gray-900">Map</h1>
                   <p className="text-gray-600">Comprehensive business plan structure and navigation</p>
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
                     {/* Full Width Business Plan Map Output Box */}
           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            
                                        {/* Business Plan Topics Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {/* Executive Summary */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Executive Summary</h3>
                                                               <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center justify-between">
                          <span>• Brief company overview</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Market opportunity</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Product/service summary</span>
                          <div className="w-4 h-4 border-2 border-green-500 rounded bg-green-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Business model</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Key milestones</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Financial snapshot</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Funding ask</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                      </ul>
                    
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
                                                               <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center justify-between">
                          <span>• Company Description</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Mission & Vision</span>
                          <div className="w-4 h-4 border-2 border-green-500 rounded bg-green-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Value Proposition</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Why Now</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Current Stage & Milestones Achieved</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Strategic Objectives</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                      </ul>
                    
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
                                                               <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center justify-between">
                          <span>• Market Definition</span>
                          <div className="w-4 h-4 border-2 border-green-500 rounded bg-green-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Market Size & Growth</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Market Trends & Drivers</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Competitive Landscape</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Comparable Companies & Benchmarks</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Regulatory & Industry Considerations</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                      </ul>
                    
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
                                                               <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-center justify-between">
                          <span>• Overview of Offerings</span>
                          <div className="w-4 h-4 border-2 border-green-500 rounded bg-green-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Problem–Solution Fit</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Unique Selling Points (USPs)</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Development Status & Roadmap</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Intellectual Property & Proprietary Assets</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Pricing & Packaging</span>
                          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>• Customer Experience & Support</span>
                          <div className="w-4 h-4 border-2 border-orange-500 rounded bg-orange-500"></div>
                        </li>
                      </ul>
                    
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
                                         <ul className="text-sm text-gray-600 space-y-2 mb-4">
                       <li>• Core Revenue Model</li>
                       <li>• Secondary Revenue Streams</li>
                       <li>• Monetization Strategy</li>
                       <li>• Unit Economics</li>
                       <li>• Revenue Drivers</li>
                       <li>• Scalability & Leverage</li>
                       <li>• Partnerships & Channels</li>
                     </ul>
                    
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
                   <ul className="text-sm text-gray-600 space-y-2 mb-4">
                     <li>• Target Customer Segments</li>
                     <li>• Positioning & Messaging</li>
                     <li>• Marketing Strategy</li>
                     <li>• Sales Strategy</li>
                     <li>• Customer Acquisition Channels</li>
                     <li>• Partnerships & Strategic Alliances</li>
                     <li>• Retention & Expansion Strategy</li>
                     <li>• KPIs & Tracking</li>
                   </ul>
                   
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
                   <ul className="text-sm text-gray-600 space-y-2 mb-4">
                     <li>• Operating Model</li>
                     <li>• Location & Facilities</li>
                     <li>• Technology & Infrastructure</li>
                     <li>• Supply Chain & Logistics</li>
                     <li>• Key Processes & Quality Control</li>
                     <li>• Execution Roadmap</li>
                     <li>• KPIs & Operational Metrics</li>
                   </ul>
                   
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
                   <ul className="text-sm text-gray-600 space-y-2 mb-4">
                     <li>• Organizational Structure</li>
                     <li>• Leadership Team</li>
                     <li>• Advisors & Board Members</li>
                     <li>• Hiring Plan</li>
                     <li>• Culture & Values</li>
                     <li>• Governance & Decision-Making</li>
                   </ul>
                   
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
                   <ul className="text-sm text-gray-600 space-y-2 mb-4">
                     <li>• Historical Financials</li>
                     <li>• Revenue Projections</li>
                     <li>• Expense Projections</li>
                     <li>• Profitability & Break-Even Analysis</li>
                     <li>• Cash Flow Forecast</li>
                     <li>• Capital Requirements & Use of Funds</li>
                     <li>• Key Financial Ratios & Metrics</li>
                     <li>• Scenario Analysis</li>
                   </ul>
                   
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
                   <ul className="text-sm text-gray-600 space-y-2 mb-4">
                     <li>• Market Risks</li>
                     <li>• Operational Risks</li>
                     <li>• Financial Risks</li>
                     <li>• Regulatory & Legal Risks</li>
                     <li>• Technology Risks</li>
                     <li>• Mitigation Strategies</li>
                     <li>• Monitoring & Early Warning Systems</li>
                   </ul>
                   
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
        </Container>
      </main>
    </div>
  );
}
