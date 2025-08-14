import { createHash } from 'crypto';
import { CONFIG } from './constants';

// Text processing utilities
export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[""]/g, '"') // Standardize quotes
    .replace(/['']/g, "'") // Standardize apostrophes
    .trim();
}

export function extractSentences(text: string): string[] {
  // Split on sentence boundaries while preserving abbreviations
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

export function hasFinancialData(text: string): boolean {
  const moneyPatterns = /\$[\d,]+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:million|billion|k|m|b)|[\d,]+(?:\.\d{2})?\s*(?:dollars?|usd)/gi;
  const percentagePatterns = /\d+(?:\.\d+)?%/g;
  const datePatterns = /(?:20\d{2}|19\d{2})|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi;
  
  return moneyPatterns.test(text) || percentagePatterns.test(text) || datePatterns.test(text);
}

export function extractNumbers(text: string): (string | number)[] {
  const numbers: (string | number)[] = [];
  
  // Money amounts
  const moneyMatches = text.match(/\$[\d,]+(?:\.\d{2})?/g) || [];
  numbers.push(...moneyMatches);
  
  // Percentages
  const percentMatches = text.match(/\d+(?:\.\d+)?%/g) || [];
  numbers.push(...percentMatches);
  
  // Plain numbers (avoid extracting years as standalone numbers)
  const numberMatches = text.match(/\b\d+(?:,\d{3})*(?:\.\d+)?\b/g) || [];
  numbers.push(...numberMatches.filter(n => {
    const num = parseInt(n.replace(/,/g, ''));
    return num >= 0 && num <= 999999; // Avoid extracting years
  }));
  
  return numbers;
}

export function extractDates(text: string): string[] {
  const datePatterns = [
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi,
    /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
    /\b\d{4}-\d{2}-\d{2}\b/g,
    /\b(?:20\d{2}|19\d{2})\b/g // Years
  ];
  
  const dates: string[] = [];
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    dates.push(...matches);
  });
  
  return dates;
}

export function extractEntities(text: string): string[] {
  // Simple entity extraction - company names, product names, etc.
  const entities: string[] = [];
  
  // Company patterns (Inc, LLC, Corp, etc.)
  const companyMatches = text.match(/\b[A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Corporation|Company|Co|Ltd)\b/g) || [];
  entities.push(...companyMatches);
  
  // Product names (quoted or capitalized)
  const productMatches = text.match(/"([^"]+)"/g) || [];
  entities.push(...productMatches);
  
  // Technology terms
  const techMatches = text.match(/\b[A-Z][a-zA-Z]+(?:\.js|\.ts|\.py|\.com|\.ai|\.io)\b/g) || [];
  entities.push(...techMatches);
  
  return entities;
}

// Hashing utilities
export function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

export function generateSourceId(type: string, identifier: string): string {
  const combined = `${type}:${identifier}`;
  return createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

export function generateChunkId(sourceId: string, index: number): string {
  return `${sourceId}_chunk_${index}`;
}

// Validation utilities
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isTextLongEnough(text: string): boolean {
  return text.length >= CONFIG.MIN_ANSWERED_LENGTH;
}

export function hasNounPhrases(text: string): boolean {
  // Simple heuristic: check for capitalized words that aren't at the start of sentences
  const words = text.split(/\s+/);
  let nounCount = 0;
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if (/^[A-Z][a-z]+$/.test(word) && word.length > 2) {
      nounCount++;
    }
  }
  
  return nounCount >= 1;
}

// Confidence calculation
export function calculateConfidence(
  keywordMatches: number,
  totalKeywords: number,
  hasFinancialData: boolean,
  hasEntities: boolean
): number {
  let confidence = 0;
  
  // Keyword matching (40% weight)
  confidence += (keywordMatches / totalKeywords) * 0.4;
  
  // Financial data presence (30% weight)
  confidence += hasFinancialData ? 0.3 : 0;
  
  // Entity presence (30% weight)
  confidence += hasEntities ? 0.3 : 0;
  
  return Math.min(confidence, 1.0);
}

// Text chunking utilities
export function chunkText(text: string): { text: string; startOffset: number; endOffset: number }[] {
  const chunks: { text: string; startOffset: number; endOffset: number }[] = [];
  const sentences = extractSentences(text);
  
  // If text is too short for normal chunking, create a single chunk
  if (text.length < CONFIG.CHUNK_SIZE.MIN) {
    return [{
      text: text,
      startOffset: 0,
      endOffset: text.length
    }];
  }
  
  let currentChunk = '';
  let startOffset = 0;
  
  for (const sentence of sentences) {
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
    
    if (potentialChunk.length > CONFIG.CHUNK_SIZE.MAX) {
      // Current chunk is too long, save it and start new one
      if (currentChunk.length >= CONFIG.CHUNK_SIZE.MIN) {
        chunks.push({
          text: currentChunk,
          startOffset,
          endOffset: startOffset + currentChunk.length
        });
      }
      
      // Start new chunk with current sentence
      currentChunk = sentence;
      startOffset = text.indexOf(sentence, startOffset);
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  // Add the last chunk if it meets minimum size
  if (currentChunk.length >= CONFIG.CHUNK_SIZE.MIN) {
    chunks.push({
      text: currentChunk,
      startOffset,
      endOffset: startOffset + currentChunk.length
    });
  }
  
  return chunks;
}

// PII redaction utilities
export function redactPII(text: string): string {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
}

export function hashPII(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8);
}

// Logging utilities
export function createLogEvent(
  event: string,
  sourceId: string,
  counts: Record<string, number>,
  durations: Record<string, number>,
  errors: string[] = [],
  piiRedacted: boolean = true
) {
  return {
    event,
    sourceId,
    counts,
    durations,
    errors,
    piiRedacted,
    timestamp: new Date().toISOString()
  };
}
