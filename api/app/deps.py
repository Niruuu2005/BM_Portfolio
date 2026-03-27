import uuid

import jwt
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import AppAdmin


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


def require_admin(
    authorization: str | None = Header(None, alias="Authorization"),
    db: Session = Depends(get_db),
) -> uuid.UUID:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else authorization.strip()
    uid = decode_sub_from_token(token)
    row = db.query(AppAdmin).filter(AppAdmin.user_id == uid).first()
    if not row:
        raise HTTPException(status_code=403, detail="User is not in app_admins")
    return uid
