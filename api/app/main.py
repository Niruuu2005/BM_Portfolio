import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.db import SessionLocal
from app.routers import admin, health, public

logger = logging.getLogger("uvicorn.error")

app = FastAPI(
    title="BM Portfolio API",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=settings.cors_origin_regex_or_none,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def _warn_if_no_database() -> None:
    if not settings.database_url.strip() or SessionLocal is None:
        logger.warning(
            "DATABASE_URL is not set or invalid. Copy .env.example to the repo root `.env` "
            "and set DATABASE_URL (Supabase → Project Settings → Database). "
            "Public and admin routes that need Postgres will return 503 until then."
        )


# Full paths (local proxy + Vercel Services as documented).
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(public.router, prefix="/api/public", tags=["public"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
# Same routes without /api prefix if the host strips routePrefix (defensive).
app.include_router(health.router, prefix="", tags=["health"], include_in_schema=False)
app.include_router(public.router, prefix="/public", tags=["public"], include_in_schema=False)
app.include_router(admin.router, prefix="/admin", tags=["admin"], include_in_schema=False)


@app.get("/")
def root():
    return {"service": "bm-portfolio-api", "docs": "/api/docs"}


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(_request, exc: SQLAlchemyError):
    """Avoid opaque 500s when DB is down or schema mismatches."""
    return JSONResponse(
        status_code=503,
        content={
            "detail": (
                "Database error. Set DATABASE_URL in the repo root `.env` and ensure "
                "migrations in docs/sql are applied. "
                f"({exc.__class__.__name__})"
            ),
        },
    )
