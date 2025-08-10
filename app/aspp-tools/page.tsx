"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarIcon, MagnifyingGlassIcon, ChartBarIcon, HomeIcon } from "@heroicons/react/24/outline";
import Container from "@/components/Container";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  { symbol: "EOG", name: "EOG Resources Inc.", currency: "USD" },
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
  { symbol: "XEL", name: "Xcel Energy Inc.", currency: "USD" },
  { symbol: "NEE", name: "NextEra Energy Inc.", currency: "USD" },
  { symbol: "D", name: "Dominion Energy Inc.", currency: "USD" },
  { symbol: "DUK", name: "Duke Energy Corp.", currency: "USD" },
  { symbol: "SO", name: "Southern Co.", currency: "USD" },
  { symbol: "AEP", name: "American Electric Power Co.", currency: "USD" }
];

// Mock company data structure
interface CompanyData {
  symbol: string;
  name: string;
  currency: string;
  high12m: number;
  low12m: number;
  avg12m: number;
  change12m: number;
  change6m: number;
  currentPrice: number;
  priceHistory: PricePoint[];
}

// Price history data point
interface PricePoint {
  date: string;
  price: number;
  volume: number;
}

// Mock news event structure
interface NewsEvent {
  id: string;
  date: string;
  summary: string;
  impact: "positive" | "negative" | "neutral";
  priceAtEvent: number;
  chartPosition: number; // Index in the price history array
}

// Mock news event structure
interface NewsEvent {
  id: string;
  date: string;
  summary: string;
  impact: "positive" | "negative" | "neutral";
  priceAtEvent: number;
}

