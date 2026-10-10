from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite:///./synapse.db"
    jwt_secret: str = "development-only-change-me"
    jwt_expire_minutes: int = 60 * 24 * 7
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    openai_base_url: str = ""
    openai_api_key: str = ""
    openai_model: str = ""
    openai_transcription_model: str = ""
    max_upload_mb: int = 20

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.app_env.lower() == "production" and self.jwt_secret == "development-only-change-me":
            raise ValueError("JWT_SECRET must be set to a secure value in production")
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
