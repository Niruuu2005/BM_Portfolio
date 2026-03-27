from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    pass


def _build_engine():
    url = settings.database_url_normalized
    if not url:
        return None
    return create_engine(
        url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine is not None else None


def get_db():
    from fastapi import HTTPException

    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Database not configured. Set DATABASE_URL in the repository root `.env` "
                "(or `frontend/.env` / `api/.env`). Copy from `.env.example`. "
                "Use the Postgres connection string from Supabase → Project Settings → Database."
            ),
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
