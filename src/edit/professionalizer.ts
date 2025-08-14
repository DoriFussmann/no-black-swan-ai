import { Snippet, EditFlag } from '../schemas';
import { extractNumbers, extractDates, extractEntities } from '../utils/helpers';

export interface ProfessionalizationResult {
  editedText: string;
  editFlag: EditFlag;
  changes: string[];
  originalFacts: {
    numbers: (string | number)[];
    dates: string[];
    entities: string[];
  };
  editedFacts: {
    numbers: (string | number)[];
    dates: string[];
    entities: string[];
  };
}

export function professionalizeText(originalText: string): ProfessionalizationResult {
  const originalFacts = {
    numbers: extractNumbers(originalText),
    dates: extractDates(originalText),
    entities: extractEntities(originalText)
  };
  
  let editedText = originalText;
  const changes: string[] = [];
  
  // Grammar and style improvements (preserving facts)
  editedText = improveGrammar(editedText, changes);
  editedText = improveStyle(editedText, changes);
  editedText = standardizeFormatting(editedText, changes);
  
  // Extract facts from edited text
  const editedFacts = {
    numbers: extractNumbers(editedText),
    dates: extractDates(editedText),
    entities: extractEntities(editedText)
  };
  
  // Check if any facts were lost or changed
  const factCheck = checkFactPreservation(originalFacts, editedFacts);
  
  let editFlag: EditFlag = 'original';
  if (factCheck.factsPreserved) {
    editFlag = 'professionalized';
  } else {
    editFlag = 'rejected';
    editedText = originalText; // Revert to original
    changes.push(`Rejected: ${factCheck.reason}`);
  }
  
  return {
    editedText,
    editFlag,
    changes,
    originalFacts,
    editedFacts
  };
}

function improveGrammar(text: string, changes: string[]): string {
  let improved = text;
  
  // Fix common grammar issues
  improved = improved.replace(/\b(i)\b/g, 'I'); // Capitalize "i" when alone
  improved = improved.replace(/\b(its)\b/g, 'its'); // Preserve "its" vs "it's"
  improved = improved.replace(/\b(its')\b/g, 'its'); // Fix "its'" to "its"
  
  // Fix common contractions
  improved = improved.replace(/\b(dont)\b/g, "don't");
  improved = improved.replace(/\b(cant)\b/g, "can't");
  improved = improved.replace(/\b(wont)\b/g, "won't");
  improved = improved.replace(/\b(shouldnt)\b/g, "shouldn't");
  improved = improved.replace(/\b(couldnt)\b/g, "couldn't");
  improved = improved.replace(/\b(wouldnt)\b/g, "wouldn't");
  
  // Fix sentence endings
  improved = improved.replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => {
    return punct + ' ' + letter.toUpperCase();
  });
  
  // Fix spacing around punctuation
  improved = improved.replace(/\s+([,.!?])/g, '$1');
  improved = improved.replace(/([,.!?])([A-Za-z])/g, '$1 $2');
  
  if (improved !== text) {
    changes.push('Grammar improvements applied');
  }
  
  return improved;
}

function improveStyle(text: string, changes: string[]): string {
  let improved = text;
  
  // Remove excessive exclamation marks
  improved = improved.replace(/!{2,}/g, '!');
  
  // Standardize bullet points
  improved = improved.replace(/^[-*•]\s*/gm, '• ');
  
  // Improve paragraph breaks
  improved = improved.replace(/\n{3,}/g, '\n\n');
  
  // Standardize quotes
  improved = improved.replace(/[""]/g, '"');
  improved = improved.replace(/['']/g, "'");
  
  // Fix common business writing issues
  improved = improved.replace(/\b(utilize)\b/g, 'use');
  improved = improved.replace(/\b(leverage)\b/g, 'use');
  improved = improved.replace(/\b(paradigm)\b/g, 'approach');
  improved = improved.replace(/\b(synergy)\b/g, 'collaboration');
  
  if (improved !== text) {
    changes.push('Style improvements applied');
  }
  
  return improved;
}

function standardizeFormatting(text: string, changes: string[]): string {
  let improved = text;
  
  // Standardize currency formatting
  improved = improved.replace(/\$(\d+)/g, '$$$1.00');
  improved = improved.replace(/\$(\d+)\.(\d{1})/g, '$$$1.$20');
  
  // Standardize percentage formatting
  improved = improved.replace(/(\d+)%/g, '$1%');
  
  // Standardize date formatting (basic)
  improved = improved.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, '$1/$2/$3');
  
  // Remove extra spaces
  improved = improved.replace(/\s+/g, ' ');
  
  if (improved !== text) {
    changes.push('Formatting standardization applied');
  }
  
  return improved;
}

