from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    pass


if not settings.database_url:
    engine = None
    SessionLocal = None
else:
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not set")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
