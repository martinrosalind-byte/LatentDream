"""
Filename: main.py
Author: Rosalind Barrett (Student ID: 25115642)
Institution: National College of Ireland
Module: Project (HDAIML_SEP25OL)

Description:
    Core architectural gateway for the LatentDream generative engine.
    Orchestrates stateful LangChain LCEL chains with a PostgreSQL 
    persistence layer via SQLAlchemy to provide historically recorded, 
    verifiable psychoanalytic interpretation endpoints.

Psychoanalytic & Academic Context:
    This module serves as the primary business logic layer designed to digitize
    traditional clinical dream analysis. In strict accordance with classical Freudian 
    methodology (Freud, 1899), the system separates the "manifest content" (the literal,
    conscious narrative of the dream) from its underlying "latent content" (unconscious,
    repressed wishes). 
    
    The API implements algorithmic guardrails to prevent the leakage of non-Freudian 
    paradigms (e.g., Jungian archetypes or generic dream dictionaries)[cite: 2]. By 
    utilizing a low temperature (0.4) on the generative LLM, the system minimizes 
    speculative hallucinations, ensuring that the dream-work mechanisms of condensation, 
    displacement, and wish-fulfillment are systematically mapped back to personal free 
    associations[cite: 1, 2].
"""

import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from typing import List, Dict

# Core GenAI and orchestration chain dependencies
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Core architectural modules for data persistence integration
import models
from database import engine, get_db

# Load context environment configuration variables from the root folder
load_dotenv()
google_key = os.getenv("GOOGLE_API_KEY")

if not google_key:
    raise RuntimeError("System Environment Configuration Error: GOOGLE_API_KEY is missing from the environment settings.")

# Auto-generate database schema tables upon application startup state
# Satisfies FR-007 (Automatic session data persistence)
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI application instance with academic title metadata
app = FastAPI(
    title="LatentDream Core Analysis Engine",
    description="Automated psychoanalytic dream interpretation backend executing classical Freudian methodology.",
    version="1.0.0"
)

# Configure Cross-Origin Resource Sharing (CORS) security protocols (NFR-004 Compatibility)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Gemini framework
# Academic Note: Temperature is locked at 0.4. This constraint dampens speculative
# creativity (hallucination) and enforces strict adherence to the theoretical parameters
# provided in the clinical system prompts.
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    google_api_key=google_key, 
    temperature=0.4  
)

# ==============================================================================
# 1. ORCHESTRATION PIPELINE: QUESTION GENERATOR
# ==============================================================================

# System Context: Implements the clinical "Free Association" diagnostic protocol.
# Rather than executing a static, dictionary-based lookup of symbols, the model
# is forced to locate dynamic emotional tones or prominent manifest symbols and
# ask questions that prompt the user to recall personal memories and "day-residues".
FREUDIAN_QUESTION_CONTEXT = (
    "You are a clinical psychoanalyst strictly following Sigmund Freud's 'The Interpretation of Dreams'. "
    "The user has shared a dream (manifest content) and you are currently in a free-association dialogue. "
    "Based on the conversation so far, identify a single prominent symbol or emotional tone and ask ONE "
    "pointed, brief question to uncover its latent meaning (e.g., childhood memories, repressed desires). "
    "CRITICAL: Do not offer an interpretation yet. Only ask the next question. Maintain a clinical, neutral tone."
)

question_prompt_template = ChatPromptTemplate.from_messages([
    ("system", FREUDIAN_QUESTION_CONTEXT),
    (
        "system", 
        "Contextual Session Data:\n"
        "Original Dream: {dream_text}\n"
        "Conversation History:\n{transcript_text}"
    ),
    ("user", "Formulate the next Freudian free-association question based on my last response.")
])

# LangChain Expression Language (LCEL) chain executing the question loop (FR-004, FR-005)
freudian_question_chain = question_prompt_template | llm | StrOutputParser()

# ==============================================================================
# 2. ORCHESTRATION PIPELINE: FINAL REPORT GENERATOR
# ==============================================================================

# System Context: Enforces strict theoretical guardrails to neutralize non-Freudian concepts.
# The final report must deconstruct the compromise-formation of the dream-work,
# identifying the transformation of repressed wishes into manifest symbols via 
# condensation and displacement, while referencing the structural model (Id, Ego, Superego).
FREUDIAN_SYSTEM_CONTEXT = (
    "You are an expert clinical psychoanalyst operating strictly within the paradigm of classical Sigmund Freud theories "
    "as outlined in 'The Interpretation of Dreams' (1899). Your objective is to process a manifest dream narrative "
    "alongside the user's conversational free-association responses to compile a cohesive analysis report.\n\n"
    "CRITICAL CONSTRAINTS:\n"
    "1. Never use modern psychological frameworks, archetypes, or generic dream dictionaries.\n"
    "2. You must explain the transition from visible story (Manifest Content) to hidden meaning (Latent Content).\n"
    "3. Explicitly identify and isolate clinical mechanisms such as Condensation, Displacement, or Wish-Fulfillment.\n"
    "4. Frame all evaluations using structural terminology, referencing the dynamics of the Id, Ego, Superego, and Repression."
)

