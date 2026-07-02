"""
Filename: database.py
Author: Rosalind Barrett
Description: Database connection infrastructure utilizing SQLAlchemy Object-Relational 
             Mapping (ORM). Establishes connection engines and transactional session factories.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# ACADEMIC ENVIRONMENT INTEGRATION:
# Retrieves the connection string from environment variables. 
# Defaults to a local SQLite configuration for localized academic evaluation portability.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./latentdream.db")

# Creation of the core database engine interface connection
# 'connect_args' configuration is specific to SQLite thread boundary management
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

# SessionLocal class serves as the concrete factory for transactional database connections
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class binds database schemas directly to Python object states
Base = declarative_base()

def get_db():
    """
    Dependency provider yielding an isolated database session context.
    Ensures safe transactional lifecycle teardown upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        