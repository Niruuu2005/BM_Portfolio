"""Settings: loads env from repo root, api/, and frontend/ (later files override)."""

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

_REPO_ROOT = Path(__file__).resolve().parents[2]
_API_ROOT = Path(__file__).resolve().parents[1]


def _load_dotenv_files() -> None:
    """Populate os.environ before Settings() so DATABASE_URL can live in root or legacy frontend/.env."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        return

    # Use override=True so values from project .env files win over empty or stale
    # DATABASE_URL in the process environment (common on Windows / IDE-launched shells).
    load_dotenv(_REPO_ROOT / ".env", override=True)
    load_dotenv(_REPO_ROOT / ".env.local", override=True)
    load_dotenv(_API_ROOT / ".env", override=True)
    load_dotenv(_API_ROOT / ".env.local", override=True)
    load_dotenv(_REPO_ROOT / "frontend" / ".env", override=True)
    load_dotenv(_REPO_ROOT / "frontend" / ".env.local", override=True)


_load_dotenv_files()


class Settings(BaseSettings):
    """Env vars: OS environment (after dotenv) + explicit names below."""

    model_config = SettingsConfigDict(
        env_file=None,
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    database_url: str = Field(default="", validation_alias="DATABASE_URL")
    supabase_jwt_secret: str = Field(default="", validation_alias="SUPABASE_JWT_SECRET")
    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        validation_alias="CORS_ORIGINS",
    )
    cors_origin_regex: str = Field(default="", validation_alias="CORS_ORIGIN_REGEX")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def cors_origin_regex_or_none(self) -> str | None:
        value = self.cors_origin_regex.strip()
        return value or None

    @property
    def database_url_normalized(self) -> str:
        """Strip whitespace; ensure sslmode for Supabase hosts when missing."""
        url = self.database_url.strip()
        if not url:
            return ""
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://") :]
        lower = url.lower()
        if "sslmode=" in lower:
            return url
        if "supabase.co" in lower or "pooler.supabase.com" in lower:
            sep = "&" if "?" in url else "?"
            return f"{url}{sep}sslmode=require"
        return url


settings = Settings()
