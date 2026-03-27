import uuid

import jwt
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import AppAdmin


EDITOR_TABLES = frozenset({"subjects_taught", "study_materials", "projects_guided"})


def decode_sub_from_token(token: str) -> uuid.UUID:
    if not settings.supabase_jwt_secret:
        raise HTTPException(503, "Server JWT secret not configured")
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token: no sub")
        return uuid.UUID(sub)
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e!s}") from e


def _bearer_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    return authorization[7:].strip()


def get_admin_row(
    authorization: str | None = Header(None, alias="Authorization"),
    db: Session = Depends(get_db),
) -> AppAdmin:
    token = _bearer_token(authorization)
    uid = decode_sub_from_token(token)
    row = db.query(AppAdmin).filter(AppAdmin.user_id == uid).first()
    if not row:
        raise HTTPException(status_code=403, detail="User is not in app_admins")
    return row


def require_super(
    admin: AppAdmin = Depends(get_admin_row),
) -> AppAdmin:
    if admin.role != "super":
        raise HTTPException(status_code=403, detail="Super admin only")
    return admin


def require_teaching_or_super(
    admin: AppAdmin = Depends(get_admin_row),
) -> AppAdmin:
    """Any row in app_admins (super or editor)."""
    return admin


def assert_table_access(admin: AppAdmin, table_key: str) -> None:
    if admin.role == "super":
        return
    if admin.role == "editor" and table_key in EDITOR_TABLES:
        return
    raise HTTPException(status_code=403, detail="Not allowed to access this resource")


# Backwards-compatible name: returns user id only (use get_admin_row when role matters)
def require_admin(
    admin: AppAdmin = Depends(get_admin_row),
) -> uuid.UUID:
    return admin.user_id
