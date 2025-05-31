# 🛠️ AskAlma: Installation & Setup Guide

Welcome to the AskAlma setup guide! Follow these steps carefully to get your intelligent IIIT-Delhi assistant up and running on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following:

1. **Python 3.9+**  
    [Download Python](https://www.python.org/downloads/)
2. **Node.js & npm (or yarn)**  
    For the Next.js frontend (Node.js v18+ recommended).  
    [Download Node.js](https://nodejs.org/)
3. **LM Studio (for Local LLM)**  
    - [LM Studio](https://lmstudio.ai/) is recommended for running a local Large Language Model.
    - **Install LM Studio** and download a GGUF instruction-following model (e.g., `deepseek-r1-distill` variant based on Qwen-7B).
    - Start the server in LM Studio (usually at `http://localhost:1234`).
4. **Microsoft Word (Windows only)**  
    Needed if you have old `.doc` files in `Askalma/attachments/`.
5. **Git**  
    [Download Git](https://git-scm.com/downloads)

## ⚙️ Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```
_Replace `<your-repository-url>` and `<repository-name>` as needed._

### 2. Setup the Python Backend & RAG Pipeline

From the project root (where `main.py` and `rag_pipeline.py` are):

#### a. Create & Activate a Virtual Environment

```bash
python -m venv venv
```
Activate it:
- **Windows:** `venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

#### b. Install Python Dependencies

```bash
pip install -r requirements.txt
```
_This installs LangChain, FastAPI, PyTorch, Transformers, etc._

**NVIDIA GPU Users:**  
If you need CUDA support for PyTorch, uninstall the CPU version and follow [PyTorch's official instructions](https://pytorch.org/get-started/locally/).

#### c. Create the "temp" Folder

```bash
mkdir temp
```

#### d. Prepare Your Data Corpus

- Place course JSON files in `Askalma/course_json/`
- Place LLM-generated explanations in `Askalma/course_explain/`
- Populate `attachments/`, `html/`, `tables/`, `text_pdfs/` as needed
- Place `factual_data_spanbert.json` in `Askalma/`

### 3. Setup the Next.js Frontend

From the project root:

```bash
cd Frontend-askalma
npm install
# or
yarn install
```

## 🚀 Launching AskAlma

Follow these steps in order:

1. **Start LLM Server (LM Studio):**
    - Load your GGUF model in LM Studio and start the server (`http://localhost:1234`).

2. **Start FastAPI Backend:**
    - From the project root, with your virtual environment active:
      ```bash
      python -m uvicorn main:app --reload
      ```
    - The backend runs at `http://127.0.0.1:8000`.

    _Note: The first run may take several minutes as the RAG pipeline builds its knowledge base._

3. **Start Next.js Frontend:**
    - In a new terminal, from `Frontend-askalma`:
      ```bash
      npm run dev
      # or
      yarn dev
      ```
    - The frontend runs at `http://localhost:3000`.

4. **Interact with AskAlma:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Optional: Test RAG Pipeline Directly

From the project root, with your virtual environment active:

```bash
python rag_pipeline.py
```
_This runs test queries and prints debug info._

## 🛠️ Troubleshooting

- **ImportError in Python:**  
  Ensure your virtual environment is active and dependencies are installed.

- **Missing packages:**  
  Try `pip install rank_bm25 sentence-transformers`.

- **win32com errors (Windows):**  
  Microsoft Word must be installed for `.doc` conversion.

- **LLM Not Connecting:**  
  - Is LM Studio running and the server started?
  - Is it on `http://localhost:1234`? Check `rag_pipeline.py` if needed.

- **Slow Performance / GPU Not Used:**  
  Ensure PyTorch is installed with CUDA support.

- **Data Loading Errors:**  
  - Check `DATA_ROOT` in `rag_pipeline.py`.
  - Ensure all required subdirectories and files exist.
