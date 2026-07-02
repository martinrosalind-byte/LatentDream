"""
Filename: main.py
Author: Rosalind Barrett
Institution: National College of Ireland (NCI)
Description: Final production-ready FastAPI gateway for LatentDream. 
             Orchestrates LangChain LCEL pipelines with SQLAlchemy database persistence 
             to provide verifiable and historically recorded psychoanalytic endpoints.
"""

import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Core architectural modules for data persistence integration
import models
from database import engine, get_db

# Initialize application and auto-generate database schema tables upon startup
app = FastAPI(title="LatentDream Core Analysis Engine")
models.Base.metadata.create_all(bind=engine)

# Load context environment configuration variables
load_dotenv()
google_key = os.getenv("GOOGLE_API_KEY")

# Model configuration initialization
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=google_key, temperature=0.7)

# Psychoanalytic core constraints alignment prompt
FREUDIAN_SYSTEM_CONTEXT = (
    "You are an expert psychoanalyst operating strictly within the paradigm of classical Sigmund Freud theories. "
    "Analyze the provided dream text systematically. Explicitly isolate the Manifest Content from the Latent Content. "
    "Utilize precise Freudian nomenclature, including concepts such as the Id, Ego, Superego, and structural Repression."
)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", FREUDIAN_SYSTEM_CONTEXT),
    ("user", "Analyze the following dream sequence: {dream_text}")
])

# LangChain Expression Language (LCEL) execution pipeline execution engine
freudian_analysis_chain = prompt_template | llm | StrOutputParser()

class DreamRequest(BaseModel):
    """Data Transfer Object modeling incoming JSON payloads."""
    dream_text: str


@app.post("/analyze")
async def analyze_dream(request: DreamRequest, db: Session = Depends(get_db)):
    """
    HTTP POST: Processes raw dream strings through the LCEL AI chain,
    saves both inputs and generated inferences to the database layer, and returns the analysis.
    """
    try:
        # 1. Execute the generative AI interpretation engine
        analysis_output = freudian_analysis_chain.invoke({"dream_text": request.dream_text})
        
        # 2. DATA PERSISTENCE INTEGRATION (The Missing Link):
        # Instantiate an entity record structure using the schema model
        db_record = models.DreamHistory(
            dream_text=request.dream_text,
            interpretation=analysis_output
        )
        db.add(db_record)     # Stage record to the database transaction
        db.commit()          # Safely flush and save transaction states permanently
        db.refresh(db_record)   # Refresh instance state to gather generated identifiers
        
        return {"id": db_record.id, "interpretation": analysis_output}
        
    except Exception as e:
        db.rollback() # Reverse uncommitted operations in case of transaction state failure
        raise HTTPException(status_code=500, detail=f"Upstream Generative Processing Error: {str(e)}")


@app.get("/history")
async def get_dream_history(db: Session = Depends(get_db)):
    """
    HTTP GET: Retrieves all historical records sorted chronologically.
    Feeds the data lifecycle pipeline for frontend 'History Dashboard' presentation layout components.
    """
    try:
        # Queries the database for all records stored within the entity structure table
        history = db.query(models.DreamHistory).order_by(models.DreamHistory.created_at.desc()).all()
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Retrieval Operations Failure: {str(e)}")