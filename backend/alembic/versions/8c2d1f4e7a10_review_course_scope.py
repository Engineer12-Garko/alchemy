"""scope review items by learner course

Revision ID: 8c2d1f4e7a10
Revises: dffe37253d0d
Create Date: 2026-10-15 08:55:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8c2d1f4e7a10"
down_revision: Union[str, Sequence[str], None] = "dffe37253d0d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("review_items") as batch_op:
        batch_op.drop_constraint("uq_review_owner_concept", type_="unique")
    op.create_index(
        "uq_review_owner_course_concept", "review_items",
        ["owner_id", "course_id", "concept"], unique=True,
        postgresql_where=sa.text("course_id IS NOT NULL"),
        sqlite_where=sa.text("course_id IS NOT NULL"),
    )
    op.create_index(
        "uq_review_owner_unscoped_concept", "review_items",
        ["owner_id", "concept"], unique=True,
        postgresql_where=sa.text("course_id IS NULL"),
        sqlite_where=sa.text("course_id IS NULL"),
    )
    with op.batch_alter_table("user_mastery") as batch_op:
        batch_op.create_unique_constraint(
            "uq_mastery_user_course_concept", ["user_id", "course_id", "concept_id"]
        )
    with op.batch_alter_table("misconception_logs") as batch_op:
        batch_op.create_unique_constraint(
            "uq_misconception_user_course_concept_tag",
            ["user_id", "course_id", "concept_id", "misconception_tag"],
        )


def downgrade() -> None:
    with op.batch_alter_table("misconception_logs") as batch_op:
        batch_op.drop_constraint("uq_misconception_user_course_concept_tag", type_="unique")
    with op.batch_alter_table("user_mastery") as batch_op:
        batch_op.drop_constraint("uq_mastery_user_course_concept", type_="unique")
    op.drop_index("uq_review_owner_unscoped_concept", table_name="review_items")
    op.drop_index("uq_review_owner_course_concept", table_name="review_items")
    with op.batch_alter_table("review_items") as batch_op:
        batch_op.create_unique_constraint(
            "uq_review_owner_concept",
            ["owner_id", "concept"],
        )
