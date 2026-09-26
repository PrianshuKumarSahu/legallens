# LegalLens — AI-Powered Legal Document Assistant & Analyzer

<div align="center">

![LegalLens Banner](https://img.shields.io/badge/LegalLens-AI%20Legal%20Assistant-4F46E5?style=for-the-badge&logo=google&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-16%20%7C%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20AI-Gemini%202.0%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![pgvector](https://img.shields.io/badge/pgvector-Semantic%20Search-336791?style=flat-square&logo=postgresql)](https://github.com/pgvector/pgvector)
[![Vitest](https://img.shields.io/badge/Tests-26%20Passing-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://legallens-two.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Making complex legal information and agreements accessible, transparent, and actionable for everyone.**

🚀 **Live Web App**: [https://legallens-two.vercel.app/](https://legallens-two.vercel.app/)

[Overview](#-about) · [1-Click Judge Access](#-for-hackathon-judges--evaluators) · [Features](#-key-features) · [Google AI Services](#-google-services-integration) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Docs](#-api-endpoints)

</div>

---

> ⚡ **For Hackathon Judges & Evaluators**:
> A **1-Click Instant Demo Access** button is built into the application navigation bar and login screens. Clicking it automatically provisions and logs into a verified demo session pre-loaded with realistic contracts and analyses (Mutual NDAs, Cloud SaaS Agreements)—**no registration or email verification required!**

---

## 🎯 About LegalLens

Legal information is notoriously dense, laden with archaic jargon, and difficult to navigate without professional counsel. Everyday consumers, freelancers, and small business owners frequently sign contracts, leases, and terms of service without understanding the obligations, liabilities, and risks buried in the fine print.

**LegalLens** is a full-stack GenAI-powered legal document intelligence platform built with **Google Gemini 2.0 Flash**, **Next.js**, and **Supabase (PostgreSQL + pgvector)**. It bridges the legal literacy gap by transforming opaque legal text into plain English, spotlighting hidden risks, facilitating side-by-side contract comparisons, and preparing users for attorney consultations.

> ⚠️ **Legal Disclaimer**: LegalLens provides automated AI-generated information and assistive analysis for educational purposes only. It does not provide legal advice and does not create an attorney-client relationship.

---

## ✨ Key Features

### 1. 📄 Multi-Format Document Ingestion
- Upload **PDF**, **DOCX**, or **TXT** files up to 20MB with drag-and-drop.
- Instant text paste mode with automated document type categorization (NDAs, Contracts, Leases, Policies, TOS).
- Server-side parsing with layout preservation and SHA-256 content hashing to prevent duplicate processing.

### 2. 🧠 Plain-English Simplification (Streaming)
- Translates Latin legal terms, complex covenants, and boilerplate clauses into clear, plain English.
- Real-time streaming response powered by Vercel AI SDK and Gemini 2.0 Flash.
- Side-by-side toggle view between the original source paragraph and the simplified explanation.

### 3. 🛡️ Automated Risk Scoring & Clause Detection
- Computes an objective **1–10 Risk Score** with color-coded severity indicators (🟢 Low, 🟡 Medium, 🔴 High).
- Automatic identification of high-risk provisions: unilateral indemnities, non-competes, hidden auto-renewals, and liability caps.
- Actionable recommendations for every flagged risk.
- Clear **Obligations Checklist** detailing parties, deadlines, and priorities.

### 4. 💬 Context-Aware Document Q&A Chat (Streaming)
- Interactive conversational AI assistant grounded strictly in the document text.
- Full context retention across multi-turn queries.
- Instant questions: *"What are the termination penalties?"*, *"Who owns the intellectual property?"*, *"What happens in case of breach?"*

### 5. ⚖️ Side-by-Side Contract Comparison
- Select any two uploaded agreements (e.g., standard vs. counter-party redline).
- Automated comparison matrix categorizing differences by severity: **Critical**, **Important**, or **Minor**.
- Identifies missing clauses (*"Only in Document A"* vs *"Only in Document B"*).
- Objective favorability rating indicating which party benefits from each difference.

### 6. 💼 Attorney Consultation Preparation Guide
- Extracts complex clauses requiring licensed legal review.
- Auto-generates high-leverage questions to ask your attorney during a consultation.
- Generates a checklist of required supporting documentation to gather, saving billable hours.

### 7. 📋 Executive Summaries & Milestone Timelines
- Executive briefing highlighting parties, effective dates, and expiration dates.
- Interactive timeline mapping key deadlines and notice periods.
- Priority action items checklist.

---

## 🔷 Google Services Integration

LegalLens deeply integrates official Google services to power its intelligence, performance, and accessibility:

| Google Service | Implementation | Purpose |
| :--- | :--- | :--- |
| **Google Gemini 2.0 Flash** | `@ai-sdk/google` & `@google/generative-ai` | Powers all real-time document reasoning, risk analysis, summarization, and streaming Q&A. Fast latency and high token throughput. |
| **Google Gemini Embeddings** | `text-embedding-004` (768-dim) | Generates vector embeddings for chunked legal text, stored in Supabase `pgvector` for semantic similarity retrieval. |
| **Google Fonts** | `Inter` via Google CDN | High-legibility typography optimized for document readability and accessibility compliance. |
| **Google Cloud Native API** | REST AI Studio Endpoints | Enterprise data isolation ensures user documents are never used for public foundational model training. |

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────┐
│                       Client Browser                      │
│            (Next.js App Router + Tailwind CSS)            │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTPS / JSON / Text Streams
┌─────────────────────────────▼─────────────────────────────┐
│                    Next.js API Routes                     │
│               (Serverless Handlers on Node.js)            │
│  - /api/documents (CRUD)        - /api/ai/simplify (Stream)│
│  - /api/documents/upload        - /api/ai/analyze (Risk)   │
│  - /api/auth/demo (1-Click)     - /api/ai/chat (Stream)    │
│  - /api/ai/compare (Diff)       - /api/ai/prepare (Lawyer) │
└──────────────┬───────────────────────────────┬────────────┘
               │                               │
┌──────────────▼──────────────┐  ┌─────────────▼────────────┐
│      Google Gemini API      │  │      Supabase Cloud      │
│  - Gemini 2.0 Flash (Chat)  │  │  - PostgreSQL + pgvector │
│  - text-embedding-004       │  │  - Row-Level Security    │
│  - Structured JSON Output   │  │  - Document Storage      │
│  - Real-time Stream Engine  │  │  - Supabase Auth Engine  │
└─────────────────────────────┘  └──────────────────────────┘
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: Next.js 16 (React 19, App Router, Server Components)
- **Styling**: Tailwind CSS 4, Lucide React Icons, Class Variance Authority
- **AI Engine**: Google Gemini 2.0 Flash (`@ai-sdk/google`, `ai` SDK v4, `@google/generative-ai`)
- **Database & Auth**: Supabase PostgreSQL with `pgvector` extension and Row-Level Security (RLS)
- **Document Parsers**: `pdf-parse` (PDF extraction), `mammoth` (DOCX extraction)
- **Testing**: Vitest 2.1, React Testing Library, JSDOM
- **TypeScript**: Strict type validation across all 50+ application modules

---

## 💾 Database Schema

The database runs on PostgreSQL with the `vector` extension enabled. All tables enforce strict **Row-Level Security (RLS)**:

- `profiles`: User metadata linked to Supabase Auth UUIDs.
- `documents`: Stores file references, metadata, type tags, and raw extracted text.
- `document_chunks`: Stores chunked text with `vector(768)` embeddings for semantic RAG search.
- `analyses`: Caches generated risk scores, summaries, and lawyer notes by SHA-256 content hashes.
- `chat_messages`: Multi-turn conversational memory for the document Q&A assistant.
- `comparisons`: Dual-document diffs, similarity scores, and favorability rankings.

Full SQL migration script is located at [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (tested on Node v20/v22)
- **npm** or **yarn**
- Free [Google AI Studio Gemini API Key](https://aistudio.google.com/apikey)
- Free [Supabase Account & Project](https://supabase.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/PrianshuKumarSahu/legallens.git
cd legallens
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Populate `.env.local` with your credentials:
```env
# Google Gemini API
GEMINI_API_KEY=your_google_gemini_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Apply Database Migration
1. Navigate to your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new).
2. Copy and paste the entire contents of [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql).
3. Click **Run** to provision all tables, vector extensions, triggers, and RLS policies.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

LegalLens has an automated unit test suite and strict type verification:

```bash
# Run unit tests with Vitest (26 passing tests)
npm run test

# Run tests in watch mode
npm run test:watch

# TypeScript strict type check (0 errors)
npm run type-check

# Next.js production build verification
npm run build
```

---

## 📚 API Endpoints

### Authentication & Demo
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/demo` | 1-Click judge access: provisions demo credentials and pre-seeds sample contracts |
| `GET` | `/api/auth/callback` | Supabase OAuth & magic link callback handler |

### Document Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/documents` | Retrieve all documents for the authenticated user |
| `POST` | `/api/documents/upload` | Upload & parse PDF, DOCX, or TXT file with metadata |
| `GET` | `/api/documents/[id]` | Fetch single document and analysis cache |
| `DELETE` | `/api/documents/[id]` | Remove document, storage files, and vector chunks |

### AI Analysis (Google Gemini 2.0 Flash)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/simplify` | Real-time streaming plain-English document simplification |
| `POST` | `/api/ai/analyze` | 1–10 Risk scoring, flagged clauses, and obligations checklist |
| `POST` | `/api/ai/summary` | Executive summary, key provisions, and dates extraction |
| `POST` | `/api/ai/chat` | Streaming document Q&A assistant with chat memory |
| `POST` | `/api/ai/compare` | Dual-contract comparison matrix & favorability analysis |
| `POST` | `/api/ai/prepare` | Generates attorney consultation questions and document checklist |
| `POST` | `/api/ai/translate` | Multilingual document translation via Gemini |

---

## 🔒 Security & Privacy

- **Row-Level Security (RLS)**: Users can only query and mutate their own data via verified JWT tokens.
- **Client-Side Secrets Protection**: API keys and service roles reside strictly on the server; client components communicate through authenticated API routes.
- **Zero AI Training**: All document interactions run via Google enterprise endpoints with no model retention.
- **Complete Erasure**: Deleting a document removes database rows, storage files, and vector embeddings immediately.

---

## ♿ Accessibility (WCAG 2.1 AA)

- Semantic HTML5 structure (`<main>`, `<nav>`, `<section>`, `<header>`, `<footer>`).
- Standardized color contrast ratios across all risk badges (Low 🟢, Medium 🟡, High 🔴).
- Keyboard accessible with explicit focus-visible rings on interactive buttons and tab triggers.
- Screen-reader compatible with descriptive ARIA attributes and skip-to-content links.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the Hackathon with Google Gemini AI & Supabase**

</div>
