# AskAlma-IIITD: Stage 2 - Advanced RAG Chatbot

Welcome to Stage 2 of the AskAlma project, an advanced Retrieval-Augmented Generation (RAG) chatbot designed to provide information about the IIIT-Delhi website and its associated resources. This iteration builds upon our initial proposed architecture (detailed in `AskAlma_Report_Stage1.pdf` included in this repository) by implementing a more sophisticated retrieval pipeline and data handling strategy.

**Live Demo:** [Link to your deployed demo if available, e.g., Vercel, Netlify]

## Project Overview

AskAlma aims to address the information access gap on the comprehensive IIIT-Delhi website by providing an intelligent conversational interface. Users, including prospective students, current students, faculty, and staff, can ask questions related to academic programs, admission procedures, faculty, campus life, and more, receiving accurate and contextually relevant answers.

This Stage 2 implementation features:
*   **Hybrid Data Chunking:** Critical information (like detailed course data from JSONs and LLM-generated explanations) is preserved as whole documents, while generic content is intelligently chunked.
*   **LLM-Powered Query Understanding:** User queries in a conversation are rewritten by an LLM to be standalone and contextually grounded, significantly improving retrieval for follow-up questions.
*   **Two-Stage Hybrid Retrieval:**
    1.  **BM25 Keyword Search:** An initial fast retrieval of candidate documents based on keyword matching using the rewritten query.
    2.  **Cross-Encoder Semantic Re-ranking:** The candidates from BM25 are then semantically re-ranked using a powerful Cross-Encoder model to ensure high relevance to the user's intent.
*   **Modular LLM Interaction:** The final answer generation is handled by a separate LLM (accessed via API, e.g., LM Studio), allowing for flexibility in model choice.

## Architecture Evolution: From Stage 1 to Stage 2

The initial proposed architecture (see `AskAlma_Report_Stage1.pdf`) envisioned components like Graph RAG and a small LLM relevance classifier. In this current Stage 2 implementation:

*   **Course Data Handling:** Instead of a full Graph RAG (due to initial data completeness challenges for graph construction), we've adopted a robust method of processing structured course JSONs and supplementary LLM-generated textual explanations. These are treated as critical, whole documents within our hybrid chunking strategy, making them highly discoverable.
*   **Relevance and Context:** The role of a dedicated relevance classifier is effectively fulfilled by our LLM-powered query condensing step, which intelligently incorporates conversational history to guide the retrieval process.
*   **Focus:** This stage focuses on a highly refined "Standard RAG Retriever" component with advanced conversational capabilities.

## Repository Structure

*   `Askalma/`: Contains the complete scraped data corpus used by the RAG pipeline.
    *   `attachments/`: PDFs, DOCX, XLSX files, etc.
    *   `course_json/`: Individual JSON files detailing each course (critical data).
    *   `course_explain/`: LLM-generated textual explanations for each course (critical data).
    *   `html/`: Scraped HTML content.
    *   `tables/`: HTML tables extracted from web pages.
    *   `text_pdfs/`: Text-centric PDFs (e.g., converted from HTML).
    *   `factual_data_spanbert.json`: Extracted factual snippets (chunked generically).
*   `Frontend-askalma/`: Contains the Next.js frontend application for interacting with the chatbot.
*   `Scrapping-pipeline/`: Includes Jupyter notebooks and scripts used for web scraping and initial data processing (e.g., course table extraction).
*   `rag_pipeline.py`: The core Python script containing all the logic for the RAG pipeline, including data loading, chunking, retriever initialization, chain construction, and LLM interaction. Can be run directly for testing the pipeline.
*   `main.py`: The FastAPI backend server that exposes an API endpoint for the frontend to query the RAG pipeline.
*   `README.md`: This file.
*   `INSTALLATION.md`: Detailed setup and installation instructions.
*   `requirements.txt`: Python dependencies for the backend and RAG pipeline.
*   `AskAlma_Report_Stage1.pdf`: The report detailing the initially proposed architecture and findings.

## Key Technologies

*   **Backend:** Python, FastAPI
*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
*   **RAG Pipeline:** LangChain (LCEL for chain orchestration)
*   **Retrieval:**
    *   BM25 (via `rank_bm25` library)
    *   Cross-Encoders (via `sentence-transformers` library, e.g., `cross-encoder/ms-marco-MiniLM-L-6-v2`)
*   **Language Models:**
    *   **LM Studio (Recommended for Local Use):** We utilized LM Studio for serving local LLMs. The primary model used for query condensing and final answer generation during development was a `deepseek-r1-distill` variant based on Qwen-7B, accessible via an OpenAI-compatible API endpoint (e.g., `http://localhost:1234/v1`).
    *   LLM for structuring JSON data and generating initial course explanations (offline process, using models within LM Studio).
*   **Data Processing:** PyPDF2, python-docx, pandas, BeautifulSoup, NLTK (implicitly by BM25).
*   **Windows Specific (for .doc conversion):** `pywin32`

## Getting Started

Please refer to `INSTALLATION.md` for detailed setup instructions.

## Usage

1.  **Setup Backend & RAG Pipeline:** Follow `INSTALLATION.md`.
2.  **Start Backend Server:** Navigate to the root directory and run:
    ```bash
    python -m uvicorn main:app --reload
    ```
3.  **Start Frontend Application:** Navigate to the `Frontend-askalma` directory and run:
    ```bash
    npm install
    npm run dev
    ```
    The application will typically be available at `http://localhost:3000`.
4.  **Testing the RAG Pipeline Directly:**
    You can also test the RAG pipeline logic directly by running:
    ```bash
    python rag_pipeline.py
    ```
    This script includes test queries and will output debug information about the retrieval and generation process.

## Future Work (Brief)

(Refer to the full Stage 1 report for more details)
*   Knowledge Base Expansion
*   Graph RAG for enhanced course relationship querying
*   Dedicated Relevance Classifier LLM
*   Rigorous Evaluation (e.g., using RAGAS)
*   Latency Reduction and Caching
*   User Feedback Integration

## Contribution

This project was developed by Amartya Singh, Abhishek Bansal, and Aditya Bagri as part of their work at IIIT-Delhi.

---
