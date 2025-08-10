"use client";

import { useState } from "react";
import Link from "next/link";
import { HomeIcon, BuildingOfficeIcon, DocumentTextIcon, ChartBarIcon, CogIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Container from "@/components/Container";

export default function PrimeBuilderPage() {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFlow, setShowFlow] = useState<boolean>(false);
  const [showFirstBox, setShowFirstBox] = useState<boolean>(false);
  const [showSecondBox, setShowSecondBox] = useState<boolean>(false);
  const [showThirdBox, setShowThirdBox] = useState<boolean>(false);
  const [showProgressCheck, setShowProgressCheck] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedSubOption, setSelectedSubOption] = useState<string>("");

  // Progress tracking state
  const [businessComposerProgress, setBusinessComposerProgress] = useState({
    total: 0,
    aiCompleted: 0,
    userConfirmed: 0
  });
  const [modelBuilderProgress, setModelBuilderProgress] = useState({
    total: 0,
    aiCompleted: 0,
    userConfirmed: 0
  });
  const [investorPresentationProgress, setInvestorPresentationProgress] = useState({
    total: 0,
    aiCompleted: 0,
    userConfirmed: 0
  });

  const dropdownOptions = [
    "Preparing a presentation",
    "Answer an email", 
    "Analyze something"
  ];

  const getSubOptions = (option: string) => {
    switch (option) {
      case "Preparing a presentation":
        return ["Investor Presentation", "Board Deck", "Investors' Update"];
      case "Answer an email":
        return ["Answer an Investor", "Answer a Client", "Other"];
      case "Analyze something":
        return ["FP&A Analysis", "Other"];
      default:
        return [];
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setSelectedSubOption("");
    setIsGenerated(false);
  };

  const handleSubOptionSelect = (subOption: string) => {
    setSelectedSubOption(subOption);
    setIsGenerated(false);
  };

  const handleGenerate = () => {
    if (selectedOption && selectedSubOption) {
      setIsLoading(true);
      setIsGenerated(true);
      
             // Reset all animation states
       setShowFlow(false);
       setShowFirstBox(false);
       setShowSecondBox(false);
       setShowThirdBox(false);
       setShowProgressCheck(false);
       
       // Start the animation sequence after 1.5 seconds (reduced by half)
       setTimeout(() => {
         setIsLoading(false);
         setShowFlow(true);
         
         // Show first box after a short delay
         setTimeout(() => {
           setShowFirstBox(true);
           
           // Show second box after another delay
           setTimeout(() => {
             setShowSecondBox(true);
             
             // Show third box after final delay
             setTimeout(() => {
               setShowThirdBox(true);
               
               // Show progress check loader after all boxes are visible
               setTimeout(() => {
                 setShowProgressCheck(true);
                 
                 // Simulate progress updates after progress check
                 setTimeout(() => {
                   setShowProgressCheck(false);
                   setBusinessComposerProgress({ total: 85, aiCompleted: 85, userConfirmed: 0 });
                 }, 1500);
                 
                 setTimeout(() => {
                   setModelBuilderProgress({ total: 60, aiCompleted: 60, userConfirmed: 0 });
                 }, 2000);
                 
                 setTimeout(() => {
                   setInvestorPresentationProgress({ total: 0, aiCompleted: 0, userConfirmed: 0 });
                 }, 2500);
               }, 500);
             }, 500);
           }, 500);
         }, 300);
       }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Prime Builder</h1>
                  <p className="text-gray-600">Build your business foundation with AI-powered tools</p>
                </div>
              </div>
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
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
            {/* Left Column - Input Selection (25% width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">What would you like the power to do today?</h2>
                
                {/* First Dropdown Selection */}
                <div className="mb-6">
                  <select
                    value={selectedOption}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">Select an option...</option>
                    {dropdownOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Second Dropdown Selection */}
                {selectedOption && (
                  <div className="mb-6">
                    <select
                      value={selectedSubOption}
                      onChange={(e) => handleSubOptionSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                    >
                      <option value="">Select a type...</option>
                      {getSubOptions(selectedOption).map((subOption) => (
                        <option key={subOption} value={subOption}>
                          {subOption}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedOption || !selectedSubOption}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedOption && selectedSubOption
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Builder Interface (75% width) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Builder Interface</h2>
                
                {!selectedOption ? (
                  <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Select what you'd like to do today</p>
                    </div>
                  </div>
                ) : !selectedSubOption ? (
                  <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Now select the specific type</p>
                    </div>
                  </div>
                ) : !isGenerated ? (
                  <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Click "Get Started" to begin {selectedSubOption.toLowerCase()}</p>
                    </div>
                  </div>
                                 ) : (
                   <div>
                                           {/* Loading Screen */}
                      {isLoading && (
                        <div className="flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                          <div className="bg-white rounded-xl p-8 shadow-2xl text-center border border-gray-200">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Building Your Flow</h3>
                            <p className="text-gray-600">Preparing your tools and workflow...</p>
                          </div>
                        </div>
                      )}

                     {/* Builder Content Area */}
                     {selectedSubOption === "Investor Presentation" ? (
                       <div className="bg-white rounded-lg p-6 border border-gray-200">
                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Required Tools & Flow</h3>
                         
                                                   {/* Flow Diagram */}
                          {showFlow && (
                            <div className="flex items-start justify-between mb-8">
                              {/* Business Composer Column */}
                              <div className="flex flex-col items-center">
                                                                 {/* Business Composer Box */}
                                 <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-lg flex flex-col w-[200px] h-[220px] transition-all duration-700 transform relative ${
                                   showFirstBox ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                                 }`}>
                                  {/* Status Indicator */}
                                  {businessComposerProgress.userConfirmed === 100 && (
                                    <div className="absolute -top-2 -right-2">
                                      <CheckCircleIcon className="w-8 h-8 text-green-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  {businessComposerProgress.total > 0 && businessComposerProgress.userConfirmed < 100 && (
                                    <div className="absolute -top-2 -right-2">
                                      <CheckCircleIcon className="w-8 h-8 text-orange-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  
                                                                     <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                                     <DocumentTextIcon className="w-6 h-6 text-white" />
                                   </div>
                                   <h4 className="text-lg font-bold text-gray-900 mb-3">Business Composer</h4>
                                  <div className="mt-auto">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                      Required Tool
                                    </span>
                                  </div>
                                </div>

                                                                                                  {/* Progress Box */}
                                 {businessComposerProgress.total > 0 && (
                                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3 w-[200px]">
                                     <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                                     <div className="space-y-1.5">
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">Completed</span>
                                         <span className="font-medium">{businessComposerProgress.total}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${businessComposerProgress.total}%` }}></div>
                                       </div>
                                       
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">AI-Generated</span>
                                         <span className="font-medium">{businessComposerProgress.aiCompleted}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${businessComposerProgress.aiCompleted}%` }}></div>
                                       </div>
                                       
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">User-Confirmed</span>
                                         <span className="font-medium">{businessComposerProgress.userConfirmed}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${businessComposerProgress.userConfirmed}%` }}></div>
                                       </div>
                                     </div>
                                   </div>
                                 )}
                              </div>

                                                             {/* Plus Sign */}
                               <div className={`flex items-center transition-all duration-700 transform mt-28 flex-shrink-0 ${
                                 showFirstBox ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                               }`}>
                                 <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                   <span className="text-white font-bold text-sm">+</span>
                                 </div>
                               </div>

                              {/* Model Builder Column */}
                              <div className="flex flex-col items-center">
                                                                 {/* Model Builder Box */}
                                 <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-lg flex flex-col w-[200px] h-[220px] transition-all duration-700 transform relative ${
                                   showSecondBox ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                                 }`}>
                                  {/* Status Indicator */}
                                  {modelBuilderProgress.userConfirmed === 100 && (
                                    <div className="absolute -top-2 -right-2">
                                      <CheckCircleIcon className="w-8 h-8 text-green-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  {modelBuilderProgress.total > 0 && modelBuilderProgress.userConfirmed < 100 && (
                                    <div className="absolute -top-2 -right-2">
                                      <CheckCircleIcon className="w-8 h-8 text-orange-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  
                                                                     <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                                     <ChartBarIcon className="w-6 h-6 text-white" />
                                   </div>
                                   <h4 className="text-lg font-bold text-gray-900 mb-3">Model Builder</h4>
                                  <div className="mt-auto">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                      Required Tool
                                    </span>
                                  </div>
                                </div>

                                                                                                  {/* Progress Box */}
                                 {modelBuilderProgress.total > 0 && (
                                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3 w-[200px]">
                                     <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                                     <div className="space-y-1.5">
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">Completed</span>
                                         <span className="font-medium">{modelBuilderProgress.total}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-green-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${modelBuilderProgress.total}%` }}></div>
                                       </div>
                                       
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">AI-Generated</span>
                                         <span className="font-medium">{modelBuilderProgress.aiCompleted}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${modelBuilderProgress.aiCompleted}%` }}></div>
                                       </div>
                                       
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">User-Confirmed</span>
                                         <span className="font-medium">{modelBuilderProgress.userConfirmed}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${modelBuilderProgress.userConfirmed}%` }}></div>
                                       </div>
                                     </div>
                                   </div>
                                 )}
                              </div>

                                                             {/* Arrow */}
                               <div className={`flex items-center transition-all duration-700 transform mt-28 flex-shrink-0 ${
                                 showSecondBox ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                               }`}>
                                 <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                 </svg>
                               </div>

                              {/* Investor Presentation Column */}
                              <div className="flex flex-col items-center">
                                                                 {/* Investor Presentation Box */}
                                 <div className={`bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 shadow-lg flex flex-col w-[200px] h-[220px] transition-all duration-700 transform relative ${
                                   showThirdBox ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                                 }`}>
                                  {/* Status Indicator */}
                                  {investorPresentationProgress.userConfirmed === 100 && (
                                    <div className="absolute -top-2 -right-2">
                                      <CheckCircleIcon className="w-8 h-8 text-green-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  {investorPresentationProgress.total > 0 && investorPresentationProgress.userConfirmed < 100 && (
                                    <div className="absolute -top-2 -right-2">
                                      <CheckCircleIcon className="w-8 h-8 text-orange-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  
                                                                     <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                                     <BuildingOfficeIcon className="w-6 h-6 text-white" />
                                   </div>
                                   <h4 className="text-lg font-bold text-purple-900 mb-3">Investor Presentation</h4>
                                  <div className="mt-auto">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                      Final Output
                                    </span>
                                  </div>
                                </div>

                                                                                                  {/* Progress Box */}
                                 {investorPresentationProgress.total > 0 && (
                                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3 w-[200px]">
                                     <h5 className="text-xs font-semibold text-gray-900 mb-2">Progress</h5>
                                     <div className="space-y-1.5">
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">Completed</span>
                                         <span className="font-medium">{investorPresentationProgress.total}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${investorPresentationProgress.total}%` }}></div>
                                       </div>
                                       
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">AI-Generated</span>
                                         <span className="font-medium">{investorPresentationProgress.aiCompleted}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${investorPresentationProgress.aiCompleted}%` }}></div>
                                       </div>
                                       
                                       <div className="flex justify-between text-xs">
                                         <span className="text-gray-600">User-Confirmed</span>
                                         <span className="font-medium">{investorPresentationProgress.userConfirmed}%</span>
                                       </div>
                                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                                         <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${investorPresentationProgress.userConfirmed}%` }}></div>
                                       </div>
                                     </div>
                                   </div>
                                 )}
                              </div>
                            </div>
                          )}

                        {/* Description */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                          <p className="text-gray-600 text-sm">
                            To create an Investor Presentation, you'll need to first use the Business Composer to create your business plan, 
                            then use the Model Builder to create your financial model. These two components will be automatically combined 
                            to generate your professional Investor Presentation.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                        <div style={{ aspectRatio: '16/9' }}>
                          <div className="flex items-center justify-center h-full text-purple-600">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <BuildingOfficeIcon className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">
                                {selectedSubOption}
                              </h3>
                              <p className="text-sm text-purple-600">
                                Interface coming soon...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
