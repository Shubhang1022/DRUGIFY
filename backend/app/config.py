from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union
import os
import secrets


class Settings(BaseSettings):
    # Application
    app_name: str = "PharmaGuard Clinical Insights"
    environment: str = "development"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./pharmaguard.db"
    
    # Security
    secret_key: str = secrets.token_urlsafe(32)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS - can be a string (comma-separated) or list
    cors_origins: Union[str, List[str]] = "http://localhost:8080,http://localhost:5173"
    
    # Rate Limiting
    rate_limit_requests: int = 10
    rate_limit_window: int = 60  # seconds
    
    # File Upload
    max_upload_size: int = 5 * 1024 * 1024  # 5MB
    allowed_file_types: List[str] = [".vcf"]
    
    # Logging
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )

    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            # Split by comma and strip whitespace
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    @field_validator('debug', mode='before')
    @classmethod
    def parse_debug(cls, v):
        """Parse debug boolean from string"""
        if isinstance(v, str):
            return v.lower() in ('true', '1', 'yes')
        return v


settings = Settings()

# Validate production settings
if settings.environment == "production":
    if settings.secret_key == secrets.token_urlsafe(32):
        raise ValueError("SECRET_KEY must be set in production environment")
    if settings.debug:
        raise ValueError("DEBUG must be False in production environment")
