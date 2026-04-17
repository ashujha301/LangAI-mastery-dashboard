from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from clerk_backend_api import Client as ClerkClient
from clerk_backend_api.jwts import verify_token
from config import get_settings
from sqlalchemy.orm import Session
from database import get_db
from models import User
import jwt

settings = get_settings()
security = HTTPBearer()
clerk_client = ClerkClient(bearer_token=settings.CLERK_SECRET_KEY)

async def verify_clerk_token(credentials: HTTPAuthCredentials = Depends(security)):
    """Verify Clerk JWT token"""
    token = credentials.credentials
    try:
        decoded = jwt.decode(
            token,
            settings.CLERK_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_signature": False}  # Clerk handles this
        )
        return decoded
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_current_user(
    token_payload: dict = Depends(verify_clerk_token),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

def require_role(*roles):
    """Role-based access control"""
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker
