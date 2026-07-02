"""
Filename: models.py
Author: Rosalind Barrett
Description: Declarative database model schemas mapping Python class attributes 
             to relational database tables using SQLAlchemy definitions.
"""

import datetime
from sqlalchemy import Column, Integer, Text, DateTime
from database import Base

class DreamHistory(Base):
    """
    SQLAlchemy data entity mapping the data lifecycle structure 
    required to populate the 'History Dashboard' analytical requirements.
    """
    __tablename__ = "dream_history"

    # Strict structural typing columns matching data schema constraints
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    dream_text = Column(Text, nullable=False)
    interpretation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)