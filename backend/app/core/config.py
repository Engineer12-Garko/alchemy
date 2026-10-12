import os
from functools import lru_cache
from pathlib import Path
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# Resolve .env file path: prefer directory where this module lives, then project root
_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    app_env: str = "development"
    # Temporary prototype mode: all visitors share one workspace without signing in.
    auth_enabled: bool = False
    database_url: str = "sqlite:///./alchemy_local.db"
    jwt_secret: str = "development-only-change-me"
    jwt_expire_minutes: int = 60 * 24 * 7
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    # OpenAI configuration
    openai_base_url: str = ""
    openai_api_key: str = ""
    openai_model: str = ""
    openai_transcription_model: str = ""
    # Gemini configuration (alternative AI provider)
    gemini_api_key: str = ""
    gemini_model: str = ""
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    max_upload_mb: int = 20

    model_config = SettingsConfigDict(env_file=str(_ENV_PATH), env_file_encoding="utf-8", extra="ignore")

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production" or os.environ.get("VERCEL") == "1"

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.is_production and self.auth_enabled and self.jwt_secret == "development-only-change-me":
            raise ValueError("JWT_SECRET must be set to a secure value in production")
        if self.is_production and not self.database_url.startswith(("postgres://", "postgresql://", "postgresql+psycopg://")):
            raise ValueError("DATABASE_URL must use a persistent PostgreSQL database in production")
        if self.jwt_expire_minutes < 1:
            raise ValueError("JWT_EXPIRE_MINUTES must be at least 1")
        if self.max_upload_mb < 1:
            raise ValueError("MAX_UPLOAD_MB must be at least 1")
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