function checkFactPreservation(
  original: { numbers: (string | number)[]; dates: string[]; entities: string[] },
  edited: { numbers: (string | number)[]; dates: string[]; entities: string[] }
): { factsPreserved: boolean; reason?: string } {
  
  // Check numbers
  const originalNumbers = new Set(original.numbers.map(n => n.toString()));
  const editedNumbers = new Set(edited.numbers.map(n => n.toString()));
  
  for (const num of originalNumbers) {
    if (!editedNumbers.has(num)) {
      return {
        factsPreserved: false,
        reason: `Number lost: ${num}`
      };
    }
  }
  
  // Check dates
  const originalDates = new Set(original.dates);
  const editedDates = new Set(edited.dates);
  
  for (const date of originalDates) {
    if (!editedDates.has(date)) {
      return {
        factsPreserved: false,
        reason: `Date lost: ${date}`
      };
    }
  }
  
  // Check entities (more lenient as formatting might change)
  const originalEntities = new Set(original.entities.map(e => e.toLowerCase()));
  const editedEntities = new Set(edited.entities.map(e => e.toLowerCase()));
  
  for (const entity of originalEntities) {
    if (!editedEntities.has(entity)) {
      return {
        factsPreserved: false,
        reason: `Entity lost: ${entity}`
      };
    }
  }
  
  return { factsPreserved: true };
}

// Main function to professionalize a snippet
export function professionalizeSnippet(snippet: Snippet): Snippet {
  const result = professionalizeText(snippet.originalText);
  
  return {
    ...snippet,
    editedText: result.editedText,
    editFlag: result.editFlag
  };
}

// Batch professionalization
export function professionalizeSnippets(snippets: Snippet[]): Snippet[] {
  return snippets.map(snippet => professionalizeSnippet(snippet));
}

// Validation function to ensure no new facts are introduced
export function validateNoNewFacts(
  originalText: string,
  editedText: string
): { valid: boolean; issues: string[] } {
  const originalFacts = {
    numbers: extractNumbers(originalText),
    dates: extractDates(originalText),
    entities: extractEntities(originalText)
  };
  
  const editedFacts = {
    numbers: extractNumbers(editedText),
    dates: extractDates(editedText),
    entities: extractEntities(editedText)
  };
  
  const issues: string[] = [];
  
  // Check for new numbers
  const originalNumbers = new Set(originalFacts.numbers.map(n => n.toString()));
  const editedNumbers = new Set(editedFacts.numbers.map(n => n.toString()));
  
  for (const num of editedNumbers) {
    if (!originalNumbers.has(num)) {
      issues.push(`New number introduced: ${num}`);
    }
  }
  
  // Check for new dates
  const originalDates = new Set(originalFacts.dates);
  const editedDates = new Set(editedFacts.dates);
  
  for (const date of editedDates) {
    if (!originalDates.has(date)) {
      issues.push(`New date introduced: ${date}`);
    }
  }
  
  // Check for new entities
  const originalEntities = new Set(originalFacts.entities.map(e => e.toLowerCase()));
  const editedEntities = new Set(editedFacts.entities.map(e => e.toLowerCase()));
  
  for (const entity of editedEntities) {
    if (!originalEntities.has(entity)) {
      issues.push(`New entity introduced: ${entity}`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

