"""Security utilities for authentication and authorization"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from .config import settings
from .database import get_db
import logging

logger = logging.getLogger("pharmaguard.security")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer token
security = HTTPBearer()

# Rate limiting storage (in-memory for now, use Redis in production)
rate_limit_storage = {}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError as e:
        logger.warning(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Get the current authenticated user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    return {"user_id": user_id, "email": payload.get("email")}


def check_rate_limit(request: Request, max_requests: int = 10, window_seconds: int = 60) -> bool:
    """Simple rate limiting check (use Redis in production)"""
    client_ip = request.client.host
    current_time = datetime.utcnow()
    
    if client_ip not in rate_limit_storage:
        rate_limit_storage[client_ip] = []
    
    # Clean old requests
    rate_limit_storage[client_ip] = [
        req_time for req_time in rate_limit_storage[client_ip]
        if (current_time - req_time).total_seconds() < window_seconds
    ]
    
    # Check limit
    if len(rate_limit_storage[client_ip]) >= max_requests:
        return False
    
    # Add current request
    rate_limit_storage[client_ip].append(current_time)
    return True


async def rate_limit_dependency(request: Request):
    """Rate limiting dependency for FastAPI routes"""
    if not check_rate_limit(request, max_requests=10, window_seconds=60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later."
        )


def sanitize_patient_id(patient_id: str) -> str:
    """Sanitize patient ID for logging (hash it)"""
    import hashlib
    return hashlib.sha256(patient_id.encode()).hexdigest()[:16]
