from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_REPO_ROOT = Path(__file__).resolve().parents[2]
_API_ROOT = Path(__file__).resolve().parents[1]

_ENV_FILE_CANDIDATES = (
    _REPO_ROOT / ".env",
    _REPO_ROOT / ".env.local",
    _API_ROOT / ".env",
)
_ENV_FILES = tuple(str(p) for p in _ENV_FILE_CANDIDATES if p.is_file())


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILES if _ENV_FILES else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = ""
    supabase_jwt_secret: str = ""
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    cors_origin_regex: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def cors_origin_regex_or_none(self) -> str | None:
        value = self.cors_origin_regex.strip()
        return value or None


settings = Settings()
