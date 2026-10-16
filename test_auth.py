"""Isolated end-to-end smoke tests for the HTTP authentication workflow."""

import os
import sys
import tempfile
from pathlib import Path
from uuid import uuid4

REPO_ROOT = Path(__file__).resolve().parent
BACKEND_ROOT = REPO_ROOT / "backend"
sys.path.insert(0, str(BACKEND_ROOT))

# Set these before importing the app so tests never touch a developer or
# production database, even when those environment variables are already set.
_db_fd, _db_path = tempfile.mkstemp(prefix="alchemy-auth-", suffix=".db")
os.close(_db_fd)
os.environ["DATABASE_URL"] = f"sqlite:///{_db_path.replace(os.sep, '/') }"
os.environ["APP_ENV"] = "development"
os.environ["AUTH_ENABLED"] = "true"
os.environ["JWT_SECRET"] = "isolated-auth-test-secret-at-least-32-chars"
os.environ.pop("VERCEL", None)

from fastapi.testclient import TestClient  # noqa: E402
from app.main import app  # noqa: E402
from app.core.database import engine  # noqa: E402


def main() -> int:
    client = TestClient(app)
    suffix = uuid4().hex
    email = f"auth-test-{suffix}@example.com"
    password = "correct-horse-battery-staple"
    try:
        route_keys = [
            (method, route.path)
            for route in app.routes
            if hasattr(route, "methods")
            for method in (route.methods or set())
            if method not in {"HEAD", "OPTIONS"}
        ]
        duplicates = sorted({key for key in route_keys if route_keys.count(key) > 1})
        assert not duplicates, f"Duplicate method/path routes: {duplicates}"

        response = client.get("/api/auth/me")
        assert response.status_code == 401, response.text

        response = client.post(
            "/api/auth/register",
            json={"email": email, "password": password, "display_name": "Test Learner"},
        )
        assert response.status_code == 201, response.text
        registered = response.json()
        assert registered["access_token"]
        assert registered["user"]["email"] == email

        duplicate = client.post(
            "/api/auth/register",
            json={"email": email, "password": password, "display_name": "Test Learner"},
        )
        assert duplicate.status_code == 409, duplicate.text

        login = client.post("/api/auth/login", json={"email": email, "password": password})
        assert login.status_code == 200, login.text
        token = login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        me = client.get("/api/auth/me", headers=headers)
        assert me.status_code == 200, me.text
        assert me.json()["id"] == registered["user"]["id"]

        invalid_login = client.post(
            "/api/auth/login", json={"email": email, "password": "wrong-password"}
        )
        assert invalid_login.status_code == 401, invalid_login.text

        sample = client.get("/api/quizzes/sample", headers=headers)
        assert sample.status_code == 200, sample.text
        grade = client.post(
            "/api/quizzes/grade",
            headers=headers,
            json={"question_id": sample.json()["id"], "answer": "2", "work": ""},
        )
        assert grade.status_code == 200, grade.text
        assert grade.json()["correct"] is True
        assert grade.json()["score"] == 100
        assert grade.json()["reasoning_complete"] is None

        # Repeated unscoped review writes must target the same row despite SQL
        # NULL uniqueness semantics.
        grade_again = client.post(
            "/api/quizzes/grade",
            headers=headers,
            json={"question_id": sample.json()["id"], "answer": "2", "work": ""},
        )
        assert grade_again.status_code == 200, grade_again.text
        reviews = client.get("/api/scheduler/reviews", headers=headers)
        assert reviews.status_code == 200, reviews.text
        assert len(reviews.json()) == 1

        print("PASS: auth flow, route uniqueness, optional-work grading, and unscoped review reuse")
        return 0
    finally:
        client.close()
        engine.dispose()
        try:
            os.remove(_db_path)
        except OSError:
            pass


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise
