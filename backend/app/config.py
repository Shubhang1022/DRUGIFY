from pydantic_settings import BaseSettings
from typing import List
import os
import secrets


class Settings(BaseSettings):
    # Application
    app_name: str = "PharmaGuard Clinical Insights"
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./pharmaguard.db")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://[::1]:8080",
        "http://[::1]:8081",
        "http://[::1]:5173",
        "http://[::1]:3000",
    ]
    
    # Rate Limiting
    rate_limit_requests: int = 10
    rate_limit_window: int = 60  # seconds
    
    # File Upload
    max_upload_size: int = 5 * 1024 * 1024  # 5MB
    allowed_file_types: List[str] = [".vcf"]
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# Validate production settings
if settings.environment == "production":
    if settings.secret_key == secrets.token_urlsafe(32):
        raise ValueError("SECRET_KEY must be set in production environment")
    if settings.debug:
        raise ValueError("DEBUG must be False in production environment")
