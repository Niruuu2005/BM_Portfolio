import uuid
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from sqlalchemy import desc, nullslast
from sqlalchemy.orm import Session

from app.deps import assert_table_access, get_admin_row, require_super, require_teaching_or_super
from app.db import get_db
from app.models import (
    Activity,
    AdminRole,
    AppAdmin,
    Assessment,
    Award,
    Copyright,
    Course,
    Education,
    Experience,
    Membership,
    Patent,
    Profile,
    Program,
    ProjectArtifact,
    ProjectGuided,
    Publication,
    ResearchArea,
    ResearchGrant,
    StudyMaterial,
    SubjectTaught,
)
from app.serialize import row_to_dict

router = APIRouter()

CRUD_TABLES: dict[str, type] = {
    "education": Education,
    "experience": Experience,
    "research_areas": ResearchArea,
    "awards": Award,
    "research_grants": ResearchGrant,
    "publications": Publication,
    "patents": Patent,
    "copyrights": Copyright,
    "subjects_taught": SubjectTaught,
    "programs": Program,
    "courses": Course,
    "study_materials": StudyMaterial,
    "projects_guided": ProjectGuided,
    "project_artifacts": ProjectArtifact,
    "assessments": Assessment,
    "activities": Activity,
    "memberships": Membership,
    "admin_roles": AdminRole,
}


def _admin_order(query, model: type, table_key: str):
    if table_key == "education":
        return query.order_by(model.sort_order.asc())
    if table_key == "experience":
        return query.order_by(desc(model.start_date))
    if table_key == "research_areas":
        return query.order_by(desc(model.created_at))
    if table_key == "awards":
        return query.order_by(desc(model.year))
    if table_key == "research_grants":
        return query.order_by(nullslast(desc(model.start_date)))
    if table_key == "publications":
        return query.order_by(nullslast(desc(model.year)))
    if table_key == "patents":
        return query.order_by(desc(model.created_at))
    if table_key == "copyrights":
        return query.order_by(nullslast(desc(model.year)))
    if table_key == "activities":
        return query.order_by(desc(model.year))
    if table_key == "memberships":
        return query.order_by(desc(model.year_joined))
    if table_key == "subjects_taught":
        return query.order_by(desc(model.created_at))
    if table_key == "study_materials":
        return query.order_by(desc(model.created_at))
    if table_key in ("programs", "courses", "assessments", "project_artifacts"):
        return query.order_by(model.sort_order.asc())
    if table_key == "projects_guided":
        return query.order_by(nullslast(desc(model.year)))
    if table_key == "admin_roles":
        return query.order_by(nullslast(desc(model.year_from)))
    return query.order_by(desc(model.created_at))


def _filter_body(model: type, body: dict) -> dict:
    cols = {c.name for c in model.__table__.columns}
    skip = {"id", "created_at", "updated_at"}
    out: dict[str, Any] = {}
    for k, v in body.items():
        if k not in cols or k in skip:
            continue
        if v == "" and k not in ("degree", "title", "name", "role", "organization", "subject_name"):
            continue
        col = model.__table__.columns.get(k)
        if col is not None and "UUID" in str(col.type) and isinstance(v, str):
            try:
                v = uuid.UUID(v)
            except ValueError:
                continue
        out[k] = v
    return out


@router.get("/me")
def admin_me(admin: AppAdmin = Depends(get_admin_row)):
    return {"user_id": str(admin.user_id), "role": admin.role}


@router.get("/profile")
def admin_get_profile(
    db: Session = Depends(get_db),
    _: AppAdmin = Depends(require_super),
):
    p = db.query(Profile).first()
    if not p:
        raise HTTPException(404)
    return row_to_dict(p)


@router.put("/profile")
def admin_put_profile(
    body: dict = Body(...),
    db: Session = Depends(get_db),
    _: AppAdmin = Depends(require_super),
):
    p = db.query(Profile).first()
    if not p:
        raise HTTPException(404)
    for k, v in _filter_body(Profile, body).items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return row_to_dict(p)


