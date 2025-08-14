"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function DataAnalysisPromptPage() {
  // State for editing sections
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({
    'phase-1-flow-spec': `Phase 1 — Flow Spec (Refined)

1) Goal / Output
• Create a structured, professionalized Business Plan dataset by parsing user-provided content and mapping it into the 10 topics → subtopics → key questions framework.
• Output artifacts:
  • plan.json (canonical structured data), including provenance and "user‑provided" tags.
  • Render-ready snippets per topic/subtopic for the UI boxes.
  • Progress metrics (overall % and per-topic %).
• Consumer: the Business Plan UI (topic/subtopic pages + main progress bar).

2) Inputs
• Sources: File upload (PDF/DOCX/TXT/MD — MVP at least PDF/TXT), free text paste, URL (depth=0 single page) with readable extraction.
• Field shape (conceptual): sourceId • type(file|text|url) • mime • filename/url • rawText • language? with origin:"user-provided" on all content.
• PII/PHI: possible → mask emails/phones in logs; never log raw payloads.

3) Transformations
• Ingestion: extract text (PDF/DOCX/HTML→readable), normalize whitespace, standardize quotes, keep paragraph boundaries.
• Segmentation: chunk text into semantically coherent blocks (~500–1200 chars).
• Allocation: map chunks to topics/subtopics/questions via deterministic rules/keywords first, then LLM fallback for ambiguity only.
• Professionalization: grammar/style pass must not introduce new facts; preserve numbers, named entities, dates.
• Summarization: concise rewrite per subtopic using only source text; keep traceability to original chunk IDs.
• Provenance: store sourceId, chunkId, and character offsets for every mapped snippet.
• Idempotency: re‑ingesting the same source reuses its contentHash and updates mappings non‑destructively (version++).

4) Validation
• Syntactic: inputs exist, text length > minimal threshold; URLs fetchable; PDFs decodable.
• Semantic: cross-field checks where relevant; numbers preserved post‑edit.
• Business rules: no new claims not present in source; uncertain mapping → "Unassigned" with reason.
• Failure modes: reject unreadable sources; warn & keep in "Unassigned" if mapping confidence < threshold.

5) Storage (MVP)
• Local JSON store:
  • /data/plan.json (current merged plan)
  • /data/sources/<sourceId>.json (extracted text + chunks + hash)
  • /data/versions/<timestamp>.json (snapshots)
• Keys/uniqueness: sourceId = sha256(filename|url|text), version = ISO timestamp.
• Audit: change log of mappings and edits.

6) APIs / Boundaries (MVP)
• POST /ingest (file/text/url) → sourceId.
• POST /map (sourceId) → updated plan.json.
• GET /plan → current structured plan.
• GET /progress → {overallPct, byTopic}.
• GET /unassigned → list of chunks + reasons.
• Auth: none (local dev). Timeouts/Retries for URL fetch.

7) Privacy & Security
• Don't log raw content. Redact PII in logs (hash emails/phones).
• Keep raw text only in local JSON, not in console logs.
• Secrets (if any): .env (not committed).

8) Observability
• Structured logs: {event, sourceId, counts, durations, errors[], piiRedacted:true}.
• Metrics: tokens processed, chunks mapped, % unassigned, mean mapping confidence.

9) Test Cases
Happy paths:
1. Clean PDF with clearly labeled sections → 90%+ mapped, progress computed.
2. Free text describing Problem, Market, Competition → correctly split & mapped.
3. URL with readable article → allocation across Why Now + Market.

Edge cases:
1. Very long document (>100k chars) → chunking and streaming mapping works.
2. Mixed languages (EN/DE) → detect language per chunk; map English; flag non-EN.
3. Duplicated upload → idempotent (no duplicate records; version++ only if content changed).

Failure cases:
1. Image-only PDF (no text) → 400 with UNREADABLE_PDF.
2. URL behind auth / 403 → 400 with FETCH_FAILED, nothing persisted.`,

    'challenge-improvements': `Challenge Improvements (Guardrails)

• Provenance-first: Every edited snippet carries (sourceId, chunkId, start, end); enable source highlight on click.
• No-new-facts: After professionalization, noNewFactsCheck asserts entities/numbers/dates preserved; if violated, keep original + flag.
• Deterministic mapping: Rules/keywords first; LLM fallback only for leftovers; temperature=0, top-1 with confidence.
• Objective progress: A question is "answered" if snippet length ≥ 120 chars, includes ≥1 noun phrase and, if applicable, ≥1 number/date, and passes noNewFactsCheck.
• Unassigned safety net: Nothing is dropped; low-confidence or conflicting items land in Unassigned with reason.
• URL depth control: Depth=0; apply Readability/boilerplate removal.`,

    'ready-to-paste-build-prompt': `Ready-to-Paste Build Prompt (Cursor/Claude)

Role:
You are a senior TypeScript engineer implementing data ingestion, mapping, professionalization, and persistence for the "Business Plan Builder" MVP.

Deliverables:
• Zod schemas for sources, chunks, mappings, plan structure, and progress.
• Pure, idempotent transforms for extraction, chunking, mapping, and edits.
• Validation with precise error codes.
• Local JSON storage with versioning and provenance.
• REST endpoints for ingest/map/get plan/progress/unassigned.
• Unit tests (Vitest) covering happy, edge, and failure cases.
• README with setup and commands.

Authoritative Spec:
GOAL:
Build a pipeline that takes user-provided content (file upload, typed text, or URL), extracts text, splits it into chunks, allocates content to the 10 Business Plan topics → subtopics → key questions, lightly professionalizes the language without adding facts, and stores the structured result with provenance. Compute and expose progress %.

INPUTS:
- Accept: { type: "file"|"text"|"url", payload }
- On ingest, produce Source record:
  { sourceId, type, mime?, filename?, url?, rawText, language?="en", origin:"user-provided", contentHash }
- PDF/DOCX/HTML → extract readable text (MVP: pdf-parse or pdfjs; docx parser; readability for HTML).
- Normalize whitespace; preserve paragraph boundaries.

TRANSFORMATIONS:
1) chunkText(rawText) -> Chunk[] // ~500–1200 chars, preserve paragraph joins
2) mapChunksToOutline(Chunk[]) -> Allocation[]
   - Deterministic rules first (keyword dictionaries per topic/subtopic/question).
   - LLM fallback only for ambiguous chunks: temperature=0, top-1 label, return confidence.
3) professionalize(snippet) -> editedSnippet
   - Grammar/clarity only, forbid new facts. Must preserve numbers, dates, named entities.
   - Run noNewFactsCheck(original, edited) -> boolean; if false: keep original and set \`editFlag\`.
4) buildPlan(Allocations) -> Plan
   - For each subtopic/question: attach best snippets with provenance and edited text.
   - Anything unmapped -> Unassigned with reason.
5) computeProgress(Plan) -> { overallPct, byTopic: Record<string, number> }
   - A question counts as answered if snippet meets objective criteria:
     length>=N, has ≥1 noun phrase, and (if numeric question) retains numbers.

VALIDATION:
- Input presence; file/URL readability; min text length.
- Cross-check: numbers/dates preserved after editing (noNewFactsCheck).
- If mapping confidence < threshold -> Unassigned with reason.
- Return 400 with specific codes: UNREADABLE_PDF, FETCH_FAILED, EMPTY_TEXT, MAP_CONFIDENCE_LOW.

STORAGE:
- Local JSON files:
  - /data/sources/<sourceId>.json: { meta, rawText, chunks, contentHash }
  - /data/plan.json: canonical merged plan with provenance
  - /data/versions/<iso>.json: snapshots of plan.json
- Idempotency: same contentHash → update mappings without duplicating source; bump updatedAt only.

APIS:
- POST /ingest {type, payload} -> {sourceId}
- POST /map {sourceId} -> {updated: true, stats}
- GET /plan -> Plan
- GET /progress -> {overallPct, byTopic}
- GET /unassigned -> {items: [{chunkId, excerpt, suggestedTopic?, reason}]}
- Auth: none (dev). URL fetch timeout 8s. Depth=0 for URL.

PRIVACY & SECURITY:
- Never log raw content. Redact PII in logs (emails/phones → hashed). Store raw only in JSON files.

OBSERVABILITY:
- Log events: INGEST_START/END, MAP_START/END with counts and durations.
- Metrics: totalChars, chunkCount, mapped%, unassignedCount, avgConfidence.

TEST CASES:
Happy:
1) Clean PDF with sections -> ≥90% mapped, progress computed.
2) Free text covering Problem/Market/Competition -> correctly allocated.
3) URL article -> Why Now + Market mapping.

Edge:
1) 120k-char doc -> chunking + streaming mapping OK.
2) Mixed EN/DE -> map EN, flag non-EN chunks.
3) Duplicate upload -> same sourceId by contentHash; no duplication.

Failure:
1) Image-only PDF -> 400 UNREADABLE_PDF.
2) Auth/403 URL -> 400 FETCH_FAILED.

REQUIREMENTS & STANDARDS:
- TypeScript. Zod for runtime validation + inferred types.
- Transformations are pure and idempotent.
- Do not coerce silently. If auto-fixing punctuation/case, return {fixedValue, fixNote}.
- LLM use only in \`llm/\` module; dependency-injected \`complete()\`; default temperature=0.
- Implement noNewFactsCheck to assert entities/numbers/dates preserved.
- Progress is deterministic (no LLM needed).
- Unit tests (Vitest) for validators, chunking, mapping (rules), noNewFactsCheck, and progress.
- README with run/test instructions.

ACCEPTANCE CRITERIA:
1) Endpoints behave as specified with exact error codes/messages.
2) Re-ingesting same content is a no-op (except updatedAt).
3) Edited snippets never introduce entities/numbers not present in sources (or they are rejected/flagged).
4) Unassigned bucket is non-empty iff confidence<threshold or rules conflict; nothing is dropped.
5) /progress matches the objective scoring rules.

FILES:
- /src/schemas/*.ts
- /src/ingest/*.ts (pdf/html/docx → text)
- /src/chunk/*.ts
- /src/map/*.ts (rules + optional llm fallback)
- /src/edit/*.ts (professionalize + noNewFactsCheck)
- /src/plan/*.ts (assembler + progress)
- /src/api/*.ts
- /src/storage/*.ts
- /src/llm/*.ts (interface + stub)
- /tests/**/*.test.ts
- /README.md

Defaults for ambiguity:
• Chunk target = 800 chars (min 400, max 1400), sentence-boundary preferred.
• Confidence threshold = 0.6; below → Unassigned.
• Answered question min length N = 120 chars (MVP).`
  });

  const [tempContent, setTempContent] = useState<string>('');

  const handleEdit = (sectionId: string) => {
    setEditingSection(sectionId);
    setTempContent(sectionContent[sectionId] || '');
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
    const content = sectionContent[sectionId] || '';

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
        
        {isEditing ? (
          <textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className={`w-full h-96 p-4 border border-${colorScheme}-300 rounded-md text-sm text-${colorScheme}-700 bg-white resize-none font-mono`}
            placeholder="Enter content..."
          />
        ) : (
          <div className={`text-sm text-${colorScheme}-700 space-y-2 ${inter.className} whitespace-pre-wrap`}>
            {content}
          </div>
        )}
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
                  Data Analysis Prompt
                </h1>
                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                  Generate intelligent analysis prompts for your business data
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
                Business Plan Builder – Data Handling Prompt (MVP)
              </h2>
              
              <p className={`text-gray-700 mb-6 ${inter.className}`}>
                Use this document directly with Cursor/Claude. It includes the refined flow spec and a ready-to-paste build prompt.
              </p>

              {/* Content Sections */}
              <div className="space-y-8">
                {renderSection('phase-1-flow-spec', 'Phase 1 — Flow Spec (Refined)', 'blue')}
                {renderSection('challenge-improvements', 'Challenge Improvements (Guardrails)', 'green')}
                {renderSection('ready-to-paste-build-prompt', 'Ready-to-Paste Build Prompt (Cursor/Claude)', 'purple')}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
