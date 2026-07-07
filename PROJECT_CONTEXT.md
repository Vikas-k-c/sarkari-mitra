# PROJECT_CONTEXT.md

# Sarkari Mitra

## Project Overview

Sarkari Mitra is an AI-powered government scheme discovery and recommendation platform designed for rural, semi-literate and underserved citizens.

The platform helps users discover government welfare schemes using conversational AI, semantic search, eligibility matching and multilingual interactions.

The long-term vision is to provide a voice-first digital assistant that can simplify government schemes and guide users through the application process.

---

# Current Status

## Day 1 Completed

### Backend Foundation

* Express.js Backend
* TypeScript Configuration
* PostgreSQL Integration
* Prisma ORM
* Environment Configuration
* Authentication Module
* JWT Authorization
* User Registration
* User Login
* Profile Management
* Middleware
* Swagger Documentation

---

## Day 2 Completed

### Scheme Discovery Layer

Implemented:

* Scheme Module
* Scheme Categories
* Eligibility Rules
* Scheme Documents
* Search APIs
* Elasticsearch Integration
* Full-text Search
* Recommendation Engine
* Recommendation Scoring
* Recommendation Explanations
* Government Scheme Ingestion Pipeline
* Scheduler
* Source Adapters
* Duplicate Detection
* Mock Government Source Integrations

---

## Day 3 Completed

### AI Layer

Implemented:

* Gemini Integration
* Qdrant Integration
* Embedding Pipeline
* Retrieval Augmented Generation (RAG)
* Chat Module
* Conversation History
* Prompt Builder
* Context Retrieval
* AI Recommendation Assistant
* Multilingual Response Support

---

# Technology Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Search

* Elasticsearch

## Vector Database

* Qdrant

## AI

* Google Gemini API

## Authentication

* JWT
* BCrypt

## Validation

* Zod

---

# Current Architecture

Authentication Flow

Client
→ Auth Controller
→ Auth Service
→ Prisma
→ PostgreSQL

Scheme Flow

Client
→ Scheme Controller
→ Scheme Service
→ PostgreSQL
→ Elasticsearch

Recommendation Flow

Profile
→ Recommendation Engine
→ Eligibility Rules
→ Ranked Schemes

RAG Flow

User Question
→ Embedding Service
→ Qdrant
→ Retrieved Scheme Context
→ Prompt Builder
→ Gemini
→ AI Response

Government Data Flow

Government Sources
→ Adapters
→ Validation
→ Normalization
→ PostgreSQL
→ Elasticsearch
→ Qdrant

---

# Existing Modules

* Authentication
* Profiles
* Schemes
* Search
* Recommendations
* Ingestion
* Chat
* RAG
* Gemini
* Embeddings

---

# Development Rules

1. Preserve existing functionality.
2. Extend architecture only.
3. Follow Controller → Service → Prisma architecture.
4. Use Prisma ORM.
5. Use TypeScript Strict Mode.
6. Production-quality code.
7. Show only changed files.
8. Avoid regenerating existing modules.
9. Minimize token usage.

---

# Day 4 Goals

Complete the end-user product.

Implement:

* Flutter Frontend
* Voice Interaction
* Speech-to-Text
* Text-to-Speech
* Recommendation UI
* Scheme Details UI
* AI Chat UI
* Language Selection
* Responsive Design
* Demo Readiness

---

# Long-term Goals

* Real Government API Integration
* Voice-first Experience
* OCR Document Understanding
* Application Form Assistance
* Offline Mode
* Analytics Dashboard
* Admin Portal
