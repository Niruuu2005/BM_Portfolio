from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import admin, health, public

app = FastAPI(title="BM Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(public.router, prefix="/api/public", tags=["public"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])


@app.get("/")
def root():
    return {"service": "bm-portfolio-api", "docs": "/docs"}
