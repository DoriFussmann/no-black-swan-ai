import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={25}
                className="dark:invert"
                priority
              />
              <h1 className="text-2xl font-bold text-white">NBS AI Platform</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#tools" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Tools
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI-Powered <span className="text-blue-400">Business Tools</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your business operations with our comprehensive suite of AI-driven tools for planning, analysis, and presentation.
            </p>
          </div>

          {/* Tools Grid - 2/3 and 1/3 split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[800px]">
            {/* Left Column - 2/3 width (2 columns) */}
            <div className="lg:col-span-2 space-y-8 h-full">
              {/* Business Plan Composer */}
              <Link href="/business-plan-composer" className="block h-1/2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700/50 h-full cursor-pointer flex flex-col">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Business Plan Composer</h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Create comprehensive business plans with AI assistance. Generate market analysis, financial projections, and strategic roadmaps tailored to your industry.
                  </p>
                </div>
              </Link>

              {/* Financial Model Builder */}
              <Link href="/financial-model-builder" className="block h-1/2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700/50 h-full cursor-pointer flex flex-col">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Financial Model Builder</h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Build sophisticated financial models with automated calculations, scenario analysis, and real-time forecasting capabilities.
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Column - 1/3 width (1 column) */}
            <div className="space-y-8 h-full">
              {/* FP&A Tools */}
              <Link href="/fpa-tools" className="block h-1/3">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700/50 h-full cursor-pointer flex flex-col">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">FP&A Tools</h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Advanced financial planning and analysis tools with automated reporting, KPI tracking, and predictive analytics.
                  </p>
                </div>
              </Link>

              {/* Presentation Creator */}
              <Link href="/presentation-creator" className="block h-1/3">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700/50 h-full cursor-pointer flex flex-col">
                  <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Presentation Creator</h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Generate professional presentations with AI-powered content creation, design templates, and automated slide generation.
                  </p>
                </div>
              </Link>

              {/* Investors' Vault */}
              <Link href="/investors-vault" className="block h-1/3">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700/50 h-full cursor-pointer flex flex-col">
                  <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Investors' Vault</h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Comprehensive investor relations platform with secure document sharing, due diligence automation, and investor communication tools.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700/50 py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={20}
                className="dark:invert"
              />
              <span className="text-gray-300">© 2024 NBS AI Platform. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
