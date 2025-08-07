import Link from "next/link";
import Image from "next/image";

export default function FpaTools() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <Image
                  src="/next.svg"
                  alt="Next.js logo"
                  width={120}
                  height={25}
                  className="dark:invert"
                  priority
                />
                <span className="text-2xl font-bold text-white">NBS AI Platform</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
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
              We're building the most comprehensive FP&A tools powered by AI. 
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

