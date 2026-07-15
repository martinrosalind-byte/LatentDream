"""
Filename: database.py
Author: Rosalind Barrett (Student ID: 25115642)
Institution: National College of Ireland

Description:
    Database connection infrastructure utilizing SQLAlchemy Object-Relational 
    Mapping (ORM). Establishes connection engines, session factories, and context
    providers to handle PostgreSQL transactions securely (NFR-002).

Academic Note:
    To support portable academic testing, the connection string defaults to a local 
    SQLite file if the PostgreSQL environment variable is absent. This isolates test 
    database execution states while remaining ready for a cloud PostgreSQL launch in production.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Retrieves connection string with portable SQLite fallback configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./latentdream.db")

# Thread safety management configuration for local development / testing
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

# Concrete factory for database session contexts
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative mapping schemas
Base = declarative_base()

def get_db():
    """
    Dependency injector yielding an isolated database session.
    Ensures safe, atomic transactional cleanups and closes connections on teardown.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()