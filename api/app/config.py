from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

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
