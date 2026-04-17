from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import (
    CodingChallenge, CodeSubmission, TestCase, User, 
    UserProgress, SessionModel
)
from schemas import ChallengeResponse, CodeSubmissionCreate, CodeSubmissionResponse
from auth import get_current_user
from utils.code_executor import execute_code
import uuid

router = APIRouter(prefix="/challenges", tags=["challenges"])

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(
    challenge_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get challenge with visible test cases"""
    challenge = db.query(CodingChallenge).filter(
        CodingChallenge.id == challenge_id
    ).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Get only visible test cases
    test_cases = db.query(TestCase).filter(
        TestCase.challenge_id == challenge_id,
        TestCase.is_hidden == False
    ).all()
    
    return {
        **challenge.__dict__,
        "test_cases": test_cases
    }

@router.post("/submit", response_model=CodeSubmissionResponse)
async def submit_code(
    submission: CodeSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit code for execution and testing"""
    challenge = db.query(CodingChallenge).filter(
        CodingChallenge.id == submission.challenge_id
    ).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Get all test cases (including hidden)
    test_cases = db.query(TestCase).filter(
        TestCase.challenge_id == submission.challenge_id
    ).all()
    
    # Execute code
    passed_count = 0
    error_message = None
    
    try:
        results = execute_code(
            submission.code,
            test_cases,
            submission.language
        )
        passed_count = sum(1 for r in results if r["passed"])
        if any(not r["passed"] for r in results):
            error_message = next(
                r.get("error") for r in results if not r["passed"]
            )
    except Exception as e:
        error_message = str(e)
    
    # Calculate score
    total_tests = len(test_cases)
    score = (passed_count / total_tests * 100) if total_tests > 0 else 0
    status_val = "passed" if passed_count == total_tests else "failed"
    
    # Save submission
    db_submission = CodeSubmission(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        challenge_id=submission.challenge_id,
        code=submission.code,
        language=submission.language,
        status=status_val,
        passed_tests=passed_count,
        total_tests=total_tests,
        score=score,
        error_message=error_message
    )
    db.add(db_submission)
    
    # Update user progress if all tests passed
    if status_val == "passed":
        session = db.query(SessionModel).filter(
            SessionModel.id == challenge.session_id
        ).first()
        
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.session_id == challenge.session_id
        ).first()
        
        if progress and score >= session.phase.min_passing_score:
            progress.passed = True
            progress.status = "completed"
    
    db.commit()
    db.refresh(db_submission)
    
    return db_submission
