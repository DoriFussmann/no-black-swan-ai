"use client";

import { useState } from "react";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import Container from "../../components/Container";

// Unified EV Chart Component - Football Field Chart
function UnifiedEVChart({ inputs }: { inputs: any }) {
  // Calculate EV ranges for each methodology
  const companySales = parseFloat(inputs.companySales) || 0;
  const companyEBITDA = parseFloat(inputs.companyEBITDA) || 0;
  const totalShares = parseFloat(inputs.totalSharesOutstanding) || 0;
  const netDebt = parseFloat(inputs.netDebt) || 0;
  
  // Share Price Range EV calculation
  const sharePriceLow = parseFloat(inputs.fiftyTwoWeekLow) || 0;
  const sharePriceHigh = parseFloat(inputs.fiftyTwoWeekHigh) || 0;
  const sharePriceEVLow = sharePriceLow * totalShares + netDebt;
  const sharePriceEVHigh = sharePriceHigh * totalShares + netDebt;
  
  // Public Comparables EV/Sales calculation
  const evSalesLow = parseFloat(inputs.publicCompsEVSalesLow) || 0;
  const evSalesHigh = parseFloat(inputs.publicCompsEVSalesHigh) || 0;
  const evSalesEVLow = evSalesLow * companySales;
  const evSalesEVHigh = evSalesHigh * companySales;
  
  // Public Comparables EV/EBITDA calculation
  const evEBITDALow = parseFloat(inputs.publicCompsEVEBITDALow) || 0;
  const evEBITDAHigh = parseFloat(inputs.publicCompsEVEBITDAHigh) || 0;
  const evEBITDAEVLow = evEBITDALow * companyEBITDA;
  const evEBITDAEVHigh = evEBITDAHigh * companyEBITDA;
  
  // Precedent Transactions EV/Sales calculation
  const precedentEVSalesLow = parseFloat(inputs.precedentTxEVSalesLow) || 0;
  const precedentEVSalesHigh = parseFloat(inputs.precedentTxEVSalesHigh) || 0;
  const precedentEVSalesEVLow = precedentEVSalesLow * companySales;
  const precedentEVSalesEVHigh = precedentEVSalesHigh * companySales;
  
  // Precedent Transactions EV/EBITDA calculation
  const precedentEVEBITDALow = parseFloat(inputs.precedentTxEVEBITDALow) || 0;
  const precedentEVEBITDAHigh = parseFloat(inputs.precedentTxEVEBITDAHigh) || 0;
  const precedentEVEBITDAEVLow = precedentEVEBITDALow * companyEBITDA;
  const precedentEVEBITDAEVHigh = precedentEVEBITDAHigh * companyEBITDA;
  
  // DCF calculation (assuming these are already EV values)
  const dcfLow = parseFloat(inputs.dcfLow) || 0;
  const dcfHigh = parseFloat(inputs.dcfHigh) || 0;
  
  // Collect all EV values to find min/max for axis
  const allEVs = [
    sharePriceEVLow, sharePriceEVHigh,
    evSalesEVLow, evSalesEVHigh,
    evEBITDAEVLow, evEBITDAEVHigh,
    precedentEVSalesEVLow, precedentEVSalesEVHigh,
    precedentEVEBITDAEVLow, precedentEVEBITDAEVHigh,
    dcfLow, dcfHigh
  ].filter(ev => ev > 0);
  
  if (allEVs.length === 0) return null;
  
  const minEV = Math.min(...allEVs);
  const maxEV = Math.max(...allEVs);
  const evRange = maxEV - minEV;
  
  // Don't render chart if there's no meaningful range
  if (evRange <= 0) return null;
  
  // Helper function to calculate position on chart with buffer
  const getPosition = (value: number) => {
    if (evRange === 0) return 50;
    // Add 10% buffer on each side (so chart uses 80% of width, with 10% buffer on left and right)
    const buffer = 10;
    return buffer + ((value - minEV) / evRange) * 80;
  };
  
  // Helper function to calculate width on chart with buffer
  const getWidth = (low: number, high: number) => {
    if (evRange === 0) return 10;
    // Scale width to match the 80% chart area
    return ((high - low) / evRange) * 80;
  };
  
  return (
    <div className="mb-8">
      {/* Chart Container */}
      <div className="relative bg-gray-50 rounded-lg p-6 border border-gray-200">
        {/* EV Axis Labels removed - no more $0.0M labels */}
        
        {/* Chart Bars */}
        <div className="space-y-4">
          {/* Share Price Range */}
          {(sharePriceEVLow > 0 || sharePriceEVHigh > 0) && (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700 w-48">Share Price Range</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-indigo-500 rounded transition-all duration-300"
                    style={{
                      left: `${getPosition(Math.min(sharePriceEVLow, sharePriceEVHigh))}%`,
                      width: `${getWidth(Math.min(sharePriceEVLow, sharePriceEVHigh), Math.max(sharePriceEVLow, sharePriceEVHigh))}%`
                    }}
                  />
                  {/* Min value label positioned to the left of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ right: '100%', marginRight: '8px' }}
                  >
                    {Math.min(sharePriceEVLow, sharePriceEVHigh).toLocaleString()}
                  </div>
                  {/* Max value label positioned to the right of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ left: '100%', marginLeft: '8px' }}
                  >
                    {Math.max(sharePriceEVLow, sharePriceEVHigh).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Public Comparables EV/Sales */}
          {(evSalesEVLow > 0 || evSalesEVHigh > 0) && (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700 w-48">Public - EV/Sales</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-blue-500 rounded transition-all duration-300"
                    style={{
                      left: `${getPosition(Math.min(evSalesEVLow, evSalesEVHigh))}%`,
                      width: `${getWidth(Math.min(evSalesEVLow, evSalesEVHigh), Math.max(evSalesEVLow, evSalesEVHigh))}%`
                    }}
                  />
                  {/* Min value label positioned to the left of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ right: '100%', marginRight: '8px' }}
                  >
                    {Math.min(evSalesEVLow, evSalesEVHigh).toLocaleString()}
                  </div>
                  {/* Max value label positioned to the right of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ left: '100%', marginLeft: '8px' }}
                  >
                    {Math.max(evSalesEVLow, evSalesEVHigh).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Public Comparables EV/EBITDA */}
          {(evEBITDAEVLow > 0 || evEBITDAEVHigh > 0) && (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700 w-48">Public - EV/EBITDA</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-green-500 rounded transition-all duration-300"
                    style={{
                      left: `${getPosition(Math.min(evEBITDAEVLow, evEBITDAEVHigh))}%`,
                      width: `${getWidth(Math.min(evEBITDAEVLow, evEBITDAEVHigh), Math.max(evEBITDAEVLow, evEBITDAEVHigh))}%`
                    }}
                  />
                  {/* Min value label positioned to the left of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ right: '100%', marginRight: '8px' }}
                  >
                    {Math.min(evEBITDAEVLow, evEBITDAEVHigh).toLocaleString()}
                  </div>
                  {/* Max value label positioned to the right of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ left: '100%', marginLeft: '8px' }}
                  >
                    {Math.max(evEBITDAEVLow, evEBITDAEVHigh).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Precedent Transactions EV/Sales */}
          {(precedentEVSalesEVLow > 0 || precedentEVSalesEVHigh > 0) && (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700 w-48">Deals - EV/Sales</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-purple-500 rounded transition-all duration-300"
                    style={{
                      left: `${getPosition(Math.min(precedentEVSalesEVLow, precedentEVSalesEVHigh))}%`,
                      width: `${getWidth(Math.min(precedentEVSalesEVLow, precedentEVSalesEVHigh), Math.max(precedentEVSalesEVLow, precedentEVSalesEVHigh))}%`
                    }}
                  />
                  {/* Min value label positioned to the left of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ right: '100%', marginRight: '8px' }}
                  >
                    {Math.min(precedentEVSalesEVLow, precedentEVSalesEVHigh).toLocaleString()}
                  </div>
                  {/* Max value label positioned to the right of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ left: '100%', marginLeft: '8px' }}
                  >
                    {Math.max(precedentEVSalesEVLow, precedentEVSalesEVHigh).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Precedent Transactions EV/EBITDA */}
          {(precedentEVEBITDAEVLow > 0 || precedentEVEBITDAEVHigh > 0) && (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700 w-48">Deals - EV/EBITDA</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-orange-500 rounded transition-all duration-300"
                    style={{
                      left: `${getPosition(Math.min(precedentEVEBITDAEVLow, precedentEVEBITDAEVHigh))}%`,
                      width: `${getWidth(Math.min(precedentEVEBITDAEVLow, precedentEVEBITDAEVHigh), Math.max(precedentEVEBITDAEVLow, precedentEVEBITDAEVHigh))}%`
                    }}
                  />
                  {/* Min value label positioned to the left of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ right: '100%', marginRight: '8px' }}
                  >
                    {Math.min(precedentEVEBITDAEVLow, precedentEVEBITDAEVHigh).toLocaleString()}
                  </div>
                  {/* Max value label positioned to the right of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ left: '100%', marginLeft: '8px' }}
                  >
                    {Math.max(precedentEVEBITDAEVLow, precedentEVEBITDAEVHigh).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* DCF Analysis */}
          {(dcfLow > 0 || dcfHigh > 0) && (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700 w-48">DCF Analysis</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-200 rounded relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-red-500 rounded transition-all duration-300"
                    style={{
                      left: `${getPosition(Math.min(dcfLow, dcfHigh))}%`,
                      width: `${getWidth(Math.min(dcfLow, dcfHigh), Math.max(dcfLow, dcfHigh))}%`
                    }}
                  />
                  {/* Min value label positioned to the left of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ right: '100%', marginRight: '8px' }}
                  >
                    {Math.min(dcfLow, dcfHigh).toLocaleString()}
                  </div>
                  {/* Max value label positioned to the right of the bar */}
                  <div 
                    className="absolute top-0 text-xs text-gray-600 whitespace-nowrap"
                    style={{ left: '100%', marginLeft: '8px' }}
                  >
                    {Math.max(dcfLow, dcfHigh).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    dcfHigh: "",
    dcfTerminalGrowthLow: "",
    dcfTerminalGrowthHigh: ""
  });

  const [summary, setSummary] = useState("Enter valuation inputs to generate a comprehensive football field analysis showing the range of potential valuations across multiple methodologies.");

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Valuation Engine</h1>
                  <p className="text-gray-600">Advanced startup valuation with football field charts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    // Generate realistic random valuation data
                    const randomData = {
                      companySales: (Math.random() * 100 + 10).toFixed(0), // $10M - $110M
                      companyEBITDA: (Math.random() * 20 + 2).toFixed(0), // $2M - $22M
                      totalSharesOutstanding: (Math.random() * 50 + 10).toFixed(0), // 10M - 60M shares
                      netDebt: (Math.random() * 30 - 15).toFixed(0), // -$15M to $15M
                      fiftyTwoWeekHigh: (Math.random() * 50 + 20).toFixed(2), // $20 - $70
                      fiftyTwoWeekLow: (Math.random() * 30 + 10).toFixed(2), // $10 - $40
                      publicCompsEVSalesLow: (Math.random() * 3 + 1).toFixed(1), // 1.0x - 4.0x
                      publicCompsEVSalesHigh: (Math.random() * 4 + 3).toFixed(1), // 3.0x - 7.0x
                      publicCompsEVEBITDALow: (Math.random() * 15 + 8).toFixed(1), // 8.0x - 23.0x
                      publicCompsEVEBITDAHigh: (Math.random() * 20 + 15).toFixed(1), // 15.0x - 35.0x
                      precedentTxEVSalesLow: (Math.random() * 2 + 0.5).toFixed(1), // 0.5x - 2.5x
                      precedentTxEVSalesHigh: (Math.random() * 3 + 2).toFixed(1), // 2.0x - 5.0x
                      precedentTxEVEBITDALow: (Math.random() * 12 + 6).toFixed(1), // 6.0x - 18.0x
                      precedentTxEVEBITDAHigh: (Math.random() * 18 + 12).toFixed(1), // 12.0x - 30.0x
                      dcfLow: (Math.random() * 100 + 50).toFixed(0), // $50M - $150M
                      dcfHigh: (Math.random() * 200 + 150).toFixed(0), // $150M - $350M
                      dcfTerminalGrowthLow: (Math.random() * 2 + 1).toFixed(1), // 1.0% - 3.0%
                      dcfTerminalGrowthHigh: (Math.random() * 3 + 2).toFixed(1) // 2.0% - 5.0%
                    };
                    setInputs(randomData);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Fill
                </button>
                <Link 
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Home
                </Link>
              </div>
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
              {/* Company Metrics Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Metrics</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LTM Sales ($)
                      </label>
                      <input
                        type="text"
                        value={inputs.companySales}
                        onChange={(e) => handleInputChange('companySales', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LTM EBITDA ($)
                      </label>
                      <input
                        type="text"
                        value={inputs.companyEBITDA}
                        onChange={(e) => handleInputChange('companyEBITDA', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        TSO (mm)
                      </label>
                      <input
                        type="text"
                        value={inputs.totalSharesOutstanding}
                        onChange={(e) => handleInputChange('totalSharesOutstanding', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Price Range Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Price Range ($)</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        52W Low
                      </label>
                      <input
                        type="text"
                        value={inputs.fiftyTwoWeekLow}
                        onChange={(e) => handleInputChange('fiftyTwoWeekLow', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        52W High
                      </label>
                      <input
                        type="text"
                        value={inputs.fiftyTwoWeekHigh}
                        onChange={(e) => handleInputChange('fiftyTwoWeekHigh', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Comparables Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Comparables</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/Sales (Low)
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVSalesLow}
                        onChange={(e) => handleInputChange('publicCompsEVSalesLow', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/EBITDA <span className="text-xs">(Low)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVEBITDALow}
                        onChange={(e) => handleInputChange('publicCompsEVEBITDALow', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/EBITDA <span className="text-xs">(High)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVEBITDAHigh}
                        onChange={(e) => handleInputChange('publicCompsEVEBITDAHigh', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Precedent Transactions Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Precedent Transactions</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/Sales <span className="text-xs">(Low)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVSalesLow}
                        onChange={(e) => handleInputChange('precedentTxEVSalesLow', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/Sales <span className="text-xs">(High)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVSalesHigh}
                        onChange={(e) => handleInputChange('precedentTxEVSalesHigh', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/EBITDA <span className="text-xs">(Low)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVEBITDALow}
                        onChange={(e) => handleInputChange('precedentTxEVEBITDALow', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EV/EBITDA <span className="text-xs">(High)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVEBITDAHigh}
                        onChange={(e) => handleInputChange('precedentTxEVEBITDAHigh', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DCF Analysis Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">DCF Analysis</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DCF <span className="text-xs">(Low)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.dcfLow}
                        onChange={(e) => handleInputChange('dcfLow', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DCF <span className="text-xs">(High)</span>
                      </label>
                      <input
                        type="text"
                        value={inputs.dcfHigh}
                        onChange={(e) => handleInputChange('dcfHigh', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* Right Column - Valuation Outputs (75% width) */}
            <div className="lg:col-span-3">
              {/* Football Field Summary Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Football Field Summary</h3>
                <div className="text-gray-600">
                  <div className="whitespace-pre-line leading-relaxed">
                    {summary}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Valuation Football Field ($)</h2>
                
                {/* Unified EV Chart - Only render when there's data */}
                {(() => {
                  // Check if there's any meaningful data - be more explicit about empty values
                  const hasData = (inputs.companySales && inputs.companySales.trim() !== "") ||
                                 (inputs.companyEBITDA && inputs.companyEBITDA.trim() !== "") ||
                                 (inputs.totalSharesOutstanding && inputs.totalSharesOutstanding.trim() !== "") ||
                                 (inputs.fiftyTwoWeekLow && inputs.fiftyTwoWeekLow.trim() !== "") ||
                                 (inputs.fiftyTwoWeekHigh && inputs.fiftyTwoWeekHigh.trim() !== "") ||
                                 (inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesLow.trim() !== "") ||
                                 (inputs.publicCompsEVSalesHigh && inputs.publicCompsEVSalesHigh.trim() !== "") ||
                                 (inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh.trim() !== "") ||
                                 (inputs.publicCompsEVEBITDAHigh && inputs.publicCompsEVEBITDAHigh.trim() !== "") ||
                                 (inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesLow.trim() !== "") ||
                                 (inputs.precedentTxEVSalesHigh && inputs.precedentTxEVSalesHigh.trim() !== "") ||
                                 (inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDALow.trim() !== "") ||
                                 (inputs.precedentTxEVEBITDAHigh && inputs.precedentTxEVEBITDAHigh.trim() !== "") ||
                                 (inputs.dcfLow && inputs.dcfLow.trim() !== "") ||
                                 (inputs.dcfHigh && inputs.dcfHigh.trim() !== "");
                  
                  return hasData ? <UnifiedEVChart inputs={inputs} /> : null;
                })()}
                
                {/* Placeholder when no data */}
                {!inputs.companySales && !inputs.companyEBITDA && !inputs.totalSharesOutstanding && 
                 !inputs.fiftyTwoWeekLow && !inputs.fiftyTwoWeekHigh && 
                 !inputs.publicCompsEVSalesLow && !inputs.publicCompsEVSalesHigh &&
                 !inputs.publicCompsEVEBITDALow && !inputs.publicCompsEVEBITDAHigh &&
                 !inputs.precedentTxEVSalesLow && !inputs.precedentTxEVSalesHigh &&
                 !inputs.precedentTxEVEBITDALow && !inputs.precedentTxEVEBITDAHigh &&
                 !inputs.dcfLow && !inputs.dcfHigh && (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>Enter valuation inputs to see results</p>
                    </div>
                  </div>
                )}
                
                {/* Generate Summary Button - positioned at bottom right */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      // Generate professional summary based on current data
                      const companySales = parseFloat(inputs.companySales) || 0;
                      const companyEBITDA = parseFloat(inputs.companyEBITDA) || 0;
                      const totalShares = parseFloat(inputs.totalSharesOutstanding) || 0;
                      const netDebt = parseFloat(inputs.netDebt) || 0;
                      
                      // Calculate valuation ranges
                      const allEVs = [];
                      if (inputs.fiftyTwoWeekLow && inputs.fiftyTwoWeekHigh && totalShares) {
                        const lowEV = parseFloat(inputs.fiftyTwoWeekLow) * totalShares + netDebt;
                        const highEV = parseFloat(inputs.fiftyTwoWeekHigh) * totalShares + netDebt;
                        allEVs.push(lowEV, highEV);
                      }
                      if (inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesHigh && companySales) {
                        const lowEV = parseFloat(inputs.publicCompsEVSalesLow) * companySales;
                        const highEV = parseFloat(inputs.publicCompsEVSalesHigh) * companySales;
                        allEVs.push(lowEV, highEV);
                      }
                      if (inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh && companyEBITDA) {
                        const lowEV = parseFloat(inputs.publicCompsEVEBITDALow) * companyEBITDA;
                        const highEV = parseFloat(inputs.publicCompsEVEBITDAHigh) * companyEBITDA;
                        allEVs.push(lowEV, highEV);
                      }
                      if (inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesHigh && companySales) {
                        const lowEV = parseFloat(inputs.precedentTxEVSalesLow) * companySales;
                        const highEV = parseFloat(inputs.precedentTxEVSalesHigh) * companySales;
                        allEVs.push(lowEV, highEV);
                      }
                      if (inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDAHigh && companyEBITDA) {
                        const lowEV = parseFloat(inputs.precedentTxEVEBITDALow) * companyEBITDA;
                        const highEV = parseFloat(inputs.precedentTxEVEBITDAHigh) * companyEBITDA;
                        allEVs.push(lowEV, highEV);
                      }
                      if (inputs.dcfLow && inputs.dcfHigh) {
                        allEVs.push(parseFloat(inputs.dcfLow), parseFloat(inputs.dcfHigh));
                      }
                      
                      if (allEVs.length > 0) {
                        const minEV = Math.min(...allEVs);
                        const maxEV = Math.max(...allEVs);
                        const avgEV = (minEV + maxEV) / 2;
                        
                        // Generate professional summary (2 paragraphs max, professional and concise)
                        let summaryText = "";
                        
                        if (companySales > 0 || companyEBITDA > 0) {
                          const salesText = companySales > 0 ? `LTM sales of $${(companySales / 1000000).toFixed(1)}M` : "";
                          const ebitdaText = companyEBITDA > 0 ? `EBITDA of $${(companyEBITDA / 1000000).toFixed(1)}M` : "";
                          const companyMetrics = [salesText, ebitdaText].filter(Boolean).join(" and ");
                          
                          summaryText = `Based on the company's ${companyMetrics}, our comprehensive valuation analysis indicates an enterprise value range of $${(minEV / 1000000).toFixed(1)}M to $${(maxEV / 1000000).toFixed(1)}M across multiple methodologies including public comparables, precedent transactions, and DCF analysis.`;
                        } else {
                          summaryText = `Our comprehensive valuation analysis indicates an enterprise value range of $${(minEV / 1000000).toFixed(1)}M to $${(maxEV / 1000000).toFixed(1)}M across multiple methodologies including public comparables, precedent transactions, and DCF analysis.`;
                        }
                        
                        summaryText += ` The midpoint suggests an enterprise value of approximately $${(avgEV / 1000000).toFixed(1)}M, reflecting a balanced assessment that accounts for market conditions, industry benchmarks, and the company's operational performance.`;
                        
                        setSummary(summaryText);
                      } else {
                        setSummary("Please enter sufficient valuation inputs to generate a meaningful summary. The analysis requires at least one valuation methodology with complete data.");
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