report_prompt_template = ChatPromptTemplate.from_messages([
    ("system", FREUDIAN_SYSTEM_CONTEXT),
    (
        "system", 
        "Contextual Session Data:\n"
        "Original Dream: {dream_text}\n"
        "Free Association Transcripts: {transcript_text}"
    ),
    ("user", "Compile the final Freudian Interpretation Report following these exact requirements.")
])

# LCEL chain executing final report generation (FR-006)
freudian_report_chain = report_prompt_template | llm | StrOutputParser()

# ==============================================================================
# DATA TRANSFER OBJECTS (DTOs)
# ==============================================================================

class ChatRequest(BaseModel):
    """Pydantic model enforcing type safety and structural validation at the network boundary."""
    dream_text: str
    transcript: List[Dict[str, str]]

class AnalysisRequest(BaseModel):
    """Pydantic model validating incoming session history prior to report synthesis."""
    dream_text: str
    transcript: List[Dict[str, str]]

# ==============================================================================
# API ENDPOINTS
# ==============================================================================

@app.post("/api/chat")
async def generate_next_question(request: ChatRequest):
    """
    HTTP POST Endpoint: Manages the active free-association transcript sequence.
    Enforces the clinical boundary of exactly three follow-up questions (FR-005).
    """
    user_responses = [msg for msg in request.transcript if msg.get("sender") == "user"]
    turn_count = len(user_responses)
    
    # Structural Guardrail: Cap the loop at exactly 3 questions to prevent open-ended model drift
    if turn_count >= 3:
        return {
            "status": "complete", 
            "message": "Diagnostic threshold reached. System is ready to invoke /api/analyze."
        }
        
    # Serialize transcript matrix for the LLM's context window
    formatted_transcript = ""
    for msg in request.transcript:
        sender = "User" if msg.get("sender") == "user" else "Analyst (AI)"
        formatted_transcript += f"{sender}: {msg.get('text')}\n"
        
    try:
        next_question = freudian_question_chain.invoke({
            "dream_text": request.dream_text,
            "transcript_text": formatted_transcript
        })
        
        return {
            "status": "in_progress", 
            "turn": turn_count + 1, 
            "question": next_question
        }
    except Exception as error_exception:
        raise HTTPException(
            status_code=500, 
            detail=f"Generative Question Framework Error: {str(error_exception)}"
        )


@app.post("/api/analyze")
async def generate_interpretation(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    HTTP POST Endpoint: Processes the compiled dream and free-association dialogue (FR-006),
    saves the transaction history to PostgreSQL (FR-007), and returns the finalized report.
    """
    if not request.dream_text.strip():
        raise HTTPException(status_code=400, detail="Network payload violation: Original manifest text is required.")

    try:
        formatted_transcript = ""
        for msg in request.transcript:
            sender = "User" if msg.get("sender") == "user" else "Analyst (AI)"
            formatted_transcript += f"{sender}: {msg.get('text')}\n"

        # Invoke the report orchestration chain
        interpretation_report = freudian_report_chain.invoke({
            "dream_text": request.dream_text,
            "transcript_text": formatted_transcript
        })

        # Instantiate persistent data record (FR-007)
        db_record = models.DreamHistory(
            dream_text=request.dream_text,
            interpretation=interpretation_report
        )
        
        db.add(db_record)        
        db.commit()              
        db.refresh(db_record)    
        
        return {
            "status": "success",
            "id": db_record.id, 
            "interpretation": interpretation_report
        }
        
    except Exception as error_exception:
        db.rollback()  
        raise HTTPException(
            status_code=500, 
            detail=f"Upstream Generative Framework Error: {str(error_exception)}"
        )


@app.get("/api/history")
async def get_dream_history(db: Session = Depends(get_db)):
    """
    HTTP GET Endpoint: Retrieves the user's historical diary timeline (FR-008).
    Orders entries chronologically, allowing for longitudinal pattern tracking.
    """
    try:
        history_records = db.query(models.DreamHistory).order_by(models.DreamHistory.created_at.desc()).all()
        return history_records
    except Exception as database_error:
        raise HTTPException(
            status_code=500, 
            detail=f"Database Access Subsystem Failure: {str(database_error)}"
        )


@app.get("/api/health")
async def operational_health_check():
    """
    Diagnostic runtime endpoint used to monitor API health and availability (NFR-004).
    """
    return {"status": "healthy", "engine": "LatentDream Python Execution Server"}