"""Apply Alembic migrations for Vercel deployments.

Older deployments may already have a complete schema created by SQLAlchemy's
create_all but lack Alembic's version table. In that case, baseline the schema
at the current migration before proceeding with normal upgrades.
"""

import sys
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import inspect

BACKEND_ROOT = Path(__file__).resolve().parent
REPO_ROOT = BACKEND_ROOT.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app.core.database import Base, engine  # noqa: E402
import app.models  # noqa: E402,F401
import app.modules_dev1.auth.models  # noqa: E402,F401
import app.modules_dev1.learner_model.models  # noqa: E402,F401


def main() -> None:
    config = Config(str(REPO_ROOT / "alembic.ini"))
    with engine.connect() as connection:
        tables = set(inspect(connection).get_table_names())

    expected_tables = set(Base.metadata.tables)
    if "alembic_version" not in tables and expected_tables.issubset(tables):
        command.stamp(config, "head")
    else:
        command.upgrade(config, "head")


if __name__ == "__main__":
    main()
