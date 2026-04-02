from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import LoginRequest, TokenResponse
from services.auth_service import AuthService, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService(db).authenticate(
        credentials.username.strip(),
        credentials.password,
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token(subject=user.username)
    return TokenResponse(access_token=token, token_type="bearer")
