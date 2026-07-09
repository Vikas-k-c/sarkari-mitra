# PROJECT_CONTEXT.md

# Sarkari Mitra

## Project Overview

Sarkari Mitra is an AI-powered Government Scheme Discovery Platform designed to help rural, semi-literate and underserved citizens discover, understand and apply for relevant government welfare schemes.

The platform combines semantic search, eligibility-based recommendations, Retrieval-Augmented Generation (RAG), multilingual AI conversations and voice support to provide a simple conversational experience.

The project is designed as a production-oriented full-stack application demonstrating scalable backend architecture, AI integration and modern search technologies.

---

# Current Status

## Project Phase

✅ Day 1 Completed

✅ Day 2 Completed

✅ Day 3 Completed

✅ Day 4 Completed

Current Stage:

Placement Ready

---

# Technology Stack

## Frontend

* Flutter
* Provider/Riverpod (existing project state management)
* Material Design 3

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

# Implemented Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Authorization Middleware

---

## User Profile

Stores:

* Name
* Age
* Gender
* Occupation
* Income
* State
* Category
* Preferred Language

Supports:

* Profile Editing
* Personalized Recommendations

---

## Government Scheme Module

Implemented:

* Scheme Management
* Categories
* Eligibility Rules
* Required Documents
* Official Application Links
* Scheme Sources
* State Support
* National & Karnataka Schemes

---

## Search

Implemented:

* Elasticsearch Full-text Search
* Fuzzy Search
* Category Search
* State Search
* Filter Search

---

## Recommendation Engine

Implemented:

* Eligibility Matching
* Recommendation Scoring
* Recommendation Explanation
* Personalized Homepage
* Dynamic Recommendations

---

## Government Scheme Synchronization

Implemented:

* Source Adapters
* Data Validation
* Data Normalization
* Duplicate Detection
* Scheduler
* Synchronization Pipeline
* Elasticsearch Re-indexing
* Qdrant Vector Updates

---

## AI Assistant

Implemented:

* Gemini Integration
* RAG Pipeline
* Prompt Builder
* Context Retrieval
* Personalized AI Responses
* Conversation History
* Markdown Rendering

---

## Multilingual Support

Supported Languages:

* English
* Hindi

Language is selected using the user profile.

---

## Voice Support

Implemented:

* Speech-to-Text
* Text-to-Speech
* Voice Query Support

---

## Homepage

Implemented:

* Personalized Welcome
* Recommended Schemes
* Trending Schemes
* Newly Added Schemes
* Search Bar
* Dynamic Filters
* Quick Categories

---

## Filters

Supported Filters:

* Farmers
* Women
* Students
* Senior Citizens
* Daily Wage Workers
* Healthcare
* Housing
* Scholarships
* Business
* SC/ST

---

## Chat Experience

Implemented:

* Modern Chat UI
* Typing Indicator
* Suggested Questions
* Source Cards
* Apply Buttons
* Recommendation Cards
* Conversation History

---

# Current Architecture

Authentication

Client
→ Auth Controller
→ Auth Service
→ Prisma
→ PostgreSQL

---

Recommendation Flow

Profile
→ Recommendation Engine
→ Scheme Ranking
→ Homepage

---

Search Flow

User Query
→ Elasticsearch
→ PostgreSQL
→ Results

---

AI Flow

User Question
→ Embedding Service
→ Qdrant
→ Relevant Schemes
→ Prompt Builder
→ Gemini
→ AI Response

---

Government Synchronization

Government Sources
→ Source Adapters
→ Validation
→ Normalization
→ PostgreSQL
→ Elasticsearch
→ Qdrant

---

# Existing Modules

Backend

* Authentication
* Profiles
* Schemes
* Search
* Recommendations
* Ingestion
* Chat
* Gemini
* Embeddings
* RAG

Frontend

* Authentication
* Homepage
* Search
* Recommendations
* AI Chat
* Scheme Details
* Profile
* Voice
* Filters

---

# Development Principles

* Controller → Service → Prisma Architecture
* Modular Design
* Repository-friendly Structure
* TypeScript Strict Mode
* Production-ready Code
* Existing modules should never be regenerated
* Extend architecture only

---

# Current Scope

Supported Schemes

* Central Government Schemes
* Karnataka Government Schemes

Supported Languages

* English
* Hindi

AI Features

* RAG
* Personalized Recommendations
* Semantic Search
* AI Chat

---

# Future Direction

The project is feature complete for placement purposes.

Future work should focus only on:

* More Government Sources
* Additional States
* Better Voice Experience
* Deployment
* Monitoring
* Production Scalability
