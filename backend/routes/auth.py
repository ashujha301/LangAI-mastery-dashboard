from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse
from auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/sync-user")
async def sync_user(
    token_payload: dict,
    db: Session = Depends(get_db)
):
    """Sync user from Clerk to database"""
    user_id = token_payload.get("sub")
    email = token_payload.get("email")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {"user": user}

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """Get current user info"""
    return current_user
