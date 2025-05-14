import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import time
import os
import re

from rag_pipeline import (
    initialize_knowledge_base,
    get_rag_chain,
    DATA_ROOT,
    # EMBEDDING_MODEL_NAME, # Not directly needed by main.py for this setup
    # DEVICE, # DEVICE is used within rag_pipeline.py if needed, not passed to init_kb
    CORPUS_CHUNK_SIZE, CORPUS_CHUNK_OVERLAP,
    BM25_K_CANDIDATES, CROSS_ENCODER_MODEL_NAME, RERANK_TOP_N,
    HISTORY_TURNS_FOR_RETRIEVAL,
    PERSONA_FILE_PATH
)

app = FastAPI()
origins = ["http://localhost", "http://localhost:8000", "http://localhost:3000", "http://localhost:5000"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class QueryRequest(BaseModel): query: str; session_code: Optional[str] = None
class ResponseModel(BaseModel): response: str; session_code: str

rag_components: Dict[str, Any] = {}
chat_sessions: Dict[str, Dict[str, Any]] = {}
SESSION_TIMEOUT = 24 * 3600

@app.on_event("startup")
async def startup_event():
    print("Application startup: Initializing RAG knowledge base (BM25 -> Reranker)...")
    try:
        bm25_retriever, reranker, _, _, _, rag_prompt_template = initialize_knowledge_base(
            DATA_ROOT,
            # DEVICE, # <<< REMOVED THIS ARGUMENT
            CORPUS_CHUNK_SIZE, CORPUS_CHUNK_OVERLAP,
            BM25_K_CANDIDATES, CROSS_ENCODER_MODEL_NAME, RERANK_TOP_N,
            PERSONA_FILE_PATH
        )
        if bm25_retriever is None or reranker is None or rag_prompt_template is None:
            raise RuntimeError("Failed to initialize RAG components.")
        
        rag_components["bm25_retriever"] = bm25_retriever
        rag_components["reranker"] = reranker
        rag_components["rag_prompt_template"] = rag_prompt_template
        rag_components["chain"] = get_rag_chain(
            bm25_retriever, reranker, rag_prompt_template, HISTORY_TURNS_FOR_RETRIEVAL
        )
        print("RAG knowledge base (BM25 -> Reranker) initialized successfully.")
    except Exception as e:
        print(f"FATAL: RAG initialization error: {e}"); import traceback; traceback.print_exc()
        rag_components["chain"] = None

def generate_session_code(): return str(uuid.uuid4())
def get_session_chat_history(session_code: str) -> List[Dict[str, str]]:
    session = chat_sessions.get(session_code)
    if session:
        if time.time() - session["last_accessed"] > SESSION_TIMEOUT:
            del chat_sessions[session_code]; return []
        session["last_accessed"] = time.time(); return session["history"]
    return []
def update_session_chat_history(session_code: str, query: str, response_text: str):
    if session_code not in chat_sessions:
        chat_sessions[session_code] = {"history": [], "last_accessed": time.time()}
    chat_sessions[session_code]["history"].append({"query": str(query), "response": str(response_text)})
    chat_sessions[session_code]["last_accessed"] = time.time()

@app.post("/query", response_model=ResponseModel)
async def query_endpoint(request: QueryRequest):
    user_query = request.query; session_code = request.session_code
    if not rag_components.get("chain"):
        raise HTTPException(status_code=503, detail="RAG service unavailable.")
    if not session_code: session_code = generate_session_code(); print(f"New session: {session_code}")
    else: print(f"Session: {session_code}")
    try:
        session_history = get_session_chat_history(session_code)
        chain_input = {"question": user_query, "chat_history": session_history}
        rag_chain = rag_components["chain"]
        llm_response_text = rag_chain.invoke(chain_input)
        update_session_chat_history(session_code, user_query, llm_response_text) # Store raw for LLM history
        return ResponseModel(response=llm_response_text, session_code=session_code)
    except Exception as e:
        print(f"Error processing query for session {session_code}: {e}"); import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok" if rag_components.get("chain") else "degraded", "rag_initialized": bool(rag_components.get("chain"))}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)