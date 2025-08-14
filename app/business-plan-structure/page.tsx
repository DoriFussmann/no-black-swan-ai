"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function BusinessPlanStructurePage() {
  // State for editing sections
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, { subtopics: string; questions: string }>>({
    'executive-summary': {
      subtopics: `• Brief company overview
• Market opportunity
• Product/service summary
• Business model
• Key milestones
• Financial snapshot
• Funding ask`,
      questions: `• What is the one-sentence description of the business?
• What problem do you solve and for whom?
• What is the size of the opportunity?
• What are the most important milestones to date?
• What is the financial headline (revenue, growth, profitability)?
• How much funding are you seeking, and for what purpose?`
    },
    'business-overview': {
      subtopics: `• Company Description
• Mission & Vision
• Value Proposition
• Why Now
• Current Stage & Milestones Achieved
• Strategic Objectives`,
      questions: `• What is the legal structure, location, and date of incorporation?
• What's the history and evolution of the company?
• What is the company's mission statement?
• What is the long-term vision?
• What core problem do you solve and why is your solution unique?
• Why is now the right time for this business?
• What are your top 3–5 goals for the next 12–36 months?`
    },
    'market-analysis': {
      subtopics: `• Market Definition
• Market Size & Growth
• Market Trends & Drivers
• Competitive Landscape
• Comparable Companies & Benchmarks
• Regulatory & Industry Considerations`,
      questions: `• What industry are you in and what are its boundaries?
• What segments and geographies do you serve?
• What is your TAM, SAM, and SOM?
• What are the historic and projected growth rates?
• What macro trends and customer behaviors shape demand?
• Who are your direct and indirect competitors?
• What are your competitive advantages and weaknesses?
• What similar companies exist and what are their benchmarks?
• What regulations or standards impact your business?`
    },
    'products-services': {
      subtopics: `• Overview of Offerings
• Problem–Solution Fit
• Unique Selling Points (USPs)
• Development Status & Roadmap
• Intellectual Property & Proprietary Assets
• Pricing & Packaging
• Customer Experience & Support`,
      questions: `• What are your main products/services and features?
• How do you solve your customers' problems?
• What makes you different from competitors?
• What stage are your offerings in and what's next?
• What patents, trademarks, or trade secrets do you own?
• How do you price your offerings and why?
• How do customers interact with your product/service and what support do you provide?`
    },
    'business-model': {
      subtopics: `• Core Revenue Model
• Secondary Revenue Streams
• Monetization Strategy
• Unit Economics
• Revenue Drivers
• Scalability & Leverage
• Partnerships & Channels`,
      questions: `• How do you make money and why is this model suited to your market?
• Do you have add-on revenue sources?
• How do you design pricing to maximize revenue?
• What is your CAC, LTV, and contribution margin?
• What are the main levers for revenue growth?
• How does your cost structure change as you scale?
• Do you have revenue-sharing or distribution agreements?`
    },
    'gtm': {
      subtopics: `• Target Customer Segments
• Positioning & Messaging
• Marketing Strategy
• Sales Strategy
• Customer Acquisition Channels
• Partnerships & Strategic Alliances
• Retention & Expansion Strategy
• KPIs & Tracking`,
      questions: `• Who are your ideal customers?
• How do you communicate your value proposition?
• Which channels do you use for awareness and demand generation?
• What is your sales model and process?
• Which channels drive the most conversions?
• Who are your key GTM partners?
• How do you keep and grow customers?
• What metrics measure GTM success?`
    },
    'execution-plan': {
      subtopics: `• Operating Model
• Location & Facilities
• Technology & Infrastructure
• Supply Chain & Logistics
• Key Processes & Quality Control
• Execution Roadmap
• KPIs & Operational Metrics`,
      questions: `• How do you deliver your product/service?
• Where do you operate from?
• What tools, platforms, and systems do you use?
• How do you source, produce, and distribute?
• How do you ensure consistent quality?
• What are your operational milestones?
• How do you measure operational performance?`
    },
    'team': {
      subtopics: `• Organizational Structure
• Leadership Team
• Advisors & Board Members
• Hiring Plan
• Culture & Values
• Governance & Decision-Making`,
      questions: `• What is your org chart?
• Who are the key leaders, and what are their backgrounds?
• Who advises or governs the company?
• What roles do you need to fill and when?
• What principles guide your company?
• How are major decisions made?`
    },
    'financial-plan': {
      subtopics: `• Historical Financials
• Revenue Projections
• Expense Projections
• Profitability & Break-Even Analysis
• Cash Flow Forecast
• Capital Requirements & Use of Funds
• Key Financial Ratios & Metrics
• Scenario Analysis`,
      questions: `• What are your past P&L, balance sheet, and cash flow results?
• How will revenue grow by product, region, and channel?
• How will costs evolve?
• When will you become profitable?
• How will cash move over time?
• How much funding do you need and for what?
• What are your key performance metrics?
• What are your base, upside, and downside cases?`
    },
    'risk-analysis': {
      subtopics: `• Market Risks
• Operational Risks
• Financial Risks
• Regulatory & Legal Risks
• Technology Risks
• Mitigation Strategies
• Monitoring & Early Warning Systems`,
      questions: `• What could change in demand or competition?
• What could disrupt delivery or operations?
• What could cause funding or cost issues?
• What compliance or legal issues could arise?
• What are your tech vulnerabilities?
• How will you address these risks?
• How will you detect risks early?`
    }
  });

  const [tempContent, setTempContent] = useState<{ subtopics: string; questions: string }>({ subtopics: '', questions: '' });

  const handleEdit = (sectionId: string) => {
    setEditingSection(sectionId);
    setTempContent(sectionContent[sectionId] || { subtopics: '', questions: '' });
  };

  const handleSave = (sectionId: string) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionId]: tempContent
    }));
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const renderSection = (sectionId: string, title: string, colorScheme: string) => {
    const isEditing = editingSection === sectionId;
    const content = sectionContent[sectionId] || { subtopics: '', questions: '' };

    return (
      <div className={`bg-${colorScheme}-50 border border-${colorScheme}-200 rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold text-${colorScheme}-900 ${inter.className}`}>{title}</h3>
          {!isEditing ? (
            <button
              onClick={() => handleEdit(sectionId)}
              className={`px-3 py-1 bg-${colorScheme}-600 text-white rounded-md hover:bg-${colorScheme}-700 transition-colors duration-200 text-sm`}
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave(sectionId)}
                className={`px-3 py-1 bg-${colorScheme}-600 text-white rounded-md hover:bg-${colorScheme}-700 transition-colors duration-200 text-sm`}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className={`text-lg font-semibold text-${colorScheme}-800 mb-3 ${inter.className}`}>Sub Topics:</h4>
            {isEditing ? (
              <textarea
                value={tempContent.subtopics}
                onChange={(e) => setTempContent(prev => ({ ...prev, subtopics: e.target.value }))}
                className={`w-full h-48 p-3 border border-${colorScheme}-300 rounded-md text-sm text-${colorScheme}-700 bg-white resize-none`}
                placeholder="Enter subtopics..."
              />
            ) : (
              <div className={`text-sm text-${colorScheme}-700 space-y-1 ${inter.className}`}>
                {content.subtopics.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold text-${colorScheme}-800 mb-3 ${inter.className}`}>Key Questions:</h4>
            {isEditing ? (
              <textarea
                value={tempContent.questions}
                onChange={(e) => setTempContent(prev => ({ ...prev, questions: e.target.value }))}
                className={`w-full h-48 p-3 border border-${colorScheme}-300 rounded-md text-sm text-${colorScheme}-700 bg-white resize-none`}
                placeholder="Enter key questions..."
              />
            ) : (
              <div className={`text-sm text-${colorScheme}-700 space-y-1 ${inter.className}`}>
                {content.questions.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                  Business Plan Structure
                </h1>
                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                  Organize and structure your business plan components
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

          {/* Main Content - Full Width */}
          <div className="w-full">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className={`text-2xl font-bold text-gray-900 mb-8 ${inter.className}`}>
                Comprehensive Business Plan Structure – Topics, Subtopics & Key Questions
              </h2>
              
              {/* Business Plan Structure Content */}
              <div className="space-y-8">
                {renderSection('executive-summary', '1. Executive Summary', 'blue')}
                {renderSection('business-overview', '2. Business Overview', 'green')}
                {renderSection('market-analysis', '3. Market Analysis', 'purple')}
                {renderSection('products-services', '4. Products & Services', 'orange')}
                {renderSection('business-model', '5. Business Model', 'red')}
                {renderSection('gtm', '6. GTM', 'indigo')}
                {renderSection('execution-plan', '7. Execution Plan', 'teal')}
                {renderSection('team', '8. Team', 'pink')}
                {renderSection('financial-plan', '9. Financial Plan', 'yellow')}
                {renderSection('risk-analysis', '10. Risk Analysis', 'gray')}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
