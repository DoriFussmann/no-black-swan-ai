"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { useState, useEffect } from "react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Typing Effect Component
function TypingEffect() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
     const words = ["create", "build", "analyze", "design"];
  const colors = ["text-blue-600", "text-green-600", "text-purple-600", "text-orange-600"];
  
  const currentWord = words[currentWordIndex];
  const currentColor = colors[currentWordIndex];
  
  useEffect(() => {
    const typingSpeed = isDeleting ? 25 : 50;
    const deletingSpeed = 25;
    const pauseTime = 1000;
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentCharIndex < currentWord.length) {
          setCurrentCharIndex(currentCharIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(currentCharIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => clearTimeout(timer);
  }, [currentCharIndex, isDeleting, currentWordIndex, currentWord.length, words.length]);
  
  return (
    <span className={currentColor}>
      {currentWord.substring(0, currentCharIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                                 <div>
                   <h1 className={`text-3xl text-gray-900 ${inter.className}`}>Rupert AI</h1>
                   <p className={`text-gray-600 ${inter.className}`}>AI-powered business tools and automation</p>
                 </div>
              </div>
                            <div className="flex space-x-3">
                <Link
                  href="/map"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  Map
                </Link>
                <Link
                  href="/feed"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  Feed
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-20">
        <Container>
          {/* Hero Section */}
          <div className="text-left mb-16">
                         <h1 className={`text-5xl md:text-7xl text-gray-900 mb-6 leading-tight ${inter.className}`}>
               What would you like<br />
               the power to <TypingEffect />
             </h1>

          </div>

          {/* Prime Builder Button */}
          <div className="mb-12">
            <Link href="/prime-builder" className="block">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
                             <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Prime Builder</h3>
               <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                 Build your business foundation with our comprehensive suite of AI-powered tools.
               </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                  Get Started
                </span>
              </div>
            </div>
          </Link>
          </div>

          {/* Tools Grid */}
                                           <div className={`mb-8 ${inter.className}`}>
              <h2 className="text-3xl text-gray-900">Presentation Tools</h2>
            </div>

                           {/* Tools Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {/* Annotated Share Price Performance - Active */}
                   <Link href="/aspp-tools" className="block">
                     <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                       <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                         </svg>
                       </div>
                                               <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Price Tracker</h3>
                        <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                          Track share prices with intelligent annotations.
                        </p>
                       <div className="mt-6">
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                           Active
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
                                 <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Deck Builder</h3>
                 <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                   AI-powered presentation creation with professional templates.
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
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                                 <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Investor Hub</h3>
                 <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                   Investor relations platform with secure document sharing.
                 </p>
                <div className="mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Coming Soon
                  </span>
                </div>
              </div>
            </Link>

            {/* Financial Model Builder */}
            <Link href="/financial-model-builder" className="block">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                                 <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Model Builder</h3>
                 <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                   Build financial models with automated calculations.
                 </p>
                <div className="mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Coming Soon
                  </span>
                </div>
              </div>
            </Link>

                               {/* Business Plan Composer - Featured */}
                   <Link href="/business-plan-composer" className="block">
                     <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                       <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                                               <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Business Composer</h3>
                        <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                          AI-powered business plan creation with market analysis.
                        </p>
                       <div className="mt-6">
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                           Featured Tool
                         </span>
                       </div>
                     </div>
                   </Link>
          </div>

          {/* Financial Planning Tools Section */}
                     <div className="mt-16 mb-8">
                           <h2 className={`text-3xl text-gray-900 ${inter.className}`}>Financial Planning Tools</h2>
           </div>

          {/* Financial Planning Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Valuation Tools */}
            <Link href="/valuation-tools" className="block">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                                 <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Valuation Engine</h3>
                 <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                   Advanced startup valuation with football field charts.
                 </p>
                <div className="mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Featured Tool
                  </span>
                </div>
              </div>
            </Link>

            {/* FP&A Tools */}
            <Link href="/fpa-tools" className="block">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                                 <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>FP&A Suite</h3>
                 <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                   Financial planning tools with automated reporting.
                 </p>
                <div className="mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Coming Soon
                  </span>
                </div>
              </div>
            </Link>

            {/* Benchmarking */}
            <Link href="/benchmarking" className="block">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                                 <h3 className={`text-lg text-gray-900 mb-4 ${inter.className}`}>Benchmarking</h3>
                 <p className={`text-gray-600 leading-relaxed flex-grow text-sm ${inter.className}`}>
                   Compare your performance against industry standards and competitors.
                 </p>
                <div className="mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    New Tool
                  </span>
                </div>
              </div>
            </Link>
          </div>

        </Container>
      </main>


    </div>
  );
}
