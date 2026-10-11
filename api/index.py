import sys
from pathlib import Path

# Ensure the backend package is importable when this file runs from the Vercel task root.
# The app package lives under <repo>/backend, not under <repo>/backend/app.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.main import app

__all__ = ["app"]