export default function ASPPToolsPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [filteredCompanies, setFilteredCompanies] = useState(SP100_COMPANIES);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Filter companies based on search query
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

  // Get today's date (adjusted for weekends)
  const getLatestTradingDay = (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // If it's weekend, go back to Friday
    if (dayOfWeek === 0) { // Sunday
      today.setDate(today.getDate() - 2);
    } else if (dayOfWeek === 6) { // Saturday
      today.setDate(today.getDate() - 1);
    }
    
    return today.toISOString().split('T')[0];
  };

  // Set default start date to 1 year ago
  useEffect(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    setStartDate(oneYearAgo.toISOString().split('T')[0]);
  }, []);

  // Mock function to fetch company data
  const fetchCompanyData = async (symbol: string) => {
    // TODO: Implement API call to fetch real company data
    // This would typically call a financial data API like Alpha Vantage, Yahoo Finance, etc.
    
    // Generate realistic price history for the past 12 months
    const generatePriceHistory = (): PricePoint[] => {
      const history: PricePoint[] = [];
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      
      let currentPrice = 150; // Starting price
      const volatility = 0.02; // 2% daily volatility
      
      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Generate realistic price movement
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice = Math.max(currentPrice + change, 50); // Minimum price of $50
        
        // Add some trend
        if (i > 200) currentPrice += 0.1; // Upward trend in recent months
        
        history.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(currentPrice * 100) / 100,
          volume: Math.floor(Math.random() * 10000000) + 1000000
        });
      }
      
      return history;
    };
    
    const priceHistory = generatePriceHistory();
    const currentPrice = priceHistory[priceHistory.length - 1].price;
    const high12m = Math.max(...priceHistory.map(p => p.price));
    const low12m = Math.min(...priceHistory.map(p => p.price));
    const avg12m = priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length;
    
    const startPrice = priceHistory[0].price;
    const change12m = ((currentPrice - startPrice) / startPrice) * 100;
    const sixMonthIndex = Math.floor(priceHistory.length * 0.5);
    const sixMonthPrice = priceHistory[sixMonthIndex].price;
    const change6m = ((currentPrice - sixMonthPrice) / sixMonthPrice) * 100;
    
    const mockData: CompanyData = {
      symbol,
      name: SP100_COMPANIES.find(c => c.symbol === symbol)?.name || "",
      currency: "USD",
      high12m: Math.round(high12m * 100) / 100,
      low12m: Math.round(low12m * 100) / 100,
      avg12m: Math.round(avg12m * 100) / 100,
      change12m: Math.round(change12m * 100) / 100,
      change6m: Math.round(change6m * 100) / 100,
      currentPrice: Math.round(currentPrice * 100) / 100,
      priceHistory
    };
    
    setCompanyData(mockData);
    
    // Generate news events positioned on the chart
    const mockNewsEvents: NewsEvent[] = [
      {
        id: "1",
        date: "2024-01-15",
        summary: "Q4 earnings beat expectations by 15%",
        impact: "positive",
        priceAtEvent: 165.30,
        chartPosition: Math.floor(priceHistory.length * 0.15)
      },
      {
        id: "2",
        date: "2024-02-20",
        summary: "New AI product launch announced",
        impact: "positive",
        priceAtEvent: 172.45,
        chartPosition: Math.floor(priceHistory.length * 0.35)
      },
      {
        id: "3",
        date: "2024-03-10",
        summary: "Supply chain disruption reported",
        impact: "negative",
        priceAtEvent: 168.90,
        chartPosition: Math.floor(priceHistory.length * 0.45)
      },
      {
        id: "4",
        date: "2024-04-05",
        summary: "Partnership with major tech company",
        impact: "positive",
        priceAtEvent: 175.20,
        chartPosition: Math.floor(priceHistory.length * 0.55)
      },
      {
        id: "5",
        date: "2024-05-12",
        summary: "Regulatory concerns raised",
        impact: "negative",
        priceAtEvent: 170.80,
        chartPosition: Math.floor(priceHistory.length * 0.65)
      }
    ];
    
    setNewsEvents(mockNewsEvents);
    setIsGenerated(true);
  };

  const handleCompanySelect = (symbol: string) => {
    setSelectedCompany(symbol);
    setSearchQuery("");
    setCompanyData(null);
    setNewsEvents([]);
    setIsGenerated(false);
  };

  // Create chart data and options
  const createChartData = () => {
    if (!companyData?.priceHistory) return null;

    const labels = companyData.priceHistory.map(point => 
      new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    );
    
    const data = companyData.priceHistory.map(point => point.price);

    return {
      labels,
      datasets: [
        {
          label: `${companyData.symbol} Share Price`,
          data,
          borderColor: 'rgb(220, 38, 38)',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgb(220, 38, 38)',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2,
        }
      ]
    };
  };

  const createChartOptions = () => {
    if (!companyData?.priceHistory || !newsEvents) return {};

    // Calculate price range for Y-axis scaling with exactly 5 grid lines
    const priceValues = companyData.priceHistory.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const priceRange = maxPrice - minPrice;
    
    // Calculate tick interval to get exactly 5 grid lines (4 intervals)
    const tickInterval = priceRange / 4;
    
    // Round min and max to fit the tick intervals with padding
    const roundedMin = Math.floor(minPrice / tickInterval) * tickInterval;
    const roundedMax = Math.ceil(maxPrice / tickInterval) * tickInterval;
    
    // Add padding to ensure data points aren't at the very edges
    const padding = tickInterval * 0.2;

    // Create unique colors for each event
    const eventColors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
    ];

    const annotations = newsEvents.map((event, index) => ({
      type: 'point' as const,
      xValue: event.chartPosition,
      yValue: companyData.priceHistory[event.chartPosition]?.price || event.priceAtEvent, // Use actual price from line
      backgroundColor: eventColors[index % eventColors.length],
      borderColor: 'white',
      borderWidth: 2,
      radius: 6,
      label: {
        content: event.date,
        position: 'top' as const,
        backgroundColor: eventColors[index % eventColors.length],
        color: 'white',
        padding: 6,
        borderRadius: 4,
        font: {
          size: 10,
          weight: 'bold'
        },
        display: 'always' as const
      }
    }));

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgb(220, 38, 38)',
          borderWidth: 1,
          callbacks: {
            title: (context: { dataIndex: number }[]) => {
              const index = context[0].dataIndex;
              const date = companyData?.priceHistory[index]?.date;
              return date ? new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : '';
            },
            label: (context: { parsed: { y: number } }) => {
              return `Price: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
            }
          }
        },
        annotation: {
          annotations
        }
      },
      scales: {
        x: {
          type: 'category' as const,
          grid: {
            display: false
          },
          ticks: {
            maxTicksLimit: 12,
            color: '#6B7280',
            font: {
              size: 11
            }
          }
        },
        y: {
          type: 'linear' as const,
          position: 'left' as const,
          min: roundedMin - padding,
          max: roundedMax + padding,
          grid: {
            color: 'rgba(107, 114, 128, 0.1)'
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 11
            },
            callback: function(tickValue: string | number) {
              return `$${Number(tickValue).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
            },
            stepSize: tickInterval,
            maxTicksLimit: 5
          }
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Price Tracker</h1>
                  <p className="text-gray-600">Annotated Share Price Performance Analysis</p>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Latest Trading Day)
                </label>
                <input
                  type="text"
                  value={getLatestTradingDay()}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

                             {/* Company Summary Table */}
               {isGenerated && companyData && (
                 <div className="border-t border-gray-200 pt-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Summary</h3>
                   <div className="space-y-3 text-sm">
                     <div className="flex justify-between">
                       <span className="text-gray-600">Ticker:</span>
                       <span className="font-medium">{companyData.symbol}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Currency:</span>
                       <span className="font-medium">{companyData.currency}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Current Price:</span>
                       <span className="font-medium">${companyData.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">12M High:</span>
                       <span className="font-medium">${companyData.high12m.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">12M Low:</span>
                       <span className="font-medium">${companyData.low12m.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">12M Average:</span>
                       <span className="font-medium">${companyData.avg12m.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">12M Change:</span>
                       <span className={`font-medium ${companyData.change12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {companyData.change12m >= 0 ? '+' : ''}{companyData.change12m.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                       </span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">6M Change:</span>
                       <span className={`font-medium ${companyData.change6m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {companyData.change6m >= 0 ? '+' : ''}{companyData.change6m.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                       </span>
                     </div>
                   </div>
                 </div>
               )}

                               {/* Generate Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      if (selectedCompany) {
                        fetchCompanyData(selectedCompany);
                      }
                    }}
                    disabled={!selectedCompany}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedCompany
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Generate Analysis
                  </button>
                </div>
            </div>
          </div>

          {/* Right Column - Performance Graph (75% width) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Tracker</h2>
              
                             {!selectedCompany ? (
                 <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                   <div className="text-center">
                     <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                     <p>Select a company to view performance data</p>
                   </div>
                 </div>
               ) : !isGenerated ? (
                 <div className="flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                   <div className="text-center">
                     <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                     <p>Click &quot;Generate Analysis&quot; to view performance data</p>
                   </div>
                 </div>
               ) : (
                                 <div>
                   {/* Interactive Share Price Chart */}
                   <div className="bg-white rounded-lg p-6 border border-gray-200">
                     <div style={{ aspectRatio: '16/9' }}>
                       {createChartData() && (
                         <Line 
                           data={createChartData()!} 
                           options={createChartOptions()} 
                         />
                       )}
                     </div>
                   </div>

                   {/* News Events Overlay */}
                   {newsEvents.length > 0 && (
                     <div className="mt-8">
                       <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Events Impacting Price</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         {newsEvents.map((event, index) => {
                           const eventColors = [
                             '#3B82F6', // Blue
                             '#10B981', // Green
                             '#F59E0B', // Amber
                             '#EF4444', // Red
                             '#8B5CF6', // Purple
                             '#F97316', // Orange
                             '#06B6D4', // Cyan
                             '#84CC16', // Lime
                           ];
                           const eventColor = eventColors[index % eventColors.length];
                           
                           return (
                             <div
                               key={event.id}
                               className="p-4 rounded-lg border-l-4 bg-white border shadow-sm h-36 flex flex-col"
                               style={{ borderLeftColor: eventColor, borderLeftWidth: '4px' }}
                             >
                               <div className="flex items-start justify-between mb-2">
                                 <div className="text-sm font-medium text-gray-900">
                                   {new Date(event.date).toLocaleDateString('en-US', {
                                     day: '2-digit',
                                     month: 'short',
                                     year: '2-digit'
                                   })}
                                 </div>
                                 <div 
                                   className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                   style={{ 
                                     backgroundColor: event.impact === 'positive' ? '#10B981' : 
                                                   event.impact === 'negative' ? '#EF4444' : 
                                                   eventColor 
                                   }}
                                 >
                                   {event.impact}
                                 </div>
                               </div>
                               <p className="text-gray-700 text-sm leading-tight flex-1 whitespace-normal">{event.summary}</p>
                               <div className="text-sm text-gray-500 mt-auto pt-2">
                                 Price: ${event.priceAtEvent.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   )}
                 </div>
               )}
             </div>
           </div>
                   </div>

                     {/* Suggested Design Style Box - Separate Section */}
           <div className="mt-8">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-2"></div>
                               <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Suggested Design Style</h3>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                      <div className="w-full" style={{ aspectRatio: '16/9' }}>
                        <div className="flex items-center justify-center h-full text-blue-600">
                          <div className="text-center">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                              </svg>
                            </div>
                            <p className="text-xs font-medium">Design Preview</p>
                            <p className="text-xs text-blue-500 mt-1">16:9 Aspect Ratio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Suggested Design Style</h3>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                      <div className="w-full" style={{ aspectRatio: '16/9' }}>
                        <div className="flex items-center justify-center h-full text-blue-600">
                          <div className="text-center">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                              </svg>
                            </div>
                            <p className="text-xs font-medium">Design Preview</p>
                            <p className="text-xs text-blue-500 mt-1">16:9 Aspect Ratio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
           </div>
       </Container>
     </main>
   </div>
   );
 }
