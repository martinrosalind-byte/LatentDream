"""
Filename: models.py
Author: Rosalind Barrett (Student ID: 25115642)
Institution: National College of Ireland

Description:
    Declarative database schemas mapping Python objects to relational database
    tables via SQLAlchemy. Establishes the structure for persistent dream logs 
    and analysis history.

Academic Note:
    In classical psychoanalysis, analyzing isolated dreams yields limited insight. 
    Longitudinal clinical tracking is critical for identifying repetitive structural 
    compromise-formations. The 'DreamHistory' table provides the data architecture 
    needed to display timelines, allowing users to uncover recurring unconscious patterns (FR-008).
"""

import datetime
from sqlalchemy import Column, Integer, Text, DateTime
from database import Base

class DreamHistory(Base):
    """
    SQLAlchemy ORM model defining the persistent logging structure
    required to populate the client's History Dashboard (FR-008).
    """
    __tablename__ = "dream_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    dream_text = Column(Text, nullable=False) # Stores raw manifest content
    interpretation = Column(Text, nullable=False) # Stores finalized Freudian analysis report
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)