"""Apply Alembic migrations for Vercel deployments.

Older deployments may already have a complete schema created by SQLAlchemy's
create_all but lack Alembic's version table. Baseline those databases at the
initial schema revision, then run pending migrations normally.
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
    # The root-level alembic.ini is intentionally excluded from Git, so it is
    # absent in clean deployment checkouts. Configure the migration script
    # location directly instead of relying on that local-only file.
    config = Config()
    config.set_main_option("script_location", str(BACKEND_ROOT / "alembic"))
    with engine.connect() as connection:
        tables = set(inspect(connection).get_table_names())

    expected_tables = set(Base.metadata.tables)
    if "alembic_version" not in tables and expected_tables.issubset(tables):
        with engine.connect() as connection:
            inspector = inspect(connection)
            review_constraints = {
                item.get("name") for item in inspector.get_unique_constraints("review_items")
            }
            review_indexes = {
                item.get("name") for item in inspector.get_indexes("review_items")
            }
            mastery_constraints = {
                item.get("name") for item in inspector.get_unique_constraints("user_mastery")
            }
            misconception_constraints = {
                item.get("name") for item in inspector.get_unique_constraints("misconception_logs")
            }

        scoped_indexes = {
            "uq_review_owner_course_concept", "uq_review_owner_unscoped_concept"
        }
        if (
            scoped_indexes.issubset(review_indexes)
            and "uq_mastery_user_course_concept" in mastery_constraints
            and "uq_misconception_user_course_concept_tag" in misconception_constraints
        ):
            command.stamp(config, "head")
            return

        if "uq_review_owner_concept" not in review_constraints:
            raise RuntimeError(
                "Database has no Alembic version and does not match a known schema; refusing to stamp it."
            )

        command.stamp(config, "dffe37253d0d")

    command.upgrade(config, "head")


if __name__ == "__main__":
    main()
