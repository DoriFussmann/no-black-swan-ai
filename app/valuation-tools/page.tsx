"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ValuationTools() {
  const [inputs, setInputs] = useState({
    companySales: "",
    companyEBITDA: "",
    totalSharesOutstanding: "",
    netDebt: "",
    fiftyTwoWeekHigh: "",
    fiftyTwoWeekLow: "",
    publicCompsEVSalesLow: "",
    publicCompsEVSalesHigh: "",
    publicCompsEVEBITDALow: "",
    publicCompsEVEBITDAHigh: "",
    precedentTxEVSalesLow: "",
    precedentTxEVSalesHigh: "",
    precedentTxEVEBITDALow: "",
    precedentTxEVEBITDAHigh: "",
    dcfLow: "",
    dcfHigh: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/globe.svg"
                alt="NBS AI Platform"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">NBS AI Platform</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Home
              </Link>
              <Link href="/business-plan-composer" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Business Plan Composer
              </Link>
              <Link href="/financial-model-builder" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Financial Model Builder
              </Link>
              <Link href="/presentation-creator" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Presentation Creator
              </Link>
              <Link href="/investors-vault" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Investors Vault
              </Link>
              <Link href="/aspp-tools" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                ASPP Tools
              </Link>
              <Link href="/fpa-tools" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                FPA Tools
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Valuation Tools</h1>
          <p className="text-lg text-gray-600">
            Comprehensive valuation analysis tools for financial modeling and investment decisions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Sales ($)
              </label>
              <input
                type="text"
                value={inputs.companySales}
                onChange={(e) => handleInputChange('companySales', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company EBITDA ($)
              </label>
              <input
                type="text"
                value={inputs.companyEBITDA}
                onChange={(e) => handleInputChange('companyEBITDA', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Shares Outstanding
              </label>
              <input
                type="text"
                value={inputs.totalSharesOutstanding}
                onChange={(e) => handleInputChange('totalSharesOutstanding', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Net Debt ($)
              </label>
              <input
                type="text"
                value={inputs.netDebt}
                onChange={(e) => handleInputChange('netDebt', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">52-Week Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  52-Week High ($)
                </label>
                <input
                  type="text"
                  value={inputs.fiftyTwoWeekHigh}
                  onChange={(e) => handleInputChange('fiftyTwoWeekHigh', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  52-Week Low ($)
                </label>
                <input
                  type="text"
                  value={inputs.fiftyTwoWeekLow}
                  onChange={(e) => handleInputChange('fiftyTwoWeekLow', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Comparables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/Sales (Low)
                </label>
                <input
                  type="text"
                  value={inputs.publicCompsEVSalesLow}
                  onChange={(e) => handleInputChange('publicCompsEVSalesLow', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/Sales (High)
                </label>
                <input
                  type="text"
                  value={inputs.publicCompsEVSalesHigh}
                  onChange={(e) => handleInputChange('publicCompsEVSalesHigh', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/EBITDA (Low)
                </label>
                <input
                  type="text"
                  value={inputs.publicCompsEVEBITDALow}
                  onChange={(e) => handleInputChange('publicCompsEVEBITDALow', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/EBITDA (High)
                </label>
                <input
                  type="text"
                  value={inputs.publicCompsEVEBITDAHigh}
                  onChange={(e) => handleInputChange('publicCompsEVEBITDAHigh', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precedent Transactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/Sales (Low)
                </label>
                <input
                  type="text"
                  value={inputs.precedentTxEVSalesLow}
                  onChange={(e) => handleInputChange('precedentTxEVSalesLow', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/Sales (High)
                </label>
                <input
                  type="text"
                  value={inputs.precedentTxEVSalesHigh}
                  onChange={(e) => handleInputChange('precedentTxEVSalesHigh', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/EBITDA (Low)
                </label>
                <input
                  type="text"
                  value={inputs.precedentTxEVEBITDALow}
                  onChange={(e) => handleInputChange('precedentTxEVEBITDALow', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EV/EBITDA (High)
                </label>
                <input
                  type="text"
                  value={inputs.precedentTxEVEBITDAHigh}
                  onChange={(e) => handleInputChange('precedentTxEVEBITDAHigh', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">DCF Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DCF (Low $)
                </label>
                <input
                  type="text"
                  value={inputs.dcfLow}
                  onChange={(e) => handleInputChange('dcfLow', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DCF (High $)
                </label>
                <input
                  type="text"
                  value={inputs.dcfHigh}
                  onChange={(e) => handleInputChange('dcfHigh', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Calculate Valuation
            </button>
          </div>
        </div>
      </main>


    </div>
  );
}
