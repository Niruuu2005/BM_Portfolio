from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, nullslast
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import (
    Activity,
    AdminRole,
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


@router.get("/profile")
def public_profile(db: Session = Depends(get_db)):
    p = db.query(Profile).first()
    if not p:
        return None
    return row_to_dict(p)


@router.get("/education")
def public_education(db: Session = Depends(get_db)):
    q = db.query(Education).filter(Education.is_visible == True).order_by(Education.sort_order.asc())
    return [row_to_dict(r) for r in q.all()]


@router.get("/experience")
def public_experience(db: Session = Depends(get_db)):
    q = db.query(Experience).filter(Experience.is_visible == True).order_by(Experience.sort_order.asc())
    return [row_to_dict(r) for r in q.all()]


@router.get("/research_areas")
def public_research_areas(db: Session = Depends(get_db)):
    q = db.query(ResearchArea).filter(ResearchArea.is_visible == True).order_by(ResearchArea.sort_order.asc())
    return [row_to_dict(r) for r in q.all()]


@router.get("/awards")
def public_awards(db: Session = Depends(get_db)):
    q = db.query(Award).filter(Award.is_visible == True).order_by(desc(Award.year))
    return [row_to_dict(r) for r in q.all()]


@router.get("/research_grants")
def public_grants(db: Session = Depends(get_db)):
    q = (
        db.query(ResearchGrant)
        .filter(ResearchGrant.is_visible == True)
        .order_by(nullslast(desc(ResearchGrant.start_date)))
    )
    return [row_to_dict(r) for r in q.all()]


@router.get("/publications")
def public_publications(
    pub_type: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Publication).filter(Publication.is_visible == True)
    if pub_type:
        q = q.filter(Publication.pub_type == pub_type)
    q = q.order_by(nullslast(desc(Publication.year)))
    return [row_to_dict(r) for r in q.all()]


@router.get("/patents")
def public_patents(db: Session = Depends(get_db)):
    q = db.query(Patent).filter(Patent.is_visible == True).order_by(desc(Patent.created_at))
    return [row_to_dict(r) for r in q.all()]


@router.get("/copyrights")
def public_copyrights(db: Session = Depends(get_db)):
    q = db.query(Copyright).filter(Copyright.is_visible == True).order_by(nullslast(desc(Copyright.year)))
    return [row_to_dict(r) for r in q.all()]


@router.get("/activities")
def public_activities(db: Session = Depends(get_db)):
    q = db.query(Activity).filter(Activity.is_visible == True).order_by(desc(Activity.year))
    return [row_to_dict(r) for r in q.all()]


@router.get("/memberships")
def public_memberships(db: Session = Depends(get_db)):
    q = db.query(Membership).filter(Membership.is_visible == True).order_by(desc(Membership.year_joined))
    return [row_to_dict(r) for r in q.all()]


@router.get("/subjects_taught")
def public_subjects(db: Session = Depends(get_db)):
    q = db.query(SubjectTaught).filter(SubjectTaught.is_visible == True).order_by(SubjectTaught.level.asc())
    return [row_to_dict(r) for r in q.all()]


@router.get("/study_materials")
def public_study_materials(db: Session = Depends(get_db)):
    q = (
        db.query(StudyMaterial)
        .filter(StudyMaterial.is_visible == True)
        .order_by(StudyMaterial.sort_order.asc())
    )
    return [row_to_dict(r) for r in q.all()]


@router.get("/projects_guided")
def public_projects(db: Session = Depends(get_db)):
    q = db.query(ProjectGuided).filter(ProjectGuided.is_visible == True).order_by(desc(ProjectGuided.year))
    return [row_to_dict(r) for r in q.all()]


@router.get("/admin_roles")
def public_admin_roles(db: Session = Depends(get_db)):
    q = db.query(AdminRole).filter(AdminRole.is_visible == True).order_by(desc(AdminRole.year_from))
    return [row_to_dict(r) for r in q.all()]


@router.get("/assessments")
def public_assessments(db: Session = Depends(get_db)):
    q = (
        db.query(Assessment)
        .filter(Assessment.is_visible == True)
        .order_by(Assessment.sort_order.asc())
    )
    return [row_to_dict(r) for r in q.all()]


@router.get("/programs")
def public_programs(db: Session = Depends(get_db)):
    q = db.query(Program).filter(Program.is_visible == True).order_by(Program.sort_order.asc())
    return [row_to_dict(r) for r in q.all()]


@router.get("/courses")
def public_courses(db: Session = Depends(get_db)):
    q = db.query(Course).filter(Course.is_visible == True).order_by(Course.sort_order.asc())
    return [row_to_dict(r) for r in q.all()]


@router.get("/project_artifacts")
def public_artifacts(db: Session = Depends(get_db)):
    q = (
        db.query(ProjectArtifact)
        .filter(ProjectArtifact.is_visible == True)
        .order_by(ProjectArtifact.sort_order.asc())
    )
    return [row_to_dict(r) for r in q.all()]
