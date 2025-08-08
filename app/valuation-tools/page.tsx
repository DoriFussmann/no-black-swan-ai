"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";


interface ValuationInputs {
  // Row 0: Company metrics
  companySales: string;
  companyEBITDA: string;
  totalSharesOutstanding: string;
  netDebt: string;
  
  // Row 1: 52W Range
  fiftyTwoWeekHigh: string;
  fiftyTwoWeekLow: string;
  
  // Row 2: Public Comps EV/Sales
  publicCompsEVSalesLow: string;
  publicCompsEVSalesHigh: string;
  
  // Row 3: Public Comps EV/EBITDA
  publicCompsEVEBITDALow: string;
  publicCompsEVEBITDAHigh: string;
  
  // Row 4: Precedent Tx EV/Sales
  precedentTxEVSalesLow: string;
  precedentTxEVSalesHigh: string;
  
  // Row 5: Precedent Tx EV/EBITDA
  precedentTxEVEBITDALow: string;
  precedentTxEVEBITDAHigh: string;
  
  // Row 6: DCF
  dcfLow: string;
  dcfHigh: string;
}

interface ValuationRange {
  name: string;
  low: number;
  high: number;
  color: string;
  description: string;
  inputGroup: string; // To match with input sections
}

export default function ValuationTools() {
  const [inputs, setInputs] = useState<ValuationInputs>({
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

  const [valuationRanges, setValuationRanges] = useState<ValuationRange[]>([]);

  // Load inputs from localStorage on component mount
  useEffect(() => {
    const savedInputs = localStorage.getItem('valuationInputs');
    if (savedInputs) {
      try {
        const parsedInputs = JSON.parse(savedInputs);
        setInputs(parsedInputs);
      } catch (error) {
        console.error('Error loading saved inputs:', error);
      }
    }
  }, []);

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('valuationInputs', JSON.stringify(inputs));
  }, [inputs]);

  // Calculate valuation ranges whenever inputs change
  useEffect(() => {
    calculateValuationRanges();
  }, [inputs]);

  const handleInputChange = (field: keyof ValuationInputs, value: string) => {
    // Basic validation: numbers only
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Tooltip component
  const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  const validateLowHigh = (low: string, high: string) => {
    if (low && high) {
      const lowNum = parseFloat(low);
      const highNum = parseFloat(high);
      return lowNum <= highNum;
    }
    return true;
  };

  // Calculate valuation ranges based on inputs
  const calculateValuationRanges = useCallback(() => {
    const ranges: ValuationRange[] = [];
    
    const sales = parseFloat(inputs.companySales) || 0;
    const ebitda = parseFloat(inputs.companyEBITDA) || 0;
    const tso = parseFloat(inputs.totalSharesOutstanding) || 0;
    const netDebt = parseFloat(inputs.netDebt) || 0;
    
    // 52W Range: Convert price → Enterprise Value using Price × TSO + Net Debt
    if (inputs.fiftyTwoWeekHigh && inputs.fiftyTwoWeekLow && tso > 0) {
      const highPrice = parseFloat(inputs.fiftyTwoWeekHigh);
      const lowPrice = parseFloat(inputs.fiftyTwoWeekLow);
      ranges.push({
        name: "52-Week Range",
        low: (lowPrice * tso) + netDebt,
        high: (highPrice * tso) + netDebt,
        color: "#3B82F6", // blue
        description: "Based on 52-week high/low stock prices (EV = Equity + Net Debt)",
        inputGroup: "52W Range"
      });
    }
    
    // Public Comps EV/Sales = [Low × Sales, High × Sales]
    if (inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesHigh && sales > 0) {
      const lowMultiple = parseFloat(inputs.publicCompsEVSalesLow);
      const highMultiple = parseFloat(inputs.publicCompsEVSalesHigh);
      ranges.push({
        name: "Public Comps EV/Sales",
        low: lowMultiple * sales,
        high: highMultiple * sales,
        color: "#10B981", // green
        description: "Enterprise value based on public company EV/Sales multiples",
        inputGroup: "Public Comps"
      });
    }
    
    // Public Comps EV/EBITDA = [Low × EBITDA, High × EBITDA]
    if (inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh && ebitda > 0) {
      const lowMultiple = parseFloat(inputs.publicCompsEVEBITDALow);
      const highMultiple = parseFloat(inputs.publicCompsEVEBITDAHigh);
      ranges.push({
        name: "Public Comps EV/EBITDA",
        low: lowMultiple * ebitda,
        high: highMultiple * ebitda,
        color: "#8B5CF6", // purple
        description: "Enterprise value based on public company EV/EBITDA multiples",
        inputGroup: "Public Comps"
      });
    }
    
    // Precedent Tx EV/Sales = [Low × Sales, High × Sales]
    if (inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesHigh && sales > 0) {
      const lowMultiple = parseFloat(inputs.precedentTxEVSalesLow);
      const highMultiple = parseFloat(inputs.precedentTxEVSalesHigh);
      ranges.push({
        name: "Precedent Tx EV/Sales",
        low: lowMultiple * sales,
        high: highMultiple * sales,
        color: "#F59E0B", // amber
        description: "Enterprise value based on precedent transaction EV/Sales multiples",
        inputGroup: "Precedent Tx"
      });
    }
    
    // Precedent Tx EV/EBITDA = [Low × EBITDA, High × EBITDA]
    if (inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDAHigh && ebitda > 0) {
      const lowMultiple = parseFloat(inputs.precedentTxEVEBITDALow);
      const highMultiple = parseFloat(inputs.precedentTxEVEBITDAHigh);
      ranges.push({
        name: "Precedent Tx EV/EBITDA",
        low: lowMultiple * ebitda,
        high: highMultiple * ebitda,
        color: "#EF4444", // red
        description: "Enterprise value based on precedent transaction EV/EBITDA multiples",
        inputGroup: "Precedent Tx"
      });
    }
    
    // DCF Range: [Low $, High $] (already in dollars)
    if (inputs.dcfLow && inputs.dcfHigh) {
      const lowDcf = parseFloat(inputs.dcfLow);
      const highDcf = parseFloat(inputs.dcfHigh);
      ranges.push({
        name: "DCF",
        low: lowDcf,
        high: highDcf,
        color: "#06B6D4", // cyan
        description: "Discounted cash flow valuation range",
        inputGroup: "DCF"
      });
    }
    
    setValuationRanges(ranges);
  }, [inputs]);

  // Format axis values for display
  const formatAxisValue = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Calculate chart domain with 20% buffer above and below
  const allValues = valuationRanges.flatMap(range => [range.low, range.high]);
  const actualMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const actualMax = allValues.length > 0 ? Math.max(...allValues) : 1000000;
  
  // Add 20% buffer to min and max for better visual spacing
  const range = actualMax - actualMin;
  const buffer = range * 0.2;
  const minValue = actualMin - buffer;
  const maxValue = actualMax + buffer;

  // Fixed height for each valuation bar
  const BAR_HEIGHT = 48; // 48px = 3rem
  const BAR_SPACING = 16; // 16px = 1rem

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <Image
                  src="/next.svg"
                  alt="Next.js logo"
                  width={120}
                  height={25}
                  priority
                />
                <span className="text-2xl font-bold text-gray-900">Football Field Valuation</span>
              </Link>
              <Link 
                href="/" 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Home
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                Home
              </Link>
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

      {/* Main Content - Split Layout */}
      <main className="flex-1 flex w-full max-w-[1400px] mx-auto">
        {/* Left Panel - Football Field Chart (50%) */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200">
          <div className="h-full flex flex-col">
            {/* Chart Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Football Field Valuation</h2>
              <p className="text-gray-600 mt-1">Visual representation of valuation ranges</p>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 p-6">
              <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200">
                {valuationRanges.length > 0 ? (
                  <div className="h-full flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Football Field Valuation</h3>
                    <div className="flex-1 relative">
                      {/* X-axis labels */}
                      <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-between px-4">
                        <span className="text-xs text-gray-600">{formatAxisValue(minValue)}</span>
                        <span className="text-xs text-gray-600">{formatAxisValue(maxValue)}</span>
                      </div>
                      
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex justify-between pt-4 pb-12">
                        {[0, 25, 50, 75, 100].map((percent) => (
                          <div key={percent} className="w-px bg-gray-200 h-full"></div>
                        ))}
                      </div>
                      
                      {/* Valuation ranges - Positioned to align with input sections */}
                      <div className="absolute inset-0 pt-4 pb-12">
                        {valuationRanges.map((range, index) => {
                          const totalRange = maxValue - minValue;
                          const startPercent = ((range.low - minValue) / totalRange) * 100;
                          const widthPercent = ((range.high - range.low) / totalRange) * 100;
                          
                          // Calculate vertical position to align with corresponding input section
                          // Each input section has approximately 120px height (including margin)
                          const sectionHeight = 120;
                          const topPosition = index * sectionHeight;
                          
                          return (
                            <div
                              key={index}
                              className="absolute rounded-lg"
                              style={{
                                left: `${startPercent}%`,
                                width: `${widthPercent}%`,
                                top: `${topPosition}px`,
                                height: `${BAR_HEIGHT}px`,
                                backgroundColor: range.color,
                                minWidth: '4px'
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white bg-opacity-90 rounded px-1 py-0.5 text-xs font-medium text-gray-800">
                                  {formatAxisValue(range.low)} - {formatAxisValue(range.high)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Y-axis labels - Aligned with bars */}
                      <div className="absolute left-0 top-0 bottom-0 w-32 flex flex-col pt-4 pb-12">
                        {valuationRanges.map((range, index) => {
                          // Calculate vertical position to align with corresponding input section
                          const sectionHeight = 120;
                          const topPosition = index * sectionHeight;
                          return (
                            <div 
                              key={index} 
                              className="absolute text-sm font-medium text-gray-700 px-2 flex items-center"
                              style={{
                                top: `${topPosition}px`,
                                height: `${BAR_HEIGHT}px`
                              }}
                            >
                              {range.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Summary */}
                    {valuationRanges.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Valuation Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Lowest Value:</span>
                            <span className="ml-2 text-blue-900">
                              {formatAxisValue(Math.min(...valuationRanges.map(r => r.low)))}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Highest Value:</span>
                            <span className="ml-2 text-blue-900">
                              {formatAxisValue(Math.max(...valuationRanges.map(r => r.high)))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Legend */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {valuationRanges.map((range, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: range.color }}
                          ></div>
                          <span className="text-gray-700">{range.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Football Field Chart</h3>
                      <p className="text-gray-500 text-sm">Enter values to see valuation ranges</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Input Panel (50%) */}
        <div className="w-full lg:w-1/2 bg-white">
          <div className="h-full flex flex-col">
            {/* Input Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Valuation Parameters</h3>
                  <p className="text-gray-600 mt-1">Enter company metrics and valuation multiples</p>
                </div>
                <button
                  onClick={() => {
                    setInputs({
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
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {/* Input Form */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Row 0: Company Metrics */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Company Metrics ($)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Tooltip content="Enter the company's Last Twelve Months (LTM) revenue/sales figure in dollars. This is used to calculate EV/Sales multiples.">
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-help">
                          LTM Sales
                        </label>
                      </Tooltip>
                      <input
                        type="text"
                        value={inputs.companySales}
                        onChange={(e) => handleInputChange('companySales', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Tooltip content="Enter the company's Last Twelve Months (LTM) EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization). This is used to calculate EV/EBITDA multiples.">
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-help">
                          LTM EBITDA
                        </label>
                      </Tooltip>
                      <input
                        type="text"
                        value={inputs.companyEBITDA}
                        onChange={(e) => handleInputChange('companyEBITDA', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TSO (mm)
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
                      <Tooltip content="Net debt is total debt minus cash and cash equivalents. This is added to equity value to calculate enterprise value.">
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-help">
                          Net Debt
                        </label>
                      </Tooltip>
                      <input
                        type="text"
                        value={inputs.netDebt}
                        onChange={(e) => handleInputChange('netDebt', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 1: 52W Range */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">52-Week Price Range ($)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        52W Low
                      </label>
                      <input
                        type="text"
                        value={inputs.fiftyTwoWeekLow}
                        onChange={(e) => handleInputChange('fiftyTwoWeekLow', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.fiftyTwoWeekLow, inputs.fiftyTwoWeekHigh) && inputs.fiftyTwoWeekLow && inputs.fiftyTwoWeekHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        52W High
                      </label>
                      <input
                        type="text"
                        value={inputs.fiftyTwoWeekHigh}
                        onChange={(e) => handleInputChange('fiftyTwoWeekHigh', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.fiftyTwoWeekLow, inputs.fiftyTwoWeekHigh) && inputs.fiftyTwoWeekHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Min
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.fiftyTwoWeekLow && inputs.fiftyTwoWeekHigh && inputs.totalSharesOutstanding 
                          ? formatAxisValue((parseFloat(inputs.fiftyTwoWeekLow) * parseFloat(inputs.totalSharesOutstanding)) + (parseFloat(inputs.netDebt) || 0))
                          : "—"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Max
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.fiftyTwoWeekLow && inputs.fiftyTwoWeekHigh && inputs.totalSharesOutstanding 
                          ? formatAxisValue((parseFloat(inputs.fiftyTwoWeekHigh) * parseFloat(inputs.totalSharesOutstanding)) + (parseFloat(inputs.netDebt) || 0))
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Public Comps EV/Sales */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Public Companies EV/Sales (x)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/Sales (Low)
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVSalesLow}
                        onChange={(e) => handleInputChange('publicCompsEVSalesLow', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.publicCompsEVSalesLow, inputs.publicCompsEVSalesHigh) && inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/Sales (High)
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVSalesHigh}
                        onChange={(e) => handleInputChange('publicCompsEVSalesHigh', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.publicCompsEVSalesLow, inputs.publicCompsEVSalesHigh) && inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Min
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesHigh && inputs.companySales
                          ? formatAxisValue(parseFloat(inputs.publicCompsEVSalesLow) * parseFloat(inputs.companySales))
                          : "—"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Max
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.publicCompsEVSalesLow && inputs.publicCompsEVSalesHigh && inputs.companySales
                          ? formatAxisValue(parseFloat(inputs.publicCompsEVSalesHigh) * parseFloat(inputs.companySales))
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Public Comps EV/EBITDA */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Public Companies EV/EBITDA (x)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/EBITDA (Low)
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVEBITDALow}
                        onChange={(e) => handleInputChange('publicCompsEVEBITDALow', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.publicCompsEVEBITDALow, inputs.publicCompsEVEBITDAHigh) && inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/EBITDA (High)
                      </label>
                      <input
                        type="text"
                        value={inputs.publicCompsEVEBITDAHigh}
                        onChange={(e) => handleInputChange('publicCompsEVEBITDAHigh', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.publicCompsEVEBITDALow, inputs.publicCompsEVEBITDAHigh) && inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Min
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh && inputs.companyEBITDA
                          ? formatAxisValue(parseFloat(inputs.publicCompsEVEBITDALow) * parseFloat(inputs.companyEBITDA))
                          : "—"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Max
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.publicCompsEVEBITDALow && inputs.publicCompsEVEBITDAHigh && inputs.companyEBITDA
                          ? formatAxisValue(parseFloat(inputs.publicCompsEVEBITDAHigh) * parseFloat(inputs.companyEBITDA))
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4: Precedent Tx EV/Sales */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Precedent Transactions EV/Sales (x)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/Sales (Low)
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVSalesLow}
                        onChange={(e) => handleInputChange('precedentTxEVSalesLow', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.precedentTxEVSalesLow, inputs.precedentTxEVSalesHigh) && inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/Sales (High)
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVSalesHigh}
                        onChange={(e) => handleInputChange('precedentTxEVSalesHigh', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.precedentTxEVSalesLow, inputs.precedentTxEVSalesHigh) && inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Min
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesHigh && inputs.companySales
                          ? formatAxisValue(parseFloat(inputs.precedentTxEVSalesLow) * parseFloat(inputs.companySales))
                          : "—"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Max
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.precedentTxEVSalesLow && inputs.precedentTxEVSalesHigh && inputs.companySales
                          ? formatAxisValue(parseFloat(inputs.precedentTxEVSalesHigh) * parseFloat(inputs.companySales))
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 5: Precedent Tx EV/EBITDA */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Precedent Transactions EV/EBITDA (x)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/EBITDA (Low)
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVEBITDALow}
                        onChange={(e) => handleInputChange('precedentTxEVEBITDALow', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.precedentTxEVEBITDALow, inputs.precedentTxEVEBITDAHigh) && inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDAHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV/EBITDA (High)
                      </label>
                      <input
                        type="text"
                        value={inputs.precedentTxEVEBITDAHigh}
                        onChange={(e) => handleInputChange('precedentTxEVEBITDAHigh', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.precedentTxEVEBITDALow, inputs.precedentTxEVEBITDAHigh) && inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDAHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Min
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDAHigh && inputs.companyEBITDA
                          ? formatAxisValue(parseFloat(inputs.precedentTxEVEBITDALow) * parseFloat(inputs.companyEBITDA))
                          : "—"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Max
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.precedentTxEVEBITDALow && inputs.precedentTxEVEBITDAHigh && inputs.companyEBITDA
                          ? formatAxisValue(parseFloat(inputs.precedentTxEVEBITDAHigh) * parseFloat(inputs.companyEBITDA))
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 6: DCF */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Discounted Cash Flow (DCF)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DCF (Low $)
                      </label>
                      <input
                        type="text"
                        value={inputs.dcfLow}
                        onChange={(e) => handleInputChange('dcfLow', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.dcfLow, inputs.dcfHigh) && inputs.dcfLow && inputs.dcfHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DCF (High $)
                      </label>
                      <input
                        type="text"
                        value={inputs.dcfHigh}
                        onChange={(e) => handleInputChange('dcfHigh', e.target.value)}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !validateLowHigh(inputs.dcfLow, inputs.dcfHigh) && inputs.dcfLow && inputs.dcfHigh
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Min
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.dcfLow
                          ? formatAxisValue(parseFloat(inputs.dcfLow))
                          : "—"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EV Max
                      </label>
                      <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-sm font-medium text-blue-900">
                        {inputs.dcfHigh
                          ? formatAxisValue(parseFloat(inputs.dcfHigh))
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
