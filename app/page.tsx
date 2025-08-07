import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={25}
                priority
              />
              <h1 className="text-2xl font-bold text-gray-900">NBS AI Platform</h1>
            </div>
                                      <nav className="hidden md:flex space-x-8">
               <a href="#tools" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                 Tools
               </a>
               <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                 About
               </a>
               <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                 Contact
               </a>
             </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Automate. Accelerate. <span className="text-blue-600">Share Ventures + Early Stage Labs.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness AI and automation to drive smarter, faster startup success.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {/* Business Plan Composer - Featured */}
             <Link href="/business-plan-composer" className="block">
               <div className="bg-white border-2 border-blue-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                 <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Plan Composer</h3>
                 <p className="text-gray-600 leading-relaxed flex-grow">
                   Create comprehensive business plans with AI assistance and market analysis.
                 </p>
                 <div className="mt-6">
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                     Featured Tool
                   </span>
                 </div>
               </div>
             </Link>

                                                   {/* Financial Model Builder */}
              <Link href="/financial-model-builder" className="block">
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Financial Model Builder</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    Build sophisticated financial models with automated calculations and scenario analysis.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Link>

                                                   {/* FP&A Tools */}
              <Link href="/fpa-tools" className="block">
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">FP&A Tools</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    Advanced financial planning and analysis tools with automated reporting and KPI tracking.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Link>

                         {/* Presentation Creator */}
             <Link href="/presentation-creator" className="block">
               <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                 <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Presentation Creator</h3>
                 <p className="text-gray-600 leading-relaxed flex-grow">
                   Generate professional presentations with AI-powered content creation and design templates.
                 </p>
                 <div className="mt-6">
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                     Featured Tool
                   </span>
                 </div>
               </div>
             </Link>

                                                   {/* Investors' Vault */}
              <Link href="/investors-vault" className="block">
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Investors&apos; Vault</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    Comprehensive investor relations platform with secure document sharing and due diligence automation.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Link>

             {/* Valuation Tool */}
             <Link href="/valuation-tool" className="block">
               <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                 <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Valuation Tool</h3>
                 <p className="text-gray-600 leading-relaxed flex-grow">
                   Advanced startup valuation models with multiple methodologies and market analysis.
                 </p>
                 <div className="mt-6">
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                     Coming Soon
                   </span>
                 </div>
               </div>
             </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={20}
              />
              <span className="text-gray-600">© 2024 NBS AI Platform. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
