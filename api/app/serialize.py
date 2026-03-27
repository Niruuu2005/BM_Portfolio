import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy.inspection import inspect


def row_to_dict(obj: Any) -> dict:
    out: dict = {}
    for col in inspect(obj).mapper.column_attrs:
        v = getattr(obj, col.key)
        if isinstance(v, uuid.UUID):
            v = str(v)
        elif isinstance(v, datetime):
            v = v.isoformat()
        elif isinstance(v, date):
            v = v.isoformat()
        elif isinstance(v, Decimal):
            v = float(v)
        out[col.key] = v
    return out
