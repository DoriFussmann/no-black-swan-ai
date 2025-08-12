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
  { symbol: "JPM", name: "JPM", currency: "USD" },
  { symbol: "JNJ", name: "J&J", currency: "USD" },
  { symbol: "PG", name: "Procter & Gamble Co.", currency: "USD" },
  { symbol: "UNH", name: "UHC", currency: "USD" },
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
  const [sortByMarketCap, setSortByMarketCap] = useState<boolean>(false);
  const [addCompanyQuery, setAddCompanyQuery] = useState<string>("");
  const [filteredAddCompanies, setFilteredAddCompanies] = useState(SP100_COMPANIES);

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

  // Filter companies for Add Company section
  useEffect(() => {
    if (addCompanyQuery.trim() === "") {
      setFilteredAddCompanies(SP100_COMPANIES);
    } else {
      const filtered = SP100_COMPANIES.filter(
        company =>
          company.name.toLowerCase().includes(addCompanyQuery.toLowerCase()) ||
          company.symbol.toLowerCase().includes(addCompanyQuery.toLowerCase())
      );
      setFilteredAddCompanies(filtered);
    }
  }, [addCompanyQuery]);

  // Mock function to find comparable companies
  const findComparableCompanies = () => {
    // Pool of companies that have data in the chart functions
    const companyPool = [
      { id: "1", name: "Apple", symbol: "AAPL" },
      { id: "2", name: "Microsoft", symbol: "MSFT" },
      { id: "3", name: "Alphabet", symbol: "GOOGL" },
      { id: "4", name: "Amazon", symbol: "AMZN" },
      { id: "5", name: "NVIDIA", symbol: "NVDA" },
      { id: "6", name: "Meta", symbol: "META" },
      { id: "7", name: "Tesla", symbol: "TSLA" },
      { id: "8", name: "Adobe", symbol: "ADBE" },
      { id: "9", name: "Eli Lilly", symbol: "LLY" },
      { id: "10", name: "J&J", symbol: "JNJ" },
      { id: "11", name: "Pfizer", symbol: "PFE" },
      { id: "12", name: "AbbVie", symbol: "ABBV" },
      { id: "13", name: "JPM", symbol: "JPM" },
      { id: "14", name: "Bank of America", symbol: "BAC" },
      { id: "15", name: "Wells Fargo", symbol: "WFC" },
      { id: "16", name: "Goldman Sachs", symbol: "GS" },
      { id: "17", name: "Exxon Mobil", symbol: "XOM" },
      { id: "18", name: "Chevron", symbol: "CVX" },
      { id: "19", name: "UHC", symbol: "UNH" },
      { id: "20", name: "Home Depot", symbol: "HD" },
      { id: "21", name: "Mastercard", symbol: "MA" },
      { id: "22", name: "Visa", symbol: "V" },
      { id: "23", name: "Coca-Cola", symbol: "KO" },
      { id: "24", name: "PepsiCo", symbol: "PEP" }
    ];

    // Get the selected company symbol
    const selectedCompanySymbol = selectedCompany ? SP100_COMPANIES.find(c => 
      c.name.replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '') === selectedCompany
    )?.symbol : null;

    // Filter out the chosen company from the pool
    const filteredPool = companyPool.filter(company => company.symbol !== selectedCompanySymbol);

    // Randomly select 8 companies from the filtered pool
    const shuffled = [...filteredPool].sort(() => 0.5 - Math.random());
    const selectedCompanies = shuffled.slice(0, 8).map((company, index) => ({
      ...company,
      id: (index + 1).toString(),
      checked: true
    }));

    setComparableCompanies(selectedCompanies);
    setShowComparables(true);
  };

  // Handle company selection
  const handleAddCompanySelect = (symbol: string) => {
    const company = SP100_COMPANIES.find(c => c.symbol === symbol);
    if (company) {
      const shortName = company.name
        .replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '');
      
      // Add the company to comparable companies if it's not already there
      const isAlreadyAdded = comparableCompanies.some(comp => comp.symbol === symbol);
      if (!isAlreadyAdded) {
        const newCompany = {
          id: (comparableCompanies.length + 1).toString(),
          name: shortName,
          symbol: symbol,
          checked: true
        };
        setComparableCompanies([...comparableCompanies, newCompany]);
      }
    }
    setAddCompanyQuery("");
  };

  const handleCompanySelect = (symbol: string) => {
    const company = SP100_COMPANIES.find(c => c.symbol === symbol);
    if (company) {
      // Remove common suffixes like "Inc.", "Corporation", "Co.", etc.
      const shortName = company.name
        .replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '');
      setSelectedCompany(shortName);
      // Set the search query to show the selected company name
      setSearchQuery(shortName);
      
      // Reset the UI state when a new company is selected
      setIsGenerated(false);
      setShowComparables(false);
      setComparableCompanies([]);
      setBenchmarkData([]);
    } else {
      setSelectedCompany(symbol);
      setSearchQuery(symbol);
    }
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

  // Generate benchmark data with specific company symbol
  const generateBenchmarkWithCompany = (selectedCompanySymbol: string) => {
    // Mock EV/LTM EBITDA data (in real app, this would come from API)
    const mockData = [
      { name: "Apple", symbol: "AAPL", value: 18.5, isSelected: selectedCompanySymbol === "AAPL" },
      { name: "Microsoft", symbol: "MSFT", value: 22.3, isSelected: selectedCompanySymbol === "MSFT" },
      { name: "Alphabet", symbol: "GOOGL", value: 16.8, isSelected: selectedCompanySymbol === "GOOGL" },
      { name: "Amazon", symbol: "AMZN", value: 25.1, isSelected: selectedCompanySymbol === "AMZN" },
      { name: "NVIDIA", symbol: "NVDA", value: 35.2, isSelected: selectedCompanySymbol === "NVDA" },
      { name: "Meta", symbol: "META", value: 14.7, isSelected: selectedCompanySymbol === "META" },
      { name: "Tesla", symbol: "TSLA", value: 28.9, isSelected: selectedCompanySymbol === "TSLA" },
      { name: "Adobe", symbol: "ADBE", value: 19.6, isSelected: selectedCompanySymbol === "ADBE" }
    ];

    // Always put selected company first, then sort others based on selected method
    const selectedCompany = mockData.find(company => company.isSelected);
    const otherCompanies = mockData.filter(company => !company.isSelected);
    
    // Sort other companies based on selected method
    let sortedOtherCompanies;
    if (sortByMarketCap) {
      // Mock market cap data (in billions)
      const marketCapData = {
        "MSFT": 2800, "GOOGL": 1800, "AMZN": 1600, 
        "NVDA": 1200, "META": 800, "TSLA": 600, "ADBE": 200
      };
      sortedOtherCompanies = otherCompanies.sort((a, b) => marketCapData[b.symbol] - marketCapData[a.symbol]);
    } else {
      // Sort by value (EV/LTM EBITDA) in descending order
      sortedOtherCompanies = otherCompanies.sort((a, b) => b.value - a.value);
    }
    
    // Create final array: [selected company, empty space, other companies]
    const finalData = [
      selectedCompany,
      { name: "", symbol: "", value: 0, isSelected: false }, // Empty space
      ...sortedOtherCompanies
    ].filter(Boolean);

    setBenchmarkData(finalData);
    setIsGenerated(true);
  };

  // Generate benchmark data
  const generateBenchmark = () => {
    // Get the selected company symbol from the full company name
    const selectedCompanySymbol = selectedCompany ? SP100_COMPANIES.find(c => 
      c.name.replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '') === selectedCompany
    )?.symbol : "AAPL";

    generateBenchmarkWithCompany(selectedCompanySymbol);
  };

  // Mock data for EV/LTM EBITDA
  const getEBITDAData = () => {
    // Get the selected company symbol from the full company name
    const selectedCompanySymbol = selectedCompany ? SP100_COMPANIES.find(c => 
      c.name.replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '') === selectedCompany
    )?.symbol : "AAPL";

    const mockData = [
      { name: "Apple", symbol: "AAPL", value: 18.5, isSelected: selectedCompanySymbol === "AAPL" },
      { name: "Microsoft", symbol: "MSFT", value: 22.3, isSelected: selectedCompanySymbol === "MSFT" },
      { name: "Alphabet", symbol: "GOOGL", value: 16.8, isSelected: selectedCompanySymbol === "GOOGL" },
      { name: "Amazon", symbol: "AMZN", value: 25.1, isSelected: selectedCompanySymbol === "AMZN" },
      { name: "NVIDIA", symbol: "NVDA", value: 35.2, isSelected: selectedCompanySymbol === "NVDA" },
      { name: "Meta", symbol: "META", value: 14.7, isSelected: selectedCompanySymbol === "META" },
      { name: "Tesla", symbol: "TSLA", value: 28.9, isSelected: selectedCompanySymbol === "TSLA" },
      { name: "Adobe", symbol: "ADBE", value: 19.6, isSelected: selectedCompanySymbol === "ADBE" },
      { name: "Eli Lilly", symbol: "LLY", value: 24.3, isSelected: selectedCompanySymbol === "LLY" },
      { name: "J&J", symbol: "JNJ", value: 15.2, isSelected: selectedCompanySymbol === "JNJ" },
      { name: "Pfizer", symbol: "PFE", value: 12.8, isSelected: selectedCompanySymbol === "PFE" },
      { name: "AbbVie", symbol: "ABBV", value: 18.9, isSelected: selectedCompanySymbol === "ABBV" },
      { name: "JPM", symbol: "JPM", value: 11.4, isSelected: selectedCompanySymbol === "JPM" },
      { name: "Bank of America", symbol: "BAC", value: 9.7, isSelected: selectedCompanySymbol === "BAC" },
      { name: "Wells Fargo", symbol: "WFC", value: 8.3, isSelected: selectedCompanySymbol === "WFC" },
      { name: "Goldman Sachs", symbol: "GS", value: 13.6, isSelected: selectedCompanySymbol === "GS" },
      { name: "Exxon Mobil", symbol: "XOM", value: 7.2, isSelected: selectedCompanySymbol === "XOM" },
      { name: "Chevron", symbol: "CVX", value: 8.9, isSelected: selectedCompanySymbol === "CVX" },
      { name: "UHC", symbol: "UNH", value: 16.4, isSelected: selectedCompanySymbol === "UNH" },
      { name: "Home Depot", symbol: "HD", value: 13.8, isSelected: selectedCompanySymbol === "HD" },
      { name: "Mastercard", symbol: "MA", value: 19.7, isSelected: selectedCompanySymbol === "MA" },
      { name: "Visa", symbol: "V", value: 18.2, isSelected: selectedCompanySymbol === "V" },
      { name: "Coca-Cola", symbol: "KO", value: 22.1, isSelected: selectedCompanySymbol === "KO" },
      { name: "PepsiCo", symbol: "PEP", value: 20.5, isSelected: selectedCompanySymbol === "PEP" }
    ];

    // Filter to only include checked comparable companies and the selected company
    const checkedSymbols = comparableCompanies.filter(comp => comp.checked).map(comp => comp.symbol);
    const filteredData = mockData.filter(company => 
      company.isSelected || checkedSymbols.includes(company.symbol)
    );

    // Always put selected company first, then sort others based on selected method
    const selectedCompanyData = filteredData.find(company => company.isSelected);
    const otherCompanies = filteredData.filter(company => !company.isSelected);
    
    // Sort other companies based on selected method
    let sortedOtherCompanies;
    if (sortByMarketCap) {
      // Mock market cap data (in billions)
      const marketCapData = {
        "MSFT": 2800, "GOOGL": 1800, "AMZN": 1600, 
        "NVDA": 1200, "META": 800, "TSLA": 600, "ADBE": 200
      };
      sortedOtherCompanies = otherCompanies.sort((a, b) => marketCapData[b.symbol] - marketCapData[a.symbol]);
    } else {
      // Sort by value (EV/LTM EBITDA) in descending order
      sortedOtherCompanies = otherCompanies.sort((a, b) => b.value - a.value);
    }
    
    // Create final array: [selected company, empty space, other companies]
    return [
      selectedCompanyData,
      { name: "", symbol: "", value: 0, isSelected: false }, // Empty space
      ...sortedOtherCompanies
    ].filter(Boolean);
  };

  // Mock data for additional metrics
  const getEVSalesData = () => {
    // Get the selected company symbol from the full company name
    const selectedCompanySymbol = selectedCompany ? SP100_COMPANIES.find(c => 
      c.name.replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '') === selectedCompany
    )?.symbol : "AAPL";

    const mockData = [
      { name: "Apple", symbol: "AAPL", value: 6.2, isSelected: selectedCompanySymbol === "AAPL" },
      { name: "Microsoft", symbol: "MSFT", value: 8.1, isSelected: selectedCompanySymbol === "MSFT" },
      { name: "Alphabet", symbol: "GOOGL", value: 5.9, isSelected: selectedCompanySymbol === "GOOGL" },
      { name: "Amazon", symbol: "AMZN", value: 2.8, isSelected: selectedCompanySymbol === "AMZN" },
      { name: "NVIDIA", symbol: "NVDA", value: 12.5, isSelected: selectedCompanySymbol === "NVDA" },
      { name: "Meta", symbol: "META", value: 7.3, isSelected: selectedCompanySymbol === "META" },
      { name: "Tesla", symbol: "TSLA", value: 9.4, isSelected: selectedCompanySymbol === "TSLA" },
      { name: "Adobe", symbol: "ADBE", value: 10.2, isSelected: selectedCompanySymbol === "ADBE" },
      { name: "Eli Lilly", symbol: "LLY", value: 8.7, isSelected: selectedCompanySymbol === "LLY" },
      { name: "J&J", symbol: "JNJ", value: 4.2, isSelected: selectedCompanySymbol === "JNJ" },
      { name: "Pfizer", symbol: "PFE", value: 3.8, isSelected: selectedCompanySymbol === "PFE" },
      { name: "AbbVie", symbol: "ABBV", value: 6.1, isSelected: selectedCompanySymbol === "ABBV" },
      { name: "JPM", symbol: "JPM", value: 2.9, isSelected: selectedCompanySymbol === "JPM" },
      { name: "Bank of America", symbol: "BAC", value: 2.1, isSelected: selectedCompanySymbol === "BAC" },
      { name: "Wells Fargo", symbol: "WFC", value: 1.8, isSelected: selectedCompanySymbol === "WFC" },
      { name: "Goldman Sachs", symbol: "GS", value: 3.4, isSelected: selectedCompanySymbol === "GS" },
      { name: "Exxon Mobil", symbol: "XOM", value: 1.2, isSelected: selectedCompanySymbol === "XOM" },
      { name: "Chevron", symbol: "CVX", value: 1.5, isSelected: selectedCompanySymbol === "CVX" },
      { name: "UHC", symbol: "UNH", value: 5.8, isSelected: selectedCompanySymbol === "UNH" },
      { name: "Home Depot", symbol: "HD", value: 2.3, isSelected: selectedCompanySymbol === "HD" },
      { name: "Mastercard", symbol: "MA", value: 12.4, isSelected: selectedCompanySymbol === "MA" },
      { name: "Visa", symbol: "V", value: 11.7, isSelected: selectedCompanySymbol === "V" },
      { name: "Coca-Cola", symbol: "KO", value: 6.2, isSelected: selectedCompanySymbol === "KO" },
      { name: "PepsiCo", symbol: "PEP", value: 5.9, isSelected: selectedCompanySymbol === "PEP" }
    ];

    // Filter to only include checked comparable companies and the selected company
    const checkedSymbols = comparableCompanies.filter(comp => comp.checked).map(comp => comp.symbol);
    const filteredData = mockData.filter(company => 
      company.isSelected || checkedSymbols.includes(company.symbol)
    );

    // Always put selected company first, then sort others based on selected method
    const selectedCompanyData = filteredData.find(company => company.isSelected);
    const otherCompanies = filteredData.filter(company => !company.isSelected);
    
    // Sort other companies based on selected method
    let sortedOtherCompanies;
    if (sortByMarketCap) {
      // Mock market cap data (in billions)
      const marketCapData = {
        "MSFT": 2800, "GOOGL": 1800, "AMZN": 1600, 
        "NVDA": 1200, "META": 800, "TSLA": 600, "ADBE": 200
      };
      sortedOtherCompanies = otherCompanies.sort((a, b) => marketCapData[b.symbol] - marketCapData[a.symbol]);
    } else {
      // Sort by value (multiple) in descending order
      sortedOtherCompanies = otherCompanies.sort((a, b) => b.value - a.value);
    }
    
    // Create final array: [selected company, empty space, other companies]
    return [
      selectedCompanyData,
      { name: "", symbol: "", value: 0, isSelected: false }, // Empty space
      ...sortedOtherCompanies
    ].filter(Boolean);
  };

  const getEBITDAMarginData = () => {
    // Get the selected company symbol from the full company name
    const selectedCompanySymbol = selectedCompany ? SP100_COMPANIES.find(c => 
      c.name.replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '') === selectedCompany
    )?.symbol : "AAPL";

    const mockData = [
      { name: "Apple", symbol: "AAPL", value: 32.5, isSelected: selectedCompanySymbol === "AAPL" },
      { name: "Microsoft", symbol: "MSFT", value: 41.2, isSelected: selectedCompanySymbol === "MSFT" },
      { name: "Alphabet", symbol: "GOOGL", value: 28.7, isSelected: selectedCompanySymbol === "GOOGL" },
      { name: "Amazon", symbol: "AMZN", value: 11.3, isSelected: selectedCompanySymbol === "AMZN" },
      { name: "NVIDIA", symbol: "NVDA", value: 35.8, isSelected: selectedCompanySymbol === "NVDA" },
      { name: "Meta", symbol: "META", value: 20.1, isSelected: selectedCompanySymbol === "META" },
      { name: "Tesla", symbol: "TSLA", value: 15.6, isSelected: selectedCompanySymbol === "TSLA" },
      { name: "Adobe", symbol: "ADBE", value: 38.9, isSelected: selectedCompanySymbol === "ADBE" },
      { name: "Eli Lilly", symbol: "LLY", value: 42.3, isSelected: selectedCompanySymbol === "LLY" },
      { name: "J&J", symbol: "JNJ", value: 28.9, isSelected: selectedCompanySymbol === "JNJ" },
      { name: "Pfizer", symbol: "PFE", value: 25.4, isSelected: selectedCompanySymbol === "PFE" },
      { name: "AbbVie", symbol: "ABBV", value: 35.7, isSelected: selectedCompanySymbol === "ABBV" },
      { name: "JPM", symbol: "JPM", value: 18.2, isSelected: selectedCompanySymbol === "JPM" },
      { name: "Bank of America", symbol: "BAC", value: 15.8, isSelected: selectedCompanySymbol === "BAC" },
      { name: "Wells Fargo", symbol: "WFC", value: 12.4, isSelected: selectedCompanySymbol === "WFC" },
      { name: "Goldman Sachs", symbol: "GS", value: 22.6, isSelected: selectedCompanySymbol === "GS" },
      { name: "Exxon Mobil", symbol: "XOM", value: 8.9, isSelected: selectedCompanySymbol === "XOM" },
      { name: "Chevron", symbol: "CVX", value: 11.2, isSelected: selectedCompanySymbol === "CVX" },
      { name: "UHC", symbol: "UNH", value: 31.5, isSelected: selectedCompanySymbol === "UNH" },
      { name: "Home Depot", symbol: "HD", value: 14.8, isSelected: selectedCompanySymbol === "HD" },
      { name: "Mastercard", symbol: "MA", value: 58.2, isSelected: selectedCompanySymbol === "MA" },
      { name: "Visa", symbol: "V", value: 62.7, isSelected: selectedCompanySymbol === "V" },
      { name: "Coca-Cola", symbol: "KO", value: 28.4, isSelected: selectedCompanySymbol === "KO" },
      { name: "PepsiCo", symbol: "PEP", value: 26.9, isSelected: selectedCompanySymbol === "PEP" }
    ];

    // Filter to only include checked comparable companies and the selected company
    const checkedSymbols = comparableCompanies.filter(comp => comp.checked).map(comp => comp.symbol);
    const filteredData = mockData.filter(company => 
      company.isSelected || checkedSymbols.includes(company.symbol)
    );

    // Always put selected company first, then sort others based on selected method
    const selectedCompanyData = filteredData.find(company => company.isSelected);
    const otherCompanies = filteredData.filter(company => !company.isSelected);
    
    // Sort other companies based on selected method
    let sortedOtherCompanies;
    if (sortByMarketCap) {
      // Mock market cap data (in billions)
      const marketCapData = {
        "MSFT": 2800, "GOOGL": 1800, "AMZN": 1600, 
        "NVDA": 1200, "META": 800, "TSLA": 600, "ADBE": 200
      };
      sortedOtherCompanies = otherCompanies.sort((a, b) => marketCapData[b.symbol] - marketCapData[a.symbol]);
    } else {
      // Sort by value (multiple) in descending order
      sortedOtherCompanies = otherCompanies.sort((a, b) => b.value - a.value);
    }
    
    // Create final array: [selected company, empty space, other companies]
    return [
      selectedCompanyData,
      { name: "", symbol: "", value: 0, isSelected: false }, // Empty space
      ...sortedOtherCompanies
    ].filter(Boolean);
  };

  const getSalesGrowthData = () => {
    // Get the selected company symbol from the full company name
    const selectedCompanySymbol = selectedCompany ? SP100_COMPANIES.find(c => 
      c.name.replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '') === selectedCompany
    )?.symbol : "AAPL";

    const mockData = [
      { name: "Apple", symbol: "AAPL", value: 8.2, isSelected: selectedCompanySymbol === "AAPL" },
      { name: "Microsoft", symbol: "MSFT", value: 15.7, isSelected: selectedCompanySymbol === "MSFT" },
      { name: "Alphabet", symbol: "GOOGL", value: 12.3, isSelected: selectedCompanySymbol === "GOOGL" },
      { name: "Amazon", symbol: "AMZN", value: 9.8, isSelected: selectedCompanySymbol === "AMZN" },
      { name: "NVIDIA", symbol: "NVDA", value: 45.2, isSelected: selectedCompanySymbol === "NVDA" },
      { name: "Meta", symbol: "META", value: 18.9, isSelected: selectedCompanySymbol === "META" },
      { name: "Tesla", symbol: "TSLA", value: 22.1, isSelected: selectedCompanySymbol === "TSLA" },
      { name: "Adobe", symbol: "ADBE", value: 11.4, isSelected: selectedCompanySymbol === "ADBE" },
      { name: "Eli Lilly", symbol: "LLY", value: 16.8, isSelected: selectedCompanySymbol === "LLY" },
      { name: "J&J", symbol: "JNJ", value: 6.4, isSelected: selectedCompanySymbol === "JNJ" },
      { name: "Pfizer", symbol: "PFE", value: 4.2, isSelected: selectedCompanySymbol === "PFE" },
      { name: "AbbVie", symbol: "ABBV", value: 12.7, isSelected: selectedCompanySymbol === "ABBV" },
      { name: "JPM", symbol: "JPM", value: 7.8, isSelected: selectedCompanySymbol === "JPM" },
      { name: "Bank of America", symbol: "BAC", value: 5.3, isSelected: selectedCompanySymbol === "BAC" },
      { name: "Wells Fargo", symbol: "WFC", value: 3.9, isSelected: selectedCompanySymbol === "WFC" },
      { name: "Goldman Sachs", symbol: "GS", value: 9.1, isSelected: selectedCompanySymbol === "GS" },
      { name: "Exxon Mobil", symbol: "XOM", value: 2.4, isSelected: selectedCompanySymbol === "XOM" },
      { name: "Chevron", symbol: "CVX", value: 3.1, isSelected: selectedCompanySymbol === "CVX" },
      { name: "UHC", symbol: "UNH", value: 12.8, isSelected: selectedCompanySymbol === "UNH" },
      { name: "Home Depot", symbol: "HD", value: 4.2, isSelected: selectedCompanySymbol === "HD" },
      { name: "Mastercard", symbol: "MA", value: 18.7, isSelected: selectedCompanySymbol === "MA" },
      { name: "Visa", symbol: "V", value: 16.3, isSelected: selectedCompanySymbol === "V" },
      { name: "Coca-Cola", symbol: "KO", value: 7.9, isSelected: selectedCompanySymbol === "KO" },
      { name: "PepsiCo", symbol: "PEP", value: 8.5, isSelected: selectedCompanySymbol === "PEP" }
    ];

    // Filter to only include checked comparable companies and the selected company
    const checkedSymbols = comparableCompanies.filter(comp => comp.checked).map(comp => comp.symbol);
    const filteredData = mockData.filter(company => 
      company.isSelected || checkedSymbols.includes(company.symbol)
    );

    // Always put selected company first, then sort others based on selected method
    const selectedCompanyData = filteredData.find(company => company.isSelected);
    const otherCompanies = filteredData.filter(company => !company.isSelected);
    
    // Sort other companies based on selected method
    let sortedOtherCompanies;
    if (sortByMarketCap) {
      // Mock market cap data (in billions)
      const marketCapData = {
        "MSFT": 2800, "GOOGL": 1800, "AMZN": 1600, 
        "NVDA": 1200, "META": 800, "TSLA": 600, "ADBE": 200
      };
      sortedOtherCompanies = otherCompanies.sort((a, b) => marketCapData[b.symbol] - marketCapData[a.symbol]);
    } else {
      // Sort by value (multiple) in descending order
      sortedOtherCompanies = otherCompanies.sort((a, b) => b.value - a.value);
    }
    
    // Create final array: [selected company, empty space, other companies]
    return [
      selectedCompanyData,
      { name: "", symbol: "", value: 0, isSelected: false }, // Empty space
      ...sortedOtherCompanies
    ].filter(Boolean);
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
                                                           <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedCompany("");
                      setSearchQuery("");
                      setFilteredCompanies(SP100_COMPANIES);
                      setIsGenerated(false);
                      setComparableCompanies([]);
                      setShowComparables(false);
                      setBenchmarkData([]);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Reset
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
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                
                                                                                                                                       {/* Company Search and Find Comps Button in same row */}
                   <div className="mb-6">
                     <div className="mb-3">
                       <span className="text-sm font-medium text-gray-700 block mb-2">Select Company:</span>
                       <div className="flex gap-2">
                                                  <div className="w-[70%]">
                           <input
                             type="text"
                             placeholder="Enter Company Name"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           />
                         </div>
                         <button
                           onClick={findComparableCompanies}
                           disabled={!selectedCompany}
                           className={`w-[30%] px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                             selectedCompany
                               ? 'bg-blue-600 text-white hover:bg-blue-700'
                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           }`}
                         >
                           Comp
                         </button>
                       </div>
                     
                     {/* Company Suggestions */}
                     {searchQuery && filteredCompanies.length > 0 && (
                       <div className="mt-1 max-h-24 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                         {filteredCompanies.slice(0, 2).map((company) => (
                           <button
                             key={company.symbol}
                             onClick={() => handleCompanySelect(company.symbol)}
                             className="w-full text-left px-3 py-1 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-xs"
                           >
                             <div className="font-medium text-gray-900">{company.symbol}</div>
                             <div className="text-xs text-gray-600">{company.name}</div>
                           </button>
                         ))}
                       </div>
                     )}
                     </div>
                    

                  </div>

                                                                       {/* Comparable Companies Selection */}
                   {showComparables && comparableCompanies.length > 0 && (
                     <div className="mt-6 pt-6 border-t border-gray-200">
                       <h3 className="text-sm font-medium text-gray-700 mb-4">Comparable Companies</h3>

                                              <div className="grid grid-cols-2 gap-2">
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
                               <div className="text-xs font-medium text-gray-900">{company.name}</div>
                             </label>
                           </div>
                         ))}
                       </div>
                      
                      {/* Add Comparable Company Section */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700 block mb-2">Add Company:</span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter Company Name"
                              value={addCompanyQuery}
                              onChange={(e) => setAddCompanyQuery(e.target.value)}
                              className="w-[70%] px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={() => {
                                if (addCompanyQuery.trim()) {
                                  // Find the company by name or symbol
                                  const company = SP100_COMPANIES.find(c => 
                                    c.name.toLowerCase().includes(addCompanyQuery.toLowerCase()) ||
                                    c.symbol.toLowerCase().includes(addCompanyQuery.toLowerCase())
                                  );
                                  if (company) {
                                    const shortName = company.name
                                      .replace(/\s+(Inc\.|Corporation|Corp\.|Company|Co\.|Limited|Ltd\.|PLC|LLC)$/i, '');
                                    
                                    // Add the company to comparable companies if it's not already there
                                    const isAlreadyAdded = comparableCompanies.some(comp => comp.symbol === company.symbol);
                                    if (!isAlreadyAdded) {
                                      const newCompany = {
                                        id: (comparableCompanies.length + 1).toString(),
                                        name: shortName,
                                        symbol: company.symbol,
                                        checked: true
                                      };
                                      setComparableCompanies([...comparableCompanies, newCompany]);
                                    }
                                  }
                                  setAddCompanyQuery("");
                                }
                              }}
                              className="w-[30%] px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          
                          {/* Company Suggestions for Add */}
                          {addCompanyQuery && filteredAddCompanies.length > 0 && (
                            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                              {filteredAddCompanies.map((company) => (
                                <button
                                  key={company.symbol}
                                  onClick={() => handleAddCompanySelect(company.symbol)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">{company.symbol}</div>
                                  <div className="text-sm text-gray-600">{company.name}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                                                                       {/* Sort Options */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                      <div className="mb-4">
                                        <span className="text-sm font-medium text-gray-700 block mb-3">Sort by:</span>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => setSortByMarketCap(false)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                              !sortByMarketCap
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                          >
                                            Multiple
                                          </button>
                                          <button
                                            onClick={() => setSortByMarketCap(true)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                              sortByMarketCap
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                          >
                                            Market Cap
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Benchmark Button */}
                                    <div className="mt-4">
                                      <button
                                        onClick={generateBenchmark}
                                        disabled={!selectedCompany}
                                        className={`w-full px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                          selectedCompany
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
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
                      <p>Click "Benchmark" to generate benchmarking analysis</p>
                    </div>
                  </div>
                                 ) : (
                                       <div>
                      {/* Charts - Two boxes with 16:9 ratio, each containing 2 charts stacked vertically */}
                      <div className="space-y-6">
                        {/* First Box - EV/LTM EBITDA and EV/LTM Sales */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200" style={{ aspectRatio: '16/9' }}>
                          <div className="flex flex-col h-full space-y-6">
                                                        {/* EV/LTM EBITDA Chart */}
                            <div className="flex-1 mb-12">
                              <h3 className="text-base font-semibold text-gray-900 mb-4">EV / LTM EBITDA</h3>
                              <div className="flex items-end space-x-1 h-full">
                                {selectedCompany ? getEBITDAData().map((company, index) => (
                                  <div key={index} className="flex flex-col items-center flex-1 h-full">
                                    {company.name ? (
                                      <>
                                        <div className="flex-1 flex items-end relative">
                                          <div 
                                            className={`w-8 mx-auto transition-all duration-300 relative ${
                                              company.isSelected 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-400'
                                            }`}
                                            style={{ 
                                              height: `${(company.value / 38.7) * 100}%`,
                                              minHeight: '20px'
                                            }}
                                          >
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                              {company.value.toFixed(1)}x
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                          {company.name}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex-1"></div> // Empty space
                                    )}
                                  </div>
                                )) : null}
                              </div>
                            </div>

                            {/* EV/LTM Sales Chart */}
                            <div className="flex-1 mb-12">
                              <h3 className="text-base font-semibold text-gray-900 mb-4">EV / LTM Sales</h3>
                              <div className="flex items-end space-x-1 h-full">
                                {selectedCompany ? getEVSalesData().map((company, index) => (
                                  <div key={index} className="flex flex-col items-center flex-1 h-full">
                                    {company.name ? (
                                      <>
                                        <div className="flex-1 flex items-end relative">
                                          <div 
                                            className={`w-8 mx-auto transition-all duration-300 relative ${
                                              company.isSelected 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-400'
                                            }`}
                                            style={{ 
                                              height: `${(company.value / 13.8) * 100}%`,
                                              minHeight: '20px'
                                            }}
                                          >
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                              {company.value.toFixed(1)}x
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                          {company.name}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex-1"></div> // Empty space
                                    )}
                                  </div>
                                )) : null}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Second Box - LTM EBITDA Margin and LTM Sales Growth */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200" style={{ aspectRatio: '16/9' }}>
                          <div className="flex flex-col h-full space-y-6">
                            {/* LTM EBITDA Margin Chart */}
                            <div className="flex-1 mb-12">
                              <h3 className="text-base font-semibold text-gray-900 mb-4">LTM EBITDA Margin (%)</h3>
                              <div className="flex items-end space-x-1 h-full">
                                {selectedCompany ? getEBITDAMarginData().map((company, index) => (
                                  <div key={index} className="flex flex-col items-center flex-1 h-full">
                                    {company.name ? (
                                      <>
                                        <div className="flex-1 flex items-end relative">
                                          <div 
                                            className={`w-8 mx-auto transition-all duration-300 relative ${
                                              company.isSelected 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-400'
                                            }`}
                                            style={{ 
                                              height: `${(company.value / 45.3) * 100}%`,
                                              minHeight: '20px'
                                            }}
                                          >
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                              {company.value.toFixed(1)}%
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                          {company.name}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex-1"></div> // Empty space
                                    )}
                                  </div>
                                )) : null}
                              </div>
                            </div>

                            {/* LTM Sales Growth Chart */}
                            <div className="flex-1 mb-8">
                              <h3 className="text-base font-semibold text-gray-900 mb-4">LTM Sales Growth (%)</h3>
                              <div className="flex items-end space-x-1 h-full">
                                {selectedCompany ? getSalesGrowthData().map((company, index) => (
                                  <div key={index} className="flex flex-col items-center flex-1 h-full">
                                    {company.name ? (
                                      <>
                                        <div className="flex-1 flex items-end relative">
                                          <div 
                                            className={`w-8 mx-auto transition-all duration-300 relative ${
                                              company.isSelected 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-400'
                                            }`}
                                            style={{ 
                                              height: `${(company.value / 49.7) * 100}%`,
                                              minHeight: '20px'
                                            }}
                                          >
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                              {company.value.toFixed(1)}%
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-700 mt-2 text-center font-medium">
                                          {company.name}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex-1"></div> // Empty space
                                    )}
                                  </div>
                                )) : null}
                              </div>
                            </div>
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
