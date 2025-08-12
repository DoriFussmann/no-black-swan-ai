"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, ChartBarIcon, HomeIcon } from "@heroicons/react/24/outline";
import Container from "@/components/Container";

// Mock data for S&P 100 companies
const SP100_COMPANIES = [
  { symbol: "AAPL", name: "Apple Inc.", currency: "USD" },
  { symbol: "MSFT", name: "Microsoft Corporation", currency: "USD" },
  { symbol: "GOOGL", name: "Alphabet Inc.", currency: "USD" },
  { symbol: "AMZN", name: "Amazon.com Inc.", currency: "USD" },
  { symbol: "NVDA", name: "NVIDIA Corporation", currency: "USD" },
  { symbol: "META", name: "Meta Platforms Inc.", currency: "USD" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", currency: "USD" },
  { symbol: "LLY", name: "Eli Lilly and Company", currency: "USD" },
  { symbol: "V", name: "Visa Inc.", currency: "USD" },
  { symbol: "TSLA", name: "Tesla Inc.", currency: "USD" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", currency: "USD" },
  { symbol: "JNJ", name: "Johnson & Johnson", currency: "USD" },
  { symbol: "PG", name: "Procter & Gamble Co.", currency: "USD" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", currency: "USD" },
  { symbol: "HD", name: "Home Depot Inc.", currency: "USD" },
  { symbol: "MA", name: "Mastercard Inc.", currency: "USD" },
  { symbol: "PFE", name: "Pfizer Inc.", currency: "USD" },
  { symbol: "ABBV", name: "AbbVie Inc.", currency: "USD" },
  { symbol: "KO", name: "Coca-Cola Co.", currency: "USD" },
  { symbol: "PEP", name: "PepsiCo Inc.", currency: "USD" },
  { symbol: "AVGO", name: "Broadcom Inc.", currency: "USD" },
  { symbol: "COST", name: "Costco Wholesale Corp.", currency: "USD" },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc.", currency: "USD" },
  { symbol: "DHR", name: "Danaher Corp.", currency: "USD" },
  { symbol: "ACN", name: "Accenture PLC", currency: "USD" },
  { symbol: "WMT", name: "Walmart Inc.", currency: "USD" },
  { symbol: "CRM", name: "Salesforce Inc.", currency: "USD" },
  { symbol: "NEE", name: "NextEra Energy Inc.", currency: "USD" },
  { symbol: "ADBE", name: "Adobe Inc.", currency: "USD" },
  { symbol: "PM", name: "Philip Morris International", currency: "USD" },
  { symbol: "RTX", name: "Raytheon Technologies Corp.", currency: "USD" },
  { symbol: "TXN", name: "Texas Instruments Inc.", currency: "USD" },
  { symbol: "QCOM", name: "Qualcomm Inc.", currency: "USD" },
  { symbol: "HON", name: "Honeywell International Inc.", currency: "USD" },
  { symbol: "LOW", name: "Lowe's Companies Inc.", currency: "USD" },
  { symbol: "UPS", name: "United Parcel Service Inc.", currency: "USD" },
  { symbol: "INTC", name: "Intel Corp.", currency: "USD" },
  { symbol: "IBM", name: "International Business Machines", currency: "USD" },
  { symbol: "CAT", name: "Caterpillar Inc.", currency: "USD" },
  { symbol: "BA", name: "Boeing Co.", currency: "USD" },
  { symbol: "GS", name: "Goldman Sachs Group Inc.", currency: "USD" },
  { symbol: "AXP", name: "American Express Co.", currency: "USD" },
  { symbol: "SPGI", name: "S&P Global Inc.", currency: "USD" },
  { symbol: "ISRG", name: "Intuitive Surgical Inc.", currency: "USD" },
  { symbol: "GILD", name: "Gilead Sciences Inc.", currency: "USD" },
  { symbol: "LMT", name: "Lockheed Martin Corp.", currency: "USD" },
  { symbol: "TJX", name: "TJX Companies Inc.", currency: "USD" },
  { symbol: "DE", name: "Deere & Co.", currency: "USD" },
  { symbol: "BKNG", name: "Booking Holdings Inc.", currency: "USD" },
  { symbol: "ADI", name: "Analog Devices Inc.", currency: "USD" },
  { symbol: "MDLZ", name: "Mondelez International Inc.", currency: "USD" },
  { symbol: "REGN", name: "Regeneron Pharmaceuticals Inc.", currency: "USD" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals Inc.", currency: "USD" },
  { symbol: "KLAC", name: "KLA Corp.", currency: "USD" },
  { symbol: "PANW", name: "Palo Alto Networks Inc.", currency: "USD" },
  { symbol: "CDNS", name: "Cadence Design Systems Inc.", currency: "USD" },
  { symbol: "SNPS", name: "Synopsys Inc.", currency: "USD" },
  { symbol: "CHTR", name: "Charter Communications Inc.", currency: "USD" },
  { symbol: "CMCSA", name: "Comcast Corp.", currency: "USD" },
  { symbol: "TMUS", name: "T-Mobile US Inc.", currency: "USD" },
  { symbol: "VZ", name: "Verizon Communications Inc.", currency: "USD" },
  { symbol: "T", name: "AT&T Inc.", currency: "USD" },
  { symbol: "CME", name: "CME Group Inc.", currency: "USD" },
  { symbol: "ICE", name: "Intercontinental Exchange Inc.", currency: "USD" },
  { symbol: "C", name: "Citigroup Inc.", currency: "USD" },
  { symbol: "WFC", name: "Wells Fargo & Co.", currency: "USD" },
  { symbol: "USB", name: "U.S. Bancorp", currency: "USD" },
  { symbol: "PNC", name: "PNC Financial Services Group", currency: "USD" },
  { symbol: "TFC", name: "Truist Financial Corp.", currency: "USD" },
  { symbol: "COF", name: "Capital One Financial Corp.", currency: "USD" },
  { symbol: "SCHW", name: "Charles Schwab Corp.", currency: "USD" },
  { symbol: "BLK", name: "BlackRock Inc.", currency: "USD" },
  { symbol: "CB", name: "Chubb Ltd.", currency: "USD" },
  { symbol: "TRV", name: "Travelers Companies Inc.", currency: "USD" },
  { symbol: "PGR", name: "Progressive Corp.", currency: "USD" },
  { symbol: "ALL", name: "Allstate Corp.", currency: "USD" },
  { symbol: "AIG", name: "American International Group", currency: "USD" },
  { symbol: "PRU", name: "Prudential Financial Inc.", currency: "USD" },
  { symbol: "MET", name: "MetLife Inc.", currency: "USD" },
  { symbol: "AFL", name: "Aflac Inc.", currency: "USD" },
  { symbol: "HUM", name: "Humana Inc.", currency: "USD" },
  { symbol: "CI", name: "Cigna Group", currency: "USD" },
  { symbol: "ANTM", name: "Elevance Health Inc.", currency: "USD" },
  { symbol: "D", name: "Dominion Energy Inc.", currency: "USD" },
  { symbol: "DUK", name: "Duke Energy Corp.", currency: "USD" },
  { symbol: "SO", name: "Southern Co.", currency: "USD" },
  { symbol: "AEP", name: "American Electric Power Co.", currency: "USD" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", currency: "USD" },
  { symbol: "CVX", name: "Chevron Corp.", currency: "USD" },
  { symbol: "COP", name: "ConocoPhillips", currency: "USD" },
  { symbol: "EOG", name: "EOG Resources Inc.", currency: "USD" },
  { symbol: "SLB", name: "Schlumberger Ltd.", currency: "USD" },
  { symbol: "HAL", name: "Halliburton Co.", currency: "USD" },
  { symbol: "BKR", name: "Baker Hughes Co.", currency: "USD" },
  { symbol: "KMI", name: "Kinder Morgan Inc.", currency: "USD" },
  { symbol: "ET", name: "Energy Transfer LP", currency: "USD" },
  { symbol: "MPC", name: "Marathon Petroleum Corp.", currency: "USD" },
  { symbol: "PSX", name: "Phillips 66", currency: "USD" },
  { symbol: "VLO", name: "Valero Energy Corp.", currency: "USD" },
  { symbol: "OXY", name: "Occidental Petroleum Corp.", currency: "USD" },
  { symbol: "DVN", name: "Devon Energy Corp.", currency: "USD" },
  { symbol: "PXD", name: "Pioneer Natural Resources Co.", currency: "USD" },
  { symbol: "FANG", name: "Diamondback Energy Inc.", currency: "USD" },
  { symbol: "EQT", name: "EQT Corp.", currency: "USD" },
  { symbol: "CNX", name: "CNX Resources Corp.", currency: "USD" },
  { symbol: "RRC", name: "Range Resources Corp.", currency: "USD" },
  { symbol: "SWN", name: "Southwestern Energy Co.", currency: "USD" },
  { symbol: "CHK", name: "Chesapeake Energy Corp.", currency: "USD" },
  { symbol: "COG", name: "Cabot Oil & Gas Corp.", currency: "USD" },
  { symbol: "NFG", name: "National Fuel Gas Co.", currency: "USD" },
  { symbol: "WMB", name: "Williams Companies Inc.", currency: "USD" },
  { symbol: "OKE", name: "Oneok Inc.", currency: "USD" },
  { symbol: "TRP", name: "TC Energy Corp.", currency: "USD" },
  { symbol: "ENB", name: "Enbridge Inc.", currency: "USD" },
  { symbol: "PPL", name: "PPL Corp.", currency: "USD" },
  { symbol: "AEE", name: "Ameren Corp.", currency: "USD" },
  { symbol: "EIX", name: "Edison International", currency: "USD" },
  { symbol: "DTE", name: "DTE Energy Co.", currency: "USD" },
  { symbol: "WEC", name: "WEC Energy Group Inc.", currency: "USD" },
  { symbol: "CMS", name: "CMS Energy Corp.", currency: "USD" },
  { symbol: "XEL", name: "Xcel Energy Inc.", currency: "USD" }
];

export default function BenchmarkingPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCompanies, setFilteredCompanies] = useState(SP100_COMPANIES);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [comparableCompanies, setComparableCompanies] = useState<Array<{id: string, name: string, symbol: string, checked: boolean}>>([]);
  const [showComparables, setShowComparables] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<Array<{name: string, symbol: string, value: number, isSelected: boolean}>>([]);

  // Filter companies based on search queries
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(SP100_COMPANIES);
    } else {
      const filtered = SP100_COMPANIES.filter(
        company =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery]);

  // Mock function to find comparable companies
  const findComparableCompanies = () => {
    const mockComparables = [
      { id: "1", name: "Apple", symbol: "AAPL", checked: true },
      { id: "2", name: "Microsoft", symbol: "MSFT", checked: true },
      { id: "3", name: "Alphabet", symbol: "GOOGL", checked: true },
      { id: "4", name: "Amazon", symbol: "AMZN", checked: true },
      { id: "5", name: "NVIDIA", symbol: "NVDA", checked: true },
      { id: "6", name: "Meta", symbol: "META", checked: true },
      { id: "7", name: "Tesla", symbol: "TSLA", checked: true },
      { id: "8", name: "Adobe", symbol: "ADBE", checked: true }
    ];
    setComparableCompanies(mockComparables);
    setShowComparables(true);
  };

  // Handle company selection
  const handleCompanySelect = (symbol: string) => {
    setSelectedCompany(symbol);
    setSearchQuery("");
  };

  // Handle checkbox toggle for comparable companies
  const toggleComparableCompany = (id: string) => {
    setComparableCompanies(prev => 
      prev.map(company => 
        company.id === id 
          ? { ...company, checked: !company.checked }
          : company
      )
    );
  };

  // Generate benchmark data
  const generateBenchmark = () => {
    // Mock EV/LTM EBITDA data (in real app, this would come from API)
    const mockData = [
      { name: "Apple", symbol: "AAPL", value: 18.5, isSelected: true },
      { name: "Microsoft", symbol: "MSFT", value: 22.3, isSelected: false },
      { name: "Alphabet", symbol: "GOOGL", value: 16.8, isSelected: false },
      { name: "Amazon", symbol: "AMZN", value: 25.1, isSelected: false },
      { name: "NVIDIA", symbol: "NVDA", value: 35.2, isSelected: false },
      { name: "Meta", symbol: "META", value: 14.7, isSelected: false },
      { name: "Tesla", symbol: "TSLA", value: 28.9, isSelected: false },
      { name: "Adobe", symbol: "ADBE", value: 19.6, isSelected: false }
    ];

    // Sort by value (EV/LTM EBITDA) in descending order
    const sortedData = mockData.sort((a, b) => b.value - a.value);
    
    // Find the selected company and move it to the front with a gap
    const selectedCompany = sortedData.find(company => company.isSelected);
    const otherCompanies = sortedData.filter(company => !company.isSelected);
    
    // Create final array: [selected company, empty space, other companies]
    const finalData = [
      selectedCompany,
      { name: "", symbol: "", value: 0, isSelected: false }, // Empty space
      ...otherCompanies
    ].filter(Boolean);

    setBenchmarkData(finalData);
    setIsGenerated(true);
  };

  // Mock data for additional metrics
  const getEVSalesData = () => {
    return [
      { name: "Apple", symbol: "AAPL", value: 6.2, isSelected: true },
      { name: "Microsoft", symbol: "MSFT", value: 8.1, isSelected: false },
      { name: "Alphabet", symbol: "GOOGL", value: 5.9, isSelected: false },
      { name: "Amazon", symbol: "AMZN", value: 2.8, isSelected: false },
      { name: "NVIDIA", symbol: "NVDA", value: 12.5, isSelected: false },
      { name: "Meta", symbol: "META", value: 7.3, isSelected: false },
      { name: "Tesla", symbol: "TSLA", value: 9.4, isSelected: false },
      { name: "Adobe", symbol: "ADBE", value: 10.2, isSelected: false }
    ];
  };

  const getEBITDAMarginData = () => {
    return [
      { name: "Apple", symbol: "AAPL", value: 32.5, isSelected: true },
      { name: "Microsoft", symbol: "MSFT", value: 41.2, isSelected: false },
      { name: "Alphabet", symbol: "GOOGL", value: 28.7, isSelected: false },
      { name: "Amazon", symbol: "AMZN", value: 11.3, isSelected: false },
      { name: "NVIDIA", symbol: "NVDA", value: 35.8, isSelected: false },
      { name: "Meta", symbol: "META", value: 20.1, isSelected: false },
      { name: "Tesla", symbol: "TSLA", value: 15.6, isSelected: false },
      { name: "Adobe", symbol: "ADBE", value: 38.9, isSelected: false }
    ];
  };

  const getSalesGrowthData = () => {
    return [
      { name: "Apple", symbol: "AAPL", value: 8.2, isSelected: true },
      { name: "Microsoft", symbol: "MSFT", value: 15.7, isSelected: false },
      { name: "Alphabet", symbol: "GOOGL", value: 12.3, isSelected: false },
      { name: "Amazon", symbol: "AMZN", value: 9.8, isSelected: false },
      { name: "NVIDIA", symbol: "NVDA", value: 45.2, isSelected: false },
      { name: "Meta", symbol: "META", value: 18.9, isSelected: false },
      { name: "Tesla", symbol: "TSLA", value: 22.1, isSelected: false },
      { name: "Adobe", symbol: "ADBE", value: 11.4, isSelected: false }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Benchmarking</h1>
                  <p className="text-gray-600">Compare your performance against industry standards and competitors</p>
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
            {/* Left Column - User Inputs (25% width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Selection</h2>
                
                                 {/* Company Search */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Company
                   </label>
                   <div className="relative">
                     <input
                       type="text"
                       placeholder="Search S&P 100 companies..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                     />
                     <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                   </div>
                   
                   {/* Company Suggestions */}
                   {searchQuery && filteredCompanies.length > 0 && (
                     <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                       {filteredCompanies.map((company) => (
                         <button
                           key={company.symbol}
                           onClick={() => handleCompanySelect(company.symbol)}
                           className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                         >
                           <div className="font-medium text-gray-900">{company.symbol}</div>
                           <div className="text-sm text-gray-600">{company.name}</div>
                         </button>
                       ))}
                     </div>
                   )}
                 </div>

                                 {/* Find Comparables Button */}
                 <div className="mt-6 pt-6 border-t border-gray-200">
                   <button
                     onClick={findComparableCompanies}
                     disabled={!selectedCompany}
                     className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-4 ${
                       selectedCompany
                         ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                   >
                     Find Comparables
                   </button>
                 </div>

                                   {/* Comparable Companies Selection */}
                  {showComparables && comparableCompanies.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparable Companies</h3>
                      <div className="space-y-2">
                        {comparableCompanies.map((company) => (
                          <div key={company.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              id={company.id}
                              checked={company.checked}
                              onChange={() => toggleComparableCompany(company.id)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <label htmlFor={company.id} className="flex-1 cursor-pointer">
                              <div className="font-medium text-gray-900">{company.name}</div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                                   {/* Benchmark Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={generateBenchmark}
                      disabled={!selectedCompany}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        selectedCompany
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Benchmark
                    </button>
                  </div>
              </div>
            </div>

                         {/* Right Column - Benchmarking Analysis (75% width) */}
             <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Benchmarking Analysis</h2>
                
                {!selectedCompany ? (
                  <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Select a company to view benchmarking data</p>
                    </div>
                  </div>
                ) : !isGenerated ? (
                  <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Click "Generate Benchmarking Analysis" to view data</p>
                    </div>
                  </div>
                                 ) : (
                                       <div>
                      {/* First Row - EV/LTM EBITDA and EV/LTM Sales */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* EV/LTM EBITDA Chart */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">EV / LTM EBITDA</h3>
                          <div className="flex items-end space-x-4 h-64 w-full px-4">
                            {benchmarkData.map((company, index) => (
                              <div key={index} className="flex flex-col items-center w-32">
                                {company.name ? (
                                  <>
                                    <div className="text-xs text-gray-600 mb-2 text-center">
                                      {company.value.toFixed(1)}x
                                    </div>
                                    <div 
                                      className={`w-8 mx-auto transition-all duration-300 ${
                                        company.isSelected 
                                          ? 'bg-blue-600' 
                                          : 'bg-gray-400'
                                      }`}
                                      style={{ 
                                        height: `${(company.value / Math.max(...benchmarkData.filter(c => c.name).map(c => c.value))) * 200}px`,
                                        minHeight: '20px'
                                      }}
                                    ></div>
                                    <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                      {company.name}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex-1"></div> // Empty space
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EV/LTM Sales Chart */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">EV / LTM Sales</h3>
                          <div className="flex items-end space-x-4 h-64 w-full px-4">
                            {getEVSalesData().map((company, index) => (
                              <div key={index} className="flex flex-col items-center w-32">
                                {company.name ? (
                                  <>
                                    <div className="text-xs text-gray-600 mb-2 text-center">
                                      {company.value.toFixed(1)}x
                                    </div>
                                    <div 
                                      className={`w-8 mx-auto transition-all duration-300 ${
                                        company.isSelected 
                                          ? 'bg-blue-600' 
                                          : 'bg-gray-400'
                                      }`}
                                      style={{ 
                                        height: `${(company.value / Math.max(...getEVSalesData().filter(c => c.name).map(c => c.value))) * 200}px`,
                                        minHeight: '20px'
                                      }}
                                    ></div>
                                    <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                      {company.name}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex-1"></div> // Empty space
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Second Row - EBITDA Margin and Sales Growth */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* LTM EBITDA Margin Chart */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">LTM EBITDA Margin (%)</h3>
                          <div className="flex items-end space-x-4 h-64 w-full px-4">
                            {getEBITDAMarginData().map((company, index) => (
                              <div key={index} className="flex flex-col items-center w-32">
                                {company.name ? (
                                  <>
                                    <div className="text-xs text-gray-600 mb-2 text-center">
                                      {company.value.toFixed(1)}%
                                    </div>
                                    <div 
                                      className={`w-8 mx-auto transition-all duration-300 ${
                                        company.isSelected 
                                          ? 'bg-blue-600' 
                                          : 'bg-gray-400'
                                      }`}
                                      style={{ 
                                        height: `${(company.value / Math.max(...getEBITDAMarginData().filter(c => c.name).map(c => c.value))) * 200}px`,
                                        minHeight: '20px'
                                      }}
                                    ></div>
                                    <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                      {company.name}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex-1"></div> // Empty space
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* LTM Sales Growth Chart */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">LTM Sales Growth (%)</h3>
                          <div className="flex items-end space-x-4 h-64 w-full px-4">
                            {getSalesGrowthData().map((company, index) => (
                              <div key={index} className="flex flex-col items-center w-32">
                                {company.name ? (
                                  <>
                                    <div className="text-xs text-gray-600 mb-2 text-center">
                                      {company.value.toFixed(1)}%
                                    </div>
                                    <div 
                                      className={`w-8 mx-auto transition-all duration-300 ${
                                        company.isSelected 
                                          ? 'bg-blue-600' 
                                          : 'bg-gray-400'
                                      }`}
                                      style={{ 
                                        height: `${(company.value / Math.max(...getSalesGrowthData().filter(c => c.name).map(c => c.value))) * 200}px`,
                                        minHeight: '20px'
                                      }}
                                    ></div>
                                    <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                      {company.name}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex-1"></div> // Empty space
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    {/* Benchmarking Metrics */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmarking Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">--</div>
                            <div className="text-sm text-gray-600">Industry Average</div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">--</div>
                            <div className="text-sm text-gray-600">Peer Comparison</div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">--</div>
                            <div className="text-sm text-gray-600">Performance Score</div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">--</div>
                            <div className="text-sm text-gray-600">Ranking</div>
                          </div>
                        </div>
                      </div>
                    </div>
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
