from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserProgress
from schemas import ProgressResponse
from auth import get_current_user

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/", response_model=list[ProgressResponse])
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all progress records for current user"""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).all()
    return progress

@router.get("/session/{session_id}", response_model=ProgressResponse)
async def get_session_progress(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress for specific session"""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.session_id == session_id
    ).first()
    return progress or {}
