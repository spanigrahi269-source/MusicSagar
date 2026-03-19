from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, UserResponse
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_DAYS

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    # Find user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email
        }
    }

@router.post("/logout")
def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Logout successful"}

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current logged in user info"""
    return current_user

@router.post("/theme")
def update_theme(
    theme: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user theme preference"""
    if theme not in ["dark", "light"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Theme must be 'dark' or 'light'"
        )
    
    current_user.theme = theme
    db.commit()
    
    return {"message": "Theme updated", "theme": theme}