@router.get("/stats/counts")
def admin_stats_counts(
    db: Session = Depends(get_db),
    _: AppAdmin = Depends(require_super),
):
    keys = [
        ("publications", Publication),
        ("patents", Patent),
        ("education", Education),
        ("experience", Experience),
        ("awards", Award),
        ("activities", Activity),
        ("research_grants", ResearchGrant),
        ("projects_guided", ProjectGuided),
        ("copyrights", Copyright),
        ("research_areas", ResearchArea),
    ]
    return {name: db.query(model).count() for name, model in keys}


@router.get("/subjects_taught/options")
def admin_subject_options(
    db: Session = Depends(get_db),
    _: AppAdmin = Depends(require_teaching_or_super),
):
    rows = db.query(SubjectTaught).order_by(SubjectTaught.subject_name.asc()).all()
    return [{"id": str(r.id), "subject_name": r.subject_name} for r in rows]


@router.get("/data/{table_key}")
def admin_list(
    table_key: str,
    db: Session = Depends(get_db),
    admin: AppAdmin = Depends(get_admin_row),
    activity_type: str | None = Query(None),
    pub_type: str | None = Query(None),
):
    model = CRUD_TABLES.get(table_key)
    if not model:
        raise HTTPException(404, "Unknown table")
    assert_table_access(admin, table_key)
    q = db.query(model)
    if table_key == "activities" and activity_type:
        q = q.filter(Activity.activity_type == activity_type)
    if table_key == "publications" and pub_type:
        q = q.filter(Publication.pub_type == pub_type)
    q = _admin_order(q, model, table_key)
    return [row_to_dict(r) for r in q.all()]


@router.post("/data/{table_key}")
def admin_create(
    table_key: str,
    body: dict = Body(...),
    db: Session = Depends(get_db),
    admin: AppAdmin = Depends(get_admin_row),
):
    model = CRUD_TABLES.get(table_key)
    if not model:
        raise HTTPException(404, "Unknown table")
    assert_table_access(admin, table_key)
    data = _filter_body(model, body)
    obj = model(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return row_to_dict(obj)


@router.put("/data/{table_key}/{row_id}")
def admin_update(
    table_key: str,
    row_id: uuid.UUID,
    body: dict = Body(...),
    db: Session = Depends(get_db),
    admin: AppAdmin = Depends(get_admin_row),
):
    model = CRUD_TABLES.get(table_key)
    if not model:
        raise HTTPException(404, "Unknown table")
    assert_table_access(admin, table_key)
    obj = db.query(model).filter(model.id == row_id).first()
    if not obj:
        raise HTTPException(404)
    for k, v in _filter_body(model, body).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return row_to_dict(obj)


@router.delete("/data/{table_key}/{row_id}")
def admin_delete(
    table_key: str,
    row_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: AppAdmin = Depends(get_admin_row),
):
    model = CRUD_TABLES.get(table_key)
    if not model:
        raise HTTPException(404, "Unknown table")
    assert_table_access(admin, table_key)
    obj = db.query(model).filter(model.id == row_id).first()
    if not obj:
        raise HTTPException(404)
    db.delete(obj)
    db.commit()
    return {"ok": True}


@router.patch("/data/{table_key}/{row_id}/visibility")
def admin_toggle_visibility(
    table_key: str,
    row_id: uuid.UUID,
    body: dict = Body(...),
    db: Session = Depends(get_db),
    admin: AppAdmin = Depends(get_admin_row),
):
    model = CRUD_TABLES.get(table_key)
    if not model or not hasattr(model, "is_visible"):
        raise HTTPException(404, "Unknown table or no visibility")
    assert_table_access(admin, table_key)
    obj = db.query(model).filter(model.id == row_id).first()
    if not obj:
        raise HTTPException(404)
    if "is_visible" not in body:
        raise HTTPException(400, "is_visible required")
    obj.is_visible = bool(body["is_visible"])
    db.commit()
    db.refresh(obj)
    return row_to_dict(obj)
