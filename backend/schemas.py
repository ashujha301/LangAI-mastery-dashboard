from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: str
    name: str

class UserUpdate(BaseModel):
    role: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    subscription_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Phase Schemas
class PhaseResponse(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    order: int
    min_passing_score: float
    
    class Config:
        from_attributes = True

# Session Schemas
class SessionResponse(BaseModel):
    id: str
    phase_id: str
    title: str
    description: str
    content: str
    order: int
    duration_minutes: Optional[int]
    
    class Config:
        from_attributes = True

# Challenge Schemas
class TestCaseResponse(BaseModel):
    id: str
    input_data: dict
    expected_output: dict
    is_hidden: bool
    
    class Config:
        from_attributes = True

class ChallengeResponse(BaseModel):
    id: str
    session_id: str
    title: str
    description: str
    starter_code: str
    language: str
    difficulty: str
    points: int
    test_cases: List[TestCaseResponse]
    
    class Config:
        from_attributes = True

# Code Submission Schemas
class CodeSubmissionCreate(BaseModel):
    challenge_id: str
    code: str
    language: str

class CodeSubmissionResponse(BaseModel):
    id: str
    user_id: str
    challenge_id: str
    status: str
    passed_tests: int
    total_tests: int
    score: float
    error_message: Optional[str]
    submitted_at: datetime
    
    class Config:
        from_attributes = True

# Progress Schemas
class ProgressResponse(BaseModel):
    id: str
    user_id: str
    session_id: str
    status: str
    score: float
    passed: bool
    started_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
