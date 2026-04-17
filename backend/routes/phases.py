from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Phase, Session as SessionModel, User, UserProgress
from schemas import PhaseResponse, SessionResponse
from auth import get_current_user

router = APIRouter(prefix="/phases", tags=["phases"])

@router.get("/", response_model=list[PhaseResponse])
async def get_phases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all phases with unlock status"""
    phases = db.query(Phase).order_by(Phase.order).all()
    return phases

@router.get("/{phase_id}", response_model=dict)
async def get_phase_detail(
    phase_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get phase details with sessions and unlock status"""
    phase = db.query(Phase).filter(Phase.id == phase_id).first()
    if not phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    
    # Check if phase is unlocked
    is_unlocked = check_phase_unlocked(phase.order, current_user.id, db)
    
    sessions = db.query(SessionModel).filter(
        SessionModel.phase_id == phase_id
    ).order_by(SessionModel.order).all()
    
    return {
        "phase": phase,
        "sessions": sessions,
        "is_unlocked": is_unlocked
    }

def check_phase_unlocked(phase_order: int, user_id: str, db: Session) -> bool:
    """Check if phase is unlocked based on previous phase completion"""
    if phase_order == 1:
        return True
    
    # Get previous phase
    prev_phase = db.query(Phase).filter(Phase.order == phase_order - 1).first()
    if not prev_phase:
        return False
    
    # Check if all sessions in previous phase are completed with passing score
    prev_sessions = db.query(SessionModel).filter(
        SessionModel.phase_id == prev_phase.id
    ).all()
    
    for session in prev_sessions:
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.session_id == session.id
        ).first()
        
        if not progress or not progress.passed:
            return False
    
    return True

@router.get("/{phase_id}/sessions/{session_id}", response_model=dict)
async def get_session_detail(
    phase_id: str,
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get session with challenges - check unlock status first"""
    phase = db.query(Phase).filter(Phase.id == phase_id).first()
    if not phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    
    # Check if phase is unlocked
    if not check_phase_unlocked(phase.order, current_user.id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Previous phase not completed"
        )
    
    # Check session order within phase
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.phase_id == phase_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check if previous sessions in this phase are completed
    prev_sessions = db.query(SessionModel).filter(
        SessionModel.phase_id == phase_id,
        SessionModel.order < session.order
    ).all()
    
    for prev_session in prev_sessions:
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.session_id == prev_session.id
        ).first()
        
        if not progress or not progress.passed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Complete previous sessions first"
            )
    
    return {"session": session}
