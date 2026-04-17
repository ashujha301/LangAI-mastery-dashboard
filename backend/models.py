from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    PRO_PLUS = "pro_plus"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)  # Clerk user ID
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.FREE)
    subscription_status = Column(String, default="inactive")
    subscription_end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("CodeSubmission", back_populates="user", cascade="all, delete-orphan")

class Phase(Base):
    __tablename__ = "phases"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    icon = Column(String)  # Emoji or icon reference
    order = Column(Integer, unique=True, index=True)
    min_passing_score = Column(Float, default=70.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    sessions = relationship("Session", back_populates="phase", cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(String, primary_key=True, index=True)
    phase_id = Column(String, ForeignKey("phases.id"), index=True)
    title = Column(String, index=True)
    description = Column(Text)
    content = Column(Text)  # Markdown content from repo
    order = Column(Integer)  # Order within phase
    duration_minutes = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    phase = relationship("Phase", back_populates="sessions")
    challenges = relationship("CodingChallenge", back_populates="session", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="session", cascade="all, delete-orphan")

class CodingChallenge(Base):
    __tablename__ = "coding_challenges"
    
    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"), index=True)
    title = Column(String)
    description = Column(Text)
    starter_code = Column(Text)
    solution_code = Column(Text)  # For validation
    language = Column(String, default="python")
    difficulty = Column(String, default="medium")
    points = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    session = relationship("Session", back_populates="challenges")
    test_cases = relationship("TestCase", back_populates="challenge", cascade="all, delete-orphan")
    submissions = relationship("CodeSubmission", back_populates="challenge", cascade="all, delete-orphan")

class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(String, primary_key=True, index=True)
    challenge_id = Column(String, ForeignKey("coding_challenges.id"), index=True)
    input_data = Column(JSON)
    expected_output = Column(JSON)
    is_hidden = Column(Boolean, default=False)  # Hidden test cases
    order = Column(Integer)
    
    # Relationships
    challenge = relationship("CodingChallenge", back_populates="test_cases")

class CodeSubmission(Base):
    __tablename__ = "code_submissions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    challenge_id = Column(String, ForeignKey("coding_challenges.id"), index=True)
    code = Column(Text)
    language = Column(String)
    status = Column(String, default="pending")  # pending, passed, failed
    passed_tests = Column(Integer, default=0)
    total_tests = Column(Integer, default=0)
    score = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="submissions")
    challenge = relationship("CodingChallenge", back_populates="submissions")

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    session_id = Column(String, ForeignKey("sessions.id"), index=True)
    status = Column(String, default="in_progress")  # not_started, in_progress, completed
    score = Column(Float, default=0.0)
    passed = Column(Boolean, default=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    session = relationship("Session", back_populates="progress")
