from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import admin, health, public

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
