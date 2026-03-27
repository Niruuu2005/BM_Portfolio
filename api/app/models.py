import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class AppAdmin(Base):
    __tablename__ = "app_admins"

    user_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    role: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'editor'"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name: Mapped[Optional[str]] = mapped_column(Text)
    designation: Mapped[Optional[str]] = mapped_column(Text)
    department: Mapped[Optional[str]] = mapped_column(Text)
    institution: Mapped[Optional[str]] = mapped_column(Text)
    institution_url: Mapped[Optional[str]] = mapped_column(Text)
    institution_logo_url: Mapped[Optional[str]] = mapped_column(Text)
    email: Mapped[Optional[str]] = mapped_column(Text)
    phone: Mapped[Optional[str]] = mapped_column(Text)
    address: Mapped[Optional[str]] = mapped_column(Text)
    tagline: Mapped[Optional[str]] = mapped_column(Text)
    bio: Mapped[Optional[str]] = mapped_column(Text)
    career_obj: Mapped[Optional[str]] = mapped_column(Text)
    photo_url: Mapped[Optional[str]] = mapped_column(Text)
    cv_url: Mapped[Optional[str]] = mapped_column(Text)
    scholar_url: Mapped[Optional[str]] = mapped_column(Text)
    scopus_url: Mapped[Optional[str]] = mapped_column(Text)
    orcid_url: Mapped[Optional[str]] = mapped_column(Text)
    wos_url: Mapped[Optional[str]] = mapped_column(Text)
    researchgate_url: Mapped[Optional[str]] = mapped_column(Text)
    publons_url: Mapped[Optional[str]] = mapped_column(Text)
    linkedin_url: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Education(Base):
    __tablename__ = "education"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    degree: Mapped[str] = mapped_column(Text, nullable=False)
    field_of_study: Mapped[Optional[str]] = mapped_column(Text)
    institution: Mapped[Optional[str]] = mapped_column(Text)
    university: Mapped[Optional[str]] = mapped_column(Text)
    start_year: Mapped[Optional[int]] = mapped_column(Integer)
    end_year: Mapped[Optional[int]] = mapped_column(Integer)
    grade: Mapped[Optional[str]] = mapped_column(Text)
    is_pursuing: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    role: Mapped[str] = mapped_column(Text, nullable=False)
    organization: Mapped[str] = mapped_column(Text, nullable=False)
    department: Mapped[Optional[str]] = mapped_column(Text)
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    responsibilities: Mapped[Optional[dict]] = mapped_column(JSONB)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class ResearchArea(Base):
    __tablename__ = "research_areas"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[Optional[str]] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Award(Base):
    __tablename__ = "awards"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    awarding_body: Mapped[Optional[str]] = mapped_column(Text)
    award_type: Mapped[Optional[str]] = mapped_column(Text)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class ResearchGrant(Base):
    __tablename__ = "research_grants"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    funding_agency: Mapped[Optional[str]] = mapped_column(Text)
    amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2))
    status: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'ongoing'"))
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Publication(Base):
    __tablename__ = "publications"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    pub_type: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'journal'"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    authors: Mapped[Optional[str]] = mapped_column(Text)
    journal_name: Mapped[Optional[str]] = mapped_column(Text)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    volume: Mapped[Optional[str]] = mapped_column(Text)
    issue: Mapped[Optional[str]] = mapped_column(Text)
    pages: Mapped[Optional[str]] = mapped_column(Text)
    doi: Mapped[Optional[str]] = mapped_column(Text)
    url: Mapped[Optional[str]] = mapped_column(Text)
    publisher: Mapped[Optional[str]] = mapped_column(Text)
    indexing: Mapped[Optional[str]] = mapped_column(Text)
    impact_factor: Mapped[Optional[Decimal]] = mapped_column(Numeric(6, 3))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Patent(Base):
    __tablename__ = "patents"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    inventors: Mapped[Optional[str]] = mapped_column(Text)
    application_number: Mapped[Optional[str]] = mapped_column(Text)
    patent_number: Mapped[Optional[str]] = mapped_column(Text)
    filing_date: Mapped[Optional[date]] = mapped_column(Date)
    grant_date: Mapped[Optional[date]] = mapped_column(Date)
    status: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'filed'"))
    country: Mapped[Optional[str]] = mapped_column(Text, server_default=text("'India'"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Copyright(Base):
    __tablename__ = "copyrights"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    authors: Mapped[Optional[str]] = mapped_column(Text)
    registration_number: Mapped[Optional[str]] = mapped_column(Text)
    registration_date: Mapped[Optional[date]] = mapped_column(Date)
    work_type: Mapped[Optional[str]] = mapped_column(Text)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class SubjectTaught(Base):
    __tablename__ = "subjects_taught"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    subject_name: Mapped[str] = mapped_column(Text, nullable=False)
    subject_code: Mapped[Optional[str]] = mapped_column(Text)
    level: Mapped[Optional[str]] = mapped_column(Text)
    year_from: Mapped[Optional[int]] = mapped_column(Integer)
    year_to: Mapped[Optional[int]] = mapped_column(Integer)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(Text, nullable=False)
    level: Mapped[Optional[str]] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    program_id: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("programs.id", ondelete="SET NULL"))
    code: Mapped[Optional[str]] = mapped_column(Text)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    credits: Mapped[Optional[Decimal]] = mapped_column(Numeric(4, 1))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    subject: Mapped[Optional[str]] = mapped_column(Text)
    subject_id: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("subjects_taught.id", ondelete="SET NULL"))
    description: Mapped[Optional[str]] = mapped_column(Text)
    material_type: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'notes'"))
    file_url: Mapped[Optional[str]] = mapped_column(Text)
    external_url: Mapped[Optional[str]] = mapped_column(Text)
    academic_term: Mapped[Optional[str]] = mapped_column(Text)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class ProjectGuided(Base):
    __tablename__ = "projects_guided"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    students: Mapped[Optional[str]] = mapped_column(Text)
    level: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'UG'"))
    year: Mapped[Optional[int]] = mapped_column(Integer)
    description: Mapped[Optional[str]] = mapped_column(Text)
    technologies: Mapped[Optional[str]] = mapped_column(Text)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class ProjectArtifact(Base):
    __tablename__ = "project_artifacts"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    project_id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("projects_guided.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    artifact_type: Mapped[Optional[str]] = mapped_column(Text)
    file_url: Mapped[Optional[str]] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title: Mapped[str] = mapped_column(Text, nullable=False)
    assessment_type: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'assignment'"))
    course_id: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("courses.id", ondelete="SET NULL"))
    subject_hint: Mapped[Optional[str]] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    file_url: Mapped[Optional[str]] = mapped_column(Text)
    external_url: Mapped[Optional[str]] = mapped_column(Text)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    activity_type: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    organizer: Mapped[Optional[str]] = mapped_column(Text)
    venue: Mapped[Optional[str]] = mapped_column(Text)
    year: Mapped[Optional[int]] = mapped_column(Integer)
    duration: Mapped[Optional[str]] = mapped_column(Text)
    role: Mapped[Optional[str]] = mapped_column(Text)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class Membership(Base):
    __tablename__ = "memberships"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    organization: Mapped[str] = mapped_column(Text, nullable=False)
    membership_type: Mapped[Optional[str]] = mapped_column(Text)
    membership_id: Mapped[Optional[str]] = mapped_column(Text)
    year_joined: Mapped[Optional[int]] = mapped_column(Integer)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))


class AdminRole(Base):
    __tablename__ = "admin_roles"

    id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    role: Mapped[str] = mapped_column(Text, nullable=False)
    scope: Mapped[Optional[str]] = mapped_column(Text)
    institution: Mapped[Optional[str]] = mapped_column(Text)
    year_from: Mapped[Optional[int]] = mapped_column(Integer)
    year_to: Mapped[Optional[int]] = mapped_column(Integer)
    is_visible: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("now()"))
